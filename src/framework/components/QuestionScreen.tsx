import { useParams, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Box, Container, Flex, SimpleGrid, Text, VStack, chakra } from '@chakra-ui/react';
import { registry } from '../../registry/questionTypeRegistry';
import { useQuestionFlow } from '../hooks/useQuestionFlow';
import { useProgress } from '../hooks/useProgress';
import { NavigationBar } from './NavigationBar';
import { FeedbackOverlay } from './FeedbackOverlay';
import type { Question } from '../../types/question';

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
  'odd-one-out': { gradient: 'linear-gradient(135deg, #dc2626 0%, #fca5a5 100%)', accent: '#dc2626' },
  'shape-composition': { gradient: 'linear-gradient(135deg, #7c2d12 0%, #ea580c 100%)', accent: '#ea580c' },
  'symbol-rotation': { gradient: 'linear-gradient(135deg, #9333ea 0%, #c084fc 100%)', accent: '#9333ea' },
  'rotation-sequence': { gradient: 'linear-gradient(135deg, #6d28d9 0%, #8b5cf6 100%)', accent: '#6d28d9' },
  'overlay-advanced': { gradient: 'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)', accent: '#1d4ed8' },
  'overlay-shape': { gradient: 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)', accent: '#1e40af' },
  'line-overlay': { gradient: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)', accent: '#1e3a5f' },
  'water-volume': { gradient: 'linear-gradient(135deg, #2563eb 0%, #60a5fa 100%)', accent: '#2563eb' },
  'compare-length': { gradient: 'linear-gradient(135deg, #0d9488 0%, #5eead4 100%)', accent: '#0d9488' },
  'compare-spring': { gradient: 'linear-gradient(135deg, #047857 0%, #6ee7b7 100%)', accent: '#047857' },
  'area-compare': { gradient: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)', accent: '#7c3aed' },
};
const DEFAULT_THEME = { gradient: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)', accent: '#6366f1' };

export const QuestionScreen: React.FC = () => {
  const { typeId } = useParams<{ typeId: string }>();
  const location = useLocation();
  const questionType = typeId ? registry.get(typeId) : undefined;

  if (!questionType) {
    return <Navigate to="/" replace />;
  }

  // 一覧画面から選択された問題があれば初期問題として渡す
  const locationState = location.state as { selectedQuestion?: Question; randomMode?: boolean; randomCurrent?: number; randomTotal?: number } | null;
  const selectedQuestion = locationState?.selectedQuestion;
  const randomMode = locationState?.randomMode ?? false;
  const randomCurrent = locationState?.randomCurrent;
  const randomTotal = locationState?.randomTotal;

  return <QuestionScreenInner questionType={questionType} initialQuestion={selectedQuestion} randomMode={randomMode} randomCurrent={randomCurrent} randomTotal={randomTotal} />;
};

