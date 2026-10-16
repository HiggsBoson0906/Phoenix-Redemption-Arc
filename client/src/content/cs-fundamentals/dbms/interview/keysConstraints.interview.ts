// src/content/cs-fundamentals/dbms/interview/keysConstraints.interview.ts

import type { InterviewQuestion } from "@/types";

const keysConstraintsInterviewQuestions: InterviewQuestion[] = [
  {
    id: "keys-constraints-iv-1",
    question: "Explain the difference between a primary key, a candidate key, and a super key.",
    difficulty: "Easy",
    detailedAnswer:
      "A super key is any set of one or more columns whose values uniquely identify each row in a table — by this definition, all columns together always trivially form a super key. A candidate key is a minimal super key: you cannot remove any column from it without losing the uniqueness guarantee. A table can have several candidate keys. The primary key is the single candidate key the schema designer chooses as the table's official identifier — it cannot contain NULLs, and a table has exactly one. So the relationship is one of containment: primary key is one specific candidate key, and every candidate key is a super key, but not every super key is minimal (candidate) and not every candidate key is chosen (primary).",
    idealAnswer:
      "I'd describe it as three concentric circles: super keys are the loosest (any uniquely-identifying combination, redundancy allowed), candidate keys are the minimal ones inside that set, and the primary key is just one candidate key the team picked as the 'official' one — usually because it's small, stable, and never null. An Employee table might have both employeeId and email as candidate keys, but employeeId gets chosen as primary key because emails can change and are heavier to index.",
    interviewerExpectations: [
      "Correctly nests the three concepts rather than treating them as unrelated terms",
      "Gives or accepts a concrete example with multiple candidate keys",
      "Mentions minimality as the defining property of a candidate key",
    ],
    followUpQuestions: [
      "What's an alternate key?",
      "Why might you choose a surrogate key over a natural candidate key as primary key?",
      "Can a super key contain a column that isn't needed for uniqueness?",
    ],
    commonMistakes: [
      "Saying primary key and candidate key are the same thing",
      "Forgetting that a table can have multiple candidate keys but only one primary key",
    ],
    discussionPoints: ["Key minimality", "Surrogate vs natural keys", "Candidate key selection"],
  },
  {
    id: "keys-constraints-iv-2",
    question: "What's the practical difference between a UNIQUE constraint and a PRIMARY KEY constraint?",
    difficulty: "Easy",
    detailedAnswer:
      "Both enforce that no two rows share the same value in the constrained column(s), but they differ in two important ways. First, NULL handling: a PRIMARY KEY column can never contain NULL, while a UNIQUE column can contain NULL, and most engines (including PostgreSQL and MySQL) allow multiple NULLs in a UNIQUE column because NULL is not considered equal to another NULL under three-valued SQL logic. Second, cardinality: a table can have exactly one PRIMARY KEY (which may be composite, spanning multiple columns) but any number of UNIQUE constraints. In practice, UNIQUE is used for alternate/candidate keys that aren't the chosen row identifier — like enforcing a unique email on a Users table that's keyed by a surrogate id.",
    idealAnswer:
      "The rule of thumb I use: PRIMARY KEY is 'the one identity this row is looked up by, always present' — never null, only one per table. UNIQUE is 'this value can't be duplicated, but it's fine if it's sometimes absent' — like a middleName-free field or an optional but-must-be-unique referral code, and you can stack as many UNIQUE constraints as the business rules require.",
    interviewerExpectations: [
      "Correctly states NULL handling difference",
      "Correctly states cardinality difference (one PK vs many UNIQUE)",
      "Gives a realistic example of when you'd use UNIQUE instead of PRIMARY KEY",
    ],
    followUpQuestions: [
      "Does a UNIQUE constraint automatically create an index? Does a PRIMARY KEY?",
      "Can a UNIQUE constraint span multiple columns?",
      "How would two NULLs interact with a UNIQUE constraint in most databases?",
    ],
    commonMistakes: [
      "Claiming UNIQUE and PRIMARY KEY behave identically with NULL",
      "Not knowing a table can have multiple UNIQUE constraints",
    ],
    discussionPoints: ["NULL semantics in SQL", "Constraint cardinality", "Indexing implications"],
  },
  {
    id: "keys-constraints-iv-3",
    question: "Explain foreign key ON DELETE options — CASCADE, SET NULL, and RESTRICT — with an example of when you'd use each.",
    difficulty: "Medium",
    detailedAnswer:
      "These clauses define what happens to child rows when a referenced parent row is deleted. ON DELETE CASCADE automatically deletes all child rows referencing the deleted parent — appropriate when child rows have no meaning without the parent, like OrderItem rows when their Order is deleted. ON DELETE SET NULL sets the foreign key column in child rows to NULL instead of deleting them — appropriate when the child can meaningfully exist without that particular parent, like an Employee.managerId being set to NULL if the manager is deleted, rather than deleting the employee. ON DELETE RESTRICT (or the default NO ACTION in most engines) blocks the delete entirely if any child rows still reference the parent, forcing an explicit decision — appropriate for data you never want silently cascaded away, like preventing deletion of a Customer who still has historical Order records.",
    idealAnswer:
      "I pick based on what the child row means without its parent. If it's meaningless alone — like OrderItems without an Order — CASCADE. If the child is still meaningful but the link is now just unknown — like an employee whose manager left — SET NULL. And if losing the link would be a data-integrity disaster, like deleting a customer with order history, I'd use RESTRICT so the delete fails loudly and forces someone to make an explicit decision, like archiving instead of deleting.",
    interviewerExpectations: [
      "Correctly explains what each option does mechanically",
      "Gives a distinct, sensible real-world example for each",
      "Shows judgment about default behavior (RESTRICT/NO ACTION) being the safe choice absent other requirements",
    ],
    followUpQuestions: [
      "What's the difference between RESTRICT and NO ACTION specifically?",
      "Can ON DELETE CASCADE chain across multiple levels of foreign keys?",
      "What are the risks of using CASCADE too liberally in a schema?",
    ],
    commonMistakes: [
      "Using the same example for all three options without distinguishing them",
      "Not recognizing CASCADE can have dangerous chain-reaction effects across deeply nested foreign keys",
    ],
    discussionPoints: ["Cascading deletes", "Data integrity vs convenience trade-off", "Soft delete alternatives"],
  },
  {
    id: "keys-constraints-iv-4",
    question: "Why would you choose a surrogate key (like an auto-increment integer or UUID) over a natural key (like email or SSN) as a table's primary key?",
    difficulty: "Medium",
    detailedAnswer:
      "Natural keys are real-world attributes that happen to be unique (email, SSN, ISBN), while surrogate keys are artificial identifiers with no business meaning, generated purely for identification. Surrogate keys are preferred as primary keys for several reasons: they're typically smaller and faster to index and join on than a variable-length string like email; they never need to change, whereas natural keys sometimes do (a user changes their email, a product's SKU gets revised) — and if a natural key used as a primary key changes, every foreign key referencing it must cascade-update too, which is expensive and risky; and they avoid leaking sensitive natural data (like SSN) into every foreign-key-carrying child table and every join/log statement. The natural key is still valuable — it's usually kept as a UNIQUE constraint (alternate key) for lookups and to enforce real-world uniqueness — but it's decoupled from being the thing foreign keys point at.",
    idealAnswer:
      "The core argument is stability and cost of change: a surrogate key is guaranteed to never need to change for business reasons, so every foreign key referencing it stays valid forever. If I used email as the primary key and a user changed their email, that update would have to cascade into every table referencing them — costly and risky at scale. I still put a UNIQUE constraint on email for lookups and to enforce the real-world uniqueness rule, but I keep it out of the FK graph.",
    interviewerExpectations: [
      "Explains the stability/mutability argument, not just 'it's faster'",
      "Mentions keeping the natural key as a UNIQUE constraint rather than discarding it",
      "Understands the cascading-update cost if a natural key used as PK changes",
    ],
    followUpQuestions: [
      "What are the downsides of surrogate keys (e.g. auto-increment leaking row counts, or needing an extra join to check natural uniqueness)?",
      "UUID vs auto-increment integer as a surrogate key — trade-offs?",
      "When might a natural key actually be the right choice for a primary key?",
    ],
    commonMistakes: [
      "Saying natural keys should never be used at all, instead of demoting them to UNIQUE alternate keys",
      "Not considering the cascading-update cost as the central argument",
    ],
    discussionPoints: ["Surrogate vs natural keys", "Cascading updates", "UUID vs auto-increment trade-offs"],
  },
  {
    id: "keys-constraints-iv-5",
    question: "You inherit a production schema where the Orders table has no foreign key constraint on customerId — it's just an integer column, enforced only by application code. You've found several Orders rows with a customerId that doesn't match any row in Customers. How would you diagnose the scope of the problem and safely add a proper foreign key constraint going forward?",
    difficulty: "Hard",
    detailedAnswer:
      "First I'd quantify the damage: run a query like `SELECT o.* FROM Orders o LEFT JOIN Customers c ON o.customerId = c.id WHERE c.id IS NULL` to find every orphaned Orders row, and check whether they cluster around a specific time period, feature, or bug deploy (which usually points at the root cause — a race condition, a customer-deletion job that didn't cascade, or a bulk import script). Before adding the constraint, I'd decide what to do with each orphaned row: if they're legitimately garbage (test data, a known bad migration), I'd archive and remove them; if they represent real orders whose customer was wrongly deleted, I might need to either restore/recreate a placeholder Customer row or reassign them to a 'deleted customer' sentinel row, depending on business rules around financial/audit records. Only after the existing data is clean would I run `ALTER TABLE Orders ADD CONSTRAINT fk_orders_customer FOREIGN KEY (customerId) REFERENCES Customers(id)` — most engines validate all existing rows when adding the constraint and will reject it if any violations remain, so this also serves as a final correctness check. Going forward I'd also add monitoring/alerting on any application code path that deletes Customers to make sure it either cascades correctly or is blocked, and treat 'foreign key constraint exists' as a required part of code review for any new relational column, not an afterthought.",
    idealAnswer:
      "I'd treat this as a data-integrity incident, not just a schema change. First, measure the blast radius with a LEFT JOIN to find every orphaned row and look for a pattern in when they were created — that usually reveals the root cause, like a delete path that skipped cleanup. Then I'd resolve the existing bad data — archiving, reassigning, or restoring placeholders depending on what the business needs from historical orders — before attempting to add the constraint, since the ALTER TABLE will fail validation otherwise. Adding the FK afterward isn't just future-proofing; the fact that it fails on dirty data is itself a useful integrity check that confirms the cleanup actually worked. I'd also close the loop by making sure whatever caused the orphans in the first place — likely an uncoordinated delete — can't happen again.",
    interviewerExpectations: [
      "Proposes a concrete query to find orphaned rows, not just 'check for bad data'",
      "Recognizes that existing bad data must be resolved before the constraint can be added",
      "Thinks about root cause (why did this happen) in addition to the immediate fix",
      "Considers business implications of orphaned financial/order records, not just technical cleanup",
    ],
    followUpQuestions: [
      "What SQL would you write to find the orphaned rows?",
      "How would you add the constraint with minimal downtime on a very large, high-traffic Orders table?",
      "How would you prevent this class of bug from recurring at the application layer too, as defense in depth?",
    ],
    commonMistakes: [
      "Jumping straight to adding the constraint without addressing existing violations",
      "Ignoring the need to investigate root cause",
      "Not considering the business/financial implications of deleting or reassigning historical order data",
    ],
    discussionPoints: ["Data integrity incident response", "Orphaned row detection", "Constraint rollout on live tables", "Root-cause analysis"],
    scenarioBased: true,
  },
];

export default keysConstraintsInterviewQuestions;
