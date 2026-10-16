// src/types/subject.ts
// The subject/topic registry shape used by every CS-fundamentals subject
// (Operating Systems, Computer Networks, DBMS, OOPs, COA, Compiler Design).

import type { ContentStatus } from "./common";
import type { Article, InterviewQuestion, OAQuestion, OARevisionNotes, Top40Question } from "./content";

export interface TopicMeta {
  slug: string;
  title: string;
  status: ContentStatus;
  readingTimeMins?: number;
}

/** Fully assembled topic — an article plus its OA bank and interview bank. */
export interface Topic extends TopicMeta {
  article?: Article;
  oaRevisionNotes?: OARevisionNotes;
  oaQuestions?: OAQuestion[];
  interviewQuestions?: InterviewQuestion[];
}

export interface SubjectMeta {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  icon: string;
  status: ContentStatus;
}

/** A fully built CS-fundamentals subject, e.g. Operating Systems. */
export interface Subject extends SubjectMeta {
  topics: Topic[];
  top40: Top40Question[];
}
