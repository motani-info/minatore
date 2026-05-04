import type { WaterVolumeChoiceData } from '../types';

/**
 * QuestionType.ChoiceDisplay 互換のダミーコンポーネント
 * この問題タイプでは共通の選択肢UIを使わないため、空を返す
 */
export const WaterVolumeChoiceDisplay: React.FC<{
  data: WaterVolumeChoiceData;
  isSelected: boolean;
  isCorrect: boolean;
  showResult: boolean;
}> = () => {
  return null;
};
