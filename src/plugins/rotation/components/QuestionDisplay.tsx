import type { RotationQuestionData } from '../types';
import { GridDisplay } from './GridDisplay';

interface QuestionDisplayProps {
  data: RotationQuestionData;
}

/**
 * 回転図形問題の問題表示コンポーネント
 * 元のグリッドパターンを大きく表示する
 */
export const RotationQuestionDisplay: React.FC<QuestionDisplayProps> = ({ data }) => {
  return <GridDisplay grid={data.originalGrid} size="large" />;
};
