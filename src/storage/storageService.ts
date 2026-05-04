import type { QuestionTypeId } from '../types/question';

/** 問題タイプごとの進捗データ */
export interface TypeProgress {
  /** 累計問題数 */
  totalQuestions: number;
  /** 累計正答数 */
  correctAnswers: number;
}

/** 進捗データ全体 */
export interface ProgressData {
  /** 問題タイプごとの進捗 */
  byType: Record<QuestionTypeId, TypeProgress>;
  /** 最終更新日時 */
  lastUpdated: string;
}

/**
 * localStorage を使用した進捗データの永続化サービス。
 *
 * エラーハンドリング方針:
 * - localStorage 未対応 → 進捗保存なしで動作継続
 * - localStorage 容量超過 → 保存失敗を無視し継続
 * - データ破損・JSON解析エラー → 初期状態にリセット
 */
export class StorageService {
  private readonly STORAGE_KEY = 'exam-app-progress';

  /** 初期状態の進捗データを返す */
  private getInitialProgress(): ProgressData {
    return {
      byType: {},
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * 読み込んだデータが有効な ProgressData かどうかを検証する。
   * 破損データや不正な構造を検出して初期状態にフォールバックするために使用する。
   */
  private validateProgressData(data: unknown): data is ProgressData {
    if (data === null || typeof data !== 'object') return false;

    const obj = data as Record<string, unknown>;

    if (typeof obj.lastUpdated !== 'string') return false;
    if (obj.byType === null || typeof obj.byType !== 'object') return false;

    const byType = obj.byType as Record<string, unknown>;
    for (const key of Object.keys(byType)) {
      const entry = byType[key];
      if (entry === null || typeof entry !== 'object') return false;

      const tp = entry as Record<string, unknown>;
      if (typeof tp.totalQuestions !== 'number' || tp.totalQuestions < 0) return false;
      if (typeof tp.correctAnswers !== 'number' || tp.correctAnswers < 0) return false;
      if (tp.correctAnswers > tp.totalQuestions) return false;
    }

    return true;
  }

  /** 進捗データを localStorage から読み込む */
  loadProgress(): ProgressData {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (!raw) return this.getInitialProgress();

      const parsed: unknown = JSON.parse(raw);
      return this.validateProgressData(parsed)
        ? parsed
        : this.getInitialProgress();
    } catch {
      // JSON 解析エラーまたは localStorage アクセスエラー → 初期状態
      return this.getInitialProgress();
    }
  }

  /** 進捗データを localStorage に保存する */
  saveProgress(data: ProgressData): boolean {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch {
      // localStorage 未対応・容量超過 → 保存失敗を無視して継続
      return false;
    }
  }

  /**
   * 回答結果を記録する。
   * 指定された問題タイプの累計問題数を +1 し、正解なら累計正答数も +1 する。
   */
  recordAnswer(typeId: QuestionTypeId, isCorrect: boolean): boolean {
    try {
      const data = this.loadProgress();

      if (!data.byType[typeId]) {
        data.byType[typeId] = { totalQuestions: 0, correctAnswers: 0 };
      }

      data.byType[typeId].totalQuestions += 1;
      if (isCorrect) {
        data.byType[typeId].correctAnswers += 1;
      }

      data.lastUpdated = new Date().toISOString();
      return this.saveProgress(data);
    } catch {
      // エラー時は保存失敗を無視して継続
      return false;
    }
  }

  /** 全問題タイプの累計を計算する */
  getTotalProgress(data: ProgressData): TypeProgress {
    let totalQuestions = 0;
    let correctAnswers = 0;

    for (const typeProgress of Object.values(data.byType)) {
      totalQuestions += typeProgress.totalQuestions;
      correctAnswers += typeProgress.correctAnswers;
    }

    return { totalQuestions, correctAnswers };
  }

  /** 進捗データをリセットする */
  resetProgress(): boolean {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      return true;
    } catch {
      // localStorage 未対応 → リセット失敗を無視して継続
      return false;
    }
  }
}

/** シングルトンインスタンス */
export const storageService = new StorageService();
