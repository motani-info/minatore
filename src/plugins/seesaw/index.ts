import type { QuestionType } from '../../types/question';
import type { SeesawQuestionData, SeesawChoiceData } from './types';
import { generateSeesawQuestion, checkSeesawAnswer } from './seesawQuestion';
import { SeesawQuestionDisplay } from './components/QuestionDisplay';
import { SeesawChoiceDisplay } from './components/ChoiceDisplay';
import { registry } from '../../registry/questionTypeRegistry';

/**
 * 比較（重さ：シーソー）問題タイプ定義
 * QuestionType インターフェースに準拠
 *
 * 注意: この問題タイプは専用画面（SeesawScreen）を使用するため、
 * QuestionDisplay/ChoiceDisplay は共通QuestionScreenでの表示用。
 * 実際の問題画面は /question/seesaw ルートで SeesawScreen を使用する。
 */
export const seesawQuestionType: QuestionType<SeesawQuestionData, SeesawChoiceData> = {
  id: 'seesaw',
  displayName: '比較（重さ）',
  icon: '⚖️',
  generateQuestion: generateSeesawQuestion,
  QuestionDisplay: SeesawQuestionDisplay,
  ChoiceDisplay: SeesawChoiceDisplay,
  checkAnswer: checkSeesawAnswer,
};

/** レジストリへの登録 */
export function registerSeesawPlugin(): void {
  registry.register(seesawQuestionType as QuestionType);
}
