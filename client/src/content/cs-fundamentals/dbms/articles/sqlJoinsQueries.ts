// src/content/cs-fundamentals/dbms/articles/sqlJoinsQueries.ts

import type { Article } from "@/types";

const sqlJoinsQueriesArticle: Article = {
  slug: "sql-joins-queries",
  title: "SQL Joins & Queries",
  summary:
    "Joins are how you reconstruct related data spread across normalized tables, and mastering their exact row-inclusion semantics — not just the syntax — is what separates correct queries from subtly wrong ones.",
  readingTimeMins: 11,
  beginnerExplanation:
    "Once you normalize a database, related data lives in separate tables — Employees in one table, Departments in another, linked by a foreign key. A JOIN is how you ask the database to stitch rows from two (or more) tables back together based on a matching condition, so a single query can answer 'show me each employee's name alongside their department's name' even though that information lives in two different tables.\n\nThe critical thing to internalize early is that different join types disagree about what to do with rows that *don't* have a match on the other side — an INNER JOIN throws them away, a LEFT JOIN keeps them (padding the missing side with NULLs), and so on. Getting this wrong is one of the most common real-world SQL bugs: using INNER JOIN when you actually needed LEFT JOIN silently drops rows from your result set (e.g., 'show all customers and their orders' using INNER JOIN would silently omit customers who have never placed an order).",
  detailedBreakdown:
    "INNER JOIN returns only rows where the join condition matches on both sides — if Employees.DeptID = Departments.DeptID and an employee's DeptID doesn't exist in Departments (or is NULL), that employee is excluded entirely from the result. LEFT (OUTER) JOIN returns every row from the left table regardless of whether a match exists on the right; unmatched rows get NULL for every right-table column. RIGHT (OUTER) JOIN is the mirror image — every row from the right table is kept, with NULLs for unmatched left-table columns; in practice RIGHT JOIN is rarely used since any RIGHT JOIN can be rewritten as a LEFT JOIN by swapping table order, and most style guides prefer LEFT JOIN for consistency. FULL (OUTER) JOIN returns every row from both tables, matching where possible and padding with NULLs on whichever side lacks a match — equivalent to the union of a LEFT JOIN and a RIGHT JOIN result. A CROSS JOIN produces the Cartesian product of two tables — every row from the left paired with every row from the right, with no join condition — its result size is |A| × |B|, and it's rarely intentional in production code except for deliberately generating combinations (like all date × store combinations for a report). A SELF JOIN isn't a distinct join type syntactically — it's any join (usually INNER or LEFT) where a table is joined to itself, typically to compare rows within the same table, like finding each Employee alongside their manager (also stored in the Employee table via a managerId self-referencing foreign key): `SELECT e.name AS employee, m.name AS manager FROM Employee e LEFT JOIN Employee m ON e.managerId = m.id` — LEFT JOIN here matters because the top-level employee (e.g., the CEO) has a NULL managerId and would be dropped entirely by an INNER JOIN.\n\nGROUP BY collapses rows sharing the same value(s) in specified columns into a single summary row, used together with aggregate functions (COUNT, SUM, AVG, MIN, MAX) — e.g., `SELECT deptId, COUNT(*) FROM Employee GROUP BY deptId` gives one row per department with its employee count. Every column in the SELECT list that isn't wrapped in an aggregate function must appear in the GROUP BY clause (strict SQL enforces this; some engines like older MySQL configurations are lenient but it's undefined behavior to rely on). HAVING filters groups *after* aggregation, whereas WHERE filters individual rows *before* grouping — this is why 'HAVING COUNT(*) > 5' works but 'WHERE COUNT(*) > 5' throws an error: WHERE runs before aggregates exist. The logical order of SQL execution (not the written/syntax order) is: FROM/JOIN → WHERE → GROUP BY → HAVING → SELECT → DISTINCT → ORDER BY → LIMIT — understanding this execution order explains why you can't reference a SELECT alias in a WHERE clause but can in an ORDER BY clause.\n\nA subquery is a query nested inside another query, and can often express the same logic as a JOIN but with different performance and semantic characteristics. A correlated subquery (one that references a column from the outer query) is conceptually re-executed once per outer row — e.g., `SELECT name FROM Employee e WHERE salary > (SELECT AVG(salary) FROM Employee WHERE deptId = e.deptId)` finds employees earning above their own department's average, something a plain JOIN can't directly express because it needs a per-row aggregate comparison. An uncorrelated subquery runs once independently, like `SELECT * FROM Orders WHERE customerId IN (SELECT customerId FROM Customer WHERE country = 'India')`. In general, a well-indexed JOIN is usually faster than an equivalent correlated subquery (since modern query optimizers can often rewrite simple subqueries into joins anyway, but correlated subqueries with complex correlation predicates can resist that rewrite and force row-by-row execution) — but subqueries are often more readable for existence checks (EXISTS) or set membership (IN) than the equivalent JOIN + DISTINCT, and EXISTS is typically preferred over IN for large subquery result sets since EXISTS can short-circuit on the first match while IN may need to materialize the full subquery result.",
  realWorldExamples:
    "A 'customers with no orders yet' marketing query is the textbook LEFT JOIN use case: `SELECT c.* FROM Customer c LEFT JOIN Orders o ON c.id = o.customerId WHERE o.id IS NULL` — the LEFT JOIN keeps every customer, and filtering for NULL on the right side isolates exactly the ones with zero matching orders (this pattern, LEFT JOIN + WHERE right.key IS NULL, is the standard idiom for 'anti-join' since not all engines support EXCEPT/NOT EXISTS as conveniently). Analytics dashboards live on GROUP BY + HAVING, e.g. 'departments with more than 10 employees': `SELECT deptId, COUNT(*) AS cnt FROM Employee GROUP BY deptId HAVING COUNT(*) > 10`. Org charts and comment-reply threads are classic self-join (or recursive CTE, for arbitrary depth) territory.",
  useCases: [
    "Reconstructing related data across normalized tables into a single result set for reporting or display (e.g., orders with customer and product details)",
    "Finding unmatched rows between two tables — customers with no orders, products never sold — via LEFT JOIN + IS NULL",
    "Aggregating and summarizing data per group (sales per region, average salary per department) with GROUP BY/HAVING",
  ],
  advantages: [
    "JOINs let you keep data normalized (avoiding redundancy) while still being able to efficiently reconstruct a combined view at query time",
    "A well-indexed JOIN is typically far more efficient than pulling data with separate queries and combining it in application code",
    "GROUP BY/HAVING push aggregation work down to the database engine, which is usually much faster than aggregating in application code after fetching raw rows",
  ],
  disadvantages: [
    "Joining many large tables without proper indexes on the join columns can be very slow, since the engine may fall back to nested-loop scans",
    "Complex multi-table JOINs with several LEFT JOINs can silently multiply row counts (a 'fan-out' problem) if more than one joined table has multiple matching rows per parent row, inflating aggregate calculations unless handled carefully",
    "Overusing correlated subqueries where a JOIN or window function would work can force row-by-row re-execution, hurting performance at scale",
  ],
  commonMisconceptions: [
    "\"INNER JOIN and JOIN are different\" — they're the same thing; JOIN defaults to INNER JOIN in every major SQL engine.",
    "\"WHERE and HAVING are interchangeable\" — WHERE filters rows before grouping/aggregation, HAVING filters groups after aggregation; you cannot reference an aggregate function like COUNT(*) in WHERE.",
    "\"A LEFT JOIN with a filter on the right table's column in WHERE behaves the same as putting that filter in the ON clause\" — putting a right-table filter in WHERE effectively turns the LEFT JOIN into an INNER JOIN for that condition (since unmatched rows have NULL there and fail the WHERE filter), whereas putting it in ON preserves the outer-join behavior and just controls which right-side rows are allowed to match.",
    "\"A subquery is always slower than an equivalent JOIN\" — modern query optimizers frequently rewrite simple subqueries into semantically equivalent joins internally; the performance gap mostly appears with correlated subqueries that resist such rewriting.",
  ],
  interviewPerspective:
    "Interviewers love giving you two small sample tables and asking you to trace through exactly what an INNER JOIN vs LEFT JOIN vs FULL JOIN would return, row by row — this tests whether you actually understand the semantics or just recognize the keywords. Equally common: 'write a query to find employees earning more than their manager' (self-join) and 'find the second-highest salary' (subquery or window function), both of which test whether you reach for the right tool rather than brute-forcing with application code.",
  oaPerspective:
    "OA rounds frequently give a small 2-3 table sample dataset and ask you to predict the exact output rows of a given JOIN query, or to pick the correct query for a described result — the trap questions almost always hinge on NULL handling in outer joins or on WHERE-vs-ON clause placement silently changing an outer join's behavior. GROUP BY/HAVING trick questions (which columns must appear in GROUP BY, does WHERE or HAVING apply to a given filter) are also extremely common.",
  keyTakeaways: [
    "INNER JOIN keeps only matched rows; LEFT/RIGHT JOIN keep all rows from one side padded with NULLs; FULL JOIN keeps all rows from both sides.",
    "CROSS JOIN produces the Cartesian product (no condition); SELF JOIN is any join where a table is joined to itself, usually to compare rows within it.",
    "WHERE filters rows before grouping; HAVING filters groups after aggregation — HAVING is required (not WHERE) to filter on an aggregate result.",
    "Putting a right-table condition in WHERE instead of ON silently converts a LEFT JOIN into behaving like an INNER JOIN for that condition.",
  ],
  summaryClosing:
    "Joins and grouped queries are the daily bread of working with a relational database — the syntax is easy to memorize, but the row-inclusion semantics (what happens to unmatched rows, and where you place a filter) are where real bugs live. Always trace a non-trivial join through a small concrete example before trusting it, in an interview or in production.",
  relatedTopics: ["Normalization", "Keys & Constraints", "Query Optimization"],
  furtherReading: [
    { label: "SQL:2016 standard — Query Expressions", note: "Formal specification of JOIN, GROUP BY, and subquery semantics." },
    { label: "Use the Index, Luke", note: "Excellent free resource on how JOINs interact with indexes in practice." },
  ],
};

export default sqlJoinsQueriesArticle;
