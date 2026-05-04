import type { Question } from '../../types/question';
import type { Grid, RotationDirection, RotationQuestionData, RotationChoiceData } from './types';

/**
 * グリッドを右に1回まわす（時計回り90度）
 * [0][1]    [2][0]
 * [2][3] -> [3][1]
 */
export function rotateRight90(grid: Grid): Grid {
  return [grid[2], grid[0], grid[3], grid[1]];
}

/**
 * グリッドを左に1回まわす（反時計回り90度）
 * [0][1]    [1][3]
 * [2][3] -> [0][2]
 */
export function rotateLeft90(grid: Grid): Grid {
  return [grid[1], grid[3], grid[0], grid[2]];
}

/**
 * グリッドを180度回転する（右に2回 = 左に2回）
 * [0][1]    [3][2]
 * [2][3] -> [1][0]
 */
export function rotate180(grid: Grid): Grid {
  return [grid[3], grid[2], grid[1], grid[0]];
}

/** 指定方向にグリッドを回転する */
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

/**
 * 有効なランダムグリッドを生成する
 * 少なくとも1つのtrue、1つのfalseを保証する
 */
export function generateRandomGrid(): Grid {
  let grid: Grid;
  do {
    grid = [
      Math.random() < 0.5,
      Math.random() < 0.5,
      Math.random() < 0.5,
      Math.random() < 0.5,
    ];
  } while (
    grid.every((cell) => cell) || // 全true
    grid.every((cell) => !cell) // 全false
  );
  return grid;
}

/** 2つのグリッドが同一か判定する */
export function gridsEqual(a: Grid, b: Grid): boolean {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
}

/**
 * 不正解の選択肢を生成する
 * 正解・他の不正解と重複しない、最大試行回数100回
 */
export function generateDistractors(correctGrid: Grid, count: number): Grid[] {
  const distractors: Grid[] = [];
  let attempts = 0;
  const maxAttempts = 100;

  while (distractors.length < count && attempts < maxAttempts) {
    attempts++;
    const candidate = generateRandomGrid();

    // 正解と重複しないか確認
    if (gridsEqual(candidate, correctGrid)) continue;

    // 既存の不正解と重複しないか確認
    const isDuplicate = distractors.some((d) => gridsEqual(d, candidate));
    if (isDuplicate) continue;

    distractors.push(candidate);
  }

  // 最大試行回数を超えた場合、残りをランダムグリッドで埋める
  while (distractors.length < count) {
    distractors.push(generateRandomGrid());
  }

  return distractors;
}

/** 回転方向に対応する指示テキストを生成する */
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

/** 問題を生成する */
export function generateRotationQuestion(): Question<RotationQuestionData, RotationChoiceData> {
  const originalGrid = generateRandomGrid();

  // 回転方向のランダム選択
  const directions: RotationDirection[] = ['right1', 'left1', 'right2', 'left2'];
  const direction = directions[Math.floor(Math.random() * directions.length)];

  // 正解のグリッドを計算
  const correctGrid = rotateGrid(originalGrid, direction);

  // 不正解の選択肢を生成
  const distractors = generateDistractors(correctGrid, 3);

  // 正解位置のランダム配置
  const correctIndex = Math.floor(Math.random() * 4);
  const choices: RotationChoiceData[] = [...distractors];
  choices.splice(correctIndex, 0, correctGrid);

  return {
    questionData: {
      originalGrid,
      direction,
    },
    choices,
    correctIndex,
    instructionText: getInstructionText(direction),
  };
}

/** 正解判定関数 */
export function checkAnswer(
  question: Question<RotationQuestionData, RotationChoiceData>,
  selectedIndex: number
): boolean {
  return selectedIndex === question.correctIndex;
}
