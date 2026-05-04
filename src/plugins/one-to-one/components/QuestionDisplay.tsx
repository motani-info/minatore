import { Box, Flex, Text, VStack } from '@chakra-ui/react';
import type { OneToOneQuestionData } from '../types';

interface Props {
  data: OneToOneQuestionData;
}

export const OneToOneQuestionDisplay: React.FC<Props> = ({ data }) => {
  return (
    <VStack gap={4} w="100%">
      {/* 上のアイテム */}
      <Box>
        <Flex wrap="wrap" justify="center" gap={2}>
          {Array.from({ length: data.topCount }).map((_, i) => (
            <Text key={i} fontSize="36px" lineHeight="1">{data.topEmoji}</Text>
          ))}
        </Flex>
      </Box>

      <Text fontSize="md" color="gray.400" fontWeight="600">↕</Text>

      {/* 下のアイテム */}
      <Box>
        <Flex wrap="wrap" justify="center" gap={2}>
          {Array.from({ length: data.bottomCount }).map((_, i) => (
            <Text key={i} fontSize="36px" lineHeight="1">{data.bottomEmoji}</Text>
          ))}
        </Flex>
      </Box>
    </VStack>
  );
};
