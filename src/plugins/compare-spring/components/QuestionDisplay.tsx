import { Flex } from '@chakra-ui/react';
import type { CompareSpringQuestionData } from '../types';
import { SpringDisplay } from './SpringDisplay';

interface QuestionDisplayProps {
  data: CompareSpringQuestionData;
}

/**
 * 比較（重さ：ばね）問題の問題表示コンポーネント
 */
export const CompareSpringQuestionDisplay: React.FC<QuestionDisplayProps> = ({ data }) => {
  return (
    <Flex gap={2} align="flex-start" justify="center" role="img" aria-label="ばねのおもさくらべ">
      {data.springs.map((spring, index) => (
        <SpringDisplay key={index} spring={spring} width={44} height={100} />
      ))}
    </Flex>
  );
};
