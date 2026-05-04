import type { QuestionType } from '../../types/question';
import type { WaterVolumeQuestionData, WaterVolumeChoiceData } from './types';
import { generateWaterVolumeQuestion, checkWaterVolumeAnswer } from './waterVolumeQuestion';
import { WaterVolumeQuestionDisplay } from './components/QuestionDisplay';
import { WaterVolumeChoiceDisplay } from './components/ChoiceDisplay';
import { registry } from '../../registry/questionTypeRegistry';

/**
 * 比較（水量）問題タイプ定義
 * コップや水槽の水量を比較する問題
 *
 * 注意: この問題タイプは専用画面（WaterVolumeScreen）を使用するため、
 * QuestionDisplay/ChoiceDisplay は共通QuestionScreenでの表示用。
 * 実際の問題画面は /question/water-volume ルートで WaterVolumeScreen を使用する。
 */
export const waterVolumeQuestionType: QuestionType<WaterVolumeQuestionData, WaterVolumeChoiceData> = {
  id: 'water-volume',
  displayName: '比較（水量）',
  icon: '💧',
  generateQuestion: generateWaterVolumeQuestion,
  QuestionDisplay: WaterVolumeQuestionDisplay,
  ChoiceDisplay: WaterVolumeChoiceDisplay,
  checkAnswer: checkWaterVolumeAnswer,
};

/** レジストリへの登録 */
export function registerWaterVolumePlugin(): void {
  registry.register(waterVolumeQuestionType as QuestionType);
}
