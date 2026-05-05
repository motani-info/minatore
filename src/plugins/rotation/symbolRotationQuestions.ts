import type { Question } from '../../types/question';
import type {
  SymbolGrid,
  SymbolGridData,
  SymbolRotationQuestionData,
  SymbolRotationChoiceData,
  RotationDirection,
  CellSymbol,
  GridSize,
} from './types';
import { symbolGridToGridData } from './types';

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
const DB: CellSymbol = { type: 'diamond-black' };
const DW: CellSymbol = { type: 'diamond-white' };
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

// ─── 汎用NxN回転関数（シンボル版） ───

/**
 * NxNシンボルグリッドを右に90度回転する
 * 位置 (row, col) → (col, N-1-row) + 各セルの向きも回転
 */
export function rotateSymbolGridDataRight90(grid: SymbolGridData): SymbolGridData {
  const n = grid.size;
  const newCells: CellSymbol[] = new Array(n * n);
  for (let row = 0; row < n; row++) {
    for (let col = 0; col < n; col++) {
      const oldIndex = row * n + col;
      const newRow = col;
      const newCol = n - 1 - row;
      const newIndex = newRow * n + newCol;
      newCells[newIndex] = rotateCellRight(grid.cells[oldIndex]);
    }
  }
  return { size: n, cells: newCells };
}

/**
 * NxNシンボルグリッドを左に90度回転する
 * 位置 (row, col) → (N-1-col, row) + 各セルの向きも回転
 */
export function rotateSymbolGridDataLeft90(grid: SymbolGridData): SymbolGridData {
  const n = grid.size;
  const newCells: CellSymbol[] = new Array(n * n);
  for (let row = 0; row < n; row++) {
    for (let col = 0; col < n; col++) {
      const oldIndex = row * n + col;
      const newRow = n - 1 - col;
      const newCol = row;
      const newIndex = newRow * n + newCol;
      newCells[newIndex] = rotateCellLeft(grid.cells[oldIndex]);
    }
  }
  return { size: n, cells: newCells };
}

/** NxNシンボルグリッドを180度回転する */
export function rotateSymbolGridData180(grid: SymbolGridData): SymbolGridData {
  return rotateSymbolGridDataRight90(rotateSymbolGridDataRight90(grid));
}

/** 指定方向にSymbolGridDataを回転する */
export function rotateSymbolGridData(grid: SymbolGridData, direction: RotationDirection): SymbolGridData {
  switch (direction) {
    case 'right1': return rotateSymbolGridDataRight90(grid);
    case 'left1': return rotateSymbolGridDataLeft90(grid);
    case 'right2': return rotateSymbolGridData180(grid);
    case 'left2': return rotateSymbolGridData180(grid);
  }
}

// ─── 後方互換性のための2×2関数 ───

export function rotateSymbolGridRight90(grid: SymbolGrid): SymbolGrid {
  return [
    rotateCellRight(grid[2]),
    rotateCellRight(grid[0]),
    rotateCellRight(grid[3]),
    rotateCellRight(grid[1]),
  ];
}

export function rotateSymbolGridLeft90(grid: SymbolGrid): SymbolGrid {
  return [
    rotateCellLeft(grid[1]),
    rotateCellLeft(grid[3]),
    rotateCellLeft(grid[0]),
    rotateCellLeft(grid[2]),
  ];
}

export function rotateSymbolGrid180(grid: SymbolGrid): SymbolGrid {
  return rotateSymbolGridRight90(rotateSymbolGridRight90(grid));
}

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

