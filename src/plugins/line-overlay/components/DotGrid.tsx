import type { LineFigure } from '../types';

/**
 * NxNドットグリッド上に線図形を描画するSVGコンポーネント
 *
 * 点は真っ黒、線は濃い灰色で描画する
 */

interface DotGridProps {
  figure: LineFigure;
  /** SVGの幅・高さ (px) */
  size?: number;
  /** グリッドサイズ（デフォルト4） */
  gridSize?: number;
}

/** ドットの半径 */
const DOT_RADIUS = 4;
/** 線の太さ */
const LINE_WIDTH = 2.5;
/** パディング */
const PADDING = 16;

/** ドットの色（真っ黒） */
const DOT_COLOR = '#000000';
/** 線の色（濃い灰色） */
const LINE_COLOR = '#404040';

/** グリッド座標からSVG座標に変換する */
function toSvgCoord(gridPos: number, totalSize: number, gridSize: number): number {
  const usable = totalSize - PADDING * 2;
  return PADDING + (gridPos / (gridSize - 1)) * usable;
}

export const DotGrid: React.FC<DotGridProps> = ({ figure, size = 120, gridSize = 4 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-label="どっとぐりっど"
    >
      {/* 線分を描画（ドットの下に描画するため先に描く） */}
      {figure.map((seg, i) => (
        <line
          key={`line-${i}`}
          x1={toSvgCoord(seg.from.col, size, gridSize)}
          y1={toSvgCoord(seg.from.row, size, gridSize)}
          x2={toSvgCoord(seg.to.col, size, gridSize)}
          y2={toSvgCoord(seg.to.row, size, gridSize)}
          stroke={LINE_COLOR}
          strokeWidth={LINE_WIDTH}
          strokeLinecap="round"
        />
      ))}

      {/* NxNのドットを描画 */}
      {Array.from({ length: gridSize }, (_, row) =>
        Array.from({ length: gridSize }, (_, col) => (
          <circle
            key={`dot-${row}-${col}`}
            cx={toSvgCoord(col, size, gridSize)}
            cy={toSvgCoord(row, size, gridSize)}
            r={DOT_RADIUS}
            fill={DOT_COLOR}
          />
        )),
      )}
    </svg>
  );
};