function QuestionScreenInner({ questionType, initialQuestion, randomMode, randomCurrent, randomTotal }: { questionType: NonNullable<ReturnType<typeof registry.get>>; initialQuestion?: Question; randomMode?: boolean; randomCurrent?: number; randomTotal?: number }) {
  const navigate = useNavigate();
  const {
    currentQuestion,
    selectedIndex,
    isAnswered,
    isCorrect,
    phase,
    selectChoice,
    nextQuestion,
    retryQuestion,
  } = useQuestionFlow(questionType, initialQuestion);

  const { progress } = useProgress();
  const typeProgress = progress?.byType[questionType.id];
  const totalDone = (typeProgress?.totalQuestions ?? 0) + (isAnswered ? 1 : 0);
  const theme = TYPE_THEMES[questionType.id] ?? DEFAULT_THEME;

  const { QuestionDisplay, ChoiceDisplay } = questionType;
  const showFeedback = phase === 'feedback' && isCorrect !== null;

  return (
    <Container maxW="920px" minH="100dvh" py={0} px={0}>
      <VStack gap={0} align="stretch" minH="100dvh">

        {/* 上部: グラデーション背景エリア */}
        <Box
          bg={theme.gradient}
          px={{ base: 5, sm: 6 }}
          pt={{ base: 4, sm: 6 }}
          pb={10}
          position="relative"
          overflow="hidden"
        >
          {/* 背景装飾 */}
          <Box position="absolute" right="-40px" top="-40px" w="160px" h="160px" bg="whiteAlpha.100" borderRadius="full" />
          <Box position="absolute" left="-20px" bottom="-20px" w="100px" h="100px" bg="whiteAlpha.100" borderRadius="full" />

          <VStack gap={5} align="stretch" position="relative" zIndex={1}>
            <NavigationBar current={randomMode ? (randomCurrent ?? 1) : totalDone} total={randomMode ? (randomTotal ?? 10) : 30} />

            {/* 問題表示エリア */}
            <Flex
              align="center"
              justify="center"
              bg="white"
              borderRadius="3xl"
              p={{ base: 6, sm: 8 }}
              minH="220px"
              boxShadow="0 2px 12px rgba(0,0,0,0.06)"
            >
              <QuestionDisplay data={currentQuestion.questionData} />
            </Flex>
          </VStack>
        </Box>

        {/* 下部: 白背景エリア */}
        <Box
          flex={1}
          bg="white"
          borderTopRadius="3xl"
          mt={-6}
          px={{ base: 5, sm: 6 }}
          pt={8}
          pb={6}
          position="relative"
          zIndex={2}
          boxShadow="0 -4px 20px rgba(0,0,0,0.04)"
        >
          <VStack gap={5} align="stretch">
            {/* 指示テキスト */}
            <Box textAlign="center">
              <Text
                fontSize="lg"
                color="gray.700"
                lineHeight="1.7"
                whiteSpace="pre-line"
                fontWeight="700"
              >
                {currentQuestion.instructionText}
              </Text>
            </Box>

            {/* 選択肢エリア */}
            <SimpleGrid columns={2} gap={4}>
              {currentQuestion.choices.map((choice, index) => {
                const isSelected = selectedIndex === index;
                const isChoiceCorrect = index === currentQuestion.correctIndex;
                const showResult = isAnswered;
                const showCorrectHighlight = showResult && !isCorrect && isChoiceCorrect;

                let borderColor = '#e5e7eb';
                let bgColor = '#fafafa';
                let shadow = '0 2px 8px rgba(0,0,0,0.04)';
                let labelColor = 'gray.500';

                if (isSelected && showResult) {
                  if (isCorrect) {
                    borderColor = '#34d399';
                    bgColor = '#ecfdf5';
                    shadow = '0 0 0 3px rgba(52, 211, 153, 0.2), 0 4px 12px rgba(52, 211, 153, 0.1)';
                    labelColor = 'green.600';
                  } else {
                    borderColor = '#fca5a5';
                    bgColor = '#fef2f2';
                    shadow = '0 0 0 3px rgba(252, 165, 165, 0.2), 0 4px 12px rgba(252, 165, 165, 0.1)';
                    labelColor = 'red.500';
                  }
                }
                if (showCorrectHighlight) {
                  borderColor = '#34d399';
                  bgColor = '#ecfdf5';
                  shadow = '0 0 0 3px rgba(52, 211, 153, 0.2), 0 4px 12px rgba(52, 211, 153, 0.1)';
                  labelColor = 'green.600';
                }

                return (
                  <chakra.button
                    key={index}
                    type="button"
                    onClick={() => selectChoice(index)}
                    disabled={isAnswered}
                    aria-label={`せんたくし ${index + 1}`}
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    gap={2}
                    aspectRatio="1"
                    p={5}
                    bg={bgColor}
                    border="2.5px solid"
                    borderColor={borderColor}
                    boxShadow={shadow}
                    cursor={isAnswered ? 'default' : 'pointer'}
                    transition="all 0.2s ease"
                    borderRadius="2xl"
                    _hover={
                      isAnswered
                        ? {}
                        : {
                            transform: 'translateY(-3px)',
                            boxShadow: `0 6px 20px rgba(0,0,0,0.08)`,
                            borderColor: theme.accent,
                          }
                    }
                    _active={
                      isAnswered ? {} : { transform: 'scale(0.96)' }
                    }
                    minH="44px"
                  >
                    <ChoiceDisplay
                      data={choice}
                      isSelected={isSelected}
                      isCorrect={isChoiceCorrect}
                      showResult={showResult}
                    />
                    <Text fontSize="xs" fontWeight="700" color={labelColor}>
                      {['①', '②', '③', '④'][index]}
                    </Text>
                  </chakra.button>
                );
              })}
            </SimpleGrid>
          </VStack>
        </Box>
      </VStack>

      <FeedbackOverlay
        isCorrect={isCorrect ?? false}
        visible={showFeedback}
        onNext={randomMode ? () => navigate('/random') : nextQuestion}
        onRetry={retryQuestion}
      />
    </Container>
  );
}
