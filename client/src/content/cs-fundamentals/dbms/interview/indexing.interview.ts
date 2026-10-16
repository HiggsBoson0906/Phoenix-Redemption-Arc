// src/content/cs-fundamentals/dbms/interview/indexing.interview.ts

import type { InterviewQuestion } from "@/types";

const indexingInterviewQuestions: InterviewQuestion[] = [
  {
    id: "indexing-iv-1",
    question: "What is a database index and why does it speed up queries?",
    difficulty: "Easy",
    detailedAnswer:
      "An index is a separate, ordered data structure (almost always a B+Tree) built on one or more columns that lets the database locate matching rows without scanning the entire table. Instead of an O(n) full table scan checking every row against the WHERE clause, the database can descend the index's tree structure in O(log n) time to find matching keys directly, then follow pointers to the actual rows. The cost is that every write to an indexed column must also update the index, so indexes trade write performance and storage for read performance.",
    idealAnswer:
      "It's like the index in the back of a book — instead of reading every page, you jump straight to the pages you need. Technically it's usually a B+Tree keyed on the indexed column(s), so a lookup goes from an O(n) full scan down to O(log n) tree traversal. The trade-off is that indexes aren't free: every insert, update, or delete on that column has to keep the index in sync, so you're paying write cost for read speed.",
    interviewerExpectations: [
      "Explains the core mechanism (ordered structure enabling faster-than-linear lookup)",
      "Mentions the write/storage cost trade-off, not just the read benefit",
    ],
    followUpQuestions: [
      "What data structure is typically used to implement an index, and why?",
      "What happens to write performance as you add more indexes to a table?",
    ],
    commonMistakes: [
      "Describing an index as purely beneficial with no downside",
      "Not knowing what data structure backs a typical index",
    ],
    discussionPoints: ["Full scan vs index lookup", "Read/write trade-off"],
  },
  {
    id: "indexing-iv-2",
    question: "Why do relational databases use B+Trees instead of B-Trees or plain binary search trees for indexes?",
    difficulty: "Medium",
    detailedAnswer:
      "A binary search tree is tall and skinny — height grows as log2(n) but each node holds only one key, so for millions of rows you get many levels, and on disk each level typically means a random seek, which is slow. B-Trees and B+Trees fix this by making nodes wide (sized to match a disk page, often hundreds of keys per node), which drastically increases fan-out and keeps the tree shallow — often just 3-4 levels for millions of rows. B+Trees specifically improve on B-Trees for database workloads in two ways: all data/row-pointers live only at leaf nodes (internal nodes are pure navigation, so they're smaller and pack more keys per page, further increasing fan-out), and leaf nodes are linked together in sorted order, so range queries and ORDER BY can be satisfied with one descent plus a sequential walk across linked leaves, rather than the repeated re-descents a classic B-Tree would need to collect scattered matches from internal nodes.",
    idealAnswer:
      "It comes down to disk I/O cost. A binary tree is tall, and each level on disk can mean a random seek, which is expensive. B+Trees are deliberately wide — each node is sized to a disk page and holds hundreds of keys — so the tree stays shallow, often just 3-4 levels even for millions of rows, meaning very few disk reads per lookup. The 'plus' in B+Tree specifically means all the actual data lives at the leaves, and those leaves are linked in sorted order — that's huge for range queries, because once you find the start of a range you just walk the linked list instead of re-searching the tree for every value.",
    interviewerExpectations: [
      "Explains fan-out / node width as the reason for shallow trees and fewer disk reads",
      "Specifically calls out the leaf-only-data and linked-leaf properties of B+Trees",
      "Connects linked leaves to efficient range scans",
    ],
    followUpQuestions: [
      "What determines the order (fan-out) of a B+Tree node in practice?",
      "How does a B+Tree stay balanced after many inserts and deletes?",
      "When would a hash index be a better choice than a B+Tree?",
    ],
    commonMistakes: [
      "Saying B-Trees and B+Trees are basically interchangeable",
      "Not connecting node width to disk page size / fewer I/O operations",
      "Forgetting to mention the linked-leaf range-scan advantage",
    ],
    discussionPoints: ["Fan-out and disk I/O", "Leaf-only data in B+Trees", "Linked leaves and range scans"],
  },
  {
    id: "indexing-iv-3",
    question: "What is the difference between a clustered and a non-clustered index, and why can a table have only one clustered index?",
    difficulty: "Medium",
    detailedAnswer:
      "A clustered index determines the actual physical order of rows on disk — the table's data pages ARE the leaf level of the clustered index's B+Tree. A non-clustered (secondary) index is a separate structure whose leaves point back to the row (either a direct pointer or, in engines like InnoDB, the clustered index's key). Since a table's rows can only be physically arranged in one order at a time, there can only be one clustered index per table, but there's no such physical constraint on secondary indexes, so a table can have many. This also explains why looking up via a secondary index is a bit more expensive: it's a traversal of the secondary index followed by a second traversal of the clustered index to retrieve the full row (a 'bookmark lookup').",
    idealAnswer:
      "The clustered index IS the table, physically — rows are literally stored on disk in the clustered index's key order, which is why you can only have one: data can't be sorted two different ways simultaneously. A non-clustered index is a separate lookup structure that points back to the row, so you can have as many of those as you want. The catch is a non-clustered lookup costs a bit more — you traverse the secondary index to find the key, then traverse the clustered index again to actually fetch the row, which is why over-indexing with lots of secondary indexes still has a real cost even on the read side, not just writes.",
    interviewerExpectations: [
      "Correctly explains that clustered index order = physical disk order",
      "Explains the 'only one' constraint via the physical-ordering argument",
      "Mentions the extra hop (bookmark lookup) for non-clustered index reads",
    ],
    followUpQuestions: [
      "What does InnoDB use as the clustered index if you don't declare a primary key?",
      "Why might inserting random UUIDs as primary keys hurt performance in a clustered-index engine?",
      "What is a covering index and how does it avoid the bookmark lookup cost?",
    ],
    commonMistakes: [
      "Saying a table can have multiple clustered indexes",
      "Not knowing that a non-clustered lookup requires a second traversal to get the full row",
    ],
    discussionPoints: ["Physical vs logical ordering", "Bookmark/key lookups", "Primary key choice implications"],
  },
  {
    id: "indexing-iv-4",
    question: "When would adding an index actually hurt performance rather than help it?",
    difficulty: "Hard",
    detailedAnswer:
      "Several scenarios: (1) write-heavy tables where the read benefit doesn't outweigh the cost of updating the index on every insert/update/delete — each additional index adds latency to every write and more disk space consumption; (2) low-cardinality columns (like a boolean flag or a status column with 3 possible values) where a large fraction of rows match any given filter value, so the optimizer may reasonably prefer (or should prefer) a full scan over the scattered random I/O of following an index, and an unused-but-maintained index there is pure overhead; (3) a composite index whose column order doesn't match actual query patterns — if queries never filter on a left-prefix of the indexed columns, the index sits unused while still costing write overhead; (4) tables that are small enough that a full scan is already fast — the index adds overhead without a meaningful read benefit; (5) redundant or overlapping indexes, e.g. having both (a) and (a, b) as separate indexes when the second one already serves any query the first one would.",
    idealAnswer:
      "The classic case is a write-heavy table where you've added an index 'just in case' but it's rarely used for reads — you're paying the write cost on every insert/update with no matching benefit. Low-cardinality columns are another trap: indexing a boolean or a status column with only a few values often doesn't help, because a huge fraction of rows match any given value, so the optimizer may skip the index anyway and just scan the table, meaning you're maintaining a structure nobody uses. I'd also watch for redundant indexes — like having a separate index on (a) when you already have one on (a, b), since the second covers anything the first would. The general instinct should be: index based on actual observed query patterns, not defensively.",
    interviewerExpectations: [
      "Names multiple concrete scenarios, not just 'sometimes indexes are bad'",
      "Connects low cardinality to optimizer behavior specifically",
      "Shows awareness of redundant/overlapping index waste",
    ],
    followUpQuestions: [
      "How would you find unused indexes in a production database?",
      "What tool or command would you use to see whether the optimizer is actually using a given index?",
      "How do you decide whether a composite index's column order is correct for your query patterns?",
    ],
    commonMistakes: [
      "Claiming indexes are always beneficial with no downside",
      "Not being able to name a concrete scenario beyond generic 'write overhead'",
    ],
    discussionPoints: ["Write overhead", "Low cardinality and optimizer selectivity", "Redundant indexes", "Query-pattern-driven indexing"],
  },
  {
    id: "indexing-iv-5",
    question: "A product listing query that used to run in 50ms is now taking 4 seconds after the orders table grew to 10 million rows. How do you diagnose whether this is a missing index or a query plan problem?",
    difficulty: "Hard",
    detailedAnswer:
      "Start by running EXPLAIN (or EXPLAIN ANALYZE for actual runtime numbers, not just estimates) on the slow query to see the execution plan the optimizer chose. Look specifically for a sequential/full table scan on the orders table where you'd expect an index scan — that's the classic missing-index signature, and it's consistent with the timing: at low row counts a full scan is fast enough to be invisible, but it degrades linearly (or worse, with sorting) as the table grows to 10 million rows, exactly the symptom described. If EXPLAIN shows an index IS being used but the query is still slow, look for other plan problems: a bad join order forcing a large intermediate result before filtering, an index being used but requiring a sort afterward (missing an index that matches the ORDER BY), stale table statistics causing the optimizer to misestimate row counts and pick a bad plan, or a function wrapped around the indexed column in the WHERE clause (e.g. WHERE YEAR(order_date) = 2024) which prevents the index from being used at all (a 'non-sargable' predicate) even though an index technically exists. I'd also check whether the query filters on a column that IS indexed but not as a left-prefix of a composite index, which silently disables the index for that query. Once diagnosed, the fix follows directly: add the missing index, rewrite the non-sargable predicate to be index-friendly, refresh statistics, or restructure the join.",
    idealAnswer:
      "First thing I'd do is run EXPLAIN ANALYZE on the query to see what the planner is actually doing, not guess. If I see a sequential scan over 10 million rows where I'd expect an index scan, that's a strong signal of a missing index, and it explains the timing perfectly — a full scan was cheap enough to be invisible at a smaller table size but now dominates. If an index IS being used but it's still slow, I'd look at whether the plan needs an extra sort step afterward, whether the join order looks wrong, or whether the WHERE clause has a function wrapped around the indexed column, which silently disables index usage even though the index exists. I'd also sanity-check that table statistics are recent, since stale statistics can make the optimizer pick a bad plan even with the right indexes in place. The key discipline is: look at the actual plan first, don't assume — 'it's slow because the table grew' could be a missing index, a stale-statistics bad plan, or a non-sargable predicate, and EXPLAIN tells you which.",
    interviewerExpectations: [
      "Leads with EXPLAIN/EXPLAIN ANALYZE as the diagnostic tool, not guessing",
      "Distinguishes 'no index used' (seq scan) from 'index used but plan still bad' (sort, join order, stale stats)",
      "Names a concrete non-sargable predicate example (function wrapping an indexed column)",
    ],
    followUpQuestions: [
      "What's the difference between EXPLAIN and EXPLAIN ANALYZE?",
      "What is a 'sargable' predicate and why does wrapping a column in a function break it?",
      "How would stale table statistics cause the optimizer to choose a bad plan even with the right index present?",
    ],
    commonMistakes: [
      "Assuming 'table grew, so add an index' without confirming via EXPLAIN which problem actually exists",
      "Not knowing what a non-sargable predicate is or how it silently disables index usage",
    ],
    discussionPoints: ["EXPLAIN / EXPLAIN ANALYZE", "Sequential scan vs index scan", "Non-sargable predicates", "Stale statistics"],
    scenarioBased: true,
  },
];

export default indexingInterviewQuestions;
