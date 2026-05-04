import type { QuestionType } from '../../types/question';
import type { RotationSequenceQuestionData, RotationSequenceChoiceData } from './types';
import {
  generateRotationSequenceQuestion,
  getAllRotationSequenceQuestions,
  checkRotationSequenceAnswer,
} from './rotationSequenceQuestion';
import { RotationSequenceQuestionDisplay } from './components/QuestionDisplay';
import { RotationSequenceChoiceDisplay } from './components/ChoiceDisplay';
import { registry } from '../../registry/questionTypeRegistry';

export const rotationSequenceQuestionType: QuestionType<RotationSequenceQuestionData, RotationSequenceChoiceData> = {
  id: 'rotation-sequence',
  displayName: '回転図形（連続）',
  icon: '🔄',
  generateQuestion: generateRotationSequenceQuestion,
  getAllQuestions: getAllRotationSequenceQuestions,
  QuestionDisplay: RotationSequenceQuestionDisplay,
  ChoiceDisplay: RotationSequenceChoiceDisplay,
  checkAnswer: checkRotationSequenceAnswer,
};

export function registerRotationSequencePlugin(): void {
  registry.register(rotationSequenceQuestionType as QuestionType);
}
