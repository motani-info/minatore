import { useMemo } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { Box, Container, Flex, SimpleGrid, Text, VStack, chakra } from '@chakra-ui/react';
import { registry } from '../../registry/questionTypeRegistry';
import type { Question, QuestionType } from '../../types/question';
import { R } from './Ruby';

/** 問題タイプごとのテーマカラー */
const TYPE_THEMES: Record<string, { gradient: string; accent: string }> = {
  rotation: { gradient: 'linear-gradient(135deg, #7c6cf0 0%, #a78bfa 100%)', accent: '#7c6cf0' },
  overlay: { gradient: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)', accent: '#3b82f6' },
  puzzle: { gradient: 'linear-gradient(135deg, #8b5cf6 0%, #c084fc 100%)', accent: '#8b5cf6' },
  seesaw: { gradient: 'linear-gradient(135deg, #059669 0%, #34d399 100%)', accent: '#059669' },
  'shape-karta': { gradient: 'linear-gradient(135deg, #d97706 0%, #fbbf24 100%)', accent: '#d97706' },
  'overlay-cancel': { gradient: 'linear-gradient(135deg, #0891b2 0%, #67e8f9 100%)', accent: '#0891b2' },
  'syllable-count': { gradient: 'linear-gradient(135deg, #7c3aed 0%, #c4b5fd 100%)', accent: '#7c3aed' },
  'one-to-one': { gradient: 'linear-gradient(135deg, #0284c7 0%, #7dd3fc 100%)', accent: '#0284c7' },
  'symbol-rotation': { gradient: 'linear-gradient(135deg, #9333ea 0%, #c084fc 100%)', accent: '#9333ea' },
  'overlay-advanced': { gradient: 'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)', accent: '#1d4ed8' },
  'overlay-shape': { gradient: 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)', accent: '#1e40af' },
  'line-overlay': { gradient: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)', accent: '#1e3a5f' },
  'water-volume': { gradient: 'linear-gradient(135deg, #2563eb 0%, #60a5fa 100%)', accent: '#2563eb' },
  'compare-length': { gradient: 'linear-gradient(135deg, #0d9488 0%, #5eead4 100%)', accent: '#0d9488' },
  'compare-spring': { gradient: 'linear-gradient(135deg, #047857 0%, #6ee7b7 100%)', accent: '#047857' },
  'area-compare': { gradient: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)', accent: '#7c3aed' },
};
const DEFAULT_THEME = { gradient: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)', accent: '#6366f1' };

export const QuestionListScreen: React.FC = () => {
  const { typeId } = useParams<{ typeId: string }>();
  const questionType = typeId ? registry.get(typeId) : undefined;

  if (!questionType) {
    return <Navigate to="/" replace />;
  }

  return <QuestionListInner questionType={questionType} />;
};

/** 専用画面を持つ問題タイプID（App.tsxで固定ルートが定義されているもの） */
const CUSTOM_SCREEN_TYPES = new Set([
  'seesaw',
  'water-volume',
  'compare-length',
  'compare-spring',
  'area-compare',
]);

function QuestionListInner({ questionType }: { questionType: QuestionType }) {
  const navigate = useNavigate();
  const theme = TYPE_THEMES[questionType.id] ?? DEFAULT_THEME;
  const isCustomScreen = CUSTOM_SCREEN_TYPES.has(questionType.id);

  // getAllQuestions があれば全問表示、なければ一定数生成
  const questions: Question[] = useMemo(() => {
    if (questionType.getAllQuestions) {
      return questionType.getAllQuestions();
    }
    return [];
  }, [questionType]);

  const { QuestionDisplay } = questionType;
  const hasFixedPool = !!questionType.getAllQuestions;

  const handleSelect = (index: number) => {
    if (isCustomScreen) {
      // 専用画面を持つ問題タイプは、選んだ問題のインデックスをstateで渡して専用画面に遷移
      navigate(`/question/${questionType.id}`, {
        state: { questionIndex: index },
      });
    } else {
      navigate(`/question/${questionType.id}`, {
        state: { questionIndex: index },
      });
    }
  };

  return (
    <Container maxW="920px" minH="100dvh" py={0} px={0}>
      <VStack gap={0} align="stretch" minH="100dvh">

        {/* ヘッダー */}
        <Box
          bg={theme.gradient}
          px={{ base: 5, sm: 6 }}
          pt={{ base: 4, sm: 6 }}
          pb={8}
          position="relative"
          overflow="hidden"
        >
          <Box position="absolute" right="-40px" top="-40px" w="160px" h="160px" bg="whiteAlpha.100" borderRadius="full" />
          <Box position="absolute" left="-20px" bottom="-20px" w="100px" h="100px" bg="whiteAlpha.100" borderRadius="full" />

          <VStack gap={4} align="stretch" position="relative" zIndex={1}>
            {/* ナビゲーション */}
            <Flex align="center" gap={3}>
              <chakra.button
                type="button"
                onClick={() => navigate(-1)}
                aria-label="もどる"
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

            {/* タイトル */}
            <Box>
              <Text fontSize="2xl" fontWeight="800" color="white" lineHeight="1.3">
                {typeof questionType.icon === 'string' ? questionType.icon : ''}{' '}
                {questionType.displayName}
              </Text>
              <Text fontSize="sm" fontWeight="500" color="whiteAlpha.800" mt={1}>
                {hasFixedPool
                  ? `ぜんぶで ${questions.length} もん`
                  : <><R rt="もんだい">問題</R>を<R rt="えら">選</R>んで<R rt="ちょうせん">挑戦</R>しよう</>}
              </Text>
            </Box>
          </VStack>
        </Box>

        {/* コンテンツ */}
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
          <VStack gap={5} align="stretch">

            {/* 問題一覧 */}
            <SimpleGrid columns={2} gap={3}>
              {questions.map((question, index) => (
                <chakra.button
                  key={index}
                  type="button"
                  onClick={() => handleSelect(index)}
                  aria-label={`もんだい ${index + 1}`}
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  gap={2}
                  p={3}
                  bg="#fafafa"
                  border="2px solid"
                  borderColor="#e5e7eb"
                  borderRadius="2xl"
                  boxShadow="0 2px 8px rgba(0,0,0,0.04)"
                  cursor="pointer"
                  transition="all 0.2s ease"
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
                    borderColor: theme.accent,
                  }}
                  _active={{ transform: 'scale(0.96)' }}
                  position="relative"
                  overflow="hidden"
                >
                  {/* 問題番号バッジ */}
                  <Flex
                    position="absolute"
                    top={2}
                    left={2}
                    align="center"
                    justify="center"
                    w="24px"
                    h="24px"
                    bg={theme.gradient}
                    borderRadius="full"
                    zIndex={1}
                  >
                    <Text fontSize="xs" fontWeight="800" color="white" lineHeight="1" pt={0}>
                      {index + 1}
                    </Text>
                  </Flex>

                  {/* 問題プレビュー */}
                  <Flex
                    w="100%"
                    minH="80px"
                    align="center"
                    justify="center"
                    pointerEvents="none"
                    overflow="hidden"
                    transform="scale(0.55)"
                    transformOrigin="center center"
                  >
                    <QuestionDisplay data={question.questionData} />
                  </Flex>

                  {/* ラベル */}
                  <Box
                    w="100%"
                    bg={theme.gradient}
                    borderRadius="lg"
                    py={1.5}
                    mt="auto"
                  >
                    <Text fontSize="xs" fontWeight="700" color="white" textAlign="center">
                      この<R rt="もんだい">問題</R>をやる
                    </Text>
                  </Box>
                </chakra.button>
              ))}
            </SimpleGrid>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
}
