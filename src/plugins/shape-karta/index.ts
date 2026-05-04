import type { QuestionType } from '../../types/question';
import type { ShapeKartaQuestionData, ShapeKartaChoiceData } from './types';
import { generateShapeKartaQuestion, checkShapeKartaAnswer } from './shapeKartaQuestion';
import { ShapeKartaQuestionDisplay } from './components/QuestionDisplay';
import { ShapeKartaChoiceDisplay } from './components/ChoiceDisplay';
import { registry } from '../../registry/questionTypeRegistry';

export const shapeKartaQuestionType: QuestionType<ShapeKartaQuestionData, ShapeKartaChoiceData> = {
  id: 'shape-karta',
  displayName: '図形と数カルタ',
  icon: '🎴',
  generateQuestion: generateShapeKartaQuestion,
  QuestionDisplay: ShapeKartaQuestionDisplay,
  ChoiceDisplay: ShapeKartaChoiceDisplay,
  checkAnswer: checkShapeKartaAnswer,
};

export function registerShapeKartaPlugin(): void {
  registry.register(shapeKartaQuestionType as QuestionType);
}
