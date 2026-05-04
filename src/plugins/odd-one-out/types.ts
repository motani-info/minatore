/**
 * 異図形発見問題の型定義
 */

/** 図形パーツの定義 */
export interface FigurePart {
  /** パーツの種類 */
  type: 'rect' | 'circle' | 'line';
  /** X位置（%） */
  x: number;
  /** Y位置（%） */
  y: number;
  /** 幅（%） */
  width: number;
  /** 高さ（%） */
  height: number;
  /** 色 */
  color: string;
  /** 回転角度 */
  rotation?: number;
}

/** 図形の定義（複数パーツで構成） */
export type FigureDefinition = FigurePart[];

/** 変異の種類 */
export type MutationType = 'flip' | 'shift' | 'colorChange' | 'rotate';

/** 問題データ */
export interface OddOneOutQuestionData {
  /** 基本図形 */
  baseFigure: FigureDefinition;
  /** 変異した図形 */
  mutatedFigure: FigureDefinition;
  /** グリッドサイズ（3 or 4） */
  gridSize: number;
  /** 変異図形の位置インデックス */
  oddIndex: number;
}

/** 選択肢データ（位置インデックス） */
export type OddOneOutChoiceData = number;
