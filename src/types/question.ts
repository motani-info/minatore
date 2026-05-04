import type React from 'react';

/** 問題タイプの一意な識別子 */
export type QuestionTypeId = string;

/** 選択肢のインデックス（0始まり） */
export type ChoiceIndex = number;

/** 問題データ（問題タイプごとに異なる） */
export interface Question<TQuestionData = unknown, TChoiceData = unknown> {
  /** 問題固有のデータ */
  questionData: TQuestionData;
  /** 選択肢データの配列 */
  choices: TChoiceData[];
  /** 正解の選択肢インデックス */
  correctIndex: ChoiceIndex;
  /** ひらがなの指示テキスト */
  instructionText: string;
}

/** 問題タイプの定義 */
export interface QuestionType<TQuestionData = unknown, TChoiceData = unknown> {
  /** 一意の識別子 */
  id: QuestionTypeId;
  /** 表示名（ひらがな） */
  displayName: string;
  /** アイコン（絵文字またはSVGコンポーネント） */
  icon: string | React.ComponentType;
  /** 問題を生成する関数 */
  generateQuestion: () => Question<TQuestionData, TChoiceData>;
  /** 問題表示コンポーネント */
  QuestionDisplay: React.ComponentType<{ data: TQuestionData }>;
  /** 選択肢表示コンポーネント */
  ChoiceDisplay: React.ComponentType<{
    data: TChoiceData;
    isSelected: boolean;
    isCorrect: boolean;
    showResult: boolean;
  }>;
  /** 正解判定関数 */
  checkAnswer: (
    question: Question<TQuestionData, TChoiceData>,
    selectedIndex: ChoiceIndex
  ) => boolean;
}
