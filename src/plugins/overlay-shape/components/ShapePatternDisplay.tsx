import { Flex } from '@chakra-ui/react';
import type { ShapePattern } from '../types';

interface ShapePatternDisplayProps {
  pattern: ShapePattern;
  size: 'large' | 'small';
  /** 回答用: 重なった部分を濃い灰色で表示 */
  isAnswer?: boolean;
}

/**
 * 白黒パターンのシート表示コンポーネント
 * ポリゴン群をSVGで描画する
 */
export const ShapePatternDisplay: React.FC<ShapePatternDisplayProps> = ({
  pattern,
  size,
  isAnswer = false,
}) => {
  const isLarge = size === 'large';
  const boxSize = isLarge ? 'min(36vw, 150px)' : 'min(20vw, 80px)';
  const fillColor = isAnswer ? '#6b7280' : '#1a1a1a';

  return (
    <Flex
      align="center"
      justify="center"
      w={boxSize}
      h={boxSize}
      border="2px solid"
      borderColor="#1a1a1a"
      bg="#ffffff"
      flexShrink={0}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        role="img"
        aria-label="ずけいぱたーん"
      >
        {pattern.map((points, index) => (
          <polygon
            key={index}
            points={points}
            fill={fillColor}
            stroke="none"
          />
        ))}
      </svg>
    </Flex>
  );
};
