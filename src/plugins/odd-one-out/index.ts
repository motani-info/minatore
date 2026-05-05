import type { QuestionType } from '../../types/question';
import type { OddOneOutQuestionData, OddOneOutChoiceData } from './types';
import { generateOddOneOutQuestion, checkOddOneOutAnswer, getAllOddOneOutQuestions } from './oddOneOutQuestion';
import { OddOneOutQuestionDisplay } from './components/QuestionDisplay';
import { OddOneOutChoiceDisplay } from './components/ChoiceDisplay';
import { registry } from '../../registry/questionTypeRegistry';

export const oddOneOutQuestionType: QuestionType<OddOneOutQuestionData, OddOneOutChoiceData> = {
  id: 'odd-one-out',
  displayName: '異図形発見',
  icon: '🔍',
  generateQuestion: generateOddOneOutQuestion,
  getAllQuestions: getAllOddOneOutQuestions,
  QuestionDisplay: OddOneOutQuestionDisplay,
  ChoiceDisplay: OddOneOutChoiceDisplay,
  checkAnswer: checkOddOneOutAnswer,
};

export function registerOddOneOutPlugin(): void {
  registry.register(oddOneOutQuestionType as QuestionType);
}
