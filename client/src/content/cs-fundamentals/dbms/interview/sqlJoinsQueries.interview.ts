// src/content/cs-fundamentals/dbms/interview/sqlJoinsQueries.interview.ts

import type { InterviewQuestion } from "@/types";

const sqlJoinsQueriesInterviewQuestions: InterviewQuestion[] = [
  {
    id: "sql-joins-queries-iv-1",
    question: "Explain the difference between INNER JOIN and LEFT JOIN with a concrete example.",
    difficulty: "Easy",
    detailedAnswer:
      "INNER JOIN returns only rows where the join condition matches in both tables — any row from either table without a corresponding match is excluded entirely from the result. LEFT JOIN returns every row from the left table regardless of whether a match exists in the right table; when there's no match, the right table's columns are filled with NULL. For example, with Customer(id, name) and Orders(id, customerId), 'Customer INNER JOIN Orders ON Customer.id = Orders.customerId' only returns customers who have placed at least one order, silently dropping customers with zero orders. 'Customer LEFT JOIN Orders' keeps every customer, showing NULL for order columns when a customer has none — which is the correct choice if the goal is 'all customers and their orders, including customers with none.'",
    idealAnswer:
      "The way I explain it: INNER JOIN is 'only show me rows that exist on both sides,' LEFT JOIN is 'show me everything from the left table no matter what, and fill in NULLs if the right side has nothing.' The example I always reach for is customers and orders — INNER JOIN would silently hide customers who've never ordered, which is exactly the kind of bug that looks fine in testing with clean seed data but breaks a 'total customer count' report in production.",
    interviewerExpectations: [
      "Correctly states which rows are excluded/included for each join type",
      "Explains NULL-filling behavior in LEFT JOIN specifically",
      "Uses a concrete, realistic example rather than abstract table names only",
    ],
    followUpQuestions: [
      "What would RIGHT JOIN return for the same example?",
      "How would you find customers with zero orders using this join?",
      "What happens if you add a WHERE filter on the Orders table's columns to a LEFT JOIN?",
    ],
    commonMistakes: [
      "Saying LEFT JOIN 'includes more columns' rather than 'includes more rows'",
      "Not mentioning that unmatched columns become NULL",
    ],
    discussionPoints: ["Row inclusion semantics", "NULL padding", "Anti-join pattern"],
  },
  {
    id: "sql-joins-queries-iv-2",
    question: "If you put a filter on the right table's column in the WHERE clause of a LEFT JOIN versus in the ON clause, does it change the result? Explain with an example.",
    difficulty: "Medium",
    detailedAnswer:
      "Yes, significantly. Consider Customer LEFT JOIN Orders ON Customer.id = Orders.customerId, wanting only orders with status = 'shipped'. If you write 'LEFT JOIN Orders ON Customer.id = Orders.customerId WHERE Orders.status = \\'shipped\\'', the WHERE clause runs after the join, and any customer whose only orders aren't shipped (or who has no orders at all) gets NULL for Orders.status, which fails the WHERE filter — so that customer is dropped entirely from the results, making the query behave like an INNER JOIN for practical purposes. If instead you write 'LEFT JOIN Orders ON Customer.id = Orders.customerId AND Orders.status = \\'shipped\\'', the status filter is part of the matching condition itself — every customer is still kept (LEFT JOIN's core guarantee), but only their shipped orders are matched; customers with no shipped orders simply get NULL order columns instead of being removed. The rule of thumb: right-table conditions that should still preserve unmatched left rows belong in ON; conditions that should actually filter out rows (post-join) belong in WHERE.",
    idealAnswer:
      "This is one of my favorite 'do you actually understand joins' questions to ask candidates too, because it looks like it shouldn't matter and it very much does. Filtering on the right table's column in WHERE happens after the outer join has already produced NULLs for unmatched rows, and since 'NULL = anything' is never true in SQL, those rows get filtered out — which quietly turns your LEFT JOIN into an INNER JOIN. If you actually want to keep all left rows and only narrow down which right rows are allowed to match, that condition needs to live in the ON clause instead.",
    interviewerExpectations: [
      "Correctly explains that WHERE-placed right-table filters can turn LEFT JOIN into INNER JOIN-like behavior",
      "Explains why: NULL fails standard WHERE comparisons",
      "Gives the fix (move the condition into ON) with reasoning",
    ],
    followUpQuestions: [
      "Does this same issue apply to a filter on the left table's column?",
      "How would you write a query for 'all customers, and only their shipped orders if any'?",
      "Would an EXPLAIN plan reveal this difference?",
    ],
    commonMistakes: [
      "Claiming there's no difference between WHERE and ON placement for outer joins",
      "Not connecting the behavior to NULL comparison semantics",
    ],
    discussionPoints: ["ON vs WHERE semantics", "NULL comparison logic", "Outer join preservation"],
  },
  {
    id: "sql-joins-queries-iv-3",
    question: "How would you write a query to find the second-highest salary in an Employee table, and what are the trade-offs of different approaches?",
    difficulty: "Medium",
    detailedAnswer:
      "A few valid approaches with different trade-offs. (1) Subquery with MAX: 'SELECT MAX(salary) FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee)' — simple and portable, but generalizes awkwardly to 'Nth highest' (needs nested subqueries) and silently returns NULL if there's no second distinct value (e.g. all employees tied at the max salary). (2) OFFSET/LIMIT: 'SELECT DISTINCT salary FROM Employee ORDER BY salary DESC LIMIT 1 OFFSET 1' — clean and generalizes trivially to Nth highest by changing OFFSET, but needs DISTINCT to correctly handle duplicate salary values (without DISTINCT, two employees tied for the highest salary would make the 'second row' still be the same top salary, not the true second-highest distinct value). (3) Window function: 'SELECT salary FROM (SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk FROM Employee) t WHERE rnk = 2' — the most robust and flexible option, since DENSE_RANK() correctly handles ties (multiple employees at the highest salary all get rank 1, and the true next distinct value gets rank 2), and it generalizes cleanly to top-N-per-group problems. In an interview I'd lead with the window function approach as the 'best practice' answer while being able to explain the subquery version as the simpler fallback for engines without window function support.",
    idealAnswer:
      "I'd present three options in increasing order of robustness. A correlated MAX subquery works but breaks down for 'Nth highest' and mishandles ties awkwardly. ORDER BY DESC LIMIT 1 OFFSET 1 with DISTINCT is cleaner and generalizes to Nth by changing the offset, but you have to remember the DISTINCT or duplicate top salaries corrupt the result. My actual go-to is DENSE_RANK() in a window function, because it explicitly handles the tie-breaking question — 'is the second-highest salary the second distinct value, or the second row when the top salary is repeated?' — in a way the interviewer can't dispute, and it extends cleanly to arbitrary N or per-department variants with a PARTITION BY.",
    interviewerExpectations: [
      "Presents at least two approaches with correct SQL",
      "Explicitly discusses the tie-handling edge case (duplicate top salaries)",
      "Can generalize the approach to 'Nth highest' without starting over",
    ],
    followUpQuestions: [
      "How would you find the 3rd highest salary per department?",
      "What index would help this query perform well on a large table?",
      "What's the difference between RANK(), DENSE_RANK(), and ROW_NUMBER()?",
    ],
    commonMistakes: [
      "Forgetting DISTINCT with the OFFSET/LIMIT approach, breaking on duplicate top salaries",
      "Not knowing a window-function-based approach at all",
      "Providing a solution that returns NULL or errors when there's no second distinct salary, without acknowledging the edge case",
    ],
    discussionPoints: ["Window functions", "Tie handling", "Nth-highest generalization"],
  },
  {
    id: "sql-joins-queries-iv-4",
    question: "When would you prefer a subquery over a JOIN, or vice versa?",
    difficulty: "Medium",
    detailedAnswer:
      "I'd reach for a JOIN when I need columns from both tables in the final result set — a JOIN is the natural tool for combining data. I'd reach for a subquery (particularly EXISTS or IN) when I only need to filter rows in one table based on a condition involving another table, without needing any columns from that other table in the output — e.g. 'find customers who have placed at least one order' doesn't need any Orders columns in the result, so 'WHERE EXISTS (SELECT 1 FROM Orders WHERE Orders.customerId = Customer.id)' is often clearer and can be more efficient than a JOIN + DISTINCT, since it avoids the risk of duplicate customer rows if a customer has multiple orders (a JOIN would produce one row per matching order, requiring an extra DISTINCT to collapse back to one row per customer). A correlated subquery is also the natural tool for per-row comparisons against an aggregate of a related group, like 'employees earning more than their department's average salary,' which is awkward to express as a plain JOIN without a separate aggregated subquery anyway.",
    idealAnswer:
      "My rule of thumb: if I need data from the other table in my output columns, JOIN. If I only need to test whether a related row exists or matches a condition, EXISTS/subquery, because it avoids the row-duplication problem a JOIN can cause when the related table has multiple matches per row — that duplication is a subtle bug I've seen mess up SUM/COUNT aggregates when people forget it's happening.",
    interviewerExpectations: [
      "Identifies 'do I need columns from the other table' as the deciding factor",
      "Mentions the row-duplication/fan-out risk of JOIN for existence-style checks",
      "Can name EXISTS/IN as the natural tool for existence checks",
    ],
    followUpQuestions: [
      "How does a JOIN's row-duplication issue affect a SUM aggregate specifically?",
      "When would NOT EXISTS be preferable to NOT IN, especially regarding NULLs?",
      "Would a query optimizer typically rewrite an EXISTS subquery into a JOIN internally?",
    ],
    commonMistakes: [
      "Treating subqueries and JOINs as always interchangeable with no trade-offs",
      "Not mentioning the fan-out/duplication risk with JOIN for existence checks",
    ],
    discussionPoints: ["EXISTS vs JOIN", "Row duplication/fan-out", "Query optimizer rewriting"],
  },
  {
    id: "sql-joins-queries-iv-5",
    question: "A dashboard report query joins Orders, OrderItems, and Products to compute total revenue per product category, and it's timing out on a large production database. How would you approach diagnosing and fixing it?",
    difficulty: "Hard",
    detailedAnswer:
      "First I'd get the actual query plan with EXPLAIN (or EXPLAIN ANALYZE) to see where time is actually going, rather than guessing — specifically checking whether the joins are using index lookups or falling back to full table scans/nested loops on large tables. Common root causes I'd check for: missing indexes on the join columns (Orders.id referenced by OrderItems.orderId, Products.id referenced by OrderItems.productId, and any filtering column like Orders.orderDate if the report is scoped to a date range) — a join on an unindexed foreign key forces the engine into an expensive scan-and-match instead of an index lookup; a fan-out problem where joining Orders to OrderItems (1:N) inflates row counts before aggregation, which is fine for SUM(OrderItems.subtotal) but would silently corrupt any aggregate computed on Orders-level columns directly if not handled carefully; and whether the query is filtering by date range at all or scanning the entire historical Orders table for a report that only needs, say, the last 30 days. Fixes in likely order of impact: add a composite index on (orderId) for OrderItems and (productId) for OrderItems if missing, add an index on Orders.orderDate if the report is date-scoped and push that filter as early as possible (ideally into a WHERE that can use an index before the joins happen), and consider a pre-aggregated summary/materialized table refreshed on a schedule (e.g., nightly) if this report is run frequently against a large, mostly-historical dataset — trading a bit of staleness for a query that reads a tiny pre-computed table instead of joining and aggregating millions of rows live. I'd validate any index change against the actual EXPLAIN plan before and after, rather than assuming it helped.",
    idealAnswer:
      "I wouldn't guess — I'd pull the EXPLAIN ANALYZE plan first and see whether the joins are hitting indexes or doing sequential scans, since that immediately tells me if this is an indexing problem or a genuinely large-data problem. If it's missing indexes on the join or filter columns, that's a quick, high-confidence fix. If the indexes are already fine and the query is just aggregating a huge historical range every time it's run, I'd push back on the requirement — does this report really need to recompute from raw Orders/OrderItems every time, or would a nightly-refreshed summary table make more sense given it's a dashboard, not a real-time view? I'd also double check for a fan-out bug: joining Orders to OrderItems multiplies Orders rows, so if anyone computed something like AVG(Orders.someColumn) after that join without deduplicating, the numbers would be quietly wrong even before you get to the performance problem.",
    interviewerExpectations: [
      "Starts with EXPLAIN/query plan rather than guessing at a fix",
      "Names concrete likely causes: missing indexes on join/filter columns, unbounded date range, fan-out",
      "Proposes a proportionate fix (index vs materialized summary table) based on what diagnosis reveals",
      "Considers validating the fix rather than assuming it worked",
    ],
    followUpQuestions: [
      "What specific indexes would you add, and on which columns exactly?",
      "How would a materialized/summary table be kept up to date, and what staleness would be acceptable for a dashboard?",
      "How does the fan-out problem from the Orders-OrderItems join affect an aggregate like AVG on Orders-level data?",
    ],
    commonMistakes: [
      "Jumping to 'add an index' without first looking at the query plan to confirm that's the bottleneck",
      "Not considering the fan-out/duplication correctness risk, only the performance angle",
      "Suggesting denormalization or caching without discussing staleness trade-offs for a reporting use case",
    ],
    discussionPoints: ["Query plan analysis", "Index selection on join/filter columns", "Fan-out aggregation bugs", "Materialized summary tables"],
    scenarioBased: true,
  },
];

export default sqlJoinsQueriesInterviewQuestions;
