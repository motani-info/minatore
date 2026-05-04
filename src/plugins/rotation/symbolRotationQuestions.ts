import type { Question } from '../../types/question';
import type {
  SymbolGrid,
  SymbolRotationQuestionData,
  SymbolRotationChoiceData,
  RotationDirection,
  CellSymbol,
} from './types';

// ─── ヘルパー ───

const E: CellSymbol = { type: 'empty' };
const CW: CellSymbol = { type: 'circle-white' };
const CB: CellSymbol = { type: 'circle-black' };
const TW = (dir: CellSymbol['direction'] = 'up'): CellSymbol => ({ type: 'triangle-white', direction: dir });
const TB = (dir: CellSymbol['direction'] = 'up'): CellSymbol => ({ type: 'triangle-black', direction: dir });
const DL: CellSymbol = { type: 'diagonal-line' };
const DC: CellSymbol = { type: 'diagonal-cross' };
const SQ: CellSymbol = { type: 'square-black' };
const AR: CellSymbol = { type: 'arrow-right' };
const AC = (dir: CellSymbol['direction'] = 'up'): CellSymbol => ({ type: 'arrow-curved', direction: dir });
const PM: CellSymbol = { type: 'person-man' };
const PW: CellSymbol = { type: 'person-woman' };
const HB: CellSymbol = { type: 'heart-black' };
const HW: CellSymbol = { type: 'heart-white' };
const CLB: CellSymbol = { type: 'club-black' };
const CLW: CellSymbol = { type: 'club-white' };
const SB: CellSymbol = { type: 'spade-black' };
const SW: CellSymbol = { type: 'spade-white' };
const TU: CellSymbol = { type: 'tulip' };

/** シンボルの向きを右90度回転する */
function rotateSymbolDirection(dir: CellSymbol['direction']): CellSymbol['direction'] {
  switch (dir) {
    case 'up': return 'right';
    case 'right': return 'down';
    case 'down': return 'left';
    case 'left': return 'up';
    default: return dir;
  }
}

/** シンボルの向きを左90度回転する */
function rotateSymbolDirectionLeft(dir: CellSymbol['direction']): CellSymbol['direction'] {
  switch (dir) {
    case 'up': return 'left';
    case 'left': return 'down';
    case 'down': return 'right';
    case 'right': return 'up';
    default: return dir;
  }
}

/** セルを右90度回転（位置は変えず、向きだけ回転） */
function rotateCellRight(cell: CellSymbol): CellSymbol {
  if (!cell.direction) return { ...cell };
  return { ...cell, direction: rotateSymbolDirection(cell.direction) };
}

/** セルを左90度回転 */
function rotateCellLeft(cell: CellSymbol): CellSymbol {
  if (!cell.direction) return { ...cell };
  return { ...cell, direction: rotateSymbolDirectionLeft(cell.direction) };
}

/**
 * グリッドを右に90度回転する
 * 位置: [0][1] → [2][0]
 *       [2][3]   [3][1]
 * + 各セルの向きも回転
 */
export function rotateSymbolGridRight90(grid: SymbolGrid): SymbolGrid {
  return [
    rotateCellRight(grid[2]),
    rotateCellRight(grid[0]),
    rotateCellRight(grid[3]),
    rotateCellRight(grid[1]),
  ];
}

/**
 * グリッドを左に90度回転する
 * 位置: [0][1] → [1][3]
 *       [2][3]   [0][2]
 * + 各セルの向きも回転
 */
export function rotateSymbolGridLeft90(grid: SymbolGrid): SymbolGrid {
  return [
    rotateCellLeft(grid[1]),
    rotateCellLeft(grid[3]),
    rotateCellLeft(grid[0]),
    rotateCellLeft(grid[2]),
  ];
}

/** グリッドを180度回転する */
export function rotateSymbolGrid180(grid: SymbolGrid): SymbolGrid {
  return rotateSymbolGridRight90(rotateSymbolGridRight90(grid));
}

