import type { Question } from '../../types/question';
import type {
  SpringItem,
  CompareSpringQuestionData,
  CompareSpringChoiceData,
  SpringMarkType,
} from './types';

// ─── 固定問題プール ───

interface FixedQ {
  springs: SpringItem[];
  heaviestIndex: number;
  secondIndex: number;
  lightestIndex: number;
}

/**
 * 問題1（画像から）
 * 4つのばね: 左から伸び具合が 中、中小、大、小
 * ばねが伸びているほど重い
 * 一番重い=3番目（大）、2番目=1番目（中）、一番軽い=4番目（小）
 */
const q1: FixedQ = {
  springs: [
    { stretch: 3, weight: 3 },
    { stretch: 2, weight: 2 },
    { stretch: 5, weight: 5 },
    { stretch: 1, weight: 1 },
  ],
  heaviestIndex: 2,
  secondIndex: 0,
  lightestIndex: 3,
};

/**
 * 問題2
 * 4つのばね: 伸び具合 小、大、中、中小
 */
const q2: FixedQ = {
  springs: [
    { stretch: 1, weight: 1 },
    { stretch: 5, weight: 5 },
    { stretch: 3, weight: 3 },
    { stretch: 2, weight: 2 },
  ],
  heaviestIndex: 1,
  secondIndex: 2,
  lightestIndex: 0,
};

/**
 * 問題3
 * 4つのばね: 伸び具合 大、小、中、中大
 */
const q3: FixedQ = {
  springs: [
    { stretch: 5, weight: 5 },
    { stretch: 1, weight: 1 },
    { stretch: 3, weight: 3 },
    { stretch: 4, weight: 4 },
  ],
  heaviestIndex: 0,
  secondIndex: 3,
  lightestIndex: 1,
};

/**
 * 問題4
 * 4つのばね: 伸び具合 中、大、小、中大
 */
const q4: FixedQ = {
  springs: [
    { stretch: 2, weight: 2 },
    { stretch: 5, weight: 5 },
    { stretch: 1, weight: 1 },
    { stretch: 4, weight: 4 },
  ],
  heaviestIndex: 1,
  secondIndex: 3,
  lightestIndex: 2,
};

const FIXED_QUESTIONS: FixedQ[] = [q1, q2, q3, q4];

const INSTRUCTION_TEXT =
  'いちばんおもいものには◎を、\n2ばんめにおもいものには△を、\nいちばんかるいものには×をつけましょう。';

/** 問題を生成する */
export function generateCompareSpringQuestion(): Question<
  CompareSpringQuestionData,
  CompareSpringChoiceData
> {
  const fixedQ = FIXED_QUESTIONS[Math.floor(Math.random() * FIXED_QUESTIONS.length)];

  return {
    questionData: {
      springs: fixedQ.springs,
    },
    choices: [{
      heaviestIndex: fixedQ.heaviestIndex,
      secondIndex: fixedQ.secondIndex,
      lightestIndex: fixedQ.lightestIndex,
    }],
    correctIndex: 0,
    instructionText: INSTRUCTION_TEXT,
  };
}

/** マークの正解判定 */
export function validateSpringMarks(
  marks: SpringMarkType[],
  heaviestIndex: number,
  secondIndex: number,
  lightestIndex: number,
): boolean {
  const dcIdx = marks.indexOf('double-circle');
  const triIdx = marks.indexOf('triangle');
  const crossIdx = marks.indexOf('cross');
  return dcIdx === heaviestIndex && triIdx === secondIndex && crossIdx === lightestIndex;
}

/** 正解判定関数（QuestionType用） */
export function checkCompareSpringAnswer(
  question: Question<CompareSpringQuestionData, CompareSpringChoiceData>,
  selectedIndex: number,
): boolean {
  return selectedIndex === question.correctIndex;
}
