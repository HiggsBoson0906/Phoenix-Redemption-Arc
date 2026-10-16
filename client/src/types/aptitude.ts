// src/types/aptitude.ts

import type { ContentStatus, Difficulty } from "./common";

export interface SolvedExample {
  problem: string;
  steps: string[];
  answer: string;
}

export interface PracticeQuestion {
  id: string;
  question: string;
  options?: string[];
  correctAnswerIndex?: number;
  answer: string;
  difficulty: Difficulty;
  solution: string;
}

export interface AptitudeTopicMeta {
  slug: string;
  title: string;
  status: ContentStatus;
  icon: string;
}

export interface AptitudeTopic extends AptitudeTopicMeta {
  concepts: string[];
  formulas: string[];
  tricks: string[];
  importantObservations: string[];
  solvedExamples: SolvedExample[];
  practiceQuestions: PracticeQuestion[];
}
