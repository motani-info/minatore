import type { Question } from '../../types/question';
import type { ShapeKartaQuestionData, ShapeKartaChoiceData, ShapeGroup, ShapeType, ShapeColor, CardData } from './types';

const SHAPES: ShapeType[] = ['circle', 'triangle', 'square'];
const COLORS: ShapeColor[] = ['red', 'blue', 'yellow', 'green'];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** 指示条件を生成（2つの条件） */
function generateConditions(): ShapeGroup[] {
  const cond1: ShapeGroup = {
    shape: randomItem(SHAPES),
    color: randomItem(COLORS),
    count: randomInt(1, 4),
  };

  // 2つ目は1つ目と異なる図形or色にする
  let cond2: ShapeGroup;
  do {
    cond2 = {
      shape: randomItem(SHAPES),
      color: randomItem(COLORS),
      count: randomInt(1, 3),
    };
  } while (cond1.shape === cond2.shape && cond1.color === cond2.color);

  return [cond1, cond2];
}

/** 正解カードを生成（条件に完全一致） */
function generateCorrectCard(conditions: ShapeGroup[]): CardData {
  return conditions.map(c => ({ ...c }));
}

/** ダミーカードを生成（条件から少しずらす） */
function generateDistractorCard(conditions: ShapeGroup[]): CardData {
  const card: CardData = conditions.map(c => ({ ...c }));

  // ランダムに1つの条件を変更
  const targetIdx = randomInt(0, card.length - 1);
  const changeType = randomInt(0, 2);

  switch (changeType) {
    case 0: // 数を変更（+1 or -1）
      card[targetIdx] = {
        ...card[targetIdx],
        count: card[targetIdx].count + (Math.random() < 0.5 ? 1 : -1),
      };
      if (card[targetIdx].count < 1) card[targetIdx].count = card[targetIdx].count + 2;
      if (card[targetIdx].count > 5) card[targetIdx].count = card[targetIdx].count - 2;
      break;
    case 1: { // 色を変更
      const otherColors = COLORS.filter(c => c !== card[targetIdx].color);
      card[targetIdx] = { ...card[targetIdx], color: randomItem(otherColors) };
      break;
    }
    case 2: { // 形を変更
      const otherShapes = SHAPES.filter(s => s !== card[targetIdx].shape);
      card[targetIdx] = { ...card[targetIdx], shape: randomItem(otherShapes) };
      break;
    }
  }

  return card;
}

/** 2つのカードが同一か判定 */
function cardsEqual(a: CardData, b: CardData): boolean {
  if (a.length !== b.length) return false;
  return a.every((ag, i) =>
    ag.shape === b[i].shape && ag.color === b[i].color && ag.count === b[i].count
  );
}

/** 指示テキストを生成 */
function buildInstructionText(conditions: ShapeGroup[]): string {
  const colorNames: Record<ShapeColor, string> = {
    red: 'あかい', blue: 'あおい', yellow: 'きいろい', green: 'みどりの',
  };
  const shapeNames: Record<ShapeType, string> = {
    circle: 'まる', triangle: 'さんかく', square: 'しかく',
  };

  const parts = conditions.map(c =>
    `${colorNames[c.color]}${shapeNames[c.shape]}が${c.count}こ`
  );

  return parts.join('と') + '\nのカードはどれ？';
}

/** 問題を生成する */
export function generateShapeKartaQuestion(): Question<ShapeKartaQuestionData, ShapeKartaChoiceData> {
  const conditions = generateConditions();
  const correctCard = generateCorrectCard(conditions);

  // ダミー3枚を生成（正解・他のダミーと重複しない）
  const distractors: CardData[] = [];
  let attempts = 0;
  while (distractors.length < 3 && attempts < 50) {
    attempts++;
    const d = generateDistractorCard(conditions);
    if (cardsEqual(d, correctCard)) continue;
    if (distractors.some(existing => cardsEqual(existing, d))) continue;
    distractors.push(d);
  }
  // 足りない場合はフォールバック
  while (distractors.length < 3) {
    distractors.push(generateDistractorCard(conditions));
  }

  // 正解位置をランダムに配置
  const correctIndex = randomInt(0, 3);
  const choices: ShapeKartaChoiceData[] = [...distractors];
  choices.splice(correctIndex, 0, correctCard);

  return {
    questionData: { conditions },
    choices,
    correctIndex,
    instructionText: buildInstructionText(conditions),
  };
}

/** 正解判定 */
export function checkShapeKartaAnswer(
  question: Question<ShapeKartaQuestionData, ShapeKartaChoiceData>,
  selectedIndex: number
): boolean {
  return selectedIndex === question.correctIndex;
}
