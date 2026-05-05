import type { Question } from '../../types/question';
import type {
  RotationSequenceQuestionData,
  RotationSequenceChoiceData,
  PictureType,
  RotationAngle,
  RotationDirection,
} from './types';

// ─── ヘルパー ───

/** 角度を正規化（0, 90, 180, 270） */
function normalizeAngle(angle: number): RotationAngle {
  return ((angle % 360 + 360) % 360) as RotationAngle;
}

/** 指定方向に回転した結果の角度を返す */
function applyRotation(originalAngle: RotationAngle, direction: RotationDirection): RotationAngle {
  switch (direction) {
    case 'right1':
      return normalizeAngle(originalAngle + 90);
    case 'left1':
      return normalizeAngle(originalAngle - 90);
    case 'right2':
      return normalizeAngle(originalAngle + 180);
    case 'left2':
      return normalizeAngle(originalAngle + 180);
  }
}

/** 回転方向に対応する指示テキストを生成する */
function getInstructionText(direction: RotationDirection): string {
  switch (direction) {
    case 'right1':
      return 'みぎに1かいまわしたとき、どれになりますか。\nそのえにまるをつけましょう';
    case 'left1':
      return 'ひだりに1かいまわしたとき、どれになりますか。\nそのえにまるをつけましょう';
    case 'right2':
      return 'みぎに2かいまわしたとき、どれになりますか。\nそのえにまるをつけましょう';
    case 'left2':
      return 'ひだりに2かいまわしたとき、どれになりますか。\nそのえにまるをつけましょう';
  }
}

/** 配列をシャッフルする（Fisher-Yates） */
function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// ─── 固定問題プール ───

interface FixedQuestion {
  pictureType: PictureType;
  originalAngle: RotationAngle;
  direction: RotationDirection;
}

const FIXED_QUESTIONS: FixedQuestion[] = [
  // カエル
  { pictureType: 'frog', originalAngle: 0, direction: 'right1' },
  { pictureType: 'frog', originalAngle: 0, direction: 'left1' },
  { pictureType: 'frog', originalAngle: 90, direction: 'right1' },
  { pictureType: 'frog', originalAngle: 270, direction: 'left1' },
  // ゾウ
  { pictureType: 'elephant', originalAngle: 0, direction: 'right1' },
  { pictureType: 'elephant', originalAngle: 0, direction: 'left1' },
  { pictureType: 'elephant', originalAngle: 90, direction: 'left1' },
  { pictureType: 'elephant', originalAngle: 180, direction: 'right1' },
  // リス
  { pictureType: 'squirrel', originalAngle: 0, direction: 'right1' },
  { pictureType: 'squirrel', originalAngle: 0, direction: 'left1' },
  { pictureType: 'squirrel', originalAngle: 270, direction: 'right1' },
  // ドット
  { pictureType: 'dots', originalAngle: 0, direction: 'right1' },
  { pictureType: 'dots', originalAngle: 0, direction: 'left1' },
  { pictureType: 'dots', originalAngle: 90, direction: 'right1' },
  // 傘
  { pictureType: 'umbrella', originalAngle: 0, direction: 'right1' },
  { pictureType: 'umbrella', originalAngle: 0, direction: 'left1' },
  { pictureType: 'umbrella', originalAngle: 90, direction: 'left1' },
  { pictureType: 'umbrella', originalAngle: 180, direction: 'right1' },
  // 船
  { pictureType: 'boat', originalAngle: 0, direction: 'right1' },
  { pictureType: 'boat', originalAngle: 0, direction: 'left1' },
  { pictureType: 'boat', originalAngle: 90, direction: 'right1' },
  { pictureType: 'boat', originalAngle: 270, direction: 'left1' },
  // 鉛筆
  { pictureType: 'pencil', originalAngle: 0, direction: 'right1' },
  { pictureType: 'pencil', originalAngle: 0, direction: 'left1' },
  { pictureType: 'pencil', originalAngle: 180, direction: 'left1' },
  // 星と花
  { pictureType: 'star-flower', originalAngle: 0, direction: 'right1' },
  { pictureType: 'star-flower', originalAngle: 0, direction: 'left1' },
  { pictureType: 'star-flower', originalAngle: 90, direction: 'left1' },
  // 2回転バリエーション
  { pictureType: 'frog', originalAngle: 0, direction: 'right2' },
  { pictureType: 'elephant', originalAngle: 0, direction: 'right2' },
];

/** 固定問題を Question 形式に変換 */
function buildQuestion(fixed: FixedQuestion): Question<RotationSequenceQuestionData, RotationSequenceChoiceData> {
  const correctAngle = applyRotation(fixed.originalAngle, fixed.direction);

  // 4つの選択肢: 0°, 90°, 180°, 270° をシャッフル
  const allAngles: RotationAngle[] = [0, 90, 180, 270];
  const shuffledAngles = shuffle(allAngles);

  // 選択肢データを生成（各選択肢に pictureType を含める）
  const choices: RotationSequenceChoiceData[] = shuffledAngles.map((angle) => ({
    pictureType: fixed.pictureType,
    angle,
  }));

  // 正解のインデックスを見つける
  const correctIndex = shuffledAngles.indexOf(correctAngle);

  return {
    questionData: {
      pictureType: fixed.pictureType,
      originalAngle: fixed.originalAngle,
      direction: fixed.direction,
    },
    choices,
    correctIndex,
    instructionText: getInstructionText(fixed.direction),
  };
}

/** 現在の出題インデックス */
let currentIndex = 0;

/** 問題を順番に生成する */
export function generateRotationSequenceQuestion(): Question<RotationSequenceQuestionData, RotationSequenceChoiceData> {
  const fixed = FIXED_QUESTIONS[currentIndex % FIXED_QUESTIONS.length];
  currentIndex++;
  return buildQuestion(fixed);
}

/** 全問題を返す */
export function getAllRotationSequenceQuestions(): Question<RotationSequenceQuestionData, RotationSequenceChoiceData>[] {
  return FIXED_QUESTIONS.map(buildQuestion);
}

/** 正解判定 */
export function checkRotationSequenceAnswer(
  question: Question<RotationSequenceQuestionData, RotationSequenceChoiceData>,
  selectedIndex: number,
): boolean {
  return selectedIndex === question.correctIndex;
}
