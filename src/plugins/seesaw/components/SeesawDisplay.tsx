import type { SeesawState } from '../types';
import { ShapeIcon } from './ShapeIcon';

interface SeesawDisplayProps {
  seesaw: SeesawState;
  size?: number;
}

/**
 * シーソー（天秤）をSVGで描画するコンポーネント
 * 傾きに応じてバーが傾く
 * アイテムに shape が指定されている場合はSVG図形を表示する
 */
export const SeesawDisplay: React.FC<SeesawDisplayProps> = ({ seesaw, size = 200 }) => {
  const { left, right, tilt } = seesaw;

  // 傾き角度
  const angle = tilt === 'left' ? -12 : tilt === 'right' ? 12 : 0;

  // SVGのviewBox
  const viewBoxWidth = 240;
  const viewBoxHeight = 200;

  // シーソーの中心
  const cx = viewBoxWidth / 2;
  const cy = 150;

  // バーの長さ（片側）
  const barHalf = 90;

  // 傾きに応じた左右の端のY座標
  const rad = (angle * Math.PI) / 180;
  const leftY = cy - Math.sin(rad) * barHalf;
  const rightY = cy + Math.sin(rad) * barHalf;
  const leftX = cx - barHalf;
  const rightX = cx + barHalf;

  // 皿のサイズ
  const plateWidth = 50;
  const plateHeight = 8;

  // アイテムのサイズ
  const itemSize = 48;

  return (
    <svg
      width={size}
      height={size * (viewBoxHeight / viewBoxWidth)}
      viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
      aria-label={`シーソー: ${left.name}と${right.name}`}
    >
      {/* 支点（三角形） */}
      <polygon
        points={`${cx},${cy} ${cx - 18},${cy + 30} ${cx + 18},${cy + 30}`}
        fill="#1a1a1a"
      />

      {/* 台座 */}
      <rect
        x={cx - 30}
        y={cy + 28}
        width={60}
        height={8}
        fill="#333"
        rx={2}
      />

      {/* バー（傾いた板） */}
      <line
        x1={leftX}
        y1={leftY}
        x2={rightX}
        y2={rightY}
        stroke="#1a1a1a"
        strokeWidth={5}
        strokeLinecap="round"
      />

      {/* 左の皿 */}
      <rect
        x={leftX - plateWidth / 2}
        y={leftY - plateHeight}
        width={plateWidth}
        height={plateHeight}
        fill="#555"
        rx={2}
      />

      {/* 右の皿 */}
      <rect
        x={rightX - plateWidth / 2}
        y={rightY - plateHeight}
        width={plateWidth}
        height={plateHeight}
        fill="#555"
        rx={2}
      />

      {/* 左のアイテム */}
      <foreignObject
        x={leftX - itemSize / 2}
        y={leftY - plateHeight - itemSize - 4}
        width={itemSize}
        height={itemSize}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {left.shape ? (
            <ShapeIcon shape={left.shape} size={itemSize * 0.85} />
          ) : (
            <span style={{ fontSize: `${itemSize * 0.75}px`, lineHeight: 1 }}>
              {left.emoji}
            </span>
          )}
        </div>
      </foreignObject>

      {/* 右のアイテム */}
      <foreignObject
        x={rightX - itemSize / 2}
        y={rightY - plateHeight - itemSize - 4}
        width={itemSize}
        height={itemSize}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {right.shape ? (
            <ShapeIcon shape={right.shape} size={itemSize * 0.85} />
          ) : (
            <span style={{ fontSize: `${itemSize * 0.75}px`, lineHeight: 1 }}>
              {right.emoji}
            </span>
          )}
        </div>
      </foreignObject>
    </svg>
  );
};
