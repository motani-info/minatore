import { useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Container, Flex, Text, VStack, chakra } from '@chakra-ui/react';
import { NavigationBar } from '../../../framework/components/NavigationBar';
import { FeedbackOverlay } from '../../../framework/components/FeedbackOverlay';
import { useProgress } from '../../../framework/hooks/useProgress';
import { generateCompareSpringQuestion, validateSpringMarks, getAllCompareSpringQuestions } from '../compareSpringQuestion';
import { CompareSpringQuestionDisplay } from './QuestionDisplay';
import { SpringDisplay } from './SpringDisplay';
import type { CompareSpringQuestionData, CompareSpringChoiceData, SpringMarkType } from '../types';
import type { Question } from '../../../types/question';

const THEME = {
  gradient: 'linear-gradient(135deg, #059669 0%, #34d399 100%)',
  accent: '#059669',
};

const MARK_CYCLE: SpringMarkType[] = [null, 'double-circle', 'triangle', 'cross'];
const MARK_LABELS: Record<string, string> = {
  'double-circle': '◎',
  'triangle': '△',
  'cross': '×',
};

/**
 * 比較（重さ：ばね）問題専用の問題画面
 * 各重りに◎/△/×をつける形式
 */
export const CompareSpringScreen: React.FC = () => {
  const { progress, recordAnswer } = useProgress();
  const typeProgress = progress?.byType['compare-spring'];
  const location = useLocation();
  const initialIndex = (location.state as { questionIndex?: number })?.questionIndex;

  const [question, setQuestion] = useState<Question<CompareSpringQuestionData, CompareSpringChoiceData>>(
    () => {
      if (initialIndex != null) {
        const all = getAllCompareSpringQuestions();
        if (initialIndex >= 0 && initialIndex < all.length) return all[initialIndex];
      }
      return generateCompareSpringQuestion();
    }
  );
  const [questionCount, setQuestionCount] = useState(0);
  const [marks, setMarks] = useState<SpringMarkType[]>(() =>
    question.questionData.springs.map(() => null)
  );
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const totalDone = (typeProgress?.totalQuestions ?? 0) + questionCount;
  const { heaviestIndex, secondIndex, lightestIndex } = question.choices[0];

  /** マークをサイクル: null → ◎ → △ → × → null */
  const cycleMark = useCallback((index: number) => {
    if (isAnswered) return;
    setMarks((prev) => {
      const newMarks = [...prev];
      const current = newMarks[index];
      const currentIdx = MARK_CYCLE.indexOf(current);
      newMarks[index] = MARK_CYCLE[(currentIdx + 1) % MARK_CYCLE.length];
      return newMarks;
    });
  }, [isAnswered]);

  /** 回答を確定する */
  const submitAnswer = useCallback(() => {
    if (isAnswered) return;
    const hasDC = marks.includes('double-circle');
    const hasTri = marks.includes('triangle');
    const hasCross = marks.includes('cross');
    if (!hasDC || !hasTri || !hasCross) return;

    const correct = validateSpringMarks(marks, heaviestIndex, secondIndex, lightestIndex);
    setIsAnswered(true);
    setIsCorrect(correct);
    setShowFeedback(true);
    recordAnswer('compare-spring', correct);
  }, [marks, isAnswered, heaviestIndex, secondIndex, lightestIndex, recordAnswer]);

  /** 次の問題へ */
  const handleNext = useCallback(() => {
    const newQ = generateCompareSpringQuestion();
    setQuestion(newQ);
    setMarks(newQ.questionData.springs.map(() => null));
    setIsAnswered(false);
    setIsCorrect(null);
    setShowFeedback(false);
    setQuestionCount((c) => c + 1);
  }, []);

  /** やり直し */
  const handleRetry = useCallback(() => {
    setMarks(question.questionData.springs.map(() => null));
    setIsAnswered(false);
    setIsCorrect(null);
    setShowFeedback(false);
  }, [question]);

  const canSubmit = marks.includes('double-circle') && marks.includes('triangle') && marks.includes('cross');

  return (
    <Container maxW="920px" minH="100dvh" py={0} px={0}>
      <VStack gap={0} align="stretch" minH="100dvh">

        {/* 上部 */}
        <Box
          bg={THEME.gradient}
          px={{ base: 5, sm: 6 }}
          pt={{ base: 3, sm: 5 }}
          pb={8}
          position="relative"
          overflow="hidden"
        >
          <Box position="absolute" right="-40px" top="-40px" w="160px" h="160px" bg="whiteAlpha.100" borderRadius="full" />
          <Box position="absolute" left="-20px" bottom="-20px" w="100px" h="100px" bg="whiteAlpha.100" borderRadius="full" />

          <VStack gap={5} align="stretch" position="relative" zIndex={1}>
            <NavigationBar current={totalDone} total={30} />

            <Flex
              align="center"
              justify="center"
              bg="white"
              borderRadius="3xl"
              p={{ base: 3, sm: 5 }}
              minH="200px"
              boxShadow="0 2px 12px rgba(0,0,0,0.06)"
            >
              <CompareSpringQuestionDisplay data={question.questionData} />
            </Flex>
          </VStack>
        </Box>

        {/* 下部 */}
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
                fontSize="md"
                color="gray.700"
                lineHeight="1.7"
                whiteSpace="pre-line"
                fontWeight="700"
              >
                {question.instructionText}
              </Text>
            </Box>

            {/* 回答エリア: 各ばねにマークをつける */}
            <Flex gap={2} justify="center" flexWrap="wrap">
              {question.questionData.springs.map((spring, index) => {
                const mark = marks[index];

                let borderColor = '#e5e7eb';
                let bgColor = '#fafafa';
                if (isAnswered) {
                  const isHeaviest = index === heaviestIndex;
                  const isSecond = index === secondIndex;
                  const isLightest = index === lightestIndex;
                  if ((mark === 'double-circle' && isHeaviest) ||
                      (mark === 'triangle' && isSecond) ||
                      (mark === 'cross' && isLightest)) {
                    borderColor = '#34d399';
                    bgColor = '#ecfdf5';
                  } else if (mark !== null) {
                    borderColor = '#fca5a5';
                    bgColor = '#fef2f2';
                  }
                }

                return (
                  <chakra.button
                    key={index}
                    type="button"
                    onClick={() => cycleMark(index)}
                    disabled={isAnswered}
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    gap={1}
                    p={2}
                    bg={bgColor}
                    border="2px solid"
                    borderColor={borderColor}
                    borderRadius="xl"
                    cursor={isAnswered ? 'default' : 'pointer'}
                    transition="all 0.15s"
                    _hover={isAnswered ? {} : { borderColor: THEME.accent }}
                    _active={isAnswered ? {} : { transform: 'scale(0.97)' }}
                    minW="60px"
                  >
                    <SpringDisplay spring={spring} width={50} height={120} />
                    <Flex
                      align="center"
                      justify="center"
                      w="32px"
                      h="32px"
                      borderRadius="full"
                      border="2px solid"
                      borderColor={mark ? '#1a1a1a' : '#d1d5db'}
                      bg="white"
                    >
                      <Text
                        fontSize="md"
                        fontWeight="800"
                        color={mark ? '#1a1a1a' : '#d1d5db'}
                        lineHeight="1"
                      >
                        {mark ? MARK_LABELS[mark] : '−'}
                      </Text>
                    </Flex>
                  </chakra.button>
                );
              })}
            </Flex>

            {/* 確定ボタン */}
            {!isAnswered && (
              <chakra.button
                type="button"
                onClick={submitAnswer}
                disabled={!canSubmit}
                w="100%"
                py={3.5}
                fontSize="md"
                fontWeight="700"
                color="white"
                bg={canSubmit ? THEME.gradient : 'gray.300'}
                borderRadius="xl"
                transition="all 0.15s"
                _hover={canSubmit ? { opacity: 0.9 } : {}}
                _active={canSubmit ? { transform: 'scale(0.98)' } : {}}
                minH="48px"
                cursor={canSubmit ? 'pointer' : 'default'}
                boxShadow={canSubmit ? `0 4px 12px ${THEME.accent}33` : 'none'}
              >
                こたえあわせ
              </chakra.button>
            )}
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
