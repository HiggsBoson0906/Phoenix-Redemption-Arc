// src/content/cs-fundamentals/dbms/interview/queryOptimization.interview.ts

import type { InterviewQuestion } from "@/types";

const queryOptimizationInterviewQuestions: InterviewQuestion[] = [
  {
    id: "query-optimization-iv-1",
    question: "What is a query execution plan, and why does SQL need one at all?",
    difficulty: "Easy",
    detailedAnswer:
      "SQL is declarative — a query states what result is wanted, not the steps to compute it. A query execution plan is the concrete sequence of operations (which scans, which join algorithms, in what order) the database engine will actually perform to produce that result. Because the same SQL query can typically be satisfied by many different, logically equivalent plans with very different costs, the database needs an optimizer to choose one before execution; without this step, the engine would have no way to decide, for example, whether to use an index or scan the whole table, or in what order to join five tables.",
    idealAnswer:
      "SQL only describes the desired result, not how to get it, so the database needs to translate that into an actual sequence of steps — scan this table this way, join it to that table using this algorithm, in this order. That sequence of steps is the execution plan. The reason it matters is that for any non-trivial query, there are usually many equivalent plans that produce the same correct result but at wildly different costs, so the optimizer's whole job is picking a cheap one before running anything.",
    interviewerExpectations: [
      "Understands SQL's declarative nature as the reason a plan is needed",
      "Mentions that multiple equivalent plans can exist with different costs",
    ],
    followUpQuestions: [
      "How would you view the execution plan for a query in practice?",
      "What's the difference between a logical plan and a physical plan?",
    ],
    commonMistakes: [
      "Confusing the SQL query itself with the execution plan",
      "Not understanding that plans can vary significantly in cost for the same query",
    ],
    discussionPoints: ["Declarative vs procedural", "Plan cost variability"],
  },
  {
    id: "query-optimization-iv-2",
    question: "Explain the difference between cost-based and rule-based query optimization.",
    difficulty: "Medium",
    detailedAnswer:
      "Rule-based optimization applies a fixed, predetermined set of heuristics to transform and choose among query plans — e.g., 'always push predicates down before a join' or 'always prefer an index scan when one is available' — regardless of what the actual underlying data looks like. Cost-based optimization instead estimates the actual resource cost (I/O, CPU, memory) of multiple candidate plans using real statistics about the data — row counts, cardinality, value distributions — and picks the plan with the lowest estimated cost. RBO is predictable and cheap to compute but can make bad decisions when a heuristic doesn't match reality, such as preferring an index scan even when the predicate matches most of the table. CBO adapts to the actual data but is only as good as its statistics; stale or missing statistics can cause it to badly misjudge a plan's true cost.",
    idealAnswer:
      "Rule-based optimization follows fixed rules no matter what the data actually looks like — 'always use an index if one exists' is a rule, and it can backfire, like when a filter matches 90% of a table and a full scan would actually be cheaper. Cost-based optimization instead uses real statistics about the data — how many rows, how many distinct values, distribution — to estimate the actual cost of different plans and picks the cheapest one. Basically every modern production database — Postgres, MySQL, Oracle, SQL Server — uses cost-based optimization today, precisely because it adapts to reality instead of blindly following a rule. The catch is CBO is only as good as its statistics, so stale stats are a very real, very common way to get a bad plan.",
    interviewerExpectations: [
      "Gives a concrete example of where a rule-based heuristic breaks down",
      "Knows that CBO is what modern production databases actually use",
      "Mentions that CBO quality depends on statistics accuracy",
    ],
    followUpQuestions: [
      "What statistics does a cost-based optimizer typically rely on?",
      "What happens to plan quality if statistics become stale?",
      "How would you force a database to refresh its statistics?",
    ],
    commonMistakes: [
      "Not being able to give a concrete example where RBO would choose poorly",
      "Assuming RBO and CBO are used equally often in modern production systems",
    ],
    discussionPoints: ["Fixed heuristics vs cost estimation", "Statistics dependency", "Modern default (CBO)"],
  },
  {
    id: "query-optimization-iv-3",
    question: "Walk me through nested loop join, hash join, and merge join — when would the optimizer pick each?",
    difficulty: "Medium",
    detailedAnswer:
      "Nested loop join iterates every row of the 'outer' table and, for each one, probes the 'inner' table for matches — its cost is roughly outer_rows times the cost of each inner probe, so it's efficient when the outer table is small and/or the inner table has an index making each probe cheap (O(log n) via a B+Tree), but degrades badly as both tables grow large without indexes. Hash join builds an in-memory hash table on the smaller ('build') input keyed by the join column, then streams the larger ('probe') input through it, checking for matches — efficient for large equi-joins between unsorted tables, as long as the build side fits in memory (or the engine can gracefully spill to disk in a 'grace hash join' when it doesn't). Merge join requires both inputs to already be sorted on the join key — it then walks both sorted streams in parallel, advancing whichever pointer is behind, much like the merge step of merge sort — this is extremely efficient specifically because it avoids any extra sort or hash-build step, which is why it's especially attractive when an existing index already provides the needed sort order on one or both sides.",
    idealAnswer:
      "Nested loop is simplest: for every row in one table, go probe the other — great if the outer side is small or the inner side has an index, bad if both sides are large and unindexed since the cost multiplies. Hash join builds a hash table on the smaller side in memory and streams the bigger side through it — this is the default workhorse for large equi-joins where nothing's pre-sorted. Merge join needs both sides already sorted on the join key, and then it's basically a linear merge — very cheap, but only usable when that sort order is already available, often because an index already provides it. The optimizer picks based on table sizes, whether useful indexes exist, and whether inputs are already sorted, all informed by its cost estimates.",
    interviewerExpectations: [
      "Explains the mechanism of all three algorithms, not just names them",
      "Connects each algorithm to the specific condition that makes it efficient",
      "Understands the connection between merge join and pre-existing sort order (often from an index)",
    ],
    followUpQuestions: [
      "What happens if a hash join's build side doesn't fit in memory?",
      "Why might an index make a merge join possible where it otherwise wouldn't be?",
      "How does the optimizer decide which table becomes the 'outer' table in a nested loop join?",
    ],
    commonMistakes: [
      "Describing only what each join does without explaining when the optimizer would choose it",
      "Not knowing that hash join can spill to disk when the build side is too large for memory",
    ],
    discussionPoints: ["Nested loop cost model", "Hash join build/probe", "Merge join and pre-sorted input"],
  },
  {
    id: "query-optimization-iv-4",
    question: "How would you use EXPLAIN and EXPLAIN ANALYZE to diagnose a slow query in production?",
    difficulty: "Hard",
    detailedAnswer:
      "First run EXPLAIN ANALYZE (not plain EXPLAIN) since it actually executes the query and reports real elapsed time and real row counts alongside the optimizer's estimates — plain EXPLAIN only shows what the optimizer intends to do and its guesses, which can be wrong. The single most valuable signal is comparing estimated rows to actual rows at each step of the plan: a large mismatch strongly suggests stale statistics or a hard-to-estimate predicate, which explains why the optimizer might have chosen a suboptimal plan even though a better one was theoretically available. Next, look for scan types that don't match expectations — a sequential/full table scan where an index scan was expected usually means either no suitable index exists, the predicate isn't sargable (e.g. wrapped in a function), or the optimizer decided (rightly or wrongly) that a full scan was cheaper. Also check for expensive operations layered on top of an otherwise fine scan — an unindexed sort (filesort) after retrieving rows, or a nested loop join with a large outer table and no index on the inner side. Once the specific bottleneck operation is identified from the plan, the fix follows directly: add or adjust an index, rewrite a non-sargable predicate, refresh statistics, or restructure the query to change the join order the optimizer considers.",
    idealAnswer:
      "I'd always reach for EXPLAIN ANALYZE over plain EXPLAIN because it gives me real numbers, not just estimates — and the very first thing I look at is where estimated and actual row counts diverge sharply, because that tells me the optimizer's statistics are off, which is often the root cause of a bad plan choice. Then I look for scan types — is there a sequential scan where I'd expect an index scan? That points to either a missing index or a non-sargable predicate. I'd also check for an expensive sort or hash operation that a better index could eliminate. Once I find the specific step that's expensive or misestimated, the fix is usually pretty direct — add an index, rewrite a predicate to be index-friendly, or run ANALYZE to refresh statistics — but I wouldn't guess at any of that without looking at the actual plan first.",
    interviewerExpectations: [
      "Leads with EXPLAIN ANALYZE specifically, explains why over plain EXPLAIN",
      "Names the estimated-vs-actual row count comparison as the key diagnostic signal",
      "Connects specific plan symptoms (seq scan, filesort, bad join) to specific fixes",
    ],
    followUpQuestions: [
      "What would you do if the plan looks correct but the query is still slow?",
      "How do you distinguish a statistics problem from a genuinely missing index?",
      "What's the risk of running EXPLAIN ANALYZE on a write query (INSERT/UPDATE/DELETE) in production?",
    ],
    commonMistakes: [
      "Using only plain EXPLAIN and not knowing EXPLAIN ANALYZE gives real execution numbers",
      "Not mentioning the estimated-vs-actual row count comparison as a diagnostic tool",
    ],
    discussionPoints: ["EXPLAIN vs EXPLAIN ANALYZE", "Estimated vs actual row counts", "Scan type diagnosis", "Statistics refresh"],
  },
  {
    id: "query-optimization-iv-5",
    question: "A dashboard query joining `orders`, `order_items`, and `products` was fast in staging but takes 12 seconds in production, where `orders` has 50 million rows versus 50,000 in staging. How do you approach fixing this?",
    difficulty: "Hard",
    detailedAnswer:
      "The core issue is that a plan that's fine at 50,000 rows can be badly wrong at 50 million rows — algorithms with different cost curves (e.g., nested loop join scales roughly linearly with outer rows times inner probe cost, while a full scan scales linearly with table size) that looked equivalent at small scale diverge sharply at large scale. Start with EXPLAIN ANALYZE on the actual production query against production data (not staging) since the plan and statistics genuinely differ by environment. Check whether the join order and join algorithms chosen make sense for the real row counts — a nested loop join that was fine when orders had 50,000 rows can become catastrophic at 50 million if it's still being chosen (this can happen if production statistics are stale, causing the optimizer to underestimate orders' size). Check for a missing index on the join columns (order_items.order_id, order_items.product_id) — at small scale, a full scan is fast enough to hide a missing index; at 50 million rows, it's the difference between an instant index lookup and a multi-second table scan repeated for every outer row. Also verify statistics are current in production (ANALYZE may run on a schedule that lagged behind the production data's actual growth). Once identified, the fix is typically adding the specific missing index revealed by the plan, and separately, treating this as a process gap: staging data volumes should better approximate production, or query performance testing should happen against production-scale data before deploy, so this class of surprise is caught before it ships.",
    idealAnswer:
      "This is the classic 'staging didn't catch it because staging is small' problem — join algorithms and full scans that are invisible at 50,000 rows can dominate at 50 million. I'd run EXPLAIN ANALYZE against production directly, since staging's plan and statistics don't reflect reality here. I'd specifically check whether the join columns on order_items — order_id and product_id — have indexes, because a nested loop join without an index on the inner side is fine at small scale and disastrous at large scale; that's my top suspect given the row-count gap described. I'd also check if production statistics are stale, since that could make the optimizer pick a plan appropriate for a smaller table than what's actually there now. Beyond the immediate fix — almost certainly adding an index — I'd flag the bigger process issue: staging needs production-representative data volumes, or we need a habit of checking query plans against realistic scale before shipping, because this exact failure mode will keep recurring otherwise.",
    interviewerExpectations: [
      "Recognizes that plans/costs that are fine at small scale can be very wrong at large scale",
      "Names a concrete diagnostic (EXPLAIN ANALYZE against production, checking indexes on join columns)",
      "Goes beyond the immediate fix to mention the systemic gap (staging data volume mismatch)",
    ],
    followUpQuestions: [
      "Why might staging and production choose different execution plans for the identical query?",
      "How would you safely test a fix like adding an index against a 50-million-row production table without causing an outage?",
      "What would you recommend changing about the staging environment to catch this earlier?",
    ],
    commonMistakes: [
      "Assuming the query itself is wrong rather than considering that the plan/indexing didn't scale",
      "Not addressing the staging-vs-production data volume mismatch as a systemic issue",
    ],
    discussionPoints: ["Scale-dependent plan cost", "Join column indexing", "Staging vs production parity", "Safe index rollout at scale"],
    scenarioBased: true,
  },
];

export default queryOptimizationInterviewQuestions;
