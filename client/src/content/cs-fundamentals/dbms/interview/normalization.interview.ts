// src/content/cs-fundamentals/dbms/interview/normalization.interview.ts

import type { InterviewQuestion } from "@/types";

const normalizationInterviewQuestions: InterviewQuestion[] = [
  {
    id: "normalization-iv-1",
    question: "What is normalization, and what problems does it solve?",
    difficulty: "Easy",
    detailedAnswer:
      "Normalization is the process of organizing columns and tables to minimize data redundancy, guided by functional dependencies. It solves three specific problems caused by redundant data in a poorly structured table: update anomalies (the same fact stored in multiple rows can be updated in some rows but not others, leaving contradictory data), insertion anomalies (you can't record a fact about an entity until an unrelated fact is also available — e.g. can't add a new course with no students yet if course data only lives inside enrollment rows), and deletion anomalies (deleting one fact accidentally destroys another unrelated fact stored redundantly in the same row, e.g. deleting the last enrollment for a course wipes out the course's name too). Normalization proceeds through defined stages — 1NF, 2NF, 3NF, BCNF — each removing a specific category of redundancy tied to functional dependencies.",
    idealAnswer:
      "I'd anchor the answer on the three anomalies rather than just reciting normal form definitions — update, insertion, deletion — because that's the actual motivation. Normalization is the formal recipe for restructuring a table, using functional dependencies as the guide, so that every fact lives in exactly one place and none of those three anomalies can happen.",
    interviewerExpectations: [
      "Names the three anomalies (update, insertion, deletion) with concrete meaning, not just buzzwords",
      "Connects normalization to functional dependencies as the underlying tool",
      "Doesn't just recite 1NF/2NF/3NF definitions without explaining the motivation",
    ],
    followUpQuestions: [
      "Can you give a concrete example of an insertion anomaly?",
      "What's a functional dependency?",
      "Is a fully normalized database always the right choice?",
    ],
    commonMistakes: [
      "Reciting normal form definitions without explaining why they matter",
      "Confusing normalization with indexing or general schema design",
    ],
    discussionPoints: ["Update/insertion/deletion anomalies", "Functional dependencies", "Redundancy"],
  },
  {
    id: "normalization-iv-2",
    question: "Given a table StudentCourse(StudentID, StudentName, CourseID, CourseName, Grade) where the candidate key is (StudentID, CourseID), identify which normal form it violates and show how you'd fix it.",
    difficulty: "Medium",
    detailedAnswer:
      "The candidate key is the composite (StudentID, CourseID) since together they uniquely identify a row, but Grade is the only attribute that genuinely needs both. StudentName depends only on StudentID, and CourseName depends only on CourseID — both are partial dependencies of a non-prime attribute on part of the composite key, which violates 2NF. To fix it, I'd decompose into three tables: Student(StudentID, StudentName), Course(CourseID, CourseName), and Enrollment(StudentID, CourseID, Grade) — where Enrollment's Grade attribute correctly depends on the full composite key, and StudentName/CourseName are moved to tables where they depend on their full (single-column) key.",
    idealAnswer:
      "First I identify the key — (StudentID, CourseID) — then I check every other attribute against it. StudentName only needs StudentID, CourseName only needs CourseID, so both are partial dependencies and this fails 2NF. The fix is the standard decomposition: pull Student and Course out into their own tables keyed by their single ID, and leave Enrollment holding just the keys plus Grade, since Grade genuinely needs both parts of the composite key.",
    interviewerExpectations: [
      "Correctly identifies the composite candidate key first",
      "Correctly identifies partial dependency as the specific violation (not just 'it's not normalized')",
      "Produces a correct 3-table decomposition, keeping Grade with the full key",
    ],
    followUpQuestions: [
      "Is this decomposition now in 3NF? Why?",
      "What would change if InstructorName were added, determined by CourseID?",
      "What query would you write to reconstruct the original StudentCourse view via JOINs?",
    ],
    commonMistakes: [
      "Misidentifying the candidate key (e.g. thinking StudentID alone is a key)",
      "Calling it a 'transitive dependency' instead of correctly identifying it as partial",
      "Losing the Grade attribute or misplacing it in the decomposition",
    ],
    discussionPoints: ["Partial dependency", "2NF decomposition", "Composite keys"],
  },
  {
    id: "normalization-iv-3",
    question: "Explain the difference between 3NF and BCNF with an example where a table satisfies one but not the other.",
    difficulty: "Hard",
    detailedAnswer:
      "3NF requires that for every non-trivial functional dependency X → Y, either X is a superkey, or every attribute in Y is a prime attribute (part of some candidate key). BCNF removes that second exception: X must always be a superkey, period. They diverge only when a table has multiple overlapping candidate keys. Classic example: R(Student, Subject, Teacher), where each teacher teaches exactly one subject (Teacher → Subject) but a student can learn a subject from several different teachers. This gives two candidate keys: (Student, Subject) and (Student, Teacher). Checking the FD Teacher → Subject against 3NF: Teacher isn't a superkey, but Subject is a prime attribute because it's part of the candidate key (Student, Subject) — so 3NF's exception applies and this table is in 3NF. Checking the same FD against BCNF: Teacher still isn't a superkey, and BCNF has no exception for Subject being prime, so this table violates BCNF. To fix it for BCNF, you'd decompose into TeacherSubject(Teacher, Subject) and StudentTeacher(Student, Teacher) — but you'd lose the ability to enforce (Student, Subject) → Teacher as a simple single-table constraint, which is the classic trade-off BCNF decomposition can force.",
    idealAnswer:
      "The two normal forms only disagree in one specific situation: a non-superkey determines an attribute that happens to be part of a *different* candidate key. The textbook example is Student-Subject-Teacher, where Teacher determines Subject but Teacher alone isn't a key — because Subject is prime (part of the (Student, Subject) key), 3NF lets it slide, but BCNF doesn't, since BCNF just asks 'is the determinant a superkey' with no exceptions. Decomposing to BCNF here actually costs you something — you can no longer directly enforce that a given (Student, Subject) pair maps to one Teacher without a join — which is a good talking point on why BCNF isn't unconditionally 'better.'",
    interviewerExpectations: [
      "States the precise rule difference (superkey requirement plus the prime-attribute exception in 3NF)",
      "Produces a correct example with legitimate overlapping candidate keys, not an invented broken one",
      "Recognizes the trade-off that BCNF decomposition can lose the ability to enforce certain constraints without a join",
    ],
    followUpQuestions: [
      "What are the two candidate keys of R(Student, Subject, Teacher) and why?",
      "What constraint do you lose the ability to enforce simply after decomposing to BCNF here?",
      "Is it always possible to achieve a BCNF decomposition that is both lossless and dependency-preserving?",
    ],
    commonMistakes: [
      "Giving an example where the candidate keys don't actually overlap (making 3NF and BCNF identical, missing the point)",
      "Not identifying that BCNF decomposition can sacrifice dependency preservation",
      "Vague claim that 'BCNF is just stricter' without stating the specific rule that differs",
    ],
    discussionPoints: ["Overlapping candidate keys", "Dependency preservation vs lossless decomposition", "3NF's prime-attribute exception"],
  },
  {
    id: "normalization-iv-4",
    question: "When would you deliberately denormalize a schema, and what risks does that introduce?",
    difficulty: "Medium",
    detailedAnswer:
      "Denormalization is justified when read performance matters more than write-time integrity guarantees and the redundancy risk is manageable — most commonly in read-heavy analytics/reporting systems, materialized views, or caching layers, where data is written once (often via a controlled ETL pipeline) and read very frequently, so avoiding repeated JOINs meaningfully speeds up queries. It's also common for specific hot-path fields in OLTP systems, like storing a denormalized orderTotal on the Order row instead of recomputing it from OrderItems on every read. The risk is reintroducing the exact anomalies normalization was designed to prevent: if the same fact lives in two places, an update to one and not the other creates silent inconsistency, so denormalized fields need a clear, enforced update strategy (triggers, application-layer transactions, or scheduled reconciliation) or they will drift.",
    idealAnswer:
      "I denormalize when I can point to a specific, measured read-performance problem caused by joins, and the write path where the redundant data gets updated is narrow and controllable — like a nightly ETL job populating a reporting table, or a single well-tested code path updating both an OrderItems table and a cached orderTotal column together in the same transaction. What I avoid is denormalizing 'by default' or in a table with many independent write paths, because then keeping the redundant copies in sync becomes an unenforced convention instead of a guarantee, and that's exactly how data-consistency bugs creep in.",
    interviewerExpectations: [
      "Gives concrete scenarios (analytics/reporting, caching, hot-path aggregates) rather than a vague 'for performance'",
      "Explicitly names the reintroduced anomaly risk",
      "Discusses how to keep denormalized data consistent (triggers, transactions, ETL) rather than ignoring the problem",
    ],
    followUpQuestions: [
      "How would you keep a denormalized orderTotal column consistent with its OrderItems?",
      "What's the difference between denormalization and using a materialized view?",
      "How would you decide whether a slow JOIN-heavy query should be fixed with indexing or with denormalization?",
    ],
    commonMistakes: [
      "Treating denormalization as free performance with no downside",
      "Not proposing any mechanism to keep redundant data in sync",
    ],
    discussionPoints: ["Read vs write optimization trade-off", "Materialized views", "Consistency maintenance strategies"],
  },
  {
    id: "normalization-iv-5",
    question: "You're designing the schema for a simple e-commerce orders system from scratch: Customers place Orders, each Order contains multiple Products with quantities, and each Product has a price that can change over time. Walk through a normalized schema and explain how you'd avoid a subtle but common bug: historical order totals changing when a product's price is updated later.",
    difficulty: "Hard",
    detailedAnswer:
      "Core tables: Customer(customerId PK, name, email UNIQUE), Product(productId PK, name, currentPrice), Order(orderId PK, customerId FK, orderDate, status), and OrderItem(orderId FK, productId FK, quantity, unitPriceAtOrder) with (orderId, productId) as the composite primary key. The critical design decision is unitPriceAtOrder on OrderItem: if I only stored productId and looked up Product.currentPrice to compute historical order totals, then any future price change would silently rewrite the total of every past order that included that product — a real and common bug. By snapshotting the price at the moment of purchase directly onto OrderItem, each historical order's total is computed from immutable data and stays correct forever, independent of what happens to Product.currentPrice afterward. This is a deliberate, justified denormalization: unitPriceAtOrder is redundant with Product.currentPrice at the instant of purchase, but it's redundant on purpose, because the two values have fundamentally different lifecycles — one is a live current value, the other is a permanent historical fact.",
    idealAnswer:
      "I'd start from the normalized core — Customer, Product, Order, and an OrderItem junction table for the Order-Product M:N relationship — but I'd flag one attribute that looks redundant and isn't: OrderItem needs its own unitPriceAtOrder column, a snapshot of Product.currentPrice at purchase time, rather than joining to Product for the price whenever I compute a total. If I don't snapshot it, changing a product's price next month silently changes the computed total of every historical order containing that product, which is a real bug I've seen bite people — orders are supposed to be immutable financial records, and immutability requires the price to be captured at the time of the transaction, not derived live from a mutable table.",
    interviewerExpectations: [
      "Produces a correct core schema: Customer, Product, Order, OrderItem junction table with composite key",
      "Identifies the price-snapshot issue proactively or when prompted, and explains it as an integrity/immutability concern, not just a performance one",
      "Understands this specific redundancy is intentional and justified, distinguishing it from accidental denormalization",
    ],
    followUpQuestions: [
      "How would you handle a product being deleted after it appears in historical orders?",
      "Would you also snapshot the product name on OrderItem? Why or why not?",
      "How would you compute total revenue for a given month efficiently with this schema?",
    ],
    commonMistakes: [
      "Computing historical order totals by joining to Product.currentPrice, missing the historical-accuracy bug entirely",
      "Forgetting the composite primary key on the OrderItem junction table",
      "Not distinguishing intentional, justified redundancy (price snapshot) from accidental denormalization",
    ],
    discussionPoints: ["Price/historical snapshotting", "Immutable financial records", "Junction table design", "Intentional vs accidental redundancy"],
    scenarioBased: true,
  },
];

export default normalizationInterviewQuestions;
