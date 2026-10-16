// src/types/common.ts
// Shared vocabulary used across every content module (CS fundamentals, aptitude,
// behavioral, project interviews, DSA sheets) so difficulty/frequency/tags read
// the same way everywhere in the app.

export type Difficulty = "Easy" | "Medium" | "Hard";

export type Frequency = "Very High" | "High" | "Medium";

export type QuestionTag = "Must Know" | "Frequently Asked" | "Advanced";

export type CompanyStyleTag =
  | "Google-style"
  | "Amazon-style"
  | "Microsoft-style"
  | "Uber-style"
  | "Startup-style";

/** Lifecycle state of a content unit in a registry — lets navigation/dashboards
 * render the full information architecture before every subject has content. */
export type ContentStatus = "live" | "coming-soon";

/** Which top-level module a piece of content belongs to. Used by bookmarks,
 * progress tracking, recently-viewed, and search to point at content generically
 * without each hook needing to know every module's shape. */
export type ModuleType =
  | "dsa-sheet"
  | "cs-article"
  | "cs-oa"
  | "cs-interview"
  | "cs-top-40"
  | "aptitude"
  | "behavioral"
  | "project-interview";

/** Generic pointer at any single content unit across every module. */
export interface ContentRef {
  module: ModuleType;
  /** Subject/sheet slug, e.g. "os", "dp", "aptitude". */
  subjectSlug: string;
  /** Topic/question slug within the subject, e.g. "processes", "percentage". */
  topicSlug: string;
  /** Optional item id for a specific question/problem within the topic. */
  itemId?: string;
  /** Human-readable label shown in bookmark/recently-viewed lists. */
  title: string;
  /** Route to navigate back to this content. */
  href: string;
}
