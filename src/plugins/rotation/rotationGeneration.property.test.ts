// Feature: elementary-exam-app, Property 5: グリッド生成の有効性
// Feature: elementary-exam-app, Property 6: 回転方向と指示テキストの整合性
// Feature: elementary-exam-app, Property 7: 問題生成の選択肢の正当性
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  generateRandomGrid,
  generateRotationQuestion,
  rotateGrid,
  gridsEqual,
} from './rotationQuestion';

/**
 * Property 5: グリッド生成の有効性
 *
 * 任意の generateRandomGrid() の呼び出し結果に対して、返されるグリッドは長さ4の
 * boolean配列であり、少なくとも1つの true と少なくとも1つの false を含む。
 *
 * **Validates: Requirements 6.2, 6.3**
 */

/**
 * Property 6: 回転方向と指示テキストの整合性
 *
 * 任意の generateRotationQuestion() の呼び出し結果に対して、問題データの direction は
 * 'right1'、'left1'、'right2'、'left2' のいずれかであり、instructionText はその direction に
 * 対応する指示文を含む。
 *
 * **Validates: Requirements 6.4**
 */

/**
 * Property 7: 問題生成の選択肢の正当性
 *
 * 任意の generateRotationQuestion() の呼び出し結果に対して、選択肢は正確に4つあり、
 * すべて互いに異なり、correctIndex は 0〜3 の範囲であり、choices[correctIndex] は
 * 元のグリッドを指定方向に回転した結果と一致する。
 *
 * **Validates: Requirements 6.5, 6.6, 6.7**
 */
describe('Rotation Question Generation - Property Tests', () => {
  it('Property 5: generateRandomGrid は有効なグリッドを返す', () => {
    fc.assert(
      fc.property(fc.constant(null), () => {
        const grid = generateRandomGrid();

        // 長さ4
        expect(grid).toHaveLength(4);

        // 全要素が boolean
        for (const cell of grid) {
          expect(typeof cell).toBe('boolean');
        }

        // 少なくとも1つの true
        expect(grid.some((cell) => cell)).toBe(true);

        // 少なくとも1つの false
        expect(grid.some((cell) => !cell)).toBe(true);
      }),
      { numRuns: 100 },
    );
  });

  it('Property 6: 回転方向と指示テキストが整合する', () => {
    fc.assert(
      fc.property(fc.constant(null), () => {
        const question = generateRotationQuestion();
        const { direction } = question.questionData;

        // direction は有効な値
        expect(['right1', 'left1', 'right2', 'left2']).toContain(direction);

        // direction と instructionText の整合性
        const directionTextMap: Record<string, string> = {
          right1: '右に1かいまわすと',
          left1: '左に1かいまわすと',
          right2: '右に2かいまわすと',
          left2: '左に2かいまわすと',
        };

        expect(question.instructionText).toContain(directionTextMap[direction]);
      }),
      { numRuns: 100 },
    );
  });

  it('Property 7: 問題生成の選択肢が正当である', () => {
    fc.assert(
      fc.property(fc.constant(null), () => {
        const question = generateRotationQuestion();

        // 選択肢は正確に4つ
        expect(question.choices).toHaveLength(4);

        // correctIndex は 0〜3 の範囲
        expect(question.correctIndex).toBeGreaterThanOrEqual(0);
        expect(question.correctIndex).toBeLessThanOrEqual(3);

        // 全選択肢が互いに異なる
        for (let i = 0; i < question.choices.length; i++) {
          for (let j = i + 1; j < question.choices.length; j++) {
            expect(gridsEqual(question.choices[i], question.choices[j])).toBe(false);
          }
        }

        // choices[correctIndex] は元のグリッドを指定方向に回転した結果と一致
        const { originalGrid, direction } = question.questionData;
        const expectedCorrect = rotateGrid(originalGrid, direction);
        expect(gridsEqual(question.choices[question.correctIndex], expectedCorrect)).toBe(true);
      }),
      { numRuns: 100 },
    );
  });
});
