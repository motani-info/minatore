import { Text } from '@chakra-ui/react';
import type { CompareSpringChoiceData } from '../types';

interface ChoiceDisplayProps {
  data: CompareSpringChoiceData;
  isSelected: boolean;
  isCorrect: boolean;
  showResult: boolean;
}

/**
 * 比較（重さ：ばね）問題の選択肢表示コンポーネント
 * （専用画面を使うため、フォールバック用）
 */
export const CompareSpringChoiceDisplay: React.FC<ChoiceDisplayProps> = () => {
  return <Text fontSize="sm" color="gray.500">◎/△/×で回答</Text>;
};
