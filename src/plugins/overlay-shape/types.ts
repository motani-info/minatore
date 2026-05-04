/**
 * 重ね図形（図形パターン）問題の型定義
 *
 * 2つの透明シートに描かれた白黒パターンを重ねたとき、
 * どんな模様になるかを選ぶ問題。
 * 各シートはSVGのパス（polygon）で黒い領域を定義する。
 */

/**
 * 1枚のシートの黒い領域を定義するポリゴン群
 * 各ポリゴンは "x1,y1 x2,y2 x3,y3 ..." 形式の文字列
 * 座標は 0〜100 の正規化座標
 */
export type ShapePattern = string[];

/** 重ね図形（図形パターン）問題の問題データ */
export interface OverlayShapeQuestionData {
  /** 左のシート（黒い領域のポリゴン群） */
  sheetA: ShapePattern;
  /** 右のシート */
  sheetB: ShapePattern;
}

/** 重ね図形（図形パターン）問題の選択肢データ */
export interface OverlayShapeChoiceData {
  /** 重ね結果のポリゴン群 */
  pattern: ShapePattern;
}
