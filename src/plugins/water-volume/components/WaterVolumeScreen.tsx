import { useState, useCallback } from 'react';
import { Box, Container, Flex, Text, VStack } from '@chakra-ui/react';
import { NavigationBar } from '../../../framework/components/NavigationBar';
import { useProgress } from '../../../framework/hooks/useProgress';
import { generateWaterVolumeQuestion } from '../waterVolumeQuestion';
import { WaterVolumeQuestionDisplay } from './QuestionDisplay';
import { WaterVolumeAnswerUI } from './AnswerUI';
import type { WaterVolumeQuestionData, WaterVolumeChoiceData } from '../types';
import type { Question } from '../../../types/question';

const THEME = {
  gradient: 'linear-gradient(135deg, #2563eb 0%, #60a5fa 100%)',
};

/**
 * 水量比較問題専用の問題画面
 * シーソー問題と同じ「○/×マーク方式」を使用する
 */
export const WaterVolumeScreen: React.FC = () => {
  const { progress } = useProgress();
  const typeProgress = progress?.byType['water-volume'];

  const [question, setQuestion] = useState<Question<WaterVolumeQuestionData, WaterVolumeChoiceData>>(
    () => generateWaterVolumeQuestion(),
  );
  const [questionCount, setQuestionCount] = useState(0);

  const totalDone = (typeProgress?.totalQuestions ?? 0) + questionCount;

  const handleNext = useCallback(() => {
    setQuestion(generateWaterVolumeQuestion());
    setQuestionCount((c) => c + 1);
  }, []);

  const handleRetry = useCallback(() => {
    // 同じ問題をやり直す（stateリセットはAnswerUI内で行う）
  }, []);

  const handleCorrect = useCallback(() => {
    // 正解時の追加処理
  }, []);

  return (
    <Container maxW="920px" minH="100dvh" py={0} px={0}>
      <VStack gap={0} align="stretch" minH="100dvh">

        {/* 上部: グラデーション背景エリア */}
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

            {/* 問題表示エリア */}
            <Flex
              align="center"
              justify="center"
              bg="white"
              borderRadius="3xl"
              p={{ base: 4, sm: 6 }}
              minH="160px"
              boxShadow="0 2px 12px rgba(0,0,0,0.06)"
            >
              <WaterVolumeQuestionDisplay data={question.questionData} />
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

            {/* 回答UI */}
            <WaterVolumeAnswerUI
              key={`${totalDone}-${questionCount}`}
              questionData={question.questionData}
              choiceData={question.choices[0]}
              onCorrect={handleCorrect}
              onNext={handleNext}
              onRetry={handleRetry}
            />
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};