/** 2つのSymbolGridDataが同一か判定する */
export function symbolGridDataEqual(a: SymbolGridData, b: SymbolGridData): boolean {
  if (a.size !== b.size) return false;
  return a.cells.every((cell, i) =>
    cell.type === b.cells[i].type && (cell.direction ?? 'up') === (b.cells[i].direction ?? 'up')
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

// ─── 固定問題インターフェース ───

interface FixedQuestion {
  originalGrid: SymbolGridData;
  direction: RotationDirection;
  /** 不正解の選択肢（3つ） */
  distractors: SymbolGridData[];
}

/** SymbolGrid（2×2タプル）からFixedQuestionを作成するヘルパー */
function fixed2x2(
  originalGrid: SymbolGrid,
  direction: RotationDirection,
  distractors: SymbolGrid[]
): FixedQuestion {
  return {
    originalGrid: symbolGridToGridData(originalGrid),
    direction,
    distractors: distractors.map(d => symbolGridToGridData(d)),
  };
}

/** NxNのFixedQuestionを直接作成するヘルパー */
function fixedNxN(
  size: GridSize,
  cells: CellSymbol[],
  direction: RotationDirection,
  distractorCells: CellSymbol[][]
): FixedQuestion {
  return {
    originalGrid: { size, cells },
    direction,
    distractors: distractorCells.map(d => ({ size, cells: d })),
  };
}

// ─── 固定問題プール（2×2、既存問題） ───

const question1 = fixed2x2([E, CW, E, CB], 'right1', [[CW, E, CB, E], [CB, CW, E, E], [E, CB, E, CW]]);
const question2 = fixed2x2([E, DL, CW, E], 'right1', [[DL, E, E, CW], [E, CW, DL, E], [E, DL, CW, E]]);
const question3 = fixed2x2([TW('up'), E, TB('right'), TB('up')], 'right1', [[TW('down'), TW('down'), TB('right'), TW('right')], [TB('right'), TW('right'), TB('right'), TW('right')], [TB('right'), TW('right'), TB('up'), TW('right')]]);
const question4 = fixed2x2([TB('up'), TW('up'), TW('up'), TW('up')], 'right1', [[TW('left'), TW('right'), TW('left'), TW('right')], [TW('right'), TW('right'), TW('right'), TW('right')]]);
const question5 = fixed2x2([TB('right'), TW('left'), TB('up'), E], 'left1', [[TW('up'), TB('up'), E, TB('left')], [E, TB('down'), TW('down'), TB('right')], [TB('left'), E, TW('up'), TB('up')]]);
const question6 = fixed2x2([AR, CB, E, E], 'left1', [[PM, PW, PM, PW], [PM, PW, PW, PM], [TU, TU, TU, TU]]);
const question7 = fixed2x2([SB, CLW, HB, SW], 'right1', [[CLW, SW, SB, HB], [SW, SB, CLW, HB], [SB, HB, CLW, SW]]);
const question8 = fixed2x2([HB, CLW, CLB, HW], 'left1', [[HW, CLB, CLW, HB], [CLB, HB, HW, CLW], [HB, HW, CLW, CLB]]);
const question9 = fixed2x2([SQ, E, SQ, CW], 'right1', [[SQ, E, CW, SQ], [CW, SQ, E, SQ], [E, CW, SQ, SQ]]);
const question10 = fixed2x2([CW, CB, CB, CW], 'right1', [[CW, CB, CB, CW], [CB, CB, CW, CW], [CW, CW, CB, CB]]);
const question11 = fixed2x2([DL, DC, DC, DL], 'right1', [[DC, DL, DL, DC], [DL, DL, DC, DC], [DC, DC, DL, DL]]);
const question12 = fixed2x2([AC('right'), AC('right'), AC('right'), AC('right')], 'right1', [[AC('left'), AC('left'), AC('left'), AC('left')], [AC('up'), AC('up'), AC('up'), AC('up')], [AC('right'), AC('left'), AC('right'), AC('left')]]);

const q13 = fixed2x2([CW, E, CW, E], 'right1', [[E, E, CW, CW], [E, CW, E, CW], [CW, E, E, CW]]);
const q14 = fixed2x2([SQ, CW, E, E], 'right1', [[CW, E, SQ, E], [E, E, CW, SQ], [SQ, E, CW, E]]);
const q15 = fixed2x2([CW, E, CB, E], 'right1', [[E, E, CB, CW], [E, CW, E, CB], [CB, E, CW, E]]);
const q16 = fixed2x2([E, TB('up'), TW('down'), E], 'left1', [[E, TW('right'), TB('left'), E], [TB('right'), E, E, TW('left')], [TW('up'), E, E, TB('down')]]);
const q17 = fixed2x2([E, TB('up'), TW('down'), E], 'left1', [[TB('down'), E, E, TW('up')], [E, TB('right'), TW('left'), E], [TW('left'), E, E, TB('right')]]);
const q18 = fixed2x2([CB, TW('right'), E, TB('up')], 'left1', [[TB('left'), E, CW, TW('up')], [E, CB, TW('up'), TB('left')], [TW('down'), CB, TB('right'), E]]);
const q19 = fixed2x2([E, TB('up'), E, E], 'right1', [[E, E, E, TB('up')], [TB('left'), E, E, E], [E, E, TB('down'), E]]);
const q20 = fixed2x2([E, SQ, TW('down'), E], 'right1', [[E, TW('left'), SQ, E], [SQ, E, E, TW('right')], [TW('up'), E, E, SQ]]);
const q21 = fixed2x2([TW('right'), TW('left'), E, TB('right')], 'left1', [[TB('up'), TW('down'), TW('up'), E], [E, TW('up'), TB('up'), TW('down')], [TW('down'), E, TW('up'), TB('up')]]);
const q22 = fixed2x2([SQ, E, E, SQ], 'left1', [[SQ, SQ, E, E], [E, E, SQ, SQ], [SQ, E, SQ, E]]);

const q23 = fixed2x2([E, TW('up'), E, E], 'right1', [[E, E, E, TW('up')], [TW('left'), E, E, E], [E, E, TW('down'), E]]);
const q24 = fixed2x2([SQ, TW('right'), E, SQ], 'right1', [[SQ, E, TW('down'), SQ], [TW('left'), SQ, SQ, E], [E, SQ, SQ, TW('up')]]);
const q25 = fixed2x2([TB('up'), E, SQ, E], 'left1', [[E, SQ, E, TB('left')], [SQ, TB('right'), E, E], [E, E, TB('down'), SQ]]);
const q26 = fixed2x2([DL, E, SQ, E], 'right1', [[E, DL, E, SQ], [SQ, E, DL, E], [E, SQ, E, DL]]);
const q27 = fixed2x2([SQ, E, E, E], 'right1', [[E, E, SQ, E], [E, E, E, SQ], [E, SQ, E, E]]);
const q28 = fixed2x2([DL, E, E, DL], 'right1', [[DL, DL, E, E], [E, E, DL, DL], [DL, E, DL, E]]);
const q29 = fixed2x2([TB('right'), TB('right'), E, E], 'right1', [[E, E, TB('down'), TB('down')], [TB('left'), E, TB('left'), E], [E, TB('up'), E, TB('up')]]);
const q30 = fixed2x2([TB('up'), E, TB('down'), TB('right')], 'left1', [[E, TB('down'), TB('right'), TB('up')], [TB('left'), TB('up'), E, TB('down')], [TB('right'), E, TB('up'), TB('left')]]);
const q31 = fixed2x2([DL, TB('right'), E, TB('up')], 'left1', [[TB('left'), E, DL, TB('up')], [E, TB('down'), TB('right'), DL], [TB('down'), DL, E, TB('right')]]);
const q32 = fixed2x2([TW('up'), DC, TW('down'), E], 'left1', [[E, TW('left'), DC, TW('right')], [TW('right'), DC, E, TW('left')], [DC, TW('up'), TW('down'), E]]);

const q33 = fixed2x2([CW, E, E, CW], 'right1', [[CW, CW, E, E], [E, E, CW, CW], [CW, E, CW, E]]);
const q34 = fixed2x2([CW, CB, CW, CW], 'right1', [[CB, CW, CW, CW], [CW, CW, CB, CW], [CW, CB, CW, CB]]);
const q35 = fixed2x2([SQ, TW('up'), SQ, TW('right')], 'right1', [[TW('down'), SQ, TW('right'), SQ], [SQ, TW('right'), TW('down'), SQ], [TW('right'), TW('down'), SQ, SQ]]);
const q36 = fixed2x2([TB('up'), E, E, TB('up')], 'right1', [[TB('right'), E, E, TB('right')], [E, TB('down'), TB('down'), E], [TB('left'), E, TB('left'), E]]);
const q37 = fixed2x2([TW('up'), E, CW, TW('up')], 'left1', [[TW('left'), CW, E, TW('left')], [CW, TW('down'), TW('down'), E], [E, TW('right'), CW, TW('right')]]);
const q38 = fixed2x2([TB('up'), E, E, TB('up')], 'right1', [[E, TB('left'), TB('left'), E], [TB('down'), E, E, TB('down')], [E, E, TB('right'), TB('right')]]);
const q39 = fixed2x2([DL, DL, E, E], 'right1', [[E, E, DL, DL], [DL, E, DL, E], [E, DL, E, DL]]);
const q40 = fixed2x2([TB('right'), E, TB('left'), E], 'right1', [[E, TB('up'), E, TB('down')], [TB('up'), TB('down'), E, E], [E, E, TB('up'), TB('down')]]);
const q41 = fixed2x2([TW('right'), TW('right'), E, E], 'right1', [[E, E, TW('down'), TW('down')], [TW('down'), E, TW('down'), E], [TW('left'), TW('left'), E, E]]);

// ─── 固定問題プール（3×3） ───

const q3x3_1 = fixedNxN(3,
  [CW, E, CB, E, SQ, E, CB, E, CW],
  'right1',
  [
    [CB, E, CW, E, SQ, E, CW, E, CB],
    [CW, E, CB, E, SQ, E, CB, E, CW],
    [E, SQ, E, CB, CW, CB, E, E, CW],
  ]
);

const q3x3_2 = fixedNxN(3,
  [TB('up'), E, E, E, CW, E, E, E, TB('right')],
  'right1',
  [
    [E, E, TB('left'), E, CW, E, TB('down'), E, E],
    [TB('right'), E, E, E, CW, E, E, E, TB('down')],
    [E, E, TB('up'), E, CW, E, TB('right'), E, E],
  ]
);

const q3x3_3 = fixedNxN(3,
  [HB, HW, HB, E, E, E, E, E, E],
  'left1',
  [
    [HB, E, E, HW, E, E, HB, E, E],
    [E, E, E, E, E, E, HB, HW, HB],
    [E, E, HW, E, E, HB, E, E, HW],
  ]
);

const q3x3_4 = fixedNxN(3,
  [SQ, E, SQ, E, DL, E, CW, E, CW],
  'right2',
  [
    [SQ, E, CW, E, DL, E, CW, E, SQ],
    [E, DL, E, SQ, CW, SQ, E, E, CW],
    [CW, E, SQ, DL, E, DL, SQ, E, CW],
  ]
);

const q3x3_5 = fixedNxN(3,
  [TW('up'), TW('right'), E, E, CB, E, E, TW('left'), TW('down')],
  'right1',
  [
    [E, E, TW('right'), TW('left'), CB, TW('down'), TW('up'), E, E],
    [TW('down'), E, E, E, CB, E, E, TW('up'), TW('right')],
    [E, TW('up'), TW('right'), TW('down'), CB, E, E, TW('left'), E],
  ]
);

const q3x3_6 = fixedNxN(3,
  [CLB, E, SB, E, HB, E, DB, E, CLB],
  'left1',
  [
    [SB, E, CLB, E, HB, E, CLB, E, DB],
    [CLB, E, DB, E, HB, E, SB, E, CLB],
    [DB, E, SB, E, HB, E, CLB, E, CLB],
  ]
);

// ─── 固定問題プール（4×4） ───

const q4x4_1 = fixedNxN(4,
  [CW, CB, E, E, E, E, CW, CB, CB, CW, E, E, E, E, CB, CW],
  'right1',
  [
    [E, CB, E, CW, E, CW, CB, CB, CB, E, CW, E, CW, E, E, E],
    [CW, E, CB, E, CB, E, CW, E, E, CW, E, CB, E, CB, E, CW],
    [E, E, CB, CW, CB, CW, E, E, E, E, CW, CB, CW, CB, E, E],
  ]
);

const q4x4_2 = fixedNxN(4,
  [TB('up'), E, E, TB('up'), E, E, E, E, E, E, E, E, TB('up'), E, E, TB('up')],
  'right1',
  [
    [TB('right'), E, E, TB('right'), E, E, E, E, E, E, E, E, TB('left'), E, E, TB('left')],
    [E, E, E, E, TB('right'), E, E, TB('right'), TB('right'), E, E, TB('right'), E, E, E, E],
    [TB('down'), E, E, TB('down'), E, E, E, E, E, E, E, E, TB('down'), E, E, TB('down')],
  ]
);

const q4x4_3 = fixedNxN(4,
  [SQ, SQ, E, E, SQ, SQ, E, E, E, E, E, E, E, E, E, E],
  'left1',
  [
    [E, E, SQ, SQ, E, E, SQ, SQ, E, E, E, E, E, E, E, E],
    [E, E, E, E, E, E, E, E, E, E, SQ, SQ, E, E, SQ, SQ],
    [SQ, SQ, E, E, SQ, SQ, E, E, E, E, E, E, E, E, E, E],
  ]
);

const q4x4_4 = fixedNxN(4,
  [HB, E, E, HW, E, CLB, CLW, E, E, SB, SW, E, DB, E, E, DW],
  'right2',
  [
    [DW, E, E, DB, E, SW, SB, E, E, CLW, CLB, E, HW, E, E, HB],
    [HW, E, E, HB, E, CLW, CLB, E, E, SW, SB, E, DW, E, E, DB],
    [DB, E, E, DW, E, SB, SW, E, E, CLB, CLW, E, HB, E, E, HW],
  ]
);

// ─── 全固定問題プール ───

const FIXED_QUESTIONS: FixedQuestion[] = [
  question1, question2, question3, question4, question5, question6,
  question7, question8, question9, question10, question11, question12,
  q13, q14, q15, q16, q17, q18, q19, q20, q21, q22,
  q23, q24, q25, q26, q27, q28, q29, q30, q31, q32,
  q33, q34, q35, q36, q37, q38, q39, q40, q41,
  // 3×3 questions
  q3x3_1, q3x3_2, q3x3_3, q3x3_4, q3x3_5, q3x3_6,
  // 4×4 questions
  q4x4_1, q4x4_2, q4x4_3, q4x4_4,
];

/** 現在の出題インデックス */
let currentSymbolIndex = 0;

/** 固定問題プールから順番に1問を生成する */
export function generateSymbolRotationQuestion(): Question<SymbolRotationQuestionData, SymbolRotationChoiceData> {
  const questions = getAllSymbolRotationQuestions();
  const question = questions[currentSymbolIndex % questions.length];
  currentSymbolIndex++;
  return question;
}

/** 固定問題プールの全問題を返す */
export function getAllSymbolRotationQuestions(): Question<SymbolRotationQuestionData, SymbolRotationChoiceData>[] {
  return FIXED_QUESTIONS.map((fixedQ, idx) => {
    const correctGrid = rotateSymbolGridData(fixedQ.originalGrid, fixedQ.direction);
    // 問題インデックスに基づいて正解位置を決定（毎回同じ結果になる）
    const correctIndex = idx % 4;
    const choices: SymbolRotationChoiceData[] = [...fixedQ.distractors];
    choices.splice(correctIndex, 0, correctGrid);
    while (choices.length < 4) choices.push(correctGrid);
    if (choices.length > 4) {
      choices.length = 4;
      if (!choices.some((c) => symbolGridDataEqual(c, correctGrid))) {
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
