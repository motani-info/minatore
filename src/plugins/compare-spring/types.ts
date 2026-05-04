/**
 * 比較（重さ：ばね）問題の型定義
 *
 * 複数のばねに重りがぶら下がっており、
 * ばねの伸び具合から重さの順番を判断する問題。
 */

/** 1つのばね+重りの定義 */
export interface SpringItem {
  /** ばねの伸び（大きいほど伸びている＝重い）。1〜5程度 */
  stretch: number;
  /** 重さの順位（内部比較用） */
  weight: number;
}

/** 比較（重さ：ばね）問題の問題データ */
export interface CompareSpringQuestionData {
  /** ばね+重りの配列 */
  springs: SpringItem[];
}

/** 比較（重さ：ばね）問題の選択肢データ */
export interface CompareSpringChoiceData {
  /** 一番重いもののインデックス */
  heaviestIndex: number;
  /** 2番目に重いもののインデックス */
  secondIndex: number;
  /** 一番軽いもののインデックス */
  lightestIndex: number;
}

/** ユーザーのマーク（◎=一番重い、△=2番目、×=一番軽い） */
export type SpringMarkType = 'double-circle' | 'triangle' | 'cross' | null;
