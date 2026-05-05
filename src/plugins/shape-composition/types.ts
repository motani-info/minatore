/**
 * 図形構成問題の型定義
 *
 * 4×4グリッド上のお手本図形（塗りつぶしパターン）が示され、
 * 2つのピース（それぞれグリッドパターン）を組み合わせて
 * お手本と同じ形を作れる選択肢を見つける問題。
 *
 * ピースA + ピースB = お手本（OR演算、重なりなし）
 */

/** 4×4グリッドのセル状態 */
export type GridCell = boolean;

/** 4×4グリッド（16セル、行優先） */
export type Grid4x4 = GridCell[];

/** 2つのピースの組み合わせ */
export interface PiecePair {
  pieceA: Grid4x4;
  pieceB: Grid4x4;
}

/** 問題データ */
export interface ShapeCompositionQuestionData {
  /** お手本の4×4グリッドパターン */
  model: Grid4x4;
}

/** 選択肢データ（2つのピースの組み合わせ） */
export type ShapeCompositionChoiceData = PiecePair;
