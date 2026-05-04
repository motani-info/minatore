/**
 * 比較（重さ：シーソー）問題の型定義
 */

/** アイテム（シーソーに乗るもの） */
export interface SeesawItem {
  /** 表示用の絵文字 */
  emoji: string;
  /** アイテム名（ひらがな） */
  name: string;
  /** 重さ（内部的な比較用の値、大きいほど重い） */
  weight: number;
}

/** シーソーの状態（どちらが重いか） */
export interface SeesawState {
  /** 左側のアイテム */
  left: SeesawItem;
  /** 右側のアイテム */
  right: SeesawItem;
  /** 傾き: 'left' = 左が重い, 'right' = 右が重い, 'balanced' = 釣り合い */
  tilt: 'left' | 'right' | 'balanced';
}

/** シーソー問題の問題データ */
export interface SeesawQuestionData {
  /** シーソーの状態（2つ） */
  seesaws: [SeesawState, SeesawState];
  /** 比較対象の全アイテム（3つ） */
  items: [SeesawItem, SeesawItem, SeesawItem];
}

/** シーソー問題の選択肢データ（正解情報） */
export interface SeesawChoiceData {
  /** 一番重いアイテムのインデックス */
  heaviestIndex: number;
  /** 一番軽いアイテムのインデックス */
  lightestIndex: number;
}

/** ユーザーの回答状態 */
export type MarkType = 'circle' | 'cross' | null;
