import { Flex, Box } from '@chakra-ui/react';
import type { ShapeCompositionChoiceData, ShapePart } from '../types';

interface Props {
  data: ShapeCompositionChoiceData;
  isSelected: boolean;
  isCorrect: boolean;
  showResult: boolean;
}

/**
 * 選択肢表示: 3つのパーツを並べて表示
 */
export const ShapeCompositionChoiceDisplay: React.FC<Props> = ({ data }) => {
  return (
    <Flex gap={1} align="center" justify="center" flexWrap="wrap">
      {data.parts.map((part, i) => (
        <Box key={i} w="36px" h="36px" display="flex" alignItems="center" justifyContent="center">
          <PartSvg part={part} size={32} />
        </Box>
      ))}
    </Flex>
  );
};

/** パーツをSVGで描画 */
const PartSvg: React.FC<{ part: ShapePart; size: number }> = ({ part, size }) => {
  const fill = part.filled ? '#1a1a1a' : 'none';
  const stroke = '#1a1a1a';
  const sw = 1.5;

  // パーツの縦横比を反映
  const aspectW = part.width / Math.max(part.width, part.height);
  const aspectH = part.height / Math.max(part.width, part.height);
  const w = size * aspectW;
  const h = size * aspectH;

  const transform = part.rotation ? `rotate(${part.rotation} ${size / 2} ${size / 2})` : undefined;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <g transform={transform}>
        {renderShape(part.type, (size - w) / 2, (size - h) / 2, w, h, fill, stroke, sw)}
      </g>
    </svg>
  );
};

function renderShape(
  type: string,
  x: number, y: number, w: number, h: number,
  fill: string, stroke: string, sw: number,
): React.ReactNode {
  switch (type) {
    case 'rect':
      return <rect x={x} y={y} width={w} height={h} fill={fill} stroke={stroke} strokeWidth={sw} />;
    case 'square':
      return <rect x={x} y={y} width={w} height={h} fill={fill} stroke={stroke} strokeWidth={sw} />;
    case 'triangle':
      return (
        <polygon
          points={`${x + w / 2},${y} ${x + w},${y + h} ${x},${y + h}`}
          fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round"
        />
      );
    case 'circle':
      return (
        <ellipse
          cx={x + w / 2} cy={y + h / 2} rx={w / 2} ry={h / 2}
          fill={fill} stroke={stroke} strokeWidth={sw}
        />
      );
    case 'semicircle':
      return (
        <path
          d={`M ${x} ${y + h} A ${w / 2} ${h} 0 0 1 ${x + w} ${y + h} Z`}
          fill={fill} stroke={stroke} strokeWidth={sw}
        />
      );
    case 'trapezoid':
      return (
        <polygon
          points={`${x + w * 0.2},${y} ${x + w * 0.8},${y} ${x + w},${y + h} ${x},${y + h}`}
          fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round"
        />
      );
    case 'diamond':
      return (
        <polygon
          points={`${x + w / 2},${y} ${x + w},${y + h / 2} ${x + w / 2},${y + h} ${x},${y + h / 2}`}
          fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round"
        />
      );
    case 'cross': {
      const t = w * 0.3; // thickness
      const cx = x + w / 2;
      const cy = y + h / 2;
      return (
        <polygon
          points={`${cx - t / 2},${y} ${cx + t / 2},${y} ${cx + t / 2},${cy - t / 2} ${x + w},${cy - t / 2} ${x + w},${cy + t / 2} ${cx + t / 2},${cy + t / 2} ${cx + t / 2},${y + h} ${cx - t / 2},${y + h} ${cx - t / 2},${cy + t / 2} ${x},${cy + t / 2} ${x},${cy - t / 2} ${cx - t / 2},${cy - t / 2}`}
          fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round"
        />
      );
    }
    case 'l-shape':
      return (
        <polygon
          points={`${x},${y} ${x + w * 0.4},${y} ${x + w * 0.4},${y + h * 0.6} ${x + w},${y + h * 0.6} ${x + w},${y + h} ${x},${y + h}`}
          fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round"
        />
      );
    case 'arrow':
      return (
        <polygon
          points={`${x + w / 2},${y} ${x + w},${y + h * 0.4} ${x + w * 0.65},${y + h * 0.4} ${x + w * 0.65},${y + h} ${x + w * 0.35},${y + h} ${x + w * 0.35},${y + h * 0.4} ${x},${y + h * 0.4}`}
          fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round"
        />
      );
    default:
      return <rect x={x} y={y} width={w} height={h} fill={fill} stroke={stroke} strokeWidth={sw} />;
  }
}
