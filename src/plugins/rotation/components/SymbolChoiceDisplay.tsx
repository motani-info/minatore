import type { SymbolRotationChoiceData } from '../types';
import { SymbolGridDisplay } from './SymbolGridDisplay';

interface ChoiceDisplayProps {
  data: SymbolRotationChoiceData;
  isSelected: boolean;
  isCorrect: boolean;
  showResult: boolean;
}

/**
 * シンボル回転図形問題の選択肢表示コンポーネント
 */
export const SymbolRotationChoiceDisplay: React.FC<ChoiceDisplayProps> = ({ data }) => {
  return <SymbolGridDisplay grid={data} size="small" />;
};
