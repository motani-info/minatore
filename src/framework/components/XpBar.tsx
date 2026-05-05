import { Box, Flex, Text } from '@chakra-ui/react';
import type { LevelData } from '../hooks/useLevel';

interface XpBarProps {
  levelData: LevelData;
  /** コンパクト表示（HomeScreen用） */
  compact?: boolean;
}

/**
 * 経験値バーコンポーネント
 * レベル、XP進捗バー、次のレベルまでのXPを表示する
 */
export const XpBar: React.FC<XpBarProps> = ({ levelData, compact = false }) => {
  const { level, currentLevelXp, nextLevelXp, progressRatio } = levelData;

  if (compact) {
    return (
      <Flex align="center" gap={2} w="100%">
        {/* レベルバッジ */}
        <Flex
          align="center"
          justify="center"
          w="28px"
          h="28px"
          bg="linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)"
          borderRadius="full"
          boxShadow="0 2px 6px rgba(245, 158, 11, 0.3)"
          flexShrink={0}
        >
          <Text fontSize="xs" fontWeight="900" color="white" lineHeight="1">
            {level}
          </Text>
        </Flex>

        {/* プログレスバー */}
        <Box flex={1} position="relative">
          <Box
            w="100%"
            h="10px"
            bg="gray.100"
            borderRadius="full"
            overflow="hidden"
          >
            <Box
              h="100%"
              w={`${progressRatio * 100}%`}
              bg="linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%)"
              borderRadius="full"
              transition="width 0.5s ease"
            />
          </Box>
        </Box>

        {/* XP表示 */}
        <Text fontSize="xs" fontWeight="700" color="gray.400" flexShrink={0} whiteSpace="nowrap">
          {currentLevelXp}/{nextLevelXp}
        </Text>
      </Flex>
    );
  }

  // フル表示（ProfileScreen用）
  return (
    <Box w="100%">
      {/* レベル表示 */}
      <Flex align="center" justify="space-between" mb={2}>
        <Flex align="center" gap={2}>
          <Flex
            align="center"
            justify="center"
            w="36px"
            h="36px"
            bg="linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)"
            borderRadius="full"
            boxShadow="0 2px 8px rgba(245, 158, 11, 0.3)"
          >
            <Text fontSize="sm" fontWeight="900" color="white" lineHeight="1">
              {level}
            </Text>
          </Flex>
          <Box>
            <Text fontSize="sm" fontWeight="800" color="gray.700" lineHeight="1.2">
              レベル {level}
            </Text>
            <Text fontSize="xs" color="gray.400" lineHeight="1.2">
              つぎのレベルまで あと {nextLevelXp - currentLevelXp} XP
            </Text>
          </Box>
        </Flex>
        <Text fontSize="sm" fontWeight="700" color="amber.600">
          {levelData.totalXp} XP
        </Text>
      </Flex>

      {/* プログレスバー */}
      <Box
        w="100%"
        h="14px"
        bg="gray.100"
        borderRadius="full"
        overflow="hidden"
        position="relative"
      >
        <Box
          h="100%"
          w={`${progressRatio * 100}%`}
          bg="linear-gradient(90deg, #f59e0b 0%, #fbbf24 50%, #f59e0b 100%)"
          borderRadius="full"
          transition="width 0.5s ease"
          position="relative"
        >
          {/* シャイン効果 */}
          <Box
            position="absolute"
            top="2px"
            left="4px"
            right="4px"
            h="4px"
            bg="whiteAlpha.400"
            borderRadius="full"
          />
        </Box>
      </Box>

      {/* XP詳細 */}
      <Flex justify="space-between" mt={1.5}>
        <Text fontSize="xs" color="gray.400" fontWeight="600">
          {currentLevelXp} / {nextLevelXp} XP
        </Text>
        <Text fontSize="xs" color="gray.400" fontWeight="600">
          {Math.round(progressRatio * 100)}%
        </Text>
      </Flex>
    </Box>
  );
};
