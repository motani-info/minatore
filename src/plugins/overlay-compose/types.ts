/**
 * 折り重ね図形（合成ルール）の型定義
 * 合成: 重なったセルは消えずに残る（OR演算）
 */

/** セルの値 */
export type CellValue = 'circle' | 'triangle' | 'triangle-right' | 'triangle-left' | 'cross' | 'empty';

/** 汎用NxNグリッド */
export interface OverlayComposeGrid {
  size: number; // 2, 3, or 4
  cells: CellValue[];
}

/** 問題データ */
export interface OverlayComposeQuestionData {
  /** 左側のグリッド */
  leftGrid: OverlayComposeGrid;
  /** 右側のグリッド */
  rightGrid: OverlayComposeGrid;
}

/** 選択肢データ（結果グリッド） */
export type OverlayComposeChoiceData = OverlayComposeGrid;