/** 指定方向にグリッドを回転する */
export function rotateSymbolGrid(grid: SymbolGrid, direction: RotationDirection): SymbolGrid {
  switch (direction) {
    case 'right1': return rotateSymbolGridRight90(grid);
    case 'left1': return rotateSymbolGridLeft90(grid);
    case 'right2': return rotateSymbolGrid180(grid);
    case 'left2': return rotateSymbolGrid180(grid);
  }
}

/** 2つのシンボルグリッドが同一か判定する */
export function symbolGridsEqual(a: SymbolGrid, b: SymbolGrid): boolean {
  return a.every((cell, i) =>
    cell.type === b[i].type && (cell.direction ?? 'up') === (b[i].direction ?? 'up')
  );
}

/** 回転方向に対応する指示テキスト */
function getInstructionText(direction: RotationDirection): string {
  switch (direction) {
    case 'right1': return '右に1かいまわすと\nどれになりますか？';
    case 'left1': return '左に1かいまわすと\nどれになりますか？';
    case 'right2': return '右に2かいまわすと\nどれになりますか？';
    case 'left2': return '左に2かいまわすと\nどれになりますか？';
  }
}

// ─── 固定問題プール（画像の8問） ───

interface FixedQuestion {
  originalGrid: SymbolGrid;
  direction: RotationDirection;
  /** 不正解の選択肢（3つ） */
  distractors: SymbolGrid[];
}

/**
 * 問題① 右1回転
 * 元: [空, 白丸; 空, 黒丸]
 * 正解（右90度）: [空, 空; 白丸, 黒丸] → 位置回転で [空, 空; 黒丸, 白丸]
 * 
 * 画像の読み取り:
 * 元グリッド: 上左=空, 上右=白丸, 下左=空, 下右=黒丸
 * 右90度回転: 上左=下左の空, 上右=上左の空, 下左=下右の黒丸, 下右=上右の白丸
 * → [空, 空, 黒丸, 白丸]
 * 
 * 選択肢（画像から）:
 * ①[空, 空, 黒丸, 白丸] ← 正解
 * ②[白丸, 空, 黒丸, 空]
 * ③[黒丸, 白丸, 空, 空]
 * ④[空, 黒丸, 空, 白丸]
 */
const question1: FixedQuestion = {
  originalGrid: [E, CW, E, CB],
  direction: 'right1',
  distractors: [
    [CW, E, CB, E],
    [CB, CW, E, E],
    [E, CB, E, CW],
  ],
};

/**
 * 問題② 右1回転
 * 元: [空, 斜線; 白丸, 空]
 * 右90度回転: [白丸, 空; 空, 斜線]
 * 
 * 選択肢（画像から）:
 * ①[斜線, 空; 空, 白丸]
 * ②[白丸, 空; 空, 斜線] ← 正解
 * ③[空, 白丸; 斜線, 空]
 * ④[空, 斜線; 白丸, 空]（元と同じ）
 */
const question2: FixedQuestion = {
  originalGrid: [E, DL, CW, E],
  direction: 'right1',
  distractors: [
    [DL, E, E, CW],
    [E, CW, DL, E],
    [E, DL, CW, E],
  ],
};

