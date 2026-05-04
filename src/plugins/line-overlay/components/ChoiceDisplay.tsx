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
  return (
    <Flex
      align="center"
      justify="center"
      role="img"
      aria-label="せんたくし"
    >
      <DotGrid figure={data} size={100} />
    </Flex>
  );
};
