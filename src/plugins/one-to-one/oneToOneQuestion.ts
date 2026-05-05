import type { Question } from '../../types/question';
import type { OneToOneQuestionData, OneToOneChoiceData } from './types';

// ─── 固定問題プール ───

interface FixedOneToOneQ {
  topEmoji: string;
  topName: string;
  topCount: number;
  bottomEmoji: string;
  bottomName: string;
  bottomCount: number;
  choices: OneToOneChoiceData[];
  correctIndex: number;
}

const FIXED_QUESTIONS: FixedOneToOneQ[] = [
  // Q1: とり5 > おうち3 → とりが2あまる
  {
    topEmoji: '🐤', topName: 'とり', topCount: 5,
    bottomEmoji: '🏠', bottomName: 'おうち', bottomCount: 3,
    choices: [
      { text: '🐤が2あまる' },
      { text: '🏠が2あまる' },
      { text: '🐤が3あまる' },
      { text: 'ぴったり' },
    ],
    correctIndex: 0,
  },
  // Q2: いぬ3 < ほね5 → ほねが2あまる
  {
    topEmoji: '🐶', topName: 'いぬ', topCount: 3,
    bottomEmoji: '🦴', bottomName: 'ほね', bottomCount: 5,
    choices: [
      { text: '🐶が2あまる' },
      { text: '🦴が2あまる' },
      { text: '🦴が3あまる' },
      { text: 'ぴったり' },
    ],
    correctIndex: 1,
  },
  // Q3: ねこ6 > さかな4 → ねこが2あまる
  {
    topEmoji: '🐱', topName: 'ねこ', topCount: 6,
    bottomEmoji: '🐟', bottomName: 'さかな', bottomCount: 4,
    choices: [
      { text: 'ぴったり' },
      { text: '🐱が2あまる' },
      { text: '🐟が2あまる' },
      { text: '🐱が3あまる' },
    ],
    correctIndex: 1,
  },
  // Q4: こども4 < かばん7 → かばんが3あまる
  {
    topEmoji: '🧒', topName: 'こども', topCount: 4,
    bottomEmoji: '🎒', bottomName: 'かばん', bottomCount: 7,
    choices: [
      { text: '🧒が3あまる' },
      { text: '🎒が4あまる' },
      { text: 'ぴったり' },
      { text: '🎒が3あまる' },
    ],
    correctIndex: 3,
  },
  // Q5: うさぎ7 > にんじん5 → うさぎが2あまる
  {
    topEmoji: '🐰', topName: 'うさぎ', topCount: 7,
    bottomEmoji: '🥕', bottomName: 'にんじん', bottomCount: 5,
    choices: [
      { text: '🥕が2あまる' },
      { text: '🐰が3あまる' },
      { text: '🐰が2あまる' },
      { text: 'ぴったり' },
    ],
    correctIndex: 2,
  },
  // Q6: とり3 < おうち6 → おうちが3あまる
  {
    topEmoji: '🐤', topName: 'とり', topCount: 3,
    bottomEmoji: '🏠', bottomName: 'おうち', bottomCount: 6,
    choices: [
      { text: '🏠が3あまる' },
      { text: '🐤が3あまる' },
      { text: '🏠が4あまる' },
      { text: 'ぴったり' },
    ],
    correctIndex: 0,
  },
  // Q7: いぬ6 > ほね4 → いぬが2あまる
  {
    topEmoji: '🐶', topName: 'いぬ', topCount: 6,
    bottomEmoji: '🦴', bottomName: 'ほね', bottomCount: 4,
    choices: [
      { text: 'ぴったり' },
      { text: '🦴が2あまる' },
      { text: '🐶が3あまる' },
      { text: '🐶が2あまる' },
    ],
    correctIndex: 3,
  },
  // Q8: ねこ4 < さかな7 → さかなが3あまる
  {
    topEmoji: '🐱', topName: 'ねこ', topCount: 4,
    bottomEmoji: '🐟', bottomName: 'さかな', bottomCount: 7,
    choices: [
      { text: '🐱が3あまる' },
      { text: '🐟が3あまる' },
      { text: '🐟が4あまる' },
      { text: 'ぴったり' },
    ],
    correctIndex: 1,
  },
  // Q9: こども5 > かばん3 → こどもが2あまる
  {
    topEmoji: '🧒', topName: 'こども', topCount: 5,
    bottomEmoji: '🎒', bottomName: 'かばん', bottomCount: 3,
    choices: [
      { text: '🧒が2あまる' },
      { text: '🎒が2あまる' },
      { text: '🧒が3あまる' },
      { text: 'ぴったり' },
    ],
    correctIndex: 0,
  },
  // Q10: うさぎ3 < にんじん6 → にんじんが3あまる
  {
    topEmoji: '🐰', topName: 'うさぎ', topCount: 3,
    bottomEmoji: '🥕', bottomName: 'にんじん', bottomCount: 6,
    choices: [
      { text: 'ぴったり' },
      { text: '🐰が3あまる' },
      { text: '🥕が4あまる' },
      { text: '🥕が3あまる' },
    ],
    correctIndex: 3,
  },
];

/** 現在の出題インデックス */
let currentIndex = 0;

/** 問題を順番に生成する */
export function generateOneToOneQuestion(): Question<OneToOneQuestionData, OneToOneChoiceData> {
  const questions = getAllOneToOneQuestions();
  const question = questions[currentIndex % questions.length];
  currentIndex++;
  return question;
}

/** 固定問題プールの全問題を返す */
export function getAllOneToOneQuestions(): Question<OneToOneQuestionData, OneToOneChoiceData>[] {
  return FIXED_QUESTIONS.map((q) => ({
    questionData: {
      topEmoji: q.topEmoji,
      topName: q.topName,
      topCount: q.topCount,
      bottomEmoji: q.bottomEmoji,
      bottomName: q.bottomName,
      bottomCount: q.bottomCount,
    },
    choices: q.choices,
    correctIndex: q.correctIndex,
    instructionText: `${q.topName}さんが1ぴきずつ\n${q.bottomName}にはいります。\nどうなりますか？`,
  }));
}

/** 正解判定 */
export function checkOneToOneAnswer(
  question: Question<OneToOneQuestionData, OneToOneChoiceData>,
  selectedIndex: number
): boolean {
  return selectedIndex === question.correctIndex;
}
