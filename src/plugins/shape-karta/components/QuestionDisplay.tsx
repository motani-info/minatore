import { Box, Text } from '@chakra-ui/react';
import type { ShapeKartaQuestionData, ShapeColor, ShapeType } from '../types';

interface Props {
  data: ShapeKartaQuestionData;
}

const colorNames: Record<ShapeColor, string> = {
  red: 'あかい', blue: 'あおい', yellow: 'きいろい', green: 'みどりの',
};
const shapeNames: Record<ShapeType, string> = {
  circle: 'まる', triangle: 'さんかく', square: 'しかく',
};

/**
 * 図形と数カルタの問題表示
 * 指示条件をアイコン付きで表示する
 */
export const ShapeKartaQuestionDisplay: React.FC<Props> = ({ data }) => {
  const parts = data.conditions.map(c =>
    `${colorNames[c.color]}${shapeNames[c.shape]}が${c.count}こ`
  );
  const conditionText = parts.join('と') + '\nのカードはどれ？';

  return (
    <Box textAlign="center">
      <Text fontSize="3xl" mb={2}>🎴</Text>
      <Text fontSize="md" fontWeight="700" color="gray.600" whiteSpace="pre-line">
        {conditionText}
      </Text>
    </Box>
  );
};
