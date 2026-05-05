import type { Question } from '../../types/question';
import type { OverlayCancelQuestionData, OverlayCancelChoiceData, OverlayCancelGrid, CellValue } from './types';

/**
 * NxNグリッドを左右反転する（列をミラー）
 * col → (size-1-col)
 */
function flipGridHorizontally(grid: OverlayCancelGrid): OverlayCancelGrid {
  const { size, cells } = grid;
  const flipped: CellValue[] = new Array(size * size);
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      flipped[row * size + (size - 1 - col)] = cells[row * size + col];
    }
  }
  return { size, cells: flipped };
}

/**
 * 左グリッドを右に折り重ねた結果を計算（NxN対応）
 * 折り重ね: 左右反転して右に重ねる
 * 相殺ルール: ○と×が重なったら空白になる
 */
export function computeOverlay(leftGrid: OverlayCancelGrid, rightGrid: OverlayCancelGrid): OverlayCancelGrid {
  const flippedLeft = flipGridHorizontally(leftGrid);
  const size = leftGrid.size;
  const totalCells = size * size;
  const result: CellValue[] = new Array(totalCells);

  for (let i = 0; i < totalCells; i++) {
    const l = flippedLeft.cells[i];
    const r = rightGrid.cells[i];

    if (l === 'empty' && r === 'empty') {
      result[i] = 'empty';
    } else if (l === 'empty') {
      result[i] = r;
    } else if (r === 'empty') {
      result[i] = l;
    } else if (l === r) {
      result[i] = l;
    } else {
      // ○と×が重なる → 相殺して空白
      result[i] = 'empty';
    }
  }

  return { size, cells: result };
}

// ─── ヘルパー ───

function makeGrid(size: number, cells: CellValue[]): OverlayCancelGrid {
  return { size, cells };
}

// ─── 固定問題プール ───

interface FixedOverlayCancelQ {
  leftGrid: OverlayCancelGrid;
  rightGrid: OverlayCancelGrid;
  choices: OverlayCancelChoiceData[];
  correctIndex: number;
}

// ─── 2×2 固定問題 ───

