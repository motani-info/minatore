import type { RotationChoiceData } from '../types';
import { GridDisplay } from './GridDisplay';

interface ChoiceDisplayProps {
  data: RotationChoiceData;
  isSelected: boolean;
  isCorrect: boolean;
  showResult: boolean;
}

/**
 * 回転図形問題の選択肢表示コンポーネント
 * 単一の選択肢グリッドを表示する
 * （QuestionScreen フレームワークが2×2レイアウトで各選択肢を配置する）
 */
export const RotationChoiceDisplay: React.FC<ChoiceDisplayProps> = ({ data }) => {
  return <GridDisplay grid={data} size="small" />;
};
