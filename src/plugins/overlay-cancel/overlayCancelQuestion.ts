import type { Question } from '../../types/question';
import type { OverlayCancelQuestionData, OverlayCancelChoiceData, CellValue, Grid2x2 } from './types';

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** ランダムなグリッドを生成 */
function generateRandomGrid(): Grid2x2 {
  const values: CellValue[] = ['circle', 'cross', 'empty'];
  return [
    randomItem(values),
    randomItem(values),
    randomItem(values),
    randomItem(values),
  ];
}

/**
 * 左グリッドを右に折り重ねた結果を計算
 * 折り重ね: 左右反転して右に重ねる
 * 相殺ルール: ○と×が重なったら空白になる
 */
export function computeOverlay(leftGrid: Grid2x2, rightGrid: Grid2x2): Grid2x2 {
  // 左グリッドを左右反転（2×2の場合: [0,1,2,3] → [1,0,3,2]）
  const flippedLeft: Grid2x2 = [leftGrid[1], leftGrid[0], leftGrid[3], leftGrid[2]];

  const result: Grid2x2 = ['empty', 'empty', 'empty', 'empty'];

  for (let i = 0; i < 4; i++) {
    const l = flippedLeft[i];
    const r = rightGrid[i];

    if (l === 'empty' && r === 'empty') {
      result[i] = 'empty';
    } else if (l === 'empty') {
      result[i] = r;
    } else if (r === 'empty') {
      result[i] = l;
    } else if (l === r) {
      // 同じ記号 → そのまま残る
      result[i] = l;
    } else {
      // ○と×が重なる → 相殺して空白
      result[i] = 'empty';
    }
  }

  return result;
}

/** 2つのグリッドが同一か */
function gridsEqual(a: Grid2x2, b: Grid2x2): boolean {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
}

/** ダミーグリッドを生成（正解と異なるもの） */
function generateDistractor(correct: Grid2x2, existing: Grid2x2[]): Grid2x2 {
  let attempts = 0;
  while (attempts < 50) {
    attempts++;
    const candidate = generateRandomGrid();
    if (gridsEqual(candidate, correct)) continue;
    if (existing.some(e => gridsEqual(e, candidate))) continue;
    return candidate;
  }
  // フォールバック
  return generateRandomGrid();
}

/** 問題を生成する */
export function generateOverlayCancelQuestion(): Question<OverlayCancelQuestionData, OverlayCancelChoiceData> {
  let leftGrid: Grid2x2;
  let rightGrid: Grid2x2;
  let correctResult: Grid2x2;

  // 少なくとも1つの相殺が起きる問題を生成
  let hasCancel = false;
  let attempts = 0;
  do {
    attempts++;
    leftGrid = generateRandomGrid();
    rightGrid = generateRandomGrid();
    correctResult = computeOverlay(leftGrid, rightGrid);

    // 相殺が起きているか確認
    const flippedLeft: Grid2x2 = [leftGrid[1], leftGrid[0], leftGrid[3], leftGrid[2]];
    hasCancel = flippedLeft.some((l, i) => {
      const r = rightGrid[i];
      return l !== 'empty' && r !== 'empty' && l !== r;
    });
  } while (!hasCancel && attempts < 100);

  // ダミー3つを生成（4択）
  const distractors: Grid2x2[] = [];
  distractors.push(generateDistractor(correctResult, distractors));
  distractors.push(generateDistractor(correctResult, distractors));
  distractors.push(generateDistractor(correctResult, distractors));

  // 正解位置をランダムに配置（4択）
  const correctIndex = randomInt(0, 3);
  const choices: OverlayCancelChoiceData[] = [...distractors];
  choices.splice(correctIndex, 0, correctResult);

  return {
    questionData: { leftGrid, rightGrid },
    choices,
    correctIndex,
    instructionText: '左をパタンと右におると\nどうなりますか？\n（○と×がかさなるときえます）',
  };
}

/** 正解判定 */
export function checkOverlayCancelAnswer(
  question: Question<OverlayCancelQuestionData, OverlayCancelChoiceData>,
  selectedIndex: number
): boolean {
  return selectedIndex === question.correctIndex;
}
