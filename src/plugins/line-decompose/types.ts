/**
 * 線図形の分解問題の型定義
 *
 * お手本（完成形）と1つの構成図形が与えられ、
 * 足りない線（もう1つの構成図形）を4択から選ぶ問題
 *
 * 既存の line-overlay（合成）の逆パターン
 */

import type { LineFigure } from '../line-overlay/types';

/** 問題データ: お手本（完成形）と1つの構成図形 */
export interface LineDecomposeQuestionData {
  /** お手本（完成形＝2つの図形を重ねた結果） */
  completeFigure: LineFigure;
  /** 与えられた構成図形（片方） */
  givenFigure: LineFigure;
}

/** 選択肢データ: 足りない線図形 */
export type LineDecomposeChoiceData = LineFigure;
