import { useState, useCallback, useEffect } from 'react';
import { storageService } from '../../storage/storageService';
import type { ProgressData } from '../../storage/storageService';
import type { QuestionTypeId } from '../../types/question';

/**
 * 進捗表示フォーマット関数
 * 「〇もんせいかい / △もんちゅう」形式の文字列を返す
 */
export function formatProgress(correctAnswers: number, totalQuestions: number): string {
  return `${correctAnswers}もんせいかい / ${totalQuestions}もんちゅう`;
}

/**
 * 進捗データ管理フック
 * storageService を使用して進捗データの読み込み・更新を行う
 */
export function useProgress() {
  const [progress, setProgress] = useState<ProgressData>(() =>
    storageService.loadProgress()
  );

  // 初回マウント時に進捗データを読み込む
  useEffect(() => {
    setProgress(storageService.loadProgress());
  }, []);

  /** 回答結果を記録する */
  const recordAnswer = useCallback((typeId: QuestionTypeId, isCorrect: boolean) => {
    storageService.recordAnswer(typeId, isCorrect);
    setProgress(storageService.loadProgress());
  }, []);

  /** 全体の累計進捗を取得する */
  const totalProgress = storageService.getTotalProgress(progress);

  /** フォーマット済みの進捗テキストを取得する */
  const formattedTotal = formatProgress(
    totalProgress.correctAnswers,
    totalProgress.totalQuestions
  );

  /** 進捗データをリロードする */
  const reload = useCallback(() => {
    setProgress(storageService.loadProgress());
  }, []);

  return {
    progress,
    totalProgress,
    formattedTotal,
    recordAnswer,
    reload,
  };
}
