// Feature: elementary-exam-app, Property 2: 進捗表示フォーマットの正確性
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { formatProgress } from './useProgress';

/**
 * Property 2: 進捗表示フォーマットの正確性
 *
 * 任意の非負整数 c と t（c ≤ t）に対して、formatProgress(c, t) は
 * `${c}もんせいかい / ${t}もんちゅう` の形式の文字列を返す。
 *
 * **Validates: Requirements 2.3**
 */
describe('formatProgress - Property Tests', () => {
  it('Property 2: 任意の c ≤ t に対して正しいフォーマット文字列を返す', () => {
    fc.assert(
      fc.property(
        fc.nat({ max: 10000 }),
        fc.nat({ max: 10000 }),
        (c, extra) => {
          const t = c + extra; // c ≤ t を保証
          const result = formatProgress(c, t);
          expect(result).toBe(`${c}もんせいかい / ${t}もんちゅう`);
        },
      ),
      { numRuns: 100 },
    );
  });
});
