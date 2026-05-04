/**
 * 図形と数カルタ問題の型定義
 */

/** 図形の種類 */
export type ShapeType = 'circle' | 'triangle' | 'square';

/** 色 */
export type ShapeColor = 'red' | 'blue' | 'yellow' | 'green';

/** カード内の図形グループ */
export interface ShapeGroup {
  shape: ShapeType;
  color: ShapeColor;
  count: number;
}

/** カードデータ（複数の図形グループを含む） */
export type CardData = ShapeGroup[];

/** 問題データ */
export interface ShapeKartaQuestionData {
  /** 指示条件（例: 赤い三角が3個、青い丸が2個） */
  conditions: ShapeGroup[];
}

/** 選択肢データ */
export type ShapeKartaChoiceData = CardData;
