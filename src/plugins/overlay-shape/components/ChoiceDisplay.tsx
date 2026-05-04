import type { OverlayShapeChoiceData } from '../types';
import { ShapePatternDisplay } from './ShapePatternDisplay';

interface ChoiceDisplayProps {
  data: OverlayShapeChoiceData;
  isSelected: boolean;
  isCorrect: boolean;
  showResult: boolean;
}

/**
 * 重ね図形（図形パターン）問題の選択肢表示コンポーネント
 * 重なった結果を濃い灰色で表示
 */
export const OverlayShapeChoiceDisplay: React.FC<ChoiceDisplayProps> = ({ data }) => {
  return <ShapePatternDisplay pattern={data.pattern} size="small" isAnswer />;
};
