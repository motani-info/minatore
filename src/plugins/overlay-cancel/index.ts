import type { QuestionType } from '../../types/question';
import type { OverlayCancelQuestionData, OverlayCancelChoiceData } from './types';
import {
  generateOverlayCancel2x2Question,
  getAllOverlayCancel2x2Questions,
  generateOverlayCancel3x3Question,
  getAllOverlayCancel3x3Questions,
  generateOverlayCancel4x4Question,
  getAllOverlayCancel4x4Questions,
  checkOverlayCancelAnswer,
} from './overlayCancelQuestion';
import { OverlayCancelQuestionDisplay } from './components/QuestionDisplay';
import { OverlayCancelChoiceDisplay } from './components/ChoiceDisplay';
import { registry } from '../../registry/questionTypeRegistry';

// 2×2（基本）
export const overlayCancelQuestionType: QuestionType<OverlayCancelQuestionData, OverlayCancelChoiceData> = {
  id: 'overlay-cancel',
  displayName: '折り重ね（相殺）',
  icon: '🔲',
  generateQuestion: generateOverlayCancel2x2Question,
  getAllQuestions: getAllOverlayCancel2x2Questions,
  QuestionDisplay: OverlayCancelQuestionDisplay,
  ChoiceDisplay: OverlayCancelChoiceDisplay,
  checkAnswer: checkOverlayCancelAnswer,
};

// 3×3（応用）
export const overlayCancel3x3QuestionType: QuestionType<OverlayCancelQuestionData, OverlayCancelChoiceData> = {
  id: 'overlay-cancel-3x3',
  displayName: '折り重ね（相殺）',
  icon: '🔲',
  generateQuestion: generateOverlayCancel3x3Question,
  getAllQuestions: getAllOverlayCancel3x3Questions,
  QuestionDisplay: OverlayCancelQuestionDisplay,
  ChoiceDisplay: OverlayCancelChoiceDisplay,
  checkAnswer: checkOverlayCancelAnswer,
};

// 4×4（発展）
export const overlayCancel4x4QuestionType: QuestionType<OverlayCancelQuestionData, OverlayCancelChoiceData> = {
  id: 'overlay-cancel-4x4',
  displayName: '折り重ね（相殺）',
  icon: '🔲',
  generateQuestion: generateOverlayCancel4x4Question,
  getAllQuestions: getAllOverlayCancel4x4Questions,
  QuestionDisplay: OverlayCancelQuestionDisplay,
  ChoiceDisplay: OverlayCancelChoiceDisplay,
  checkAnswer: checkOverlayCancelAnswer,
};

export function registerOverlayCancelPlugin(): void {
  registry.register(overlayCancelQuestionType as QuestionType);
}

export function registerOverlayCancel3x3Plugin(): void {
  registry.register(overlayCancel3x3QuestionType as QuestionType);
}

export function registerOverlayCancel4x4Plugin(): void {
  registry.register(overlayCancel4x4QuestionType as QuestionType);
}
