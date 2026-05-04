import type { QuestionType } from '../../types/question';
import type { CompareSpringQuestionData, CompareSpringChoiceData } from './types';
import { generateCompareSpringQuestion, checkCompareSpringAnswer } from './compareSpringQuestion';
import { CompareSpringQuestionDisplay } from './components/QuestionDisplay';
import { CompareSpringChoiceDisplay } from './components/ChoiceDisplay';
import { registry } from '../../registry/questionTypeRegistry';

/**
 * 比較（重さ：ばね）問題タイプ定義
 */
export const compareSpringQuestionType: QuestionType<
  CompareSpringQuestionData,
  CompareSpringChoiceData
> = {
  id: 'compare-spring',
  displayName: '比較（ばね）',
  icon: '🔩',
  generateQuestion: generateCompareSpringQuestion,
  QuestionDisplay: CompareSpringQuestionDisplay,
  ChoiceDisplay: CompareSpringChoiceDisplay,
  checkAnswer: checkCompareSpringAnswer,
};

/** レジストリへの登録 */
export function registerCompareSpringPlugin(): void {
  registry.register(compareSpringQuestionType as QuestionType);
}
