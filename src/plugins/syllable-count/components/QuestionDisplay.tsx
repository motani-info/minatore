import { Box, Text } from '@chakra-ui/react';
import type { SyllableCountQuestionData } from '../types';

interface Props {
  data: SyllableCountQuestionData;
}

export const SyllableCountQuestionDisplay: React.FC<Props> = ({ data }) => {
  return (
    <Box textAlign="center">
      <Text fontSize="4xl" fontWeight="800" color="gray.800" letterSpacing="0.1em">
        {data.word}
      </Text>
      <Text fontSize="sm" color="gray.400" mt={2}>
        （{data.syllableCount}もじ）
      </Text>
    </Box>
  );
};
