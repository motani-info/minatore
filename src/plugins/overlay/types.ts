/**
 * 折り重ね図形問題の型定義
 */

/** セルの値 */
export type CellValue = 'circle' | 'cross' | 'empty';

/** 2×2グリッド（左列と右列、各2セル）
 * [左上, 左下] が左列
 * [右上, 右下] が右列
 */
export interface OverlayGrid {
  /** 左列 [上, 下] */
  left: [CellValue, CellValue];
  /** 右列 [上, 下] */
  right: [CellValue, CellValue];
}

/** 折り重ね結果（右列のみ、2セル） */
export type OverlayResult = [CellValue, CellValue];

/** 折り重ね図形問題の問題データ */
export interface OverlayQuestionData {
  /** 折り重ね前のグリッド */
  grid: OverlayGrid;
}

/** 折り重ね図形問題の選択肢データ */
export type OverlayChoiceData = OverlayResult;
