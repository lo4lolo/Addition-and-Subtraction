
export type Operation = 'addition' | 'subtraction';

export type CalculationStep = 'makeTen' | 'borrow' | 'ones' | 'tens' | 'checking' | 'correct';

export interface Problem {
  num1: number;
  num2: number;
  answer: number;
}

export interface UserInput {
  ones: string;
  tens: string;
}

export interface BlockDistribution {
  top: number;
  bottom: number;
}
