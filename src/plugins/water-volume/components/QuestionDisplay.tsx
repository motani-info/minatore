import { Flex } from '@chakra-ui/react';
import type { WaterVolumeQuestionData } from '../types';
import { WaterContainer } from './WaterContainer';

interface QuestionDisplayProps {
  data: WaterVolumeQuestionData;
}

/**
 * 水量比較問題の問題表示コンポーネント
 * 容器を横に並べて表示する
 */
export const WaterVolumeQuestionDisplay: React.FC<QuestionDisplayProps> = ({ data }) => {
  const count = data.items.length;
  const containerSize = count <= 2 ? 90 : count <= 3 ? 80 : 65;

  return (
    <Flex
      align="flex-end"
      justify="center"
      gap={{ base: 3, sm: 5 }}
      wrap="wrap"
      role="img"
      aria-label="みずのりょうくらべ"
    >
      {data.items.map((item, index) => (
        <WaterContainer key={index} item={item} size={containerSize} />
      ))}
    </Flex>
  );
};
