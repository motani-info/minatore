import { useNavigate } from 'react-router-dom';
import { Flex, Box, Text, chakra } from '@chakra-ui/react';

interface NavigationBarProps {
  current?: number;
  total?: number;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({ current, total }) => {
  const navigate = useNavigate();
  const showProgress = current !== undefined && total !== undefined && total > 0;

  return (
    <Flex as="nav" align="center" gap={2}>
      {/* 左: ✕ボタン */}
      <chakra.button
        type="button"
        onClick={() => navigate('/')}
        aria-label="ホームにもどる"
        display="flex"
        alignItems="center"
        justifyContent="center"
        w="36px"
        h="36px"
        fontSize="md"
        color="whiteAlpha.800"
        borderRadius="full"
        bg="whiteAlpha.200"
        transition="all 0.15s"
        _hover={{ bg: 'whiteAlpha.300', color: 'white' }}
        _active={{ transform: 'scale(0.95)' }}
        flexShrink={0}
      >
        ✕
      </chakra.button>

      {/* 中央: プログレスバー */}
      {showProgress && (
        <>
          <Box flex={1} h="5px" bg="whiteAlpha.300" borderRadius="full" overflow="hidden">
            <Box
              h="100%"
              w={`${Math.min((current / total) * 100, 100)}%`}
              bg="white"
              borderRadius="full"
              transition="width 0.3s ease"
            />
          </Box>
          <Text fontSize="xs" fontWeight="700" color="whiteAlpha.800" flexShrink={0}>
            {current}/{total}
          </Text>
        </>
      )}

      {/* 右: やめるボタン */}
      <chakra.button
        type="button"
        onClick={() => navigate('/')}
        aria-label="やめてホームにもどる"
        display="flex"
        alignItems="center"
        gap={1}
        minH="36px"
        px={3}
        py={1.5}
        fontSize="xs"
        fontWeight="700"
        color="white"
        bg="rgba(239, 68, 68, 0.7)"
        borderRadius="full"
        transition="all 0.15s"
        _hover={{ bg: 'rgba(239, 68, 68, 0.85)' }}
        _active={{ transform: 'scale(0.95)' }}
        flexShrink={0}
      >
        やめる
      </chakra.button>
    </Flex>
  );
};
