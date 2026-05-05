import type { Question } from '../../types/question';
import type { LineSegment, LineFigure } from '../line-overlay/types';
import type { LineDecomposeQuestionData, LineDecomposeChoiceData } from './types';

// Helper to create segments concisely: s(col1,row1, col2,row2)
function s(c1: number, r1: number, c2: number, r2: number): LineSegment {
  return { from: { col: c1, row: r1 }, to: { col: c2, row: r2 } };
}

// ─── 固定問題プール ───
// 画像から読み取った問題:
// お手本（完成形）= givenFigure + missingFigure（正解）
// 選択肢は missingFigure（正解）+ 3つのダミー

interface FixedLineDecomposeQ {
  /** お手本（完成形） */
  completeFigure: LineFigure;
  /** 与えられた構成図形 */
  givenFigure: LineFigure;
  /** 選択肢（足りない線図形の候補） */
  choices: LineDecomposeChoiceData[];
  /** 正解のインデックス */
  correctIndex: number;
}

const FIXED_QUESTIONS: FixedLineDecomposeQ[] = [
  // ─── 例題: 大きな四角形 ───
  // お手本: 外周の四角形（0,0→3,0→3,3→0,3→0,0）
  // 与えられた図形: 上辺と右辺（コの字の右上）
  // 足りない線: 下辺と左辺（コの字の左下）
  {
    completeFigure: [s(0,0, 3,0), s(3,0, 3,3), s(3,3, 0,3), s(0,3, 0,0)],
    givenFigure: [s(0,0, 3,0), s(3,0, 3,3)],
    choices: [
      [s(3,3, 0,3), s(0,3, 0,0)], // 正解: 下辺+左辺
      [s(3,3, 0,3), s(0,3, 0,1)], // ダミー: 左辺が短い
      [s(3,3, 1,3), s(0,3, 0,0)], // ダミー: 下辺が短い
      [s(2,3, 0,3), s(0,3, 0,0)], // ダミー: 下辺の始点が違う
    ],
    correctIndex: 0,
  },

  // ─── 問題1: 2つのひし形（ダイヤモンド） ───
  // お手本: 2つのひし形が横に並ぶ
  // 左ひし形: (1,0)→(0,1)→(1,2)→(2,1)→(1,0)
  // 右ひし形: (2,0)→(1,1)→(2,2)→(3,1)→(2,0)
  // 与えられた図形: 左のひし形
  // 足りない線: 右のひし形
  {
    completeFigure: [
      s(1,0, 0,1), s(0,1, 1,2), s(1,2, 2,1), s(2,1, 1,0), // 左ひし形
      s(2,0, 1,1), s(1,1, 2,2), s(2,2, 3,1), s(3,1, 2,0), // 右ひし形
    ],
    givenFigure: [s(1,0, 0,1), s(0,1, 1,2), s(1,2, 2,1), s(2,1, 1,0)],
    choices: [
      [s(2,0, 1,1), s(1,1, 2,2), s(2,2, 3,1), s(3,1, 2,0)], // 正解: 右ひし形
      [s(2,0, 1,1), s(1,1, 2,2), s(2,2, 3,1), s(3,1, 2,1)], // ダミー: 最後の辺が違う
      [s(2,0, 1,1), s(1,1, 2,2), s(2,2, 3,2), s(3,1, 2,0)], // ダミー: 3辺目が違う
      [s(2,1, 1,1), s(1,1, 2,2), s(2,2, 3,1), s(3,1, 2,0)], // ダミー: 1辺目の始点が違う
    ],
    correctIndex: 0,
  },

  // ─── 問題2: 斜め線パターン ───
  // お手本: 対角線2本（X字）
  // 与えられた図形: 左上→右下の対角線
  // 足りない線: 右上→左下の対角線
  {
    completeFigure: [s(0,0, 3,3), s(3,0, 0,3)],
    givenFigure: [s(0,0, 3,3)],
    choices: [
      [s(3,0, 0,3)],           // 正解
      [s(3,0, 1,3)],           // ダミー: 短い
      [s(3,0, 0,2)],           // ダミー: 終点が違う
      [s(2,0, 0,3)],           // ダミー: 始点が違う
    ],
    correctIndex: 0,
  },

  // ─── 問題3: 格子模様（井の字） ───
  // お手本: 縦2本+横2本の格子
  // 与えられた図形: 縦2本
  // 足りない線: 横2本
  {
    completeFigure: [s(1,0, 1,3), s(2,0, 2,3), s(0,1, 3,1), s(0,2, 3,2)],
    givenFigure: [s(1,0, 1,3), s(2,0, 2,3)],
    choices: [
      [s(0,1, 3,1), s(0,2, 3,2)], // 正解: 横2本
      [s(0,1, 3,1), s(0,3, 3,3)], // ダミー: 2本目の位置が違う
      [s(0,1, 2,1), s(0,2, 3,2)], // ダミー: 1本目が短い
      [s(0,1, 3,1), s(0,2, 2,2)], // ダミー: 2本目が短い
    ],
    correctIndex: 0,
  },

  // ─── 問題4: 「中」の字パターン ───
  // お手本: 外枠の四角 + 中央の縦線
  // 与えられた図形: 外枠の四角
  // 足りない線: 中央の縦線
  {
    completeFigure: [
      s(0,0, 3,0), s(3,0, 3,3), s(3,3, 0,3), s(0,3, 0,0), // 外枠
      s(1,0, 1,3), s(2,0, 2,3), // 中の縦線2本
    ],
    givenFigure: [s(0,0, 3,0), s(3,0, 3,3), s(3,3, 0,3), s(0,3, 0,0)],
    choices: [
      [s(1,0, 1,3), s(2,0, 2,3)], // 正解: 縦線2本
      [s(1,0, 1,3), s(2,0, 2,2)], // ダミー: 2本目が短い
      [s(1,0, 1,2), s(2,0, 2,3)], // ダミー: 1本目が短い
      [s(0,1, 3,1), s(0,2, 3,2)], // ダミー: 横線（方向が違う）
    ],
    correctIndex: 0,
  },

  // ─── 問題5: X字 + 外枠 ───
  // お手本: 外枠の四角 + X字の対角線
  // 与えられた図形: X字の対角線
  // 足りない線: 外枠の四角
  {
    completeFigure: [
      s(0,0, 3,0), s(3,0, 3,3), s(3,3, 0,3), s(0,3, 0,0), // 外枠
      s(0,0, 3,3), s(3,0, 0,3), // X字
    ],
    givenFigure: [s(0,0, 3,3), s(3,0, 0,3)],
    choices: [
      [s(0,0, 3,0), s(3,0, 3,3), s(3,3, 0,3), s(0,3, 0,0)], // 正解: 外枠
      [s(0,0, 3,0), s(3,0, 3,3), s(3,3, 0,3), s(0,3, 0,1)], // ダミー: 左辺が短い
      [s(0,0, 3,0), s(3,0, 3,3), s(3,3, 1,3), s(0,3, 0,0)], // ダミー: 下辺が短い
      [s(0,0, 3,0), s(3,0, 3,2), s(3,3, 0,3), s(0,3, 0,0)], // ダミー: 右辺が短い
    ],
    correctIndex: 0,
  },

  // ─── 問題6: コの字 + 横線 ───
  // お手本: 上辺+右辺+下辺（コの字）+ 中央横線
  // 与えられた図形: コの字
  // 足りない線: 中央横線
  {
    completeFigure: [s(0,0, 3,0), s(3,0, 3,3), s(3,3, 0,3), s(0,1, 3,1)],
    givenFigure: [s(0,0, 3,0), s(3,0, 3,3), s(3,3, 0,3)],
    choices: [
      [s(0,1, 3,1)],           // 正解: 中央横線
      [s(0,2, 3,2)],           // ダミー: 位置が違う
      [s(0,1, 2,1)],           // ダミー: 短い
      [s(1,1, 3,1)],           // ダミー: 始点が違う
    ],
    correctIndex: 0,
  },

  // ─── 問題7: 大小の四角形 ───
  // お手本: 外枠の大きな四角 + 内側の小さな四角
  // 与えられた図形: 外枠
  // 足りない線: 内側の小さな四角
  {
    completeFigure: [
      s(0,0, 3,0), s(3,0, 3,3), s(3,3, 0,3), s(0,3, 0,0), // 外枠
      s(1,1, 2,1), s(2,1, 2,2), s(2,2, 1,2), s(1,2, 1,1), // 内側
    ],
    givenFigure: [s(0,0, 3,0), s(3,0, 3,3), s(3,3, 0,3), s(0,3, 0,0)],
    choices: [
      [s(1,1, 2,1), s(2,1, 2,2), s(2,2, 1,2), s(1,2, 1,1)], // 正解: 内側の四角
      [s(1,1, 2,1), s(2,1, 2,2), s(2,2, 1,2), s(1,2, 1,0)], // ダミー: 最後の辺が違う
      [s(1,1, 3,1), s(2,1, 2,2), s(2,2, 1,2), s(1,2, 1,1)], // ダミー: 1辺目が長い
      [s(1,1, 2,1), s(2,1, 2,3), s(2,2, 1,2), s(1,2, 1,1)], // ダミー: 2辺目が長い
    ],
    correctIndex: 0,
  },

  // ─── 問題8: 縦線3本 + 横線1本 ───
  // お手本: 縦線3本 + 横線1本
  // 与えられた図形: 横線1本
  // 足りない線: 縦線3本
  {
    completeFigure: [s(0,0, 0,3), s(1,0, 1,3), s(2,0, 2,3), s(0,1, 3,1)],
    givenFigure: [s(0,1, 3,1)],
    choices: [
      [s(0,0, 0,3), s(1,0, 1,3), s(2,0, 2,3)], // 正解: 縦線3本
      [s(0,0, 0,3), s(1,0, 1,3), s(3,0, 3,3)], // ダミー: 3本目の位置が違う
      [s(0,0, 0,3), s(1,0, 1,2), s(2,0, 2,3)], // ダミー: 2本目が短い
      [s(0,0, 0,2), s(1,0, 1,3), s(2,0, 2,3)], // ダミー: 1本目が短い
    ],
    correctIndex: 0,
  },

  // ─── 問題9: L字 + 逆L字 ───
  // お手本: L字（左下）+ 逆L字（右上）
  // 与えられた図形: L字（左下）
  // 足りない線: 逆L字（右上）
  {
    completeFigure: [
      s(0,1, 0,3), s(0,3, 2,3), // L字（左下）
      s(1,0, 3,0), s(3,0, 3,2), // 逆L字（右上）
    ],
    givenFigure: [s(0,1, 0,3), s(0,3, 2,3)],
    choices: [
      [s(1,0, 3,0), s(3,0, 3,2)], // 正解: 逆L字
      [s(1,0, 3,0), s(3,0, 3,1)], // ダミー: 縦が短い
      [s(1,0, 2,0), s(3,0, 3,2)], // ダミー: 横が短い
      [s(0,0, 3,0), s(3,0, 3,2)], // ダミー: 横の始点が違う
    ],
    correctIndex: 0,
  },

  // ─── 問題10: 田の字 ───
  // お手本: 外枠 + 十字
  // 与えられた図形: 十字
  // 足りない線: 外枠
  {
    completeFigure: [
      s(0,0, 3,0), s(3,0, 3,3), s(3,3, 0,3), s(0,3, 0,0), // 外枠
      s(0,1, 3,1), s(1,0, 1,3), // 十字（横1本+縦1本で簡略化）
    ],
    givenFigure: [s(0,1, 3,1), s(1,0, 1,3)],
    choices: [
      [s(0,0, 3,0), s(3,0, 3,3), s(3,3, 0,3), s(0,3, 0,0)], // 正解: 外枠
      [s(0,0, 3,0), s(3,0, 3,3), s(3,3, 0,3), s(0,2, 0,0)], // ダミー: 左辺が短い
      [s(0,0, 3,0), s(3,0, 3,2), s(3,3, 0,3), s(0,3, 0,0)], // ダミー: 右辺が短い
      [s(0,0, 2,0), s(3,0, 3,3), s(3,3, 0,3), s(0,3, 0,0)], // ダミー: 上辺が短い
    ],
    correctIndex: 0,
  },
];

const INSTRUCTION_TEXT = 'おてほんの かたちを つくるとき\nたりない せんは どれですか？';

/** 現在の出題インデックス */
let currentIndex = 0;

/** 問題を順番に生成する */
export function generateLineDecomposeQuestion(): Question<LineDecomposeQuestionData, LineDecomposeChoiceData> {
  const questions = getAllLineDecomposeQuestions();
  const question = questions[currentIndex % questions.length];
  currentIndex++;
  return question;
}

/** 固定問題プールの全問題を返す */
export function getAllLineDecomposeQuestions(): Question<LineDecomposeQuestionData, LineDecomposeChoiceData>[] {
  return FIXED_QUESTIONS.map((q) => ({
    questionData: { completeFigure: q.completeFigure, givenFigure: q.givenFigure },
    choices: q.choices,
    correctIndex: q.correctIndex,
    instructionText: INSTRUCTION_TEXT,
  }));
}

/** 正解判定関数 */
export function checkLineDecomposeAnswer(
  question: Question<LineDecomposeQuestionData, LineDecomposeChoiceData>,
  selectedIndex: number,
): boolean {
  return selectedIndex === question.correctIndex;
}
