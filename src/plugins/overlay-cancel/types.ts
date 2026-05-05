/**
 * 条件付き折り重ね図形（相殺ルール）の型定義
 */

/** セルの値 */
export type CellValue = 'circle' | 'cross' | 'empty';

/** 2×2グリッド（後方互換） */
export type Grid2x2 = [CellValue, CellValue, CellValue, CellValue];

/** 汎用NxNグリッド */
export interface OverlayCancelGrid {
  size: number; // 2, 3, or 4
  cells: CellValue[];
}

/** 問題データ */
export interface OverlayCancelQuestionData {
  /** 左側のグリッド */
  leftGrid: OverlayCancelGrid;
  /** 右側のグリッド */
  rightGrid: OverlayCancelGrid;
}

/** 選択肢データ（結果グリッド） */
export type OverlayCancelChoiceData = OverlayCancelGrid;