const FIXED_2x2_QUESTIONS: FixedOverlayCancelQ[] = [
  { leftGrid: makeGrid(2, ['circle', 'cross', 'empty', 'circle']), rightGrid: makeGrid(2, ['cross', 'circle', 'circle', 'empty']), choices: [makeGrid(2, ['empty', 'empty', 'circle', 'circle']), makeGrid(2, ['cross', 'circle', 'circle', 'empty']), makeGrid(2, ['circle', 'cross', 'empty', 'circle']), makeGrid(2, ['empty', 'circle', 'circle', 'cross'])], correctIndex: 0 },
  { leftGrid: makeGrid(2, ['cross', 'circle', 'circle', 'cross']), rightGrid: makeGrid(2, ['circle', 'empty', 'empty', 'circle']), choices: [makeGrid(2, ['circle', 'circle', 'circle', 'empty']), makeGrid(2, ['empty', 'circle', 'empty', 'empty']), makeGrid(2, ['circle', 'empty', 'circle', 'circle']), makeGrid(2, ['empty', 'empty', 'empty', 'empty'])], correctIndex: 1 },
  { leftGrid: makeGrid(2, ['circle', 'empty', 'cross', 'circle']), rightGrid: makeGrid(2, ['empty', 'cross', 'circle', 'empty']), choices: [makeGrid(2, ['empty', 'empty', 'circle', 'circle']), makeGrid(2, ['cross', 'cross', 'circle', 'empty']), makeGrid(2, ['empty', 'circle', 'empty', 'circle']), makeGrid(2, ['circle', 'empty', 'empty', 'cross'])], correctIndex: 0 },
  { leftGrid: makeGrid(2, ['cross', 'cross', 'circle', 'empty']), rightGrid: makeGrid(2, ['cross', 'circle', 'empty', 'cross']), choices: [makeGrid(2, ['empty', 'cross', 'empty', 'cross']), makeGrid(2, ['cross', 'cross', 'circle', 'cross']), makeGrid(2, ['cross', 'empty', 'circle', 'empty']), makeGrid(2, ['empty', 'circle', 'empty', 'empty'])], correctIndex: 0 },
  { leftGrid: makeGrid(2, ['empty', 'circle', 'cross', 'empty']), rightGrid: makeGrid(2, ['circle', 'circle', 'cross', 'cross']), choices: [makeGrid(2, ['circle', 'circle', 'empty', 'cross']), makeGrid(2, ['empty', 'circle', 'cross', 'cross']), makeGrid(2, ['circle', 'empty', 'cross', 'empty']), makeGrid(2, ['circle', 'circle', 'cross', 'cross'])], correctIndex: 0 },
  { leftGrid: makeGrid(2, ['circle', 'cross', 'empty', 'cross']), rightGrid: makeGrid(2, ['empty', 'circle', 'cross', 'empty']), choices: [makeGrid(2, ['empty', 'empty', 'cross', 'cross']), makeGrid(2, ['circle', 'circle', 'cross', 'empty']), makeGrid(2, ['cross', 'empty', 'empty', 'cross']), makeGrid(2, ['empty', 'cross', 'cross', 'empty'])], correctIndex: 0 },
  { leftGrid: makeGrid(2, ['cross', 'empty', 'circle', 'cross']), rightGrid: makeGrid(2, ['circle', 'cross', 'empty', 'circle']), choices: [makeGrid(2, ['empty', 'empty', 'circle', 'empty']), makeGrid(2, ['cross', 'cross', 'empty', 'circle']), makeGrid(2, ['empty', 'cross', 'circle', 'empty']), makeGrid(2, ['circle', 'empty', 'empty', 'cross'])], correctIndex: 0 },
  { leftGrid: makeGrid(2, ['empty', 'cross', 'circle', 'empty']), rightGrid: makeGrid(2, ['cross', 'empty', 'empty', 'circle']), choices: [makeGrid(2, ['empty', 'cross', 'empty', 'circle']), makeGrid(2, ['cross', 'empty', 'circle', 'empty']), makeGrid(2, ['empty', 'empty', 'circle', 'circle']), makeGrid(2, ['cross', 'cross', 'empty', 'empty'])], correctIndex: 0 },
  { leftGrid: makeGrid(2, ['circle', 'circle', 'cross', 'cross']), rightGrid: makeGrid(2, ['cross', 'empty', 'circle', 'empty']), choices: [makeGrid(2, ['empty', 'cross', 'empty', 'cross']), makeGrid(2, ['circle', 'empty', 'cross', 'empty']), makeGrid(2, ['cross', 'circle', 'circle', 'cross']), makeGrid(2, ['empty', 'empty', 'circle', 'circle'])], correctIndex: 0 },
  { leftGrid: makeGrid(2, ['cross', 'circle', 'empty', 'cross']), rightGrid: makeGrid(2, ['empty', 'cross', 'circle', 'circle']), choices: [makeGrid(2, ['empty', 'empty', 'circle', 'circle']), makeGrid(2, ['cross', 'cross', 'empty', 'circle']), makeGrid(2, ['circle', 'empty', 'circle', 'empty']), makeGrid(2, ['empty', 'cross', 'circle', 'cross'])], correctIndex: 0 },
  { leftGrid: makeGrid(2, ['circle', 'empty', 'empty', 'circle']), rightGrid: makeGrid(2, ['cross', 'circle', 'cross', 'empty']), choices: [makeGrid(2, ['cross', 'empty', 'cross', 'circle']), makeGrid(2, ['empty', 'circle', 'empty', 'circle']), makeGrid(2, ['cross', 'circle', 'cross', 'circle']), makeGrid(2, ['empty', 'empty', 'cross', 'empty'])], correctIndex: 0 },
  { leftGrid: makeGrid(2, ['empty', 'cross', 'cross', 'circle']), rightGrid: makeGrid(2, ['circle', 'empty', 'cross', 'cross']), choices: [makeGrid(2, ['circle', 'empty', 'empty', 'cross']), makeGrid(2, ['empty', 'cross', 'cross', 'cross']), makeGrid(2, ['circle', 'cross', 'cross', 'empty']), makeGrid(2, ['empty', 'empty', 'cross', 'circle'])], correctIndex: 0 },
];

