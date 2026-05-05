import type { Question } from '../../types/question';
import type {
  Grid3x3,
  OverlayAdvancedQuestionData,
  OverlayAdvancedChoiceData,
} from './types';

// ─── ヘルパー ───

/** 2つのグリッドのAND演算（重なり） */
export function computeOverlap(a: Grid3x3, b: Grid3x3): Grid3x3 {
  return a.map((v, i) => v && b[i]) as unknown as Grid3x3;
}

/** 2つのGrid3x3が同一か判定 */
export function gridsEqual(a: Grid3x3, b: Grid3x3): boolean {
  return a.every((v, i) => v === b[i]);
}

// ─── 固定問題プール（画像の8問） ───
// true=○あり, false=空
// グリッド配列: [上左,上中,上右, 中左,中中,中右, 下左,下中,下右]

const T = true;
const F = false;

interface FixedQ {
  gridA: Grid3x3;
  gridB: Grid3x3;
}

/**
 * 問題1（1枚目・2段目）
 * 左: [空,○,空; ○,○,空; ○,空,空]
 * 右: [空,○,○; 空,○,空; 空,空,○]
 * 重なり: [空,○,空; 空,○,空; 空,空,空]
 */
const q1: FixedQ = {
  gridA: [F,T,F, T,T,F, T,F,F],
  gridB: [F,T,T, F,T,F, F,F,T],
};

/**
 * 問題2（1枚目・3段目）
 * 左: [○,空,○; 空,○,空; ○,○,空]
 * 右: [○,○,○; ○,○,空; 空,○,○]
 * 重なり: [○,空,○; 空,○,空; 空,○,空]
 */
const q2: FixedQ = {
  gridA: [T,F,T, F,T,F, T,T,F],
  gridB: [T,T,T, T,T,F, F,T,T],
};

/**
 * 問題3（1枚目・4段目）
 * 左: [○,○,空; ○,空,○; 空,○,○]
 * 右: [○,○,○; ○,○,空; ○,空,○]
 * 重なり: [○,○,空; ○,空,空; 空,空,○]
 */
const q3: FixedQ = {
  gridA: [T,T,F, T,F,T, F,T,T],
  gridB: [T,T,T, T,T,F, T,F,T],
};

/**
 * 問題4（2枚目・1段目）
 * 左: [○,○,空; ○,空,○; ○,○,空]
 * 右: [○,空,○; 空,○,○; ○,空,○]
 * 重なり: [○,空,空; 空,空,○; ○,空,空]
 */
const q4: FixedQ = {
  gridA: [T,T,F, T,F,T, T,T,F],
  gridB: [T,F,T, F,T,T, T,F,T],
};

/**
 * 問題5（2枚目・2段目）
 * 左: [○,○,○; ○,空,○; 空,○,空]
 * 右: [○,空,○; ○,○,空; ○,○,○]
 * 重なり: [○,空,○; ○,空,空; 空,○,空]
 */
const q5: FixedQ = {
  gridA: [T,T,T, T,F,T, F,T,F],
  gridB: [T,F,T, T,T,F, T,T,T],
};

/**
 * 問題6（2枚目・3段目）
 * 左: [○,空,○; ○,○,空; ○,空,○]
 * 右: [空,○,空; ○,○,○; 空,○,空]
 * 重なり: [空,空,空; ○,○,空; 空,空,空]
 */
const q6: FixedQ = {
  gridA: [T,F,T, T,T,F, T,F,T],
  gridB: [F,T,F, T,T,T, F,T,F],
};

/**
 * 問題7（2枚目・4段目）
 * 左: [○,○,○; 空,○,空; ○,空,○]
 * 右: [○,○,空; ○,○,○; 空,○,空]
 * 重なり: [○,○,空; 空,○,空; 空,空,空]
 */
const q7: FixedQ = {
  gridA: [T,T,T, F,T,F, T,F,T],
  gridB: [T,T,F, T,T,T, F,T,F],
};

/**
 * 問題8（2枚目・5段目）
 * 左: [○,○,○; ○,空,○; ○,○,空]
 * 右: [○,空,○; ○,○,空; ○,空,○]
 * 重なり: [○,空,○; ○,空,空; ○,空,空]
 */
