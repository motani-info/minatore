import { Box, Flex } from '@chakra-ui/react';
import type { ShapeKartaChoiceData, ShapeType, ShapeColor } from '../types';

interface Props {
  data: ShapeKartaChoiceData;
  isSelected: boolean;
  isCorrect: boolean;
  showResult: boolean;
}

const COLOR_MAP: Record<ShapeColor, string> = {
  red: '#ef4444',
  blue: '#3b82f6',
  yellow: '#eab308',
  green: '#22c55e',
};

/** CSS図形を描画 */
const Shape: React.FC<{ shape: ShapeType; color: string; size?: number }> = ({
  shape,
  color,
  size = 18,
}) => {
  if (shape === 'circle') {
    return (
      <Box
        w={`${size}px`}
        h={`${size}px`}
        borderRadius="full"
        bg={color}
      />
    );
  }
  if (shape === 'triangle') {
    return (
      <Box
        w="0"
        h="0"
        borderLeft={`${size / 2}px solid transparent`}
        borderRight={`${size / 2}px solid transparent`}
        borderBottom={`${size}px solid ${color}`}
      />
    );
  }
  // square
  return (
    <Box
      w={`${size}px`}
      h={`${size}px`}
      bg={color}
      borderRadius="2px"
    />
  );
};

/**
 * カード内の図形を表示するコンポーネント
 */
export const ShapeKartaChoiceDisplay: React.FC<Props> = ({ data }) => {
  return (
    <Flex direction="column" gap={1} align="center" justify="center" w="100%">
      {data.map((group, gi) => (
        <Flex key={gi} gap={1} wrap="wrap" justify="center" align="center">
          {Array.from({ length: group.count }).map((_, i) => (
            <Shape
              key={i}
              shape={group.shape}
              color={COLOR_MAP[group.color]}
              size={16}
            />
          ))}
        </Flex>
      ))}
    </Flex>
  );
};
