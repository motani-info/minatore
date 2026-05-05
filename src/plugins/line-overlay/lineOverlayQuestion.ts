import type { Question } from '../../types/question';
import type {
  LineSegment,
  LineFigure,
  LineOverlayQuestionData,
  LineOverlayChoiceData,
} from './types';

/** 線分を正規化する（from < to の順序に統一） */
function normalizeSegment(seg: LineSegment): LineSegment {
  const fromKey = seg.from.row * 4 + seg.from.col;
  const toKey = seg.to.row * 4 + seg.to.col;
  if (fromKey <= toKey) return seg;
  return { from: seg.to, to: seg.from };
}

/** 線分のキー文字列を生成する */
function segmentKey(seg: LineSegment): string {
  const n = normalizeSegment(seg);
  return `${n.from.col},${n.from.row}-${n.to.col},${n.to.row}`;
}

/** 図形のキー文字列を生成する（線分の集合として比較用） */
function figureKey(figure: LineFigure): string {
  const keys = figure.map(segmentKey).sort();
  return keys.join('|');
}

/** 2つの図形が同一か判定する */
export function figuresEqual(a: LineFigure, b: LineFigure): boolean {
  return figureKey(a) === figureKey(b);
}

/** 2つの図形を重ね合わせた結果を計算する（和集合） */
export function overlayFigures(a: LineFigure, b: LineFigure): LineFigure {
  const result: LineFigure = [...a];
  const usedKeys = new Set(a.map(segmentKey));

  for (const seg of b) {
    const key = segmentKey(seg);
    if (!usedKeys.has(key)) {
      usedKeys.add(key);
      result.push(seg);
    }
  }

  return result;
}

// ─── 固定問題プール ───

interface FixedLineOverlayQ {
  figureA: LineFigure;
  figureB: LineFigure;
  choices: LineOverlayChoiceData[];
  correctIndex: number;
}

// Helper to create segments concisely: s(c1,r1, c2,r2)
function s(c1: number, r1: number, c2: number, r2: number): LineSegment {
  return { from: { col: c1, row: r1 }, to: { col: c2, row: r2 } };
}

