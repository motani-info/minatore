import { Flex, Text } from '@chakra-ui/react';
import type { LineOverlayQuestionData } from '../types';
import { DotGrid } from './DotGrid';

interface QuestionDisplayProps {
  data: LineOverlayQuestionData;
}

/**
 * 線図形の重ね合わせ問題の問題表示コンポーネント
 * 2つの線図形を横に並べて表示し、間に「+」を表示する
 */
export const LineOverlayQuestionDisplay: React.FC<QuestionDisplayProps> = ({ data }) => {
  const gridSize = data.gridSize ?? 4;

  return (
    <Flex align="center" gap={3} role="img" aria-label="せんずけいのかさねあわせ">
      {/* 図形A */}
      <Flex
        border="2px solid"
        borderColor="#d1d5db"
        borderRadius="lg"
        bg="white"
        p={1}
      >
        <DotGrid figure={data.figureA} size={110} gridSize={gridSize} />
      </Flex>

      {/* 「+」記号 */}
      <Text fontSize="2xl" fontWeight="800" color="#6b7280" lineHeight="1">
        +
      </Text>

      {/* 図形B */}
      <Flex
        border="2px solid"
        borderColor="#d1d5db"
        borderRadius="lg"
        bg="white"
        p={1}
      >
        <DotGrid figure={data.figureB} size={110} gridSize={gridSize} />
      </Flex>
    </Flex>
  );
};
