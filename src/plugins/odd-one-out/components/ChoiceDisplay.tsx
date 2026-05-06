import { Box, Flex, Text } from '@chakra-ui/react';
import type { OddOneOutChoiceData } from '../types';

interface Props {
  data: OddOneOutChoiceData;
  isSelected: boolean;
  isCorrect: boolean;
  showResult: boolean;
}

/**
 * 選択肢表示: グリッド位置を視覚的に表示
 * 3×3のミニグリッドで該当位置をハイライト
 */
export const OddOneOutChoiceDisplay: React.FC<Props> = ({ data }) => {
  const gridSize = 3;
  const row = Math.floor(data / gridSize);
  const col = data % gridSize;

  return (
    <Box>
      <Flex direction="column" gap="2px" mx="auto" w="fit-content">
        {Array.from({ length: gridSize }).map((_, r) => (
          <Flex key={r} gap="2px">
            {Array.from({ length: gridSize }).map((_, c) => (
              <Box
                key={c}
                w="min(4vw, 18px)"
                h="min(4vw, 18px)"
                bg={r === row && c === col ? '#7c6cf0' : '#e5e7eb'}
                borderRadius="2px"
              />
            ))}
          </Flex>
        ))}
      </Flex>
      <Text fontSize="11px" color="gray.500" mt={0.5} textAlign="center">
        {row + 1}-{col + 1}
      </Text>
    </Box>
  );
};