const FIXED_QUESTIONS: FixedLineOverlayQ[] = [
  // Q1: Simple L-shapes
  {
    figureA: [s(0,0, 0,2), s(0,2, 2,2)],
    figureB: [s(1,0, 3,0), s(3,0, 3,2)],
    choices: [
      [s(0,0, 0,2), s(0,2, 2,2), s(1,0, 3,0), s(3,0, 3,2)],
      [s(0,0, 0,2), s(0,2, 2,2), s(1,0, 3,0), s(3,0, 3,1)],
      [s(0,0, 0,2), s(0,2, 2,2), s(1,1, 3,1), s(3,0, 3,2)],
      [s(0,0, 0,1), s(0,2, 2,2), s(1,0, 3,0), s(3,0, 3,2)],
    ],
    correctIndex: 0,
  },
  // Q2: Cross pattern
  {
    figureA: [s(1,0, 1,3), s(0,1, 3,1)],
    figureB: [s(2,0, 2,3), s(0,2, 3,2)],
    choices: [
      [s(1,0, 1,3), s(0,1, 3,1), s(2,0, 2,3), s(0,2, 3,2)],
      [s(1,0, 1,3), s(0,1, 3,1), s(2,0, 2,3), s(0,3, 3,3)],
      [s(1,0, 1,3), s(0,1, 3,1), s(2,0, 2,2), s(0,2, 3,2)],
      [s(1,0, 1,2), s(0,1, 3,1), s(2,0, 2,3), s(0,2, 3,2)],
    ],
    correctIndex: 0,
  },
  // Q3: Diagonal lines
  {
    figureA: [s(0,0, 3,3), s(0,1, 2,3)],
    figureB: [s(3,0, 0,3), s(1,0, 3,2)],
    choices: [
      [s(0,0, 3,3), s(0,1, 2,3), s(3,0, 0,3), s(1,0, 3,2)],
      [s(0,0, 3,3), s(0,1, 2,3), s(3,0, 0,3), s(1,0, 2,2)],
      [s(0,0, 3,3), s(0,1, 2,3), s(3,1, 0,3), s(1,0, 3,2)],
      [s(0,0, 3,3), s(0,2, 2,3), s(3,0, 0,3), s(1,0, 3,2)],
    ],
    correctIndex: 0,
  },
  // Q4: Box shapes
  {
    figureA: [s(0,0, 2,0), s(2,0, 2,2), s(2,2, 0,2)],
    figureB: [s(1,1, 3,1), s(3,1, 3,3), s(3,3, 1,3)],
    choices: [
      [s(0,0, 2,0), s(2,0, 2,2), s(2,2, 0,2), s(1,1, 3,1), s(3,1, 3,3), s(3,3, 1,3)],
      [s(0,0, 2,0), s(2,0, 2,2), s(2,2, 0,2), s(1,1, 3,1), s(3,1, 3,3), s(3,3, 1,2)],
      [s(0,0, 2,0), s(2,0, 2,2), s(2,2, 0,2), s(1,1, 3,1), s(3,1, 3,2), s(3,3, 1,3)],
      [s(0,0, 2,0), s(2,0, 2,1), s(2,2, 0,2), s(1,1, 3,1), s(3,1, 3,3), s(3,3, 1,3)],
    ],
    correctIndex: 0,
  },
  // Q5: Zigzag
  {
    figureA: [s(0,0, 1,1), s(1,1, 2,0), s(2,0, 3,1)],
    figureB: [s(0,2, 1,3), s(1,3, 2,2), s(2,2, 3,3)],
    choices: [
      [s(0,0, 1,1), s(1,1, 2,0), s(2,0, 3,1), s(0,2, 1,3), s(1,3, 2,2), s(2,2, 3,3)],
      [s(0,0, 1,1), s(1,1, 2,0), s(2,0, 3,1), s(0,2, 1,3), s(1,3, 2,2), s(2,2, 3,2)],
      [s(0,0, 1,1), s(1,1, 2,0), s(2,0, 3,1), s(0,2, 1,2), s(1,3, 2,2), s(2,2, 3,3)],
      [s(0,0, 1,1), s(1,1, 2,1), s(2,0, 3,1), s(0,2, 1,3), s(1,3, 2,2), s(2,2, 3,3)],
    ],
    correctIndex: 0,
  },
  // Q6: Horizontal lines
  {
    figureA: [s(0,0, 3,0), s(0,2, 3,2)],
    figureB: [s(0,1, 3,1), s(0,3, 3,3)],
    choices: [
      [s(0,0, 3,0), s(0,2, 3,2), s(0,1, 3,1), s(0,3, 3,3)],
      [s(0,0, 3,0), s(0,2, 3,2), s(0,1, 3,1), s(0,3, 2,3)],
      [s(0,0, 3,0), s(0,2, 3,2), s(0,1, 2,1), s(0,3, 3,3)],
      [s(0,0, 3,0), s(0,2, 2,2), s(0,1, 3,1), s(0,3, 3,3)],
    ],
    correctIndex: 0,
  },
  // Q7: Triangle-like
  {
    figureA: [s(1,0, 0,2), s(0,2, 2,2)],
    figureB: [s(1,0, 2,2), s(2,1, 3,3)],
    choices: [
      [s(1,0, 0,2), s(0,2, 2,2), s(1,0, 2,2), s(2,1, 3,3)],
      [s(1,0, 0,2), s(0,2, 2,2), s(1,0, 2,2), s(2,1, 3,2)],
      [s(1,0, 0,2), s(0,2, 2,2), s(1,1, 2,2), s(2,1, 3,3)],
      [s(1,0, 0,2), s(0,2, 1,2), s(1,0, 2,2), s(2,1, 3,3)],
    ],
    correctIndex: 0,
  },
  // Q8: Vertical lines
  {
    figureA: [s(0,0, 0,3), s(2,0, 2,3)],
    figureB: [s(1,0, 1,3), s(3,0, 3,3)],
    choices: [
      [s(0,0, 0,3), s(2,0, 2,3), s(1,0, 1,3), s(3,0, 3,3)],
      [s(0,0, 0,3), s(2,0, 2,3), s(1,0, 1,3), s(3,0, 3,2)],
      [s(0,0, 0,3), s(2,0, 2,2), s(1,0, 1,3), s(3,0, 3,3)],
      [s(0,0, 0,2), s(2,0, 2,3), s(1,0, 1,3), s(3,0, 3,3)],
    ],
    correctIndex: 0,
  },
  // Q9: Star-like pattern with shared segment
  {
    figureA: [s(1,1, 3,1), s(1,1, 1,3)],
    figureB: [s(1,1, 3,3), s(1,1, 0,0)],
    choices: [
      [s(1,1, 3,1), s(1,1, 1,3), s(1,1, 3,3), s(1,1, 0,0)],
      [s(1,1, 3,1), s(1,1, 1,3), s(1,1, 3,3), s(1,1, 0,1)],
      [s(1,1, 3,1), s(1,1, 1,3), s(1,1, 3,2), s(1,1, 0,0)],
      [s(1,1, 3,1), s(1,1, 1,2), s(1,1, 3,3), s(1,1, 0,0)],
    ],
    correctIndex: 0,
  },
  // Q10: Overlapping segments (figureA and figureB share one segment)
  {
    figureA: [s(0,0, 3,0), s(0,0, 0,3)],
    figureB: [s(0,0, 3,0), s(3,0, 3,3)],
    choices: [
      [s(0,0, 3,0), s(0,0, 0,3), s(3,0, 3,3)],
      [s(0,0, 3,0), s(0,0, 0,3), s(3,0, 3,3), s(0,3, 3,3)],
      [s(0,0, 3,0), s(0,0, 0,3), s(3,1, 3,3)],
      [s(0,0, 3,0), s(0,0, 0,2), s(3,0, 3,3)],
    ],
    correctIndex: 0,
  },
];

/** 現在の出題インデックス */
let currentIndex = 0;

/** 問題を順番に生成する */
export function generateLineOverlayQuestion(): Question<LineOverlayQuestionData, LineOverlayChoiceData> {
  const questions = getAllLineOverlayQuestions();
  const question = questions[currentIndex % questions.length];
  currentIndex++;
  return question;
}

/** 固定問題プールの全問題を返す */
export function getAllLineOverlayQuestions(): Question<LineOverlayQuestionData, LineOverlayChoiceData>[] {
  return FIXED_QUESTIONS.map((q) => ({
    questionData: { figureA: q.figureA, figureB: q.figureB },
    choices: q.choices,
    correctIndex: q.correctIndex,
    instructionText: 'ひだりの 2つの かたちを\nぴったり かさねたら どうなりますか？',
  }));
}

/** 正解判定関数 */
export function checkLineOverlayAnswer(
  question: Question<LineOverlayQuestionData, LineOverlayChoiceData>,
  selectedIndex: number,
): boolean {
  return selectedIndex === question.correctIndex;
}
