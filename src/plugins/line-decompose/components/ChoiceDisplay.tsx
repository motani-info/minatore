import { Flex } from '@chakra-ui/react';
import type { LineDecomposeChoiceData } from '../types';
import { DotGrid } from '../../line-overlay/components/DotGrid';

interface ChoiceDisplayProps {
  data: LineDecomposeChoiceData;
  isSelected: boolean;
  isCorrect: boolean;
  showResult: boolean;
}

/**
 * 線図形の分解問題の選択肢表示コンポーネント
 */
export const LineDecomposeChoiceDisplay: React.FC<ChoiceDisplayProps> = ({ data }) => {
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
      p={1}
    >
      <DotGrid figure={data} size={140} />
    </Flex>
  );
};
