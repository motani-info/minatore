// Feature: elementary-exam-app, Property 3: 進捗データの記録・読み込みラウンドトリップ
// Feature: elementary-exam-app, Property 4: 新問題タイプ追加時の既存データ保持
import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { StorageService } from './storageService';

/**
 * Property 3: 進捗データの記録・読み込みラウンドトリップ
 *
 * 任意の (typeId, isCorrect) ペアのシーケンスに対して、recordAnswer で全て記録した後に
 * loadProgress で読み込むと、各問題タイプの累計問題数と累計正答数が回答シーケンスと一致する。
 *
 * **Validates: Requirements 5.1, 5.2**
 */

/**
 * Property 4: 新問題タイプ追加時の既存データ保持
 *
 * 任意の既存の進捗データに対して、新しい問題タイプの回答を記録した後、
 * 既存の問題タイプの進捗データ（問題数、正答数）は変更されない。
 *
 * **Validates: Requirements 5.6**
 */
describe('StorageService - Property Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('Property 3: recordAnswer → loadProgress のラウンドトリップで累計が一致する', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.tuple(
            fc.constantFrom('typeA', 'typeB', 'typeC', 'typeD', 'typeE'),
            fc.boolean(),
          ),
          { minLength: 1, maxLength: 30 },
        ),
        (answers) => {
          localStorage.clear();
          const freshService = new StorageService();

          // 期待値を計算
          const expected: Record<string, { total: number; correct: number }> = {};
          for (const [typeId, isCorrect] of answers) {
            if (!expected[typeId]) {
              expected[typeId] = { total: 0, correct: 0 };
            }
            expected[typeId].total += 1;
            if (isCorrect) {
              expected[typeId].correct += 1;
            }
          }

          // 全回答を記録
          for (const [typeId, isCorrect] of answers) {
            freshService.recordAnswer(typeId, isCorrect);
          }

          // 読み込んで検証
          const progress = freshService.loadProgress();
          for (const [typeId, counts] of Object.entries(expected)) {
            expect(progress.byType[typeId]).toBeDefined();
            expect(progress.byType[typeId].totalQuestions).toBe(counts.total);
            expect(progress.byType[typeId].correctAnswers).toBe(counts.correct);
          }
        },
      ),
      { numRuns: 100 },
    );
  });

  it('Property 4: 新問題タイプ追加時に既存データが保持される', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('existX', 'existY', 'existZ'),
        fc.nat({ max: 20 }),
        fc.nat({ max: 20 }),
        fc.boolean(),
        (existingTypeId, correctCount, incorrectCount, newIsCorrect) => {
          localStorage.clear();
          const freshService = new StorageService();

          // 既存データを作成
          for (let i = 0; i < correctCount; i++) {
            freshService.recordAnswer(existingTypeId, true);
          }
          for (let i = 0; i < incorrectCount; i++) {
            freshService.recordAnswer(existingTypeId, false);
          }

          // 既存データのスナップショットを取得
          const beforeProgress = freshService.loadProgress();
          const beforeData = beforeProgress.byType[existingTypeId];

          // 新しい問題タイプの回答を記録（既存と異なるIDを保証）
          const newTypeId = `__new__${existingTypeId}`;
          freshService.recordAnswer(newTypeId, newIsCorrect);

          // 既存データが変更されていないことを検証
          const afterProgress = freshService.loadProgress();

          if (beforeData) {
            expect(afterProgress.byType[existingTypeId].totalQuestions).toBe(
              beforeData.totalQuestions,
            );
            expect(afterProgress.byType[existingTypeId].correctAnswers).toBe(
              beforeData.correctAnswers,
            );
          }
        },
      ),
      { numRuns: 100 },
    );
  });
});
