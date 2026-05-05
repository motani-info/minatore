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

// ─── 固定問題プール ───

interface FixedPuzzleQ {
  targetGrid: PuzzleGrid;
  choices: PiecePair[];
  correctIndex: number;
}

const FIXED_QUESTIONS: FixedPuzzleQ[] = [
  // Q1: target=[T,T,F,F] (top row filled)
  {
    targetGrid: [true, true, false, false],
    choices: [
      { pieceA: [true, false, false, false], pieceB: [false, true, false, false] },
      { pieceA: [true, false, false, false], pieceB: [false, false, true, false] },
      { pieceA: [false, true, false, false], pieceB: [false, false, false, true] },
      { pieceA: [true, true, false, false], pieceB: [false, false, true, false] },
    ],
    correctIndex: 0,
  },
  // Q2: target=[T,F,T,F] (left column filled)
  {
    targetGrid: [true, false, true, false],
    choices: [
      { pieceA: [false, true, false, false], pieceB: [true, false, true, false] },
      { pieceA: [true, false, false, false], pieceB: [false, false, true, false] },
      { pieceA: [true, false, true, false], pieceB: [false, true, false, false] },
      { pieceA: [false, false, true, false], pieceB: [false, true, false, false] },
    ],
    correctIndex: 1,
  },
  // Q3: target=[F,T,F,T] (right column filled)
  {
    targetGrid: [false, true, false, true],
    choices: [
      { pieceA: [true, false, false, true], pieceB: [false, true, false, false] },
      { pieceA: [false, true, false, false], pieceB: [false, false, true, true] },
      { pieceA: [false, true, false, false], pieceB: [false, false, false, true] },
      { pieceA: [false, false, false, true], pieceB: [true, true, false, false] },
    ],
    correctIndex: 2,
  },
  // Q4: target=[F,F,T,T] (bottom row filled)
  {
    targetGrid: [false, false, true, true],
    choices: [
      { pieceA: [false, false, true, false], pieceB: [true, false, false, true] },
      { pieceA: [false, false, true, false], pieceB: [false, false, false, true] },
      { pieceA: [true, false, false, false], pieceB: [false, false, true, true] },
      { pieceA: [false, true, true, false], pieceB: [false, false, false, true] },
    ],
    correctIndex: 1,
  },
  // Q5: target=[T,T,T,F] (3 cells)
  {
    targetGrid: [true, true, true, false],
    choices: [
      { pieceA: [true, true, false, false], pieceB: [false, false, true, false] },
      { pieceA: [true, false, true, false], pieceB: [false, true, false, true] },
      { pieceA: [true, true, false, false], pieceB: [false, false, false, true] },
      { pieceA: [false, true, true, false], pieceB: [true, false, false, true] },
    ],
    correctIndex: 0,
  },
  // Q6: target=[T,F,T,T] (3 cells)
  {
    targetGrid: [true, false, true, true],
    choices: [
      { pieceA: [true, false, false, false], pieceB: [false, true, true, true] },
      { pieceA: [true, false, true, false], pieceB: [false, false, false, true] },
      { pieceA: [false, false, true, true], pieceB: [true, true, false, false] },
      { pieceA: [true, false, false, true], pieceB: [false, true, true, false] },
    ],
    correctIndex: 1,
  },
  // Q7: target=[T,T,F,T] (3 cells)
  {
    targetGrid: [true, true, false, true],
    choices: [
      { pieceA: [true, false, false, true], pieceB: [false, true, true, false] },
      { pieceA: [false, true, false, true], pieceB: [true, false, true, false] },
      { pieceA: [true, false, false, true], pieceB: [false, true, false, false] },
      { pieceA: [true, true, false, false], pieceB: [false, false, true, true] },
    ],
    correctIndex: 2,
  },
  // Q8: target=[F,T,T,T] (3 cells)
  {
    targetGrid: [false, true, true, true],
    choices: [
      { pieceA: [false, true, false, false], pieceB: [false, false, true, true] },
      { pieceA: [false, true, true, false], pieceB: [true, false, false, true] },
      { pieceA: [true, true, false, true], pieceB: [false, false, true, false] },
      { pieceA: [false, false, true, true], pieceB: [true, true, false, false] },
    ],
    correctIndex: 0,
  },
  // Q9: target=[T,F,F,T] (diagonal)
  {
    targetGrid: [true, false, false, true],
    choices: [
      { pieceA: [true, false, false, false], pieceB: [false, true, false, true] },
      { pieceA: [true, false, false, false], pieceB: [false, false, false, true] },
      { pieceA: [false, false, false, true], pieceB: [false, true, false, false] },
      { pieceA: [true, true, false, false], pieceB: [false, false, false, true] },
    ],
    correctIndex: 1,
  },
  // Q10: target=[F,T,T,F] (anti-diagonal)
  {
    targetGrid: [false, true, true, false],
    choices: [
      { pieceA: [false, true, false, false], pieceB: [false, false, true, false] },
      { pieceA: [true, true, false, false], pieceB: [false, false, true, false] },
      { pieceA: [false, true, false, false], pieceB: [true, false, true, false] },
      { pieceA: [false, false, true, false], pieceB: [false, false, false, true] },
    ],
    correctIndex: 0,
  },
  // Q11: target=[T,T,T,F] variant
  {
    targetGrid: [true, true, true, false],
    choices: [
      { pieceA: [false, true, false, false], pieceB: [true, false, true, true] },
      { pieceA: [true, false, false, false], pieceB: [false, true, true, false] },
      { pieceA: [false, true, true, false], pieceB: [true, false, false, true] },
      { pieceA: [true, false, true, false], pieceB: [false, true, false, false] },
    ],
    correctIndex: 1,
  },
  // Q12: target=[F,T,T,T] variant
  {
    targetGrid: [false, true, true, true],
    choices: [
      { pieceA: [false, false, true, false], pieceB: [false, true, false, true] },
      { pieceA: [true, true, false, true], pieceB: [false, false, true, false] },
      { pieceA: [false, true, false, true], pieceB: [true, false, true, false] },
      { pieceA: [false, true, true, false], pieceB: [true, false, false, true] },
    ],
    correctIndex: 0,
  },
];

/** 現在の出題インデックス */
let currentIndex = 0;

/** 問題を順番に生成する */
export function generatePuzzleQuestion(): Question<PuzzleQuestionData, PuzzleChoiceData> {
  const questions = getAllPuzzleQuestions();
  const question = questions[currentIndex % questions.length];
  currentIndex++;
  return question;
}

/** 固定問題プールの全問題を返す */
export function getAllPuzzleQuestions(): Question<PuzzleQuestionData, PuzzleChoiceData>[] {
  return FIXED_QUESTIONS.map((q) => ({
    questionData: { targetGrid: q.targetGrid },
    choices: q.choices,
    correctIndex: q.correctIndex,
    instructionText: '2つのピースを合わせると\nお手本になるのはどれ？',
  }));
}

/** 正解判定関数 */
export function checkPuzzleAnswer(
  question: Question<PuzzleQuestionData, PuzzleChoiceData>,
  selectedIndex: number
): boolean {
  return selectedIndex === question.correctIndex;
}
