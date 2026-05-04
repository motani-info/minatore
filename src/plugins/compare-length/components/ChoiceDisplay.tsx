import { Text } from '@chakra-ui/react';
import type { CompareLengthChoiceData } from '../types';

interface ChoiceDisplayProps {
  data: CompareLengthChoiceData;
  isSelected: boolean;
  isCorrect: boolean;
  showResult: boolean;
}

/**
 * 比較（長さ）問題の選択肢表示コンポーネント
 * （この問題は専用画面を使うため、共通QuestionScreenでの表示用フォールバック）
 */
export const CompareLengthChoiceDisplay: React.FC<ChoiceDisplayProps> = () => {
  return <Text fontSize="sm" color="gray.500">○/×で回答</Text>;
};
