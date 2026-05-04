import { Flex } from '@chakra-ui/react';
import type { SeesawQuestionData } from '../types';
import { SeesawDisplay } from './SeesawDisplay';

interface QuestionDisplayProps {
  data: SeesawQuestionData;
}

/**
 * シーソー問題の問題表示コンポーネント
 * 2つのシーソーを横並びで表示する
 */
export const SeesawQuestionDisplay: React.FC<QuestionDisplayProps> = ({ data }) => {
  return (
    <Flex
      direction={{ base: 'column', sm: 'row' }}
      align="center"
      justify="center"
      gap={{ base: 0, sm: 4 }}
      w="100%"
    >
      {data.seesaws.map((seesaw, index) => (
        <SeesawDisplay key={index} seesaw={seesaw} size={200} />
      ))}
    </Flex>
  );
};
