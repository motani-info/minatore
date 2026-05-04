import { Box, Flex, Text, VStack, chakra } from '@chakra-ui/react';
import { R } from './Ruby';

interface FeedbackOverlayProps {
  isCorrect: boolean;
  visible: boolean;
  onNext: () => void;
  onRetry?: () => void;
}

export const FeedbackOverlay: React.FC<FeedbackOverlayProps> = ({
  isCorrect,
  visible,
  onNext,
  onRetry,
}) => {
  if (!visible) return null;

  const accentColor = isCorrect ? '#34d399' : '#f87171';
  const bgGradient = isCorrect
    ? 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)'
    : 'linear-gradient(135deg, #fef2f2 0%, #fecaca 100%)';

  return (
    <Flex
      position="fixed"
      inset={0}
      align="center"
      justify="center"
      bg="blackAlpha.400"
      backdropFilter="blur(12px)"
      zIndex={100}
      role="dialog"
      aria-label="けっかひょうじ"
      px={6}
      onClick={(e: React.MouseEvent) => e.stopPropagation()}
      onTouchEnd={(e: React.TouchEvent) => e.stopPropagation()}
    >
      <Box
        bg="white"
        borderRadius="3xl"
        boxShadow="0 25px 60px rgba(0, 0, 0, 0.12)"
        w="100%"
        maxW="320px"
        overflow="hidden"
      >
        <Box bg={bgGradient} py={10} textAlign="center">
          <Flex
            align="center"
            justify="center"
            w="88px"
            h="88px"
            mx="auto"
            borderRadius="full"
            bg="white"
            boxShadow={`0 4px 20px ${isCorrect ? 'rgba(52, 211, 153, 0.3)' : 'rgba(248, 113, 113, 0.3)'}`}
          >
            <Text
              fontSize="48px"
              fontWeight="800"
              lineHeight="1"
              color={accentColor}
              aria-label={isCorrect ? 'せいかい' : 'ふせいかい'}
            >
              {isCorrect ? '○' : '✕'}
            </Text>
          </Flex>
        </Box>

        <VStack gap={4} p={7} align="center">
          <Text fontSize="xl" fontWeight="800" color="gray.800" lineHeight="1.4" pt={0}>
            {isCorrect ? <><R rt="せいかい">正解</R>！</> : 'ざんねん…'}
          </Text>
          <Text fontSize="sm" color="gray.400" mt={-2} pt={0}>
            {isCorrect ? 'よくできました' : 'つぎはがんばろう'}
          </Text>

          {isCorrect ? (
            <chakra.button
              type="button"
              onClick={onNext}
              w="100%"
              py={3.5}
              fontSize="md"
              fontWeight="700"
              color="white"
              bg="linear-gradient(135deg, #34d399, #10b981)"
              borderRadius="xl"
              transition="all 0.15s"
              _hover={{ opacity: 0.9 }}
              _active={{ transform: 'scale(0.98)' }}
              minH="48px"
              cursor="pointer"
              boxShadow="0 4px 12px rgba(16, 185, 129, 0.3)"
            >
              つぎの<R rt="もんだい">問題</R>へ
            </chakra.button>
          ) : (
            <VStack gap={3} w="100%">
              {onRetry && (
                <chakra.button
                  type="button"
                  onClick={onRetry}
                  w="100%"
                  py={3.5}
                  fontSize="md"
                  fontWeight="700"
                  color="white"
                  bg="linear-gradient(135deg, #f59e0b, #f97316)"
                  borderRadius="xl"
                  transition="all 0.15s"
                  _hover={{ opacity: 0.9 }}
                  _active={{ transform: 'scale(0.98)' }}
                  minH="48px"
                  cursor="pointer"
                  boxShadow="0 4px 12px rgba(245, 158, 11, 0.3)"
                >
                  もう一回やる
                </chakra.button>
              )}
              <chakra.button
                type="button"
                onClick={onNext}
                w="100%"
                py={3.5}
                fontSize="md"
                fontWeight="700"
                color="white"
                bg="linear-gradient(135deg, #7c6cf0, #9b8afb)"
                borderRadius="xl"
                transition="all 0.15s"
                _hover={{ opacity: 0.9 }}
                _active={{ transform: 'scale(0.98)' }}
                minH="48px"
                cursor="pointer"
                boxShadow="0 4px 12px rgba(124, 108, 240, 0.3)"
              >
                つぎの<R rt="もんだい">問題</R>へ
              </chakra.button>
            </VStack>
          )}
        </VStack>
      </Box>
    </Flex>
  );
};
