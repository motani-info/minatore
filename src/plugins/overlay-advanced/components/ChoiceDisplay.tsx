import type { OverlayAdvancedChoiceData } from '../types';
import { Grid3x3Display } from './Grid3x3Display';

interface ChoiceDisplayProps {
  data: OverlayAdvancedChoiceData;
  isSelected: boolean;
  isCorrect: boolean;
  showResult: boolean;
}

/**
 * 重ね図形応用問題の選択肢表示コンポーネント
 * 重なった部分を濃い灰色で塗り、それ以外は点線の丸で表示
 */
export const OverlayAdvancedChoiceDisplay: React.FC<ChoiceDisplayProps> = ({ data }) => {
  return <Grid3x3Display grid={data} size="small" showOverlap />;
};
