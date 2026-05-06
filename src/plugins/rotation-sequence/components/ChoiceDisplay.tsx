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

  return (
    <Flex align="center" justify="center" w="100%" h="100%">
      <Box
        w="min(18vw, 80px)"
        h="min(18vw, 80px)"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Box transform={`rotate(${angle}deg)`} w="100%" h="100%" display="flex" alignItems="center" justifyContent="center">
          <PictureRenderer pictureType={pictureType} size="100%" />
        </Box>
      </Box>
    </Flex>
  );
};
