// src/content/cs-fundamentals/dbms/top-40.ts
// The 40 highest-frequency DBMS interview questions across product
// companies, startups, service companies, and FAANG-style loops.

import type { Top40Question } from "@/types";

const dbmsTop40: Top40Question[] = [
  {
    id: "dbms-top40-1",
    rank: 1,
    question: "What are the ACID properties of a transaction?",
    difficulty: "Easy",
    frequency: "Very High",
    shortAnswer:
      "Atomicity (all-or-nothing execution), Consistency (a transaction moves the database from one valid state to another), Isolation (concurrent transactions don't interfere with each other's intermediate state), Durability (once committed, changes survive crashes).",
    detailedAnswer:
      "Atomicity is enforced via rollback/undo logs; Consistency relies on constraints and correct application logic; Isolation is enforced via locking or MVCC depending on the isolation level chosen; Durability is enforced via write-ahead logging so committed changes can be recovered even after a crash.",
    deepExplanation:
      "Isolation is the property with the most nuance — 'fully isolated' (serializable) is expensive, so real systems offer weaker isolation levels as a performance trade-off, each permitting specific anomalies (dirty reads, non-repeatable reads, phantom reads) in exchange for speed.",
    realWorldRelevance:
      "Every production relational database (Postgres, MySQL, Oracle) is built around guaranteeing these four properties, and understanding them is prerequisite to reasoning about any concurrency or crash-recovery bug in a database-backed application.",
    keywords: ["Atomicity", "Consistency", "Isolation", "Durability"],
    commonMistakes: ["Not being able to name which mechanism enforces each property"],
    relatedTopics: ["Transactions & ACID Properties", "Concurrency Control & Locking", "Database Recovery & Logging"],
    followUpQuestions: ["What are the SQL isolation levels and what does each prevent?", "How does durability survive a crash?"],
    tags: ["Must Know"],
    companyStyleTags: ["Startup-style", "Amazon-style"],
  },
  {
    id: "dbms-top40-2",
    rank: 2,
    question: "What is normalization, and what problem does it solve?",
    difficulty: "Medium",
    frequency: "Very High",
    shortAnswer:
      "Normalization is the process of organizing tables to reduce data redundancy and avoid update/insert/delete anomalies, by progressively enforcing stricter rules (1NF, 2NF, 3NF, BCNF) based on functional dependencies between columns.",
    detailedAnswer:
      "1NF requires atomic (indivisible) column values with no repeating groups; 2NF additionally requires no partial dependency of non-key attributes on part of a composite key; 3NF additionally requires no transitive dependency (a non-key attribute depending on another non-key attribute rather than directly on the key).",
    deepExplanation:
      "BCNF is a stricter version of 3NF specifically handling edge cases with multiple overlapping candidate keys — most interview answers stop at 3NF, but knowing BCNF exists and why it's stricter is a strong signal.",
    realWorldRelevance:
      "Real schema design constantly trades normalization purity against query performance — heavily normalized schemas minimize redundancy but require more joins, which is exactly why controlled denormalization (and read replicas, caching) shows up in high-traffic production systems.",
    keywords: ["functional dependency", "1NF/2NF/3NF/BCNF", "update anomaly"],
    commonMistakes: ["Not knowing the specific rule each normal form adds"],
    relatedTopics: ["Normalization", "Keys & Constraints"],
    followUpQuestions: ["Identify the normal form of a given table with sample functional dependencies.", "When would you deliberately denormalize?"],
    tags: ["Must Know", "Frequently Asked"],
    companyStyleTags: ["Amazon-style", "Microsoft-style"],
  },
  {
    id: "dbms-top40-3",
    rank: 3,
    question: "What's the difference between a primary key, candidate key, super key, and foreign key?",
    difficulty: "Easy",
    frequency: "Very High",
    shortAnswer:
      "A super key is any set of columns that uniquely identifies a row; a candidate key is a minimal super key (no redundant columns); a primary key is the candidate key chosen to be the table's main identifier; a foreign key is a column referencing another table's primary key to enforce referential integrity.",
    detailedAnswer:
      "A table can have multiple candidate keys but only one is designated primary — the others are called alternate keys. Foreign keys don't identify rows in their own table; they establish relationships between tables.",
    deepExplanation:
      "The 'minimal' qualifier in candidate key's definition is the detail people often miss — a super key can have extra unnecessary columns, but a candidate key cannot, by definition.",
    realWorldRelevance:
      "Choosing the right primary key (natural vs surrogate/auto-increment) is a real, consequential schema design decision — surrogate keys are often preferred in production for stability even when a natural unique column exists.",
    keywords: ["super key", "candidate key", "primary key", "foreign key"],
    commonMistakes: ["Confusing candidate key with primary key", "Not knowing what makes a key 'minimal'"],
    relatedTopics: ["Keys & Constraints", "ER Model & Relational Model"],
    followUpQuestions: ["What is a surrogate key and why might you prefer one over a natural key?", "What is referential integrity?"],
    tags: ["Must Know"],
    companyStyleTags: ["Startup-style", "Amazon-style"],
  },
  {
    id: "dbms-top40-4",
    rank: 4,
    question: "Explain the different types of SQL joins with examples.",
    difficulty: "Medium",
    frequency: "Very High",
    shortAnswer:
      "INNER JOIN returns only matching rows from both tables; LEFT JOIN returns all rows from the left table plus matches from the right (NULL where no match); RIGHT JOIN is the mirror; FULL OUTER JOIN returns all rows from both, matched where possible; CROSS JOIN returns the Cartesian product.",
    detailedAnswer:
      "A LEFT JOIN is commonly used when you want every row from a 'primary' table regardless of whether a related row exists (e.g. all customers, even those with zero orders) — the right table's columns come back NULL for unmatched rows.",
    deepExplanation:
      "Self joins (joining a table to itself, often for hierarchical data like employee-manager relationships) and the distinction between using a JOIN vs a correlated subquery for the same logical result (often with different performance characteristics) are common, sharper follow-ups.",
    realWorldRelevance:
      "Almost every non-trivial production query involves at least one join — understanding exactly which rows survive each join type is directly necessary to avoid silently wrong query results (a very common real bug source).",
    keywords: ["INNER/LEFT/RIGHT/FULL JOIN", "self join", "Cartesian product"],
    commonMistakes: ["Confusing which side's unmatched rows are kept in LEFT vs RIGHT JOIN"],
    relatedTopics: ["SQL Joins & Queries"],
    followUpQuestions: ["What is a self join and when would you use one?", "How would you find customers with zero orders using a join?"],
    tags: ["Must Know", "Frequently Asked"],
    companyStyleTags: ["Amazon-style", "Startup-style"],
  },
  {
    id: "dbms-top40-5",
    rank: 5,
    question: "What are SQL isolation levels, and what anomalies does each one prevent?",
    difficulty: "Hard",
    frequency: "High",
    shortAnswer:
      "Read Uncommitted (allows dirty reads), Read Committed (prevents dirty reads), Repeatable Read (also prevents non-repeatable reads), Serializable (also prevents phantom reads) — each higher level trades concurrency/performance for stronger consistency guarantees.",
    detailedAnswer:
      "A dirty read sees another transaction's uncommitted changes; a non-repeatable read sees a row change value between two reads within the same transaction; a phantom read sees new rows appear that match a query's WHERE clause between two reads within the same transaction.",
    deepExplanation:
      "Most production databases default to Read Committed (Postgres, Oracle) or Repeatable Read (MySQL/InnoDB) rather than Serializable, precisely because full serializability's locking/validation overhead is usually not worth it for typical application workloads.",
    realWorldRelevance:
      "A subtle production bug — 'why did this report show inconsistent totals mid-transaction' — is very often traceable directly to the isolation level in use and which anomaly it permits.",
    keywords: ["dirty read", "non-repeatable read", "phantom read"],
    commonMistakes: ["Not knowing which anomaly each level specifically prevents"],
    relatedTopics: ["Transactions & ACID Properties", "Concurrency Control & Locking"],
    followUpQuestions: ["What is MVCC and how does it help achieve isolation without heavy locking?", "What's the default isolation level in MySQL vs Postgres?"],
    tags: ["Advanced"],
    companyStyleTags: ["Google-style", "Amazon-style"],
  },
  {
    id: "dbms-top40-6",
    rank: 6,
    question: "Why do databases use B+ Trees for indexing instead of B-Trees or binary search trees?",
    difficulty: "Hard",
    frequency: "High",
    shortAnswer:
      "B+ Trees store all actual data only at leaf nodes (internal nodes hold only keys for navigation) and link leaf nodes together, enabling both fast point lookups AND efficient sequential/range scans — B-Trees store data at internal nodes too (wasting navigation-node space and complicating range scans), and binary trees have far worse fan-out, meaning many more disk reads for the same amount of data.",
    detailedAnswer:
      "Disk I/O is the dominant cost in database indexing, so minimizing tree height (i.e. maximizing fan-out per node) matters far more than in an in-memory data structure — a B+Tree node is sized to match a disk page, letting each node hold hundreds of keys and keeping the tree extremely shallow (often 3-4 levels for millions of rows).",
    deepExplanation:
      "The linked-leaf-node property is what specifically makes B+Trees good for range queries (`WHERE age BETWEEN 20 AND 30`) — once you find the starting leaf, you just walk the leaf-level linked list, no need to re-traverse from the root.",
    realWorldRelevance:
      "This is precisely why adding the right index can turn a slow full-table-scan query into a near-instant one, and it's the default index structure in virtually every major relational database engine.",
    keywords: ["fan-out", "disk page alignment", "leaf-linked range scans"],
    commonMistakes: ["Not explaining WHY fan-out/disk-I/O matters, just naming the structure"],
    relatedTopics: ["Indexing (B-Tree, B+Tree, Hashing)"],
    followUpQuestions: ["What's the difference between a clustered and non-clustered index?", "When would a hash index be preferred over a B+Tree index?"],
    tags: ["Advanced"],
    companyStyleTags: ["Google-style", "Amazon-style"],
  },
  {
    id: "dbms-top40-7",
    rank: 7,
    question: "What's the difference between a clustered and a non-clustered index?",
    difficulty: "Medium",
    frequency: "High",
    shortAnswer:
      "A clustered index determines the actual physical storage order of table rows (so a table can have at most one); a non-clustered index is a separate structure holding indexed column values plus a pointer back to the actual row, and a table can have many.",
    detailedAnswer:
      "Because a clustered index dictates physical row order, reading a range of rows by that key is extremely fast (they're physically adjacent on disk); a non-clustered index lookup, by contrast, requires following a pointer back to the actual row location, which can mean extra I/O (unless the query is fully satisfied by the index itself — a 'covering index').",
    deepExplanation:
      "In many databases, if you don't explicitly define a clustered index, the primary key becomes the clustered index by default — which is exactly why primary key choice affects more than uniqueness; it affects physical storage layout and range-query performance too.",
    realWorldRelevance:
      "Choosing which column to cluster on is a real schema design decision — clustering on a monotonically increasing key (like an auto-increment ID or timestamp) avoids expensive page-splitting inserts that a randomly-ordered clustering key (like a UUID) would cause.",
    keywords: ["physical row order", "covering index", "page splits"],
    commonMistakes: ["Thinking a table can have multiple clustered indexes"],
    relatedTopics: ["Indexing (B-Tree, B+Tree, Hashing)"],
    followUpQuestions: ["Why might using a random UUID as a clustering key hurt insert performance?", "What is a covering index?"],
    tags: ["Frequently Asked"],
    companyStyleTags: ["Amazon-style", "Microsoft-style"],
  },
  {
    id: "dbms-top40-8",
    rank: 8,
    question: "What is the CAP theorem, and what does it actually say?",
    difficulty: "Hard",
    frequency: "High",
    shortAnswer:
      "During an actual network partition, a distributed system can only guarantee two of Consistency (every read sees the latest write), Availability (every request gets a non-error response), and Partition tolerance (the system keeps working despite network splits) — since partitions are unavoidable in practice, the real choice is between consistency and availability during a partition.",
    detailedAnswer:
      "This is commonly misstated as 'you must always pick 2 of 3' — the more precise statement is that partition tolerance is essentially mandatory for any real distributed system (networks WILL partition), so CAP really describes a forced choice between C and A specifically during the partition window, not a permanent architectural trade-off applying at all times.",
    deepExplanation:
      "Traditional single-node relational databases sidestep CAP entirely by not being distributed in the first place; distributed systems like Cassandra/DynamoDB typically lean AP (available, eventually consistent), while systems like traditional consensus-based stores (etcd, Zookeeper) or certain configurations of CockroachDB/Spanner lean CP.",
    realWorldRelevance:
      "This theorem directly explains why a system might return slightly stale data during a network issue rather than an error (an AP choice) or return an error/block rather than risk inconsistent data (a CP choice) — a real, visible trade-off in distributed production systems.",
    keywords: ["Consistency", "Availability", "Partition tolerance", "AP vs CP systems"],
    commonMistakes: ["Stating it as an always-active 'pick 2 of 3' rather than a partition-specific trade-off"],
    relatedTopics: ["NoSQL & the CAP Theorem"],
    followUpQuestions: ["Name a real system that's AP-leaning and one that's CP-leaning.", "How does eventual consistency relate to the AP choice?"],
    tags: ["Advanced"],
    companyStyleTags: ["Google-style", "Amazon-style", "Uber-style"],
  },
  {
    id: "dbms-top40-9",
    rank: 9,
    question: "What is a deadlock in a database, and how do database systems handle it?",
    difficulty: "Medium",
    frequency: "High",
    shortAnswer:
      "A database deadlock happens when two or more transactions each hold a lock the other needs, waiting on each other forever — databases handle this via automatic deadlock detection (building a wait-for graph, finding cycles) and resolve it by aborting one transaction (the 'victim') to break the cycle.",
    detailedAnswer:
      "Unlike OS-level deadlock prevention (which often relies on structural rules like lock ordering), most production databases favor detection-and-recovery, since transactions are usually short-lived and the overhead of always avoiding deadlock is often not worth it — the aborted transaction is typically automatically retried by the application.",
    deepExplanation:
      "Choosing which transaction to abort as the 'victim' typically considers factors like which has done less work (cheaper to roll back) or which has lower priority, and different databases have different specific victim-selection heuristics.",
    realWorldRelevance:
      "Application code that touches multiple tables/rows should be prepared to catch and retry a deadlock-abort error — this is a real, expected class of transient error in high-concurrency production systems, not a bug to eliminate entirely.",
    keywords: ["wait-for graph", "deadlock detection", "victim transaction"],
    commonMistakes: ["Assuming deadlocks are always the application's fault rather than an expected concurrency phenomenon"],
    relatedTopics: ["Concurrency Control & Locking"],
    followUpQuestions: ["How does the database choose which transaction to abort?", "How should application code handle a deadlock error?"],
    tags: ["Frequently Asked"],
    companyStyleTags: ["Amazon-style", "Microsoft-style"],
  },
  {
    id: "dbms-top40-10",
    rank: 10,
    question: "What is two-phase locking (2PL), and how does it guarantee serializability?",
    difficulty: "Hard",
    frequency: "Medium",
    shortAnswer:
      "2PL requires a transaction to acquire all the locks it will ever need before releasing any (growing phase), then only release locks afterward (shrinking phase) — never acquiring a new lock after releasing one. This strict ordering provably guarantees a serializable execution schedule.",
    detailedAnswer:
      "Basic 2PL can still allow cascading aborts (if a transaction reads data written by another that later aborts); Strict 2PL (holding all exclusive locks until commit/abort) avoids this and is what most real databases actually implement.",
    deepExplanation:
      "The 'growing then shrinking, never mixed' rule is the single detail interviewers check for — many candidates can describe locking generally but miss that the two phases can never interleave, which is exactly the property that makes the serializability guarantee provable.",
    realWorldRelevance:
      "Strict 2PL (or an MVCC-based alternative achieving similar guarantees) underlies the serializable isolation level offered by production relational databases.",
    keywords: ["growing phase", "shrinking phase", "strict 2PL", "cascading aborts"],
    commonMistakes: ["Not knowing the phases can never interleave (that's the actual serializability guarantee)"],
    relatedTopics: ["Concurrency Control & Locking", "Transactions & ACID Properties"],
    followUpQuestions: ["What is strict 2PL and how does it differ from basic 2PL?", "How does MVCC achieve isolation without this kind of locking?"],
    tags: ["Advanced"],
    companyStyleTags: ["Google-style"],
  },
  {
    id: "dbms-top40-11",
    rank: 11,
    question: "What is MVCC (Multi-Version Concurrency Control)?",
    difficulty: "Hard",
    frequency: "Medium",
    shortAnswer:
      "MVCC lets readers and writers avoid blocking each other by keeping multiple versions of a row — a reader sees a consistent snapshot of the data as of when its transaction/statement started, while writers create new versions rather than overwriting in place, and old versions are cleaned up later.",
    detailedAnswer:
      "This is why, under MVCC, a long-running read query doesn't block concurrent writes (and vice versa) the way naive locking would — readers simply never see uncommitted or 'too new' versions, sidestepping the need to lock rows just for reading.",
    deepExplanation:
      "MVCC does introduce its own overhead — old row versions need periodic cleanup (Postgres calls this VACUUM), and skipping this maintenance is a real, common cause of database bloat and degraded performance in production Postgres deployments specifically.",
    realWorldRelevance:
      "Postgres, MySQL/InnoDB, and Oracle all use MVCC-based concurrency internally, which is exactly why 'why doesn't my SELECT get blocked by an ongoing UPDATE' has a specific, non-magical technical answer.",
    keywords: ["row versioning", "snapshot isolation", "VACUUM"],
    commonMistakes: ["Thinking MVCC eliminates the need for any locking at all (writers still need some coordination)"],
    relatedTopics: ["Concurrency Control & Locking", "Transactions & ACID Properties"],
    followUpQuestions: ["Why does Postgres need VACUUM, and what happens if it's neglected?", "How does MVCC relate to the Repeatable Read isolation level?"],
    tags: ["Advanced"],
    companyStyleTags: ["Google-style", "Amazon-style"],
  },
  {
    id: "dbms-top40-12",
    rank: 12,
    question: "What is a write-ahead log (WAL), and why does it matter for durability?",
    difficulty: "Medium",
    frequency: "Medium",
    shortAnswer:
      "A WAL records every intended change to a durable log BEFORE applying it to the actual database files — if the system crashes mid-operation, the log lets the database replay (redo) committed changes that weren't yet fully applied, or undo uncommitted ones, guaranteeing durability and consistency after a crash.",
    detailedAnswer:
      "Writing sequentially to a log is also much faster than randomly writing to data files scattered across disk, so WAL is as much a performance optimization (batch/sequential writes, with the actual data pages flushed lazily) as it is a correctness mechanism.",
    deepExplanation:
      "ARIES (a well-known recovery algorithm used conceptually by many real databases) formalizes this with a specific analysis-redo-undo recovery process after a crash, using the log to determine exactly what state every in-flight transaction was in.",
    realWorldRelevance:
      "This exact mechanism is why a database can promise 'once your commit returns success, your data is safe' even if the server crashes one millisecond later — the change is already durably logged before the commit acknowledgment is sent.",
    keywords: ["write-ahead logging", "redo/undo", "sequential writes"],
    commonMistakes: ["Not explaining why writing to the log first (before data files) is what provides the guarantee"],
    relatedTopics: ["Database Recovery & Logging"],
    followUpQuestions: ["Walk through what happens during crash recovery using the WAL.", "Why are sequential log writes faster than random data-page writes?"],
    tags: ["Frequently Asked"],
    companyStyleTags: ["Amazon-style", "Google-style"],
  },
  {
    id: "dbms-top40-13",
    rank: 13,
    question: "What's the difference between SQL and NoSQL databases? When would you choose one over the other?",
    difficulty: "Medium",
    frequency: "Very High",
    shortAnswer:
      "SQL/relational databases enforce a fixed schema and strong ACID guarantees, excelling at complex relational queries and data integrity; NoSQL databases (document, key-value, column-family, graph) trade some of that rigidity/consistency for flexible schemas and easier horizontal scaling, fitting workloads with massive scale, evolving schemas, or specific access patterns.",
    detailedAnswer:
      "The decision usually comes down to: does the data have complex relationships requiring joins and strict consistency (favor SQL), or is it naturally hierarchical/document-shaped with a need for massive horizontal write scale and flexible schema evolution (favor NoSQL)? Many real systems use both — a relational database for core transactional data and a NoSQL store for specific high-scale or flexible-schema needs (polyglot persistence).",
    deepExplanation:
      "'NoSQL is always more scalable' is an oversimplification — modern relational databases also scale horizontally (read replicas, sharding, distributed SQL like CockroachDB/Spanner), so the real distinguishing factor is more about consistency/schema trade-offs than raw scalability alone.",
    realWorldRelevance:
      "A typical modern architecture might use Postgres for orders/payments (needing strong consistency) alongside Redis for caching/sessions and Elasticsearch for search — polyglot persistence based on each specific workload's needs, not a single database for everything.",
    keywords: ["schema flexibility", "ACID vs BASE", "polyglot persistence"],
    commonMistakes: ["Claiming NoSQL is unconditionally 'more scalable' without qualification"],
    relatedTopics: ["NoSQL & the CAP Theorem"],
    followUpQuestions: ["What is BASE (as a NoSQL counterpart to ACID)?", "Give a concrete example of a workload that fits NoSQL better than SQL."],
    tags: ["Must Know", "Frequently Asked"],
    companyStyleTags: ["Amazon-style", "Startup-style", "Uber-style"],
  },
  {
    id: "dbms-top40-14",
    rank: 14,
    question: "What is database sharding, and what are common sharding strategies?",
    difficulty: "Hard",
    frequency: "High",
    shortAnswer:
      "Sharding splits a large dataset across multiple database instances (shards), each holding a subset of the data, to scale writes and storage beyond what a single machine can handle — common strategies include range-based sharding (split by key ranges), hash-based sharding (hash the key to pick a shard), and directory-based sharding (a lookup table maps keys to shards).",
    detailedAnswer:
      "Hash-based sharding distributes load evenly but makes range queries across shards expensive (a range query may need to hit every shard); range-based sharding keeps range queries efficient within a shard but risks uneven load if certain ranges are hotter than others (a 'hot shard').",
    deepExplanation:
      "Resharding (changing the number of shards later) is one of the hardest operational problems in sharded systems — consistent hashing is a common technique specifically to minimize how much data needs to move when shards are added or removed.",
    realWorldRelevance:
      "Any system operating at a scale where a single database instance can't handle the write throughput or storage volume (large-scale social networks, e-commerce platforms) eventually needs sharding — it's a standard, if operationally complex, scaling technique.",
    keywords: ["range/hash/directory sharding", "hot shard", "resharding"],
    commonMistakes: ["Not discussing the cross-shard query cost trade-off of hash-based sharding"],
    relatedTopics: ["NoSQL & the CAP Theorem", "Query Optimization"],
    followUpQuestions: ["What is a 'hot shard' and how would you mitigate it?", "How does consistent hashing help with resharding?"],
    tags: ["Advanced"],
    companyStyleTags: ["Amazon-style", "Uber-style", "Google-style"],
  },
  {
    id: "dbms-top40-15",
    rank: 15,
    question: "What is database replication, and what's the difference between master-slave and multi-master replication?",
    difficulty: "Medium",
    frequency: "High",
    shortAnswer:
      "Replication maintains copies of data across multiple database instances for availability and read scaling. Master-slave (primary-replica) replication has one node accepting writes, propagated to read-only replicas; multi-master allows writes on multiple nodes, which improves write availability but introduces conflict-resolution complexity when the same data is written differently on different nodes simultaneously.",
    detailedAnswer:
      "Master-slave is simpler and avoids write conflicts by design (only one writable node), at the cost of that single master being both a write bottleneck and a single point of failure (mitigated via automatic failover promoting a replica). Multi-master avoids the single-writer bottleneck but needs a conflict resolution strategy (last-write-wins, vector clocks, application-level merge logic).",
    deepExplanation:
      "Replication lag (replicas being slightly behind the master) is a real, common gotcha — a user might write data then immediately read from a lagging replica and not see their own change, which is exactly why 'read your own writes' consistency is a specific guarantee some systems have to engineer for explicitly.",
    realWorldRelevance:
      "Read replicas are one of the most common, practical ways production systems scale read-heavy workloads without the complexity of full sharding, which is why master-slave replication is ubiquitous in real database deployments.",
    keywords: ["primary-replica", "replication lag", "failover", "conflict resolution"],
    commonMistakes: ["Not mentioning replication lag as a real consistency trade-off"],
    relatedTopics: ["NoSQL & the CAP Theorem", "Transactions & ACID Properties"],
    followUpQuestions: ["What is replication lag and how can it cause a visible bug?", "How does automatic failover work when a master fails?"],
    tags: ["Frequently Asked"],
    companyStyleTags: ["Amazon-style", "Uber-style"],
  },
  {
    id: "dbms-top40-16",
    rank: 16,
    question: "What is a database view, and what are its advantages and limitations?",
    difficulty: "Easy",
    frequency: "Medium",
    shortAnswer:
      "A view is a saved, named query that behaves like a virtual table — it doesn't store data itself (unless materialized), simplifying complex queries, restricting access to specific columns/rows, and providing a stable interface even if underlying tables change.",
    detailedAnswer:
      "A materialized view DOES store its result physically (refreshed periodically or on demand), trading storage and staleness for much faster read performance compared to recomputing a complex query every time — useful for expensive aggregate reports.",
    deepExplanation:
      "A common limitation: views built on complex joins/aggregations are often not directly updatable (INSERT/UPDATE through the view), which is a real practical constraint when designing an abstraction layer around tables.",
    realWorldRelevance:
      "Views are commonly used to expose a simplified or access-controlled interface to sensitive underlying tables — e.g., a view exposing only non-sensitive employee columns while the base table also has salary data restricted to specific roles.",
    keywords: ["virtual table", "materialized view", "updatable view"],
    commonMistakes: ["Confusing a regular view (always live, recomputed) with a materialized view (stored, can be stale)"],
    relatedTopics: ["SQL Joins & Queries", "Query Optimization"],
    followUpQuestions: ["What is a materialized view and when would you use one over a regular view?", "Why might a view not be directly updatable?"],
    tags: ["Frequently Asked"],
    companyStyleTags: ["Startup-style"],
  },
  {
    id: "dbms-top40-17",
    rank: 17,
    question: "What is a stored procedure, and what are its trade-offs compared to application-level logic?",
    difficulty: "Medium",
    frequency: "Medium",
    shortAnswer:
      "A stored procedure is precompiled SQL/procedural logic stored and executed inside the database itself — it can reduce network round-trips and centralize business logic at the data layer, but couples business logic to a specific database vendor and makes that logic harder to version-control, test, and scale independently of the database.",
    detailedAnswer:
      "Stored procedures shine for logic that's genuinely data-intensive and benefits from running close to the data (avoiding pulling large datasets over the network just to process them in the application) — but most modern architectures favor keeping business logic in the application layer for portability, testability, and independent scaling.",
    deepExplanation:
      "This is a real, recurring architectural debate — some high-performance systems still lean on stored procedures deliberately for latency-critical paths, while most general application development has moved away from them in favor of application-layer logic with ORMs/query builders.",
    realWorldRelevance:
      "Financial and legacy enterprise systems still commonly rely heavily on stored procedures, while modern microservice architectures generally minimize them in favor of keeping logic in versioned, testable application code.",
    keywords: ["precompiled logic", "network round-trips", "vendor lock-in"],
    commonMistakes: ["Presenting stored procedures as unconditionally good or bad rather than a real trade-off"],
    relatedTopics: ["SQL Joins & Queries"],
    followUpQuestions: ["When might a stored procedure genuinely be the right call?", "What's a trigger, and how does it differ from a stored procedure?"],
    tags: ["Advanced"],
    companyStyleTags: ["Microsoft-style"],
  },
  {
    id: "dbms-top40-18",
    rank: 18,
    question: "What is the N+1 query problem, and how do you fix it?",
    difficulty: "Medium",
    frequency: "High",
    shortAnswer:
      "The N+1 problem happens when code fetches a list of N parent records with one query, then executes N additional queries (one per parent) to fetch related child data — instead of one efficient query, you get N+1 round-trips. Fixed via eager loading (a JOIN or a single batched IN-query) instead of lazy per-row fetching.",
    detailedAnswer:
      "This is an extremely common ORM footgun — lazy-loading relationships (fetching related data only when accessed) is convenient in code but silently generates a query per accessed relationship inside a loop unless the developer explicitly asks the ORM to eager-load (e.g. Django's `select_related`/`prefetch_related`, or a JOIN FETCH in JPA).",
    deepExplanation:
      "Detecting N+1 issues usually requires actually looking at query logs/counts in a staging environment, since the symptom (many small fast queries) doesn't look obviously slow in isolation — it's the aggregate round-trip count and latency that kills performance at scale.",
    realWorldRelevance:
      "N+1 is one of the single most common real-world performance bugs in ORM-based applications, and 'have you seen/fixed an N+1 problem' is a very standard practical interview question for backend roles.",
    keywords: ["lazy loading", "eager loading", "ORM query count"],
    commonMistakes: ["Not knowing the concrete fix (eager loading / batched query) beyond just naming the problem"],
    relatedTopics: ["Query Optimization", "SQL Joins & Queries"],
    followUpQuestions: ["How would you detect an N+1 problem in a running application?", "What's the difference between select_related and prefetch_related (or their equivalents) in fixing it?"],
    tags: ["Frequently Asked"],
    companyStyleTags: ["Amazon-style", "Startup-style", "Uber-style"],
  },
  {
    id: "dbms-top40-19",
    rank: 19,
    question: "How would you diagnose and fix a slow SQL query in production?",
    difficulty: "Hard",
    frequency: "Very High",
    shortAnswer:
      "Start with EXPLAIN/EXPLAIN ANALYZE to see the actual query execution plan — look for full table scans where an index should apply, expensive joins/sorts, or bad cardinality estimates — then fix with an appropriate index, a rewritten query, or schema/statistics changes, verifying the fix by re-checking the plan and measured latency.",
    detailedAnswer:
      "Common root causes: a missing index on a filtered/joined column, an index that exists but isn't being used (due to a function wrapped around the column, implicit type conversion, or stale statistics), a query fetching far more data than needed (missing LIMIT, unnecessary SELECT *), or a join order the optimizer chose poorly due to outdated table statistics.",
    deepExplanation:
      "A senior-level answer distinguishes between fixing the SYMPTOM (add an index, cache the result) and understanding the actual ROOT CAUSE from the execution plan first — blindly adding indexes without checking the plan can even make write performance worse without fixing the read problem.",
    realWorldRelevance:
      "This is one of the most practically common real production debugging tasks for any backend engineer working with a relational database, and 'walk me through how you'd debug a slow query' is a near-universal interview question for this exact reason.",
    keywords: ["EXPLAIN ANALYZE", "execution plan", "missing/unused index"],
    commonMistakes: ["Jumping straight to 'add an index' without first looking at the actual execution plan"],
    relatedTopics: ["Query Optimization", "Indexing (B-Tree, B+Tree, Hashing)"],
    followUpQuestions: ["What would make an existing index NOT get used by the query planner?", "How do stale table statistics cause bad query plans?"],
    tags: ["Must Know", "Frequently Asked"],
    companyStyleTags: ["Amazon-style", "Google-style", "Uber-style"],
  },
  {
    id: "dbms-top40-20",
    rank: 20,
    question: "What's the difference between OLTP and OLAP systems?",
    difficulty: "Medium",
    frequency: "Medium",
    shortAnswer:
      "OLTP (Online Transaction Processing) systems handle many small, fast read/write transactions (e.g. placing an order) and are optimized for that via normalized schemas; OLAP (Online Analytical Processing) systems handle complex analytical queries over large historical datasets (e.g. quarterly sales trends) and are optimized for that via denormalized/star-schema designs and columnar storage.",
    detailedAnswer:
      "OLTP schemas are normalized to keep writes fast and consistent; OLAP schemas are often deliberately denormalized (star/snowflake schema with fact and dimension tables) since analytical queries scan and aggregate huge amounts of data, where join-heavy normalized designs would be slow.",
    deepExplanation:
      "This is exactly why production systems commonly ETL (extract-transform-load) data FROM an OLTP database INTO a separate OLAP data warehouse rather than running heavy analytical queries directly against the live transactional database, which could degrade production transaction performance.",
    realWorldRelevance:
      "Data warehouses (Snowflake, BigQuery, Redshift) are OLAP-optimized systems specifically built for this analytical workload, distinct from the OLTP database (Postgres, MySQL) powering the live application.",
    keywords: ["star schema", "columnar storage", "ETL"],
    commonMistakes: ["Not knowing why analytical queries are typically run against a separate warehouse rather than the live OLTP database"],
    relatedTopics: ["Normalization", "Query Optimization"],
    followUpQuestions: ["What is a star schema, and what are fact vs dimension tables?", "Why is columnar storage well-suited to OLAP workloads?"],
    tags: ["Frequently Asked"],
    companyStyleTags: ["Amazon-style", "Microsoft-style"],
  },
  {
    id: "dbms-top40-21",
    rank: 21,
    question: "What is denormalization, and when is it a reasonable choice?",
    difficulty: "Medium",
    frequency: "Medium",
    shortAnswer:
      "Denormalization deliberately introduces redundancy (duplicating data across tables, or precomputing derived values) to reduce the number of joins needed for read-heavy queries, trading some write complexity/consistency risk for read performance.",
    detailedAnswer:
      "It's reasonable when a specific read pattern is extremely frequent and performance-critical, and the redundant data either changes rarely or the application can tolerate/manage the extra complexity of keeping duplicated data in sync (e.g. via triggers, application logic, or accepted eventual consistency).",
    deepExplanation:
      "Denormalization should generally be a targeted, measured optimization applied to a specific known bottleneck — not a default starting design, since it reintroduces the update-anomaly risks normalization was specifically designed to eliminate.",
    realWorldRelevance:
      "Storing a denormalized 'total_comments' count directly on a post row (updated via trigger or application logic) instead of always running `COUNT(*)` on a comments table is a classic, common real-world denormalization example.",
    keywords: ["redundancy trade-off", "precomputed/derived values"],
    commonMistakes: ["Treating denormalization as inherently bad practice rather than a legitimate targeted optimization"],
    relatedTopics: ["Normalization", "Query Optimization"],
    followUpQuestions: ["Give a concrete example of a denormalization you'd apply and why.", "How would you keep denormalized data consistent?"],
    tags: ["Frequently Asked"],
    companyStyleTags: ["Uber-style", "Startup-style"],
  },
  {
    id: "dbms-top40-22",
    rank: 22,
    question: "What is a composite index, and how does column order within it matter?",
    difficulty: "Medium",
    frequency: "Medium",
    shortAnswer:
      "A composite (multi-column) index is built on more than one column together; column order matters because the index is only efficiently usable for queries that filter on a left-to-right PREFIX of those columns — a query filtering only on the second column of a 3-column composite index generally can't use it efficiently.",
    detailedAnswer:
      "This 'leftmost prefix' rule means an index on (A, B, C) efficiently serves queries filtering on A, on (A, B), or on (A, B, C), but NOT queries filtering only on B or only on C — that's why column order should match the most common/selective query patterns.",
    deepExplanation:
      "A common mistake is putting a low-selectivity column (like a boolean status flag) first in a composite index — since it barely narrows down the search, the index provides little benefit even though it's technically being used, which is a subtler mistake than not having an index at all.",
    realWorldRelevance:
      "Getting composite index column order wrong is a very common, real cause of 'I added an index but the query is still slow' bug reports — checking the actual query plan reveals whether the index prefix genuinely matches the query's filter pattern.",
    keywords: ["leftmost prefix rule", "column selectivity"],
    commonMistakes: ["Not knowing the leftmost-prefix rule and assuming any column order works equally well"],
    relatedTopics: ["Indexing (B-Tree, B+Tree, Hashing)", "Query Optimization"],
    followUpQuestions: ["Given a specific query pattern, how would you order the columns in a composite index?", "What is column selectivity and why does it matter for index design?"],
    tags: ["Advanced"],
    companyStyleTags: ["Amazon-style", "Google-style"],
  },
  {
    id: "dbms-top40-23",
    rank: 23,
    question: "What is a foreign key constraint, and what happens on delete/update by default vs with CASCADE?",
    difficulty: "Medium",
    frequency: "Medium",
    shortAnswer:
      "A foreign key constraint enforces that a column's value must match an existing value in a referenced table (or be NULL), maintaining referential integrity. By default, deleting/updating a referenced row that still has dependents is blocked (RESTRICT); ON DELETE/UPDATE CASCADE instead propagates the delete/update to dependent rows automatically.",
    detailedAnswer:
      "Other options besides CASCADE and RESTRICT include SET NULL (dependent rows' foreign key becomes NULL) and SET DEFAULT — the right choice depends entirely on the actual business meaning of the relationship (e.g. deleting a customer might reasonably cascade-delete their addresses, but should NOT cascade-delete their historical orders).",
    deepExplanation:
      "Using CASCADE carelessly is a real production risk — an accidental or malicious delete on a 'parent' row can silently wipe out large amounts of related data across many tables if cascades are chained without careful thought.",
    realWorldRelevance:
      "Schema migrations that add or change foreign key cascade behavior are a common source of subtle production incidents when the cascade semantics don't match what the team actually intended.",
    keywords: ["RESTRICT", "CASCADE", "SET NULL", "referential integrity"],
    commonMistakes: ["Not knowing CASCADE is opt-in, not the default behavior"],
    relatedTopics: ["Keys & Constraints", "ER Model & Relational Model"],
    followUpQuestions: ["When would SET NULL be more appropriate than CASCADE?", "What real-world incident could careless CASCADE usage cause?"],
    tags: ["Frequently Asked"],
    companyStyleTags: ["Amazon-style", "Startup-style"],
  },
  {
    id: "dbms-top40-24",
    rank: 24,
    question: "What is SQL injection, and how do you prevent it?",
    difficulty: "Medium",
    frequency: "High",
    shortAnswer:
      "SQL injection is an attack where untrusted input is concatenated directly into a SQL query string, letting an attacker inject their own SQL logic (e.g. bypassing a login check or exfiltrating data) — prevented by always using parameterized queries/prepared statements (or a properly-escaping ORM) instead of string concatenation.",
    detailedAnswer:
      "A parameterized query sends the query structure and the user-supplied values SEPARATELY to the database, so the database engine always treats the values as data, never as executable SQL syntax — this structurally eliminates the injection vector rather than relying on manually escaping every possible dangerous character.",
    deepExplanation:
      "Escaping/sanitizing input manually is a much weaker and more error-prone defense than parameterization, since it's easy to miss an edge case (encoding quirks, second-order injection through stored data later used unsafely elsewhere) — parameterized queries remove the entire class of bug structurally.",
    realWorldRelevance:
      "SQL injection has been one of the most common and damaging real-world web application vulnerabilities for decades (consistently on OWASP's top risks list), which is exactly why virtually every modern ORM and query library defaults to parameterized queries.",
    keywords: ["parameterized queries", "prepared statements", "OWASP"],
    commonMistakes: ["Suggesting manual string escaping as a primary defense instead of parameterization"],
    relatedTopics: ["SQL Joins & Queries"],
    followUpQuestions: ["Why is manual escaping weaker than parameterized queries?", "What is second-order SQL injection?"],
    tags: ["Frequently Asked"],
    companyStyleTags: ["Amazon-style", "Startup-style"],
  },
  {
    id: "dbms-top40-25",
    rank: 25,
    question: "What is a transaction's isolation level default, and how would you choose one for a specific use case?",
    difficulty: "Hard",
    frequency: "Medium",
    shortAnswer:
      "Defaults vary by database (Postgres/Oracle default to Read Committed; MySQL/InnoDB defaults to Repeatable Read); the right choice for a use case balances correctness needs (can this workflow tolerate a non-repeatable or phantom read?) against throughput (stricter isolation generally means more locking/contention and lower concurrency).",
    detailedAnswer:
      "A financial transfer between two accounts likely needs stronger guarantees (to avoid anomalies during concurrent transfers) than a simple product-catalog read, which can comfortably tolerate a lower isolation level for better throughput — the decision should be workload-specific, not a single blanket setting for the whole application.",
    deepExplanation:
      "It's also common to set the isolation level per-transaction rather than globally, so a genuinely correctness-critical operation (like a balance transfer) can opt into Serializable while the rest of the application stays at the database's faster default.",
    realWorldRelevance:
      "Payment and financial systems specifically are where isolation-level choice gets real production scrutiny, since a subtle isolation-related race condition there has direct monetary consequences.",
    keywords: ["Read Committed default", "Repeatable Read default", "per-transaction isolation"],
    commonMistakes: ["Assuming all databases share the same default isolation level"],
    relatedTopics: ["Transactions & ACID Properties", "Concurrency Control & Locking"],
    followUpQuestions: ["Give an example workload that specifically needs Serializable isolation.", "What's the performance cost of Serializable isolation?"],
    tags: ["Advanced"],
    companyStyleTags: ["Amazon-style", "Google-style"],
  },
  {
    id: "dbms-top40-26",
    rank: 26,
    question: "What is a functional dependency, and how does it relate to normalization?",
    difficulty: "Medium",
    frequency: "Medium",
    shortAnswer:
      "A functional dependency A → B means that knowing the value of A uniquely determines the value of B within a table — normalization rules (2NF, 3NF, BCNF) are all defined precisely in terms of eliminating 'bad' functional dependencies (partial and transitive dependencies) on non-key attributes.",
    detailedAnswer:
      "For example, in a table (StudentID, StudentName, CourseID, CourseName), StudentID → StudentName and CourseID → CourseName are functional dependencies — CourseName doesn't depend on the full key (StudentID, CourseID), just part of it (CourseID), which is exactly the 'partial dependency' 2NF eliminates.",
    deepExplanation:
      "Identifying functional dependencies correctly is the actual skill being tested when asked to normalize a given table — the normal form definitions themselves are just mechanical rules applied once the dependencies are correctly identified.",
    realWorldRelevance:
      "Real schema design (even informally) is fundamentally about reasoning through these dependencies to decide which columns belong in which table, even when a designer doesn't consciously name it 'functional dependency analysis.'",
    keywords: ["A → B notation", "partial dependency", "transitive dependency"],
    commonMistakes: ["Not being able to identify functional dependencies in a concrete example table"],
    relatedTopics: ["Normalization"],
    followUpQuestions: ["Given a sample table, identify its functional dependencies and normalize it to 3NF.", "What's the difference between a partial and a transitive dependency?"],
    tags: ["Advanced"],
    companyStyleTags: ["Amazon-style", "Microsoft-style"],
  },
  {
    id: "dbms-top40-27",
    rank: 27,
    question: "What's the difference between DELETE, TRUNCATE, and DROP?",
    difficulty: "Easy",
    frequency: "High",
    shortAnswer:
      "DELETE removes rows one at a time (can be filtered with WHERE, is logged/transactional, fires triggers, can be rolled back); TRUNCATE removes all rows at once by deallocating pages (faster, minimally logged, generally can't be selectively filtered, often can't be easily rolled back); DROP removes the entire table structure itself, not just its data.",
    detailedAnswer:
      "TRUNCATE typically resets auto-increment counters and is much faster than DELETE for clearing an entire large table specifically because it doesn't log each individual row removal the way DELETE does.",
    deepExplanation:
      "Whether TRUNCATE can be rolled back within a transaction actually varies by database engine — this is a good 'it depends, and here's why I'd check documentation/test before relying on it in production' answer rather than a flat yes/no.",
    realWorldRelevance:
      "Confusing TRUNCATE for DELETE (or vice versa) in a production script is a classic, genuinely damaging mistake — TRUNCATE's speed comes specifically from skipping the safety/logging DELETE provides.",
    keywords: ["row-level vs page-level removal", "logging/rollback behavior"],
    commonMistakes: ["Not knowing TRUNCATE typically can't be selectively filtered with WHERE"],
    relatedTopics: ["SQL Joins & Queries", "Keys & Constraints"],
    followUpQuestions: ["Which of these three resets an auto-increment counter?", "Why is TRUNCATE faster than DELETE for clearing a whole table?"],
    tags: ["Must Know"],
    companyStyleTags: ["Startup-style", "Amazon-style"],
  },
  {
    id: "dbms-top40-28",
    rank: 28,
    question: "What is a trigger, and what's a legitimate use case for one?",
    difficulty: "Medium",
    frequency: "Medium",
    shortAnswer:
      "A trigger is a piece of logic that automatically executes in response to a specific table event (INSERT/UPDATE/DELETE) — legitimate uses include maintaining denormalized derived values (like a running total), enforcing complex validation not expressible via simple constraints, or auditing/logging changes.",
    detailedAnswer:
      "Triggers can also become a maintenance/debugging liability if overused, since they introduce 'invisible' logic that isn't obvious from application code — an UPDATE statement that looks simple in the application can silently trigger a cascade of additional side effects that are hard to trace.",
    deepExplanation:
      "A frequently-cited real-world downside: triggers make it easy to accidentally create subtle performance problems or even infinite update loops (a trigger on table A updating table B, which has its own trigger updating table A again) if not designed carefully.",
    realWorldRelevance:
      "Audit logging (automatically recording who changed what and when) is one of the most common, genuinely justified real production uses of triggers, precisely because it needs to happen reliably regardless of which application code path performed the change.",
    keywords: ["INSERT/UPDATE/DELETE triggers", "audit logging", "invisible side effects"],
    commonMistakes: ["Presenting triggers as an unconditionally good tool without acknowledging the maintainability trade-off"],
    relatedTopics: ["SQL Joins & Queries", "Concurrency Control & Locking"],
    followUpQuestions: ["What's a real downside of overusing triggers?", "How does a trigger differ from a stored procedure?"],
    tags: ["Advanced"],
    companyStyleTags: ["Microsoft-style"],
  },
  {
    id: "dbms-top40-29",
    rank: 29,
    question: "How would you design a normalized database schema for a simple e-commerce system (users, products, orders)?",
    difficulty: "Hard",
    frequency: "High",
    shortAnswer:
      "Separate tables for Users, Products, Orders, and an OrderItems junction table (resolving the many-to-many relationship between orders and products, storing quantity and price-at-time-of-order), each with appropriate primary/foreign keys — Orders references Users; OrderItems references both Orders and Products.",
    detailedAnswer:
      "A key design decision: OrderItems should store the product's price AT THE TIME OF THE ORDER (not just reference the live Products table), since product prices change over time and historical orders must reflect what was actually charged — a classic real-world normalization vs. business-correctness trade-off.",
    deepExplanation:
      "This question is really testing whether a candidate recognizes the many-to-many relationship (orders can contain many products, products can appear in many orders) requires a junction table, and whether they think about temporal/historical correctness, not just mechanical normalization rules.",
    realWorldRelevance:
      "This exact schema shape (or a close variant) underlies essentially every real e-commerce platform's order data model — it's a genuinely representative, not just academic, design exercise.",
    keywords: ["junction table", "many-to-many relationship", "price-at-time-of-order"],
    commonMistakes: ["Storing only a live product price reference instead of snapshotting the price paid at order time", "Missing the need for a junction/associative table"],
    relatedTopics: ["ER Model & Relational Model", "Normalization", "Keys & Constraints"],
    followUpQuestions: ["How would you handle a product being deleted after it's been ordered?", "How would you extend this schema to support order status history?"],
    tags: ["Advanced"],
    companyStyleTags: ["Amazon-style", "Startup-style"],
  },
  {
    id: "dbms-top40-30",
    rank: 30,
    question: "What is connection pooling, and why does it matter for database performance?",
    difficulty: "Medium",
    frequency: "Medium",
    shortAnswer:
      "Connection pooling maintains a reusable set of open database connections rather than opening/closing a new connection for every request, since establishing a new database connection (TCP handshake, authentication, session setup) is relatively expensive — reusing pooled connections avoids paying that cost repeatedly.",
    detailedAnswer:
      "Without pooling, a high-traffic application opening a fresh connection per request can both add significant per-request latency and exhaust the database's maximum connection limit, since each open connection also consumes real memory/resources on the database server itself.",
    deepExplanation:
      "Pool sizing itself is a real tuning question — too small a pool causes requests to queue waiting for a free connection under load; too large a pool can overwhelm the database server with more concurrent work than it can efficiently handle, sometimes making throughput WORSE, not better.",
    realWorldRelevance:
      "Every serious production web application uses connection pooling (via the application framework, an ORM, or a dedicated pooler like PgBouncer for Postgres) — it's a foundational, not optional, piece of database-backed application infrastructure at any real scale.",
    keywords: ["connection reuse", "pool sizing", "PgBouncer"],
    commonMistakes: ["Not knowing that an oversized pool can hurt rather than help performance"],
    relatedTopics: ["Query Optimization", "Concurrency Control & Locking"],
    followUpQuestions: ["How would you decide on an appropriate connection pool size?", "What is PgBouncer and what specific problem does it solve?"],
    tags: ["Frequently Asked"],
    companyStyleTags: ["Amazon-style", "Uber-style"],
  },
  {
    id: "dbms-top40-31",
    rank: 31,
    question: "What is the difference between a subquery and a JOIN, and when might you prefer one over the other?",
    difficulty: "Medium",
    frequency: "Medium",
    shortAnswer:
      "A JOIN combines rows from multiple tables directly into one result set; a subquery is a nested query used to filter or compute a value used by an outer query — they can often express the same logical result, but query planners sometimes optimize them differently, so the better-performing choice can depend on the specific database and data distribution.",
    detailedAnswer:
      "Correlated subqueries (referencing the outer query's row in the inner query) can be particularly slow if the planner evaluates them naively once per outer row, though modern query optimizers often rewrite correlated subqueries into equivalent joins automatically — meaning the 'always prefer JOIN over subquery' advice is not universally true anymore, and should be verified via the actual execution plan.",
    deepExplanation:
      "The honest, senior-level answer is 'it depends, and I'd check the execution plan for the specific case' rather than a flat rule — this is exactly the kind of nuance that distinguishes real experience from memorized advice.",
    realWorldRelevance:
      "Rewriting a slow correlated subquery as an equivalent JOIN (or vice versa) is a common, genuine query-tuning technique, but should always be validated with the actual query plan and measured performance rather than applied as a blanket rule.",
    keywords: ["correlated subquery", "query rewriting", "execution plan verification"],
    commonMistakes: ["Stating a flat 'JOINs are always faster than subqueries' rule without qualification"],
    relatedTopics: ["SQL Joins & Queries", "Query Optimization"],
    followUpQuestions: ["What is a correlated subquery specifically?", "How would you verify which approach performs better for a specific query?"],
    tags: ["Advanced"],
    companyStyleTags: ["Google-style", "Amazon-style"],
  },
  {
    id: "dbms-top40-32",
    rank: 32,
    question: "What is database partitioning, and how does it differ from sharding?",
    difficulty: "Hard",
    frequency: "Medium",
    shortAnswer:
      "Partitioning splits a large table into smaller physical pieces WITHIN a single database instance (e.g. by date range) to improve manageability and query performance for partition-aligned queries; sharding splits data ACROSS multiple separate database instances/servers, primarily for horizontal scaling beyond what one machine can handle.",
    detailedAnswer:
      "A common partitioning example: partitioning a large events/logs table by month lets queries filtered to a specific month scan only that partition (partition pruning), and lets old partitions be dropped/archived cheaply instead of running an expensive DELETE over millions of rows.",
    deepExplanation:
      "Partitioning and sharding are complementary, not mutually exclusive — a large-scale system might shard data across multiple database servers AND partition the data within each individual shard, addressing scale and manageability at two different levels simultaneously.",
    realWorldRelevance:
      "Time-series and log-heavy production tables (application logs, metrics, events) are commonly partitioned by time specifically to keep both query performance and data lifecycle management (archival/deletion) efficient at scale.",
    keywords: ["partition pruning", "single-instance vs multi-instance", "time-based partitioning"],
    commonMistakes: ["Treating partitioning and sharding as the same concept"],
    relatedTopics: ["NoSQL & the CAP Theorem", "Query Optimization"],
    followUpQuestions: ["What is partition pruning and how does it help query performance?", "Can a system use both partitioning and sharding together?"],
    tags: ["Advanced"],
    companyStyleTags: ["Amazon-style", "Google-style"],
  },
  {
    id: "dbms-top40-33",
    rank: 33,
    question: "What's the difference between GROUP BY and HAVING vs WHERE?",
    difficulty: "Easy",
    frequency: "High",
    shortAnswer:
      "WHERE filters individual rows BEFORE grouping/aggregation happens; GROUP BY collapses rows into groups based on shared column values; HAVING filters those already-aggregated GROUPS, and can reference aggregate functions (like COUNT or SUM) that WHERE cannot.",
    detailedAnswer:
      "A common real mistake is trying to filter on an aggregate value using WHERE (e.g. `WHERE COUNT(*) > 5`), which is invalid SQL — that filtering must happen in HAVING specifically because WHERE executes before aggregation exists to filter on.",
    deepExplanation:
      "Understanding SQL's logical execution order (roughly: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY) is what makes this distinction click — HAVING simply operates at a later logical stage where aggregates already exist.",
    realWorldRelevance:
      "This distinction shows up constantly in real reporting/analytics queries (e.g. 'find customers with more than 5 orders'), making it one of the most frequently tested basic SQL concepts in practice.",
    keywords: ["row filtering vs group filtering", "SQL logical execution order"],
    commonMistakes: ["Trying to use an aggregate function inside WHERE instead of HAVING"],
    relatedTopics: ["SQL Joins & Queries"],
    followUpQuestions: ["What is SQL's logical order of execution (FROM, WHERE, GROUP BY, etc.)?", "Write a query to find customers with more than 5 orders."],
    tags: ["Must Know"],
    companyStyleTags: ["Startup-style", "Amazon-style"],
  },
  {
    id: "dbms-top40-34",
    rank: 34,
    question: "What is an ORM, and what are its trade-offs?",
    difficulty: "Medium",
    frequency: "Medium",
    shortAnswer:
      "An Object-Relational Mapper (ORM) lets developers interact with a database using the programming language's objects/classes instead of writing raw SQL — it speeds up development and adds a layer of database portability, but can generate inefficient queries (like N+1 problems) if used carelessly, and can obscure what's actually happening at the SQL level.",
    detailedAnswer:
      "Most production teams using an ORM still need to understand the SQL it generates (via query logs or EXPLAIN) to diagnose performance issues — an ORM is a productivity tool, not a replacement for actually understanding the underlying database behavior.",
    deepExplanation:
      "A nuanced answer acknowledges that many real production systems mix both — using the ORM for routine CRUD operations while dropping to raw SQL (or a query builder) for genuinely complex or performance-critical queries where the ORM's generated SQL isn't good enough.",
    realWorldRelevance:
      "The N+1 query problem is specifically the most common real-world ORM footgun, which is exactly why understanding both the ORM's convenience AND its generated SQL is a practical, expected backend engineering skill.",
    keywords: ["object-relational mapping", "generated SQL", "N+1 footgun"],
    commonMistakes: ["Treating an ORM as a black box that never needs the underlying SQL to be understood"],
    relatedTopics: ["SQL Joins & Queries", "Query Optimization"],
    followUpQuestions: ["How would you inspect the actual SQL an ORM generates for a given operation?", "When would you bypass the ORM and write raw SQL?"],
    tags: ["Frequently Asked"],
    companyStyleTags: ["Startup-style", "Amazon-style"],
  },
  {
    id: "dbms-top40-35",
    rank: 35,
    question: "What is eventual consistency, and where is it an acceptable trade-off?",
    difficulty: "Medium",
    frequency: "Medium",
    shortAnswer:
      "Eventual consistency means that after an update, all replicas/nodes WILL converge to the same value eventually, but a read immediately after a write isn't guaranteed to see it right away — it's an acceptable trade-off when brief staleness doesn't cause real harm (e.g. a 'like count' being off by a few for a moment) in exchange for higher availability/performance.",
    detailedAnswer:
      "It's a poor fit for use cases where staleness has real consequences (e.g. an account balance check before allowing a withdrawal), which is exactly why systems often use eventual consistency for some data (social feed counts, view counts) while using strongly consistent operations for others (payments) within the same overall application.",
    deepExplanation:
      "This connects directly to the CAP theorem — choosing eventual consistency is essentially choosing the 'A' (availability) side of the C-vs-A trade-off during a partition, accepting temporary inconsistency as the cost of staying available.",
    realWorldRelevance:
      "DNS itself is a classic, everyday example of an eventually-consistent system (propagation delay after a DNS record change) that most people interact with without realizing it.",
    keywords: ["convergence", "read-after-write", "staleness tolerance"],
    commonMistakes: ["Applying eventual consistency to data where staleness has real business/safety consequences"],
    relatedTopics: ["NoSQL & the CAP Theorem", "Transactions & ACID Properties"],
    followUpQuestions: ["Give an example of data where eventual consistency is fine, and one where it isn't.", "How does this relate to the CAP theorem's availability choice?"],
    tags: ["Advanced"],
    companyStyleTags: ["Amazon-style", "Uber-style"],
  },
  {
    id: "dbms-top40-36",
    rank: 36,
    question: "What is a covering index, and why can it make a query much faster?",
    difficulty: "Hard",
    frequency: "Medium",
    shortAnswer:
      "A covering index contains ALL the columns a query needs (both filter and selected columns), letting the database satisfy the entire query directly from the index itself without ever touching the underlying table rows — eliminating the extra lookup step a normal non-clustered index would otherwise require.",
    detailedAnswer:
      "Normally, a non-clustered index lookup finds a matching entry, then follows a pointer back to the full row to fetch any additional needed columns (an extra I/O step); a covering index avoids this entirely since every needed column is already present in the index structure itself.",
    deepExplanation:
      "This is why `SELECT *` is often specifically bad for performance beyond just fetching unnecessary data — it also defeats covering-index optimization, since an index almost never contains every column of a table, forcing the extra row lookup that a narrower, well-chosen SELECT list might have avoided entirely.",
    realWorldRelevance:
      "Designing covering indexes for known hot query patterns is a real, advanced performance optimization technique used when profiling reveals a specific frequent query is still slow despite having a 'normal' index.",
    keywords: ["index-only scan", "avoiding row lookup", "SELECT * downside"],
    commonMistakes: ["Not connecting SELECT * to defeating covering-index optimization"],
    relatedTopics: ["Indexing (B-Tree, B+Tree, Hashing)", "Query Optimization"],
    followUpQuestions: ["Why might SELECT * prevent a covering index from being effective?", "How would you identify a good candidate query for a covering index?"],
    tags: ["Advanced"],
    companyStyleTags: ["Google-style", "Amazon-style"],
  },
  {
    id: "dbms-top40-37",
    rank: 37,
    question: "What is the difference between horizontal and vertical scaling for a database?",
    difficulty: "Easy",
    frequency: "Medium",
    shortAnswer:
      "Vertical scaling adds more resources (CPU, RAM, faster disk) to a single existing database server; horizontal scaling adds more database servers (via replication, sharding) to spread load across multiple machines.",
    detailedAnswer:
      "Vertical scaling is simpler (no application/architecture changes needed) but has a hard ceiling (there's a biggest machine you can buy) and a single point of failure; horizontal scaling has much higher theoretical ceiling and better fault tolerance, but requires real architectural complexity (sharding logic, replication, distributed consistency handling).",
    deepExplanation:
      "Most real systems scale vertically first (it's cheap and simple) and only invest in horizontal scaling once they've genuinely outgrown what a single well-provisioned machine can handle — jumping straight to complex horizontal architecture prematurely is a common, avoidable engineering mistake.",
    realWorldRelevance:
      "Cloud database offerings make vertical scaling (resizing an instance) trivially easy today, which is exactly why many teams delay horizontal scaling investments until they hit a genuine, measured ceiling rather than guessing they'll need it.",
    keywords: ["scale up vs scale out", "single point of failure"],
    commonMistakes: ["Assuming horizontal scaling is always the 'better' choice regardless of actual scale needs"],
    relatedTopics: ["NoSQL & the CAP Theorem"],
    followUpQuestions: ["What's a concrete sign that a team should move from vertical to horizontal scaling?", "What complexity does horizontal scaling introduce that vertical scaling avoids?"],
    tags: ["Frequently Asked"],
    companyStyleTags: ["Startup-style", "Amazon-style"],
  },
  {
    id: "dbms-top40-38",
    rank: 38,
    question: "What is the difference between a data warehouse and a regular operational database?",
    difficulty: "Medium",
    frequency: "Medium",
    shortAnswer:
      "An operational (OLTP) database stores current, live application state optimized for many fast small transactions; a data warehouse stores historical, often denormalized/aggregated data from multiple sources, optimized for large analytical queries and reporting rather than transactional workloads.",
    detailedAnswer:
      "Data typically flows FROM operational databases INTO a data warehouse via an ETL (or increasingly ELT) pipeline, which extracts, transforms/cleans, and loads it into the warehouse's analytics-optimized schema (often a star schema) on a scheduled or streaming basis.",
    deepExplanation:
      "This separation exists specifically so that heavy analytical queries (scanning years of historical data for a report) never compete for resources with — or risk slowing down — the live application's transactional workload.",
    realWorldRelevance:
      "Modern cloud data warehouses (Snowflake, BigQuery, Redshift) are purpose-built, columnar-storage systems specifically for this analytical use case, distinct in both design and typical usage pattern from the operational database backing the live product.",
    keywords: ["ETL/ELT", "star schema", "columnar analytics storage"],
    commonMistakes: ["Not knowing why analytical workloads are typically separated from the operational database"],
    relatedTopics: ["Normalization", "Query Optimization"],
    followUpQuestions: ["What's the difference between ETL and ELT?", "Why is columnar storage well-suited to a data warehouse?"],
    tags: ["Frequently Asked"],
    companyStyleTags: ["Amazon-style", "Microsoft-style"],
  },
  {
    id: "dbms-top40-39",
    rank: 39,
    question: "You're designing a database schema for a new service. Walk through your general approach.",
    difficulty: "Hard",
    frequency: "High",
    shortAnswer:
      "Start by identifying the core entities and their relationships (an ER-style exercise), design a normalized schema (typically to 3NF) to avoid redundancy/anomalies, choose appropriate keys and constraints, then deliberately consider the actual read/write access patterns the application will use before adding indexes or any targeted denormalization.",
    detailedAnswer:
      "A strong answer explicitly separates 'get the logical model correct first' (entities, relationships, normalization) from 'now optimize for actual usage patterns' (indexes, possible denormalization, partitioning) rather than trying to optimize prematurely before understanding the real query patterns.",
    deepExplanation:
      "Interviewers are often specifically listening for whether a candidate asks clarifying questions about expected scale, read/write ratio, and consistency requirements BEFORE committing to specific design choices — jumping straight to a final schema without that context is a common weaker-answer pattern.",
    realWorldRelevance:
      "This exact process — model correctly first, then optimize based on measured or anticipated real access patterns — is how experienced engineers approach schema design in actual production systems, rather than guessing at optimizations upfront.",
    keywords: ["entity-relationship analysis", "normalize first, optimize second", "access-pattern-driven indexing"],
    commonMistakes: [
      "Jumping directly to indexes/denormalization before establishing a correct normalized logical model",
      "Not asking about expected scale or access patterns before designing",
    ],
    relatedTopics: ["ER Model & Relational Model", "Normalization", "Indexing (B-Tree, B+Tree, Hashing)"],
    followUpQuestions: [
      "How would your approach change if you knew this table would have billions of rows?",
      "What clarifying questions would you ask before starting the design?",
    ],
    tags: ["Advanced"],
    companyStyleTags: ["Amazon-style", "Google-style", "Startup-style"],
  },
  {
    id: "dbms-top40-40",
    rank: 40,
    question: "A production query that used to run in milliseconds now takes several seconds after the table grew to tens of millions of rows. How would you investigate?",
    difficulty: "Hard",
    frequency: "High",
    shortAnswer:
      "Run EXPLAIN ANALYZE to see the current execution plan and compare it against what you'd expect — check whether an existing index is still being used (statistics may be stale, or the planner's cost estimate flipped to preferring a sequential scan at this larger size), check for a genuinely missing index on the growth-affected query pattern, and check whether the query itself scales linearly with table size in an unexpected way (e.g. a subquery re-scanning the full table per outer row).",
    detailedAnswer:
      "A very common real cause: the query was always doing a full table scan, but it was fast enough to be invisible when the table was small — as the table grew, the same O(n) scan became genuinely slow, meaning the fix isn't 'something broke' but 'this was always missing an index and finally became visible at scale.'",
    deepExplanation:
      "Stale table statistics are a specific, often-overlooked cause worth naming directly — the query planner's row-count/cardinality estimates can become inaccurate after significant data growth if the database's automatic statistics update hasn't run recently, leading it to choose a previously-good-but-now-wrong execution plan.",
    realWorldRelevance:
      "'It was fast until the table got big' is one of the most common real production database performance incidents, and walking through EXPLAIN ANALYZE methodically (rather than guessing) is exactly the debugging process a strong engineer would actually follow.",
    keywords: ["EXPLAIN ANALYZE", "stale statistics", "scan vs index at scale"],
    commonMistakes: [
      "Assuming something 'broke' rather than considering the query may have always scaled poorly, just invisibly at small size",
      "Not checking table statistics freshness as a possible cause",
    ],
    relatedTopics: ["Query Optimization", "Indexing (B-Tree, B+Tree, Hashing)"],
    followUpQuestions: [
      "How would you confirm whether stale statistics are the actual cause?",
      "What would you do if adding the obvious index doesn't fully fix it?",
    ],
    tags: ["Advanced"],
    companyStyleTags: ["Amazon-style", "Google-style", "Uber-style"],
  },
];

export default dbmsTop40;
