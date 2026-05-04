import { Flex, Text } from '@chakra-ui/react';
import type { OverlayAdvancedQuestionData } from '../types';
import { Grid3x3Display } from './Grid3x3Display';

interface QuestionDisplayProps {
  data: OverlayAdvancedQuestionData;
}

/**
 * 重ね図形応用問題の問題表示コンポーネント
 * 2つの3×3グリッドを横に並べて表示する
 */
export const OverlayAdvancedQuestionDisplay: React.FC<QuestionDisplayProps> = ({ data }) => {
  return (
    <Flex align="center" gap={3} role="img" aria-label="かさねずけい">
      <Grid3x3Display grid={data.gridA} size="large" />
      <Text fontSize="xl" fontWeight="800" color="#1a1a1a" lineHeight="1" px={1}>
        +
      </Text>
      <Grid3x3Display grid={data.gridB} size="large" />
    </Flex>
  );
};
