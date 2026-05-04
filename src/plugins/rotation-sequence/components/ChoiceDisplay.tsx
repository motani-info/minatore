import { Text } from '@chakra-ui/react';
import type { RotationSequenceChoiceData } from '../types';

interface Props {
  data: RotationSequenceChoiceData;
  isSelected: boolean;
  isCorrect: boolean;
  showResult: boolean;
}

/**
 * 選択肢表示: フレーム番号を表示
 */
export const RotationSequenceChoiceDisplay: React.FC<Props> = ({ data }) => {
  return (
    <Text fontSize="xl" fontWeight="800" color="inherit">
      {data + 1}ばんめ
    </Text>
  );
};
