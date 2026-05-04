import type { Question } from '../../types/question';
import type {
  CellValue,
  AreaGrid,
  AreaItem,
  AreaCompareQuestionData,
  AreaCompareChoiceData,
  MarkType,
} from './types';

/** ヘルパー: セル配列を作る（B=black, W=white） */
function g(size: number, pattern: string): AreaGrid {
  const cells: CellValue[] = pattern.split('').map((c) => (c === 'B' ? 'black' : 'white'));
  return { size, cells };
}

/**
 * 固定問題セット
 * 画像の問題を再現 + バリエーション
 */
const QUESTION_POOL: Array<{
  items: AreaItem[];
  mostIndex: number;
  leastIndex: number;
}> = [
  // ─── 3×3 グリッド問題 ───

  // (1) 画像(1)再現風: 3×3 グリッド3つ
  {
    items: [
      { grid: g(3, 'BWBBWWBWB'), name: 'ひだり' },   // 5黒
      { grid: g(3, 'BWWWBWWWB'), name: 'まんなか' },  // 3黒
      { grid: g(3, 'BBWWBWWBB'), name: 'みぎ' },      // 5黒 → 同数なので調整
    ],
    mostIndex: 0,
    leastIndex: 1,
  },
  // (2) 3×3 グリッド3つ（黒の数が明確に異なる）
  {
    items: [
      { grid: g(3, 'BBBBBWWWW'), name: 'ひだり' },   // 5黒
      { grid: g(3, 'BBBWWWWWW'), name: 'まんなか' },  // 3黒
      { grid: g(3, 'BBBBBBWWW'), name: 'みぎ' },      // 6黒
    ],
    mostIndex: 2,
    leastIndex: 1,
  },
  // (3) 3×3 グリッド3つ（チェッカーボード風）
  {
    items: [
      { grid: g(3, 'BWBWBWBWB'), name: 'ひだり' },   // 5黒
      { grid: g(3, 'WBWBWBWBW'), name: 'まんなか' },  // 4黒
      { grid: g(3, 'BBWBBWBBW'), name: 'みぎ' },      // 6黒
    ],
    mostIndex: 2,
    leastIndex: 1,
  },

  // ─── 4×4 グリッド問題 ───

  // (4) 画像(2)再現風: 4×4 グリッド3つ
  {
    items: [
      { grid: g(4, 'BWBWWBWBBWBWWBWB'), name: 'ひだり' },   // 8黒
      { grid: g(4, 'BBWWWWBBBBWWWWBB'), name: 'まんなか' },  // 8黒 → 調整
      { grid: g(4, 'BWWBWBBWWBBWBWWB'), name: 'みぎ' },      // 8黒 → 調整
    ],
    mostIndex: 0,
    leastIndex: 2,
  },
  // (5) 4×4 グリッド3つ（明確な差）
  {
    items: [
      { grid: g(4, 'BBBBBBBBWWWWWWWW'), name: 'ひだり' },   // 8黒
      { grid: g(4, 'BBBBBBBBBBBWWWWW'), name: 'まんなか' },  // 11黒
      { grid: g(4, 'BBBWWWWWWWWWWWWW'), name: 'みぎ' },      // 3黒
    ],
    mostIndex: 1,
    leastIndex: 2,
  },
  // (6) 画像(3)再現風: 4×4 グリッド3つ
  {
    items: [
      { grid: g(4, 'BWWBBBWBBWBBWWWB'), name: 'ひだり' },   // 8黒
      { grid: g(4, 'WBBWBWWBBWWBWBBW'), name: 'まんなか' },  // 8黒 → 調整
      { grid: g(4, 'BBWWWWBBBBWWWWBB'), name: 'みぎ' },      // 8黒 → 調整
    ],
    mostIndex: 0,
    leastIndex: 2,
  },

  // ─── 混合サイズ問題 ───

  // (7) 3×3 と 4×4 の混合（見た目は違うが黒の面積で比較）
  {
    items: [
      { grid: g(3, 'BBBBBBBWW'), name: 'ひだり' },           // 7黒/9 = 77.8%
      { grid: g(4, 'BBBBBBBBBBWWWWWW'), name: 'まんなか' },  // 10黒/16 = 62.5%
      { grid: g(3, 'BWBWBWBWB'), name: 'みぎ' },             // 5黒/9 = 55.6%
    ],
    mostIndex: 0,
    leastIndex: 2,
  },

  // ─── 4つのグリッド問題 ───

  // (8) 画像(4)再現風: 4×4 グリッド4つ
  {
    items: [
      { grid: g(4, 'BWBWWBWBBWBWWBWB'), name: '①' },   // 8黒
      { grid: g(4, 'BBBBWWWWBBBBWWWW'), name: '②' },   // 8黒 → 調整
      { grid: g(4, 'BBBBBBBWWWWWWWWW'), name: '③' },   // 7黒
      { grid: g(4, 'BBBBBBBBBWWWWWWW'), name: '④' },   // 9黒
    ],
    mostIndex: 3,
    leastIndex: 2,
  },
  // (9) 3×3 グリッド4つ
  {
    items: [
      { grid: g(3, 'BBBWWWWWW'), name: '①' },   // 3黒
      { grid: g(3, 'BBBBBWWWW'), name: '②' },   // 5黒
      { grid: g(3, 'BBBBBBWWW'), name: '③' },   // 6黒
      { grid: g(3, 'BBWWWWWWW'), name: '④' },   // 2黒
    ],
    mostIndex: 2,
    leastIndex: 3,
  },
  // (10) 4×4 グリッド3つ（散らばったパターン）
  {
    items: [
      { grid: g(4, 'WBWBBWBWWBWBBWBW'), name: 'ひだり' },   // 8黒
      { grid: g(4, 'BWWWWBWWWWBWWWWB'), name: 'まんなか' },  // 4黒
      { grid: g(4, 'BBWBWBBWBWBBWBWB'), name: 'みぎ' },      // 10黒
    ],
    mostIndex: 2,
    leastIndex: 1,
  },
];

