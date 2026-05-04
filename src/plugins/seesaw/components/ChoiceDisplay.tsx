import { useState, useCallback } from 'react';
import { Box, Flex, Text, VStack, chakra } from '@chakra-ui/react';
import type { SeesawQuestionData, SeesawChoiceData, MarkType } from '../types';
import { validateMarks } from '../seesawQuestion';
import { useProgress } from '../../../framework/hooks/useProgress';
import { FeedbackOverlay } from '../../../framework/components/FeedbackOverlay';

interface SeesawAnswerUIProps {
  questionData: SeesawQuestionData;
  choiceData: SeesawChoiceData;
  onCorrect: () => void;
  onNext: () => void;
  onRetry: () => void;
}

/**
 * シーソー問題の回答UIコンポーネント
 * 各アイテムに○/×をつける形式
 * タップで null → ○ → × → null とサイクルする
 */
export const SeesawAnswerUI: React.FC<SeesawAnswerUIProps> = ({
  questionData,
  choiceData,
  onCorrect,
  onNext,
  onRetry,
}) => {
  const { items } = questionData;
  const { heaviestIndex, lightestIndex } = choiceData;
  const { recordAnswer } = useProgress();

  const [marks, setMarks] = useState<[MarkType, MarkType, MarkType]>([null, null, null]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  /** マークをサイクルする: null → ○ → × → null */
  const cycleMark = useCallback((index: number) => {
    if (isAnswered) return;

    setMarks((prev) => {
      const newMarks = [...prev] as [MarkType, MarkType, MarkType];
      const current = newMarks[index];
      if (current === null) {
        newMarks[index] = 'circle';
      } else if (current === 'circle') {
        newMarks[index] = 'cross';
      } else {
        newMarks[index] = null;
      }
      return newMarks;
    });
  }, [isAnswered]);

  /** 回答を確定する */
  const submitAnswer = useCallback(() => {
    if (isAnswered) return;

    // ○と×が1つずつあるか確認
    const hasCircle = marks.includes('circle');
    const hasCross = marks.includes('cross');
    if (!hasCircle || !hasCross) return;

    const correct = validateMarks(marks, heaviestIndex, lightestIndex);
    setIsAnswered(true);
    setIsCorrect(correct);
    setShowFeedback(true);

    // 進捗を記録
    recordAnswer('seesaw', correct);

    if (correct) {
      onCorrect();
    }
  }, [marks, isAnswered, heaviestIndex, lightestIndex, recordAnswer, onCorrect]);

  /** 次の問題へ */
  const handleNext = useCallback(() => {
    setShowFeedback(false);
    setMarks([null, null, null]);
    setIsAnswered(false);
    setIsCorrect(null);
    onNext();
  }, [onNext]);

  /** やり直し */
  const handleRetry = useCallback(() => {
    setShowFeedback(false);
    setMarks([null, null, null]);
    setIsAnswered(false);
    setIsCorrect(null);
    onRetry();
  }, [onRetry]);

  // ○と×が1つずつあるか（提出可能か）
  const canSubmit = marks.includes('circle') && marks.includes('cross');

  return (
    <>
      <VStack gap={4} align="stretch">
        {/* アイテム一覧（マーク付き） */}
        <Flex justify="center" gap={{ base: 4, sm: 6 }} wrap="wrap">
          {items.map((item, index) => {
            const mark = marks[index];
            const isHeaviest = isAnswered && index === heaviestIndex;
            const isLightest = isAnswered && index === lightestIndex;

            let borderColor = '#e5e7eb';
            let bgColor = '#fafafa';

            if (isAnswered) {
              if (isHeaviest && mark === 'circle') {
                borderColor = '#34d399';
                bgColor = '#ecfdf5';
              } else if (isLightest && mark === 'cross') {
                borderColor = '#34d399';
                bgColor = '#ecfdf5';
              } else if (mark !== null) {
                // 間違ったマーク
                borderColor = '#fca5a5';
                bgColor = '#fef2f2';
              }
              // 正解のハイライト（マークが間違っている場合）
              if (isHeaviest && mark !== 'circle') {
                borderColor = '#34d399';
                bgColor = '#ecfdf5';
              }
              if (isLightest && mark !== 'cross') {
                borderColor = '#34d399';
                bgColor = '#ecfdf5';
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
                  flexDirection="column"
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
                  {/* 絵文字 */}
                  <Text fontSize="36px" lineHeight="1">
                    {item.emoji}
                  </Text>

                  {/* マーク表示 */}
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

                  {/* 正解表示（不正解時） */}
                  {isAnswered && !isCorrect && isHeaviest && mark !== 'circle' && (
                    <Box
                      position="absolute"
                      bottom="-8px"
                      left="50%"
                      transform="translateX(-50%)"
                      bg="#dcfce7"
                      borderRadius="full"
                      px={2}
                      py={0.5}
                    >
                      <Text fontSize="10px" fontWeight="700" color="#16a34a">
                        ○
                      </Text>
                    </Box>
                  )}
                  {isAnswered && !isCorrect && isLightest && mark !== 'cross' && (
                    <Box
                      position="absolute"
                      bottom="-8px"
                      left="50%"
                      transform="translateX(-50%)"
                      bg="#fee2e2"
                      borderRadius="full"
                      px={2}
                      py={0.5}
                    >
                      <Text fontSize="10px" fontWeight="700" color="#dc2626">
                        ×
                      </Text>
                    </Box>
                  )}
                </chakra.button>

                {/* アイテム名 */}
                <Text fontSize="xs" fontWeight="600" color="gray.600">
                  {item.name}
                </Text>
              </VStack>
            );
          })}
        </Flex>

        {/* 凡例 */}
        <Flex justify="center" gap={4}>
          <Flex align="center" gap={1}>
            <Text fontSize="sm" fontWeight="700" color="#16a34a">○</Text>
            <Text fontSize="xs" color="gray.500">いちばんおもい</Text>
          </Flex>
          <Flex align="center" gap={1}>
            <Text fontSize="sm" fontWeight="700" color="#dc2626">×</Text>
            <Text fontSize="xs" color="gray.500">いちばんかるい</Text>
          </Flex>
        </Flex>

        {/* 操作説明 */}
        {!isAnswered && (
          <Text fontSize="xs" color="gray.400" textAlign="center">
            タップでしるしをかえられます（○→×→なし）
          </Text>
        )}

        {/* 回答ボタン */}
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
              bg={canSubmit
                ? 'linear-gradient(135deg, #7c6cf0, #9b8afb)'
                : 'gray.300'}
              borderRadius="xl"
              transition="all 0.15s"
              _hover={canSubmit ? { opacity: 0.9 } : {}}
              _active={canSubmit ? { transform: 'scale(0.98)' } : {}}
              minH="48px"
              cursor={canSubmit ? 'pointer' : 'not-allowed'}
              boxShadow={canSubmit ? '0 4px 12px rgba(124, 108, 240, 0.3)' : 'none'}
            >
              こたえあわせ
            </chakra.button>
          </Flex>
        )}
      </VStack>

      {/* フィードバックオーバーレイ */}
      <FeedbackOverlay
        isCorrect={isCorrect ?? false}
        visible={showFeedback}
        onNext={handleNext}
        onRetry={handleRetry}
      />
    </>
  );
};

/**
 * QuestionType.ChoiceDisplay 互換のダミーコンポーネント
 * この問題タイプでは共通の選択肢UIを使わないため、空を返す
 */
export const SeesawChoiceDisplay: React.FC<{
  data: SeesawChoiceData;
  isSelected: boolean;
  isCorrect: boolean;
  showResult: boolean;
}> = () => {
  return null;
};
