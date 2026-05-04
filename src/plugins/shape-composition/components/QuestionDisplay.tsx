import { Box, Text, VStack } from '@chakra-ui/react';
import type { ShapeCompositionQuestionData } from '../types';

interface Props {
  data: ShapeCompositionQuestionData;
}

/**
 * お手本図形の表示
 */
export const ShapeCompositionQuestionDisplay: React.FC<Props> = ({ data }) => {
  const { model } = data;

  return (
    <VStack gap={1}>
      <Text fontSize="xs" fontWeight="700" color="gray.500">おてほん</Text>
      <Box
        w="140px"
        h="140px"
        border="2px solid"
        borderColor="#1a1a1a"
        borderRadius="lg"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg="white"
      >
        <svg width="120" height="120" viewBox="0 0 100 100">
          {model.map((polygon, i) => (
            <polygon
              key={i}
              points={polygon}
              fill="none"
              stroke="#1a1a1a"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          ))}
        </svg>
      </Box>
    </VStack>
  );
};
