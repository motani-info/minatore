import { Box } from '@chakra-ui/react';
import type { LineDef } from '../types';

interface LineDisplayProps {
  line: LineDef;
  /** 表示幅（px） */
  width?: number;
}

/**
 * 1本の線をSVGで描画するコンポーネント
 */
export const LineDisplay: React.FC<LineDisplayProps> = ({ line, width = 280 }) => {
  const height = 50;
  const cy = height / 2;
  const margin = 10;
  const x1 = margin;
  const x2 = width - margin;

  const strokeWidth = 3;
  const stroke = '#1a1a1a';

  const renderLine = () => {
    switch (line.type) {
      case 'straight':
        return (
          <>
            {/* 端の縦棒 */}
            <line x1={x1} y1={cy - 10} x2={x1} y2={cy + 10} stroke={stroke} strokeWidth={strokeWidth} />
            <line x1={x2} y1={cy - 10} x2={x2} y2={cy + 10} stroke={stroke} strokeWidth={strokeWidth} />
            {/* 直線 */}
            <line x1={x1} y1={cy} x2={x2} y2={cy} stroke={stroke} strokeWidth={strokeWidth} />
          </>
        );

      case 'wavy': {
        // 波線（サイン波）
        const segments = 10;
        const amplitude = 12;
        const segWidth = (x2 - x1) / segments;
        let d = `M ${x1} ${cy}`;
        for (let i = 0; i < segments; i++) {
          const sx = x1 + i * segWidth;
          const ex = sx + segWidth;
          const cpY = i % 2 === 0 ? cy - amplitude : cy + amplitude;
          d += ` Q ${sx + segWidth / 2} ${cpY} ${ex} ${cy}`;
        }
        return <path d={d} fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />;
      }

      case 'arc': {
        // 弧線（上に膨らむ弧）
        const arcHeight = 20;
        return (
          <path
            d={`M ${x1} ${cy + 5} Q ${(x1 + x2) / 2} ${cy - arcHeight} ${x2} ${cy + 5}`}
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        );
      }

      case 'zigzag': {
        // ジグザグ線
        const segments = 8;
        const amplitude = 10;
        const segWidth = (x2 - x1) / segments;
        let d = `M ${x1} ${cy}`;
        for (let i = 1; i <= segments; i++) {
          const x = x1 + i * segWidth;
          const y = i % 2 === 0 ? cy : (i % 4 === 1 ? cy - amplitude : cy + amplitude);
          d += ` L ${x} ${y}`;
        }
        return <path d={d} fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />;
      }

      case 'spiral': {
        // 螺旋線
        const loops = 6;
        const loopWidth = (x2 - x1) / loops;
        const radius = 8;
        let d = `M ${x1} ${cy}`;
        for (let i = 0; i < loops; i++) {
          const sx = x1 + i * loopWidth;
          d += ` C ${sx + loopWidth * 0.3} ${cy - radius * 2} ${sx + loopWidth * 0.7} ${cy + radius * 2} ${sx + loopWidth} ${cy}`;
        }
        return <path d={d} fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />;
      }

      default:
        return null;
    }
  };

  return (
    <Box w={`${width}px`} h={`${height}px`}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {renderLine()}
      </svg>
    </Box>
  );
};
