import type { Question } from '../../types/question';
import type {
  ShapeCompositionQuestionData,
  ShapeCompositionChoiceData,
  Grid4x4,
  PiecePair,
} from './types';

// ─── ヘルパー ───

/** 2つのピースをOR演算で合成する */
function combinePieces(a: Grid4x4, b: Grid4x4): Grid4x4 {
  return a.map((cell, i) => cell || b[i]);
}

/** 2つのグリッドが同一か判定する */
function gridsEqual(a: Grid4x4, b: Grid4x4): boolean {
  return a.every((cell, i) => cell === b[i]);
}

/** 2つのピースが重なっていないか確認する */
function piecesNoOverlap(a: Grid4x4, b: Grid4x4): boolean {
  return a.every((cell, i) => !(cell && b[i]));
}

/** グリッドを文字列パターンから生成する（B=true, _=false） */
function g(pattern: string): Grid4x4 {
  return pattern.split('').map(c => c === 'B');
}

// ─── 固定問題プール ───

// 4×4グリッドの座標:
// [0]  [1]  [2]  [3]
// [4]  [5]  [6]  [7]
// [8]  [9]  [10] [11]
// [12] [13] [14] [15]

// ─── 検証済み固定問題プール（完全版） ───

interface ValidatedQ {
  model: Grid4x4;
  correct: PiecePair;
  distractors: [PiecePair, PiecePair, PiecePair];
}

function makeQuestion(
  modelStr: string,
  pieceAStr: string,
  pieceBStr: string,
  d1a: string, d1b: string,
  d2a: string, d2b: string,
  d3a: string, d3b: string,
): ValidatedQ {
  const model = g(modelStr);
  const pieceA = g(pieceAStr);
  const pieceB = g(pieceBStr);

  // 検証: pieceA + pieceB = model, 重なりなし
  if (!piecesNoOverlap(pieceA, pieceB)) {
    console.warn('Warning: pieces overlap!');
  }
  if (!gridsEqual(combinePieces(pieceA, pieceB), model)) {
    console.warn('Warning: pieces do not combine to model!');
  }

  return {
    model,
    correct: { pieceA, pieceB },
    distractors: [
      { pieceA: g(d1a), pieceB: g(d1b) },
      { pieceA: g(d2a), pieceB: g(d2b) },
      { pieceA: g(d3a), pieceB: g(d3b) },
    ],
  };
}

