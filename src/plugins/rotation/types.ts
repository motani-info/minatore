/**
 * 回転図形問題の型定義
 */

/** 2×2グリッドの型（[上左, 上右, 下左, 下右]） */
export type Grid = [boolean, boolean, boolean, boolean];

/** 回転方向（右/左 × 1回/2回） */
export type RotationDirection = 'right1' | 'left1' | 'right2' | 'left2';

/** 回転図形問題の問題データ */
export interface RotationQuestionData {
  /** 元のグリッドパターン */
  originalGrid: Grid;
  /** 回転方向 */
  direction: RotationDirection;
}

/** 回転図形問題の選択肢データ */
export type RotationChoiceData = Grid;

// ─── シンボルベース回転図形（固定問題用） ───

/** セルに配置できるシンボルの種類 */
export type SymbolType =
  | 'empty'
  | 'circle-white'
  | 'circle-black'
  | 'triangle-white'
  | 'triangle-black'
  | 'diagonal-line'
  | 'arrow-right'
  | 'person-man'
  | 'person-woman'
  | 'heart-black'
  | 'heart-white'
  | 'club-black'
  | 'club-white'
  | 'spade-black'
  | 'spade-white'
  | 'diamond-black'
  | 'diamond-white'
  | 'umbrella'
  | 'umbrella-closed'
  | 'tulip';

/** シンボルの向き（三角形など向きがある図形用） */
export type SymbolDirection = 'up' | 'right' | 'down' | 'left';

/** セルの定義 */
export interface CellSymbol {
  type: SymbolType;
  direction?: SymbolDirection;
  /** セルの大きさ（通常は1、大きい図形は2以上） */
  size?: 'normal' | 'large';
}

/** シンボルベースの2×2グリッド [上左, 上右, 下左, 下右] */
export type SymbolGrid = [CellSymbol, CellSymbol, CellSymbol, CellSymbol];

/** シンボルベース回転図形の問題データ */
export interface SymbolRotationQuestionData {
  /** 元のグリッドパターン */
  originalGrid: SymbolGrid;
  /** 回転方向 */
  direction: RotationDirection;
}

/** シンボルベース回転図形の選択肢データ */
export type SymbolRotationChoiceData = SymbolGrid;
