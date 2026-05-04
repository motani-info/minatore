// Feature: elementary-exam-app, Property 8: 右90度回転4回のラウンドトリップ
// Feature: elementary-exam-app, Property 9: 右90度回転と左90度回転の逆操作
// Feature: elementary-exam-app, Property 10: 180度回転は右90度回転2回と等価
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { rotateRight90, rotateLeft90, rotate180 } from './rotationQuestion';
import type { Grid } from './types';

/**
 * 有効なグリッドの arbitrary
 * 少なくとも1つの true と1つの false を含む 4要素の boolean タプル
 */
const validGridArb: fc.Arbitrary<Grid> = fc
  .tuple(fc.boolean(), fc.boolean(), fc.boolean(), fc.boolean())
  .filter((grid) => grid.some((cell) => cell) && grid.some((cell) => !cell));

/**
 * Property 8: 右90度回転4回のラウンドトリップ
 *
 * 任意の有効なグリッドに対して、rotateRight90 を4回適用した結果は元のグリッドと一致する。
 *
 * **Validates: Requirements 7.4**
 */

/**
 * Property 9: 右90度回転と左90度回転の逆操作
 *
 * 任意の有効なグリッドに対して、rotateRight90 → rotateLeft90 は元のグリッドと一致する。
 * また、rotateLeft90 → rotateRight90 も元のグリッドと一致する。
 *
 * **Validates: Requirements 7.5**
 */

/**
 * Property 10: 180度回転は右90度回転2回と等価
 *
 * 任意の有効なグリッドに対して、rotate180 の結果は rotateRight90 を2回適用した結果と一致する。
 *
 * **Validates: Requirements 7.3**
 */
describe('Rotation Logic - Property Tests', () => {
  it('Property 8: rotateRight90 を4回適用すると元のグリッドに戻る', () => {
    fc.assert(
      fc.property(validGridArb, (grid) => {
        const rotated = rotateRight90(rotateRight90(rotateRight90(rotateRight90(grid))));
        expect(rotated).toEqual(grid);
      }),
      { numRuns: 100 },
    );
  });

  it('Property 9: rotateRight90 → rotateLeft90 は元のグリッドに戻る', () => {
    fc.assert(
      fc.property(validGridArb, (grid) => {
        const rightThenLeft = rotateLeft90(rotateRight90(grid));
        expect(rightThenLeft).toEqual(grid);

        const leftThenRight = rotateRight90(rotateLeft90(grid));
        expect(leftThenRight).toEqual(grid);
      }),
      { numRuns: 100 },
    );
  });

  it('Property 10: rotate180 は rotateRight90 を2回適用した結果と等価', () => {
    fc.assert(
      fc.property(validGridArb, (grid) => {
        const rotated180 = rotate180(grid);
        const rightTwice = rotateRight90(rotateRight90(grid));
        expect(rotated180).toEqual(rightTwice);
      }),
      { numRuns: 100 },
    );
  });
});
