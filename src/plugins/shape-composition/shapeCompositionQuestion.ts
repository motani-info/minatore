import type { Question } from '../../types/question';
import type {
  ShapeCompositionQuestionData,
  ShapeCompositionChoiceData,
  ModelShape,
  PartsSet,
} from './types';

// ─── ヘルパー ───

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ─── 固定問題プール ───

interface FixedCompositionQuestion {
  /** お手本のSVGポリゴン群 */
  model: ModelShape;
  /** 正解のパーツセット */
  correctParts: PartsSet;
  /** 不正解のパーツセット（3つ） */
  distractors: [PartsSet, PartsSet, PartsSet];
}

/**
 * 問題(1): 矢印＋三角＋丸の組み合わせ → 家のような形
 * お手本: 三角屋根の家（三角＋四角＋丸窓）
 */
const q1: FixedCompositionQuestion = {
  model: [
    // 三角屋根
    '20,45 50,15 80,45',
    // 四角い本体
    '25,45 75,45 75,85 25,85',
    // 丸窓
  ],
  correctParts: [
    { type: 'triangle', width: 60, height: 35, filled: true },
    { type: 'rect', width: 50, height: 40, filled: false },
    { type: 'circle', width: 20, height: 20, filled: false },
  ],
  distractors: [
    [
      { type: 'triangle', width: 60, height: 35, filled: true },
      { type: 'square', width: 40, height: 40, filled: false },
      { type: 'square', width: 20, height: 20, filled: false },
    ],
    [
      { type: 'rect', width: 60, height: 35, filled: true },
      { type: 'rect', width: 50, height: 40, filled: false },
      { type: 'circle', width: 20, height: 20, filled: false },
    ],
    [
      { type: 'triangle', width: 60, height: 35, filled: false },
      { type: 'rect', width: 50, height: 40, filled: true },
      { type: 'circle', width: 20, height: 20, filled: true },
    ],
  ],
};

/**
 * 問題(2): 丸と四角の組み合わせ
 * お手本: 大きな丸の中に四角、横に小さな丸
 */
const q2: FixedCompositionQuestion = {
  model: [
    // 大きな丸（左）
    '15,25 15,75',  // circle placeholder
    // 四角（中央）
    '35,35 65,35 65,65 35,65',
    // 小さな丸（右下）
  ],
  correctParts: [
    { type: 'circle', width: 45, height: 45, filled: false },
    { type: 'square', width: 30, height: 30, filled: false },
    { type: 'circle', width: 20, height: 20, filled: false },
  ],
  distractors: [
    [
      { type: 'circle', width: 45, height: 45, filled: false },
      { type: 'circle', width: 30, height: 30, filled: false },
      { type: 'circle', width: 20, height: 20, filled: false },
    ],
    [
      { type: 'circle', width: 45, height: 45, filled: true },
      { type: 'square', width: 30, height: 30, filled: false },
      { type: 'square', width: 20, height: 20, filled: false },
    ],
    [
      { type: 'semicircle', width: 45, height: 45, filled: false },
      { type: 'square', width: 30, height: 30, filled: false },
      { type: 'circle', width: 20, height: 20, filled: false },
    ],
  ],
};

/**
 * 問題(3): 三角と四角の組み合わせ
 * お手本: 大きな三角の中に小さな四角と三角
 */
const q3: FixedCompositionQuestion = {
  model: [
    '50,10 90,85 10,85',  // 大三角
    '35,50 65,50 65,75 35,75',  // 四角
  ],
  correctParts: [
    { type: 'triangle', width: 70, height: 65, filled: false },
    { type: 'rect', width: 30, height: 25, filled: false },
    { type: 'triangle', width: 20, height: 18, filled: true },
  ],
  distractors: [
    [
      { type: 'triangle', width: 70, height: 65, filled: false },
      { type: 'rect', width: 30, height: 25, filled: false },
      { type: 'circle', width: 20, height: 20, filled: true },
    ],
    [
      { type: 'triangle', width: 70, height: 65, filled: true },
      { type: 'rect', width: 30, height: 25, filled: true },
      { type: 'triangle', width: 20, height: 18, filled: true },
    ],
    [
      { type: 'square', width: 70, height: 65, filled: false },
      { type: 'rect', width: 30, height: 25, filled: false },
      { type: 'triangle', width: 20, height: 18, filled: true },
    ],
  ],
};

