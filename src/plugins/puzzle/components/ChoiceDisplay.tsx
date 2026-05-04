import { Flex, Grid, GridItem, Text } from '@chakra-ui/react';
import type { PuzzleChoiceData, PuzzleGrid } from '../types';

interface ChoiceDisplayProps {
  data: PuzzleChoiceData;
  isSelected: boolean;
  isCorrect: boolean;
  showResult: boolean;
}

/** 白黒の小さいグリッド表示 */
const MiniGrid: React.FC<{ grid: PuzzleGrid }> = ({ grid }) => {
  return (
    <Grid
      templateColumns="repeat(2, 1fr)"
      gap="0px"
      border="1.5px solid"
      borderColor="#1a1a1a"
    >
      {grid.map((filled, index) => (
        <GridItem
          key={index}
          w="30px"
          h="30px"
          bg={filled ? '#6b7280' : '#ffffff'}
          border="0.5px solid"
          borderColor="#1a1a1a"
        />
      ))}
    </Grid>
  );
};

export const PuzzleChoiceDisplay: React.FC<ChoiceDisplayProps> = ({ data }) => {
  return (
    <Flex align="center" gap={2} role="img" aria-label="ぴーすのくみあわせ">
      <MiniGrid grid={data.pieceA} />
      <Text fontSize="sm" fontWeight="800" color="#1a1a1a" lineHeight="1">
        +
      </Text>
      <MiniGrid grid={data.pieceB} />
    </Flex>
  );
};
