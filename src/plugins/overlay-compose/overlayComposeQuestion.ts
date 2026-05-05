import type { Question } from '../../types/question';
import type { OverlayComposeQuestionData, OverlayComposeChoiceData, OverlayComposeGrid, CellValue } from './types';

/**
 * NxNグリッドを左右反転する（列をミラー）
 */
function flipGridHorizontally(grid: OverlayComposeGrid): OverlayComposeGrid {
  const { size, cells } = grid;
  const flipped: CellValue[] = new Array(size * size);
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      flipped[row * size + (size - 1 - col)] = cells[row * size + col];
    }
  }
  return { size, cells: flipped };
}

/**
 * 左グリッドを右に折り重ねた結果を計算（合成ルール）
 * 合成: 重なったセルは消えずに残る（OR演算）
 * - empty + empty = empty
 * - empty + X = X
 * - X + empty = X
 * - X + X = X（同じ記号なら残る）
 * - X + Y = X（異なる記号でも左が優先で残る＝両方あるが表示は重なる）
 */
export function computeOverlayCompose(leftGrid: OverlayComposeGrid, rightGrid: OverlayComposeGrid): OverlayComposeGrid {
  const flippedLeft = flipGridHorizontally(leftGrid);
  const size = leftGrid.size;
  const totalCells = size * size;
  const result: CellValue[] = new Array(totalCells);

  for (let i = 0; i < totalCells; i++) {
    const l = flippedLeft.cells[i];
    const r = rightGrid.cells[i];

    if (l === 'empty' && r === 'empty') {
      result[i] = 'empty';
    } else if (l === 'empty') {
      result[i] = r;
    } else if (r === 'empty') {
      result[i] = l;
    } else {
      // 合成: 両方あれば左（折り重ねた側）が上に来る
      result[i] = l;
    }
  }

  return { size, cells: result };
}

// ─── ヘルパー ───

function makeGrid(size: number, cells: CellValue[]): OverlayComposeGrid {
  return { size, cells };
}

// ─── 固定問題プール ───

interface FixedOverlayComposeQ {
  leftGrid: OverlayComposeGrid;
  rightGrid: OverlayComposeGrid;
  choices: OverlayComposeChoiceData[];
  correctIndex: number;
}

/**
 * 写真から読み取った問題（2×2グリッド、合成ルール）
 * グリッドのセル配置: [左上, 右上, 左下, 右下]（行優先）
 * 折り重ね: 左グリッドを左右反転して右グリッドに重ねる
 */
