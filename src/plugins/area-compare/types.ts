/**
 * 比較（広さ）問題の型定義
 *
 * グリッド上の白黒セルで構成された図形を比較し、
 * 黒い部分が一番広いものに○、一番狭いものに×をつける問題
 */

/** セルの値 */
export type CellValue = 'black' | 'white';

/** グリッド図形 */
export interface AreaGrid {
  /** グリッドサイズ（行数 = 列数） */
  size: number;
  /** セルの値（行優先、size × size） */
  cells: CellValue[];
}

/** 広さ比較アイテム */
export interface AreaItem {
  /** グリッド図形 */
  grid: AreaGrid;
  /** アイテム名（ひらがな） */
  name: string;
}

/** 広さ比較問題の問題データ */
export interface AreaCompareQuestionData {
  /** 比較対象のアイテム（3〜4つ） */
  items: AreaItem[];
}

/** 広さ比較問題の選択肢データ（正解情報） */
export interface AreaCompareChoiceData {
  /** 黒が一番多いアイテムのインデックス */
  mostIndex: number;
  /** 黒が一番少ないアイテムのインデックス */
  leastIndex: number;
}

/** ユーザーの回答状態 */
export type MarkType = 'circle' | 'cross' | null;
