import type { Question } from '../../types/question';
import type { SeesawQuestionData, SeesawChoiceData, SeesawItem, SeesawState } from './types';

/** 固定問題セット */
const QUESTION_POOL: Array<{
  items: SeesawItem[];
  seesaws: SeesawState[];
  heaviestIndex: number;
  lightestIndex: number;
}> = [
  // ─── 既存問題（絵文字ベース） ───

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

  // ─── 図形問題（SVGベース・天秤2つ） ───

  // 問題(5): ★ > ● > ⬡（黒星 > 黒丸 > 六角形）
  // 左上の問題: 天秤1: ★(左) > ●(右)、天秤2: ●(左) > ⬡(右)
  {
    items: [
      { emoji: '★', name: 'ほし', weight: 3, shape: 'star-black' },
      { emoji: '●', name: 'まる', weight: 2, shape: 'circle-black' },
      { emoji: '⬡', name: 'ろっかく', weight: 1, shape: 'hexagon-black' },
    ],
    seesaws: [
      {
        left: { emoji: '★', name: 'ほし', weight: 3, shape: 'star-black' },
        right: { emoji: '●', name: 'まる', weight: 2, shape: 'circle-black' },
        tilt: 'left',
      },
      {
        left: { emoji: '●', name: 'まる', weight: 2, shape: 'circle-black' },
        right: { emoji: '⬡', name: 'ろっかく', weight: 1, shape: 'hexagon-black' },
        tilt: 'left',
      },
    ],
    heaviestIndex: 0,
    lightestIndex: 2,
  },

  // 問題(6): ★ > ◇ > ○（黒星 > ダイヤ星 > 白丸）
  // 右上の問題: 天秤1: ★(左) > ◇(右)、天秤2: ◇(左) > ○(右)
  {
    items: [
      { emoji: '★', name: 'ほし', weight: 3, shape: 'star-black' },
      { emoji: '◇', name: 'ダイヤ', weight: 2, shape: 'diamond-star' },
      { emoji: '○', name: 'まる', weight: 1, shape: 'circle-ring' },
    ],
    seesaws: [
      {
        left: { emoji: '★', name: 'ほし', weight: 3, shape: 'star-black' },
        right: { emoji: '◇', name: 'ダイヤ', weight: 2, shape: 'diamond-star' },
        tilt: 'left',
      },
      {
        left: { emoji: '◇', name: 'ダイヤ', weight: 2, shape: 'diamond-star' },
        right: { emoji: '○', name: 'まる', weight: 1, shape: 'circle-ring' },
        tilt: 'left',
      },
    ],
    heaviestIndex: 0,
    lightestIndex: 2,
  },

  // ─── 図形問題（SVGベース・天秤3つ） ───

  // 問題(7): ✚ > ⬠ > ■（十字 > 五角形 > 四角）
  // 左下の問題: 天秤1: ✚(左) > ■(右)、天秤2: ⬠(左) > ■(右)、天秤3: ✚(左) > ⬠(右)
  {
    items: [
      { emoji: '✚', name: 'じゅうじ', weight: 3, shape: 'cross-black' },
      { emoji: '⬠', name: 'ごかく', weight: 2, shape: 'pentagon-gray' },
      { emoji: '■', name: 'しかく', weight: 1, shape: 'square-black' },
    ],
    seesaws: [
      {
        left: { emoji: '✚', name: 'じゅうじ', weight: 3, shape: 'cross-black' },
        right: { emoji: '■', name: 'しかく', weight: 1, shape: 'square-black' },
        tilt: 'left',
      },
      {
        left: { emoji: '⬠', name: 'ごかく', weight: 2, shape: 'pentagon-gray' },
        right: { emoji: '■', name: 'しかく', weight: 1, shape: 'square-black' },
        tilt: 'left',
      },
      {
        left: { emoji: '✚', name: 'じゅうじ', weight: 3, shape: 'cross-black' },
        right: { emoji: '⬠', name: 'ごかく', weight: 2, shape: 'pentagon-gray' },
        tilt: 'left',
      },
    ],
    heaviestIndex: 0,
    lightestIndex: 2,
  },

  // 問題(8): ★ > ⬠ > ○（黒星 > 五角形 > 白丸）
  // 右下の問題: 天秤1: ★(左) > ⬠(右)、天秤2: ⬠(左) > ○(右)、天秤3: ◇(左) < ○(右) → ★ > ⬠ > ○
  {
    items: [
      { emoji: '★', name: 'ほし', weight: 3, shape: 'star-black' },
      { emoji: '⬠', name: 'ごかく', weight: 2, shape: 'pentagon-gray' },
      { emoji: '○', name: 'まる', weight: 1, shape: 'circle-ring' },
    ],
    seesaws: [
      {
        left: { emoji: '★', name: 'ほし', weight: 3, shape: 'star-black' },
        right: { emoji: '⬠', name: 'ごかく', weight: 2, shape: 'pentagon-gray' },
        tilt: 'left',
      },
      {
        left: { emoji: '⬠', name: 'ごかく', weight: 2, shape: 'pentagon-gray' },
        right: { emoji: '○', name: 'まる', weight: 1, shape: 'circle-ring' },
        tilt: 'left',
      },
      {
        left: { emoji: '○', name: 'まる', weight: 1, shape: 'circle-ring' },
        right: { emoji: '★', name: 'ほし', weight: 3, shape: 'star-black' },
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
