/**
 * 回転図形（連続）問題の型定義
 * 1つの絵を表示し、指定方向に回転した結果を4つの選択肢から選ぶ
 */

/** 絵の種類 */
export type PictureType =
  | 'frog'
  | 'elephant'
  | 'squirrel'
  | 'dots'
  | 'umbrella'
  | 'boat'
  | 'pencil'
  | 'star-flower';

/** 回転角度（0, 90, 180, 270） */
export type RotationAngle = 0 | 90 | 180 | 270;

/** 回転方向 */
export type RotationDirection = 'right1' | 'left1' | 'right2' | 'left2';

/** 問題データ */
export interface RotationSequenceQuestionData {
  /** 使用する絵の種類 */
  pictureType: PictureType;
  /** 元の絵の回転角度（表示用） */
  originalAngle: RotationAngle;
  /** 回転方向 */
  direction: RotationDirection;
}

/** 選択肢データ（絵の種類と回転角度を含む） */
export interface RotationSequenceChoiceData {
  /** 絵の種類 */
  pictureType: PictureType;
  /** 回転角度 */
  angle: RotationAngle;
}
