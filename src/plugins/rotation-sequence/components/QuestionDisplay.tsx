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

  return (
    <Flex direction="column" align="center" justify="center" maxW="100%" maxH="100%">
      <Box
        w="min(35vw, 160px)"
        h="min(35vw, 160px)"
        border="3px solid"
        borderColor="#1a1a1a"
        borderRadius="xl"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg="white"
      >
        <Box transform={`rotate(${originalAngle}deg)`} w="85%" h="85%" display="flex" alignItems="center" justifyContent="center">
          <PictureRenderer pictureType={pictureType} size="100%" />
        </Box>
      </Box>
    </Flex>
  );
};
