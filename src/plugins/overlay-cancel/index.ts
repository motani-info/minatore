import type { QuestionType } from '../../types/question';
import type { OverlayCancelQuestionData, OverlayCancelChoiceData } from './types';
import { generateOverlayCancelQuestion, checkOverlayCancelAnswer, getAllOverlayCancelQuestions } from './overlayCancelQuestion';
import { OverlayCancelQuestionDisplay } from './components/QuestionDisplay';
import { OverlayCancelChoiceDisplay } from './components/ChoiceDisplay';
import { registry } from '../../registry/questionTypeRegistry';

export const overlayCancelQuestionType: QuestionType<OverlayCancelQuestionData, OverlayCancelChoiceData> = {
  id: 'overlay-cancel',
  displayName: '折り重ね（相殺）',
  icon: '🔲',
  generateQuestion: generateOverlayCancelQuestion,
  getAllQuestions: getAllOverlayCancelQuestions,
  QuestionDisplay: OverlayCancelQuestionDisplay,
  ChoiceDisplay: OverlayCancelChoiceDisplay,
  checkAnswer: checkOverlayCancelAnswer,
};

export function registerOverlayCancelPlugin(): void {
  registry.register(overlayCancelQuestionType as QuestionType);
}
