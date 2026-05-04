import type { Question } from '../../types/question';
import type {
  CellValue,
  OverlayGrid,
  OverlayResult,
  OverlayQuestionData,
  OverlayChoiceData,
} from './types';

const CELL_VALUES: CellValue[] = ['circle', 'cross', 'empty'];

/** ランダムなセル値を返す */
function randomCell(): CellValue {
  return CELL_VALUES[Math.floor(Math.random() * CELL_VALUES.length)];
}

/**
 * 2つのセルを重ねた結果を計算する
 * ルール:
 * - cross + circle = empty（消える）
 * - circle + cross = empty（消える）
 * - 同じ記号 = そのまま残る
 * - empty + 何か = 何か
 * - 何か + empty = 何か
 */
export function overlayCells(top: CellValue, bottom: CellValue): CellValue {
  if (top === 'empty') return bottom;
  if (bottom === 'empty') return top;
  if (top === bottom) return top;
  // cross + circle or circle + cross → empty
  return 'empty';
}

/** 左列を右列に折り重ねた結果を計算する */
export function computeOverlayResult(grid: OverlayGrid): OverlayResult {
  return [
    overlayCells(grid.left[0], grid.right[0]),
    overlayCells(grid.left[1], grid.right[1]),
  ];
}

/** 2つの結果が同一か判定する */
export function resultsEqual(a: OverlayResult, b: OverlayResult): boolean {
  return a[0] === b[0] && a[1] === b[1];
}

/**
 * 有効なグリッドを生成する
 * 左列に少なくとも1つの非emptyセルを保証する
 */
export function generateRandomGrid(): OverlayGrid {
  let grid: OverlayGrid;
  do {
    grid = {
      left: [randomCell(), randomCell()],
      right: [randomCell(), randomCell()],
    };
  } while (grid.left[0] === 'empty' && grid.left[1] === 'empty');
  return grid;
}

/** ランダムな結果を生成する */
function generateRandomResult(): OverlayResult {
  return [randomCell(), randomCell()];
}

/**
 * 不正解の選択肢を生成する
 * 正解・他の不正解と重複しない
 */
export function generateDistractors(
  correctResult: OverlayResult,
  count: number
): OverlayResult[] {
  const distractors: OverlayResult[] = [];
  let attempts = 0;
  const maxAttempts = 100;

  while (distractors.length < count && attempts < maxAttempts) {
    attempts++;
    const candidate = generateRandomResult();

    if (resultsEqual(candidate, correctResult)) continue;

    const isDuplicate = distractors.some((d) => resultsEqual(d, candidate));
    if (isDuplicate) continue;

    distractors.push(candidate);
  }

  // フォールバック
  while (distractors.length < count) {
    distractors.push(generateRandomResult());
  }

  return distractors;
}

/** 問題を生成する */
export function generateOverlayQuestion(): Question<OverlayQuestionData, OverlayChoiceData> {
  const grid = generateRandomGrid();
  const correctResult = computeOverlayResult(grid);

  const distractors = generateDistractors(correctResult, 3);

  const correctIndex = Math.floor(Math.random() * 4);
  const choices: OverlayChoiceData[] = [...distractors];
  choices.splice(correctIndex, 0, correctResult);

  return {
    questionData: { grid },
    choices,
    correctIndex,
    instructionText: 'パタンとみぎにおると\nどうなりますか？',
  };
}

/** 正解判定関数 */
export function checkOverlayAnswer(
  question: Question<OverlayQuestionData, OverlayChoiceData>,
  selectedIndex: number
): boolean {
  return selectedIndex === question.correctIndex;
}