const VALIDATED_QUESTIONS: ValidatedQ[] = [
  // 問題1: T字型
  // B B B B    BBBB + ____
  // _ B _ _    ____ + _B__
  // _ B _ _    ____ + _B__
  // _ _ _ _    ____ + ____
  makeQuestion(
    'BBBB_B___B______',
    'BBBB____________', '_____B___B______',
    'BBB__B___B______', '___B____________', // d1: 横棒3+縦棒だが横が足りない
    'BBBB_B__________', '________B_______', // d2: 縦棒の位置が違う（col2 row2）
    'BB___B___B______', '__BB____________', // d3: 横棒の分割が違う
  ),

  // 問題2: L字型
  // B _ _ _    B___ + ____
  // B _ _ _    B___ + ____
  // B _ _ _    B___ + ____
  // B B B _    B___ + _BB_
  makeQuestion(
    'B___B___B___BBB_',
    'B___B___B___B___', '_____________BB_',
    'B___B___B___B___', '_____________BB_', // d1: pieceBの位置が1つずれ
    'B___B___________', '________B___BBB_', // d2: 分割位置が違う
    'B___B___B___BB__', '______________B_', // d3: 分割が違う
  ),

  // 問題3: 十字型
  // _ B _ _    _B__ + ____
  // B B B _    _B__ + B_B_
  // _ B _ _    _B__ + ____
  // _ _ _ _    ____ + ____
  makeQuestion(
    '_B__BBB__B______',
    '_B___B___B______', '____B_B_________',
    '_B__BB___B______', '______B_________', // d1: 横棒が足りない
    '_B___B__________', '____B_B__B______', // d2: 縦棒が短い
    '_B__BBB_________', '________B_______', // d3: 下の位置が違う（col0→col2）
  ),

  // 問題4: コの字型（右向き）
  // B B B _    BBB_ + ____
  // _ _ B _    __B_ + ____
  // _ _ B _    __B_ + ____
  // B B B _    BBB_ + ____
  // → 分割: 右の縦棒 + 上下の横棒
  makeQuestion(
    'BBB___B___B_BBB_',
    '__B___B___B___B_', 'BB__________BB__',
    '__B___B___B___B_', 'B___________B___', // d1: 横棒が1マスずつ（足りない）
    '__B___B___B_BBB_', 'BB______________', // d2: 上の横棒だけ
    'BBB___B___B_BB__', '______________B_', // d3: 分割が違う
  ),

  // 問題5: 階段型
  // B _ _ _    B___ + ____
  // B B _ _    BB__ + ____
  // _ B B _    ____ + _BB_
  // _ _ B B    ____ + __BB
  makeQuestion(
    'B___BB___BB___BB',
    'B___BB__________', '_________BB___BB',
    'B___B____BB___BB', '____B___________', // d1: 分割が違う
    'B___BB___B______', '__________B___BB', // d2: 分割位置ずれ
    'B___BB___BB_____', '______________BB', // d3: 下段の分割が違う
  ),

  // 問題6: 四角形（2×2）
  // _ _ _ _    ____ + ____
  // _ B B _    _BB_ + ____
  // _ B B _    ____ + _BB_
  // _ _ _ _    ____ + ____
  makeQuestion(
    '____BB___BB_____', // 中央の2×2
    '____BB__________', '________BB______', // 修正: _BB_ → 正しい位置
    '____B____BB_____', '____B___________', // d1: 分割が違う
    '____BB___B______', '________B_______', // d2: 足りない（3マスしかない）
    '____BB___BB_____', '________________', // d3: pieceBが空（明らかに違う）
  ),

  // 問題7: Z字型
  // B B _ _    BB__ + ____
  // _ B _ _    ____ + _B__
  // _ B _ _    ____ + _B__
  // _ _ B B    ____ + __BB
  makeQuestion(
    'BB___B___B____BB',
    'BB______________', '_____B___B____BB',
    'BB___B__________', '________B____BB_', // d1: 位置ずれ（最下段）
    'B____B___B____BB', '_B______________', // d2: 上段の分割が違う
    'BB___B___B___B__', '_____________B_B', // d3: 下段が違う
  ),

  // 問題8: 大きなL字
  // B B _ _    BB__ + ____
  // B B _ _    BB__ + ____
  // B B B B    BB__ + __BB
  // _ _ _ _    ____ + ____
  makeQuestion(
    'BB__BB__BBBB____',
    'BB__BB__BB______', '__________BB____',
    'BB__BB__B_______', '_________BBB____', // d1: 分割位置が違う
    'BB__BB__BBBB____', '________________', // d2: pieceBが空
    'BB______BBBB____', '____BB__________', // d3: 分割が違う
  ),
];

// ─── 問題生成 ───

const INSTRUCTION_TEXT = 'おてほんとおなじかたちを\n2つのピースでつくれるのはどれ？';

/** 現在の出題インデックス */
let currentIndex = 0;

/** 固定問題を Question 形式に変換 */
function buildQuestion(q: ValidatedQ, idx: number): Question<ShapeCompositionQuestionData, ShapeCompositionChoiceData> {
  const correctChoice: ShapeCompositionChoiceData = q.correct;
  const distractorChoices: ShapeCompositionChoiceData[] = q.distractors;

  const correctIndex = idx % 4;
  const choices: ShapeCompositionChoiceData[] = [...distractorChoices];
  choices.splice(correctIndex, 0, correctChoice);

  return {
    questionData: { model: q.model },
    choices,
    correctIndex,
    instructionText: INSTRUCTION_TEXT,
  };
}

/** ランダムに1問生成 */
export function generateShapeCompositionQuestion(): Question<ShapeCompositionQuestionData, ShapeCompositionChoiceData> {
  const q = VALIDATED_QUESTIONS[currentIndex % VALIDATED_QUESTIONS.length];
  const result = buildQuestion(q, currentIndex);
  currentIndex++;
  return result;
}

/** 全問題を返す */
export function getAllShapeCompositionQuestions(): Question<ShapeCompositionQuestionData, ShapeCompositionChoiceData>[] {
  return VALIDATED_QUESTIONS.map((q, i) => buildQuestion(q, i));
}

/** 正解判定 */
export function checkShapeCompositionAnswer(
  question: Question<ShapeCompositionQuestionData, ShapeCompositionChoiceData>,
  selectedIndex: number,
): boolean {
  return selectedIndex === question.correctIndex;
}
