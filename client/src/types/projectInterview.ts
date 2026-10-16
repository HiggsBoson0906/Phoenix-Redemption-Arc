// src/types/projectInterview.ts

import type { Difficulty } from "./common";

export interface ProjectInterviewCategory {
  slug: string;
  title: string;
  description: string;
  icon: string;
}

export interface ProjectInterviewQuestion {
  id: string;
  categorySlug: string;
  question: string;
  difficulty: Difficulty;
  detailedAnswer: string;
  idealInterviewAnswer: string;
  interviewerExpectations: string[];
  followUpQuestions: string[];
  commonMistakes: string[];
  keyDiscussionPoints: string[];
}
