import type { QuestionType } from '../../types/question';
import type { LineDecomposeQuestionData, LineDecomposeChoiceData } from './types';
import { generateLineDecomposeQuestion, checkLineDecomposeAnswer, getAllLineDecomposeQuestions } from './lineDecomposeQuestion';
import { LineDecomposeQuestionDisplay } from './components/QuestionDisplay';
import { LineDecomposeChoiceDisplay } from './components/ChoiceDisplay';
import { registry } from '../../registry/questionTypeRegistry';

/**
 * 線図形の分解問題タイプ定義
 * お手本（完成形）と1つの構成図形が与えられ、足りない線を4択から選ぶ
 */
export const lineDecomposeQuestionType: QuestionType<LineDecomposeQuestionData, LineDecomposeChoiceData> = {
  id: 'line-decompose',
  displayName: '重ね図形（分解）',
  icon: '📐',
  generateQuestion: generateLineDecomposeQuestion,
  getAllQuestions: getAllLineDecomposeQuestions,
  QuestionDisplay: LineDecomposeQuestionDisplay,
  ChoiceDisplay: LineDecomposeChoiceDisplay,
  checkAnswer: checkLineDecomposeAnswer,
};

/** レジストリへの登録 */
export function registerLineDecomposePlugin(): void {
  registry.register(lineDecomposeQuestionType as QuestionType);
}
