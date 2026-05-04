import { VStack } from '@chakra-ui/react';
import type { CompareLengthQuestionData } from '../types';
import { LineDisplay } from './LineDisplay';

interface QuestionDisplayProps {
  data: CompareLengthQuestionData;
}

/**
 * 比較（長さ）問題の問題表示コンポーネント
 * 複数の線を縦に並べて表示する
 */
export const CompareLengthQuestionDisplay: React.FC<QuestionDisplayProps> = ({ data }) => {
  return (
    <VStack gap={2} align="center" role="img" aria-label="せんのながさくらべ">
      {data.lines.map((line, index) => (
        <LineDisplay key={index} line={line} width={280} />
      ))}
    </VStack>
  );
};