/**
 * 問題(4): 長方形の組み合わせ
 * お手本: 縦長の長方形＋横長の長方形＋正方形
 */
const q4: FixedCompositionQuestion = {
  model: [
    '10,10 30,10 30,90 10,90',  // 縦長
    '35,50 90,50 90,70 35,70',  // 横長
    '60,20 80,20 80,45 60,45',  // 正方形
  ],
  correctParts: [
    { type: 'rect', width: 20, height: 80, filled: false },
    { type: 'rect', width: 55, height: 20, filled: false },
    { type: 'square', width: 25, height: 25, filled: false },
  ],
  distractors: [
    [
      { type: 'rect', width: 20, height: 80, filled: false },
      { type: 'rect', width: 55, height: 20, filled: false },
      { type: 'circle', width: 25, height: 25, filled: false },
    ],
    [
      { type: 'rect', width: 20, height: 80, filled: false },
      { type: 'rect', width: 20, height: 55, filled: false },
      { type: 'square', width: 25, height: 25, filled: false },
    ],
    [
      { type: 'square', width: 20, height: 20, filled: false },
      { type: 'rect', width: 55, height: 20, filled: false },
      { type: 'square', width: 25, height: 25, filled: false },
    ],
  ],
};

/**
 * 問題(5): 十字と四角
 * お手本: 十字形＋小さな正方形2つ
 */
const q5: FixedCompositionQuestion = {
  model: [
    '35,10 65,10 65,35 90,35 90,65 65,65 65,90 35,90 35,65 10,65 10,35 35,35',  // 十字
  ],
  correctParts: [
    { type: 'cross', width: 60, height: 60, filled: false },
    { type: 'square', width: 20, height: 20, filled: false },
    { type: 'square', width: 20, height: 20, filled: false },
  ],
  distractors: [
    [
      { type: 'rect', width: 60, height: 20, filled: false },
      { type: 'rect', width: 20, height: 60, filled: false },
      { type: 'square', width: 20, height: 20, filled: false },
    ],
    [
      { type: 'cross', width: 60, height: 60, filled: false },
      { type: 'circle', width: 20, height: 20, filled: false },
      { type: 'circle', width: 20, height: 20, filled: false },
    ],
    [
      { type: 'cross', width: 60, height: 60, filled: true },
      { type: 'square', width: 20, height: 20, filled: true },
      { type: 'square', width: 20, height: 20, filled: true },
    ],
  ],
};

/**
 * 問題(6): 矢印形
 * お手本: 矢印（三角＋長方形）
 */
const q6: FixedCompositionQuestion = {
  model: [
    '50,10 85,50 65,50 65,90 35,90 35,50 15,50',  // 矢印
  ],
  correctParts: [
    { type: 'triangle', width: 50, height: 35, filled: false },
    { type: 'rect', width: 25, height: 40, filled: false },
    { type: 'square', width: 10, height: 10, filled: false },
  ],
  distractors: [
    [
      { type: 'triangle', width: 50, height: 35, filled: true },
      { type: 'rect', width: 25, height: 40, filled: false },
      { type: 'square', width: 10, height: 10, filled: false },
    ],
    [
      { type: 'semicircle', width: 50, height: 35, filled: false },
      { type: 'rect', width: 25, height: 40, filled: false },
      { type: 'square', width: 10, height: 10, filled: false },
    ],
    [
      { type: 'triangle', width: 50, height: 35, filled: false },
      { type: 'square', width: 25, height: 40, filled: false },
      { type: 'circle', width: 10, height: 10, filled: false },
    ],
  ],
};

/**
 * 問題(7): 丸と線の組み合わせ
 */
