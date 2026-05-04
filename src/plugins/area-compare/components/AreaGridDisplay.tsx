import type { AreaGrid } from '../types';

interface AreaGridDisplayProps {
  grid: AreaGrid;
  /** SVGの幅・高さ (px) */
  size?: number;
}

/** 黒セルの色 */
const BLACK_COLOR = '#4b5563';
/** 白セルの色 */
const WHITE_COLOR = '#ffffff';
/** 枠線の色 */
const BORDER_COLOR = '#1f2937';

/**
 * グリッド図形をSVGで描画するコンポーネント
 */
export const AreaGridDisplay: React.FC<AreaGridDisplayProps> = ({ grid, size = 80 }) => {
  const { size: gridSize, cells } = grid;
  const padding = 2;
  const cellSize = (size - padding * 2) / gridSize;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-label="ぐりっどずけい"
    >
      {/* 外枠 */}
      <rect
        x={padding}
        y={padding}
        width={size - padding * 2}
        height={size - padding * 2}
        fill="none"
        stroke={BORDER_COLOR}
        strokeWidth={2}
      />

      {/* セル */}
      {cells.map((cell, i) => {
        const row = Math.floor(i / gridSize);
        const col = i % gridSize;
        const x = padding + col * cellSize;
        const y = padding + row * cellSize;

        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={cellSize}
            height={cellSize}
            fill={cell === 'black' ? BLACK_COLOR : WHITE_COLOR}
            stroke={BORDER_COLOR}
            strokeWidth={1}
          />
        );
      })}
    </svg>
  );
};
