import { Flex, Box, Grid, GridItem, Text } from '@chakra-ui/react';
import type { ShapeCompositionChoiceData } from '../types';

interface Props {
  data: ShapeCompositionChoiceData;
  isSelected: boolean;
  isCorrect: boolean;
  showResult: boolean;
}

/** 小さな4×4グリッドを描画する */
const MiniGrid: React.FC<{ cells: boolean[]; color: string }> = ({ cells, color }) => (
  <Grid templateColumns="repeat(4, 1fr)" gap="0px" w="52px" h="52px">
    {cells.map((filled, i) => (
      <GridItem
        key={i}
        bg={filled ? color : '#ffffff'}
        border="0.5px solid"
        borderColor="#e2e8f0"
        aspectRatio="1"
      />
    ))}
  </Grid>
);

/**
 * 選択肢表示: 2つのピースを横に並べて表示
 */
export const ShapeCompositionChoiceDisplay: React.FC<Props> = ({ data }) => {
  return (
    <Flex gap={1} align="center" justify="center">
      <Box border="1px solid" borderColor="#a0aec0" borderRadius="md" overflow="hidden">
        <MiniGrid cells={data.pieceA} color="#3182ce" />
      </Box>
      <Text fontSize="xs" color="gray.400" fontWeight="700">+</Text>
      <Box border="1px solid" borderColor="#a0aec0" borderRadius="md" overflow="hidden">
        <MiniGrid cells={data.pieceB} color="#e53e3e" />
      </Box>
    </Flex>
  );
};
