import type { QuestionType } from '../../types/question';
import type { OverlayShapeQuestionData, OverlayShapeChoiceData } from './types';
import {
  generateOverlayShapeQuestion,
  checkOverlayShapeAnswer,
} from './overlayShapeQuestion';
import { OverlayShapeQuestionDisplay } from './components/QuestionDisplay';
import { OverlayShapeChoiceDisplay } from './components/ChoiceDisplay';
import { registry } from '../../registry/questionTypeRegistry';

/**
 * 重ね図形（図形パターン）問題タイプ定義
 */
export const overlayShapeQuestionType: QuestionType<
  OverlayShapeQuestionData,
  OverlayShapeChoiceData
> = {
  id: 'overlay-shape',
  displayName: '重ね図形（図形）',
  icon: '🔲',
  generateQuestion: generateOverlayShapeQuestion,
  QuestionDisplay: OverlayShapeQuestionDisplay,
  ChoiceDisplay: OverlayShapeChoiceDisplay,
  checkAnswer: checkOverlayShapeAnswer,
};

/** レジストリへの登録 */
export function registerOverlayShapePlugin(): void {
  registry.register(overlayShapeQuestionType as QuestionType);
}
