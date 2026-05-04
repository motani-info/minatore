/**
 * 比較（重さ：シーソー）問題の型定義
 */

/** 図形の種類（SVG描画用） */
export type ShapeType =
  | 'star-black'       // ★ 黒い星
  | 'circle-black'     // ● 黒い丸
  | 'hexagon-black'    // ⬡ 黒い六角形
  | 'diamond-star'     // ◇ 四つ角の星（ダイヤ星）
  | 'circle-ring'      // ○ 白抜き丸
  | 'cross-black'      // ✚ 黒い十字
  | 'pentagon-gray'    // ⬠ グレーの五角形
  | 'square-black';    // ■ 黒い四角

/** アイテム（シーソーに乗るもの） */
export interface SeesawItem {
  /** 表示用の絵文字（SVG図形がない場合のフォールバック） */
  emoji: string;
  /** アイテム名（ひらがな） */
  name: string;
  /** 重さ（内部的な比較用の値、大きいほど重い） */
  weight: number;
  /** SVG図形の種類（指定時はSVGで描画） */
  shape?: ShapeType;
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
  /** シーソーの状態（2つまたは3つ） */
  seesaws: SeesawState[];
  /** 比較対象の全アイテム（3つ） */
  items: SeesawItem[];
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
