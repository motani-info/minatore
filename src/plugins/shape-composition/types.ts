/**
 * 図形構成問題の型定義
 *
 * お手本の図形が示され、3つのパーツを組み合わせて
 * お手本と同じ形を作れる選択肢を見つける問題。
 */

/** 図形パーツの種類 */
export type ShapePartType =
  | 'rect'        // 長方形
  | 'square'      // 正方形
  | 'triangle'    // 三角形
  | 'circle'      // 円
  | 'semicircle'  // 半円
  | 'quarter'     // 四分円
  | 'trapezoid'   // 台形
  | 'diamond'     // ひし形
  | 'cross'       // 十字
  | 'l-shape'     // L字
  | 'arrow';      // 矢印

/** 図形パーツの定義 */
export interface ShapePart {
  type: ShapePartType;
  /** 幅（相対値 0-100） */
  width: number;
  /** 高さ（相対値 0-100） */
  height: number;
  /** 回転角度 */
  rotation?: number;
  /** 塗りつぶし（true=黒, false=白枠のみ） */
  filled?: boolean;
}

/** 選択肢のパーツセット（3つのパーツ） */
export type PartsSet = [ShapePart, ShapePart, ShapePart];

/** お手本図形のSVGパス定義 */
export type ModelShape = string[];

/** 問題データ */
export interface ShapeCompositionQuestionData {
  /** お手本図形のSVGポリゴン座標群（0-100正規化） */
  model: ModelShape;
}

/** 選択肢データ */
export interface ShapeCompositionChoiceData {
  /** 3つのパーツ */
  parts: PartsSet;
}
