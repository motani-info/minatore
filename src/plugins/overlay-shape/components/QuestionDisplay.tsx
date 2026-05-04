import { Flex, Text } from '@chakra-ui/react';
import type { OverlayShapeQuestionData } from '../types';
import { ShapePatternDisplay } from './ShapePatternDisplay';

interface QuestionDisplayProps {
  data: OverlayShapeQuestionData;
}

/**
 * 重ね図形（図形パターン）問題の問題表示コンポーネント
 * 2つのシートを横に並べて表示する
 */
export const OverlayShapeQuestionDisplay: React.FC<QuestionDisplayProps> = ({ data }) => {
  return (
    <Flex align="center" gap={3} role="img" aria-label="かさねずけい">
      <ShapePatternDisplay pattern={data.sheetA} size="large" />
      <Text fontSize="xl" fontWeight="800" color="#1a1a1a" lineHeight="1" px={1}>
        +
      </Text>
      <ShapePatternDisplay pattern={data.sheetB} size="large" />
    </Flex>
  );
};
