import { useState, useCallback, useRef } from 'react';
import type { Question, QuestionType, ChoiceIndex } from '../../types/question';
import { useProgress } from './useProgress';

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
}

/**
 * 問題出題フロー管理フック
 * 問題生成、選択肢選択、回答判定、フィードバック表示、次の問題への遷移を管理する
 */
export function useQuestionFlow(questionType: QuestionType, initialQuestion?: Question) {
  const { recordAnswer } = useProgress();

  const [state, setState] = useState<QuestionFlowState>(() => ({
    currentQuestion: initialQuestion ?? questionType.generateQuestion(),
    selectedIndex: null,
    isAnswered: false,
    isCorrect: null,
    phase: 'answering',
  }));

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
    [questionType, recordAnswer]
  );

  /** 次の問題へ遷移する */
  const nextQuestion = useCallback(() => {
    setState({
      currentQuestion: questionType.generateQuestion(),
      selectedIndex: null,
      isAnswered: false,
      isCorrect: null,
      phase: 'answering',
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

  return {
    ...state,
    selectChoice,
    nextQuestion,
    retryQuestion,
  };
}
