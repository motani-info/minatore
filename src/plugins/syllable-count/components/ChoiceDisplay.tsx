import { Flex, Text, VStack } from '@chakra-ui/react';
import type { SyllableCountChoiceData } from '../types';

interface Props {
  data: SyllableCountChoiceData;
  isSelected: boolean;
  isCorrect: boolean;
  showResult: boolean;
}

export const SyllableCountChoiceDisplay: React.FC<Props> = ({ data }) => {
  return (
    <VStack gap={1}>
      <Flex wrap="wrap" justify="center" gap={0.5}>
        {Array.from({ length: data.count }).map((_, i) => (
          <Text key={i} fontSize="24px" lineHeight="1">
            {data.emoji}
          </Text>
        ))}
      </Flex>
      <Text fontSize="xs" fontWeight="700" color="gray.500">
        {data.count}ひき
      </Text>
    </VStack>
  );
};
