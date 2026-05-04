import type { QuestionType } from '../../types/question';
import type { SyllableCountQuestionData, SyllableCountChoiceData } from './types';
import { generateSyllableCountQuestion, checkSyllableCountAnswer } from './syllableCountQuestion';
import { SyllableCountQuestionDisplay } from './components/QuestionDisplay';
import { SyllableCountChoiceDisplay } from './components/ChoiceDisplay';
import { registry } from '../../registry/questionTypeRegistry';

export const syllableCountQuestionType: QuestionType<SyllableCountQuestionData, SyllableCountChoiceData> = {
  id: 'syllable-count',
  displayName: '文字数あつまり',
  icon: '🔤',
  generateQuestion: generateSyllableCountQuestion,
  QuestionDisplay: SyllableCountQuestionDisplay,
  ChoiceDisplay: SyllableCountChoiceDisplay,
  checkAnswer: checkSyllableCountAnswer,
};

export function registerSyllableCountPlugin(): void {
  registry.register(syllableCountQuestionType as QuestionType);
}
