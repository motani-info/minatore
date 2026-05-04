/**
 * 図形構成パズル問題の型定義
 */

/** 2×2グリッドの塗りつぶしパターン [上左, 上右, 下左, 下右] */
export type PuzzleGrid = [boolean, boolean, boolean, boolean];

/** ピースの組み合わせ */
export interface PiecePair {
  /** ピースA */
  pieceA: PuzzleGrid;
  /** ピースB */
  pieceB: PuzzleGrid;
}

/** 図形構成パズル問題の問題データ */
export interface PuzzleQuestionData {
  /** お手本のグリッドパターン */
  targetGrid: PuzzleGrid;
}

/** 図形構成パズル問題の選択肢データ */
export type PuzzleChoiceData = PiecePair;
