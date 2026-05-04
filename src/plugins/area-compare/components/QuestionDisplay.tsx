import { Flex } from '@chakra-ui/react';
import type { AreaCompareQuestionData } from '../types';
import { AreaGridDisplay } from './AreaGridDisplay';

interface QuestionDisplayProps {
  data: AreaCompareQuestionData;
}

/**
 * 広さ比較問題の問題表示コンポーネント
 * グリッド図形を横に並べて表示する
 */
export const AreaCompareQuestionDisplay: React.FC<QuestionDisplayProps> = ({ data }) => {
  const count = data.items.length;
  const gridSize = count <= 3 ? 90 : 75;

  return (
    <Flex
      align="center"
      justify="center"
      gap={{ base: 3, sm: 5 }}
      wrap="wrap"
      role="img"
      aria-label="ひろさくらべ"
    >
      {data.items.map((item, index) => (
        <AreaGridDisplay key={index} grid={item.grid} size={gridSize} />
      ))}
    </Flex>
  );
};
