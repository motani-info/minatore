import type { SymbolRotationQuestionData } from '../types';
import { SymbolGridDisplay } from './SymbolGridDisplay';

interface QuestionDisplayProps {
  data: SymbolRotationQuestionData;
}

/**
 * シンボル回転図形問題の問題表示コンポーネント
 */
export const SymbolRotationQuestionDisplay: React.FC<QuestionDisplayProps> = ({ data }) => {
  return <SymbolGridDisplay grid={data.originalGrid} size="large" />;
};
