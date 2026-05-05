import type { Question } from '../../types/question';
import type { OverlayCancelQuestionData, OverlayCancelChoiceData, Grid2x2 } from './types';

/**
 * 左グリッドを右に折り重ねた結果を計算
 * 折り重ね: 左右反転して右に重ねる
 * 相殺ルール: ○と×が重なったら空白になる
 */
export function computeOverlay(leftGrid: Grid2x2, rightGrid: Grid2x2): Grid2x2 {
  // 左グリッドを左右反転（2×2の場合: [0,1,2,3] → [1,0,3,2]）
  const flippedLeft: Grid2x2 = [leftGrid[1], leftGrid[0], leftGrid[3], leftGrid[2]];

  const result: Grid2x2 = ['empty', 'empty', 'empty', 'empty'];

  for (let i = 0; i < 4; i++) {
    const l = flippedLeft[i];
    const r = rightGrid[i];

    if (l === 'empty' && r === 'empty') {
      result[i] = 'empty';
    } else if (l === 'empty') {
      result[i] = r;
    } else if (r === 'empty') {
      result[i] = l;
    } else if (l === r) {
      // 同じ記号 → そのまま残る
      result[i] = l;
    } else {
      // ○と×が重なる → 相殺して空白
      result[i] = 'empty';
    }
  }

  return result;
}

// ─── 固定問題プール ───

interface FixedOverlayCancelQ {
  leftGrid: Grid2x2;
  rightGrid: Grid2x2;
  choices: OverlayCancelChoiceData[];
  correctIndex: number;
}

