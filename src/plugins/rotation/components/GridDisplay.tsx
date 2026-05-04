import { Grid, GridItem } from '@chakra-ui/react';
import type { Grid as GridType } from '../types';

interface GridDisplayProps {
  grid: GridType;
  size: 'large' | 'small';
}

/**
 * 2×2グリッド表示コンポーネント
 * 本番のペーパーテストに合わせて白黒で表示
 */
export const GridDisplay: React.FC<GridDisplayProps> = ({ grid, size }) => {
  const isLarge = size === 'large';

  return (
    <Grid
      templateColumns="repeat(2, 1fr)"
      gap="0px"
      border="2px solid"
      borderColor="#1a1a1a"
      role="img"
      aria-label="ぐりっど"
      w={isLarge ? 'min(52vw, 220px)' : 'min(28vw, 100px)'}
      h={isLarge ? 'min(52vw, 220px)' : 'min(28vw, 100px)'}
      minW={isLarge ? '160px' : '80px'}
      minH={isLarge ? '160px' : '80px'}
    >
      {grid.map((filled, index) => (
        <GridItem
          key={index}
          aspectRatio="1"
          bg={filled ? '#6b7280' : '#ffffff'}
          border="1px solid"
          borderColor="#1a1a1a"
          aria-hidden="true"
        />
      ))}
    </Grid>
  );
};