const FIXED_2x2_QUESTIONS: FixedOverlayComposeQ[] = [
  // (1) 左=[○,空 / 空,○] 右=[空,空 / ○,空]
  // 左を反転=[空,○ / ○,空] → 右に重ねる=[空,○ / ○,空] OR [空,空 / ○,空] = [空,○ / ○,空]
  // 正解は○が1つだけ右上にある結果
  {
    leftGrid: makeGrid(2, ['circle', 'empty', 'empty', 'circle']),
    rightGrid: makeGrid(2, ['empty', 'empty', 'circle', 'empty']),
    choices: [
      makeGrid(2, ['empty', 'circle', 'circle', 'circle']),
      makeGrid(2, ['circle', 'empty', 'circle', 'empty']),
      makeGrid(2, ['empty', 'circle', 'circle', 'empty']),
      makeGrid(2, ['circle', 'circle', 'empty', 'circle']),
    ],
    correctIndex: 0,
  },
  // (2) 左=[○,○ / ○,○] 右=[空,空 / ○,○]
  // 左を反転=[○,○ / ○,○] → 右に重ねる=[○,○ / ○,○] OR [空,空 / ○,○] = [○,○ / ○,○]
  {
    leftGrid: makeGrid(2, ['circle', 'circle', 'circle', 'circle']),
    rightGrid: makeGrid(2, ['empty', 'empty', 'circle', 'circle']),
    choices: [
      makeGrid(2, ['circle', 'circle', 'circle', 'circle']),
      makeGrid(2, ['circle', 'circle', 'empty', 'circle']),
      makeGrid(2, ['empty', 'circle', 'circle', 'circle']),
      makeGrid(2, ['circle', 'empty', 'circle', 'circle']),
    ],
    correctIndex: 0,
  },
  // (3) 左=[△,空 / △,空] 右=[空,○ / 空,空]（△=triangle）
  // 左を反転=[空,△ / 空,△] → 右に重ねる=[空,△ / 空,△] OR [空,○ / 空,空] = [空,△ / 空,△]
  // ※○と△が同じ位置→△が優先（折り重ねた側）
  {
    leftGrid: makeGrid(2, ['triangle', 'empty', 'triangle', 'empty']),
    rightGrid: makeGrid(2, ['empty', 'circle', 'empty', 'empty']),
    choices: [
      makeGrid(2, ['circle', 'triangle', 'empty', 'triangle']),
      makeGrid(2, ['empty', 'triangle', 'empty', 'triangle']),
      makeGrid(2, ['triangle', 'circle', 'triangle', 'empty']),
      makeGrid(2, ['triangle', 'empty', 'circle', 'triangle']),
    ],
    correctIndex: 0,
  },
  // (4) 左=[△,空 / △,空]（左向き三角） 右=[空,空 / 空,空]
  // 左を反転=[空,△ / 空,△] → 結果=[空,△ / 空,△]
  {
    leftGrid: makeGrid(2, ['triangle-left', 'empty', 'triangle-left', 'empty']),
    rightGrid: makeGrid(2, ['empty', 'empty', 'empty', 'empty']),
    choices: [
      makeGrid(2, ['empty', 'triangle-right', 'empty', 'triangle-right']),
      makeGrid(2, ['triangle-left', 'empty', 'triangle-left', 'empty']),
      makeGrid(2, ['empty', 'triangle-left', 'empty', 'triangle-left']),
      makeGrid(2, ['triangle-right', 'empty', 'triangle-right', 'empty']),
    ],
    correctIndex: 0,
  },
  // (5) 左=[○,○ / ○,○] 右=[○,空 / 空,空]
  // 左を反転=[○,○ / ○,○] → 結果=[○,○ / ○,○]
  {
    leftGrid: makeGrid(2, ['circle', 'circle', 'circle', 'circle']),
    rightGrid: makeGrid(2, ['circle', 'empty', 'empty', 'empty']),
    choices: [
      makeGrid(2, ['circle', 'circle', 'circle', 'circle']),
      makeGrid(2, ['circle', 'circle', 'empty', 'circle']),
      makeGrid(2, ['circle', 'empty', 'circle', 'circle']),
      makeGrid(2, ['empty', 'circle', 'circle', 'circle']),
    ],
    correctIndex: 0,
  },
  // (6) 左=[○,○ / ○,空] 右=[○,○ / ○,空]
  // 左を反転=[○,○ / 空,○] → 結果=[○,○ / ○,○] OR [○,○ / ○,空] = [○,○ / ○,○]
  {
    leftGrid: makeGrid(2, ['circle', 'circle', 'circle', 'empty']),
    rightGrid: makeGrid(2, ['circle', 'circle', 'circle', 'empty']),
    choices: [
      makeGrid(2, ['circle', 'circle', 'circle', 'circle']),
      makeGrid(2, ['circle', 'circle', 'circle', 'empty']),
      makeGrid(2, ['circle', 'circle', 'empty', 'circle']),
      makeGrid(2, ['circle', 'empty', 'circle', 'circle']),
    ],
    correctIndex: 0,
  },
  // (7) 左=[○,○ / ○,○] 右=[○,空 / ○,○]
  // 左を反転=[○,○ / ○,○] → 結果=[○,○ / ○,○]
  {
    leftGrid: makeGrid(2, ['circle', 'circle', 'circle', 'circle']),
    rightGrid: makeGrid(2, ['circle', 'empty', 'circle', 'circle']),
    choices: [
      makeGrid(2, ['circle', 'circle', 'circle', 'circle']),
      makeGrid(2, ['circle', 'empty', 'circle', 'circle']),
      makeGrid(2, ['circle', 'circle', 'empty', 'circle']),
      makeGrid(2, ['empty', 'circle', 'circle', 'circle']),
    ],
    correctIndex: 0,
  },
  // (8) 左=[○,○ / ○,空] 右=[空,○ / 空,空]
  // 左を反転=[○,○ / 空,○] → 結果=[○,○ / 空,○] OR [空,○ / 空,空] = [○,○ / 空,○]
  {
    leftGrid: makeGrid(2, ['circle', 'circle', 'circle', 'empty']),
    rightGrid: makeGrid(2, ['empty', 'circle', 'empty', 'empty']),
    choices: [
      makeGrid(2, ['circle', 'circle', 'empty', 'circle']),
      makeGrid(2, ['circle', 'circle', 'circle', 'empty']),
      makeGrid(2, ['empty', 'circle', 'circle', 'circle']),
      makeGrid(2, ['circle', 'empty', 'circle', 'circle']),
    ],
    correctIndex: 0,
  },
  // (9) 左=[△,○ / ○,△] 右=[空,空 / 空,空]（斜め線入り三角）
  // 左を反転=[○,△ / △,○] → 結果=[○,△ / △,○]
  {
    leftGrid: makeGrid(2, ['triangle', 'circle', 'circle', 'triangle']),
    rightGrid: makeGrid(2, ['empty', 'empty', 'empty', 'empty']),
    choices: [
      makeGrid(2, ['circle', 'triangle', 'triangle', 'circle']),
      makeGrid(2, ['triangle', 'circle', 'circle', 'triangle']),
      makeGrid(2, ['circle', 'circle', 'triangle', 'triangle']),
      makeGrid(2, ['triangle', 'triangle', 'circle', 'circle']),
    ],
    correctIndex: 0,
  },
  // (10) 左=[○,空 / 空,○] 右=[空,△ / △,空]
  // 左を反転=[空,○ / ○,空] → 結果=[空,○ / ○,空] OR [空,△ / △,空] = [空,○ / ○,空]
  // ※○が△の位置と被らないので両方残る→ [空,○ / ○,空]に△が追加
  // 実際: 反転左[空,○ / ○,空] + 右[空,△ / △,空] → 位置0:空+空=空, 位置1:○+△=○, 位置2:○+△=○, 位置3:空+空=空
  {
    leftGrid: makeGrid(2, ['circle', 'empty', 'empty', 'circle']),
    rightGrid: makeGrid(2, ['empty', 'triangle', 'triangle', 'empty']),
    choices: [
      makeGrid(2, ['empty', 'circle', 'circle', 'empty']),
      makeGrid(2, ['circle', 'triangle', 'triangle', 'circle']),
      makeGrid(2, ['triangle', 'circle', 'circle', 'triangle']),
      makeGrid(2, ['empty', 'triangle', 'triangle', 'empty']),
    ],
    correctIndex: 0,
  },
  // (11) 左=[○,△ / △,○] 右=[△,△ / 空,○]（右向き三角）
  // 左を反転=[△,○ / ○,△] → 結果=[△,○ / ○,△] OR [△,△ / 空,○] = [△,○ / ○,△]
  {
    leftGrid: makeGrid(2, ['circle', 'triangle-right', 'triangle-left', 'circle']),
    rightGrid: makeGrid(2, ['triangle-left', 'triangle-left', 'empty', 'circle']),
    choices: [
      makeGrid(2, ['triangle-right', 'circle', 'circle', 'triangle-right']),
      makeGrid(2, ['circle', 'triangle-right', 'triangle-left', 'circle']),
      makeGrid(2, ['triangle-left', 'triangle-left', 'circle', 'circle']),
      makeGrid(2, ['circle', 'circle', 'triangle-right', 'triangle-right']),
    ],
    correctIndex: 0,
  },
  // (12) 左=[△,▷ / ▷,△] 右=[▷,△ / △,▷]（三角の向き違い）
  // 左を反転=[▷,△ / △,▷] → 結果=[▷,△ / △,▷] OR [▷,△ / △,▷] = [▷,△ / △,▷]
  {
    leftGrid: makeGrid(2, ['triangle-left', 'triangle-right', 'triangle-right', 'triangle-left']),
    rightGrid: makeGrid(2, ['triangle-right', 'triangle-left', 'triangle-left', 'triangle-right']),
    choices: [
      makeGrid(2, ['triangle-right', 'triangle-left', 'triangle-left', 'triangle-right']),
      makeGrid(2, ['triangle-left', 'triangle-right', 'triangle-right', 'triangle-left']),
      makeGrid(2, ['triangle-right', 'triangle-right', 'triangle-left', 'triangle-left']),
      makeGrid(2, ['triangle-left', 'triangle-left', 'triangle-right', 'triangle-right']),
    ],
    correctIndex: 0,
  },
];

