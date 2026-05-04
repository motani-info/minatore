/**
 * 1対1対応の過不足問題の型定義
 */

/** 問題データ */
export interface OneToOneQuestionData {
  /** 上のアイテム（鳥など） */
  topEmoji: string;
  topName: string;
  topCount: number;
  /** 下のアイテム（家など） */
  bottomEmoji: string;
  bottomName: string;
  bottomCount: number;
}

/** 選択肢データ */
export interface OneToOneChoiceData {
  /** 回答テキスト */
  text: string;
}
