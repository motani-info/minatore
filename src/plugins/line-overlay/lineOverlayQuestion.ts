import type { Question } from '../../types/question';
import type {
  DotPosition,
  LineSegment,
  LineFigure,
  LineOverlayQuestionData,
  LineOverlayChoiceData,
} from './types';

/** グリッドサイズ (4×4) */
const GRID_SIZE = 4;

/** 1つの図形に含まれる線分の数の範囲 */
const MIN_LINES = 2;
const MAX_LINES = 4;

/** 線分を正規化する（from < to の順序に統一） */
function normalizeSegment(seg: LineSegment): LineSegment {
  const fromKey = seg.from.row * GRID_SIZE + seg.from.col;
  const toKey = seg.to.row * GRID_SIZE + seg.to.col;
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

/** ランダムなドット位置を返す */
function randomDot(): DotPosition {
  return {
    col: Math.floor(Math.random() * GRID_SIZE),
    row: Math.floor(Math.random() * GRID_SIZE),
  };
}

/** 2つのドットが同じ位置か */
function dotsEqual(a: DotPosition, b: DotPosition): boolean {
  return a.col === b.col && a.row === b.row;
}

/** ランダムな線分を生成する（同じ点同士は除外） */
function randomSegment(): LineSegment {
  let from: DotPosition;
  let to: DotPosition;
  do {
    from = randomDot();
    to = randomDot();
  } while (dotsEqual(from, to));
  return normalizeSegment({ from, to });
}

/** ランダムな線図形を生成する */
function generateRandomFigure(): LineFigure {
  const lineCount = MIN_LINES + Math.floor(Math.random() * (MAX_LINES - MIN_LINES + 1));
  const figure: LineFigure = [];
  const usedKeys = new Set<string>();

  let attempts = 0;
  while (figure.length < lineCount && attempts < 50) {
    attempts++;
    const seg = randomSegment();
    const key = segmentKey(seg);
    if (usedKeys.has(key)) continue;
    usedKeys.add(key);
    figure.push(seg);
  }

  return figure;
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

/**
 * 不正解の選択肢を生成する
 * 正解に対して一部の線分を変更・追加・削除して作る
 */
function generateDistractor(correct: LineFigure): LineFigure {
  const strategy = Math.random();

  if (strategy < 0.4 && correct.length > 1) {
    // 戦略1: 1本の線分を別の線分に置き換える
    const result = [...correct];
    const removeIdx = Math.floor(Math.random() * result.length);
    result.splice(removeIdx, 1);
    const usedKeys = new Set(result.map(segmentKey));
    let attempts = 0;
    while (attempts < 30) {
      attempts++;
      const newSeg = randomSegment();
      const key = segmentKey(newSeg);
      if (!usedKeys.has(key)) {
        result.push(newSeg);
        break;
      }
    }
    return result;
  } else if (strategy < 0.7) {
    // 戦略2: 1本追加
    const result = [...correct];
    const usedKeys = new Set(result.map(segmentKey));
    let attempts = 0;
    while (attempts < 30) {
      attempts++;
      const newSeg = randomSegment();
      const key = segmentKey(newSeg);
      if (!usedKeys.has(key)) {
        result.push(newSeg);
        break;
      }
    }
    return result;
  } else if (correct.length > 2) {
    // 戦略3: 1本削除
    const result = [...correct];
    const removeIdx = Math.floor(Math.random() * result.length);
    result.splice(removeIdx, 1);
    return result;
  } else {
    // フォールバック: 線分を置き換え
    const result = [...correct];
    if (result.length > 0) {
      const removeIdx = Math.floor(Math.random() * result.length);
      result.splice(removeIdx, 1);
    }
    const usedKeys = new Set(result.map(segmentKey));
    let attempts = 0;
    while (attempts < 30) {
      attempts++;
      const newSeg = randomSegment();
      if (!usedKeys.has(segmentKey(newSeg))) {
        result.push(newSeg);
        break;
      }
    }
    return result;
  }
}

/**
 * 重複しない不正解選択肢を生成する
 */
function generateDistractors(correct: LineFigure, count: number): LineFigure[] {
  const distractors: LineFigure[] = [];
  const usedKeys = new Set<string>();
  usedKeys.add(figureKey(correct));

  let attempts = 0;
  while (distractors.length < count && attempts < 200) {
    attempts++;
    const candidate = generateDistractor(correct);
    const key = figureKey(candidate);
    if (usedKeys.has(key)) continue;
    usedKeys.add(key);
    distractors.push(candidate);
  }

  // フォールバック
  while (distractors.length < count) {
    const fallback = generateRandomFigure();
    if (!usedKeys.has(figureKey(fallback))) {
      usedKeys.add(figureKey(fallback));
      distractors.push(fallback);
    } else {
      distractors.push(fallback);
    }
  }

  return distractors;
}

/** 問題を生成する */
export function generateLineOverlayQuestion(): Question<LineOverlayQuestionData, LineOverlayChoiceData> {
  const figureA = generateRandomFigure();
  const figureB = generateRandomFigure();
  const correctResult = overlayFigures(figureA, figureB);

  const distractors = generateDistractors(correctResult, 3);

  const correctIndex = Math.floor(Math.random() * 4);
  const choices: LineOverlayChoiceData[] = [...distractors];
  choices.splice(correctIndex, 0, correctResult);

  return {
    questionData: { figureA, figureB },
    choices,
    correctIndex,
    instructionText:
      'ひだりの 2つの かたちを\nぴったり かさねたら どうなりますか？',
  };
}

/** 正解判定関数 */
export function checkLineOverlayAnswer(
  question: Question<LineOverlayQuestionData, LineOverlayChoiceData>,
  selectedIndex: number,
): boolean {
  return selectedIndex === question.correctIndex;
}
