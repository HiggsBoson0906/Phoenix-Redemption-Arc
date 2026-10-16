// src/types/content.ts
// Data models for the three sections every CS-fundamentals topic has:
// Article (Section A), OAQuestion (Section B), InterviewQuestion (Section C),
// plus the per-subject Top40Question bank.

import type { CompanyStyleTag, Difficulty, Frequency, QuestionTag } from "./common";

/** Section A: a full learning article for one topic. */
export interface Article {
  slug: string;
  title: string;
  /** One-sentence hook shown on topic dashboards / search results. */
  summary: string;
  readingTimeMins: number;
  beginnerExplanation: string;
  detailedBreakdown: string;
  realWorldExamples: string;
  /** Optional ASCII/description-based diagram content rendered in a <pre>/callout. */
  diagram?: string;
  useCases: string[];
  advantages: string[];
  disadvantages: string[];
  commonMisconceptions: string[];
  interviewPerspective: string;
  oaPerspective: string;
  keyTakeaways: string[];
  summaryClosing: string;
  relatedTopics: string[];
  furtherReading: { label: string; note: string }[];
  /** Topics that should ideally be understood first. */
  prerequisites?: string[];
}

/** Section B: one OA-style multiple choice question. */
export interface OAQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  difficulty: Difficulty;
  topicTags: string[];
  /** e.g. "TCS NQT", "Infosys", "Amazon OA" — set when the question mirrors a
   * known company-style OA question. */
  companyStyle?: string;
}

/** Quick-revision content that sits above the MCQ bank for a topic's OA section. */
export interface OARevisionNotes {
  quickRevision: string[];
  importantFacts: string[];
  formulas?: string[];
  shortcuts?: string[];
  memoryTricks?: string[];
}

/** Section C: one interview question with full discussion guidance. */
export interface InterviewQuestion {
  id: string;
  question: string;
  difficulty: Difficulty;
  detailedAnswer: string;
  idealAnswer: string;
  interviewerExpectations: string[];
  followUpQuestions: string[];
  commonMistakes: string[];
  discussionPoints: string[];
  scenarioBased?: boolean;
}

/** Top-40 most-asked bank: the highest-signal question set per subject. */
export interface Top40Question {
  id: string;
  rank: number;
  question: string;
  difficulty: Difficulty;
  frequency: Frequency;
  shortAnswer: string;
  detailedAnswer: string;
  deepExplanation: string;
  realWorldRelevance: string;
  keywords: string[];
  commonMistakes: string[];
  relatedTopics: string[];
  followUpQuestions: string[];
  tags: QuestionTag[];
  companyStyleTags: CompanyStyleTag[];
}
