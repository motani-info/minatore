/**
 * 文字数あつまりゲームの型定義
 */

/** 問題データ */
export interface SyllableCountQuestionData {
  /** 出題される単語 */
  word: string;
  /** 単語の文字数（音の数） */
  syllableCount: number;
}

/** 選択肢データ（動物グループ） */
export interface SyllableCountChoiceData {
  /** グループの人数 */
  count: number;
  /** 表示する絵文字 */
  emoji: string;
}
