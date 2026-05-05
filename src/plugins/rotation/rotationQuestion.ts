import type { Question } from '../../types/question';
import type { Grid, GridData, GridSize, RotationDirection, RotationQuestionData, RotationChoiceData } from './types';
import { gridToGridData } from './types';

// ─── 汎用NxN回転関数 ───

/**
 * NxNグリッドを右に90度回転する（時計回り）
 * 位置 (row, col) → (col, N-1-row)
 */
export function rotateGridDataRight90(grid: GridData): GridData {
  const n = grid.size;
  const newCells: boolean[] = new Array(n * n);
  for (let row = 0; row < n; row++) {
    for (let col = 0; col < n; col++) {
      const oldIndex = row * n + col;
      const newRow = col;
      const newCol = n - 1 - row;
      const newIndex = newRow * n + newCol;
      newCells[newIndex] = grid.cells[oldIndex];
    }
  }
  return { size: n, cells: newCells };
}

/**
 * NxNグリッドを左に90度回転する（反時計回り）
 * 位置 (row, col) → (N-1-col, row)
 */
export function rotateGridDataLeft90(grid: GridData): GridData {
  const n = grid.size;
  const newCells: boolean[] = new Array(n * n);
  for (let row = 0; row < n; row++) {
    for (let col = 0; col < n; col++) {
      const oldIndex = row * n + col;
      const newRow = n - 1 - col;
      const newCol = row;
      const newIndex = newRow * n + newCol;
      newCells[newIndex] = grid.cells[oldIndex];
    }
  }
  return { size: n, cells: newCells };
}

/**
 * NxNグリッドを180度回転する
 */
export function rotateGridData180(grid: GridData): GridData {
  const n = grid.size;
  const newCells: boolean[] = new Array(n * n);
  for (let i = 0; i < n * n; i++) {
    newCells[n * n - 1 - i] = grid.cells[i];
  }
  return { size: n, cells: newCells };
}

/** 指定方向にGridDataを回転する */
export function rotateGridData(grid: GridData, direction: RotationDirection): GridData {
  switch (direction) {
    case 'right1':
      return rotateGridDataRight90(grid);
    case 'left1':
      return rotateGridDataLeft90(grid);
    case 'right2':
      return rotateGridData180(grid);
    case 'left2':
      return rotateGridData180(grid);
  }
}

/** 2つのGridDataが同一か判定する */
export function gridDataEqual(a: GridData, b: GridData): boolean {
  if (a.size !== b.size) return false;
  return a.cells.every((v, i) => v === b.cells[i]);
}

// ─── 後方互換性のための2×2関数 ───

export function rotateRight90(grid: Grid): Grid {
  return [grid[2], grid[0], grid[3], grid[1]];
}

export function rotateLeft90(grid: Grid): Grid {
  return [grid[1], grid[3], grid[0], grid[2]];
}

export function rotate180(grid: Grid): Grid {
  return [grid[3], grid[2], grid[1], grid[0]];
}

export function rotateGrid(grid: Grid, direction: RotationDirection): Grid {
  switch (direction) {
    case 'right1':
      return rotateRight90(grid);
    case 'left1':
      return rotateLeft90(grid);
    case 'right2':
      return rotate180(grid);
    case 'left2':
      return rotate180(grid);
  }
}

export function gridsEqual(a: Grid, b: Grid): boolean {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
}

// ─── ランダムグリッド生成 ───

