import { useState, useCallback, useEffect } from 'react';

/** レベルデータ */
export interface LevelData {
  /** 累計経験値 */
  totalXp: number;
  /** 現在のレベル */
  level: number;
  /** 現在レベルでの経験値（レベル内の進捗） */
  currentLevelXp: number;
  /** 次のレベルに必要な経験値（現在レベルの必要量） */
  nextLevelXp: number;
  /** 進捗率 (0〜1) */
  progressRatio: number;
}

/** 経験値の付与量 */
export const XP_CORRECT = 10;  // 正解
export const XP_WRONG = 2;     // 不正解（参加賞）

const STORAGE_KEY = 'exam-app-xp';

/**
 * レベルに必要な累計経験値を計算する
 * レベル1: 0XP, レベル2: 30XP, レベル3: 70XP, ...
 * 各レベルに必要なXP = 20 + (level - 1) * 10
 * つまりレベルが上がるほど次のレベルまでの必要量が増える
 */
function xpForLevel(level: number): number {
  if (level <= 1) return 0;
  // 累計: sum(20 + (i-1)*10, i=1..level-1)
  // = (level-1)*20 + 10 * (level-2)*(level-1)/2
  const n = level - 1;
  return n * 20 + 10 * (n - 1) * n / 2;
}

/** 次のレベルに必要なXP量（そのレベル区間の幅） */
function xpNeededForLevel(level: number): number {
  return 20 + (level - 1) * 10;
}

/** 累計XPからレベル情報を計算する */
export function computeLevel(totalXp: number): LevelData {
  let level = 1;
  while (xpForLevel(level + 1) <= totalXp) {
    level++;
  }

  const currentLevelStart = xpForLevel(level);
  const currentLevelXp = totalXp - currentLevelStart;
  const nextLevelXp = xpNeededForLevel(level);
  const progressRatio = Math.min(currentLevelXp / nextLevelXp, 1);

  return {
    totalXp,
    level,
    currentLevelXp,
    nextLevelXp,
    progressRatio,
  };
}

/** XPデータをlocalStorageから読み込む */
function loadXp(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return 0;
    const val = JSON.parse(raw);
    return typeof val === 'number' && val >= 0 ? val : 0;
  } catch {
    return 0;
  }
}

/** XPデータをlocalStorageに保存する */
function saveXp(xp: number): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(xp));
  } catch {
    // 保存失敗は無視
  }
}

/**
 * 経験値・レベル管理フック
 */
export function useLevel() {
  const [totalXp, setTotalXp] = useState<number>(() => loadXp());

  useEffect(() => {
    setTotalXp(loadXp());
  }, []);

  /** 経験値を加算する */
  const addXp = useCallback((amount: number) => {
    setTotalXp((prev) => {
      const next = prev + amount;
      saveXp(next);
      return next;
    });
  }, []);

  /** 正解時のXP付与 */
  const rewardCorrect = useCallback(() => {
    addXp(XP_CORRECT);
  }, [addXp]);

  /** 不正解時のXP付与 */
  const rewardWrong = useCallback(() => {
    addXp(XP_WRONG);
  }, [addXp]);

  /** リロード */
  const reload = useCallback(() => {
    setTotalXp(loadXp());
  }, []);

  /** リセット */
  const reset = useCallback(() => {
    saveXp(0);
    setTotalXp(0);
  }, []);

  const levelData = computeLevel(totalXp);

  return {
    ...levelData,
    addXp,
    rewardCorrect,
    rewardWrong,
    reload,
    reset,
  };
}
