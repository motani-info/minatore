import type { Question } from '../../types/question';
import type {
  CellValue,
  OverlayGrid,
  OverlayResult,
  OverlayQuestionData,
  OverlayChoiceData,
} from './types';

/**
 * 2つのセルを重ねた結果を計算する
 * ルール:
 * - cross + circle = empty（消える）
 * - circle + cross = empty（消える）
 * - 同じ記号 = そのまま残る
 * - empty + 何か = 何か
 * - 何か + empty = 何か
 */
export function overlayCells(top: CellValue, bottom: CellValue): CellValue {
  if (top === 'empty') return bottom;
  if (bottom === 'empty') return top;
  if (top === bottom) return top;
  // cross + circle or circle + cross → empty
  return 'empty';
}

/** 左列を右列に折り重ねた結果を計算する */
export function computeOverlayResult(grid: OverlayGrid): OverlayResult {
  return [
    overlayCells(grid.left[0], grid.right[0]),
    overlayCells(grid.left[1], grid.right[1]),
  ];
}

/** 2つの結果が同一か判定する */
export function resultsEqual(a: OverlayResult, b: OverlayResult): boolean {
  return a[0] === b[0] && a[1] === b[1];
}

// ─── 固定問題プール ───

interface FixedOverlayQ {
  grid: OverlayGrid;
  choices: OverlayChoiceData[];
  correctIndex: number;
}

const FIXED_QUESTIONS: FixedOverlayQ[] = [
  // 問題1: circle+circle=circle, cross+empty=cross
  { grid: { left: ['circle', 'cross'], right: ['circle', 'empty'] }, choices: [['circle', 'cross'], ['circle', 'circle'], ['empty', 'cross'], ['cross', 'cross']], correctIndex: 0 },
  // 問題2: cross+circle=empty, circle+cross=empty
  { grid: { left: ['cross', 'circle'], right: ['circle', 'cross'] }, choices: [['cross', 'cross'], ['circle', 'circle'], ['empty', 'empty'], ['cross', 'circle']], correctIndex: 2 },
  // 問題3: circle+empty=circle, empty+circle=circle
  { grid: { left: ['circle', 'empty'], right: ['empty', 'circle'] }, choices: [['circle', 'circle'], ['empty', 'empty'], ['circle', 'empty'], ['empty', 'circle']], correctIndex: 0 },
  // 問題4: cross+cross=cross, circle+circle=circle
  { grid: { left: ['cross', 'circle'], right: ['cross', 'circle'] }, choices: [['empty', 'empty'], ['cross', 'circle'], ['circle', 'cross'], ['cross', 'cross']], correctIndex: 1 },
  // 問題5: cross+empty=cross, cross+circle=empty
  { grid: { left: ['cross', 'cross'], right: ['empty', 'circle'] }, choices: [['cross', 'empty'], ['cross', 'cross'], ['empty', 'circle'], ['circle', 'cross']], correctIndex: 0 },
  // 問題6: empty+cross=cross, circle+empty=circle
  { grid: { left: ['empty', 'circle'], right: ['cross', 'empty'] }, choices: [['cross', 'circle'], ['empty', 'circle'], ['cross', 'empty'], ['circle', 'cross']], correctIndex: 0 },
  // 問題7: circle+cross=empty, cross+cross=cross
  { grid: { left: ['circle', 'cross'], right: ['cross', 'cross'] }, choices: [['empty', 'cross'], ['circle', 'cross'], ['cross', 'empty'], ['cross', 'cross']], correctIndex: 0 },
  // 問題8: cross+cross=cross, empty+empty=empty
  { grid: { left: ['cross', 'empty'], right: ['cross', 'empty'] }, choices: [['cross', 'empty'], ['empty', 'cross'], ['cross', 'cross'], ['empty', 'empty']], correctIndex: 0 },
  // 問題9: circle+circle=circle, circle+cross=empty
  { grid: { left: ['circle', 'circle'], right: ['circle', 'cross'] }, choices: [['circle', 'circle'], ['circle', 'empty'], ['empty', 'cross'], ['cross', 'circle']], correctIndex: 1 },
  // 問題10: empty+empty=empty, cross+circle=empty
  { grid: { left: ['empty', 'cross'], right: ['empty', 'circle'] }, choices: [['empty', 'empty'], ['cross', 'circle'], ['empty', 'cross'], ['circle', 'empty']], correctIndex: 0 },
  // 問題11: cross+circle=empty, empty+cross=cross
  { grid: { left: ['cross', 'empty'], right: ['circle', 'cross'] }, choices: [['empty', 'cross'], ['cross', 'cross'], ['circle', 'empty'], ['cross', 'circle']], correctIndex: 0 },
  // 問題12: circle+empty=circle, cross+cross=cross
  { grid: { left: ['circle', 'cross'], right: ['empty', 'cross'] }, choices: [['circle', 'cross'], ['empty', 'cross'], ['circle', 'circle'], ['cross', 'empty']], correctIndex: 0 },
  // 問題13: empty+circle=circle, circle+empty=circle
  { grid: { left: ['empty', 'circle'], right: ['circle', 'empty'] }, choices: [['circle', 'circle'], ['empty', 'empty'], ['circle', 'empty'], ['empty', 'circle']], correctIndex: 0 },
  // 問題14: cross+empty=cross, circle+circle=circle
  { grid: { left: ['cross', 'circle'], right: ['empty', 'circle'] }, choices: [['cross', 'circle'], ['cross', 'empty'], ['empty', 'circle'], ['circle', 'circle']], correctIndex: 0 },
  // 問題15: circle+cross=empty, cross+empty=cross
  { grid: { left: ['circle', 'cross'], right: ['cross', 'empty'] }, choices: [['empty', 'cross'], ['circle', 'cross'], ['cross', 'cross'], ['empty', 'empty']], correctIndex: 0 },
  // 問題16: empty+cross=cross, empty+circle=circle
  { grid: { left: ['empty', 'empty'], right: ['cross', 'circle'] }, choices: [['cross', 'circle'], ['empty', 'empty'], ['circle', 'cross'], ['cross', 'cross']], correctIndex: 0 },
];

/** 現在の出題インデックス */
let currentIndex = 0;

/** 問題を順番に生成する */
export function generateOverlayQuestion(): Question<OverlayQuestionData, OverlayChoiceData> {
  const fixedQ = FIXED_QUESTIONS[currentIndex % FIXED_QUESTIONS.length];
  currentIndex++;

  return {
    questionData: { grid: fixedQ.grid },
    choices: fixedQ.choices,
    correctIndex: fixedQ.correctIndex,
    instructionText: 'パタンと右におると\nどうなりますか？',
  };
}

/** 固定問題プールの全問題を返す */
export function getAllOverlayQuestions(): Question<OverlayQuestionData, OverlayChoiceData>[] {
  return FIXED_QUESTIONS.map((fixedQ) => ({
    questionData: { grid: fixedQ.grid },
    choices: fixedQ.choices,
    correctIndex: fixedQ.correctIndex,
    instructionText: 'パタンと右におると\nどうなりますか？',
  }));
}

/** 正解判定関数 */
export function checkOverlayAnswer(
  question: Question<OverlayQuestionData, OverlayChoiceData>,
  selectedIndex: number
): boolean {
  return selectedIndex === question.correctIndex;
}
