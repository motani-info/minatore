import type { QuestionType } from '../../types/question';
import type { AreaCompareQuestionData, AreaCompareChoiceData } from './types';
import { generateAreaCompareQuestion, checkAreaCompareAnswer } from './areaCompareQuestion';
import { AreaCompareQuestionDisplay } from './components/QuestionDisplay';
import { AreaCompareChoiceDisplay } from './components/ChoiceDisplay';
import { registry } from '../../registry/questionTypeRegistry';

/**
 * 比較（広さ）問題タイプ定義
 * グリッド上の黒い部分の広さを比較する問題
 *
 * 注意: この問題タイプは専用画面（AreaCompareScreen）を使用する
 */
export const areaCompareQuestionType: QuestionType<AreaCompareQuestionData, AreaCompareChoiceData> = {
  id: 'area-compare',
  displayName: '比較（広さ）',
  icon: '⬛',
  generateQuestion: generateAreaCompareQuestion,
  QuestionDisplay: AreaCompareQuestionDisplay,
  ChoiceDisplay: AreaCompareChoiceDisplay,
  checkAnswer: checkAreaCompareAnswer,
};

/** レジストリへの登録 */
export function registerAreaComparePlugin(): void {
  registry.register(areaCompareQuestionType as QuestionType);
}
