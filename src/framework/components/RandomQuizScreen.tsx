import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Flex, Text, VStack, chakra } from '@chakra-ui/react';
import { registry } from '../../registry/questionTypeRegistry';
import { R } from './Ruby';

const TOTAL_QUESTIONS = 10;

/** ランダムに問題タイプIDを10個選ぶ */
function pickRandomTypeIds(): string[] {
  const allTypes = registry.getAll();
  if (allTypes.length === 0) return [];
  return Array.from({ length: TOTAL_QUESTIONS }, () =>
    allTypes[Math.floor(Math.random() * allTypes.length)].id
  );
}

/**
 * ランダム10問画面
 *
 * ランダムに選んだ問題タイプの個別画面に自動遷移する。
 * 個別画面で回答後「つぎのもんだいへ」を押すと /random に戻り、次の問題に自動遷移する。
 * 進捗は sessionStorage で管理する。
 */
export const RandomQuizScreen: React.FC = () => {
  const navigate = useNavigate();

  // sessionStorage からキューを復元 or 新規生成
  const [typeIds] = useState<string[]>(() => {
    const storedIds = sessionStorage.getItem('randomQuizTypeIds');
    const storedIndex = sessionStorage.getItem('randomQuizIndex');
    const idx = storedIndex ? parseInt(storedIndex, 10) : 0;

    // 前回のキューが残っていて、まだ途中なら続きから
    if (storedIds) {
      try {
        const parsed = JSON.parse(storedIds);
        if (Array.isArray(parsed) && parsed.length > 0 && idx < parsed.length) {
          return parsed;
        }
      } catch { /* ignore */ }
    }

    // 新規生成（前回完了済み or データなし）
    const ids = pickRandomTypeIds();
    sessionStorage.setItem('randomQuizTypeIds', JSON.stringify(ids));
    sessionStorage.setItem('randomQuizIndex', '0');
    return ids;
  });

  const [currentIndex, setCurrentIndex] = useState<number>(() => {
    const stored = sessionStorage.getItem('randomQuizIndex');
    return stored ? parseInt(stored, 10) : 0;
  });

  const isFinished = currentIndex >= typeIds.length;

  // 自動遷移: まだ問題が残っていれば個別画面に飛ぶ
  useEffect(() => {
    if (isFinished) return;
    const typeId = typeIds[currentIndex];
    if (!typeId) return;

    // インデックスを進めてから遷移
    const nextIdx = currentIndex + 1;
    sessionStorage.setItem('randomQuizIndex', String(nextIdx));
    setCurrentIndex(nextIdx);

    // 個別画面に遷移（randomMode フラグ付き）
    navigate(`/question/${typeId}`, {
      replace: true,
      state: {
        randomMode: true,
        randomCurrent: currentIndex + 1,
        randomTotal: TOTAL_QUESTIONS,
      },
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /** もう一回 */
  const handleRestart = useCallback(() => {
    const ids = pickRandomTypeIds();
    sessionStorage.setItem('randomQuizTypeIds', JSON.stringify(ids));
    sessionStorage.setItem('randomQuizIndex', '0');
    window.location.reload();
  }, []);

  /** やめる */
  const handleQuit = useCallback(() => {
    sessionStorage.removeItem('randomQuizTypeIds');
    sessionStorage.removeItem('randomQuizIndex');
    navigate('/');
  }, [navigate]);

  // まだ遷移していない場合（一瞬表示される）
  if (!isFinished) {
    return null;
  }

  // 結果画面（全問終了後）
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
};
