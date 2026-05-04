import type { Question } from '../../types/question';
import type { SeesawQuestionData, SeesawChoiceData, SeesawItem, SeesawState } from './types';

/** 固定問題セット */
const QUESTION_POOL: Array<{
  items: [SeesawItem, SeesawItem, SeesawItem];
  seesaws: [SeesawState, SeesawState];
  heaviestIndex: number;
  lightestIndex: number;
}> = [
  // 問題(1): 魚 > なす > きゅうり
  {
    items: [
      { emoji: '🐟', name: 'さかな', weight: 3 },
      { emoji: '🍆', name: 'なす', weight: 2 },
      { emoji: '🥒', name: 'きゅうり', weight: 1 },
    ],
    seesaws: [
      {
        left: { emoji: '🐟', name: 'さかな', weight: 3 },
        right: { emoji: '🍆', name: 'なす', weight: 2 },
        tilt: 'left',
      },
      {
        left: { emoji: '🍆', name: 'なす', weight: 2 },
        right: { emoji: '🥒', name: 'きゅうり', weight: 1 },
        tilt: 'left',
      },
    ],
    heaviestIndex: 0,
    lightestIndex: 2,
  },
  // 問題(2): 魚 > バナナ > なす
  {
    items: [
      { emoji: '🐟', name: 'さかな', weight: 3 },
      { emoji: '🍌', name: 'バナナ', weight: 2 },
      { emoji: '🍆', name: 'なす', weight: 1 },
    ],
    seesaws: [
      {
        left: { emoji: '🍆', name: 'なす', weight: 1 },
        right: { emoji: '🐟', name: 'さかな', weight: 3 },
        tilt: 'right',
      },
      {
        left: { emoji: '🐟', name: 'さかな', weight: 3 },
        right: { emoji: '🍌', name: 'バナナ', weight: 2 },
        tilt: 'left',
      },
    ],
    heaviestIndex: 0,
    lightestIndex: 2,
  },
  // 問題(3): スイカ > りんご > バナナ
  {
    items: [
      { emoji: '🍉', name: 'すいか', weight: 3 },
      { emoji: '🍎', name: 'りんご', weight: 2 },
      { emoji: '🍌', name: 'バナナ', weight: 1 },
    ],
    seesaws: [
      {
        left: { emoji: '🍎', name: 'りんご', weight: 2 },
        right: { emoji: '🍉', name: 'すいか', weight: 3 },
        tilt: 'right',
      },
      {
        left: { emoji: '🍌', name: 'バナナ', weight: 1 },
        right: { emoji: '🍎', name: 'りんご', weight: 2 },
        tilt: 'right',
      },
    ],
    heaviestIndex: 0,
    lightestIndex: 2,
  },
  // 問題(4): かたつむり > かぶとむし > バッタ
  {
    items: [
      { emoji: '🐌', name: 'かたつむり', weight: 3 },
      { emoji: '🪲', name: 'かぶとむし', weight: 2 },
      { emoji: '🦗', name: 'バッタ', weight: 1 },
    ],
    seesaws: [
      {
        left: { emoji: '🐌', name: 'かたつむり', weight: 3 },
        right: { emoji: '🪲', name: 'かぶとむし', weight: 2 },
        tilt: 'left',
      },
      {
        left: { emoji: '🦗', name: 'バッタ', weight: 1 },
        right: { emoji: '🐌', name: 'かたつむり', weight: 3 },
        tilt: 'right',
      },
    ],
    heaviestIndex: 0,
    lightestIndex: 2,
  },
];

/** 出題済みインデックスを追跡（全問出題したらリセット） */
let usedIndices: number[] = [];

/** 問題を生成する */
export function generateSeesawQuestion(): Question<SeesawQuestionData, SeesawChoiceData> {
  // 未出題の問題からランダムに選択
  if (usedIndices.length >= QUESTION_POOL.length) {
    usedIndices = [];
  }

  const availableIndices = QUESTION_POOL
    .map((_, i) => i)
    .filter((i) => !usedIndices.includes(i));

  const selectedIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
  usedIndices.push(selectedIndex);

  const problem = QUESTION_POOL[selectedIndex];

  return {
    questionData: {
      seesaws: problem.seesaws,
      items: problem.items,
    },
    // choices配列は1要素（正解情報）のみ。この問題タイプでは4択UIを使わない
    choices: [
      {
        heaviestIndex: problem.heaviestIndex,
        lightestIndex: problem.lightestIndex,
      },
    ],
    correctIndex: 0,
    instructionText: 'いちばんおもいものには○、\nいちばんかるいものには×をつけましょう',
  };
}

/** 正解判定関数（カスタムUI用: marks配列を受け取る） */
export function checkSeesawAnswer(
  _question: Question<SeesawQuestionData, SeesawChoiceData>,
  _selectedIndex: number
): boolean {
  // この関数は共通フレームワークから呼ばれるが、
  // 実際の判定はカスタムUIコンポーネント内で行う
  // selectedIndex === 0 は正解を意味する（カスタムUIが正解時に0を渡す）
  return _selectedIndex === 0;
}

/** マーク配列から正解かどうかを判定する */
export function validateMarks(
  marks: Array<'circle' | 'cross' | null>,
  heaviestIndex: number,
  lightestIndex: number
): boolean {
  // 一番重いものに○がついているか
  if (marks[heaviestIndex] !== 'circle') return false;
  // 一番軽いものに×がついているか
  if (marks[lightestIndex] !== 'cross') return false;
  // 残りのアイテムにはマークがついていないか
  for (let i = 0; i < marks.length; i++) {
    if (i === heaviestIndex || i === lightestIndex) continue;
    if (marks[i] !== null) return false;
  }
  return true;
}
