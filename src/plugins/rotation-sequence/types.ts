/**
 * 回転図形（連続）問題の型定義
 * 5つの絵が順番に回転していく中で、1つだけ間違っている絵を見つける
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

/** 1フレームの定義 */
export interface SequenceFrame {
  /** 回転角度 */
  angle: RotationAngle;
}

/** 問題データ */
export interface RotationSequenceQuestionData {
  /** 使用する絵の種類 */
  pictureType: PictureType;
  /** 5フレームの回転角度（正しい回転を含む） */
  frames: SequenceFrame[];
  /** 間違っているフレームのインデックス（0-4） */
  wrongIndex: number;
  /** 各フレーム間の回転方向（右回り=時計回り） */
  rotationStep: 90 | -90;
}

/** 選択肢データ（フレームのインデックス 0-4） */
export type RotationSequenceChoiceData = number;
