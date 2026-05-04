import { describe, it, expect, beforeEach } from 'vitest';
import { QuestionTypeRegistry } from './questionTypeRegistry';
import type { QuestionType, Question } from '../types/question';

/** テスト用のダミー問題タイプを生成する */
function createMockQuestionType(id: string): QuestionType {
  return {
    id,
    displayName: `テスト${id}`,
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
}

describe('QuestionTypeRegistry', () => {
  let registry: QuestionTypeRegistry;

  beforeEach(() => {
    registry = new QuestionTypeRegistry();
  });

  it('register で問題タイプを登録し、get で取得できる', () => {
    const qt = createMockQuestionType('rotation');
    registry.register(qt);
    expect(registry.get('rotation')).toBe(qt);
  });

  it('未登録のIDで get すると undefined を返す', () => {
    expect(registry.get('nonexistent')).toBeUndefined();
  });

  it('has で登録済みかどうかを確認できる', () => {
    const qt = createMockQuestionType('rotation');
    expect(registry.has('rotation')).toBe(false);
    registry.register(qt);
    expect(registry.has('rotation')).toBe(true);
  });

  it('getAll で登録済みの全問題タイプを取得できる', () => {
    const qt1 = createMockQuestionType('type-a');
    const qt2 = createMockQuestionType('type-b');
    registry.register(qt1);
    registry.register(qt2);

    const all = registry.getAll();
    expect(all).toHaveLength(2);
    expect(all).toContain(qt1);
    expect(all).toContain(qt2);
  });

  it('同じIDで再登録すると上書きされる', () => {
    const qt1 = createMockQuestionType('rotation');
    const qt2 = createMockQuestionType('rotation');
    qt2.displayName = 'あたらしいなまえ';

    registry.register(qt1);
    registry.register(qt2);

    expect(registry.get('rotation')).toBe(qt2);
    expect(registry.getAll()).toHaveLength(1);
  });

  it('何も登録していない場合 getAll は空配列を返す', () => {
    expect(registry.getAll()).toEqual([]);
  });
});
