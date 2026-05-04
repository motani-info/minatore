import { Flex, SimpleGrid, Text } from '@chakra-ui/react';
import type { OverlayCancelChoiceData, CellValue } from '../types';

interface Props {
  data: OverlayCancelChoiceData;
  isSelected: boolean;
  isCorrect: boolean;
  showResult: boolean;
}

const CellDisplay: React.FC<{ value: CellValue }> = ({ value }) => (
  <Flex
    w="28px"
    h="28px"
    align="center"
    justify="center"
    border="1px solid"
    borderColor="gray.300"
    bg="white"
  >
    {value === 'circle' && (
      <Text fontSize="16px" lineHeight="1" color="blue.500" fontWeight="800">○</Text>
    )}
    {value === 'cross' && (
      <Text fontSize="16px" lineHeight="1" color="red.500" fontWeight="800">×</Text>
    )}
  </Flex>
);

export const OverlayCancelChoiceDisplay: React.FC<Props> = ({ data }) => {
  return (
    <SimpleGrid columns={2} gap={0} w="fit-content" mx="auto">
      {data.map((cell, i) => (
        <CellDisplay key={i} value={cell} />
      ))}
    </SimpleGrid>
  );
};
