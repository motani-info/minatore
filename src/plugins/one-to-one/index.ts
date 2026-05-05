import type { QuestionType } from '../../types/question';
import type { OneToOneQuestionData, OneToOneChoiceData } from './types';
import { generateOneToOneQuestion, checkOneToOneAnswer, getAllOneToOneQuestions } from './oneToOneQuestion';
import { OneToOneQuestionDisplay } from './components/QuestionDisplay';
import { OneToOneChoiceDisplay } from './components/ChoiceDisplay';
import { registry } from '../../registry/questionTypeRegistry';

export const oneToOneQuestionType: QuestionType<OneToOneQuestionData, OneToOneChoiceData> = {
  id: 'one-to-one',
  displayName: '1対1対応',
  icon: '🐤',
  generateQuestion: generateOneToOneQuestion,
  getAllQuestions: getAllOneToOneQuestions,
  QuestionDisplay: OneToOneQuestionDisplay,
  ChoiceDisplay: OneToOneChoiceDisplay,
  checkAnswer: checkOneToOneAnswer,
};

export function registerOneToOnePlugin(): void {
  registry.register(oneToOneQuestionType as QuestionType);
}
