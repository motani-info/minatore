import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Flex, Text, VStack, chakra } from '@chakra-ui/react';
import { registry } from '../../registry/questionTypeRegistry';
import type { QuestionType } from '../../types/question';
import { R } from './Ruby';

const TOTAL_QUESTIONS = 10;

/** ランダムに問題タイプを10個選ぶ */
function pickRandomTypes(): QuestionType[] {
  const allTypes = registry.getAll();
  if (allTypes.length === 0) return [];
  return Array.from({ length: TOTAL_QUESTIONS }, () =>
    allTypes[Math.floor(Math.random() * allTypes.length)]
  );
}

/**
 * ランダム10問画面
 *
 * ランダムに選んだ10個の問題タイプをリスト表示し、
 * タップすると各問題タイプの個別画面に遷移する。
 */
export const RandomQuizScreen: React.FC = () => {
  const navigate = useNavigate();
  const [types] = useState<QuestionType[]>(() => pickRandomTypes());

  const handleSelect = useCallback(
    (index: number) => {
      const qt = types[index];
      if (!qt) return;
      navigate(`/question/${qt.id}`);
    },
    [types, navigate],
  );

  return (
    <Container maxW="920px" minH="100dvh" py={0} px={0}>
      <VStack gap={0} align="stretch" minH="100dvh">

        {/* ヘッダー */}
        <Box
          bg="linear-gradient(135deg, #f97316 0%, #fb923c 50%, #fbbf24 100%)"
          px={{ base: 5, sm: 6 }}
          pt={{ base: 4, sm: 6 }}
          pb={8}
          position="relative"
          overflow="hidden"
        >
          <Box position="absolute" right="-40px" top="-40px" w="160px" h="160px" bg="whiteAlpha.100" borderRadius="full" />
          <Box position="absolute" left="-20px" bottom="-20px" w="100px" h="100px" bg="whiteAlpha.100" borderRadius="full" />

          <VStack gap={4} align="stretch" position="relative" zIndex={1}>
            <Flex as="nav" align="center" gap={3}>
              <chakra.button
                type="button"
                onClick={() => navigate('/')}
                aria-label="ホームにもどる"
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
                ←
              </chakra.button>
              <Box flex={1} />
            </Flex>

            <Box>
              <Text fontSize="2xl" fontWeight="800" color="white" lineHeight="1.3">
                🎲 ランダム{TOTAL_QUESTIONS}<R rt="もん">問</R>
              </Text>
              <Text fontSize="sm" fontWeight="500" color="whiteAlpha.800" mt={1}>
                いろいろな<R rt="もんだい">問題</R>に<R rt="ちょうせん">挑戦</R>しよう
              </Text>
            </Box>
          </VStack>
        </Box>

        {/* 問題リスト */}
        <Box
          flex={1}
          bg="white"
          borderTopRadius="3xl"
          mt={-5}
          px={{ base: 5, sm: 6 }}
          pt={7}
          pb={6}
          position="relative"
          zIndex={2}
          boxShadow="0 -4px 20px rgba(0,0,0,0.04)"
        >
          <VStack gap={3} align="stretch">
            {types.map((qt, index) => (
              <chakra.button
                key={index}
                type="button"
                onClick={() => handleSelect(index)}
                display="flex"
                alignItems="center"
                gap={3}
                w="100%"
                p={4}
                bg="#fafafa"
                border="2px solid"
                borderColor="#e5e7eb"
                borderRadius="xl"
                cursor="pointer"
                transition="all 0.15s"
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                  borderColor: '#f97316',
                }}
                _active={{ transform: 'scale(0.98)' }}
                textAlign="left"
                minH="56px"
              >
                {/* 番号 */}
                <Flex
                  align="center"
                  justify="center"
                  w="32px"
                  h="32px"
                  bg="linear-gradient(135deg, #f97316, #fbbf24)"
                  borderRadius="full"
                  flexShrink={0}
                >
                  <Text fontSize="sm" fontWeight="800" color="white" lineHeight="1">
                    {index + 1}
                  </Text>
                </Flex>

                {/* アイコン + 名前 */}
                <Text fontSize="md" fontWeight="700" color="gray.700">
                  {typeof qt.icon === 'string' ? qt.icon + ' ' : ''}
                  {qt.displayName}
                </Text>

                {/* 矢印 */}
                <Text fontSize="sm" color="gray.400" ml="auto">
                  →
                </Text>
              </chakra.button>
            ))}
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};
