import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Flex, SimpleGrid, Text, VStack, chakra } from '@chakra-ui/react';
import { registry } from '../../registry/questionTypeRegistry';
import { useProgress } from '../hooks/useProgress';
import type { Question, QuestionType } from '../../types/question';
import { FeedbackOverlay } from './FeedbackOverlay';
import { R } from './Ruby';

const TOTAL_QUESTIONS = 10;

interface RandomQuestion {
  questionType: QuestionType;
  question: Question;
}

/** 実装済みの問題タイプからランダムに10問を生成する */
function generateRandomQuestions(): RandomQuestion[] {
  const allTypes = registry.getAll();
  if (allTypes.length === 0) return [];

  const questions: RandomQuestion[] = [];
  for (let i = 0; i < TOTAL_QUESTIONS; i++) {
    const randomType = allTypes[Math.floor(Math.random() * allTypes.length)];
    questions.push({
      questionType: randomType,
      question: randomType.generateQuestion(),
    });
  }
  return questions;
}

type Phase = 'answering' | 'feedback' | 'result';

export const RandomQuizScreen: React.FC = () => {
  const navigate = useNavigate();
  const { recordAnswer } = useProgress();

  const [questions, setQuestions] = useState<RandomQuestion[]>(() => generateRandomQuestions());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [phase, setPhase] = useState<Phase>('answering');
  const [results, setResults] = useState<boolean[]>([]);

  const current = questions[currentIndex];
  const isLastQuestion = currentIndex >= TOTAL_QUESTIONS - 1;

  const correctCount = useMemo(() => results.filter(Boolean).length, [results]);

  const handleSelect = useCallback(
    (index: number) => {
      if (phase !== 'answering' || !current) return;

      const correct = current.questionType.checkAnswer(current.question, index);
      setSelectedIndex(index);
      setIsCorrect(correct);
      setPhase('feedback');
      recordAnswer(current.questionType.id, correct);
      setResults((prev) => [...prev, correct]);
    },
    [phase, current, recordAnswer]
  );

  const handleNext = useCallback(() => {
    if (isLastQuestion) {
      setPhase('result');
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedIndex(null);
      setIsCorrect(null);
      setPhase('answering');
    }
  }, [isLastQuestion]);

  const handleRetry = useCallback(() => {
    setSelectedIndex(null);
    setIsCorrect(null);
    setPhase('answering');
    // Remove last result since we're retrying
    setResults((prev) => prev.slice(0, -1));
  }, []);

  const handleRestart = useCallback(() => {
    setQuestions(generateRandomQuestions());
    setCurrentIndex(0);
    setSelectedIndex(null);
    setIsCorrect(null);
    setPhase('answering');
    setResults([]);
  }, []);

  if (!current && phase !== 'result') {
    return null;
  }

  // 結果画面
  if (phase === 'result') {
    const percent = Math.round((correctCount / TOTAL_QUESTIONS) * 100);
    let message = 'がんばりました！';
    let emoji = '👏';
    if (percent >= 80) {
      message = 'すごい！';
      emoji = '🎉';
    } else if (percent >= 60) {
      message = 'よくできました！';
      emoji = '😊';
    }

    return (
      <Container maxW="920px" minH="100dvh" py={0} px={0}>
        <VStack gap={0} align="stretch" minH="100dvh">
          {/* ヘッダー */}
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
              <Text fontSize="md" fontWeight="700" color="white">
                <R rt="けっか">結果</R>
              </Text>
            </Flex>
          </Box>

          {/* 結果コンテンツ */}
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
              <Text fontSize="60px" lineHeight="1">{emoji}</Text>
              <Text fontSize="2xl" fontWeight="800" color="gray.800">
                {message}
              </Text>

              <Box
                bg="linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)"
                borderRadius="2xl"
                p={6}
                w="100%"
                textAlign="center"
              >
                <Text fontSize="sm" color="gray.500" fontWeight="600">
                  <R rt="せいかい">正解</R>数
                </Text>
                <Flex align="baseline" justify="center" gap={1} mt={2}>
                  <Text fontSize="4xl" fontWeight="800" color="#f97316">
                    {correctCount}
                  </Text>
                  <Text fontSize="lg" fontWeight="700" color="gray.400">
                    / {TOTAL_QUESTIONS}
                  </Text>
                </Flex>
                <Text fontSize="sm" color="gray.400" mt={1}>
                  <R rt="せいかい">正解</R>りつ {percent}%
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
                  onClick={() => navigate('/')}
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

  // 問題画面
  const { questionType, question } = current;
  const { QuestionDisplay, ChoiceDisplay } = questionType;
  const showFeedback = phase === 'feedback' && isCorrect !== null;
  const isAnswered = selectedIndex !== null;

  return (
    <Container maxW="920px" minH="100dvh" py={0} px={0}>
      <VStack gap={0} align="stretch" minH="100dvh">
        {/* 上部: グラデーション背景エリア */}
        <Box
          bg="linear-gradient(135deg, #f97316 0%, #fb923c 50%, #fbbf24 100%)"
          px={{ base: 5, sm: 6 }}
          pt={{ base: 4, sm: 6 }}
          pb={10}
          position="relative"
          overflow="hidden"
        >
          <Box position="absolute" right="-40px" top="-40px" w="160px" h="160px" bg="whiteAlpha.100" borderRadius="full" />
          <Box position="absolute" left="-20px" bottom="-20px" w="100px" h="100px" bg="whiteAlpha.100" borderRadius="full" />

          <VStack gap={5} align="stretch" position="relative" zIndex={1}>
            {/* ナビゲーション */}
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

            {/* 問題表示エリア */}
            <Flex
              align="center"
              justify="center"
              bg="white"
              borderRadius="3xl"
              p={{ base: 8, sm: 10 }}
              minH="200px"
              boxShadow="0 2px 12px rgba(0,0,0,0.06)"
            >
              <QuestionDisplay data={question.questionData} />
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
                {question.instructionText}
              </Text>
            </Box>

            {/* 選択肢エリア */}
            <SimpleGrid columns={2} gap={3}>
              {question.choices.map((choice, index) => {
                const isSelected = selectedIndex === index;
                const isChoiceCorrect = index === question.correctIndex;
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
                    onClick={() => handleSelect(index)}
                    disabled={isAnswered}
                    aria-label={`せんたくし ${index + 1}`}
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    gap={2}
                    aspectRatio="1"
                    p={4}
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
                            boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
                            borderColor: '#f97316',
                          }
                    }
                    _active={isAnswered ? {} : { transform: 'scale(0.96)' }}
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
        onNext={handleNext}
        onRetry={handleRetry}
      />
    </Container>
  );
};
