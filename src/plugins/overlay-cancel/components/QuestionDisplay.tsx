import { Box, Flex, SimpleGrid, Text } from '@chakra-ui/react';
import type { OverlayCancelQuestionData, CellValue } from '../types';

interface Props {
  data: OverlayCancelQuestionData;
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
  </Flex>
);

const GridDisplay: React.FC<{ grid: [CellValue, CellValue, CellValue, CellValue]; size?: number }> = ({ grid, size = 48 }) => (
  <SimpleGrid columns={2} gap={0} w="fit-content">
    {grid.map((cell, i) => (
      <CellDisplay key={i} value={cell} size={size} />
    ))}
  </SimpleGrid>
);

export const OverlayCancelQuestionDisplay: React.FC<Props> = ({ data }) => {
  return (
    <Flex align="center" justify="center" gap={4}>
      <Box>
        <GridDisplay grid={data.leftGrid} size={52} />
      </Box>
      <Text fontSize="2xl" color="gray.400" fontWeight="700">→</Text>
      <Box>
        <GridDisplay grid={data.rightGrid} size={52} />
      </Box>
    </Flex>
  );
};