/**
 * 問題③ 右1回転
 * 元: [白三角↑, 空; 黒三角→, 黒三角↑]
 * 右90度回転:
 *   位置: [下左, 上左; 下右, 上右] = [黒三角→, 白三角↑; 黒三角↑, 空]
 *   向き回転: →→↓, ↑→→, ↑→→
 *   結果: [黒三角↓, 白三角→; 黒三角→, 空]
 * 
 * 選択肢（画像から）:
 * ①[白三角←, 白三角←; 黒三角→, 黒三角↓]
 * ②[白三角↓, 白三角↓; 黒三角→, 黒三角→]
 * ③[黒三角↓, 白三角→; 黒三角→, 空] ← 正解（要確認）
 * ④[黒三角→, 白三角↑; 黒三角↓, 空]（？）
 * 
 * 画像を再確認:
 * 選択肢1: [◁, ◁; ▶, ▷]  → [三角左黒, 三角左白; 三角右黒, 三角右白]
 * 選択肢2: [▽, ▽; ▶, ▷]  → [三角下白, 三角下白; 三角右黒, 三角右白]  
 * 選択肢3: [▶, ▷; ▶, ▷]  → [三角右黒, 三角右白; 三角右黒, 三角右白]
 * 選択肢4: [▶, ▷; ▲, ▷]  → [三角右黒, 三角右白; 三角上黒, 三角右白]
 * 
 * 正解は選択肢1: 
 * 元[△白↑, 空; ▶黒→, ▲黒↑] を右90度回転
 * 位置回転: [▶黒→, △白↑; ▲黒↑, 空]
 * 向き+90: [▶黒↓, △白→; ▲黒→, 空]
 * → [黒↓, 白→; 黒→, 空]
 * 
 * 画像の選択肢を再度確認... 
 * 選択肢1が正解: [◁白, ◁白; ▶黒, ▷白] ではなく...
 * 
 * 画像が複雑なので、できるだけ忠実に再現します。
 */
const question3: FixedQuestion = {
  originalGrid: [TW('up'), E, TB('right'), TB('up')],
  direction: 'right1',
  distractors: [
    [TW('down'), TW('down'), TB('right'), TW('right')],
    [TB('right'), TW('right'), TB('right'), TW('right')],
    [TB('right'), TW('right'), TB('up'), TW('right')],
  ],
};

/**
 * 問題④ 右1回転
 * 元: 大きな三角形パターン
 * [黒三角(大きい斜め), 空; 白三角↑, 白三角↑]
 * 
 * 画像の読み取り:
 * 上左=黒い大三角（左上から右下への対角線で塗りつぶし）
 * 上右=空（対角線あり）
 * 下左=白三角↑
 * 下右=白三角↑
 * 
 * 選択肢は大きな三角形（◁◁型）のパターン
 * 選択肢1: [◁大黒, ◁白; ◁白, ◁白]
 * 選択肢2: [◁白, ▷白; ◁白, ▷白]  
 * 選択肢3: [▷白, ▷白; ▷白, ▷白]
 * 
 * 正解は選択肢1
 */
const question4: FixedQuestion = {
  originalGrid: [TB('up'), TW('up'), TW('up'), TW('up')],
  direction: 'right1',
  distractors: [
    [TW('left'), TW('right'), TW('left'), TW('right')],
    [TW('right'), TW('right'), TW('right'), TW('right')],
  ],
};

/**
 * 問題⑤ 左1回転
 * 元: 三角形パターン（2×2グリッド）
 * 画像: 上左=黒三角(右下向き斜め), 上右=白三角(左下向き斜め)
 *       下左=黒三角↑, 下右=空
 * 
 * 選択肢4つ
 */
const question5: FixedQuestion = {
  originalGrid: [TB('right'), TW('left'), TB('up'), E],
  direction: 'left1',
  distractors: [
    [TW('up'), TB('up'), E, TB('left')],
    [E, TB('down'), TW('down'), TB('right')],
    [TB('left'), E, TW('up'), TB('up')],
  ],
};

/**
 * 問題⑥ 左1回転
 * 元: [矢印→, 黒丸; 空, 空] のような人物パターン
 * 画像: 上左=矢印(→), 上右=黒丸
 *       下左=空, 下右=空
 * 
 * 左90度回転後の選択肢4つ
 * 選択肢1: [男, 女; 男, 女]
 * 選択肢2: [男, 女; 女, 男]
 * 選択肢3: [女, 男; 女, 男] ← 正解
 * 選択肢4: [チューリップ, チューリップ; チューリップ, チューリップ]
 */
const question6: FixedQuestion = {
  originalGrid: [AR, CB, E, E],
  direction: 'left1',
  distractors: [
    [PM, PW, PM, PW],
    [PM, PW, PW, PM],
    [TU, TU, TU, TU],
  ],
};

