import { Box, Text } from '@chakra-ui/react';
import type { ShapeKartaQuestionData } from '../types';

interface Props {
  data: ShapeKartaQuestionData;
}

/**
 * 図形と数カルタの問題表示
 * 指示条件をアイコン付きで表示する
 */
export const ShapeKartaQuestionDisplay: React.FC<Props> = ({ data }) => {
  return (
    <Box textAlign="center">
      <Text fontSize="3xl" mb={2}>🎴</Text>
      <Text fontSize="md" fontWeight="700" color="gray.600">
        したのカードからえらんでね
      </Text>
    </Box>
  );
};
