import { useState, useCallback } from 'react';
import { Box, Flex, Text, VStack, chakra } from '@chakra-ui/react';
import type { AreaCompareQuestionData, AreaCompareChoiceData, MarkType } from '../types';
import { validateAreaMarks } from '../areaCompareQuestion';
import { useProgress } from '../../../framework/hooks/useProgress';
import { FeedbackOverlay } from '../../../framework/components/FeedbackOverlay';
import { AreaGridDisplay } from './AreaGridDisplay';

interface AreaCompareAnswerUIProps {
  questionData: AreaCompareQuestionData;
  choiceData: AreaCompareChoiceData;
  onCorrect: () => void;
  onNext: () => void;
  onRetry: () => void;
}

/**
 * 広さ比較問題の回答UIコンポーネント
 * 各グリッドに○/×をつける形式
 */
export const AreaCompareAnswerUI: React.FC<AreaCompareAnswerUIProps> = ({
  questionData,
  choiceData,
  onCorrect,
  onNext,
  onRetry,
}) => {
  const { items } = questionData;
  const { mostIndex, leastIndex } = choiceData;
  const { recordAnswer } = useProgress();

  const [marks, setMarks] = useState<MarkType[]>(() => items.map(() => null));
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

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

  const submitAnswer = useCallback(() => {
    if (isAnswered) return;
    if (!marks.includes('circle') || !marks.includes('cross')) return;

    const correct = validateAreaMarks(marks, mostIndex, leastIndex);
    setIsAnswered(true);
    setIsCorrect(correct);
    setShowFeedback(true);
    recordAnswer('area-compare', correct);
    if (correct) onCorrect();
  }, [marks, isAnswered, mostIndex, leastIndex, recordAnswer, onCorrect]);

  const handleNext = useCallback(() => {
    setShowFeedback(false);
    setMarks(items.map(() => null));
    setIsAnswered(false);
    setIsCorrect(null);
    onNext();
  }, [onNext, items]);

  const handleRetry = useCallback(() => {
    setShowFeedback(false);
    setMarks(items.map(() => null));
    setIsAnswered(false);
    setIsCorrect(null);
    onRetry();
  }, [onRetry, items]);

  const canSubmit = marks.includes('circle') && marks.includes('cross');

  return (
    <>
      <VStack gap={4} align="stretch">
        <Flex justify="center" gap={{ base: 3, sm: 5 }} wrap="wrap">
          {items.map((item, index) => {
            const mark = marks[index];
            const isMost = isAnswered && index === mostIndex;
            const isLeast = isAnswered && index === leastIndex;

            let borderColor = '#e5e7eb';
            let bgColor = '#fafafa';

            if (isAnswered) {
              if (isMost && mark === 'circle') {
                borderColor = '#34d399'; bgColor = '#ecfdf5';
              } else if (isLeast && mark === 'cross') {
                borderColor = '#34d399'; bgColor = '#ecfdf5';
              } else if (mark !== null) {
                borderColor = '#fca5a5'; bgColor = '#fef2f2';
              }
              if (isMost && mark !== 'circle') {
                borderColor = '#34d399'; bgColor = '#ecfdf5';
              }
              if (isLeast && mark !== 'cross') {
                borderColor = '#34d399'; bgColor = '#ecfdf5';
              }
            }

            return (
              <VStack key={index} gap={2}>
                <chakra.button
                  type="button"
                  onClick={() => cycleMark(index)}
                  disabled={isAnswered}
                  aria-label={`${item.name}にしるしをつける`}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  w={{ base: '90px', sm: '100px' }}
                  h={{ base: '90px', sm: '100px' }}
                  bg={bgColor}
                  border="2.5px solid"
                  borderColor={borderColor}
                  borderRadius="2xl"
                  cursor={isAnswered ? 'default' : 'pointer'}
                  transition="all 0.2s ease"
                  _hover={isAnswered ? {} : { transform: 'scale(1.05)', borderColor: '#a78bfa' }}
                  _active={isAnswered ? {} : { transform: 'scale(0.95)' }}
                  position="relative"
                >
                  <AreaGridDisplay grid={item.grid} size={65} />

                  {mark && (
                    <Box
                      position="absolute"
                      top="-6px"
                      right="-6px"
                      w="32px"
                      h="32px"
                      borderRadius="full"
                      bg={mark === 'circle' ? '#dcfce7' : '#fee2e2'}
                      border="2px solid"
                      borderColor={mark === 'circle' ? '#34d399' : '#f87171'}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Text
                        fontSize="18px"
                        fontWeight="800"
                        color={mark === 'circle' ? '#16a34a' : '#dc2626'}
                        lineHeight="1"
                      >
                        {mark === 'circle' ? '○' : '×'}
                      </Text>
                    </Box>
                  )}

                  {isAnswered && !isCorrect && isMost && mark !== 'circle' && (
                    <Box position="absolute" bottom="-8px" left="50%" transform="translateX(-50%)" bg="#dcfce7" borderRadius="full" px={2} py={0.5}>
                      <Text fontSize="10px" fontWeight="700" color="#16a34a">○</Text>
                    </Box>
                  )}
                  {isAnswered && !isCorrect && isLeast && mark !== 'cross' && (
                    <Box position="absolute" bottom="-8px" left="50%" transform="translateX(-50%)" bg="#fee2e2" borderRadius="full" px={2} py={0.5}>
                      <Text fontSize="10px" fontWeight="700" color="#dc2626">×</Text>
                    </Box>
                  )}
                </chakra.button>

                <Text fontSize="xs" fontWeight="600" color="gray.600">
                  {item.name}
                </Text>
              </VStack>
            );
          })}
        </Flex>

        <Flex justify="center" gap={4}>
          <Flex align="center" gap={1}>
            <Text fontSize="sm" fontWeight="700" color="#16a34a">○</Text>
            <Text fontSize="xs" color="gray.500">いちばんひろい</Text>
          </Flex>
          <Flex align="center" gap={1}>
            <Text fontSize="sm" fontWeight="700" color="#dc2626">×</Text>
            <Text fontSize="xs" color="gray.500">いちばんせまい</Text>
          </Flex>
        </Flex>

        {!isAnswered && (
          <Text fontSize="xs" color="gray.400" textAlign="center">
            タップでしるしをかえられます（○→×→なし）
          </Text>
        )}

        {!isAnswered && (
          <Flex justify="center">
            <chakra.button
              type="button"
              onClick={submitAnswer}
              disabled={!canSubmit}
              py={3}
              px={8}
              fontSize="md"
              fontWeight="700"
              color="white"
              bg={canSubmit ? 'linear-gradient(135deg, #7c3aed, #a78bfa)' : 'gray.300'}
              borderRadius="xl"
              transition="all 0.15s"
              _hover={canSubmit ? { opacity: 0.9 } : {}}
              _active={canSubmit ? { transform: 'scale(0.98)' } : {}}
              minH="48px"
              cursor={canSubmit ? 'pointer' : 'not-allowed'}
              boxShadow={canSubmit ? '0 4px 12px rgba(124, 58, 237, 0.3)' : 'none'}
            >
              こたえあわせ
            </chakra.button>
          </Flex>
        )}
      </VStack>

      <FeedbackOverlay
        isCorrect={isCorrect ?? false}
        visible={showFeedback}
        onNext={handleNext}
        onRetry={handleRetry}
      />
    </>
  );
};
