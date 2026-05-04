import { Grid, GridItem, Flex } from '@chakra-ui/react';
import type { Grid3x3 } from '../types';

interface Grid3x3DisplayProps {
  grid: Grid3x3;
  size: 'large' | 'small';
  /** 回答グリッド用: 重なったセルを濃い灰色で塗る */
  showOverlap?: boolean;
}

/**
 * 3×3グリッド表示コンポーネント
 *
 * - 問題用（showOverlap=false）: ○がある位置に黒い丸を描画
 * - 回答用（showOverlap=true）: 重なった位置を濃い灰色で塗り、
 *   重なっていない位置は点線の丸で表示
 */
export const Grid3x3Display: React.FC<Grid3x3DisplayProps> = ({
  grid,
  size,
  showOverlap = false,
}) => {
  const isLarge = size === 'large';
  const cellPx = isLarge ? 'min(12vw, 52px)' : 'min(7.5vw, 28px)';
  const circleSize = isLarge ? 28 : 14;
  const strokeWidth = isLarge ? 2.5 : 1.8;

  return (
    <Grid
      templateColumns="repeat(3, 1fr)"
      gap="0px"
      border="2px solid"
      borderColor="#1a1a1a"
      role="img"
      aria-label="ぐりっど"
    >
      {grid.map((filled, index) => (
        <GridItem key={index} border="1px solid" borderColor="#1a1a1a" bg="#ffffff">
          <Flex
            w={cellPx}
            h={cellPx}
            align="center"
            justify="center"
          >
            {showOverlap ? (
              /* 回答グリッド: 重なり=濃い灰色塗り、非重なり=点線丸 */
              filled ? (
                <svg width={circleSize} height={circleSize} viewBox="0 0 40 40">
                  <circle cx="20" cy="20" r="16" fill="#6b7280" stroke="#374151" strokeWidth={strokeWidth} />
                </svg>
              ) : (
                <svg width={circleSize} height={circleSize} viewBox="0 0 40 40">
                  <circle
                    cx="20"
                    cy="20"
                    r="16"
                    fill="none"
                    stroke="#d1d5db"
                    strokeWidth={strokeWidth}
                    strokeDasharray="4 3"
                  />
                </svg>
              )
            ) : (
              /* 問題グリッド: ○がある位置に黒い丸の輪郭 */
              filled ? (
                <svg width={circleSize} height={circleSize} viewBox="0 0 40 40">
                  <circle cx="20" cy="20" r="15" fill="none" stroke="#1a1a1a" strokeWidth={strokeWidth + 0.5} />
                </svg>
              ) : null
            )}
          </Flex>
        </GridItem>
      ))}
    </Grid>
  );
};
