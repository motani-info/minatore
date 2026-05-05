import type { Question } from '../../types/question';
import type {
  WaterItem,
  WaterVolumeQuestionData,
  WaterVolumeChoiceData,
  MarkType,
} from './types';

/**
 * 固定問題セット
 * 画像の問題を再現 + バリエーション
 */
const QUESTION_POOL: Array<{
  items: WaterItem[];
  mostIndex: number;
  secondIndex: number;
}> = [
  // ─── コップ問題 ───

  // (1) 同じサイズのコップ3つ、水位が異なる
  {
    items: [
      { container: 'cup', waterLevel: 0.8, containerScale: 1.0, name: 'ひだり' },
      { container: 'cup', waterLevel: 0.5, containerScale: 1.0, name: 'まんなか' },
      { container: 'cup', waterLevel: 0.3, containerScale: 1.0, name: 'みぎ' },
    ],
    mostIndex: 0,
    secondIndex: 1,
  },
  // (2) 同じサイズのコップ3つ、水位が異なる（別パターン）
  {
    items: [
      { container: 'cup', waterLevel: 0.4, containerScale: 1.0, name: 'ひだり' },
      { container: 'cup', waterLevel: 0.9, containerScale: 1.0, name: 'まんなか' },
      { container: 'cup', waterLevel: 0.6, containerScale: 1.0, name: 'みぎ' },
    ],
    mostIndex: 1,
    secondIndex: 2,
  },
  // (3) サイズの異なるコップ3つ（大きいコップに少ない水 vs 小さいコップに多い水）
  {
    items: [
      { container: 'cup', waterLevel: 0.3, containerScale: 1.3, name: 'ひだり' },
      { container: 'cup', waterLevel: 0.7, containerScale: 0.8, name: 'まんなか' },
      { container: 'cup', waterLevel: 0.9, containerScale: 1.0, name: 'みぎ' },
    ],
    mostIndex: 2,
    secondIndex: 0,
  },
  // (4) 画像(1)上段再現: 大中小のコップ、水位もバラバラ
  {
    items: [
      { container: 'cup', waterLevel: 0.7, containerScale: 1.2, name: 'ひだり' },
      { container: 'cup', waterLevel: 0.5, containerScale: 1.0, name: 'まんなか' },
      { container: 'cup', waterLevel: 0.9, containerScale: 0.8, name: 'みぎ' },
    ],
    mostIndex: 0,
    secondIndex: 2,
  },
  // (5) 画像(1)下段再現: 大きいコップに多い水
  {
    items: [
      { container: 'cup', waterLevel: 0.6, containerScale: 1.3, name: 'ひだり' },
      { container: 'cup', waterLevel: 0.4, containerScale: 0.9, name: 'まんなか' },
      { container: 'cup', waterLevel: 0.2, containerScale: 1.1, name: 'みぎ' },
    ],
    mostIndex: 0,
    secondIndex: 2,
  },

  // ─── 水槽問題 ───

  // (6) 画像(2)上段再現: 大きさの異なる水槽
  {
    items: [
      { container: 'tank', waterLevel: 0.4, containerScale: 1.3, name: 'ひだり' },
      { container: 'tank', waterLevel: 0.7, containerScale: 0.8, name: 'みぎ' },
    ],
    mostIndex: 0,
    secondIndex: 1,
  },
  // (7) 画像(2)下段再現: 大きさの異なる水槽
  {
    items: [
      { container: 'tank', waterLevel: 0.5, containerScale: 1.0, name: 'ひだり' },
      { container: 'tank', waterLevel: 0.8, containerScale: 1.2, name: 'みぎ' },
    ],
    mostIndex: 1,
    secondIndex: 0,
  },
  // (8) 水槽3つ
  {
    items: [
      { container: 'tank', waterLevel: 0.6, containerScale: 1.0, name: 'ひだり' },
      { container: 'tank', waterLevel: 0.3, containerScale: 1.2, name: 'まんなか' },
      { container: 'tank', waterLevel: 0.8, containerScale: 0.9, name: 'みぎ' },
    ],
    mostIndex: 2,
    secondIndex: 0,
  },

  // ─── 混合問題 ───

  // (9) コップと水槽の混合
  {
    items: [
      { container: 'cup', waterLevel: 0.9, containerScale: 1.0, name: 'ひだり' },
      { container: 'tank', waterLevel: 0.3, containerScale: 1.0, name: 'まんなか' },
      { container: 'cup', waterLevel: 0.5, containerScale: 1.2, name: 'みぎ' },
    ],
    mostIndex: 1,
    secondIndex: 0,
  },
  // (10) 4つのコップ
  {
    items: [
      { container: 'cup', waterLevel: 0.5, containerScale: 1.0, name: '①' },
      { container: 'cup', waterLevel: 0.8, containerScale: 0.9, name: '②' },
      { container: 'cup', waterLevel: 0.3, containerScale: 1.1, name: '③' },
      { container: 'cup', waterLevel: 0.7, containerScale: 1.0, name: '④' },
    ],
    mostIndex: 1,
    secondIndex: 3,
  },
];

/** 現在の出題インデックス */
let currentIndex = 0;

/** 問題を順番に生成する */
export function generateWaterVolumeQuestion(): Question<WaterVolumeQuestionData, WaterVolumeChoiceData> {
  const questions = getAllWaterVolumeQuestions();
  const question = questions[currentIndex % questions.length];
  currentIndex++;
  return question;
}

/** 固定問題プールの全問題を返す */
export function getAllWaterVolumeQuestions(): Question<WaterVolumeQuestionData, WaterVolumeChoiceData>[] {
  return QUESTION_POOL.map((problem) => {
    const hasOnlyCups = problem.items.every((item) => item.container === 'cup');
    const hasOnlyTanks = problem.items.every((item) => item.container === 'tank');

    let containerWord: string;
    if (hasOnlyCups) {
      containerWord = 'コップ';
    } else if (hasOnlyTanks) {
      containerWord = 'すいそう';
    } else {
      containerWord = 'いれもの';
    }

    return {
      questionData: {
        items: problem.items,
      },
      choices: [
        {
          mostIndex: problem.mostIndex,
          secondIndex: problem.secondIndex,
        },
      ],
      correctIndex: 0,
      instructionText:
        `${containerWord}にはいっているみずが\nいちばんおおいものには○、\n2ばんめにおおいものには×をつけましょう。`,
    };
  });
}

/** 正解判定関数（共通フレームワーク用） */
export function checkWaterVolumeAnswer(
  _question: Question<WaterVolumeQuestionData, WaterVolumeChoiceData>,
  _selectedIndex: number,
): boolean {
  return _selectedIndex === 0;
}

/** マーク配列から正解かどうかを判定する */
export function validateWaterMarks(
  marks: MarkType[],
  mostIndex: number,
  secondIndex: number,
): boolean {
  if (marks[mostIndex] !== 'circle') return false;
  if (marks[secondIndex] !== 'cross') return false;
  for (let i = 0; i < marks.length; i++) {
    if (i === mostIndex || i === secondIndex) continue;
    if (marks[i] !== null) return false;
  }
  return true;
}