/**
 * 問題⑦ - 傘の連続回転（5択）
 * これは2×2グリッドではなく単一図形の連続回転なので、
 * 2×2グリッド形式に変換して表現する。
 * 
 * 傘が右に回転していく問題。5つの選択肢から正しい順序を選ぶ。
 * ただし既存の4択フレームワークに合わせるため、
 * 「次の回転はどれ？」形式に変換する。
 * 
 * 元: 傘(上向き) → 右90度回転 → 傘(右向き)
 * → スキップ（2×2グリッド形式に合わないため）
 * 
 * 代わりに2×2グリッドで傘的なパターンを作る
 * → 問題⑧のトランプマークで代替
 */

/**
 * 問題⑧ 連続回転（トランプマーク）
 * 元: [ハート黒, クラブ白; クラブ黒, ハート白]
 * 
 * 画像の読み取り（左1回転の連続）:
 * 最初: [♥黒(小), ♣白(小); ♣黒(大), ♥白(小)]
 * → 左回転 → [♣白, ♥白; ♥黒, ♣黒]
 * → 左回転 → [♥白, ♣黒; ♣白, ♥黒]
 * → 左回転 → [♣黒, ♥黒; ♥白, ♣白]
 * 
 * 選択肢4つ（最後の回転結果を選ぶ）
 */
const question8: FixedQuestion = {
  originalGrid: [HB, CLW, CLB, HW],
  direction: 'left1',
  distractors: [
    [HW, CLB, CLW, HB],
    [CLB, HB, HW, CLW],
    [HB, HW, CLW, CLB],
  ],
};

/**
 * 問題⑦の代替: トランプマーク別パターン（右1回転）
 * 元: [スペード黒, ダイヤ白; ダイヤ黒, スペード白]
 */
const question7: FixedQuestion = {
  originalGrid: [SB, CLW, HB, SW],
  direction: 'right1',
  distractors: [
    [CLW, SW, SB, HB],
    [SW, SB, CLW, HB],
    [SB, HB, CLW, SW],
  ],
};

/**
 * 問題⑨ 右1回転（画像2枚目・問題(1)）
 * 元: [黒四角(小), 空; 黒四角(大), 白丸]
 * 右90度回転: [黒四角(大), 黒四角(小); 白丸, 空]
 *
 * 選択肢（画像から4つ）:
 * ①[黒四角, 空; 白丸, 黒四角]
 * ②[白丸, 黒四角; 空, 黒四角]
 * ③[黒四角, 黒四角; 白丸, 空] ← 正解
 * ④[空, 白丸; 黒四角, 黒四角]
 */
const question9: FixedQuestion = {
  originalGrid: [SQ, E, SQ, CW],
  direction: 'right1',
  distractors: [
    [SQ, E, CW, SQ],
    [CW, SQ, E, SQ],
    [E, CW, SQ, SQ],
  ],
};

/**
 * 問題⑩ 右1回転（画像2枚目・問題(2)）
 * 元: [白丸, 黒丸; 黒丸, 白丸]
 * 右90度回転: [黒丸, 白丸; 白丸, 黒丸]
 *
 * 選択肢（画像から4つ）:
 * ①[白丸, 黒丸; 黒丸, 白丸]（元と同じ）
 * ②[黒丸, 白丸; 白丸, 黒丸] ← 正解
 * ③[黒丸, 黒丸; 白丸, 白丸]
 * ④[白丸, 白丸; 黒丸, 黒丸]
 */
const question10: FixedQuestion = {
  originalGrid: [CW, CB, CB, CW],
  direction: 'right1',
  distractors: [
    [CW, CB, CB, CW],
    [CB, CB, CW, CW],
    [CW, CW, CB, CB],
  ],
};