// ─── 出題インデックス管理 ───

let currentIndex2x2 = 0;

const INSTRUCTION_TEXT = 'ひだりを パタンと みぎに おると\nどんな かたちに なりますか？';

// ─── 2×2 ───

/** 2×2問題を順番に生成する */
export function generateOverlayCompose2x2Question(): Question<OverlayComposeQuestionData, OverlayComposeChoiceData> {
  const questions = getAllOverlayCompose2x2Questions();
  const question = questions[currentIndex2x2 % questions.length];
  currentIndex2x2++;
  return question;
}

/** 2×2固定問題プールの全問題を返す */
export function getAllOverlayCompose2x2Questions(): Question<OverlayComposeQuestionData, OverlayComposeChoiceData>[] {
  return FIXED_2x2_QUESTIONS.map((fixedQ) => ({
    questionData: { leftGrid: fixedQ.leftGrid, rightGrid: fixedQ.rightGrid },
    choices: fixedQ.choices,
    correctIndex: fixedQ.correctIndex,
    instructionText: INSTRUCTION_TEXT,
  }));
}

/** 正解判定 */
export function checkOverlayComposeAnswer(
  question: Question<OverlayComposeQuestionData, OverlayComposeChoiceData>,
  selectedIndex: number
): boolean {
  return selectedIndex === question.correctIndex;
}
