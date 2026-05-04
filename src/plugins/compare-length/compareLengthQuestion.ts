import type { Question } from '../../types/question';
import type {
  LineDef,
  CompareLengthQuestionData,
  CompareLengthChoiceData,
  LengthMarkType,
} from './types';

// ─── 固定問題プール ───

interface FixedQ {
  lines: LineDef[];
  longestIndex: number;
  shortestIndex: number;
}

/**
 * 問題1（画像から）
 * 3本の線: 直線（短い）、波線（長い）、弧線（中くらい）
 * 直線は見た目は長いが実際は短い（×）
 * 波線は曲がりくねっているので実際は一番長い（○）
 * 弧線は中間
 */
const q1: FixedQ = {
  lines: [
    { type: 'straight', length: 1, displayWidth: 280 },
    { type: 'wavy', length: 3, displayWidth: 280 },
    { type: 'arc', length: 2, displayWidth: 280 },
  ],
  longestIndex: 1,  // 波線が一番長い
  shortestIndex: 0, // 直線が一番短い
};

/**
 * 問題2: 弧線（長い）、ジグザグ（中）、直線（短い）
 */
const q2: FixedQ = {
  lines: [
    { type: 'arc', length: 3, displayWidth: 260 },
    { type: 'zigzag', length: 2, displayWidth: 260 },
    { type: 'straight', length: 1, displayWidth: 260 },
  ],
  longestIndex: 0,
  shortestIndex: 2,
};

/**
 * 問題3: 波線（中）、直線（短い）、弧線（長い）
 */
const q3: FixedQ = {
  lines: [
    { type: 'wavy', length: 2, displayWidth: 250 },
    { type: 'straight', length: 1, displayWidth: 250 },
    { type: 'arc', length: 3, displayWidth: 250 },
  ],
  longestIndex: 2,
  shortestIndex: 1,
};

/**
 * 問題4: ジグザグ（長い）、弧線（短い）、波線（中）
 */
const q4: FixedQ = {
  lines: [
    { type: 'zigzag', length: 3, displayWidth: 270 },
    { type: 'arc', length: 1, displayWidth: 270 },
    { type: 'wavy', length: 2, displayWidth: 270 },
  ],
  longestIndex: 0,
  shortestIndex: 1,
};

const FIXED_QUESTIONS: FixedQ[] = [q1, q2, q3, q4];

const INSTRUCTION_TEXT =
  'いちばんながいせんには○、\nいちばんみじかいせんには×をつけましょう。';

/** 問題を生成する */
export function generateCompareLengthQuestion(): Question<
  CompareLengthQuestionData,
  CompareLengthChoiceData
> {
  const fixedQ = FIXED_QUESTIONS[Math.floor(Math.random() * FIXED_QUESTIONS.length)];

  return {
    questionData: {
      lines: fixedQ.lines,
    },
    choices: [{
      longestIndex: fixedQ.longestIndex,
      shortestIndex: fixedQ.shortestIndex,
    }],
    correctIndex: 0,
    instructionText: INSTRUCTION_TEXT,
  };
}

/** マークの正解判定 */
export function validateLengthMarks(
  marks: LengthMarkType[],
  longestIndex: number,
  shortestIndex: number,
): boolean {
  const circleIdx = marks.indexOf('circle');
  const crossIdx = marks.indexOf('cross');
  return circleIdx === longestIndex && crossIdx === shortestIndex;
}

/** 正解判定関数（QuestionType用） */
export function checkCompareLengthAnswer(
  question: Question<CompareLengthQuestionData, CompareLengthChoiceData>,
  selectedIndex: number,
): boolean {
  return selectedIndex === question.correctIndex;
}