// ─── 3×3 固定問題 ───

const FIXED_3x3_QUESTIONS: FixedOverlayCancelQ[] = [
  // 問題1
  {
    leftGrid: makeGrid(3, ['circle', 'empty', 'cross', 'empty', 'circle', 'empty', 'cross', 'empty', 'circle']),
    rightGrid: makeGrid(3, ['empty', 'cross', 'empty', 'circle', 'empty', 'cross', 'empty', 'circle', 'empty']),
    choices: [
      makeGrid(3, ['cross', 'cross', 'circle', 'circle', 'circle', 'cross', 'circle', 'circle', 'cross']),
      makeGrid(3, ['empty', 'cross', 'circle', 'circle', 'circle', 'cross', 'circle', 'circle', 'cross']),
      makeGrid(3, ['cross', 'cross', 'circle', 'cross', 'circle', 'cross', 'circle', 'circle', 'cross']),
      makeGrid(3, ['cross', 'empty', 'circle', 'circle', 'circle', 'cross', 'circle', 'circle', 'empty']),
    ],
    correctIndex: 0,
  },
  // 問題2
  {
    leftGrid: makeGrid(3, ['cross', 'circle', 'cross', 'empty', 'empty', 'empty', 'circle', 'empty', 'cross']),
    rightGrid: makeGrid(3, ['cross', 'empty', 'cross', 'circle', 'cross', 'circle', 'empty', 'circle', 'empty']),
    choices: [
      makeGrid(3, ['cross', 'circle', 'cross', 'circle', 'cross', 'circle', 'cross', 'circle', 'circle']),
      makeGrid(3, ['cross', 'circle', 'cross', 'circle', 'cross', 'circle', 'cross', 'circle', 'empty']),
      makeGrid(3, ['cross', 'circle', 'cross', 'circle', 'cross', 'circle', 'cross', 'cross', 'circle']),
      makeGrid(3, ['empty', 'circle', 'cross', 'circle', 'cross', 'circle', 'cross', 'circle', 'circle']),
    ],
    correctIndex: 0,
  },
  // 問題3
  {
    leftGrid: makeGrid(3, ['circle', 'cross', 'empty', 'cross', 'empty', 'circle', 'empty', 'circle', 'cross']),
    rightGrid: makeGrid(3, ['cross', 'empty', 'circle', 'empty', 'cross', 'empty', 'circle', 'empty', 'cross']),
    choices: [
      makeGrid(3, ['cross', 'cross', 'circle', 'circle', 'cross', 'cross', 'empty', 'circle', 'cross']),
      makeGrid(3, ['cross', 'cross', 'circle', 'empty', 'cross', 'cross', 'cross', 'empty', 'cross']),
      makeGrid(3, ['circle', 'cross', 'circle', 'circle', 'circle', 'cross', 'empty', 'circle', 'circle']),
      makeGrid(3, ['cross', 'cross', 'cross', 'cross', 'cross', 'empty', 'empty', 'circle', 'cross']),
    ],
    correctIndex: 0,
  },
  // 問題4
  {
    leftGrid: makeGrid(3, ['empty', 'circle', 'empty', 'circle', 'cross', 'circle', 'empty', 'circle', 'empty']),
    rightGrid: makeGrid(3, ['cross', 'empty', 'cross', 'empty', 'empty', 'empty', 'cross', 'empty', 'cross']),
    choices: [
      makeGrid(3, ['cross', 'circle', 'cross', 'circle', 'cross', 'circle', 'cross', 'circle', 'cross']),
      makeGrid(3, ['cross', 'circle', 'cross', 'empty', 'cross', 'circle', 'cross', 'circle', 'cross']),
      makeGrid(3, ['cross', 'empty', 'circle', 'circle', 'cross', 'cross', 'cross', 'circle', 'cross']),
      makeGrid(3, ['empty', 'circle', 'cross', 'circle', 'cross', 'circle', 'circle', 'cross', 'cross']),
    ],
    correctIndex: 0,
  },
  // 問題5
  {
    leftGrid: makeGrid(3, ['circle', 'circle', 'empty', 'cross', 'empty', 'cross', 'empty', 'circle', 'circle']),
    rightGrid: makeGrid(3, ['empty', 'cross', 'circle', 'circle', 'circle', 'empty', 'cross', 'empty', 'empty']),
    choices: [
      makeGrid(3, ['empty', 'empty', 'circle', 'empty', 'circle', 'cross', 'empty', 'circle', 'empty']),
      makeGrid(3, ['empty', 'empty', 'circle', 'empty', 'cross', 'cross', 'empty', 'circle', 'empty']),
      makeGrid(3, ['empty', 'empty', 'circle', 'empty', 'circle', 'empty', 'empty', 'circle', 'empty']),
      makeGrid(3, ['empty', 'circle', 'circle', 'empty', 'circle', 'cross', 'cross', 'circle', 'empty']),
    ],
    correctIndex: 0,
  },
  // 問題6
  {
    leftGrid: makeGrid(3, ['cross', 'circle', 'cross', 'circle', 'cross', 'circle', 'cross', 'circle', 'cross']),
    rightGrid: makeGrid(3, ['empty', 'cross', 'empty', 'cross', 'empty', 'cross', 'empty', 'cross', 'empty']),
    choices: [
      makeGrid(3, ['cross', 'empty', 'cross', 'empty', 'cross', 'empty', 'cross', 'empty', 'cross']),
      makeGrid(3, ['cross', 'cross', 'cross', 'circle', 'cross', 'empty', 'empty', 'empty', 'cross']),
      makeGrid(3, ['cross', 'empty', 'cross', 'empty', 'cross', 'empty', 'circle', 'empty', 'circle']),
      makeGrid(3, ['empty', 'empty', 'cross', 'empty', 'cross', 'empty', 'cross', 'empty', 'cross']),
    ],
    correctIndex: 0,
  },
  // 問題7
  {
    leftGrid: makeGrid(3, ['circle', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'cross']),
    rightGrid: makeGrid(3, ['cross', 'circle', 'cross', 'circle', 'cross', 'circle', 'cross', 'circle', 'cross']),
    choices: [
      makeGrid(3, ['cross', 'circle', 'empty', 'circle', 'cross', 'circle', 'cross', 'circle', 'cross']),
      makeGrid(3, ['cross', 'circle', 'empty', 'cross', 'empty', 'circle', 'cross', 'cross', 'cross']),
      makeGrid(3, ['cross', 'cross', 'empty', 'cross', 'circle', 'circle', 'cross', 'circle', 'cross']),
      makeGrid(3, ['cross', 'circle', 'cross', 'cross', 'cross', 'circle', 'cross', 'circle', 'cross']),
    ],
    correctIndex: 0,
  },
  // 問題8
  {
    leftGrid: makeGrid(3, ['cross', 'empty', 'circle', 'empty', 'empty', 'empty', 'circle', 'empty', 'cross']),
    rightGrid: makeGrid(3, ['circle', 'empty', 'cross', 'empty', 'circle', 'empty', 'cross', 'empty', 'circle']),
    choices: [
      makeGrid(3, ['circle', 'empty', 'cross', 'empty', 'circle', 'empty', 'cross', 'empty', 'circle']),
      makeGrid(3, ['circle', 'empty', 'circle', 'cross', 'empty', 'empty', 'cross', 'empty', 'circle']),
      makeGrid(3, ['circle', 'empty', 'cross', 'empty', 'circle', 'empty', 'cross', 'empty', 'empty']),
      makeGrid(3, ['circle', 'empty', 'empty', 'empty', 'circle', 'empty', 'cross', 'empty', 'cross']),
    ],
    correctIndex: 0,
  },
  // 問題9
  {
    leftGrid: makeGrid(3, ['circle', 'circle', 'circle', 'empty', 'empty', 'empty', 'cross', 'cross', 'cross']),
    rightGrid: makeGrid(3, ['empty', 'cross', 'empty', 'circle', 'empty', 'cross', 'empty', 'circle', 'empty']),
    choices: [
      makeGrid(3, ['circle', 'empty', 'circle', 'circle', 'empty', 'cross', 'cross', 'empty', 'cross']),
      makeGrid(3, ['circle', 'empty', 'circle', 'circle', 'empty', 'cross', 'empty', 'empty', 'empty']),
      makeGrid(3, ['circle', 'empty', 'circle', 'circle', 'empty', 'empty', 'cross', 'empty', 'cross']),
      makeGrid(3, ['circle', 'empty', 'circle', 'cross', 'empty', 'cross', 'cross', 'empty', 'cross']),
    ],
    correctIndex: 0,
  },
  // 問題10
  {
    leftGrid: makeGrid(3, ['cross', 'empty', 'circle', 'cross', 'empty', 'circle', 'cross', 'empty', 'circle']),
    rightGrid: makeGrid(3, ['circle', 'cross', 'empty', 'circle', 'cross', 'empty', 'circle', 'cross', 'empty']),
    choices: [
      makeGrid(3, ['circle', 'cross', 'cross', 'circle', 'cross', 'cross', 'circle', 'cross', 'cross']),
      makeGrid(3, ['circle', 'cross', 'cross', 'circle', 'cross', 'empty', 'circle', 'cross', 'circle']),
      makeGrid(3, ['circle', 'cross', 'empty', 'circle', 'circle', 'cross', 'circle', 'cross', 'cross']),
      makeGrid(3, ['circle', 'cross', 'cross', 'circle', 'cross', 'cross', 'cross', 'cross', 'empty']),
    ],
    correctIndex: 0,
  },
];

