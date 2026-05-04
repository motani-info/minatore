import type { QuestionType } from '../../types/question';
import type { ShapeCompositionQuestionData, ShapeCompositionChoiceData } from './types';
import {
  generateShapeCompositionQuestion,
  getAllShapeCompositionQuestions,
  checkShapeCompositionAnswer,
} from './shapeCompositionQuestion';
import { ShapeCompositionQuestionDisplay } from './components/QuestionDisplay';
import { ShapeCompositionChoiceDisplay } from './components/ChoiceDisplay';
import { registry } from '../../registry/questionTypeRegistry';

export const shapeCompositionQuestionType: QuestionType<ShapeCompositionQuestionData, ShapeCompositionChoiceData> = {
  id: 'shape-composition',
  displayName: '図形構成',
  icon: '🧩',
  generateQuestion: generateShapeCompositionQuestion,
  getAllQuestions: getAllShapeCompositionQuestions,
  QuestionDisplay: ShapeCompositionQuestionDisplay,
  ChoiceDisplay: ShapeCompositionChoiceDisplay,
  checkAnswer: checkShapeCompositionAnswer,
};

export function registerShapeCompositionPlugin(): void {
  registry.register(shapeCompositionQuestionType as QuestionType);
}
