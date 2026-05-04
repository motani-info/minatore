import { useState, useCallback } from 'react';
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

  /** 選択肢をタップした時の処理 */
  const selectChoice = useCallback(
    (index: ChoiceIndex) => {
      // フィードバック表示中は選択肢の再タップを無効にする
      if (state.phase !== 'answering') return;

      const isCorrect = questionType.checkAnswer(state.currentQuestion, index);

      setState((prev) => ({
        ...prev,
        selectedIndex: index,
        isAnswered: true,
        isCorrect,
        phase: 'feedback',
      }));

      // 進捗を記録する
      recordAnswer(questionType.id, isCorrect);
    },
    [state.phase, state.currentQuestion, questionType, recordAnswer]
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
