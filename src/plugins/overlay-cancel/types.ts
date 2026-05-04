/**
 * 条件付き折り重ね図形（相殺ルール）の型定義
 */

/** セルの値 */
export type CellValue = 'circle' | 'cross' | 'empty';

/** 2×2グリッド */
export type Grid2x2 = [CellValue, CellValue, CellValue, CellValue];

/** 問題データ */
export interface OverlayCancelQuestionData {
  /** 左側のグリッド */
  leftGrid: Grid2x2;
  /** 右側のグリッド */
  rightGrid: Grid2x2;
}

/** 選択肢データ（結果グリッド） */
export type OverlayCancelChoiceData = Grid2x2;
