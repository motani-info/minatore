import type { QuestionType } from '../../types/question';
import type { OverlayComposeQuestionData, OverlayComposeChoiceData } from './types';
import {
  generateOverlayCompose2x2Question,
  getAllOverlayCompose2x2Questions,
  checkOverlayComposeAnswer,
} from './overlayComposeQuestion';
import { OverlayComposeQuestionDisplay } from './components/QuestionDisplay';
import { OverlayComposeChoiceDisplay } from './components/ChoiceDisplay';
import { registry } from '../../registry/questionTypeRegistry';

// 2×2（合成）
export const overlayComposeQuestionType: QuestionType<OverlayComposeQuestionData, OverlayComposeChoiceData> = {
  id: 'overlay-compose',
  displayName: '折り重ね（合成）',
  icon: '🔲',
  generateQuestion: generateOverlayCompose2x2Question,
  getAllQuestions: getAllOverlayCompose2x2Questions,
  QuestionDisplay: OverlayComposeQuestionDisplay,
  ChoiceDisplay: OverlayComposeChoiceDisplay,
  checkAnswer: checkOverlayComposeAnswer,
};

export function registerOverlayComposePlugin(): void {
  registry.register(overlayComposeQuestionType as QuestionType);
}