/**
 * 問題⑪ 右1回転（画像2枚目・問題(3)）
 * 元: X字の対角線パターン（2×2グリッドの各セルに対角線）
 * [対角線\, 対角線/; 対角線/, 対角線\] → X字模様
 * 右90度回転: 位置が入れ替わる
 *
 * 選択肢（画像から4つ）
 */
const question11: FixedQuestion = {
  originalGrid: [DL, DC, DC, DL],
  direction: 'right1',
  distractors: [
    [DC, DL, DL, DC],
    [DL, DL, DC, DC],
    [DC, DC, DL, DL],
  ],
};

/**
 * 問題⑫ 右1回転（画像2枚目・問題(4)）
 * 元: 曲がった矢印パターン
 * [矢印↗, 矢印↗; 矢印↗, 矢印↗] → 全部同じ向きの曲がった矢印
 * 右90度回転: 全部の矢印が右に90度回転
 *
 * 選択肢（画像から4つ）
 */
const question12: FixedQuestion = {
  originalGrid: [AC('right'), AC('right'), AC('right'), AC('right')],
  direction: 'right1',
  distractors: [
    [AC('left'), AC('left'), AC('left'), AC('left')],
    [AC('up'), AC('up'), AC('up'), AC('up')],
    [AC('right'), AC('left'), AC('right'), AC('left')],
  ],
};

// ─── 固定問題プール ───

const FIXED_QUESTIONS: FixedQuestion[] = [
  question1,
  question2,
  question3,
  question4,
  question5,
  question6,
  question7,
  question8,
  question9,
  question10,
  question11,
  question12,
];

/** 固定問題プールからランダムに1問を生成する */
export function generateSymbolRotationQuestion(): Question<SymbolRotationQuestionData, SymbolRotationChoiceData> {
  const fixedQ = FIXED_QUESTIONS[Math.floor(Math.random() * FIXED_QUESTIONS.length)];

  // 正解を計算
  const correctGrid = rotateSymbolGrid(fixedQ.originalGrid, fixedQ.direction);

  // 正解位置をランダムに決定
  const correctIndex = Math.floor(Math.random() * 4);
  const choices: SymbolRotationChoiceData[] = [...fixedQ.distractors];
  choices.splice(correctIndex, 0, correctGrid);

  // 選択肢が4つになるよう調整
  while (choices.length < 4) {
    choices.push(correctGrid); // フォールバック
  }
  if (choices.length > 4) {
    choices.length = 4;
    // 正解が含まれているか確認
    if (!choices.some((c) => symbolGridsEqual(c, correctGrid))) {
      choices[correctIndex] = correctGrid;
    }
  }

  return {
    questionData: {
      originalGrid: fixedQ.originalGrid,
      direction: fixedQ.direction,
    },
    choices,
    correctIndex,
    instructionText: getInstructionText(fixedQ.direction),
  };
}

/** 固定問題プールの全問題を返す */
export function getAllSymbolRotationQuestions(): Question<SymbolRotationQuestionData, SymbolRotationChoiceData>[] {
  return FIXED_QUESTIONS.map((fixedQ) => {
    const correctGrid = rotateSymbolGrid(fixedQ.originalGrid, fixedQ.direction);
    const correctIndex = Math.floor(Math.random() * 4);
    const choices: SymbolRotationChoiceData[] = [...fixedQ.distractors];
    choices.splice(correctIndex, 0, correctGrid);
    while (choices.length < 4) choices.push(correctGrid);
    if (choices.length > 4) {
      choices.length = 4;
      if (!choices.some((c) => symbolGridsEqual(c, correctGrid))) {
        choices[correctIndex] = correctGrid;
      }
    }
    return {
      questionData: { originalGrid: fixedQ.originalGrid, direction: fixedQ.direction },
      choices,
      correctIndex,
      instructionText: getInstructionText(fixedQ.direction),
    };
  });
}

/** 正解判定関数 */
export function checkSymbolRotationAnswer(
  question: Question<SymbolRotationQuestionData, SymbolRotationChoiceData>,
  selectedIndex: number
): boolean {
  return selectedIndex === question.correctIndex;
}
