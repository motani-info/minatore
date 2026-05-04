import type { QuestionType, QuestionTypeId } from '../types/question';

/**
 * 問題タイプレジストリ
 * 利用可能な問題タイプの登録・管理を行う
 */
export class QuestionTypeRegistry {
  private types: Map<QuestionTypeId, QuestionType> = new Map();

  /** 問題タイプを登録する */
  register(questionType: QuestionType): void {
    this.types.set(questionType.id, questionType);
  }

  /** IDで問題タイプを取得する */
  get(id: QuestionTypeId): QuestionType | undefined {
    return this.types.get(id);
  }

  /** 登録済みの全問題タイプを取得する */
  getAll(): QuestionType[] {
    return Array.from(this.types.values());
  }

  /** 問題タイプが登録済みか確認する */
  has(id: QuestionTypeId): boolean {
    return this.types.has(id);
  }
}

/** シングルトンインスタンス */
export const registry = new QuestionTypeRegistry();
