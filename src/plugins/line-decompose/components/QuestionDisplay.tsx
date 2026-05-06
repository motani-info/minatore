import { Flex, Text } from '@chakra-ui/react';
import type { LineDecomposeQuestionData } from '../types';
import { DotGrid } from '../../line-overlay/components/DotGrid';

interface QuestionDisplayProps {
  data: LineDecomposeQuestionData;
}

/**
 * 線図形の分解問題の問題表示コンポーネント
 * お手本（完成形）と与えられた構成図形を横に並べて表示
 * 「お手本」→「与えられた図形」の順で表示
 */
export const LineDecomposeQuestionDisplay: React.FC<QuestionDisplayProps> = ({ data }) => {
  return (
    <Flex align="center" gap={2} role="img" aria-label="せんずけいのぶんかい">
      {/* お手本（完成形） */}
      <Flex
        border="3px solid"
        borderColor="#1a1a1a"
        borderRadius="lg"
        bg="white"
        p={1}
        position="relative"
      >
        <DotGrid figure={data.completeFigure} size="min(20vw, 100px)" />
      </Flex>

      {/* 「＝」記号 */}
      <Text fontSize="lg" fontWeight="800" color="#6b7280" lineHeight="1">
        ＝
      </Text>

      {/* 与えられた構成図形 */}
      <Flex
        border="2px solid"
        borderColor="#d1d5db"
        borderRadius="lg"
        bg="white"
        p={1}
      >
        <DotGrid figure={data.givenFigure} size="min(20vw, 100px)" />
      </Flex>

      {/* 「＋？」記号 */}
      <Text fontSize="lg" fontWeight="800" color="#6b7280" lineHeight="1">
        ＋？
      </Text>
    </Flex>
  );
};
