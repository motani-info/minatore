/**
 * 回転図形問題の型定義
 */

/** 2×2グリッドの型（[上左, 上右, 下左, 下右]） */
export type Grid = [boolean, boolean, boolean, boolean];

/** 回転方向 */
export type RotationDirection = 'right90' | 'left90' | 'rotate180';

/** 回転図形問題の問題データ */
export interface RotationQuestionData {
  /** 元のグリッドパターン */
  originalGrid: Grid;
  /** 回転方向 */
  direction: RotationDirection;
}

/** 回転図形問題の選択肢データ */
export type RotationChoiceData = Grid;
