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
    <Flex as="nav" align="center" gap={3}>
      <chakra.button
        type="button"
        onClick={() => navigate('/')}
        aria-label="ほーむにもどる"
        display="flex"
        alignItems="center"
        justifyContent="center"
        w="40px"
        h="40px"
        fontSize="lg"
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

      {showProgress && (
        <>
          <Box flex={1} h="6px" bg="whiteAlpha.300" borderRadius="full" overflow="hidden">
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
    </Flex>
  );
};
