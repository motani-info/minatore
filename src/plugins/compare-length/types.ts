/**
 * 比較（長さ）問題の型定義
 *
 * 複数の線（直線、波線、弧線など）が表示され、
 * 一番長い線と一番短い線を選ぶ問題。
 */

/** 線の種類 */
export type LineType = 'straight' | 'wavy' | 'arc' | 'zigzag' | 'spiral';

/** 1本の線の定義 */
export interface LineDef {
  /** 線の種類 */
  type: LineType;
  /** 実際の長さ（内部比較用、大きいほど長い） */
  length: number;
  /** 表示上の見た目の幅（SVG上のx方向の長さ） */
  displayWidth: number;
}

/** 比較（長さ）問題の問題データ */
export interface CompareLengthQuestionData {
  /** 表示する線の配列 */
  lines: LineDef[];
}

/** 比較（長さ）問題の選択肢データ */
export interface CompareLengthChoiceData {
  /** 一番長い線のインデックス */
  longestIndex: number;
  /** 一番短い線のインデックス */
  shortestIndex: number;
}

/** ユーザーのマーク */
export type LengthMarkType = 'circle' | 'cross' | null;
