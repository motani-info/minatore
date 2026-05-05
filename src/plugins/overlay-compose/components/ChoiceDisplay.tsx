import { Flex, SimpleGrid, Text } from '@chakra-ui/react';
import type { OverlayComposeChoiceData, CellValue } from '../types';

interface Props {
  data: OverlayComposeChoiceData;
  isSelected: boolean;
  isCorrect: boolean;
  showResult: boolean;
}

/** グリッドサイズに応じたセルサイズを返す */
function getCellSize(gridSize: number): number {
  switch (gridSize) {
    case 2: return 36;
    case 3: return 26;
    case 4: return 20;
    default: return 36;
  }
}

/** グリッドサイズに応じたフォントサイズを返す */
function getFontSize(gridSize: number): string {
  switch (gridSize) {
    case 2: return '20px';
    case 3: return '15px';
    case 4: return '12px';
    default: return '20px';
  }
}

const CellDisplay: React.FC<{ value: CellValue; cellSize: number; fontSize: string }> = ({ value, cellSize, fontSize }) => (
  <Flex
    w={`${cellSize}px`}
    h={`${cellSize}px`}
    align="center"
    justify="center"
    border="1px solid"
    borderColor="gray.300"
    bg="white"
  >
    {value === 'circle' && (
      <Text fontSize={fontSize} lineHeight="1" color="blue.500" fontWeight="800">○</Text>
    )}
    {value === 'cross' && (
      <Text fontSize={fontSize} lineHeight="1" color="red.500" fontWeight="800">×</Text>
    )}
    {value === 'triangle' && (
      <Text fontSize={`calc(${fontSize} * 0.85)`} lineHeight="1" color="gray.700" fontWeight="800">△</Text>
    )}
    {value === 'triangle-right' && (
      <Text fontSize={`calc(${fontSize} * 0.85)`} lineHeight="1" color="gray.700" fontWeight="800">▷</Text>
    )}
    {value === 'triangle-left' && (
      <Text fontSize={`calc(${fontSize} * 0.85)`} lineHeight="1" color="gray.700" fontWeight="800">◁</Text>
    )}
  </Flex>
);

export const OverlayComposeChoiceDisplay: React.FC<Props> = ({ data }) => {
  const cellSize = getCellSize(data.size);
  const fontSize = getFontSize(data.size);

  return (
    <SimpleGrid columns={data.size} gap={0} w="fit-content" mx="auto">
      {data.cells.map((cell, i) => (
        <CellDisplay key={i} value={cell} cellSize={cellSize} fontSize={fontSize} />
      ))}
    </SimpleGrid>
  );
};