const q7: FixedCompositionQuestion = {
  model: [
    '20,20 80,20 80,80 20,80',  // 大きな四角
  ],
  correctParts: [
    { type: 'rect', width: 60, height: 30, filled: false },
    { type: 'rect', width: 60, height: 30, filled: false },
    { type: 'rect', width: 30, height: 60, filled: false },
  ],
  distractors: [
    [
      { type: 'rect', width: 60, height: 30, filled: false },
      { type: 'rect', width: 60, height: 30, filled: false },
      { type: 'circle', width: 30, height: 30, filled: false },
    ],
    [
      { type: 'square', width: 30, height: 30, filled: false },
      { type: 'square', width: 30, height: 30, filled: false },
      { type: 'square', width: 30, height: 30, filled: false },
    ],
    [
      { type: 'rect', width: 60, height: 30, filled: false },
      { type: 'triangle', width: 60, height: 30, filled: false },
      { type: 'rect', width: 30, height: 60, filled: false },
    ],
  ],
};

/**
 * 問題(8): 台形と三角
 */
const q8: FixedCompositionQuestion = {
  model: [
    '30,20 70,20 85,80 15,80',  // 台形
  ],
  correctParts: [
    { type: 'trapezoid', width: 55, height: 45, filled: false },
    { type: 'triangle', width: 20, height: 30, filled: false },
    { type: 'triangle', width: 20, height: 30, filled: false },
  ],
  distractors: [
    [
      { type: 'rect', width: 55, height: 45, filled: false },
      { type: 'triangle', width: 20, height: 30, filled: false },
      { type: 'triangle', width: 20, height: 30, filled: false },
    ],
    [
      { type: 'trapezoid', width: 55, height: 45, filled: false },
      { type: 'rect', width: 20, height: 30, filled: false },
      { type: 'rect', width: 20, height: 30, filled: false },
    ],
    [
      { type: 'trapezoid', width: 55, height: 45, filled: true },
      { type: 'triangle', width: 20, height: 30, filled: true },
      { type: 'triangle', width: 20, height: 30, filled: true },
    ],
  ],
};

const FIXED_QUESTIONS: FixedCompositionQuestion[] = [
  q1, q2, q3, q4, q5, q6, q7, q8,
];

/** 固定問題を Question 形式に変換 */
function buildQuestion(fixed: FixedCompositionQuestion, fixedIndex?: number): Question<ShapeCompositionQuestionData, ShapeCompositionChoiceData> {
  const correctChoice: ShapeCompositionChoiceData = { parts: fixed.correctParts };
  const distractorChoices: ShapeCompositionChoiceData[] = fixed.distractors.map(d => ({ parts: d }));

  // fixedIndexが指定されていれば決定的に、なければランダムに正解位置を決定
  const correctIndex = fixedIndex != null ? (fixedIndex % 4) : Math.floor(Math.random() * 4);
  const choices: ShapeCompositionChoiceData[] = [...distractorChoices];
  choices.splice(correctIndex, 0, correctChoice);

  return {
    questionData: { model: fixed.model },
    choices,
    correctIndex,
    instructionText: '3つのかたちをくみあわせて\nおてほんとおなじかたちを\nつくれるのはどれ？',
  };
}

/** ランダムに1問生成 */
export function generateShapeCompositionQuestion(): Question<ShapeCompositionQuestionData, ShapeCompositionChoiceData> {
  return buildQuestion(randomItem(FIXED_QUESTIONS));
}

/** 全問題を返す */
export function getAllShapeCompositionQuestions(): Question<ShapeCompositionQuestionData, ShapeCompositionChoiceData>[] {
  return FIXED_QUESTIONS.map((q, i) => buildQuestion(q, i));
}

/** 正解判定 */
export function checkShapeCompositionAnswer(
  question: Question<ShapeCompositionQuestionData, ShapeCompositionChoiceData>,
  selectedIndex: number,
): boolean {
  return selectedIndex === question.correctIndex;
}
