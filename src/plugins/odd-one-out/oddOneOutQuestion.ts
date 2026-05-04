import type { Question } from '../../types/question';
import type { OddOneOutQuestionData, OddOneOutChoiceData, FigureDefinition, FigurePart } from './types';

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const COLORS = ['#ef4444', '#3b82f6', '#22c55e', '#8b5cf6', '#f59e0b'];

/** ランダムな複合図形を生成 */
function generateBaseFigure(): FigureDefinition {
  const parts: FigurePart[] = [];

  // 外枠（四角）
  parts.push({
    type: 'rect',
    x: 10, y: 10, width: 80, height: 80,
    color: randomItem(COLORS),
  });

  // 内部パーツ1（小さな丸）
  const circleX = randomInt(25, 55);
  const circleY = randomInt(25, 55);
  parts.push({
    type: 'circle',
    x: circleX, y: circleY, width: 20, height: 20,
    color: randomItem(COLORS),
  });

  // 内部パーツ2（斜め線）
  parts.push({
    type: 'line',
    x: randomInt(20, 40), y: randomInt(20, 40),
    width: randomInt(30, 50), height: 2,
    color: randomItem(COLORS),
    rotation: randomItem([45, -45, 30, -30]),
  });

  return parts;
}

/** 図形を変異させる */
function mutateFigure(base: FigureDefinition): FigureDefinition {
  const mutated = base.map(p => ({ ...p }));
  const mutationType = randomItem(['flip', 'shift', 'colorChange', 'rotate'] as const);
  const targetIdx = randomInt(1, mutated.length - 1); // 外枠以外を変異

  switch (mutationType) {
    case 'flip':
      mutated[targetIdx] = {
        ...mutated[targetIdx],
        x: 90 - mutated[targetIdx].x - mutated[targetIdx].width,
      };
      break;
    case 'shift':
      mutated[targetIdx] = {
        ...mutated[targetIdx],
        x: Math.max(10, Math.min(70, mutated[targetIdx].x + randomItem([12, -12]))),
        y: Math.max(10, Math.min(70, mutated[targetIdx].y + randomItem([12, -12]))),
      };
      break;
    case 'colorChange': {
      const otherColors = COLORS.filter(c => c !== mutated[targetIdx].color);
      mutated[targetIdx] = {
        ...mutated[targetIdx],
        color: randomItem(otherColors),
      };
      break;
    }
    case 'rotate':
      mutated[targetIdx] = {
        ...mutated[targetIdx],
        rotation: (mutated[targetIdx].rotation ?? 0) + randomItem([90, -90]),
      };
      break;
  }

  return mutated;
}

/** 問題を生成する */
export function generateOddOneOutQuestion(): Question<OddOneOutQuestionData, OddOneOutChoiceData> {
  const gridSize = 3; // 3×3固定（シンプルに）
  const totalCells = gridSize * gridSize;
  const oddIndex = randomInt(0, totalCells - 1);

  const baseFigure = generateBaseFigure();
  const mutatedFigure = mutateFigure(baseFigure);

  // 4択: oddIndexを含む4つの位置候補を生成
  const candidates = new Set<number>();
  candidates.add(oddIndex);

  while (candidates.size < 4) {
    candidates.add(randomInt(0, totalCells - 1));
  }

  const choiceArray = Array.from(candidates);
  // シャッフル
  for (let i = choiceArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [choiceArray[i], choiceArray[j]] = [choiceArray[j], choiceArray[i]];
  }

  const correctIndex = choiceArray.indexOf(oddIndex);

  return {
    questionData: {
      baseFigure,
      mutatedFigure,
      gridSize,
      oddIndex,
    },
    choices: choiceArray,
    correctIndex,
    instructionText: 'ひとつだけちがうものを\nみつけてね',
  };
}

/** 正解判定 */
export function checkOddOneOutAnswer(
  question: Question<OddOneOutQuestionData, OddOneOutChoiceData>,
  selectedIndex: number
): boolean {
  return selectedIndex === question.correctIndex;
}
