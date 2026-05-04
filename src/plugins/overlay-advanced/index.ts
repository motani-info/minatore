import type { QuestionType } from '../../types/question';
import type { OverlayAdvancedQuestionData, OverlayAdvancedChoiceData } from './types';
import {
  generateOverlayAdvancedQuestion,
  checkOverlayAdvancedAnswer,
  getAllOverlayAdvancedQuestions,
} from './overlayAdvancedQuestion';
import { OverlayAdvancedQuestionDisplay } from './components/QuestionDisplay';
import { OverlayAdvancedChoiceDisplay } from './components/ChoiceDisplay';
import { registry } from '../../registry/questionTypeRegistry';

/**
 * 重ね図形応用問題タイプ定義
 */
export const overlayAdvancedQuestionType: QuestionType<
  OverlayAdvancedQuestionData,
  OverlayAdvancedChoiceData
> = {
  id: 'overlay-advanced',
  displayName: '重ね図形（応用）',
  icon: '🔲',
  generateQuestion: generateOverlayAdvancedQuestion,
  getAllQuestions: getAllOverlayAdvancedQuestions,
  QuestionDisplay: OverlayAdvancedQuestionDisplay,
  ChoiceDisplay: OverlayAdvancedChoiceDisplay,
  checkAnswer: checkOverlayAdvancedAnswer,
};

/** レジストリへの登録 */
export function registerOverlayAdvancedPlugin(): void {
  registry.register(overlayAdvancedQuestionType as QuestionType);
}
