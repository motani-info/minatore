import { Flex } from '@chakra-ui/react';
import type { SeesawQuestionData } from '../types';
import { SeesawDisplay } from './SeesawDisplay';

interface QuestionDisplayProps {
  data: SeesawQuestionData;
}

/**
 * シーソー問題の問題表示コンポーネント
 * 2つまたは3つのシーソーを表示する
 * 3つの場合は2+1のレイアウトにする
 */
export const SeesawQuestionDisplay: React.FC<QuestionDisplayProps> = ({ data }) => {
  const count = data.seesaws.length;
  const seesawSize = count <= 2 ? 240 : 180;

  if (count <= 2) {
    return (
      <Flex
        direction={{ base: 'column', sm: 'row' }}
        align="center"
        justify="center"
        gap={{ base: 0, sm: 4 }}
        w="100%"
      >
        {data.seesaws.map((seesaw, index) => (
          <SeesawDisplay key={index} seesaw={seesaw} size={seesawSize} />
        ))}
      </Flex>
    );
  }

  // 3つ以上: 上段に2つ、下段に残りを配置
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      gap={0}
      w="100%"
    >
      <Flex
        direction={{ base: 'column', sm: 'row' }}
        align="center"
        justify="center"
        gap={{ base: 0, sm: 2 }}
      >
        {data.seesaws.slice(0, 2).map((seesaw, index) => (
          <SeesawDisplay key={index} seesaw={seesaw} size={seesawSize} />
        ))}
      </Flex>
      <Flex
        direction={{ base: 'column', sm: 'row' }}
        align="center"
        justify="center"
        gap={{ base: 0, sm: 2 }}
      >
        {data.seesaws.slice(2).map((seesaw, index) => (
          <SeesawDisplay key={index + 2} seesaw={seesaw} size={seesawSize} />
        ))}
      </Flex>
    </Flex>
  );
};
