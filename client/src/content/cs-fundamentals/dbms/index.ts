// src/content/cs-fundamentals/dbms/index.ts
// Assembles every DBMS content file into one Subject object consumed by the
// cs-fundamentals pages.

import type { Subject, Topic } from "@/types";
import { dbmsTopicsMeta } from "./topics";
import dbmsTop40 from "./top-40";

import erRelationalModelArticle from "./articles/erRelationalModel";
import keysConstraintsArticle from "./articles/keysConstraints";
import normalizationArticle from "./articles/normalization";
import sqlJoinsQueriesArticle from "./articles/sqlJoinsQueries";
import transactionsAcidArticle from "./articles/transactionsAcid";
import concurrencyControlArticle from "./articles/concurrencyControl";
import indexingArticle from "./articles/indexing";
import queryOptimizationArticle from "./articles/queryOptimization";
import recoveryLoggingArticle from "./articles/recoveryLogging";
import nosqlCapTheoremArticle from "./articles/nosqlCapTheorem";

import { erRelationalModelRevisionNotes, erRelationalModelOAQuestions } from "./oa/erRelationalModel.oa";
import { keysConstraintsRevisionNotes, keysConstraintsOAQuestions } from "./oa/keysConstraints.oa";
import { normalizationRevisionNotes, normalizationOAQuestions } from "./oa/normalization.oa";
import { sqlJoinsQueriesRevisionNotes, sqlJoinsQueriesOAQuestions } from "./oa/sqlJoinsQueries.oa";
import { transactionsAcidRevisionNotes, transactionsAcidOAQuestions } from "./oa/transactionsAcid.oa";
import { concurrencyControlRevisionNotes, concurrencyControlOAQuestions } from "./oa/concurrencyControl.oa";
import { indexingRevisionNotes, indexingOAQuestions } from "./oa/indexing.oa";
import { queryOptimizationRevisionNotes, queryOptimizationOAQuestions } from "./oa/queryOptimization.oa";
import { recoveryLoggingRevisionNotes, recoveryLoggingOAQuestions } from "./oa/recoveryLogging.oa";
import { nosqlCapTheoremRevisionNotes, nosqlCapTheoremOAQuestions } from "./oa/nosqlCapTheorem.oa";

import erRelationalModelInterviewQuestions from "./interview/erRelationalModel.interview";
import keysConstraintsInterviewQuestions from "./interview/keysConstraints.interview";
import normalizationInterviewQuestions from "./interview/normalization.interview";
import sqlJoinsQueriesInterviewQuestions from "./interview/sqlJoinsQueries.interview";
import transactionsAcidInterviewQuestions from "./interview/transactionsAcid.interview";
import concurrencyControlInterviewQuestions from "./interview/concurrencyControl.interview";
import indexingInterviewQuestions from "./interview/indexing.interview";
import queryOptimizationInterviewQuestions from "./interview/queryOptimization.interview";
import recoveryLoggingInterviewQuestions from "./interview/recoveryLogging.interview";
import nosqlCapTheoremInterviewQuestions from "./interview/nosqlCapTheorem.interview";

const articlesBySlug = {
  "er-relational-model": erRelationalModelArticle,
  "keys-constraints": keysConstraintsArticle,
  normalization: normalizationArticle,
  "sql-joins-queries": sqlJoinsQueriesArticle,
  "transactions-acid": transactionsAcidArticle,
  "concurrency-control": concurrencyControlArticle,
  indexing: indexingArticle,
  "query-optimization": queryOptimizationArticle,
  "recovery-logging": recoveryLoggingArticle,
  "nosql-cap-theorem": nosqlCapTheoremArticle,
} as const;

const oaBySlug: Record<
  string,
  { notes: typeof erRelationalModelRevisionNotes; questions: typeof erRelationalModelOAQuestions }
> = {
  "er-relational-model": { notes: erRelationalModelRevisionNotes, questions: erRelationalModelOAQuestions },
  "keys-constraints": { notes: keysConstraintsRevisionNotes, questions: keysConstraintsOAQuestions },
  normalization: { notes: normalizationRevisionNotes, questions: normalizationOAQuestions },
  "sql-joins-queries": { notes: sqlJoinsQueriesRevisionNotes, questions: sqlJoinsQueriesOAQuestions },
  "transactions-acid": { notes: transactionsAcidRevisionNotes, questions: transactionsAcidOAQuestions },
  "concurrency-control": { notes: concurrencyControlRevisionNotes, questions: concurrencyControlOAQuestions },
  indexing: { notes: indexingRevisionNotes, questions: indexingOAQuestions },
  "query-optimization": { notes: queryOptimizationRevisionNotes, questions: queryOptimizationOAQuestions },
  "recovery-logging": { notes: recoveryLoggingRevisionNotes, questions: recoveryLoggingOAQuestions },
  "nosql-cap-theorem": { notes: nosqlCapTheoremRevisionNotes, questions: nosqlCapTheoremOAQuestions },
};

const interviewBySlug: Record<string, typeof erRelationalModelInterviewQuestions> = {
  "er-relational-model": erRelationalModelInterviewQuestions,
  "keys-constraints": keysConstraintsInterviewQuestions,
  normalization: normalizationInterviewQuestions,
  "sql-joins-queries": sqlJoinsQueriesInterviewQuestions,
  "transactions-acid": transactionsAcidInterviewQuestions,
  "concurrency-control": concurrencyControlInterviewQuestions,
  indexing: indexingInterviewQuestions,
  "query-optimization": queryOptimizationInterviewQuestions,
  "recovery-logging": recoveryLoggingInterviewQuestions,
  "nosql-cap-theorem": nosqlCapTheoremInterviewQuestions,
};

const dbmsTopics: Topic[] = dbmsTopicsMeta.map((meta) => {
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

const dbmsSubject: Subject = {
  slug: "dbms",
  title: "Database Management Systems",
  shortTitle: "DBMS",
  description:
    "ER modeling, normalization, SQL, transactions, concurrency control, indexing, query optimization, recovery, and NoSQL — the data layer core of every SDE interview loop.",
  icon: "🗄️",
  status: "live",
  topics: dbmsTopics,
  top40: dbmsTop40,
};

export default dbmsSubject;
