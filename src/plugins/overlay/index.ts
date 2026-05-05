import type { QuestionType } from '../../types/question';
import type { OverlayQuestionData, OverlayChoiceData } from './types';
import { generateOverlayQuestion, checkOverlayAnswer, getAllOverlayQuestions } from './overlayQuestion';
import { OverlayQuestionDisplay } from './components/QuestionDisplay';
import { OverlayChoiceDisplay } from './components/ChoiceDisplay';
import { registry } from '../../registry/questionTypeRegistry';

/**
 * 折り重ね図形問題タイプ定義
 * QuestionType インターフェースに準拠
 */
export const overlayQuestionType: QuestionType<OverlayQuestionData, OverlayChoiceData> = {
  id: 'overlay',
  displayName: '重ね図形',
  icon: '🔲',
  generateQuestion: generateOverlayQuestion,
  getAllQuestions: getAllOverlayQuestions,
  QuestionDisplay: OverlayQuestionDisplay,
  ChoiceDisplay: OverlayChoiceDisplay,
  checkAnswer: checkOverlayAnswer,
};

/** レジストリへの登録 */
export function registerOverlayPlugin(): void {
  registry.register(overlayQuestionType as QuestionType);
}
