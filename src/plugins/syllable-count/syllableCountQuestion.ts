import type { Question } from '../../types/question';
import type { SyllableCountQuestionData, SyllableCountChoiceData } from './types';

// ─── 固定問題プール ───

interface FixedSyllableCountQ {
  word: string;
  syllableCount: number;
  emoji: string;
  correctIndex: number;
}

// Choices are always [2, 3, 4, 5] with the given emoji
// correctIndex = syllableCount - 2

const FIXED_QUESTIONS: FixedSyllableCountQ[] = [
  // 2文字 (correctIndex: 0)
  { word: 'いぬ', syllableCount: 2, emoji: '🐶', correctIndex: 0 },
  { word: 'ねこ', syllableCount: 2, emoji: '🐱', correctIndex: 0 },
  { word: 'うし', syllableCount: 2, emoji: '🐻', correctIndex: 0 },
  { word: 'そら', syllableCount: 2, emoji: '🐸', correctIndex: 0 },
  // 3文字 (correctIndex: 1)
  { word: 'トマト', syllableCount: 3, emoji: '🐰', correctIndex: 1 },
  { word: 'りんご', syllableCount: 3, emoji: '🐥', correctIndex: 1 },
  { word: 'うさぎ', syllableCount: 3, emoji: '🐷', correctIndex: 1 },
  { word: 'みかん', syllableCount: 3, emoji: '🐵', correctIndex: 1 },
  // 4文字 (correctIndex: 2)
  { word: 'ひまわり', syllableCount: 4, emoji: '🐶', correctIndex: 2 },
  { word: 'おにぎり', syllableCount: 4, emoji: '🐱', correctIndex: 2 },
  { word: 'えんぴつ', syllableCount: 4, emoji: '🐰', correctIndex: 2 },
  { word: 'おりがみ', syllableCount: 4, emoji: '🐻', correctIndex: 2 },
  // 5文字 (correctIndex: 3)
  { word: 'かたつむり', syllableCount: 5, emoji: '🐸', correctIndex: 3 },
  { word: 'てんとうむし', syllableCount: 5, emoji: '🐥', correctIndex: 3 },
  { word: 'おかあさん', syllableCount: 5, emoji: '🐷', correctIndex: 3 },
  { word: 'しんかんせん', syllableCount: 5, emoji: '🐵', correctIndex: 3 },
];

/** 現在の出題インデックス */
let currentIndex = 0;

/** 問題を順番に生成する */
export function generateSyllableCountQuestion(): Question<SyllableCountQuestionData, SyllableCountChoiceData> {
  const questions = getAllSyllableCountQuestions();
  const question = questions[currentIndex % questions.length];
  currentIndex++;
  return question;
}

/** 固定問題プールの全問題を返す */
export function getAllSyllableCountQuestions(): Question<SyllableCountQuestionData, SyllableCountChoiceData>[] {
  return FIXED_QUESTIONS.map((q) => {
    const allCounts = [2, 3, 4, 5];
    const choices: SyllableCountChoiceData[] = allCounts.map((count) => ({
      count,
      emoji: q.emoji,
    }));

    return {
      questionData: { word: q.word, syllableCount: q.syllableCount },
      choices,
      correctIndex: q.correctIndex,
      instructionText: `「${q.word}」とおなじかずの\nなかまはどれ？`,
    };
  });
}

/** 正解判定 */
export function checkSyllableCountAnswer(
  question: Question<SyllableCountQuestionData, SyllableCountChoiceData>,
  selectedIndex: number
): boolean {
  return selectedIndex === question.correctIndex;
}
