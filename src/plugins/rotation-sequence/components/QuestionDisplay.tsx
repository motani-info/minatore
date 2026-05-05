import { Box, Flex } from '@chakra-ui/react';
import type { RotationSequenceQuestionData } from '../types';
import { PictureRenderer } from './PictureRenderer';

interface Props {
  data: RotationSequenceQuestionData;
}

/**
 * 回転図形（連続）の問題表示
 * 元の絵を1つ大きく表示する
 */
export const RotationSequenceQuestionDisplay: React.FC<Props> = ({ data }) => {
  const { pictureType, originalAngle } = data;
  const displaySize = 160;

  return (
    <Flex direction="column" align="center" justify="center">
      <Box
        w={`${displaySize + 20}px`}
        h={`${displaySize + 20}px`}
        border="3px solid"
        borderColor="#1a1a1a"
        borderRadius="xl"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg="white"
      >
        <Box transform={`rotate(${originalAngle}deg)`}>
          <PictureRenderer pictureType={pictureType} size={displaySize} />
        </Box>
      </Box>
    </Flex>
  );
};
