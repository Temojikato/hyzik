// src/types/ReyvateilsQuizzes.ts

// These are the allowed option keys for the class‑specific quiz.
export type ClassSpecificOptionKey = 'A' | 'B' | 'C';

// Each question in the class‑specific quiz has options keyed by the allowed option keys.
export type ClassSpecificQuizOption = {
  [key in ClassSpecificOptionKey]: string;
};

// A single class‑specific quiz question.
export interface ClassSpecificQuizQuestion {
  question: string;
  options: ClassSpecificQuizOption;
}

// The mapping used to determine the Reyvateil companion based on the total score
export interface ReyvateilMapping {
  scoreRange: string;
  reyvateil: string;
  description: string;
}

// The overall structure of a class‑specific quiz.
export interface ClassSpecificQuiz {
  title: string;
  introduction: string;
  questions: ClassSpecificQuizQuestion[];
  // Scoring is determined by the answer key.
  scoring: { [key in ClassSpecificOptionKey]: number };
  reyvateilMapping: ReyvateilMapping[];
}

export interface QuizQuestion {
  number: number;
  question: string;
  options: { [className: string]: string };
}

export interface ClassMapping {
  class: string;
  description: string;
}

export interface QuizData {
  quiz: {
    title: string;
    questions: QuizQuestion[];
    // We no longer use numerical scoring, so we remove the "scoring" object.
    classMapping: ClassMapping[];
  };
}