import { Box } from '@chakra-ui/react';
import type { SpringItem } from '../types';

interface SpringDisplayProps {
  spring: SpringItem;
  /** 表示サイズ */
  width?: number;
  height?: number;
}

/**
 * ばね+重りをSVGで描画するコンポーネント
 * ばねの伸び具合（stretch）に応じてコイルの間隔が変わる
 */
export const SpringDisplay: React.FC<SpringDisplayProps> = ({
  spring,
  width = 60,
  height = 200,
}) => {
  const { stretch } = spring;

  // ばねのパラメータ
  const topY = 10;
  const coils = 6;
  const coilWidth = 16;
  const cx = width / 2;

  // stretchに応じたコイル間隔（1=短い、5=長い）
  const coilSpacing = 10 + stretch * 6;
  const springLength = coils * coilSpacing;
  const ballY = topY + springLength + 10;
  const ballRadius = 12;

  return (
    <Box w={`${width}px`} h={`${height}px`}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* 上部の固定バー */}
        <line
          x1={cx - 15}
          y1={topY}
          x2={cx + 15}
          y2={topY}
          stroke="#1a1a1a"
          strokeWidth={3}
        />

        {/* ばねのコイル */}
        {Array.from({ length: coils }).map((_, i) => {
          const y1 = topY + i * coilSpacing;
          const y2 = topY + (i + 1) * coilSpacing;
          const midY = (y1 + y2) / 2;
          const dir = i % 2 === 0 ? 1 : -1;
          return (
            <path
              key={i}
              d={`M ${cx} ${y1} Q ${cx + coilWidth * dir} ${midY} ${cx} ${y2}`}
              fill="none"
              stroke="#555"
              strokeWidth={2.5}
            />
          );
        })}

        {/* 重り（丸） */}
        <circle
          cx={cx}
          cy={ballY}
          r={ballRadius}
          fill="#6b7280"
          stroke="#374151"
          strokeWidth={2}
        />
      </svg>
    </Box>
  );
};
