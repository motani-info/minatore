/**
 * 線図形の重ね合わせ問題の型定義
 *
 * ドットグリッド上に線分を描いた2つの図形を重ねたら
 * どんな図形になるかを答える問題
 */

/** ドットグリッド上の座標 */
export interface DotPosition {
  /** 列 (0=左端) */
  col: number;
  /** 行 (0=上端) */
  row: number;
}

/** 2つのドットを結ぶ線分 */
export interface LineSegment {
  from: DotPosition;
  to: DotPosition;
}

/** 線図形（線分の集合） */
export type LineFigure = LineSegment[];

/** 問題データ: 2つの線図形 */
export interface LineOverlayQuestionData {
  /** 左側の線図形 */
  figureA: LineFigure;
  /** 右側の線図形 */
  figureB: LineFigure;
  /** グリッドサイズ（デフォルト4） */
  gridSize?: number;
}

/** 選択肢データ: 重ね合わせ結果の線図形 */
export interface LineOverlayChoiceData {
  /** 線図形 */
  figure: LineFigure;
  /** グリッドサイズ（デフォルト4） */
  gridSize?: number;
}
