import { Grid, GridItem } from '@chakra-ui/react';
import type { GridData } from '../types';

interface GridDisplayProps {
  grid: GridData;
  size: 'large' | 'small';
}

/**
 * NxNグリッド表示コンポーネント（2×2, 3×3, 4×4対応）
 * 本番のペーパーテストに合わせて白黒で表示
 */
export const GridDisplay: React.FC<GridDisplayProps> = ({ grid, size }) => {
  const isLarge = size === 'large';
  const n = grid.size;

  // グリッドサイズに応じてコンテナサイズを調整
  const containerSize = (() => {
    if (isLarge) {
      switch (n) {
        case 2: return { w: 'min(36vw, 160px)', h: 'min(36vw, 160px)' };
        case 3: return { w: 'min(40vw, 180px)', h: 'min(40vw, 180px)' };
        case 4: return { w: 'min(44vw, 200px)', h: 'min(44vw, 200px)' };
      }
    } else {
      switch (n) {
        case 2: return { w: 'min(28vw, 110px)', h: 'min(28vw, 110px)' };
        case 3: return { w: 'min(30vw, 120px)', h: 'min(30vw, 120px)' };
        case 4: return { w: 'min(32vw, 130px)', h: 'min(32vw, 130px)' };
      }
    }
  })();

  return (
    <Grid
      templateColumns={`repeat(${n}, 1fr)`}
      gap="0px"
      border="2px solid"
      borderColor="#1a1a1a"
      role="img"
      aria-label="ぐりっど"
      w={containerSize.w}
      h={containerSize.h}
      maxW="100%"
    >
      {grid.cells.map((filled, index) => (
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
