// src/content/cs-fundamentals/dbms/articles/keysConstraints.ts

import type { Article } from "@/types";

const keysConstraintsArticle: Article = {
  slug: "keys-constraints",
  title: "Keys & Constraints",
  summary:
    "Keys are how the relational model guarantees every row is uniquely identifiable and how tables stay correctly linked to each other; constraints are the rules the database enforces to keep data valid.",
  readingTimeMins: 9,
  beginnerExplanation:
    "A key is one or more columns whose value (or combination of values) uniquely identifies a row in a table — no two rows can share the same key value. Without a key, you'd have no reliable way to say 'update this exact row' or 'this row is the same customer as that one.' A constraint is a rule the database enforces automatically on every insert/update, so bad data physically cannot get in — like refusing to save an order with a negative quantity, or refusing to save an employee row that references a department that doesn't exist.\n\nThink of a key as an ID card number — unique per person, used to look someone up unambiguously — and constraints as the rules a form enforces before accepting your submission (this field can't be blank, this age must be positive, this email must be unique). Together, keys and constraints are what stop a relational database from silently accumulating garbage or contradictory data over time.",
  detailedBreakdown:
    "A super key is any set of one or more columns that uniquely identifies a row — by this loose definition, the entire row (every column combined) is always trivially a super key. A candidate key is a minimal super key — remove any column from it and it stops being unique. A table can have multiple candidate keys (e.g., an Employee table might have both employeeId and email as separate candidate keys, since either alone uniquely identifies a row). The primary key is the one candidate key the designer chooses as the table's main identifier; a table has exactly one primary key, which cannot contain NULLs and is used by default for foreign key references and often for physical row storage (clustered index in many engines). Every candidate key that isn't chosen as the primary key is called an alternate key, and is typically still enforced with a UNIQUE constraint.\n\nA foreign key is a column (or set of columns) in one table that references the primary key (or a unique key) of another table, establishing a link between rows and enforcing referential integrity — the database will not allow a foreign key value to exist unless a matching row exists in the referenced table. Referential integrity is exactly this guarantee: you cannot insert an Order row with a customerId that doesn't exist in Customer, and by default you cannot delete a Customer row that still has Order rows referencing it (unless the foreign key is defined with an ON DELETE behavior — CASCADE deletes dependent rows too, SET NULL nulls out the reference, RESTRICT/NO ACTION blocks the delete). A composite key is any key — candidate, primary, or foreign — made up of more than one column, common in junction tables (e.g., Enrollment's primary key being the pair (studentId, courseId)).\n\nBeyond keys, SQL supports several column- and table-level constraints. NOT NULL forbids a column from holding NULL. UNIQUE forbids duplicate values in a column (or column combination) but, unlike a primary key, allows NULLs (and typically allows multiple NULLs, since NULL is not considered equal to another NULL). CHECK enforces an arbitrary boolean condition on a column's value, like CHECK (price > 0) or CHECK (age >= 18). DEFAULT supplies a value automatically when none is given on insert. A domain constraint restricts a column to a specific data type and range (e.g., a column typed SMALLINT UNSIGNED inherently can't hold a negative number or a string). Constraints can be checked at the column level (attached to one column's definition) or the table level (spanning multiple columns, e.g. CHECK (endDate > startDate) or a composite UNIQUE(col1, col2)), and are enforced immediately by the engine on every write — this is fundamentally different from application-level validation, which can be bypassed by a direct DB write, a bug, or a second application touching the same database.",
  realWorldExamples:
    "A Users table typically has id as the primary key (an internal surrogate key, often an auto-increment integer or UUID) plus a UNIQUE constraint on email (a natural candidate key you don't want to use as the primary key because emails can change and are bulkier to index/join on than an integer). An Orders table has a customerId foreign key referencing Users.id with ON DELETE RESTRICT in most production systems (you don't want to silently delete a customer's order history), while a session or cart table might use ON DELETE CASCADE since child rows are meaningless without the parent. Payment systems lean heavily on CHECK constraints — CHECK (amount > 0) — as a last line of defense against bugs in application code that might otherwise write corrupt financial data directly to the database.",
  useCases: [
    "Guaranteeing every row can be uniquely and efficiently addressed (via the primary key) for updates, deletes, and joins",
    "Enforcing that relationships between tables (like Order → Customer) always point to real, existing rows via foreign keys",
    "Pushing data-validity rules (non-negative prices, mandatory fields, valid ranges) down into the database itself so they can't be bypassed by any application bug or direct SQL access",
  ],
  advantages: [
    "Referential integrity via foreign keys prevents orphaned or inconsistent data across related tables automatically, without relying on application code to remember to check",
    "Constraints enforced at the database level are a single source of truth that protects data even if multiple applications or scripts write to the same database",
    "Well-chosen primary keys (especially small, immutable surrogate keys) make joins and index lookups fast",
  ],
  disadvantages: [
    "Heavy constraint checking (especially foreign keys and complex CHECK constraints) adds overhead to every write, which can matter at very high insert/update throughput",
    "Foreign key constraints can complicate bulk data loading, migrations, and sharding, since referenced rows must exist in the right order or constraints must be temporarily disabled",
    "Over-normalized composite keys (e.g., wide composite primary keys) can make every child table and index carry excess columns, bloating storage and joins compared to a compact surrogate key",
  ],
  commonMisconceptions: [
    "\"A table can have multiple primary keys\" — a table has exactly one primary key (which may itself be composite, spanning multiple columns), but only one.",
    "\"UNIQUE and PRIMARY KEY are functionally identical\" — a UNIQUE column allows NULLs (and often multiple NULLs), while a PRIMARY KEY column can never be NULL; a table can have many UNIQUE constraints but only one PRIMARY KEY.",
    "\"A foreign key must reference another table's primary key specifically\" — a foreign key can reference any column with a UNIQUE constraint (or the primary key) in the parent table, not only the primary key.",
    "\"Constraints are just documentation/hints\" — constraints are actively enforced by the engine on every write; a violating INSERT or UPDATE is rejected with an error, not silently allowed.",
  ],
  interviewPerspective:
    "This topic is a near-guaranteed early question, usually phrased as 'explain the different types of keys' or 'what's the difference between a primary key and a unique key' — interviewers are checking that you know these aren't synonyms and can explain *why* the distinctions matter (NULL handling, cardinality of constraints per table, indexing implications). Be ready to also explain foreign key ON DELETE behaviors with a concrete example, since that comes up constantly in schema-design follow-ups.",
  oaPerspective:
    "OA MCQs test crisp definitional recall: candidate vs primary vs super vs foreign key, NOT NULL vs UNIQUE behavior with NULLs, and what CASCADE/SET NULL/RESTRICT do on delete. Expect 'identify the minimal candidate key from this set of functional dependencies' style questions too, which overlaps heavily with the normalization topic.",
  keyTakeaways: [
    "Super key ⊇ candidate key ⊇ primary key: super keys can have redundant columns, candidate keys are minimal, and the primary key is the one candidate key chosen as the main identifier.",
    "A primary key can never be NULL and a table has exactly one; UNIQUE columns can hold NULLs and a table can have many.",
    "Foreign keys enforce referential integrity — no child row can reference a nonexistent parent row — with ON DELETE CASCADE/SET NULL/RESTRICT controlling what happens when the parent is deleted.",
    "CHECK, NOT NULL, UNIQUE, and DEFAULT constraints push data-validity rules into the database so they can't be bypassed by any application bug.",
  ],
  summaryClosing:
    "Keys establish identity and connect tables together; constraints keep every write honest. Together they're what turns a set of independent tables into a relational database whose data you can actually trust — every join relies on keys being correct, and every business rule you didn't explicitly re-check in application code relies on a constraint catching it instead.",
  relatedTopics: ["ER Model & Relational Model", "Normalization", "Transactions & ACID Properties"],
  furtherReading: [
    { label: "SQL-92/SQL:2016 standard — Integrity Constraints", note: "The formal specification behind PRIMARY KEY, FOREIGN KEY, CHECK, and UNIQUE semantics." },
    { label: "PostgreSQL docs: Constraints", note: "Clear, practical documentation of constraint types with working examples." },
  ],
};

export default keysConstraintsArticle;
