import type { QuestionType } from '../../types/question';
import type { RotationQuestionData, RotationChoiceData } from './types';
import { generateRotationQuestion, checkAnswer } from './rotationQuestion';
import { RotationQuestionDisplay } from './components/QuestionDisplay';
import { RotationChoiceDisplay } from './components/ChoicesDisplay';
import { registry } from '../../registry/questionTypeRegistry';

/**
 * 回転図形問題タイプ定義
 * QuestionType インターフェースに準拠
 */
export const rotationQuestionType: QuestionType<RotationQuestionData, RotationChoiceData> = {
  id: 'rotation',
  displayName: 'かいてんずけい',
  icon: '🔄',
  generateQuestion: generateRotationQuestion,
  QuestionDisplay: RotationQuestionDisplay,
  ChoiceDisplay: RotationChoiceDisplay,
  checkAnswer,
};

/** レジストリへの登録 */
export function registerRotationPlugin(): void {
  registry.register(rotationQuestionType as QuestionType);
}
