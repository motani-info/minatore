import { Box, Flex, Text } from '@chakra-ui/react';
import type { RotationSequenceQuestionData } from '../types';
import { PictureRenderer } from './PictureRenderer';

interface Props {
  data: RotationSequenceQuestionData;
}

/**
 * 回転図形（連続）の問題表示
 * 5つのフレームを横に並べ、間に回転矢印を表示
 */
export const RotationSequenceQuestionDisplay: React.FC<Props> = ({ data }) => {
  const { pictureType, frames, rotationStep } = data;
  const frameSize = 52;

  return (
    <Flex direction="column" align="center" gap={2}>
      {/* 回転方向の説明 */}
      <Text fontSize="xs" color="gray.500" fontWeight="600">
        {rotationStep > 0 ? '→ みぎまわり' : '← ひだりまわり'}
      </Text>

      {/* フレーム列 */}
      <Flex align="center" gap={1} flexWrap="nowrap">
        {frames.map((frame, i) => (
          <Flex key={i} align="center" gap={1}>
            {/* フレーム */}
            <Box
              w={`${frameSize}px`}
              h={`${frameSize}px`}
              border="2px solid"
              borderColor="#1a1a1a"
              borderRadius="md"
              display="flex"
              alignItems="center"
              justifyContent="center"
              bg="white"
              position="relative"
              overflow="hidden"
            >
              <Box transform={`rotate(${frame.angle}deg)`} transition="none">
                <PictureRenderer pictureType={pictureType} size={frameSize - 8} />
              </Box>
              {/* フレーム番号 */}
              <Text
                position="absolute"
                bottom="1px"
                right="3px"
                fontSize="8px"
                color="gray.400"
                fontWeight="600"
              >
                {i + 1}
              </Text>
            </Box>

            {/* 矢印（最後のフレーム以外） */}
            {i < frames.length - 1 && (
              <RotationArrow direction={rotationStep > 0 ? 'right' : 'left'} />
            )}
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
};

/** 回転矢印 */
const RotationArrow: React.FC<{ direction: 'right' | 'left' }> = ({ direction }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
    {direction === 'right' ? (
      <path
        d="M 4 12 A 8 8 0 1 1 12 20 M 12 20 L 9 17 M 12 20 L 15 17"
        fill="none"
        stroke="#6b7280"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ) : (
      <path
        d="M 20 12 A 8 8 0 1 0 12 20 M 12 20 L 9 17 M 12 20 L 15 17"
        fill="none"
        stroke="#6b7280"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    )}
  </svg>
);