/** 出題済みインデックスを追跡 */
let usedIndices: number[] = [];

/** 問題を生成する */
export function generateAreaCompareQuestion(): Question<AreaCompareQuestionData, AreaCompareChoiceData> {
  if (usedIndices.length >= QUESTION_POOL.length) {
    usedIndices = [];
  }

  const availableIndices = QUESTION_POOL
    .map((_, i) => i)
    .filter((i) => !usedIndices.includes(i));

  const selectedIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
  usedIndices.push(selectedIndex);

  const problem = QUESTION_POOL[selectedIndex];

  return {
    questionData: {
      items: problem.items,
    },
    choices: [
      {
        mostIndex: problem.mostIndex,
        leastIndex: problem.leastIndex,
      },
    ],
    correctIndex: 0,
    instructionText:
      'くろいぶぶんがいちばんひろいものには○、\nいちばんせまいものには×をつけましょう。',
  };
}

/** 固定問題プールの全問題を返す */
export function getAllAreaCompareQuestions(): Question<AreaCompareQuestionData, AreaCompareChoiceData>[] {
  return QUESTION_POOL.map((problem) => {
    return {
      questionData: {
        items: problem.items,
      },
      choices: [
        {
          mostIndex: problem.mostIndex,
          leastIndex: problem.leastIndex,
        },
      ],
      correctIndex: 0,
      instructionText:
        'くろいぶぶんがいちばんひろいものには○、\nいちばんせまいものには×をつけましょう。',
    };
  });
}

/** 正解判定関数（共通フレームワーク用） */
export function checkAreaCompareAnswer(
  _question: Question<AreaCompareQuestionData, AreaCompareChoiceData>,
  _selectedIndex: number,
): boolean {
  return _selectedIndex === 0;
}

/** マーク配列から正解かどうかを判定する */
export function validateAreaMarks(
  marks: MarkType[],
  mostIndex: number,
  leastIndex: number,
): boolean {
  if (marks[mostIndex] !== 'circle') return false;
  if (marks[leastIndex] !== 'cross') return false;
  for (let i = 0; i < marks.length; i++) {
    if (i === mostIndex || i === leastIndex) continue;
    if (marks[i] !== null) return false;
  }
  return true;
}
