import { Grid, GridItem } from '@chakra-ui/react';
import type { PuzzleQuestionData, PuzzleGrid } from '../types';

interface QuestionDisplayProps {
  data: PuzzleQuestionData;
}

/** 白黒のグリッド表示 */
const PuzzleGridDisplay: React.FC<{ grid: PuzzleGrid; cellSize: string }> = ({
  grid,
  cellSize,
}) => {
  return (
    <Grid
      templateColumns="repeat(2, 1fr)"
      gap="0px"
      border="2px solid"
      borderColor="#1a1a1a"
      role="img"
      aria-label="おてほん"
    >
      {grid.map((filled, index) => (
        <GridItem
          key={index}
          w={cellSize}
          h={cellSize}
          bg={filled ? '#6b7280' : '#ffffff'}
          border="1px solid"
          borderColor="#1a1a1a"
        />
      ))}
    </Grid>
  );
};

/**
 * 図形構成パズル問題の問題表示コンポーネント
 * 本番のペーパーテストに合わせて白黒で表示
 */
export const PuzzleQuestionDisplay: React.FC<QuestionDisplayProps> = ({ data }) => {
  return <PuzzleGridDisplay grid={data.targetGrid} cellSize="min(24vw, 100px)" />;
};
