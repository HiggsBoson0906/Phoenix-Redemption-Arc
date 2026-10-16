// src/content/cs-fundamentals/dbms/topics.ts

import type { TopicMeta } from "@/types";

export const dbmsTopicsMeta: TopicMeta[] = [
  { slug: "er-relational-model", title: "ER Model & Relational Model", status: "live" },
  { slug: "keys-constraints", title: "Keys & Constraints", status: "live" },
  { slug: "normalization", title: "Normalization", status: "live" },
  { slug: "sql-joins-queries", title: "SQL Joins & Queries", status: "live" },
  { slug: "transactions-acid", title: "Transactions & ACID Properties", status: "live" },
  { slug: "concurrency-control", title: "Concurrency Control & Locking", status: "live" },
  { slug: "indexing", title: "Indexing (B-Tree, B+Tree, Hashing)", status: "live" },
  { slug: "query-optimization", title: "Query Optimization", status: "live" },
  { slug: "recovery-logging", title: "Database Recovery & Logging", status: "live" },
  { slug: "nosql-cap-theorem", title: "NoSQL & the CAP Theorem", status: "live" },
];
