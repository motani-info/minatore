import { Grid, GridItem, Flex } from '@chakra-ui/react';
import type { SymbolGrid, CellSymbol } from '../types';

interface SymbolGridDisplayProps {
  grid: SymbolGrid;
  size: 'large' | 'small';
}

/** 個別セルのシンボルを描画する */
const CellRenderer: React.FC<{ cell: CellSymbol; cellSize: number }> = ({ cell, cellSize }) => {
  const iconSize = cellSize * 0.6;

  if (cell.type === 'empty') {
    return null;
  }

  // 向きに応じた回転角度
  const rotationDeg = (() => {
    switch (cell.direction) {
      case 'right': return 90;
      case 'down': return 180;
      case 'left': return 270;
      default: return 0;
    }
  })();

  const transform = rotationDeg !== 0 ? `rotate(${rotationDeg}deg)` : undefined;

  switch (cell.type) {
    case 'circle-white':
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="14" fill="none" stroke="#1a1a1a" strokeWidth="2.5" />
        </svg>
      );
    case 'circle-black':
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="14" fill="#1a1a1a" />
        </svg>
      );
    case 'triangle-white':
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 40 40" style={{ transform }}>
          <polygon points="20,4 36,36 4,36" fill="none" stroke="#1a1a1a" strokeWidth="2.5" />
        </svg>
      );
    case 'triangle-black':
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 40 40" style={{ transform }}>
          <polygon points="20,4 36,36 4,36" fill="#1a1a1a" />
        </svg>
      );
    case 'diagonal-line':
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 40 40">
          <line x1="4" y1="4" x2="36" y2="36" stroke="#1a1a1a" strokeWidth="2.5" />
        </svg>
      );
    case 'arrow-right':
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 40 40" style={{ transform }}>
          <polygon points="8,14 28,14 28,8 38,20 28,32 28,26 8,26" fill="#1a1a1a" />
        </svg>
      );
    case 'person-man':
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 40 40">
          <circle cx="20" cy="10" r="6" fill="#1a1a1a" />
          <rect x="14" y="18" width="12" height="16" rx="2" fill="#1a1a1a" />
        </svg>
      );
    case 'person-woman':
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 40 40">
          <circle cx="20" cy="10" r="6" fill="#1a1a1a" />
          <polygon points="14,18 26,18 30,36 10,36" fill="#1a1a1a" />
        </svg>
      );
    case 'heart-black':
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 40 40">
          <path d="M20 35 C10 25, 2 18, 8 10 C12 5, 18 6, 20 12 C22 6, 28 5, 32 10 C38 18, 30 25, 20 35Z" fill="#1a1a1a" />
        </svg>
      );
    case 'heart-white':
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 40 40">
          <path d="M20 35 C10 25, 2 18, 8 10 C12 5, 18 6, 20 12 C22 6, 28 5, 32 10 C38 18, 30 25, 20 35Z" fill="none" stroke="#1a1a1a" strokeWidth="2" />
        </svg>
      );
    case 'club-black':
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 40 40">
          <circle cx="20" cy="12" r="7" fill="#1a1a1a" />
          <circle cx="12" cy="22" r="7" fill="#1a1a1a" />
          <circle cx="28" cy="22" r="7" fill="#1a1a1a" />
          <rect x="18" y="26" width="4" height="10" fill="#1a1a1a" />
        </svg>
      );
    case 'club-white':
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 40 40">
          <circle cx="20" cy="12" r="7" fill="none" stroke="#1a1a1a" strokeWidth="2" />
          <circle cx="12" cy="22" r="7" fill="none" stroke="#1a1a1a" strokeWidth="2" />
          <circle cx="28" cy="22" r="7" fill="none" stroke="#1a1a1a" strokeWidth="2" />
          <rect x="18" y="26" width="4" height="10" fill="none" stroke="#1a1a1a" strokeWidth="2" />
        </svg>
      );
    case 'spade-black':
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 40 40">
          <path d="M20 4 C20 4, 4 18, 4 24 C4 30, 10 32, 16 28 L18 36 L22 36 L24 28 C30 32, 36 30, 36 24 C36 18, 20 4, 20 4Z" fill="#1a1a1a" />
        </svg>
      );
    case 'spade-white':
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 40 40">
          <path d="M20 4 C20 4, 4 18, 4 24 C4 30, 10 32, 16 28 L18 36 L22 36 L24 28 C30 32, 36 30, 36 24 C36 18, 20 4, 20 4Z" fill="none" stroke="#1a1a1a" strokeWidth="2" />
        </svg>
      );
    case 'diamond-black':
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 40 40">
          <polygon points="20,4 36,20 20,36 4,20" fill="#1a1a1a" />
        </svg>
      );
    case 'diamond-white':
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 40 40">
          <polygon points="20,4 36,20 20,36 4,20" fill="none" stroke="#1a1a1a" strokeWidth="2" />
        </svg>
      );
    case 'tulip':
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 40 40">
          <ellipse cx="14" cy="14" rx="6" ry="10" fill="#1a1a1a" />
          <ellipse cx="26" cy="14" rx="6" ry="10" fill="#1a1a1a" />
          <rect x="18" y="20" width="4" height="14" fill="#1a1a1a" />
        </svg>
      );
    default:
      return null;
  }
};

/**
 * シンボルベース2×2グリッド表示コンポーネント
 */
export const SymbolGridDisplay: React.FC<SymbolGridDisplayProps> = ({ grid, size }) => {
  const isLarge = size === 'large';
  const cellSize = isLarge ? 80 : 40;

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
      {grid.map((cell, index) => (
        <GridItem
          key={index}
          border="1px solid"
          borderColor="#1a1a1a"
          bg="#ffffff"
          aria-hidden="true"
        >
          <Flex
            w="100%"
            h="100%"
            align="center"
            justify="center"
            aspectRatio="1"
          >
            <CellRenderer cell={cell} cellSize={cellSize} />
          </Flex>
        </GridItem>
      ))}
    </Grid>
  );
};
