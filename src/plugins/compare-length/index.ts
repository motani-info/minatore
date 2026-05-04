import type { QuestionType } from '../../types/question';
import type { CompareLengthQuestionData, CompareLengthChoiceData } from './types';
import { generateCompareLengthQuestion, checkCompareLengthAnswer } from './compareLengthQuestion';
import { CompareLengthQuestionDisplay } from './components/QuestionDisplay';
import { CompareLengthChoiceDisplay } from './components/ChoiceDisplay';
import { registry } from '../../registry/questionTypeRegistry';

/**
 * 比較（長さ）問題タイプ定義
 */
export const compareLengthQuestionType: QuestionType<
  CompareLengthQuestionData,
  CompareLengthChoiceData
> = {
  id: 'compare-length',
  displayName: '比較（長さ）',
  icon: '📏',
  generateQuestion: generateCompareLengthQuestion,
  QuestionDisplay: CompareLengthQuestionDisplay,
  ChoiceDisplay: CompareLengthChoiceDisplay,
  checkAnswer: checkCompareLengthAnswer,
};

/** レジストリへの登録 */
export function registerCompareLengthPlugin(): void {
  registry.register(compareLengthQuestionType as QuestionType);
}
