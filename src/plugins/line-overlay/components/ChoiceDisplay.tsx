import { Flex } from '@chakra-ui/react';
import type { LineOverlayChoiceData } from '../types';
import { DotGrid } from './DotGrid';

interface ChoiceDisplayProps {
  data: LineOverlayChoiceData;
  isSelected: boolean;
  isCorrect: boolean;
  showResult: boolean;
}

/**
 * 線図形の重ね合わせ問題の選択肢表示コンポーネント
 */
export const LineOverlayChoiceDisplay: React.FC<ChoiceDisplayProps> = ({ data }) => {
  const gridSize = data.gridSize ?? 4;

  return (
    <Flex
      align="center"
      justify="center"
      role="img"
      aria-label="せんたくし"
      border="2px solid"
      borderColor="#d1d5db"
      borderRadius="lg"
      bg="white"
      p={0.5}
      maxW="100%"
      maxH="100%"
    >
      <DotGrid figure={data.figure} size="min(18vw, 100px)" gridSize={gridSize} />
    </Flex>
  );
};
