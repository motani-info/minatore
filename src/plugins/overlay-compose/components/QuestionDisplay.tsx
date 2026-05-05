import { Box, Flex, SimpleGrid, Text } from '@chakra-ui/react';
import type { OverlayComposeQuestionData, OverlayComposeGrid, CellValue } from '../types';

interface Props {
  data: OverlayComposeQuestionData;
}

const CellDisplay: React.FC<{ value: CellValue; size?: number }> = ({ value, size = 48 }) => (
  <Flex
    w={`${size}px`}
    h={`${size}px`}
    align="center"
    justify="center"
    border="1px solid"
    borderColor="gray.300"
    bg="white"
  >
    {value === 'circle' && (
      <Text fontSize={`${size * 0.6}px`} lineHeight="1" color="blue.500" fontWeight="800">○</Text>
    )}
    {value === 'cross' && (
      <Text fontSize={`${size * 0.6}px`} lineHeight="1" color="red.500" fontWeight="800">×</Text>
    )}
    {value === 'triangle' && (
      <Text fontSize={`${size * 0.5}px`} lineHeight="1" color="gray.700" fontWeight="800">△</Text>
    )}
    {value === 'triangle-right' && (
      <Text fontSize={`${size * 0.5}px`} lineHeight="1" color="gray.700" fontWeight="800">▷</Text>
    )}
    {value === 'triangle-left' && (
      <Text fontSize={`${size * 0.5}px`} lineHeight="1" color="gray.700" fontWeight="800">◁</Text>
    )}
  </Flex>
);

const GridDisplay: React.FC<{ grid: OverlayComposeGrid; cellSize?: number }> = ({ grid, cellSize = 48 }) => (
  <SimpleGrid columns={grid.size} gap={0} w="fit-content">
    {grid.cells.map((cell, i) => (
      <CellDisplay key={i} value={cell} size={cellSize} />
    ))}
  </SimpleGrid>
);

/** グリッドサイズに応じたセルサイズを返す */
function getCellSize(gridSize: number): number {
  switch (gridSize) {
    case 2: return 52;
    case 3: return 38;
    case 4: return 30;
    default: return 48;
  }
}

export const OverlayComposeQuestionDisplay: React.FC<Props> = ({ data }) => {
  const cellSize = getCellSize(data.leftGrid.size);

  return (
    <Flex align="center" justify="center" gap={4}>
      <Box>
        <GridDisplay grid={data.leftGrid} cellSize={cellSize} />
      </Box>
      <Text fontSize="2xl" color="gray.400" fontWeight="700">→</Text>
      <Box>
        <GridDisplay grid={data.rightGrid} cellSize={cellSize} />
      </Box>
    </Flex>
  );
};
