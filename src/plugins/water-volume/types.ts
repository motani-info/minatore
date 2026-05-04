/**
 * 比較（水量）問題の型定義
 *
 * コップや水槽に入った水の量を比較し、
 * 一番多いものに○、2番目に多いものに×をつける問題
 */

/** 容器の種類 */
export type ContainerType = 'cup' | 'tank';

/** 水量アイテム */
export interface WaterItem {
  /** 容器の種類 */
  container: ContainerType;
  /** 水位（0.0〜1.0、容器に対する割合） */
  waterLevel: number;
  /** 容器のサイズ（幅の相対値、1.0が標準） */
  containerScale: number;
  /** アイテム名（ひらがな） */
  name: string;
}

/** 水量問題の問題データ */
export interface WaterVolumeQuestionData {
  /** 比較対象のアイテム（3〜4つ） */
  items: WaterItem[];
}

/** 水量問題の選択肢データ（正解情報） */
export interface WaterVolumeChoiceData {
  /** 一番多いアイテムのインデックス */
  mostIndex: number;
  /** 2番目に多いアイテムのインデックス */
  secondIndex: number;
}

/** ユーザーの回答状態 */
export type MarkType = 'circle' | 'cross' | null;
