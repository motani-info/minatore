import { Box, Flex } from '@chakra-ui/react';
import type { RotationSequenceChoiceData } from '../types';
import { PictureRenderer } from './PictureRenderer';

interface Props {
  data: RotationSequenceChoiceData;
  isSelected: boolean;
  isCorrect: boolean;
  showResult: boolean;
}

/**
 * 選択肢表示: 絵を指定角度で回転して表示
 */
export const RotationSequenceChoiceDisplay: React.FC<Props> = ({ data }) => {
  const { pictureType, angle } = data;
  const choiceSize = 80;

  return (
    <Flex align="center" justify="center">
      <Box
        w={`${choiceSize + 8}px`}
        h={`${choiceSize + 8}px`}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Box transform={`rotate(${angle}deg)`}>
          <PictureRenderer pictureType={pictureType} size={choiceSize} />
        </Box>
      </Box>
    </Flex>
  );
};