/** 指定サイズのランダムグリッドを生成する */
export function generateRandomGrid(size: GridSize = 2): GridData {
  const totalCells = size * size;
  let minFilled: number;
  let maxFilled: number;

  switch (size) {
    case 2:
      minFilled = 1;
      maxFilled = 3;
      break;
    case 3:
      minFilled = 2;
      maxFilled = 5;
      break;
    case 4:
      minFilled = 3;
      maxFilled = 8;
      break;
  }

  const filledCount = minFilled + Math.floor(Math.random() * (maxFilled - minFilled + 1));
  const cells: boolean[] = new Array(totalCells).fill(false);

  // ランダムにfilledCount個のセルを塗る
  const indices = Array.from({ length: totalCells }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  for (let i = 0; i < filledCount; i++) {
    cells[indices[i]] = true;
  }

  return { size, cells };
}

/** 不正解の選択肢を生成する（正解と異なるグリッド） */
function generateDistractor(correctGrid: GridData): GridData {
  const n = correctGrid.size;
  const totalCells = n * n;

  // 正解グリッドの1-2セルをランダムに反転
  const cells = [...correctGrid.cells];
  const numFlips = 1 + Math.floor(Math.random() * 2);
  for (let i = 0; i < numFlips; i++) {
    const idx = Math.floor(Math.random() * totalCells);
    cells[idx] = !cells[idx];
  }

  // 全部同じにならないようにチェック
  const allSame = cells.every((v, i) => v === correctGrid.cells[i]);
  if (allSame) {
    const idx = Math.floor(Math.random() * totalCells);
    cells[idx] = !cells[idx];
  }

  return { size: n, cells };
}

/** ユニークな不正解選択肢を3つ生成する */
function generateDistractors(correctGrid: GridData): GridData[] {
  const distractors: GridData[] = [];
  let attempts = 0;
  while (distractors.length < 3 && attempts < 50) {
    const d = generateDistractor(correctGrid);
    const isDuplicate = distractors.some(existing => gridDataEqual(existing, d)) ||
      gridDataEqual(d, correctGrid);
    if (!isDuplicate) {
      distractors.push(d);
    }
    attempts++;
  }
  // フォールバック: 足りない場合は回転バリエーションを追加
  while (distractors.length < 3) {
    const rotated = rotateGridDataRight90(correctGrid);
    const flipped = { ...rotated, cells: rotated.cells.map((v, i) => i === 0 ? !v : v) };
    distractors.push(flipped);
  }
  return distractors;
}

// ─── 指示テキスト ───

function getInstructionText(direction: RotationDirection): string {
  switch (direction) {
    case 'right1':
      return '右に1かいまわすと\nどれになりますか？';
    case 'left1':
      return '左に1かいまわすと\nどれになりますか？';
    case 'right2':
      return '右に2かいまわすと\nどれになりますか？';
    case 'left2':
      return '左に2かいまわすと\nどれになりますか？';
  }
}

// ─── 固定問題プール（2×2、既存20問） ───

interface FixedRotationQ {
  originalGrid: Grid;
  direction: RotationDirection;
  choices: Grid[];
  correctIndex: number;
}

const FIXED_QUESTIONS_2x2: FixedRotationQ[] = [
  { originalGrid: [true, false, false, true], direction: 'right1', choices: [[false, true, true, true], [false, true, true, false], [true, false, true, false], [true, true, false, false]], correctIndex: 0 },
  { originalGrid: [true, false, false, true], direction: 'left1', choices: [[true, true, false, true], [false, true, true, false], [true, true, false, false], [false, false, true, true]], correctIndex: 0 },
  { originalGrid: [true, false, false, true], direction: 'right2', choices: [[false, true, false, false], [true, false, false, true], [false, true, true, false], [true, true, false, false]], correctIndex: 1 },
  { originalGrid: [true, true, false, false], direction: 'right1', choices: [[false, true, true, false], [false, true, false, true], [true, false, true, false], [true, false, false, true]], correctIndex: 1 },
  { originalGrid: [true, true, false, false], direction: 'left1', choices: [[false, true, true, false], [true, false, false, true], [true, false, true, false], [false, false, true, true]], correctIndex: 2 },
  { originalGrid: [true, false, true, false], direction: 'right1', choices: [[true, true, false, false], [false, true, false, true], [false, false, true, true], [true, false, true, false]], correctIndex: 0 },
  { originalGrid: [true, false, true, false], direction: 'left1', choices: [[false, false, true, true], [true, true, false, false], [false, true, false, true], [true, false, false, true]], correctIndex: 2 },
  { originalGrid: [true, false, true, false], direction: 'right2', choices: [[false, true, false, true], [true, false, true, false], [true, true, false, false], [false, false, true, true]], correctIndex: 0 },
  { originalGrid: [false, true, true, false], direction: 'right1', choices: [[true, false, false, true], [false, true, true, false], [true, true, false, false], [false, false, true, true]], correctIndex: 0 },
  { originalGrid: [false, true, true, false], direction: 'left1', choices: [[true, false, false, true], [false, true, true, false], [true, true, false, false], [false, false, true, true]], correctIndex: 0 },
  { originalGrid: [true, true, true, false], direction: 'right1', choices: [[true, true, false, true], [false, true, true, false], [true, false, true, false], [false, true, false, true]], correctIndex: 0 },
  { originalGrid: [true, true, true, false], direction: 'left1', choices: [[true, false, true, true], [false, true, true, false], [true, true, false, false], [false, false, true, true]], correctIndex: 0 },
  { originalGrid: [true, true, true, false], direction: 'right2', choices: [[false, true, true, true], [true, false, true, true], [true, true, false, false], [false, false, true, true]], correctIndex: 0 },
  { originalGrid: [true, false, true, true], direction: 'left2', choices: [[true, true, false, true], [false, true, true, false], [true, false, true, false], [true, true, true, false]], correctIndex: 0 },
  { originalGrid: [false, true, true, true], direction: 'right1', choices: [[true, false, true, true], [false, true, true, false], [true, true, false, false], [true, true, false, true]], correctIndex: 3 },
  { originalGrid: [false, true, true, true], direction: 'left1', choices: [[true, true, false, false], [true, true, true, false], [false, true, false, true], [true, true, false, true]], correctIndex: 1 },
  { originalGrid: [true, false, false, false], direction: 'right1', choices: [[false, true, false, false], [true, false, false, false], [false, false, true, false], [false, false, false, true]], correctIndex: 2 },
  { originalGrid: [true, false, false, false], direction: 'left1', choices: [[false, true, false, false], [true, false, false, false], [false, false, true, false], [false, false, false, true]], correctIndex: 0 },
  { originalGrid: [false, false, true, false], direction: 'right1', choices: [[false, false, false, true], [true, false, false, false], [false, true, false, false], [false, false, true, false]], correctIndex: 0 },
  { originalGrid: [false, false, true, false], direction: 'left1', choices: [[true, false, false, false], [false, true, false, false], [false, false, false, true], [false, false, true, false]], correctIndex: 0 },
];

// ─── 固定問題プール（3×3） ───

interface FixedGridDataQ {
  originalGrid: GridData;
  direction: RotationDirection;
  choices: GridData[];
  correctIndex: number;
}

const FIXED_QUESTIONS_3x3: FixedGridDataQ[] = [
  {
    originalGrid: { size: 3, cells: [true, false, false, false, true, false, false, false, true] },
    direction: 'right1',
    choices: [
      { size: 3, cells: [false, false, true, false, true, false, true, false, false] },
      { size: 3, cells: [true, false, false, false, true, false, false, false, true] },
      { size: 3, cells: [false, true, false, false, true, false, false, true, false] },
      { size: 3, cells: [true, true, false, false, false, false, false, true, true] },
    ],
    correctIndex: 0,
  },
  {
    originalGrid: { size: 3, cells: [true, true, false, false, false, false, false, false, true] },
    direction: 'right1',
    choices: [
      { size: 3, cells: [false, false, true, false, false, true, true, false, false] },
      { size: 3, cells: [false, false, true, false, false, false, true, true, false] },
      { size: 3, cells: [true, false, false, true, false, false, false, false, true] },
      { size: 3, cells: [false, false, false, false, true, true, true, false, false] },
    ],
    correctIndex: 0,
  },
  {
    originalGrid: { size: 3, cells: [true, true, true, false, false, false, false, false, false] },
    direction: 'right1',
    choices: [
      { size: 3, cells: [false, false, true, false, false, true, false, false, true] },
      { size: 3, cells: [true, false, false, true, false, false, true, false, false] },
      { size: 3, cells: [false, false, false, false, false, false, true, true, true] },
      { size: 3, cells: [false, true, false, false, true, false, false, true, false] },
    ],
    correctIndex: 0,
  },
  {
    originalGrid: { size: 3, cells: [true, false, true, false, true, false, true, false, false] },
    direction: 'left1',
    choices: [
      { size: 3, cells: [true, false, false, false, true, false, true, false, true] },
      { size: 3, cells: [false, false, true, false, true, false, true, false, true] },
      { size: 3, cells: [true, false, true, false, true, false, false, false, true] },
      { size: 3, cells: [false, true, true, true, false, false, false, true, false] },
    ],
    correctIndex: 0,
  },
  {
    originalGrid: { size: 3, cells: [false, true, false, true, true, true, false, true, false] },
    direction: 'right1',
    choices: [
      { size: 3, cells: [false, true, false, true, true, true, false, true, false] },
      { size: 3, cells: [true, false, true, false, true, false, true, false, true] },
      { size: 3, cells: [false, true, true, true, true, false, false, true, false] },
      { size: 3, cells: [true, true, false, false, true, true, false, false, true] },
    ],
    correctIndex: 0,
  },
  {
    originalGrid: { size: 3, cells: [true, true, false, true, false, false, false, false, false] },
    direction: 'left1',
    choices: [
      { size: 3, cells: [false, false, false, false, false, true, false, true, true] },
      { size: 3, cells: [false, true, true, false, false, true, false, false, false] },
      { size: 3, cells: [false, false, false, true, false, false, true, true, false] },
      { size: 3, cells: [true, false, false, true, false, false, false, true, false] },
    ],
    correctIndex: 1,
  },
  {
    originalGrid: { size: 3, cells: [false, false, true, false, true, true, false, false, true] },
    direction: 'right2',
    choices: [
      { size: 3, cells: [true, false, false, true, true, false, true, false, false] },
      { size: 3, cells: [false, true, false, true, true, false, false, false, true] },
      { size: 3, cells: [true, false, false, false, true, false, true, true, false] },
      { size: 3, cells: [false, false, true, true, false, true, false, true, false] },
    ],
    correctIndex: 0,
  },
  {
    originalGrid: { size: 3, cells: [true, false, false, true, true, false, true, true, true] },
    direction: 'right1',
    choices: [
      { size: 3, cells: [true, true, true, true, true, false, true, false, false] },
      { size: 3, cells: [true, false, true, true, true, false, false, false, true] },
      { size: 3, cells: [false, false, true, false, true, true, true, true, true] },
      { size: 3, cells: [true, true, false, false, true, true, true, true, false] },
    ],
    correctIndex: 0,
  },
];

// ─── 固定問題プール（4×4） ───

const FIXED_QUESTIONS_4x4: FixedGridDataQ[] = [
  {
    originalGrid: { size: 4, cells: [true, false, false, false, false, true, false, false, false, false, true, false, false, false, false, true] },
    direction: 'right1',
    choices: [
      { size: 4, cells: [false, false, false, true, false, false, true, false, false, true, false, false, true, false, false, false] },
      { size: 4, cells: [true, false, false, false, false, true, false, false, false, false, true, false, false, false, false, true] },
      { size: 4, cells: [false, false, false, false, true, false, false, true, false, true, false, false, false, false, true, false] },
      { size: 4, cells: [false, true, false, false, false, false, true, false, false, false, false, true, true, false, false, false] },
    ],
    correctIndex: 0,
  },
  {
    originalGrid: { size: 4, cells: [true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false] },
    direction: 'right1',
    choices: [
      { size: 4, cells: [false, false, false, true, false, false, false, true, false, false, false, true, false, false, false, true] },
      { size: 4, cells: [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false] },
      { size: 4, cells: [false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true] },
      { size: 4, cells: [false, true, false, false, false, true, false, false, false, true, false, false, false, true, false, false] },
    ],
    correctIndex: 0,
  },
  {
    originalGrid: { size: 4, cells: [true, true, false, false, true, true, false, false, false, false, false, false, false, false, false, false] },
    direction: 'left1',
    choices: [
      { size: 4, cells: [false, false, false, false, false, false, false, false, true, true, false, false, true, true, false, false] },
      { size: 4, cells: [false, false, true, true, false, false, true, true, false, false, false, false, false, false, false, false] },
      { size: 4, cells: [true, true, false, false, true, true, false, false, false, false, false, false, false, false, false, false] },
      { size: 4, cells: [false, false, false, false, true, true, false, false, true, true, false, false, false, false, false, false] },
    ],
    correctIndex: 1,
  },
  {
    originalGrid: { size: 4, cells: [true, false, false, true, false, true, true, false, false, true, true, false, true, false, false, true] },
    direction: 'right2',
    choices: [
      { size: 4, cells: [true, false, false, true, false, true, true, false, false, true, true, false, true, false, false, true] },
      { size: 4, cells: [false, true, true, false, true, false, false, true, true, false, false, true, false, true, true, false] },
      { size: 4, cells: [true, true, false, false, false, false, true, true, true, true, false, false, false, false, true, true] },
      { size: 4, cells: [false, false, true, true, true, true, false, false, false, false, true, true, true, true, false, false] },
    ],
    correctIndex: 0,
  },
  {
    originalGrid: { size: 4, cells: [true, true, true, false, true, false, false, false, false, false, false, false, false, false, false, false] },
    direction: 'right1',
    choices: [
      { size: 4, cells: [false, false, false, true, false, false, false, true, false, false, false, true, false, false, false, false] },
      { size: 4, cells: [false, true, false, false, false, false, false, false, false, false, false, false, true, true, true, false] },
      { size: 4, cells: [false, false, false, false, false, false, false, true, false, false, false, true, false, false, false, true] },
      { size: 4, cells: [false, false, false, false, false, false, false, false, false, false, false, true, false, false, true, true] },
    ],
    correctIndex: 0,
  },
  {
    originalGrid: { size: 4, cells: [false, false, false, true, false, false, true, false, false, true, false, false, true, false, false, false] },
    direction: 'left1',
    choices: [
      { size: 4, cells: [true, false, false, false, false, true, false, false, false, false, true, false, false, false, false, true] },
      { size: 4, cells: [false, false, false, false, false, false, false, false, true, true, true, true, false, false, false, false] },
      { size: 4, cells: [true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false] },
      { size: 4, cells: [false, false, true, false, false, true, false, false, true, false, false, false, false, false, false, true] },
    ],
    correctIndex: 2,
  },
];

// ─── 問題生成 ───

/** 固定2×2問題をGridData形式に変換する */
function convertFixed2x2(fixedQ: FixedRotationQ): FixedGridDataQ {
  return {
    originalGrid: gridToGridData(fixedQ.originalGrid),
    direction: fixedQ.direction,
    choices: fixedQ.choices.map(c => gridToGridData(c)),
    correctIndex: fixedQ.correctIndex,
  };
}

/** 全固定問題を統合 */
function getAllFixedQuestions(): FixedGridDataQ[] {
  const converted2x2 = FIXED_QUESTIONS_2x2.map(convertFixed2x2);
  return [...converted2x2, ...FIXED_QUESTIONS_3x3, ...FIXED_QUESTIONS_4x4];
}

/** 現在の出題インデックス */
let currentIndex = 0;

/** ランダムにグリッドサイズを選択する（40% 2x2, 35% 3x3, 25% 4x4） */
function pickRandomGridSize(): GridSize {
  const r = Math.random();
  if (r < 0.4) return 2;
  if (r < 0.75) return 3;
  return 4;
}

/** ランダムに回転方向を選択する */
function pickRandomDirection(): RotationDirection {
  const directions: RotationDirection[] = ['right1', 'left1', 'right2', 'left2'];
  return directions[Math.floor(Math.random() * directions.length)];
}

/** ランダム問題を生成する */
// @ts-expect-error reserved for future use
function generateRandomQuestion(): Question<RotationQuestionData, RotationChoiceData> {
  const size = pickRandomGridSize();
  const direction = pickRandomDirection();
  const originalGrid = generateRandomGrid(size);
  const correctGrid = rotateGridData(originalGrid, direction);

  // 不正解選択肢を生成
  const distractors = generateDistractors(correctGrid);

  // 正解位置をランダムに決定
  const correctIndex = Math.floor(Math.random() * 4);
  const choices: GridData[] = [...distractors];
  choices.splice(correctIndex, 0, correctGrid);

  return {
    questionData: { originalGrid, direction },
    choices,
    correctIndex,
    instructionText: getInstructionText(direction),
  };
}

/** 問題を順番に生成する（固定問題プールから） */
export function generateRotationQuestion(): Question<RotationQuestionData, RotationChoiceData> {
  const allFixed = getAllFixedQuestions();
  const fixedQ = allFixed[currentIndex % allFixed.length];
  currentIndex++;

  return {
    questionData: {
      originalGrid: fixedQ.originalGrid,
      direction: fixedQ.direction,
    },
    choices: fixedQ.choices,
    correctIndex: fixedQ.correctIndex,
    instructionText: getInstructionText(fixedQ.direction),
  };
}

/** 固定問題プールの全問題を返す */
export function getAllRotationQuestions(): Question<RotationQuestionData, RotationChoiceData>[] {
  return getAllFixedQuestions().map((fixedQ) => ({
    questionData: {
      originalGrid: fixedQ.originalGrid,
      direction: fixedQ.direction,
    },
    choices: fixedQ.choices,
    correctIndex: fixedQ.correctIndex,
    instructionText: getInstructionText(fixedQ.direction),
  }));
}

/** 正解判定関数 */
export function checkAnswer(
  question: Question<RotationQuestionData, RotationChoiceData>,
  selectedIndex: number
): boolean {
  return selectedIndex === question.correctIndex;
}
