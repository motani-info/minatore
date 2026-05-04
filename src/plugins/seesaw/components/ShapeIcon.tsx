import type { ShapeType } from '../types';

interface ShapeIconProps {
  shape: ShapeType;
  size?: number;
}

/**
 * シーソー問題用のSVG図形アイコン
 * 画像の問題に登場する図形をSVGで再現する
 */
export const ShapeIcon: React.FC<ShapeIconProps> = ({ shape, size = 40 }) => {
  switch (shape) {
    case 'star-black':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40">
          <polygon
            points={starPoints(20, 20, 18, 8, 5)}
            fill="#1a1a1a"
          />
        </svg>
      );

    case 'circle-black':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="16" fill="#1a1a1a" />
        </svg>
      );

    case 'hexagon-black':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40">
          <polygon
            points={hexagonPoints(20, 20, 16)}
            fill="#1a1a1a"
          />
        </svg>
      );

    case 'diamond-star':
      // 四つ角の星（◇型の星）
      return (
        <svg width={size} height={size} viewBox="0 0 40 40">
          <polygon
            points={fourPointStarPoints(20, 20, 18, 7)}
            fill="none"
            stroke="#1a1a1a"
            strokeWidth="2.5"
          />
        </svg>
      );

    case 'circle-ring':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="14" fill="none" stroke="#1a1a1a" strokeWidth="3" />
        </svg>
      );

    case 'cross-black':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40">
          <rect x="12" y="4" width="16" height="32" rx="1" fill="#1a1a1a" />
          <rect x="4" y="12" width="32" height="16" rx="1" fill="#1a1a1a" />
        </svg>
      );

    case 'pentagon-gray':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40">
          <polygon
            points={pentagonPoints(20, 21, 16)}
            fill="#9ca3af"
            stroke="#6b7280"
            strokeWidth="1.5"
          />
        </svg>
      );

    case 'square-black':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40">
          <rect x="6" y="6" width="28" height="28" rx="2" fill="#1a1a1a" />
        </svg>
      );

    default:
      return null;
  }
};

/** 五芒星の頂点座標を生成する */
function starPoints(cx: number, cy: number, outerR: number, innerR: number, points: number): string {
  const coords: string[] = [];
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = (Math.PI / points) * i - Math.PI / 2;
    coords.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
  }
  return coords.join(' ');
}

/** 六角形の頂点座標を生成する */
function hexagonPoints(cx: number, cy: number, r: number): string {
  const coords: string[] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    coords.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
  }
  return coords.join(' ');
}

/** 四つ角の星（ダイヤ星）の頂点座標を生成する */
function fourPointStarPoints(cx: number, cy: number, outerR: number, innerR: number): string {
  const coords: string[] = [];
  for (let i = 0; i < 8; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = (Math.PI / 4) * i - Math.PI / 2;
    coords.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
  }
  return coords.join(' ');
}

/** 五角形の頂点座標を生成する */
function pentagonPoints(cx: number, cy: number, r: number): string {
  const coords: string[] = [];
  for (let i = 0; i < 5; i++) {
    const angle = (2 * Math.PI / 5) * i - Math.PI / 2;
    coords.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
  }
  return coords.join(' ');
}
