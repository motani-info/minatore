import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Flex, Text, VStack, chakra } from '@chakra-ui/react';
import { registry } from '../../registry/questionTypeRegistry';
import { R } from './Ruby';

const TOTAL_QUESTIONS = 10;

interface RandomEntry {
  typeId: string;
}

/** 実装済みの問題タイプからランダムに10問分のタイプIDを選ぶ */
function generateRandomEntries(): RandomEntry[] {
  const allTypes = registry.getAll();
  if (allTypes.length === 0) return [];

  const entries: RandomEntry[] = [];
  for (let i = 0; i < TOTAL_QUESTIONS; i++) {
    const randomType = allTypes[Math.floor(Math.random() * allTypes.length)];
    entries.push({ typeId: randomType.id });
  }
  return entries;
}

/**
 * ランダム10問画面
 *
 * 問題タイプをランダムに選び、各問題タイプの個別画面に順番に遷移する。
 * 進捗（何問目か）は sessionStorage で管理し、個別画面から戻ってきたら次の問題へ進む。
 */
export const RandomQuizScreen: React.FC = () => {
  const navigate = useNavigate();

  // sessionStorage からランダムキューを復元 or 新規生成
  const [entries] = useState<RandomEntry[]>(() => {
    const stored = sessionStorage.getItem('randomQuizEntries');
    if (stored) {
      try { return JSON.parse(stored); } catch { /* ignore */ }
    }
    const newEntries = generateRandomEntries();
    sessionStorage.setItem('randomQuizEntries', JSON.stringify(newEntries));
    return newEntries;
  });

  const [currentIndex, setCurrentIndex] = useState<number>(() => {
    const stored = sessionStorage.getItem('randomQuizIndex');
    return stored ? parseInt(stored, 10) : 0;
  });

  // currentIndex を sessionStorage に保存
  useEffect(() => {
    sessionStorage.setItem('randomQuizIndex', String(currentIndex));
  }, [currentIndex]);

  const isFinished = currentIndex >= TOTAL_QUESTIONS;

  /** 次の問題へ遷移 */
  const goToCurrentQuestion = useCallback(() => {
    if (currentIndex >= entries.length) return;
    const entry = entries[currentIndex];
    // 個別画面に遷移（state で randomMode を渡す）
    navigate(`/question/${entry.typeId}`, {
      state: { randomMode: true, randomIndex: currentIndex, randomTotal: TOTAL_QUESTIONS },
    });
    setCurrentIndex((prev) => prev + 1);
  }, [currentIndex, entries, navigate]);

  /** 最初の問題に自動遷移 */
  useEffect(() => {
    if (!isFinished && currentIndex < entries.length) {
      // 少し遅延を入れてUIを見せる
      const timer = setTimeout(goToCurrentQuestion, 300);
      return () => clearTimeout(timer);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /** もう一回 */
  const handleRestart = useCallback(() => {
    const newEntries = generateRandomEntries();
    sessionStorage.setItem('randomQuizEntries', JSON.stringify(newEntries));
    sessionStorage.setItem('randomQuizIndex', '0');
    // ページをリロードして状態をリセット
    window.location.hash = '#/random';
    window.location.reload();
  }, []);

  /** やめる */
  const handleQuit = useCallback(() => {
    sessionStorage.removeItem('randomQuizEntries');
    sessionStorage.removeItem('randomQuizIndex');
    navigate('/');
  }, [navigate]);

  // 結果画面（全問終了後）
  if (isFinished) {
    return (
      <Container maxW="920px" minH="100dvh" py={0} px={0}>
        <VStack gap={0} align="stretch" minH="100dvh">
          <Box
            bg="linear-gradient(135deg, #f97316 0%, #fb923c 50%, #fbbf24 100%)"
            px={{ base: 5, sm: 6 }}
            pt={{ base: 4, sm: 6 }}
            pb={10}
            position="relative"
            overflow="hidden"
          >
            <Box position="absolute" right="-40px" top="-40px" w="160px" h="160px" bg="whiteAlpha.100" borderRadius="full" />
            <Flex as="nav" align="center" gap={3}>
              <chakra.button
                type="button"
                onClick={handleQuit}
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
              <Text fontSize="md" fontWeight="700" color="white">
                <R rt="けっか">結果</R>
              </Text>
            </Flex>
          </Box>

          <Box
            flex={1}
            bg="white"
            borderTopRadius="3xl"
            mt={-6}
            px={{ base: 5, sm: 6 }}
            pt={10}
            pb={6}
            position="relative"
            zIndex={2}
          >
            <VStack gap={6} align="center">
              <Text fontSize="60px" lineHeight="1">🎉</Text>
              <Text fontSize="2xl" fontWeight="800" color="gray.800">
                おつかれさまでした！
              </Text>

              <Box
                bg="linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)"
                borderRadius="2xl"
                p={6}
                w="100%"
                textAlign="center"
              >
                <Text fontSize="md" color="gray.600" fontWeight="600">
                  {TOTAL_QUESTIONS}<R rt="もん">問</R>おわりました
                </Text>
              </Box>

              <VStack gap={3} w="100%" mt={2}>
                <chakra.button
                  type="button"
                  onClick={handleRestart}
                  w="100%"
                  py={3.5}
                  fontSize="md"
                  fontWeight="700"
                  color="white"
                  bg="linear-gradient(135deg, #f97316, #fbbf24)"
                  borderRadius="xl"
                  transition="all 0.15s"
                  _hover={{ opacity: 0.9 }}
                  _active={{ transform: 'scale(0.98)' }}
                  minH="48px"
                  cursor="pointer"
                  boxShadow="0 4px 12px rgba(249, 115, 22, 0.3)"
                >
                  もう一回
                </chakra.button>
                <chakra.button
                  type="button"
                  onClick={handleQuit}
                  w="100%"
                  py={3.5}
                  fontSize="md"
                  fontWeight="700"
                  color="gray.600"
                  bg="gray.100"
                  borderRadius="xl"
                  transition="all 0.15s"
                  _hover={{ bg: 'gray.200' }}
                  _active={{ transform: 'scale(0.98)' }}
                  minH="48px"
                  cursor="pointer"
                >
                  ホームにもどる
                </chakra.button>
              </VStack>
            </VStack>
          </Box>
        </VStack>
      </Container>
    );
  }

  // 遷移中の画面（すぐに個別画面に飛ぶので一瞬だけ表示）
  const currentEntry = entries[currentIndex];
  const questionType = currentEntry ? registry.get(currentEntry.typeId) : undefined;

  return (
    <Container maxW="920px" minH="100dvh" py={0} px={0}>
      <VStack gap={0} align="stretch" minH="100dvh">
        <Box
          bg="linear-gradient(135deg, #f97316 0%, #fb923c 50%, #fbbf24 100%)"
          px={{ base: 5, sm: 6 }}
          pt={{ base: 4, sm: 6 }}
          pb={10}
          position="relative"
          overflow="hidden"
        >
          <Box position="absolute" right="-40px" top="-40px" w="160px" h="160px" bg="whiteAlpha.100" borderRadius="full" />

          <VStack gap={5} align="stretch" position="relative" zIndex={1}>
            <Flex as="nav" align="center" gap={3}>
              <chakra.button
                type="button"
                onClick={handleQuit}
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
                ✕
              </chakra.button>

              <Box flex={1} h="6px" bg="whiteAlpha.300" borderRadius="full" overflow="hidden">
                <Box
                  h="100%"
                  w={`${((currentIndex + 1) / TOTAL_QUESTIONS) * 100}%`}
                  bg="white"
                  borderRadius="full"
                  transition="width 0.3s ease"
                />
              </Box>
              <Text fontSize="xs" fontWeight="700" color="whiteAlpha.800" flexShrink={0}>
                {currentIndex + 1}/{TOTAL_QUESTIONS}
              </Text>
            </Flex>
          </VStack>
        </Box>

        <Box
          flex={1}
          bg="white"
          borderTopRadius="3xl"
          mt={-6}
          px={{ base: 5, sm: 6 }}
          pt={10}
          pb={6}
          position="relative"
          zIndex={2}
        >
          <VStack gap={4} align="center" justify="center" minH="200px">
            <Text fontSize="lg" fontWeight="700" color="gray.600">
              {questionType?.displayName ?? ''}
            </Text>
            <Text fontSize="sm" color="gray.400">
              <R rt="もんだい">問題</R>を<R rt="じゅんび">準備</R>しています...
            </Text>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};
