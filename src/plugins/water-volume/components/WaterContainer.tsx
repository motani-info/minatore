import type { WaterItem } from '../types';

interface WaterContainerProps {
  item: WaterItem;
  size?: number;
}

/** 水の色 */
const WATER_COLOR = '#93c5fd';
const WATER_SURFACE_COLOR = '#bfdbfe';
/** 容器の色 */
const CONTAINER_STROKE = '#374151';
const CONTAINER_FILL = 'none';

/**
 * コップまたは水槽をSVGで描画するコンポーネント
 */
export const WaterContainer: React.FC<WaterContainerProps> = ({ item, size = 80 }) => {
  if (item.container === 'cup') {
    return <CupSVG waterLevel={item.waterLevel} scale={item.containerScale} size={size} />;
  }
  return <TankSVG waterLevel={item.waterLevel} scale={item.containerScale} size={size} />;
};

/**
 * コップのSVG描画
 * 台形型（上が広く下が狭い）
 */
const CupSVG: React.FC<{ waterLevel: number; scale: number; size: number }> = ({
  waterLevel,
  scale,
  size,
}) => {
  const w = size * scale;
  const h = size * 1.1 * scale;
  const viewW = 80;
  const viewH = 88;

  // コップの形状（台形）
  const topLeft = 8;
  const topRight = 72;
  const bottomLeft = 18;
  const bottomRight = 62;
  const cupTop = 8;
  const cupBottom = 80;
  const cupHeight = cupBottom - cupTop;

  // 水面のY座標
  const waterTop = cupBottom - cupHeight * waterLevel;

  // 水面での左右のX座標（台形の線形補間）
  const waterRatio = 1 - waterLevel;
  const waterLeft = topLeft + (bottomLeft - topLeft) * waterRatio;
  const waterRight = topRight + (bottomRight - topRight) * waterRatio;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${viewW} ${viewH}`}>
      {/* 水 */}
      {waterLevel > 0 && (
        <>
          <polygon
            points={`${waterLeft},${waterTop} ${waterRight},${waterTop} ${bottomRight},${cupBottom} ${bottomLeft},${cupBottom}`}
            fill={WATER_COLOR}
            opacity={0.7}
          />
          {/* 水面のハイライト */}
          <line
            x1={waterLeft + 2}
            y1={waterTop}
            x2={waterRight - 2}
            y2={waterTop}
            stroke={WATER_SURFACE_COLOR}
            strokeWidth={2}
          />
        </>
      )}

      {/* コップの輪郭（台形） */}
      <path
        d={`M ${topLeft} ${cupTop} L ${bottomLeft} ${cupBottom} L ${bottomRight} ${cupBottom} L ${topRight} ${cupTop}`}
        fill={CONTAINER_FILL}
        stroke={CONTAINER_STROKE}
        strokeWidth={2.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* コップの縁（楕円） */}
      <ellipse
        cx={40}
        cy={cupTop}
        rx={32}
        ry={5}
        fill="none"
        stroke={CONTAINER_STROKE}
        strokeWidth={2}
      />
    </svg>
  );
};

/**
 * 水槽のSVG描画
 * 直方体（3D風）
 */
const TankSVG: React.FC<{ waterLevel: number; scale: number; size: number }> = ({
  waterLevel,
  scale,
  size,
}) => {
  const w = size * 1.4 * scale;
  const h = size * scale;
  const viewW = 112;
  const viewH = 80;

  // 水槽の形状（3D直方体）
  const frontLeft = 8;
  const frontRight = 88;
  const frontTop = 20;
  const frontBottom = 72;
  const depth = 20; // 奥行きのオフセット
  const frontHeight = frontBottom - frontTop;

  // 水面のY座標
  const waterFrontTop = frontBottom - frontHeight * waterLevel;
  const waterBackTop = waterFrontTop - depth * 0.4;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${viewW} ${viewH}`}>
      {/* 水（前面） */}
      {waterLevel > 0 && (
        <>
          {/* 水の前面 */}
          <rect
            x={frontLeft}
            y={waterFrontTop}
            width={frontRight - frontLeft}
            height={frontBottom - waterFrontTop}
            fill={WATER_COLOR}
            opacity={0.6}
          />
          {/* 水の上面（3D） */}
          <polygon
            points={`
              ${frontLeft},${waterFrontTop}
              ${frontRight},${waterFrontTop}
              ${frontRight + depth},${waterBackTop}
              ${frontLeft + depth},${waterBackTop}
            `}
            fill={WATER_SURFACE_COLOR}
            opacity={0.5}
          />
          {/* 水の右側面 */}
          <polygon
            points={`
              ${frontRight},${waterFrontTop}
              ${frontRight + depth},${waterBackTop}
              ${frontRight + depth},${frontBottom - depth * 0.4}
              ${frontRight},${frontBottom}
            `}
            fill={WATER_COLOR}
            opacity={0.4}
          />
        </>
      )}

      {/* 水槽の前面 */}
      <rect
        x={frontLeft}
        y={frontTop}
        width={frontRight - frontLeft}
        height={frontHeight}
        fill={CONTAINER_FILL}
        stroke={CONTAINER_STROKE}
        strokeWidth={2.5}
        strokeLinejoin="round"
      />

      {/* 水槽の上面（3D） */}
      <polygon
        points={`
          ${frontLeft},${frontTop}
          ${frontRight},${frontTop}
          ${frontRight + depth},${frontTop - depth * 0.4}
          ${frontLeft + depth},${frontTop - depth * 0.4}
        `}
        fill="none"
        stroke={CONTAINER_STROKE}
        strokeWidth={2}
        strokeLinejoin="round"
      />

      {/* 水槽の右側面（3D） */}
      <polygon
        points={`
          ${frontRight},${frontTop}
          ${frontRight + depth},${frontTop - depth * 0.4}
          ${frontRight + depth},${frontBottom - depth * 0.4}
          ${frontRight},${frontBottom}
        `}
        fill="none"
        stroke={CONTAINER_STROKE}
        strokeWidth={2}
        strokeLinejoin="round"
      />
    </svg>
  );
};
