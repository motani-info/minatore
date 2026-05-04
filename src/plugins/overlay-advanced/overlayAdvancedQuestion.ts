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

/** ランダムな3×3グリッドを生成（少なくとも2つのtrue） */
function randomGrid(): Grid3x3 {
  let grid: Grid3x3;
  do {
    grid = Array.from({ length: 9 }, () => Math.random() < 0.5) as unknown as Grid3x3;
  } while (grid.filter(Boolean).length < 2);
  return grid;
}

/** 正解グリッドの1〜2セルをランダムに反転して不正解を作る */
function mutateGrid(grid: Grid3x3): Grid3x3 {
  const result = [...grid] as unknown as Grid3x3;
  const flips = Math.random() < 0.5 ? 1 : 2;
  for (let f = 0; f < flips; f++) {
    const idx = Math.floor(Math.random() * 9);
    result[idx] = !result[idx];
  }
  return result;
}

/**
 * 不正解の選択肢を生成する
 */
function generateDistractors(correct: Grid3x3, count: number): Grid3x3[] {
  const distractors: Grid3x3[] = [];
  let attempts = 0;
  while (distractors.length < count && attempts < 200) {
    attempts++;
    const candidate = mutateGrid(correct);
    if (gridsEqual(candidate, correct)) continue;
    if (distractors.some((d) => gridsEqual(d, candidate))) continue;
    distractors.push(candidate);
  }
  // フォールバック
  while (distractors.length < count) {
    distractors.push(randomGrid());
  }
  return distractors;
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

/** 固定問題プールからランダムに1問を生成する */
export function generateOverlayAdvancedQuestion(): Question<
  OverlayAdvancedQuestionData,
  OverlayAdvancedChoiceData
> {
  const fixedQ = FIXED_QUESTIONS[Math.floor(Math.random() * FIXED_QUESTIONS.length)];
  const correct = computeOverlap(fixedQ.gridA, fixedQ.gridB);

  const distractors = generateDistractors(correct, 3);

  const correctIndex = Math.floor(Math.random() * 4);
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
}

/** 固定問題プールの全問題を返す */
export function getAllOverlayAdvancedQuestions(): Question<
  OverlayAdvancedQuestionData,
  OverlayAdvancedChoiceData
>[] {
  return FIXED_QUESTIONS.map((fixedQ) => {
    const correct = computeOverlap(fixedQ.gridA, fixedQ.gridB);
    const distractors = generateDistractors(correct, 3);
    const correctIndex = Math.floor(Math.random() * 4);
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
