/**
 * 回転図形問題の型定義
 */

/** グリッドサイズ（2×2, 3×3, 4×4） */
export type GridSize = 2 | 3 | 4;

/** NxNグリッドのデータ */
export interface GridData {
  /** グリッドサイズ（2, 3, or 4） */
  size: GridSize;
  /** セルの配列（size*size個、行優先: [上左, 上右, ..., 下左, 下右]） */
  cells: boolean[];
}

/** 後方互換性のための2×2グリッド型 */
export type Grid = [boolean, boolean, boolean, boolean];

/** 回転方向（右/左 × 1回/2回） */
export type RotationDirection = 'right1' | 'left1' | 'right2' | 'left2';

/** 回転図形問題の問題データ */
export interface RotationQuestionData {
  /** 元のグリッドパターン */
  originalGrid: GridData;
  /** 回転方向 */
  direction: RotationDirection;
}

/** 回転図形問題の選択肢データ */
export type RotationChoiceData = GridData;

// ─── シンボルベース回転図形（固定問題用） ───

/** セルに配置できるシンボルの種類 */
export type SymbolType =
  | 'empty'
  | 'circle-white'
  | 'circle-black'
  | 'triangle-white'
  | 'triangle-black'
  | 'diagonal-line'
  | 'diagonal-cross'
  | 'square-black'
  | 'arrow-right'
  | 'arrow-curved'
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

/** シンボルグリッドのデータ */
export interface SymbolGridData {
  /** グリッドサイズ（2, 3, or 4） */
  size: GridSize;
  /** セルの配列（size*size個、行優先） */
  cells: CellSymbol[];
}

/** 後方互換性のための2×2シンボルグリッド型 */
export type SymbolGrid = [CellSymbol, CellSymbol, CellSymbol, CellSymbol];

/** シンボルベース回転図形の問題データ */
export interface SymbolRotationQuestionData {
  /** 元のグリッドパターン */
  originalGrid: SymbolGridData;
  /** 回転方向 */
  direction: RotationDirection;
}

/** シンボルベース回転図形の選択肢データ */
export type SymbolRotationChoiceData = SymbolGridData;

// ─── ヘルパー関数 ───

/** Grid（2×2タプル）をGridDataに変換する */
export function gridToGridData(grid: Grid): GridData {
  return { size: 2, cells: [...grid] };
}

/** SymbolGrid（2×2タプル）をSymbolGridDataに変換する */
export function symbolGridToGridData(grid: SymbolGrid): SymbolGridData {
  return { size: 2, cells: [...grid] };
}
