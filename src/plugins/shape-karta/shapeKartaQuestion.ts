import type { Question } from '../../types/question';
import type { ShapeKartaQuestionData, ShapeKartaChoiceData, ShapeGroup, CardData } from './types';

// ─── 固定問題プール ───

interface FixedShapeKartaQ {
  conditions: ShapeGroup[];
  choices: CardData[];
  correctIndex: number;
}

const FIXED_QUESTIONS: FixedShapeKartaQ[] = [
  // Q1: 赤い丸2個 + 青い三角1個
  {
    conditions: [
      { shape: 'circle', color: 'red', count: 2 },
      { shape: 'triangle', color: 'blue', count: 1 },
    ],
    choices: [
      [{ shape: 'circle', color: 'red', count: 2 }, { shape: 'triangle', color: 'blue', count: 1 }],
      [{ shape: 'circle', color: 'red', count: 3 }, { shape: 'triangle', color: 'blue', count: 1 }],
      [{ shape: 'circle', color: 'red', count: 2 }, { shape: 'triangle', color: 'green', count: 1 }],
      [{ shape: 'circle', color: 'blue', count: 2 }, { shape: 'triangle', color: 'blue', count: 1 }],
    ],
    correctIndex: 0,
  },
  // Q2: 黄色い四角3個 + 緑の丸2個
  {
    conditions: [
      { shape: 'square', color: 'yellow', count: 3 },
      { shape: 'circle', color: 'green', count: 2 },
    ],
    choices: [
      [{ shape: 'square', color: 'yellow', count: 3 }, { shape: 'circle', color: 'green', count: 3 }],
      [{ shape: 'square', color: 'yellow', count: 3 }, { shape: 'circle', color: 'green', count: 2 }],
      [{ shape: 'square', color: 'yellow', count: 2 }, { shape: 'circle', color: 'green', count: 2 }],
      [{ shape: 'square', color: 'green', count: 3 }, { shape: 'circle', color: 'green', count: 2 }],
    ],
    correctIndex: 1,
  },
  // Q3: 青い四角1個 + 赤い三角3個
  {
    conditions: [
      { shape: 'square', color: 'blue', count: 1 },
      { shape: 'triangle', color: 'red', count: 3 },
    ],
    choices: [
      [{ shape: 'square', color: 'blue', count: 1 }, { shape: 'triangle', color: 'red', count: 2 }],
      [{ shape: 'square', color: 'blue', count: 2 }, { shape: 'triangle', color: 'red', count: 3 }],
      [{ shape: 'square', color: 'blue', count: 1 }, { shape: 'triangle', color: 'red', count: 3 }],
      [{ shape: 'square', color: 'blue', count: 1 }, { shape: 'triangle', color: 'yellow', count: 3 }],
    ],
    correctIndex: 2,
  },
  // Q4: 緑の三角2個 + 黄色い丸4個
  {
    conditions: [
      { shape: 'triangle', color: 'green', count: 2 },
      { shape: 'circle', color: 'yellow', count: 4 },
    ],
    choices: [
      [{ shape: 'triangle', color: 'green', count: 2 }, { shape: 'circle', color: 'yellow', count: 3 }],
      [{ shape: 'triangle', color: 'green', count: 3 }, { shape: 'circle', color: 'yellow', count: 4 }],
      [{ shape: 'triangle', color: 'blue', count: 2 }, { shape: 'circle', color: 'yellow', count: 4 }],
      [{ shape: 'triangle', color: 'green', count: 2 }, { shape: 'circle', color: 'yellow', count: 4 }],
    ],
    correctIndex: 3,
  },
  // Q5: 赤い四角4個 + 青い丸1個
  {
    conditions: [
      { shape: 'square', color: 'red', count: 4 },
      { shape: 'circle', color: 'blue', count: 1 },
    ],
    choices: [
      [{ shape: 'square', color: 'red', count: 4 }, { shape: 'circle', color: 'blue', count: 1 }],
      [{ shape: 'square', color: 'red', count: 4 }, { shape: 'circle', color: 'blue', count: 2 }],
      [{ shape: 'square', color: 'red', count: 3 }, { shape: 'circle', color: 'blue', count: 1 }],
      [{ shape: 'square', color: 'yellow', count: 4 }, { shape: 'circle', color: 'blue', count: 1 }],
    ],
    correctIndex: 0,
  },
  // Q6: 黄色い三角1個 + 緑の四角2個
  {
    conditions: [
      { shape: 'triangle', color: 'yellow', count: 1 },
      { shape: 'square', color: 'green', count: 2 },
    ],
    choices: [
      [{ shape: 'triangle', color: 'yellow', count: 2 }, { shape: 'square', color: 'green', count: 2 }],
      [{ shape: 'triangle', color: 'yellow', count: 1 }, { shape: 'square', color: 'green', count: 3 }],
      [{ shape: 'triangle', color: 'yellow', count: 1 }, { shape: 'square', color: 'green', count: 2 }],
      [{ shape: 'triangle', color: 'red', count: 1 }, { shape: 'square', color: 'green', count: 2 }],
    ],
    correctIndex: 2,
  },
  // Q7: 青い丸3個 + 赤い四角2個
  {
    conditions: [
      { shape: 'circle', color: 'blue', count: 3 },
      { shape: 'square', color: 'red', count: 2 },
    ],
    choices: [
      [{ shape: 'circle', color: 'blue', count: 3 }, { shape: 'square', color: 'red', count: 3 }],
      [{ shape: 'circle', color: 'blue', count: 2 }, { shape: 'square', color: 'red', count: 2 }],
      [{ shape: 'circle', color: 'green', count: 3 }, { shape: 'square', color: 'red', count: 2 }],
      [{ shape: 'circle', color: 'blue', count: 3 }, { shape: 'square', color: 'red', count: 2 }],
    ],
    correctIndex: 3,
  },
  // Q8: 緑の丸1個 + 黄色い三角3個
  {
    conditions: [
      { shape: 'circle', color: 'green', count: 1 },
      { shape: 'triangle', color: 'yellow', count: 3 },
    ],
    choices: [
      [{ shape: 'circle', color: 'green', count: 1 }, { shape: 'triangle', color: 'yellow', count: 3 }],
      [{ shape: 'circle', color: 'green', count: 1 }, { shape: 'triangle', color: 'yellow', count: 2 }],
      [{ shape: 'circle', color: 'green', count: 2 }, { shape: 'triangle', color: 'yellow', count: 3 }],
      [{ shape: 'circle', color: 'red', count: 1 }, { shape: 'triangle', color: 'yellow', count: 3 }],
    ],
    correctIndex: 0,
  },
  // Q9: 赤い三角2個 + 青い四角4個
  {
    conditions: [
      { shape: 'triangle', color: 'red', count: 2 },
      { shape: 'square', color: 'blue', count: 4 },
    ],
    choices: [
      [{ shape: 'triangle', color: 'red', count: 2 }, { shape: 'square', color: 'blue', count: 3 }],
      [{ shape: 'triangle', color: 'red', count: 3 }, { shape: 'square', color: 'blue', count: 4 }],
      [{ shape: 'triangle', color: 'red', count: 2 }, { shape: 'square', color: 'blue', count: 4 }],
      [{ shape: 'triangle', color: 'red', count: 2 }, { shape: 'square', color: 'green', count: 4 }],
    ],
    correctIndex: 2,
  },
  // Q10: 黄色い丸2個 + 緑の三角1個
  {
    conditions: [
      { shape: 'circle', color: 'yellow', count: 2 },
      { shape: 'triangle', color: 'green', count: 1 },
    ],
    choices: [
      [{ shape: 'circle', color: 'yellow', count: 3 }, { shape: 'triangle', color: 'green', count: 1 }],
      [{ shape: 'circle', color: 'yellow', count: 2 }, { shape: 'triangle', color: 'green', count: 2 }],
      [{ shape: 'circle', color: 'yellow', count: 2 }, { shape: 'triangle', color: 'blue', count: 1 }],
      [{ shape: 'circle', color: 'yellow', count: 2 }, { shape: 'triangle', color: 'green', count: 1 }],
    ],
    correctIndex: 3,
  },
  // Q11: 青い三角4個 + 赤い丸2個
  {
    conditions: [
      { shape: 'triangle', color: 'blue', count: 4 },
      { shape: 'circle', color: 'red', count: 2 },
    ],
    choices: [
      [{ shape: 'triangle', color: 'blue', count: 4 }, { shape: 'circle', color: 'red', count: 2 }],
      [{ shape: 'triangle', color: 'blue', count: 4 }, { shape: 'circle', color: 'red', count: 3 }],
      [{ shape: 'triangle', color: 'blue', count: 3 }, { shape: 'circle', color: 'red', count: 2 }],
      [{ shape: 'triangle', color: 'yellow', count: 4 }, { shape: 'circle', color: 'red', count: 2 }],
    ],
    correctIndex: 0,
  },
  // Q12: 緑の四角3個 + 黄色い丸1個
  {
    conditions: [
      { shape: 'square', color: 'green', count: 3 },
      { shape: 'circle', color: 'yellow', count: 1 },
    ],
    choices: [
      [{ shape: 'square', color: 'green', count: 3 }, { shape: 'circle', color: 'yellow', count: 2 }],
      [{ shape: 'square', color: 'green', count: 2 }, { shape: 'circle', color: 'yellow', count: 1 }],
      [{ shape: 'square', color: 'green', count: 3 }, { shape: 'circle', color: 'yellow', count: 1 }],
      [{ shape: 'square', color: 'blue', count: 3 }, { shape: 'circle', color: 'yellow', count: 1 }],
    ],
    correctIndex: 2,
  },
];

/** 現在の出題インデックス */
let currentIndex = 0;

/** 問題を順番に生成する */
export function generateShapeKartaQuestion(): Question<ShapeKartaQuestionData, ShapeKartaChoiceData> {
  const questions = getAllShapeKartaQuestions();
  const question = questions[currentIndex % questions.length];
  currentIndex++;
  return question;
}

/** 固定問題プールの全問題を返す */
export function getAllShapeKartaQuestions(): Question<ShapeKartaQuestionData, ShapeKartaChoiceData>[] {
  return FIXED_QUESTIONS.map((q) => ({
    questionData: { conditions: q.conditions },
    choices: q.choices,
    correctIndex: q.correctIndex,
    instructionText: 'したのカードからえらんでね',
  }));
}

/** 正解判定 */
export function checkShapeKartaAnswer(
  question: Question<ShapeKartaQuestionData, ShapeKartaChoiceData>,
  selectedIndex: number
): boolean {
  return selectedIndex === question.correctIndex;
}
