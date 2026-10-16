// src/types/behavioral.ts

export interface BehavioralCategory {
  slug: string;
  title: string;
  description: string;
  icon: string;
}

export interface StarFramework {
  situation: string;
  task: string;
  action: string;
  result: string;
}

export interface BehavioralQuestion {
  id: string;
  categorySlug: string;
  question: string;
  starFramework: StarFramework;
  sampleAnswer: string;
  tips: string[];
  commonMistakes: string[];
  followUpQuestions: string[];
}
