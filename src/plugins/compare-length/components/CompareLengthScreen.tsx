import { useState, useCallback } from 'react';
import { Box, Container, Flex, Text, VStack, chakra } from '@chakra-ui/react';
import { NavigationBar } from '../../../framework/components/NavigationBar';
import { FeedbackOverlay } from '../../../framework/components/FeedbackOverlay';
import { useProgress } from '../../../framework/hooks/useProgress';
import { generateCompareLengthQuestion, validateLengthMarks } from '../compareLengthQuestion';
import { CompareLengthQuestionDisplay } from './QuestionDisplay';
import { LineDisplay } from './LineDisplay';
import type { CompareLengthQuestionData, CompareLengthChoiceData, LengthMarkType } from '../types';
import type { Question } from '../../../types/question';

const THEME = {
  gradient: 'linear-gradient(135deg, #0d9488 0%, #5eead4 100%)',
  accent: '#0d9488',
};

/**
 * 比較（長さ）問題専用の問題画面
 * 各線に○/×をつける形式
 */
export const CompareLengthScreen: React.FC = () => {
  const { progress, recordAnswer } = useProgress();
  const typeProgress = progress?.byType['compare-length'];

  const [question, setQuestion] = useState<Question<CompareLengthQuestionData, CompareLengthChoiceData>>(
    () => generateCompareLengthQuestion()
  );
  const [questionCount, setQuestionCount] = useState(0);
  const [marks, setMarks] = useState<LengthMarkType[]>(() =>
    question.questionData.lines.map(() => null)
  );
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const totalDone = (typeProgress?.totalQuestions ?? 0) + questionCount;
  const { longestIndex, shortestIndex } = question.choices[0];

  /** マークをサイクル: null → ○ → × → null */
  const cycleMark = useCallback((index: number) => {
    if (isAnswered) return;
    setMarks((prev) => {
      const newMarks = [...prev];
      const current = newMarks[index];
      if (current === null) newMarks[index] = 'circle';
      else if (current === 'circle') newMarks[index] = 'cross';
      else newMarks[index] = null;
      return newMarks;
    });
  }, [isAnswered]);

  /** 回答を確定する */
  const submitAnswer = useCallback(() => {
    if (isAnswered) return;
    const hasCircle = marks.includes('circle');
    const hasCross = marks.includes('cross');
    if (!hasCircle || !hasCross) return;

    const correct = validateLengthMarks(marks, longestIndex, shortestIndex);
    setIsAnswered(true);
    setIsCorrect(correct);
    setShowFeedback(true);
    recordAnswer('compare-length', correct);
  }, [marks, isAnswered, longestIndex, shortestIndex, recordAnswer]);

  /** 次の問題へ */
  const handleNext = useCallback(() => {
    const newQ = generateCompareLengthQuestion();
    setQuestion(newQ);
    setMarks(newQ.questionData.lines.map(() => null));
    setIsAnswered(false);
    setIsCorrect(null);
    setShowFeedback(false);
    setQuestionCount((c) => c + 1);
  }, []);

  /** やり直し */
  const handleRetry = useCallback(() => {
    setMarks(question.questionData.lines.map(() => null));
    setIsAnswered(false);
    setIsCorrect(null);
    setShowFeedback(false);
  }, [question]);

  const canSubmit = marks.includes('circle') && marks.includes('cross');

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
              minH="160px"
              boxShadow="0 2px 12px rgba(0,0,0,0.06)"
            >
              <CompareLengthQuestionDisplay data={question.questionData} />
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
                fontSize="lg"
                color="gray.700"
                lineHeight="1.7"
                whiteSpace="pre-line"
                fontWeight="700"
              >
                {question.instructionText}
              </Text>
            </Box>

            {/* 回答エリア: 各線にマークをつける */}
            <VStack gap={3} align="stretch">
              {question.questionData.lines.map((line, index) => {
                const mark = marks[index];
                const isLongest = index === longestIndex;
                const isShortest = index === shortestIndex;

                let borderColor = '#e5e7eb';
                let bgColor = '#fafafa';
                if (isAnswered) {
                  if (mark === 'circle' && isLongest) {
                    borderColor = '#34d399';
                    bgColor = '#ecfdf5';
                  } else if (mark === 'cross' && isShortest) {
                    borderColor = '#34d399';
                    bgColor = '#ecfdf5';
                  } else if (mark !== null) {
                    borderColor = '#fca5a5';
                    bgColor = '#fef2f2';
                  }
                  // 正解位置をハイライト
                  if (!isCorrect && isLongest) {
                    borderColor = '#34d399';
                  }
                  if (!isCorrect && isShortest) {
                    borderColor = '#34d399';
                  }
                }

                return (
                  <chakra.button
                    key={index}
                    type="button"
                    onClick={() => cycleMark(index)}
                    disabled={isAnswered}
                    display="flex"
                    alignItems="center"
                    gap={3}
                    p={3}
                    bg={bgColor}
                    border="2px solid"
                    borderColor={borderColor}
                    borderRadius="xl"
                    cursor={isAnswered ? 'default' : 'pointer'}
                    transition="all 0.15s"
                    _hover={isAnswered ? {} : { borderColor: THEME.accent }}
                    _active={isAnswered ? {} : { transform: 'scale(0.98)' }}
                    minH="44px"
                    w="100%"
                  >
                    {/* マーク表示 */}
                    <Flex
                      align="center"
                      justify="center"
                      w="36px"
                      h="36px"
                      borderRadius="full"
                      border="2px solid"
                      borderColor={mark ? '#1a1a1a' : '#d1d5db'}
                      bg={mark === 'circle' ? '#ecfdf5' : mark === 'cross' ? '#fef2f2' : 'white'}
                      flexShrink={0}
                    >
                      <Text
                        fontSize="lg"
                        fontWeight="800"
                        color={mark === 'circle' ? '#059669' : mark === 'cross' ? '#dc2626' : '#d1d5db'}
                        lineHeight="1"
                      >
                        {mark === 'circle' ? '○' : mark === 'cross' ? '×' : '−'}
                      </Text>
                    </Flex>

                    {/* 線の表示 */}
                    <Box flex={1} overflow="hidden">
                      <LineDisplay line={line} width={240} />
                    </Box>
                  </chakra.button>
                );
              })}
            </VStack>

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
