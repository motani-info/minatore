import type { QuestionType } from '../../types/question';
import type { PuzzleQuestionData, PuzzleChoiceData } from './types';
import { generatePuzzleQuestion, checkPuzzleAnswer, getAllPuzzleQuestions } from './puzzleQuestion';
import { PuzzleQuestionDisplay } from './components/QuestionDisplay';
import { PuzzleChoiceDisplay } from './components/ChoiceDisplay';
import { registry } from '../../registry/questionTypeRegistry';

/**
 * 図形構成パズル問題タイプ定義
 * QuestionType インターフェースに準拠
 */
export const puzzleQuestionType: QuestionType<PuzzleQuestionData, PuzzleChoiceData> = {
  id: 'puzzle',
  displayName: '図形パズル',
  icon: '🧩',
  generateQuestion: generatePuzzleQuestion,
  getAllQuestions: getAllPuzzleQuestions,
  QuestionDisplay: PuzzleQuestionDisplay,
  ChoiceDisplay: PuzzleChoiceDisplay,
  checkAnswer: checkPuzzleAnswer,
};

/** レジストリへの登録 */
export function registerPuzzlePlugin(): void {
  registry.register(puzzleQuestionType as QuestionType);
}
