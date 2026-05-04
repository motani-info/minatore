/**
 * 重ね図形応用問題の型定義
 *
 * 2つの3×3グリッド（透明な板）を重ねたとき、
 * 両方に○がある位置を見つける問題。
 */

/**
 * 3×3グリッド（行優先、9要素）
 * [0][1][2]
 * [3][4][5]
 * [6][7][8]
 * true = ○あり, false = 空
 */
export type Grid3x3 = [
  boolean, boolean, boolean,
  boolean, boolean, boolean,
  boolean, boolean, boolean,
];

/** 重ね図形応用問題の問題データ */
export interface OverlayAdvancedQuestionData {
  /** 左の板 */
  gridA: Grid3x3;
  /** 右の板 */
  gridB: Grid3x3;
}

/**
 * 重ね図形応用問題の選択肢データ
 * 3×3グリッドで、重なった部分が true
 */
export type OverlayAdvancedChoiceData = Grid3x3;
