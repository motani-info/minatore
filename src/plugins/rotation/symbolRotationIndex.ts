import type { QuestionType } from '../../types/question';
import type { SymbolRotationQuestionData, SymbolRotationChoiceData } from './types';
import { generateSymbolRotationQuestion, checkSymbolRotationAnswer, getAllSymbolRotationQuestions } from './symbolRotationQuestions';
import { SymbolRotationQuestionDisplay } from './components/SymbolQuestionDisplay';
import { SymbolRotationChoiceDisplay } from './components/SymbolChoiceDisplay';
import { registry } from '../../registry/questionTypeRegistry';

/**
 * シンボル回転図形問題タイプ定義
 */
export const symbolRotationQuestionType: QuestionType<SymbolRotationQuestionData, SymbolRotationChoiceData> = {
  id: 'symbol-rotation',
  displayName: '回転図形（応用）',
  icon: '🎯',
  generateQuestion: generateSymbolRotationQuestion,
  getAllQuestions: getAllSymbolRotationQuestions,
  QuestionDisplay: SymbolRotationQuestionDisplay,
  ChoiceDisplay: SymbolRotationChoiceDisplay,
  checkAnswer: checkSymbolRotationAnswer,
};

/** レジストリへの登録 */
export function registerSymbolRotationPlugin(): void {
  registry.register(symbolRotationQuestionType as QuestionType);
}
