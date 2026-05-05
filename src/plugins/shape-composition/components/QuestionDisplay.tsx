import { Box, Text, VStack, Grid, GridItem } from '@chakra-ui/react';
import type { ShapeCompositionQuestionData } from '../types';

interface Props {
  data: ShapeCompositionQuestionData;
}

/**
 * お手本図形の表示（4×4グリッド）
 */
export const ShapeCompositionQuestionDisplay: React.FC<Props> = ({ data }) => {
  const { model } = data;

  return (
    <VStack gap={1}>
      <Text fontSize="xs" fontWeight="700" color="gray.500">おてほん</Text>
      <Box
        border="3px solid"
        borderColor="#1a1a1a"
        borderRadius="lg"
        p={1}
        bg="white"
      >
        <Grid templateColumns="repeat(4, 1fr)" gap="0px" w="120px" h="120px">
          {model.map((filled, i) => (
            <GridItem
              key={i}
              bg={filled ? '#4a5568' : '#ffffff'}
              border="1px solid"
              borderColor="#cbd5e0"
              aspectRatio="1"
            />
          ))}
        </Grid>
      </Box>
    </VStack>
  );
};