// ─── 4×4 固定問題 ───

const FIXED_4x4_QUESTIONS: FixedOverlayCancelQ[] = [
  // 問題1: 対角線パターン
  {
    leftGrid: makeGrid(4, ['circle', 'empty', 'empty', 'cross', 'empty', 'cross', 'empty', 'empty', 'empty', 'empty', 'circle', 'empty', 'cross', 'empty', 'empty', 'circle']),
    rightGrid: makeGrid(4, ['empty', 'circle', 'cross', 'empty', 'cross', 'empty', 'circle', 'empty', 'empty', 'circle', 'empty', 'cross', 'empty', 'cross', 'circle', 'empty']),
    choices: [
      makeGrid(4, ['cross', 'circle', 'cross', 'circle', 'cross', 'empty', 'empty', 'empty', 'empty', 'circle', 'empty', 'cross', 'circle', 'cross', 'circle', 'cross']),
      makeGrid(4, ['cross', 'circle', 'cross', 'circle', 'cross', 'empty', 'empty', 'empty', 'cross', 'circle', 'empty', 'cross', 'cross', 'cross', 'circle', 'cross']),
      makeGrid(4, ['cross', 'circle', 'cross', 'circle', 'cross', 'empty', 'empty', 'empty', 'empty', 'circle', 'empty', 'circle', 'circle', 'cross', 'circle', 'cross']),
      makeGrid(4, ['circle', 'circle', 'cross', 'circle', 'cross', 'empty', 'empty', 'circle', 'empty', 'empty', 'empty', 'cross', 'circle', 'cross', 'circle', 'cross']),
    ],
    correctIndex: 0,
  },
  // 問題2: 枠パターン
  {
    leftGrid: makeGrid(4, ['cross', 'cross', 'cross', 'cross', 'cross', 'empty', 'empty', 'cross', 'cross', 'empty', 'empty', 'cross', 'cross', 'cross', 'cross', 'cross']),
    rightGrid: makeGrid(4, ['empty', 'empty', 'empty', 'empty', 'empty', 'circle', 'circle', 'empty', 'empty', 'circle', 'circle', 'empty', 'empty', 'empty', 'empty', 'empty']),
    choices: [
      makeGrid(4, ['cross', 'cross', 'cross', 'cross', 'cross', 'circle', 'circle', 'cross', 'cross', 'circle', 'circle', 'cross', 'cross', 'cross', 'cross', 'cross']),
      makeGrid(4, ['cross', 'cross', 'cross', 'cross', 'cross', 'circle', 'circle', 'cross', 'circle', 'circle', 'circle', 'cross', 'cross', 'cross', 'cross', 'cross']),
      makeGrid(4, ['cross', 'cross', 'cross', 'cross', 'empty', 'empty', 'circle', 'cross', 'cross', 'circle', 'empty', 'cross', 'cross', 'cross', 'cross', 'cross']),
      makeGrid(4, ['cross', 'cross', 'cross', 'cross', 'circle', 'circle', 'circle', 'cross', 'empty', 'circle', 'circle', 'empty', 'cross', 'cross', 'cross', 'cross']),
    ],
    correctIndex: 0,
  },
  // 問題3: ストライプ
  {
    leftGrid: makeGrid(4, ['circle', 'empty', 'cross', 'empty', 'circle', 'empty', 'cross', 'empty', 'circle', 'empty', 'cross', 'empty', 'circle', 'empty', 'cross', 'empty']),
    rightGrid: makeGrid(4, ['empty', 'cross', 'empty', 'circle', 'empty', 'cross', 'empty', 'circle', 'empty', 'cross', 'empty', 'circle', 'empty', 'cross', 'empty', 'circle']),
    choices: [
      makeGrid(4, ['empty', 'cross', 'empty', 'circle', 'empty', 'cross', 'empty', 'circle', 'empty', 'cross', 'empty', 'circle', 'empty', 'cross', 'empty', 'circle']),
      makeGrid(4, ['empty', 'circle', 'empty', 'circle', 'empty', 'cross', 'empty', 'circle', 'empty', 'cross', 'empty', 'circle', 'empty', 'cross', 'empty', 'circle']),
      makeGrid(4, ['empty', 'cross', 'empty', 'circle', 'empty', 'cross', 'empty', 'circle', 'empty', 'cross', 'empty', 'circle', 'cross', 'circle', 'empty', 'circle']),
      makeGrid(4, ['empty', 'cross', 'empty', 'circle', 'empty', 'cross', 'circle', 'circle', 'empty', 'cross', 'empty', 'empty', 'cross', 'cross', 'empty', 'circle']),
    ],
    correctIndex: 0,
  },
  // 問題4: 四分割（全相殺）
  {
    leftGrid: makeGrid(4, ['circle', 'circle', 'empty', 'empty', 'circle', 'circle', 'empty', 'empty', 'empty', 'empty', 'cross', 'cross', 'empty', 'empty', 'cross', 'cross']),
    rightGrid: makeGrid(4, ['empty', 'empty', 'cross', 'cross', 'empty', 'empty', 'cross', 'cross', 'circle', 'circle', 'empty', 'empty', 'circle', 'circle', 'empty', 'empty']),
    choices: [
      makeGrid(4, ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty']),
      makeGrid(4, ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'cross', 'empty', 'empty', 'empty']),
      makeGrid(4, ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'cross', 'empty', 'circle', 'empty', 'empty', 'circle', 'empty']),
      makeGrid(4, ['cross', 'empty', 'empty', 'circle', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty']),
    ],
    correctIndex: 0,
  },
  // 問題5: 散らばり（全相殺）
  {
    leftGrid: makeGrid(4, ['cross', 'empty', 'circle', 'empty', 'empty', 'circle', 'empty', 'cross', 'circle', 'empty', 'cross', 'empty', 'empty', 'cross', 'empty', 'circle']),
    rightGrid: makeGrid(4, ['empty', 'cross', 'empty', 'circle', 'circle', 'empty', 'cross', 'empty', 'empty', 'circle', 'empty', 'cross', 'cross', 'empty', 'circle', 'empty']),
    choices: [
      makeGrid(4, ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty']),
      makeGrid(4, ['empty', 'circle', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'cross', 'cross', 'empty', 'empty', 'empty', 'empty', 'empty']),
      makeGrid(4, ['empty', 'empty', 'cross', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty']),
      makeGrid(4, ['empty', 'empty', 'empty', 'cross', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'circle', 'cross', 'empty', 'empty']),
    ],
    correctIndex: 0,
  },
  // 問題6: X字（全相殺）
  {
    leftGrid: makeGrid(4, ['circle', 'empty', 'empty', 'circle', 'empty', 'cross', 'cross', 'empty', 'empty', 'cross', 'cross', 'empty', 'circle', 'empty', 'empty', 'circle']),
    rightGrid: makeGrid(4, ['cross', 'empty', 'empty', 'cross', 'empty', 'circle', 'circle', 'empty', 'empty', 'circle', 'circle', 'empty', 'cross', 'empty', 'empty', 'cross']),
    choices: [
      makeGrid(4, ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty']),
      makeGrid(4, ['empty', 'cross', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'cross', 'empty', 'empty', 'empty', 'empty', 'cross', 'empty']),
      makeGrid(4, ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'cross', 'empty', 'empty', 'empty', 'empty', 'cross', 'empty', 'empty', 'empty']),
      makeGrid(4, ['empty', 'empty', 'circle', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty']),
    ],
    correctIndex: 0,
  },
  // 問題7: 行交互
  {
    leftGrid: makeGrid(4, ['circle', 'cross', 'circle', 'cross', 'empty', 'empty', 'empty', 'empty', 'cross', 'circle', 'cross', 'circle', 'empty', 'empty', 'empty', 'empty']),
    rightGrid: makeGrid(4, ['empty', 'empty', 'empty', 'empty', 'circle', 'cross', 'circle', 'cross', 'empty', 'empty', 'empty', 'empty', 'cross', 'circle', 'cross', 'circle']),
    choices: [
      makeGrid(4, ['cross', 'circle', 'cross', 'circle', 'circle', 'cross', 'circle', 'cross', 'circle', 'cross', 'circle', 'cross', 'cross', 'circle', 'cross', 'circle']),
      makeGrid(4, ['cross', 'circle', 'cross', 'circle', 'circle', 'cross', 'circle', 'cross', 'circle', 'cross', 'circle', 'cross', 'empty', 'circle', 'cross', 'circle']),
      makeGrid(4, ['cross', 'circle', 'cross', 'cross', 'circle', 'cross', 'circle', 'cross', 'circle', 'cross', 'circle', 'cross', 'cross', 'circle', 'cross', 'circle']),
      makeGrid(4, ['cross', 'empty', 'cross', 'circle', 'circle', 'cross', 'cross', 'cross', 'circle', 'cross', 'circle', 'cross', 'cross', 'circle', 'cross', 'cross']),
    ],
    correctIndex: 0,
  },
  // 問題8: 密集パターン
  {
    leftGrid: makeGrid(4, ['cross', 'circle', 'empty', 'cross', 'circle', 'empty', 'cross', 'circle', 'empty', 'cross', 'circle', 'empty', 'cross', 'circle', 'empty', 'cross']),
    rightGrid: makeGrid(4, ['circle', 'empty', 'cross', 'circle', 'empty', 'cross', 'circle', 'empty', 'cross', 'circle', 'empty', 'cross', 'circle', 'empty', 'cross', 'circle']),
    choices: [
      makeGrid(4, ['empty', 'empty', 'empty', 'empty', 'circle', 'cross', 'circle', 'circle', 'cross', 'circle', 'cross', 'cross', 'empty', 'empty', 'empty', 'empty']),
      makeGrid(4, ['empty', 'empty', 'empty', 'empty', 'circle', 'cross', 'circle', 'empty', 'cross', 'circle', 'cross', 'cross', 'empty', 'empty', 'empty', 'empty']),
      makeGrid(4, ['empty', 'empty', 'empty', 'cross', 'circle', 'cross', 'circle', 'circle', 'cross', 'circle', 'cross', 'circle', 'empty', 'empty', 'empty', 'empty']),
      makeGrid(4, ['cross', 'empty', 'circle', 'empty', 'circle', 'empty', 'circle', 'circle', 'cross', 'circle', 'cross', 'cross', 'empty', 'empty', 'empty', 'empty']),
    ],
    correctIndex: 0,
  },
];

// ─── 出題インデックス管理 ───

let currentIndex2x2 = 0;
let currentIndex3x3 = 0;
let currentIndex4x4 = 0;

const INSTRUCTION_TEXT = '左をパタンと右におると\nどうなりますか？\n（○と×がかさなるときえます）';

// ─── 2×2 ───

/** 2×2問題を順番に生成する */
export function generateOverlayCancel2x2Question(): Question<OverlayCancelQuestionData, OverlayCancelChoiceData> {
  const questions = getAllOverlayCancel2x2Questions();
  const question = questions[currentIndex2x2 % questions.length];
  currentIndex2x2++;
  return question;
}

/** 2×2固定問題プールの全問題を返す */
export function getAllOverlayCancel2x2Questions(): Question<OverlayCancelQuestionData, OverlayCancelChoiceData>[] {
  return FIXED_2x2_QUESTIONS.map((fixedQ) => ({
    questionData: { leftGrid: fixedQ.leftGrid, rightGrid: fixedQ.rightGrid },
    choices: fixedQ.choices,
    correctIndex: fixedQ.correctIndex,
    instructionText: INSTRUCTION_TEXT,
  }));
}

// ─── 3×3 ───

/** 3×3問題を順番に生成する */
export function generateOverlayCancel3x3Question(): Question<OverlayCancelQuestionData, OverlayCancelChoiceData> {
  const questions = getAllOverlayCancel3x3Questions();
  const question = questions[currentIndex3x3 % questions.length];
  currentIndex3x3++;
  return question;
}

/** 3×3固定問題プールの全問題を返す */
export function getAllOverlayCancel3x3Questions(): Question<OverlayCancelQuestionData, OverlayCancelChoiceData>[] {
  return FIXED_3x3_QUESTIONS.map((fixedQ) => ({
    questionData: { leftGrid: fixedQ.leftGrid, rightGrid: fixedQ.rightGrid },
    choices: fixedQ.choices,
    correctIndex: fixedQ.correctIndex,
    instructionText: INSTRUCTION_TEXT,
  }));
}

// ─── 4×4 ───

/** 4×4問題を順番に生成する */
export function generateOverlayCancel4x4Question(): Question<OverlayCancelQuestionData, OverlayCancelChoiceData> {
  const questions = getAllOverlayCancel4x4Questions();
  const question = questions[currentIndex4x4 % questions.length];
  currentIndex4x4++;
  return question;
}

/** 4×4固定問題プールの全問題を返す */
export function getAllOverlayCancel4x4Questions(): Question<OverlayCancelQuestionData, OverlayCancelChoiceData>[] {
  return FIXED_4x4_QUESTIONS.map((fixedQ) => ({
    questionData: { leftGrid: fixedQ.leftGrid, rightGrid: fixedQ.rightGrid },
    choices: fixedQ.choices,
    correctIndex: fixedQ.correctIndex,
    instructionText: INSTRUCTION_TEXT,
  }));
}

// ─── 後方互換（既存のexport名を維持） ───

/** 問題を順番に生成する（2×2、後方互換） */
export function generateOverlayCancelQuestion(): Question<OverlayCancelQuestionData, OverlayCancelChoiceData> {
  return generateOverlayCancel2x2Question();
}

/** 固定問題プールの全問題を返す（2×2、後方互換） */
export function getAllOverlayCancelQuestions(): Question<OverlayCancelQuestionData, OverlayCancelChoiceData>[] {
  return getAllOverlayCancel2x2Questions();
}

/** 正解判定 */
export function checkOverlayCancelAnswer(
  question: Question<OverlayCancelQuestionData, OverlayCancelChoiceData>,
  selectedIndex: number
): boolean {
  return selectedIndex === question.correctIndex;
}
