import { useState, useCallback, useRef } from 'react';
import type { Question, QuestionType, ChoiceIndex } from '../../types/question';
import { useProgress } from './useProgress';
import { useLevel } from './useLevel';

/** 問題画面の状態フェーズ */
type FlowPhase = 'answering' | 'judging' | 'feedback';

/** 問題画面の状態 */
export interface QuestionFlowState {
  /** 現在の問題 */
  currentQuestion: Question;
  /** 選択された選択肢のインデックス（未選択はnull） */
  selectedIndex: ChoiceIndex | null;
  /** 回答済みかどうか */
  isAnswered: boolean;
  /** 正解かどうか（回答後に設定） */
  isCorrect: boolean | null;
  /** 現在のフェーズ */
  phase: FlowPhase;
  /** 現在の問題インデックス（0始まり） */
  currentQuestionIndex: number;
}

/**
 * 問題出題フロー管理フック
 * 問題を番号順に出題し、選択肢選択、回答判定、フィードバック表示、次の問題への遷移を管理する
 */
export function useQuestionFlow(questionType: QuestionType, initialQuestion?: Question, initialIndex?: number) {
  const { recordAnswer } = useProgress();
  const { rewardCorrect, rewardWrong } = useLevel();

  // 全問題リストを取得（getAllQuestionsがあればそれを使う）
  const allQuestions = useRef<Question[]>(
    questionType.getAllQuestions ? questionType.getAllQuestions() : []
  );

  const [state, setState] = useState<QuestionFlowState>(() => {
    const startIndex = initialIndex ?? 0;
    const question = initialQuestion
      ?? (allQuestions.current.length > 0 ? allQuestions.current[startIndex] : questionType.generateQuestion());
    return {
      currentQuestion: question,
      selectedIndex: null,
      isAnswered: false,
      isCorrect: null,
      phase: 'answering',
      currentQuestionIndex: startIndex,
    };
  });

  // refで二重タップ防止（stateの更新が反映される前の連打を防ぐ）
  const isProcessingRef = useRef(false);

  /** 選択肢をタップした時の処理 */
  const selectChoice = useCallback(
    (index: ChoiceIndex) => {
      // 二重タップ防止
      if (isProcessingRef.current) return;

      setState((prev) => {
        // フィードバック表示中や既に回答済みの場合は無視
        if (prev.phase !== 'answering' || prev.isAnswered) return prev;

        isProcessingRef.current = true;

        const isCorrect = questionType.checkAnswer(prev.currentQuestion, index);

        // 進捗を記録する
        recordAnswer(questionType.id, isCorrect);

        // 経験値を付与する
        if (isCorrect) {
          rewardCorrect();
        } else {
          rewardWrong();
        }

        return {
          ...prev,
          selectedIndex: index,
          isAnswered: true,
          isCorrect,
          phase: 'feedback',
        };
      });

      // 次のイベントループで処理フラグをリセット
      setTimeout(() => {
        isProcessingRef.current = false;
      }, 300);
    },
    [questionType, recordAnswer, rewardCorrect, rewardWrong]
  );

  /** 次の問題へ遷移する（番号順） */
  const nextQuestion = useCallback(() => {
    setState((prev) => {
      const nextIndex = prev.currentQuestionIndex + 1;
      const questions = allQuestions.current;
      // 全問題リストがある場合は次の問題を取得（末尾に達したら先頭に戻る）
      const question = questions.length > 0
        ? questions[nextIndex % questions.length]
        : questionType.generateQuestion();
      return {
        currentQuestion: question,
        selectedIndex: null,
        isAnswered: false,
        isCorrect: null,
        phase: 'answering',
        currentQuestionIndex: nextIndex < questions.length ? nextIndex : nextIndex % questions.length,
      };
    });
  }, [questionType]);

  /** 同じ問題をやり直す */
  const retryQuestion = useCallback(() => {
    setState((prev) => ({
      ...prev,
      selectedIndex: null,
      isAnswered: false,
      isCorrect: null,
      phase: 'answering',
    }));
  }, []);

  /** 全問題数 */
  const totalQuestions = allQuestions.current.length;

  /** 最後の問題かどうか */
  const isLastQuestion = totalQuestions > 0 && state.currentQuestionIndex >= totalQuestions - 1;

  return {
    ...state,
    selectChoice,
    nextQuestion,
    retryQuestion,
    totalQuestions,
    isLastQuestion,
  };
}
