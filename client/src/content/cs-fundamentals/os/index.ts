// src/content/cs-fundamentals/os/index.ts
// Assembles every OS content file into one Subject object consumed by the
// cs-fundamentals pages.

import type { Subject, Topic } from "@/types";
import { osTopicsMeta } from "./topics";
import osTop40 from "./top-40";

import processesArticle from "./articles/processes";
import threadsArticle from "./articles/threads";
import contextSwitchingArticle from "./articles/contextSwitching";
import schedulingAlgorithmsArticle from "./articles/schedulingAlgorithms";
import deadlocksArticle from "./articles/deadlocks";
import synchronizationArticle from "./articles/synchronization";
import pagingArticle from "./articles/paging";
import segmentationArticle from "./articles/segmentation";
import virtualMemoryArticle from "./articles/virtualMemory";
import fileSystemsArticle from "./articles/fileSystems";

import { processesRevisionNotes, processesOAQuestions } from "./oa/processes.oa";
import { threadsRevisionNotes, threadsOAQuestions } from "./oa/threads.oa";
import { contextSwitchingRevisionNotes, contextSwitchingOAQuestions } from "./oa/contextSwitching.oa";
import { schedulingAlgorithmsRevisionNotes, schedulingAlgorithmsOAQuestions } from "./oa/schedulingAlgorithms.oa";
import { deadlocksRevisionNotes, deadlocksOAQuestions } from "./oa/deadlocks.oa";
import { synchronizationRevisionNotes, synchronizationOAQuestions } from "./oa/synchronization.oa";
import { pagingRevisionNotes, pagingOAQuestions } from "./oa/paging.oa";
import { segmentationRevisionNotes, segmentationOAQuestions } from "./oa/segmentation.oa";
import { virtualMemoryRevisionNotes, virtualMemoryOAQuestions } from "./oa/virtualMemory.oa";
import { fileSystemsRevisionNotes, fileSystemsOAQuestions } from "./oa/fileSystems.oa";

import processesInterviewQuestions from "./interview/processes.interview";
import threadsInterviewQuestions from "./interview/threads.interview";
import contextSwitchingInterviewQuestions from "./interview/contextSwitching.interview";
import schedulingAlgorithmsInterviewQuestions from "./interview/schedulingAlgorithms.interview";
import deadlocksInterviewQuestions from "./interview/deadlocks.interview";
import synchronizationInterviewQuestions from "./interview/synchronization.interview";
import pagingInterviewQuestions from "./interview/paging.interview";
import segmentationInterviewQuestions from "./interview/segmentation.interview";
import virtualMemoryInterviewQuestions from "./interview/virtualMemory.interview";
import fileSystemsInterviewQuestions from "./interview/fileSystems.interview";

const articlesBySlug = {
  processes: processesArticle,
  threads: threadsArticle,
  "context-switching": contextSwitchingArticle,
  "scheduling-algorithms": schedulingAlgorithmsArticle,
  deadlocks: deadlocksArticle,
  synchronization: synchronizationArticle,
  paging: pagingArticle,
  segmentation: segmentationArticle,
  "virtual-memory": virtualMemoryArticle,
  "file-systems": fileSystemsArticle,
} as const;

const oaBySlug: Record<string, { notes: typeof processesRevisionNotes; questions: typeof processesOAQuestions }> = {
  processes: { notes: processesRevisionNotes, questions: processesOAQuestions },
  threads: { notes: threadsRevisionNotes, questions: threadsOAQuestions },
  "context-switching": { notes: contextSwitchingRevisionNotes, questions: contextSwitchingOAQuestions },
  "scheduling-algorithms": { notes: schedulingAlgorithmsRevisionNotes, questions: schedulingAlgorithmsOAQuestions },
  deadlocks: { notes: deadlocksRevisionNotes, questions: deadlocksOAQuestions },
  synchronization: { notes: synchronizationRevisionNotes, questions: synchronizationOAQuestions },
  paging: { notes: pagingRevisionNotes, questions: pagingOAQuestions },
  segmentation: { notes: segmentationRevisionNotes, questions: segmentationOAQuestions },
  "virtual-memory": { notes: virtualMemoryRevisionNotes, questions: virtualMemoryOAQuestions },
  "file-systems": { notes: fileSystemsRevisionNotes, questions: fileSystemsOAQuestions },
};

const interviewBySlug: Record<string, typeof processesInterviewQuestions> = {
  processes: processesInterviewQuestions,
  threads: threadsInterviewQuestions,
  "context-switching": contextSwitchingInterviewQuestions,
  "scheduling-algorithms": schedulingAlgorithmsInterviewQuestions,
  deadlocks: deadlocksInterviewQuestions,
  synchronization: synchronizationInterviewQuestions,
  paging: pagingInterviewQuestions,
  segmentation: segmentationInterviewQuestions,
  "virtual-memory": virtualMemoryInterviewQuestions,
  "file-systems": fileSystemsInterviewQuestions,
};

const osTopics: Topic[] = osTopicsMeta.map((meta) => {
  const article = articlesBySlug[meta.slug as keyof typeof articlesBySlug];
  const oa = oaBySlug[meta.slug];
  return {
    ...meta,
    readingTimeMins: article?.readingTimeMins,
    article,
    oaRevisionNotes: oa?.notes,
    oaQuestions: oa?.questions,
    interviewQuestions: interviewBySlug[meta.slug],
  };
});

const osSubject: Subject = {
  slug: "os",
  title: "Operating Systems",
  shortTitle: "OS",
  description:
    "Processes, threads, scheduling, deadlocks, synchronization, memory management, and file systems — the systems-thinking core of every SDE interview loop.",
  icon: "🖥️",
  status: "live",
  topics: osTopics,
  top40: osTop40,
};

export default osSubject;
