import { useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Flex, Text, VStack, chakra } from '@chakra-ui/react';
import { registry } from '../../registry/questionTypeRegistry';
import { R } from './Ruby';

/** ランダムクイズの出題数（今後設定画面から変更可能にする） */
export const RANDOM_QUIZ_COUNT = 10;

const SESSION_KEY_IDS = 'randomQuizTypeIds';
const SESSION_KEY_INDEX = 'randomQuizIndex';

/** ランダムに問題タイプIDを選ぶ */
function pickRandomTypeIds(count: number): string[] {
  const allTypes = registry.getAll();
  if (allTypes.length === 0) return [];
  return Array.from({ length: count }, () =>
    allTypes[Math.floor(Math.random() * allTypes.length)].id
  );
}

/** sessionStorageから現在のインデックスを取得 */
function getStoredIndex(): number {
  const stored = sessionStorage.getItem(SESSION_KEY_INDEX);
  return stored ? parseInt(stored, 10) : 0;
}

/** sessionStorageからキューを取得 */
function getStoredIds(): string[] | null {
  const stored = sessionStorage.getItem(SESSION_KEY_IDS);
  if (!stored) return null;
  try {
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch { /* ignore */ }
  return null;
}

/** 新しいランダムクイズを開始する */
function startNewQuiz(): { ids: string[]; index: number } {
  const ids = pickRandomTypeIds(RANDOM_QUIZ_COUNT);
  sessionStorage.setItem(SESSION_KEY_IDS, JSON.stringify(ids));
  sessionStorage.setItem(SESSION_KEY_INDEX, '0');
  return { ids, index: 0 };
}

/**
 * ランダムクイズ画面
 *
 * 動作フロー:
 * 1. /random にアクセス
 * 2. sessionStorageからキューとインデックスを読み取る
 * 3. インデックス < キュー長 → 次の問題の個別画面に自動遷移
 * 4. インデックス >= キュー長 → 結果画面を表示
 * 5. 個別画面で回答後「つぎのもんだいへ」→ /random に戻る → 3に戻る
 */
export const RandomQuizScreen: React.FC = () => {
  const navigate = useNavigate();
  const hasNavigated = useRef(false);

  // 現在の状態を読み取る
  let ids = getStoredIds();
  let currentIndex = getStoredIndex();

  // キューがない or 完了済み → 新規開始
  if (!ids || currentIndex >= ids.length) {
    const newQuiz = startNewQuiz();
    ids = newQuiz.ids;
    currentIndex = newQuiz.index;
  }

  const isFinished = currentIndex >= ids.length;

  // 自動遷移
  useEffect(() => {
    if (isFinished || hasNavigated.current) return;
    hasNavigated.current = true;

    const typeId = ids![currentIndex];
    if (!typeId) return;

    // インデックスを進める
    sessionStorage.setItem(SESSION_KEY_INDEX, String(currentIndex + 1));

    // 個別画面に遷移
    navigate(`/question/${typeId}`, {
      replace: true,
      state: {
        randomMode: true,
        randomCurrent: currentIndex + 1,
        randomTotal: RANDOM_QUIZ_COUNT,
      },
    });
  });

  /** もう一回 */
  const handleRestart = useCallback(() => {
    startNewQuiz();
    hasNavigated.current = false;
    // 強制的に再レンダリング
    navigate('/random', { replace: true });
    window.location.reload();
  }, [navigate]);

  /** やめる */
  const handleQuit = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY_IDS);
    sessionStorage.removeItem(SESSION_KEY_INDEX);
    navigate('/');
  }, [navigate]);

  // まだ遷移中（一瞬表示される）
  if (!isFinished) {
    return null;
  }

  // 結果画面
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
                {RANDOM_QUIZ_COUNT}<R rt="もん">問</R>おわりました
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
