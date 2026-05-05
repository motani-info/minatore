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
        case 2: return { w: 'min(52vw, 220px)', h: 'min(52vw, 220px)', minW: '160px', minH: '160px' };
        case 3: return { w: 'min(56vw, 240px)', h: 'min(56vw, 240px)', minW: '168px', minH: '168px' };
        case 4: return { w: 'min(60vw, 260px)', h: 'min(60vw, 260px)', minW: '176px', minH: '176px' };
      }
    } else {
      switch (n) {
        case 2: return { w: 'min(28vw, 100px)', h: 'min(28vw, 100px)', minW: '80px', minH: '80px' };
        case 3: return { w: 'min(30vw, 108px)', h: 'min(30vw, 108px)', minW: '84px', minH: '84px' };
        case 4: return { w: 'min(32vw, 116px)', h: 'min(32vw, 116px)', minW: '88px', minH: '88px' };
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
      minW={containerSize.minW}
      minH={containerSize.minH}
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
