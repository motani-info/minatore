import type { QuestionType } from '../../types/question';
import type { LineOverlayQuestionData, LineOverlayChoiceData } from './types';
import { generateLineOverlayQuestion, checkLineOverlayAnswer, getAllLineOverlayQuestions } from './lineOverlayQuestion';
import { LineOverlayQuestionDisplay } from './components/QuestionDisplay';
import { LineOverlayChoiceDisplay } from './components/ChoiceDisplay';
import { registry } from '../../registry/questionTypeRegistry';

/**
 * 線図形の重ね合わせ問題タイプ定義
 * 4×4ドットグリッド上の線図形を2つ重ねた結果を答える
 */
export const lineOverlayQuestionType: QuestionType<LineOverlayQuestionData, LineOverlayChoiceData> = {
  id: 'line-overlay',
  displayName: '重ね図形（線）',
  icon: '📐',
  generateQuestion: generateLineOverlayQuestion,
  getAllQuestions: getAllLineOverlayQuestions,
  QuestionDisplay: LineOverlayQuestionDisplay,
  ChoiceDisplay: LineOverlayChoiceDisplay,
  checkAnswer: checkLineOverlayAnswer,
};

/** レジストリへの登録 */
export function registerLineOverlayPlugin(): void {
  registry.register(lineOverlayQuestionType as QuestionType);
}
