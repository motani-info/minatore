import type { Question } from '../../types/question';
import type { OddOneOutQuestionData, OddOneOutChoiceData, FigureDefinition } from './types';

// ─── 固定問題プール ───

interface FixedOddOneOutQ {
  baseFigure: FigureDefinition;
  mutatedFigure: FigureDefinition;
  gridSize: number;
  oddIndex: number;
  choices: number[];
  correctIndex: number;
}

const FIXED_QUESTIONS: FixedOddOneOutQ[] = [
  // Q1: Color change on circle
  {
    baseFigure: [
      { type: 'rect', x: 10, y: 10, width: 80, height: 80, color: '#ef4444' },
      { type: 'circle', x: 30, y: 30, width: 20, height: 20, color: '#3b82f6' },
      { type: 'line', x: 25, y: 35, width: 40, height: 2, color: '#22c55e', rotation: 45 },
    ],
    mutatedFigure: [
      { type: 'rect', x: 10, y: 10, width: 80, height: 80, color: '#ef4444' },
      { type: 'circle', x: 30, y: 30, width: 20, height: 20, color: '#f59e0b' },
      { type: 'line', x: 25, y: 35, width: 40, height: 2, color: '#22c55e', rotation: 45 },
    ],
    gridSize: 3,
    oddIndex: 4,
    choices: [1, 4, 6, 8],
    correctIndex: 1,
  },
  // Q2: Rotation on line
  {
    baseFigure: [
      { type: 'rect', x: 10, y: 10, width: 80, height: 80, color: '#3b82f6' },
      { type: 'circle', x: 40, y: 25, width: 20, height: 20, color: '#ef4444' },
      { type: 'line', x: 30, y: 50, width: 35, height: 2, color: '#8b5cf6', rotation: -45 },
    ],
    mutatedFigure: [
      { type: 'rect', x: 10, y: 10, width: 80, height: 80, color: '#3b82f6' },
      { type: 'circle', x: 40, y: 25, width: 20, height: 20, color: '#ef4444' },
      { type: 'line', x: 30, y: 50, width: 35, height: 2, color: '#8b5cf6', rotation: 45 },
    ],
    gridSize: 3,
    oddIndex: 7,
    choices: [0, 3, 5, 7],
    correctIndex: 3,
  },
  // Q3: Shift on circle
  {
    baseFigure: [
      { type: 'rect', x: 10, y: 10, width: 80, height: 80, color: '#22c55e' },
      { type: 'circle', x: 35, y: 40, width: 20, height: 20, color: '#f59e0b' },
      { type: 'line', x: 20, y: 25, width: 45, height: 2, color: '#ef4444', rotation: 30 },
    ],
    mutatedFigure: [
      { type: 'rect', x: 10, y: 10, width: 80, height: 80, color: '#22c55e' },
      { type: 'circle', x: 47, y: 52, width: 20, height: 20, color: '#f59e0b' },
      { type: 'line', x: 20, y: 25, width: 45, height: 2, color: '#ef4444', rotation: 30 },
    ],
    gridSize: 3,
    oddIndex: 2,
    choices: [0, 2, 5, 7],
    correctIndex: 1,
  },
  // Q4: Flip on circle
  {
    baseFigure: [
      { type: 'rect', x: 10, y: 10, width: 80, height: 80, color: '#8b5cf6' },
      { type: 'circle', x: 25, y: 30, width: 20, height: 20, color: '#22c55e' },
      { type: 'line', x: 35, y: 40, width: 30, height: 2, color: '#3b82f6', rotation: -30 },
    ],
    mutatedFigure: [
      { type: 'rect', x: 10, y: 10, width: 80, height: 80, color: '#8b5cf6' },
      { type: 'circle', x: 45, y: 30, width: 20, height: 20, color: '#22c55e' },
      { type: 'line', x: 35, y: 40, width: 30, height: 2, color: '#3b82f6', rotation: -30 },
    ],
    gridSize: 3,
    oddIndex: 6,
    choices: [1, 3, 6, 8],
    correctIndex: 2,
  },
  // Q5: Color change on line
  {
    baseFigure: [
      { type: 'rect', x: 10, y: 10, width: 80, height: 80, color: '#f59e0b' },
      { type: 'circle', x: 50, y: 50, width: 20, height: 20, color: '#3b82f6' },
      { type: 'line', x: 20, y: 30, width: 50, height: 2, color: '#ef4444', rotation: 45 },
    ],
    mutatedFigure: [
      { type: 'rect', x: 10, y: 10, width: 80, height: 80, color: '#f59e0b' },
      { type: 'circle', x: 50, y: 50, width: 20, height: 20, color: '#3b82f6' },
      { type: 'line', x: 20, y: 30, width: 50, height: 2, color: '#22c55e', rotation: 45 },
    ],
    gridSize: 3,
    oddIndex: 0,
    choices: [0, 2, 4, 7],
    correctIndex: 0,
  },
  // Q6: Rotation on line (different base)
  {
    baseFigure: [
      { type: 'rect', x: 10, y: 10, width: 80, height: 80, color: '#3b82f6' },
      { type: 'circle', x: 55, y: 35, width: 20, height: 20, color: '#8b5cf6' },
      { type: 'line', x: 25, y: 55, width: 40, height: 2, color: '#f59e0b', rotation: -45 },
    ],
    mutatedFigure: [
      { type: 'rect', x: 10, y: 10, width: 80, height: 80, color: '#3b82f6' },
      { type: 'circle', x: 55, y: 35, width: 20, height: 20, color: '#8b5cf6' },
      { type: 'line', x: 25, y: 55, width: 40, height: 2, color: '#f59e0b', rotation: 45 },
    ],
    gridSize: 3,
    oddIndex: 3,
    choices: [0, 3, 5, 8],
    correctIndex: 1,
  },
  // Q7: Shift on line
  {
    baseFigure: [
      { type: 'rect', x: 10, y: 10, width: 80, height: 80, color: '#ef4444' },
      { type: 'circle', x: 30, y: 55, width: 20, height: 20, color: '#22c55e' },
      { type: 'line', x: 40, y: 25, width: 30, height: 2, color: '#3b82f6', rotation: 30 },
    ],
    mutatedFigure: [
      { type: 'rect', x: 10, y: 10, width: 80, height: 80, color: '#ef4444' },
      { type: 'circle', x: 30, y: 55, width: 20, height: 20, color: '#22c55e' },
      { type: 'line', x: 52, y: 37, width: 30, height: 2, color: '#3b82f6', rotation: 30 },
    ],
    gridSize: 3,
    oddIndex: 5,
    choices: [1, 4, 5, 7],
    correctIndex: 2,
  },
  // Q8: Color change on rect border
  {
    baseFigure: [
      { type: 'rect', x: 10, y: 10, width: 80, height: 80, color: '#22c55e' },
      { type: 'circle', x: 45, y: 45, width: 20, height: 20, color: '#ef4444' },
      { type: 'line', x: 30, y: 20, width: 35, height: 2, color: '#8b5cf6', rotation: -30 },
    ],
    mutatedFigure: [
      { type: 'rect', x: 10, y: 10, width: 80, height: 80, color: '#3b82f6' },
      { type: 'circle', x: 45, y: 45, width: 20, height: 20, color: '#ef4444' },
      { type: 'line', x: 30, y: 20, width: 35, height: 2, color: '#8b5cf6', rotation: -30 },
    ],
    gridSize: 3,
    oddIndex: 8,
    choices: [2, 4, 6, 8],
    correctIndex: 3,
  },
  // Q9: Flip on circle (different position)
  {
    baseFigure: [
      { type: 'rect', x: 10, y: 10, width: 80, height: 80, color: '#8b5cf6' },
      { type: 'circle', x: 50, y: 25, width: 20, height: 20, color: '#f59e0b' },
      { type: 'line', x: 20, y: 60, width: 45, height: 2, color: '#ef4444', rotation: -45 },
    ],
    mutatedFigure: [
      { type: 'rect', x: 10, y: 10, width: 80, height: 80, color: '#8b5cf6' },
      { type: 'circle', x: 20, y: 25, width: 20, height: 20, color: '#f59e0b' },
      { type: 'line', x: 20, y: 60, width: 45, height: 2, color: '#ef4444', rotation: -45 },
    ],
    gridSize: 3,
    oddIndex: 1,
    choices: [0, 1, 4, 6],
    correctIndex: 1,
  },
  // Q10: Shift on circle (another variant)
  {
    baseFigure: [
      { type: 'rect', x: 10, y: 10, width: 80, height: 80, color: '#f59e0b' },
      { type: 'circle', x: 40, y: 40, width: 20, height: 20, color: '#3b82f6' },
      { type: 'line', x: 25, y: 25, width: 40, height: 2, color: '#22c55e', rotation: 45 },
    ],
    mutatedFigure: [
      { type: 'rect', x: 10, y: 10, width: 80, height: 80, color: '#f59e0b' },
      { type: 'circle', x: 28, y: 52, width: 20, height: 20, color: '#3b82f6' },
      { type: 'line', x: 25, y: 25, width: 40, height: 2, color: '#22c55e', rotation: 45 },
    ],
    gridSize: 3,
    oddIndex: 3,
    choices: [2, 3, 6, 8],
    correctIndex: 1,
  },
];

/** 現在の出題インデックス */
let currentIndex = 0;

/** 問題を順番に生成する */
export function generateOddOneOutQuestion(): Question<OddOneOutQuestionData, OddOneOutChoiceData> {
  const questions = getAllOddOneOutQuestions();
  const question = questions[currentIndex % questions.length];
  currentIndex++;
  return question;
}

/** 固定問題プールの全問題を返す */
export function getAllOddOneOutQuestions(): Question<OddOneOutQuestionData, OddOneOutChoiceData>[] {
  return FIXED_QUESTIONS.map((q) => ({
    questionData: {
      baseFigure: q.baseFigure,
      mutatedFigure: q.mutatedFigure,
      gridSize: q.gridSize,
      oddIndex: q.oddIndex,
    },
    choices: q.choices,
    correctIndex: q.correctIndex,
    instructionText: 'ひとつだけちがうものを\nみつけてね',
  }));
}

/** 正解判定 */
export function checkOddOneOutAnswer(
  question: Question<OddOneOutQuestionData, OddOneOutChoiceData>,
  selectedIndex: number
): boolean {
  return selectedIndex === question.correctIndex;
}
