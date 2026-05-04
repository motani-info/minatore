import { Text } from '@chakra-ui/react';
import type { OneToOneChoiceData } from '../types';

interface Props {
  data: OneToOneChoiceData;
  isSelected: boolean;
  isCorrect: boolean;
  showResult: boolean;
}

export const OneToOneChoiceDisplay: React.FC<Props> = ({ data }) => {
  return (
    <Text fontSize="sm" fontWeight="700" textAlign="center" lineHeight="1.4">
      {data.text}
    </Text>
  );
};
