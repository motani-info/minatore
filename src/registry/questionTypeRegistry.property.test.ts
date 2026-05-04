// Feature: elementary-exam-app, Property 1: レジストリの登録・取得ラウンドトリップ
import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { QuestionTypeRegistry } from './questionTypeRegistry';
import type { QuestionType, Question } from '../types/question';

/**
 * Property 1: レジストリの登録・取得ラウンドトリップ
 *
 * 任意の有効な QuestionType オブジェクト（id, displayName, icon, generateQuestion,
 * QuestionDisplay, ChoiceDisplay, checkAnswer を持つ）に対して、レジストリに登録した後に
 * 同じIDで取得すると、登録したオブジェクトと同一のオブジェクトが返される。
 *
 * **Validates: Requirements 1.2, 1.5**
 */
describe('QuestionTypeRegistry - Property Tests', () => {
  let registry: QuestionTypeRegistry;

  beforeEach(() => {
    registry = new QuestionTypeRegistry();
  });

  it('Property 1: register → get ラウンドトリップで同一オブジェクトが返される', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }),
        fc.string({ minLength: 1 }),
        (id, displayName) => {
          const questionType: QuestionType = {
            id,
            displayName,
            icon: '🔄',
            generateQuestion: () => ({
              questionData: {},
              choices: [{}],
              correctIndex: 0,
              instructionText: 'てすと',
            }),
            QuestionDisplay: () => null,
            ChoiceDisplay: () => null,
            checkAnswer: (question: Question, selectedIndex: number) =>
              selectedIndex === question.correctIndex,
          };

          registry.register(questionType);
          const retrieved = registry.get(id);

          expect(retrieved).toBe(questionType);
        },
      ),
      { numRuns: 100 },
    );
  });
});
