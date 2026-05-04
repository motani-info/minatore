import { Flex, Grid, GridItem, Text } from '@chakra-ui/react';
import type { OverlayChoiceData, CellValue } from '../types';

interface ChoiceDisplayProps {
  data: OverlayChoiceData;
  isSelected: boolean;
  isCorrect: boolean;
  showResult: boolean;
}

/** 白黒のセル表示（小サイズ） */
const CellDisplay: React.FC<{ value: CellValue }> = ({ value }) => {
  return (
    <Flex
      align="center"
      justify="center"
      w="32px"
      h="32px"
      bg="white"
      border="1px solid"
      borderColor="#1a1a1a"
    >
      {value === 'circle' && (
        <Text fontSize="md" fontWeight="800" color="#1a1a1a" lineHeight="1">
          ◯
        </Text>
      )}
      {value === 'cross' && (
        <Text fontSize="md" fontWeight="800" color="#1a1a1a" lineHeight="1">
          ✕
        </Text>
      )}
    </Flex>
  );
};

export const OverlayChoiceDisplay: React.FC<ChoiceDisplayProps> = ({ data }) => {
  return (
    <Grid
      templateColumns="1fr"
      gap="0px"
      border="1.5px solid"
      borderColor="#1a1a1a"
      role="img"
      aria-label="せんたくし"
    >
      <GridItem><CellDisplay value={data[0]} /></GridItem>
      <GridItem><CellDisplay value={data[1]} /></GridItem>
    </Grid>
  );
};
