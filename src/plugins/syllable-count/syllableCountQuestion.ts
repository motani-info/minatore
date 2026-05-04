import type { Question } from '../../types/question';
import type { SyllableCountQuestionData, SyllableCountChoiceData } from './types';

/** 単語データベース（文字数＝音の数ごと） */
const WORD_DB: Record<number, string[]> = {
  2: ['いぬ', 'ねこ', 'うし', 'さる', 'くま', 'はな', 'やま', 'かわ', 'そら', 'つき', 'ふね', 'まど'],
  3: ['トマト', 'りんご', 'うさぎ', 'きりん', 'たぬき', 'さくら', 'めだか', 'かえる', 'すずめ', 'みかん', 'バナナ', 'たまご'],
  4: ['ひまわり', 'おにぎり', 'えんぴつ', 'おりがみ', 'ぶらんこ', 'タンポポ', 'とんぼのめ', 'しんごうき', 'すいとう'],
  5: ['かたつむり', 'てんとうむし', 'おかあさん', 'しんかんせん', 'おばけやしき', 'ひこうきぐも'],
};

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const ANIMAL_EMOJIS = ['🐶', '🐱', '🐰', '🐻', '🐸', '🐥', '🐷', '🐵'];

/** 問題を生成する */
export function generateSyllableCountQuestion(): Question<SyllableCountQuestionData, SyllableCountChoiceData> {
  // 出題する文字数を選択（2〜5）
  const targetCount = randomInt(2, 5);
  const words = WORD_DB[targetCount];
  const word = randomItem(words);
  const emoji = randomItem(ANIMAL_EMOJIS);

  // 選択肢: 2, 3, 4, 5 のグループ
  const allCounts = [2, 3, 4, 5];
  const correctIndex = allCounts.indexOf(targetCount);

  const choices: SyllableCountChoiceData[] = allCounts.map(count => ({
    count,
    emoji,
  }));

  return {
    questionData: { word, syllableCount: targetCount },
    choices,
    correctIndex,
    instructionText: `「${word}」とおなじかずの\nなかまはどれ？`,
  };
}

/** 正解判定 */
export function checkSyllableCountAnswer(
  question: Question<SyllableCountQuestionData, SyllableCountChoiceData>,
  selectedIndex: number
): boolean {
  return selectedIndex === question.correctIndex;
}
