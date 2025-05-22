export type QuestionType =
  | 'single'
  | 'multiple'
  | 'open'
  | 'ordering'
  | 'matching'

export interface BaseQuestion {
  id: string;
  type: QuestionType;
  question: string;
}

export interface SingleChoiceQuestion extends BaseQuestion {
  type: 'single';
  options: string[];
  correctAnswer: string;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple';
  options: string[];
  correctAnswers: string[];
}

export interface OpenQuestion extends BaseQuestion {
  type: 'open';
  correctAnswers: string[];  
}

export interface OrderingQuestion extends BaseQuestion {
  type: 'ordering';
  options: string[];         
}

export interface MatchingQuestion extends BaseQuestion {
  type: 'matching';
  leftItems: string[];       
  rightItems: string[];      
  correctMap: Record<string, string>;  
}
