import type { Question } from '../../types/question';
import type {
  RotationSequenceQuestionData,
  RotationSequenceChoiceData,
  PictureType,
  RotationAngle,
  SequenceFrame,
} from './types';

// ─── ヘルパー ───

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** 角度を正規化（0-359） */
function normalizeAngle(angle: number): RotationAngle {
  return ((angle % 360 + 360) % 360) as RotationAngle;
}

/** 正しい回転シーケンスを生成 */
function generateCorrectSequence(startAngle: RotationAngle, step: 90 | -90): SequenceFrame[] {
  const frames: SequenceFrame[] = [];
  let current = startAngle;
  for (let i = 0; i < 5; i++) {
    frames.push({ angle: current });
    current = normalizeAngle(current + step);
  }
  return frames;
}

// ─── 固定問題プール ───

interface FixedSequenceQuestion {
  pictureType: PictureType;
  startAngle: RotationAngle;
  rotationStep: 90 | -90;
  /** 間違いフレームの位置（0-4、ただし0は最初なので1-4が自然） */
  wrongIndex: number;
  /** 間違いフレームの角度 */
  wrongAngle: RotationAngle;
}

const FIXED_QUESTIONS: FixedSequenceQuestion[] = [
  // (1) カエル - 右回転、3番目が間違い
  { pictureType: 'frog', startAngle: 0, rotationStep: 90, wrongIndex: 2, wrongAngle: 180 },
  // (2) ゾウ - 右回転、4番目が間違い
  { pictureType: 'elephant', startAngle: 0, rotationStep: 90, wrongIndex: 3, wrongAngle: 0 },
  // (3) ゾウ - 右回転、2番目が間違い
  { pictureType: 'elephant', startAngle: 90, rotationStep: 90, wrongIndex: 1, wrongAngle: 0 },
  // (4) リス - 右回転、4番目が間違い
  { pictureType: 'squirrel', startAngle: 0, rotationStep: 90, wrongIndex: 3, wrongAngle: 180 },
  // (5) ドット - 右回転、3番目が間違い
  { pictureType: 'dots', startAngle: 0, rotationStep: 90, wrongIndex: 2, wrongAngle: 0 },
  // (6) 傘 - 右回転、4番目が間違い
  { pictureType: 'umbrella', startAngle: 0, rotationStep: 90, wrongIndex: 3, wrongAngle: 90 },
  // (7) 傘 - 右回転、2番目が間違い
  { pictureType: 'umbrella', startAngle: 90, rotationStep: 90, wrongIndex: 1, wrongAngle: 270 },
  // (8) 船 - 右回転、3番目が間違い
  { pictureType: 'boat', startAngle: 0, rotationStep: 90, wrongIndex: 2, wrongAngle: 270 },
  // (9) 鉛筆 - 右回転、4番目が間違い
  { pictureType: 'pencil', startAngle: 0, rotationStep: 90, wrongIndex: 3, wrongAngle: 0 },
  // (10) 星と花 - 右回転、2番目が間違い
  { pictureType: 'star-flower', startAngle: 0, rotationStep: 90, wrongIndex: 1, wrongAngle: 180 },
  // 追加問題: 左回転バリエーション
  { pictureType: 'frog', startAngle: 0, rotationStep: -90, wrongIndex: 2, wrongAngle: 90 },
  { pictureType: 'boat', startAngle: 90, rotationStep: -90, wrongIndex: 3, wrongAngle: 180 },
  { pictureType: 'pencil', startAngle: 270, rotationStep: -90, wrongIndex: 1, wrongAngle: 0 },
  { pictureType: 'dots', startAngle: 180, rotationStep: -90, wrongIndex: 2, wrongAngle: 180 },
  { pictureType: 'star-flower', startAngle: 90, rotationStep: -90, wrongIndex: 3, wrongAngle: 0 },
  { pictureType: 'squirrel', startAngle: 270, rotationStep: 90, wrongIndex: 1, wrongAngle: 0 },
  { pictureType: 'elephant', startAngle: 180, rotationStep: -90, wrongIndex: 2, wrongAngle: 0 },
  { pictureType: 'umbrella', startAngle: 270, rotationStep: 90, wrongIndex: 4, wrongAngle: 0 },
  { pictureType: 'frog', startAngle: 90, rotationStep: 90, wrongIndex: 3, wrongAngle: 90 },
  { pictureType: 'boat', startAngle: 0, rotationStep: 90, wrongIndex: 4, wrongAngle: 0 },
];

/** 固定問題を Question 形式に変換 */
function buildQuestion(fixed: FixedSequenceQuestion): Question<RotationSequenceQuestionData, RotationSequenceChoiceData> {
  const correctFrames = generateCorrectSequence(fixed.startAngle, fixed.rotationStep);

  // 間違いフレームを差し替え
  const frames = [...correctFrames];
  frames[fixed.wrongIndex] = { angle: fixed.wrongAngle };

  // 選択肢: 0〜4（5つのフレーム位置）
  const choices: RotationSequenceChoiceData[] = [0, 1, 2, 3, 4];
  const correctIndex = fixed.wrongIndex;

  return {
    questionData: {
      pictureType: fixed.pictureType,
      frames,
      wrongIndex: fixed.wrongIndex,
      rotationStep: fixed.rotationStep,
    },
    choices,
    correctIndex,
    instructionText: 'まちがっている えに\n×をつけましょう',
  };
}

/** ランダムに1問生成 */
export function generateRotationSequenceQuestion(): Question<RotationSequenceQuestionData, RotationSequenceChoiceData> {
  const fixed = randomItem(FIXED_QUESTIONS);
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
