import { Box, Flex, Grid, GridItem, Text } from '@chakra-ui/react';
import type { OverlayQuestionData, CellValue } from '../types';

interface QuestionDisplayProps {
  data: OverlayQuestionData;
}

/** 白黒のセル表示 */
const CellDisplay: React.FC<{ value: CellValue; size?: string }> = ({
  value,
  size = '64px',
}) => {
  return (
    <Flex
      align="center"
      justify="center"
      w={size}
      h={size}
      bg="white"
      border="1.5px solid"
      borderColor="#1a1a1a"
    >
      {value === 'circle' && (
        <Text fontSize="3xl" fontWeight="800" color="#1a1a1a" lineHeight="1">
          ◯
        </Text>
      )}
      {value === 'cross' && (
        <Text fontSize="3xl" fontWeight="800" color="#1a1a1a" lineHeight="1">
          ✕
        </Text>
      )}
    </Flex>
  );
};

/**
 * 折り重ね図形問題の問題表示コンポーネント
 * 本番のペーパーテストに合わせて白黒で表示
 */
export const OverlayQuestionDisplay: React.FC<QuestionDisplayProps> = ({ data }) => {
  const { grid } = data;

  return (
    <Flex align="center" gap={0} role="img" aria-label="おりかさねずけい">
      {/* 左列 */}
      <Grid templateColumns="1fr" gap="0px" border="1.5px solid" borderColor="#1a1a1a">
        <GridItem><CellDisplay value={grid.left[0]} /></GridItem>
        <GridItem><CellDisplay value={grid.left[1]} /></GridItem>
      </Grid>

      {/* 折り線 */}
      <Flex direction="column" align="center" gap={1} px={0} position="relative">
        <Box w="2px" h="100%" bg="#1a1a1a" position="absolute" top={0} bottom={0} />
        <Box
          bg="white"
          border="1.5px solid"
          borderColor="#1a1a1a"
          borderRadius="full"
          px={1.5}
          py={0.5}
          zIndex={1}
          my="auto"
          position="relative"
        >
          <Text fontSize="2xs" color="#1a1a1a" fontWeight="800" lineHeight="1">
            おり
          </Text>
        </Box>
      </Flex>

      {/* 右列 */}
      <Grid templateColumns="1fr" gap="0px" border="1.5px solid" borderColor="#1a1a1a">
        <GridItem><CellDisplay value={grid.right[0]} /></GridItem>
        <GridItem><CellDisplay value={grid.right[1]} /></GridItem>
      </Grid>
    </Flex>
  );
};