const q8: FixedQ = {
  gridA: [T,T,T, T,F,T, T,T,F],
  gridB: [T,F,T, T,T,F, T,F,T],
};

const FIXED_QUESTIONS: FixedQ[] = [q1, q2, q3, q4, q5, q6, q7, q8];

// ─── 問題生成 ───

const INSTRUCTION_TEXT =
  'ひだりの2まいのいたをかさねたとき、\n○と○がかさなるところはどれですか？';

/** 各問題の固定不正解選択肢（事前計算済み） */
const FIXED_DISTRACTORS: Grid3x3[][] = [
  // q1正解: [F,T,F, F,T,F, F,F,F] → 不正解3つ
  [[F,T,T, F,T,F, F,F,F], [F,T,F, T,T,F, F,F,F], [F,T,F, F,F,F, F,T,F]],
  // q2正解: [T,F,T, F,T,F, F,T,F] → 不正解3つ
  [[T,T,T, F,T,F, F,T,F], [T,F,T, F,T,T, F,T,F], [T,F,T, F,T,F, T,T,F]],
  // q3正解: [T,T,F, T,F,F, F,F,T] → 不正解3つ
  [[T,T,T, T,F,F, F,F,T], [T,T,F, T,T,F, F,F,T], [T,T,F, T,F,F, F,T,T]],
  // q4正解: [T,F,F, F,F,T, T,F,F] → 不正解3つ
  [[T,T,F, F,F,T, T,F,F], [T,F,F, F,T,T, T,F,F], [T,F,F, F,F,T, T,T,F]],
  // q5正解: [T,F,T, T,F,F, F,T,F] → 不正解3つ
  [[T,T,T, T,F,F, F,T,F], [T,F,T, T,T,F, F,T,F], [T,F,T, T,F,F, T,T,F]],
  // q6正解: [F,F,F, T,T,F, F,F,F] → 不正解3つ
  [[T,F,F, T,T,F, F,F,F], [F,F,F, T,T,T, F,F,F], [F,F,F, T,T,F, F,T,F]],
  // q7正解: [T,T,F, F,T,F, F,F,F] → 不正解3つ
  [[T,T,T, F,T,F, F,F,F], [T,T,F, T,T,F, F,F,F], [T,T,F, F,T,F, F,T,F]],
  // q8正解: [T,F,T, T,F,F, T,F,F] → 不正解3つ
  [[T,T,T, T,F,F, T,F,F], [T,F,T, T,T,F, T,F,F], [T,F,T, T,F,F, T,T,F]],
];

/** 各問題の正解位置（固定） */
const FIXED_CORRECT_INDICES = [0, 1, 2, 3, 0, 1, 2, 3];

/** 現在の出題インデックス */
let currentIndex = 0;

/** 固定問題プールから順番に1問を生成する */
export function generateOverlayAdvancedQuestion(): Question<
  OverlayAdvancedQuestionData,
  OverlayAdvancedChoiceData
> {
  const questions = getAllOverlayAdvancedQuestions();
  const question = questions[currentIndex % questions.length];
  currentIndex++;
  return question;
}

/** 固定問題プールの全問題を返す */
export function getAllOverlayAdvancedQuestions(): Question<
  OverlayAdvancedQuestionData,
  OverlayAdvancedChoiceData
>[] {
  return FIXED_QUESTIONS.map((fixedQ, i) => {
    const correct = computeOverlap(fixedQ.gridA, fixedQ.gridB);
    const distractors = FIXED_DISTRACTORS[i];
    const correctIndex = FIXED_CORRECT_INDICES[i];
    const choices: OverlayAdvancedChoiceData[] = [...distractors];
    choices.splice(correctIndex, 0, correct);
    return {
      questionData: {
        gridA: fixedQ.gridA,
        gridB: fixedQ.gridB,
      },
      choices,
      correctIndex,
      instructionText: INSTRUCTION_TEXT,
    };
  });
}

/** 正解判定関数 */
export function checkOverlayAdvancedAnswer(
  question: Question<OverlayAdvancedQuestionData, OverlayAdvancedChoiceData>,
  selectedIndex: number,
): boolean {
  return selectedIndex === question.correctIndex;
}
