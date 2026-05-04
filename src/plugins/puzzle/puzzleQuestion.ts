import type { Question } from '../../types/question';
import type {
  PuzzleGrid,
  PiecePair,
  PuzzleQuestionData,
  PuzzleChoiceData,
} from './types';

/** 2つのグリッドが同一か判定する */
export function gridsEqual(a: PuzzleGrid, b: PuzzleGrid): boolean {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
}

/** 2つのピースを合わせた結果を計算する（OR演算） */
export function combinePieces(a: PuzzleGrid, b: PuzzleGrid): PuzzleGrid {
  return [a[0] || b[0], a[1] || b[1], a[2] || b[2], a[3] || b[3]];
}

/** ピースの組み合わせが同一か判定する */
export function piecePairsEqual(a: PiecePair, b: PiecePair): boolean {
  return (
    (gridsEqual(a.pieceA, b.pieceA) && gridsEqual(a.pieceB, b.pieceB)) ||
    (gridsEqual(a.pieceA, b.pieceB) && gridsEqual(a.pieceB, b.pieceA))
  );
}

/** グリッドの塗りつぶしセル数を数える */
function countFilled(grid: PuzzleGrid): number {
  return grid.filter(Boolean).length;
}

/**
 * お手本のグリッドを生成する（2〜3マスが塗りつぶし）
 */
export function generateTargetGrid(): PuzzleGrid {
  const filledCount = Math.random() < 0.5 ? 2 : 3;
  const indices = [0, 1, 2, 3];

  // シャッフルして先頭からfilledCount個を選ぶ
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  const grid: PuzzleGrid = [false, false, false, false];
  for (let i = 0; i < filledCount; i++) {
    grid[indices[i]] = true;
  }
  return grid;
}

/**
 * お手本を2つのピースに分割する
 * 各ピースは少なくとも1マスが塗りつぶし
 * ピースは重複しない（同じマスを両方が塗りつぶさない）
 */
export function splitIntoPieces(target: PuzzleGrid): PiecePair {
  const filledIndices = target
    .map((v, i) => (v ? i : -1))
    .filter((i) => i >= 0);

  // 塗りつぶしセルをランダムに2グループに分ける
  // 各グループに少なくとも1つ
  const shuffled = [...filledIndices];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const splitPoint = Math.floor(Math.random() * (shuffled.length - 1)) + 1;
  const groupA = shuffled.slice(0, splitPoint);
  const groupB = shuffled.slice(splitPoint);

  const pieceA: PuzzleGrid = [false, false, false, false];
  const pieceB: PuzzleGrid = [false, false, false, false];

  for (const idx of groupA) pieceA[idx] = true;
  for (const idx of groupB) pieceB[idx] = true;

  return { pieceA, pieceB };
}

/** ランダムなグリッドを生成する（1〜3マス塗りつぶし） */
function generateRandomPiece(): PuzzleGrid {
  const filledCount = Math.floor(Math.random() * 3) + 1;
  const indices = [0, 1, 2, 3];
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  const grid: PuzzleGrid = [false, false, false, false];
  for (let i = 0; i < filledCount; i++) {
    grid[indices[i]] = true;
  }
  return grid;
}

/**
 * 不正解の選択肢を生成する
 * 合わせてもお手本にならないピースの組み合わせ
 */
export function generateDistractors(
  target: PuzzleGrid,
  correctPair: PiecePair,
  count: number
): PiecePair[] {
  const distractors: PiecePair[] = [];
  let attempts = 0;
  const maxAttempts = 200;

  while (distractors.length < count && attempts < maxAttempts) {
    attempts++;
    const pieceA = generateRandomPiece();
    const pieceB = generateRandomPiece();
    const candidate: PiecePair = { pieceA, pieceB };

    // 合わせた結果がお手本と一致しないことを確認
    const combined = combinePieces(pieceA, pieceB);
    if (gridsEqual(combined, target)) continue;

    // 正解と同じ組み合わせでないことを確認
    if (piecePairsEqual(candidate, correctPair)) continue;

    // 既存の不正解と重複しないことを確認
    const isDuplicate = distractors.some((d) => piecePairsEqual(d, candidate));
    if (isDuplicate) continue;

    // 各ピースに少なくとも1マスの塗りつぶしがあることを確認
    if (countFilled(pieceA) === 0 || countFilled(pieceB) === 0) continue;

    distractors.push(candidate);
  }

  // フォールバック
  while (distractors.length < count) {
    distractors.push({
      pieceA: generateRandomPiece(),
      pieceB: generateRandomPiece(),
    });
  }

  return distractors;
}

/** 問題を生成する */
export function generatePuzzleQuestion(): Question<PuzzleQuestionData, PuzzleChoiceData> {
  const targetGrid = generateTargetGrid();
  const correctPair = splitIntoPieces(targetGrid);

  const distractors = generateDistractors(targetGrid, correctPair, 3);

  const correctIndex = Math.floor(Math.random() * 4);
  const choices: PuzzleChoiceData[] = [...distractors];
  choices.splice(correctIndex, 0, correctPair);

  return {
    questionData: { targetGrid },
    choices,
    correctIndex,
    instructionText: '2つのピースを合わせると\nお手本になるのはどれ？',
  };
}

/** 正解判定関数 */
export function checkPuzzleAnswer(
  question: Question<PuzzleQuestionData, PuzzleChoiceData>,
  selectedIndex: number
): boolean {
  return selectedIndex === question.correctIndex;
}