const FIXED_QUESTIONS: FixedOverlayCancelQ[] = [
  // 問題1: 相殺あり
  { leftGrid: ['circle', 'cross', 'empty', 'circle'], rightGrid: ['cross', 'circle', 'circle', 'empty'], choices: [['empty', 'empty', 'circle', 'circle'], ['cross', 'circle', 'circle', 'empty'], ['circle', 'cross', 'empty', 'circle'], ['empty', 'circle', 'circle', 'cross']], correctIndex: 0 },
  // 問題2: 相殺あり
  { leftGrid: ['cross', 'circle', 'circle', 'cross'], rightGrid: ['circle', 'empty', 'empty', 'circle'], choices: [['circle', 'circle', 'circle', 'empty'], ['empty', 'circle', 'empty', 'empty'], ['circle', 'empty', 'circle', 'circle'], ['empty', 'empty', 'empty', 'empty']], correctIndex: 1 },
  // 問題3: 相殺あり
  { leftGrid: ['circle', 'empty', 'cross', 'circle'], rightGrid: ['empty', 'cross', 'circle', 'empty'], choices: [['empty', 'empty', 'circle', 'circle'], ['cross', 'cross', 'circle', 'empty'], ['empty', 'circle', 'empty', 'circle'], ['circle', 'empty', 'empty', 'cross']], correctIndex: 0 },
  // 問題4: 相殺あり
  { leftGrid: ['cross', 'cross', 'circle', 'empty'], rightGrid: ['cross', 'circle', 'empty', 'cross'], choices: [['empty', 'cross', 'empty', 'cross'], ['cross', 'cross', 'circle', 'cross'], ['cross', 'empty', 'circle', 'empty'], ['empty', 'circle', 'empty', 'empty']], correctIndex: 0 },
  // 問題5: 相殺あり
  { leftGrid: ['empty', 'circle', 'cross', 'empty'], rightGrid: ['circle', 'circle', 'cross', 'cross'], choices: [['circle', 'circle', 'empty', 'cross'], ['empty', 'circle', 'cross', 'cross'], ['circle', 'empty', 'cross', 'empty'], ['circle', 'circle', 'cross', 'cross']], correctIndex: 0 },
  // 問題6: 相殺あり
  { leftGrid: ['circle', 'cross', 'empty', 'cross'], rightGrid: ['empty', 'circle', 'cross', 'empty'], choices: [['empty', 'empty', 'cross', 'cross'], ['circle', 'circle', 'cross', 'empty'], ['cross', 'empty', 'empty', 'cross'], ['empty', 'cross', 'cross', 'empty']], correctIndex: 0 },
  // 問題7: 相殺あり
  { leftGrid: ['cross', 'empty', 'circle', 'cross'], rightGrid: ['circle', 'cross', 'empty', 'circle'], choices: [['empty', 'empty', 'circle', 'empty'], ['cross', 'cross', 'empty', 'circle'], ['empty', 'cross', 'circle', 'empty'], ['circle', 'empty', 'empty', 'cross']], correctIndex: 0 },
  // 問題8: 相殺あり
  { leftGrid: ['empty', 'cross', 'circle', 'empty'], rightGrid: ['cross', 'empty', 'empty', 'circle'], choices: [['empty', 'cross', 'empty', 'circle'], ['cross', 'empty', 'circle', 'empty'], ['empty', 'empty', 'circle', 'circle'], ['cross', 'cross', 'empty', 'empty']], correctIndex: 0 },
  // 問題9: 相殺あり
  { leftGrid: ['circle', 'circle', 'cross', 'cross'], rightGrid: ['cross', 'empty', 'circle', 'empty'], choices: [['empty', 'cross', 'empty', 'cross'], ['circle', 'empty', 'cross', 'empty'], ['cross', 'circle', 'circle', 'cross'], ['empty', 'empty', 'circle', 'circle']], correctIndex: 0 },
  // 問題10: 相殺あり
  { leftGrid: ['cross', 'circle', 'empty', 'cross'], rightGrid: ['empty', 'cross', 'circle', 'circle'], choices: [['empty', 'empty', 'circle', 'circle'], ['cross', 'cross', 'empty', 'circle'], ['circle', 'empty', 'circle', 'empty'], ['empty', 'cross', 'circle', 'cross']], correctIndex: 0 },
  // 問題11: 相殺あり
  { leftGrid: ['circle', 'empty', 'empty', 'circle'], rightGrid: ['cross', 'circle', 'cross', 'empty'], choices: [['cross', 'empty', 'cross', 'circle'], ['empty', 'circle', 'empty', 'circle'], ['cross', 'circle', 'cross', 'circle'], ['empty', 'empty', 'cross', 'empty']], correctIndex: 0 },
  // 問題12: 相殺あり
  { leftGrid: ['empty', 'cross', 'cross', 'circle'], rightGrid: ['circle', 'empty', 'cross', 'cross'], choices: [['circle', 'empty', 'empty', 'cross'], ['empty', 'cross', 'cross', 'cross'], ['circle', 'cross', 'cross', 'empty'], ['empty', 'empty', 'cross', 'circle']], correctIndex: 0 },
];

/** 現在の出題インデックス */
let currentIndex = 0;

/** 問題を順番に生成する */
export function generateOverlayCancelQuestion(): Question<OverlayCancelQuestionData, OverlayCancelChoiceData> {
  const questions = getAllOverlayCancelQuestions();
  const question = questions[currentIndex % questions.length];
  currentIndex++;
  return question;
}

/** 固定問題プールの全問題を返す */
export function getAllOverlayCancelQuestions(): Question<OverlayCancelQuestionData, OverlayCancelChoiceData>[] {
  return FIXED_QUESTIONS.map((fixedQ) => ({
    questionData: { leftGrid: fixedQ.leftGrid, rightGrid: fixedQ.rightGrid },
    choices: fixedQ.choices,
    correctIndex: fixedQ.correctIndex,
    instructionText: '左をパタンと右におると\nどうなりますか？\n（○と×がかさなるときえます）',
  }));
}

/** 正解判定 */
export function checkOverlayCancelAnswer(
  question: Question<OverlayCancelQuestionData, OverlayCancelChoiceData>,
  selectedIndex: number
): boolean {
  return selectedIndex === question.correctIndex;
}
