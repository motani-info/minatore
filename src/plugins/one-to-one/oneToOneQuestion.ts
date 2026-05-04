import type { Question } from '../../types/question';
import type { OneToOneQuestionData, OneToOneChoiceData } from './types';

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const PAIRS = [
  { topEmoji: '🐤', topName: 'とり', bottomEmoji: '🏠', bottomName: 'おうち' },
  { topEmoji: '🐶', topName: 'いぬ', bottomEmoji: '🦴', bottomName: 'ほね' },
  { topEmoji: '🐱', topName: 'ねこ', bottomEmoji: '🐟', bottomName: 'さかな' },
  { topEmoji: '🧒', topName: 'こども', bottomEmoji: '🎒', bottomName: 'かばん' },
  { topEmoji: '🐰', topName: 'うさぎ', bottomEmoji: '🥕', bottomName: 'にんじん' },
];

/** 問題を生成する */
export function generateOneToOneQuestion(): Question<OneToOneQuestionData, OneToOneChoiceData> {
  const pair = randomItem(PAIRS);
  const topCount = randomInt(3, 7);
  let bottomCount: number;
  // 必ず差をつける
  do {
    bottomCount = randomInt(3, 7);
  } while (bottomCount === topCount);

  const diff = Math.abs(topCount - bottomCount);
  const topMore = topCount > bottomCount;

  // 正解テキスト
  const correctText = topMore
    ? `${pair.topEmoji}が${diff}あまる`
    : `${pair.bottomEmoji}が${diff}あまる`;

  // 選択肢を生成
  const choiceTexts: string[] = [];

  // 正解を追加
  choiceTexts.push(correctText);

  // ダミー: 逆のアイテムが余る
  choiceTexts.push(
    topMore
      ? `${pair.bottomEmoji}が${diff}あまる`
      : `${pair.topEmoji}が${diff}あまる`
  );

  // ダミー: 数が1ずれる
  choiceTexts.push(
    topMore
      ? `${pair.topEmoji}が${diff + 1}あまる`
      : `${pair.bottomEmoji}が${diff + 1}あまる`
  );

  // ダミー: ぴったり
  choiceTexts.push('ぴったり');

  // シャッフル
  const indices = [0, 1, 2, 3];
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  const choices: OneToOneChoiceData[] = indices.map(i => ({ text: choiceTexts[i] }));
  const correctIndex = indices.indexOf(0);

  return {
    questionData: {
      topEmoji: pair.topEmoji,
      topName: pair.topName,
      topCount,
      bottomEmoji: pair.bottomEmoji,
      bottomName: pair.bottomName,
      bottomCount,
    },
    choices,
    correctIndex,
    instructionText: `${pair.topName}さんが1ぴきずつ\n${pair.bottomName}にはいります。\nどうなりますか？`,
  };
}

/** 正解判定 */
export function checkOneToOneAnswer(
  question: Question<OneToOneQuestionData, OneToOneChoiceData>,
  selectedIndex: number
): boolean {
  return selectedIndex === question.correctIndex;
}
