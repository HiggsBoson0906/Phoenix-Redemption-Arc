// src/content/cs-fundamentals/dbms/articles/indexing.ts

import type { Article } from "@/types";

const indexingArticle: Article = {
  slug: "indexing",
  title: "Indexing (B-Tree, B+Tree, Hashing)",
  summary:
    "An index is a separate, ordered data structure that lets the database find rows without scanning the whole table — the difference between a lookup that touches thousands of rows and one that touches a handful.",
  readingTimeMins: 10,
  beginnerExplanation:
    "A database index works like the index at the back of a textbook: instead of reading every page to find every mention of 'transactions,' you flip to the index, find the term, and jump straight to the right pages. Without an index, the database has to do a full table scan — read every single row and check if it matches your WHERE clause. With an index on the right column, it can jump almost directly to the matching rows.\n\nThe trade-off is that an index is extra structure the database must maintain: every INSERT, UPDATE, or DELETE on an indexed column also has to update the index, so indexes speed up reads but slow down writes and consume additional disk space.",
  detailedBreakdown:
    "The default index structure in almost every relational database is the B+Tree, and understanding why requires understanding what makes disk-based storage different from in-memory structures. A binary search tree is great in memory, but on disk, every node access can mean a random disk seek, and a tall, skinny tree means many seeks per lookup. B-Trees and B+Trees solve this by being very 'wide and shallow' — each node holds many keys (often hundreds, sized to match a disk page, typically 4-16KB), so a tree holding millions of rows might only be 3-4 levels deep, meaning a lookup costs only 3-4 disk reads.\n\nA classic B-Tree stores actual data (or row pointers) at every node, internal nodes included — so a search can terminate early if it finds the key partway down. A B+Tree, the variant actually used by essentially every production database (MySQL InnoDB, PostgreSQL, SQL Server, Oracle), makes two key changes: (1) all actual data/row-pointers live only at the leaf level — internal nodes store only keys used for routing/navigation, and (2) the leaf nodes are linked together in a sorted doubly-linked list. These two properties are exactly why B+Trees win for disk-based databases: because internal nodes carry no data payload, they're smaller, so more keys fit per page, which means higher fan-out and a shallower tree for the same number of rows (fewer disk reads per lookup). And because leaves are linked in sorted order, range queries (WHERE age BETWEEN 20 AND 30, or ORDER BY) can be answered by one initial tree descent followed by a fast sequential walk across linked leaves — a classic B-Tree would require repeated re-descents from the root to collect a range, since matching data can live at any level.\n\nThe order (or fan-out) of a B+Tree, often denoted m, is the maximum number of children an internal node can have; a node with order m holds up to m-1 keys and has up to m children, and (except for the root) must be at least half full — at least ⌈m/2⌉ children — which is what keeps the tree balanced and guarantees O(log n) height even after insertions and deletions. When a node overflows on insert, it splits into two nodes and a key is pushed up to the parent; when a node underflows on delete, it borrows a key from a sibling or merges with one — these rebalancing operations are what keep every leaf at the exact same depth, which is what gives B+Trees their guaranteed-worst-case O(log n) lookup, unlike an unbalanced binary tree.\n\nHash indexes take a completely different approach: a hash function maps a key directly to a bucket/slot, giving O(1) average-case lookup for exact-match equality queries (WHERE id = 5). But hashing scrambles order, so hash indexes cannot support range queries, ORDER BY, or prefix matching (LIKE 'abc%') — the database would have to hash every possible value in the range to find matches, which defeats the purpose. This is why hash indexes are a narrower tool: PostgreSQL supports them explicitly for equality-only lookups, and many key-value stores use hashing as their primary structure since their access pattern is pure key lookup.\n\nAn important structural distinction is clustered versus non-clustered indexes. A clustered index determines the actual physical order in which rows are stored on disk — the table's data IS the B+Tree's leaf level (this is InnoDB's default: every table has exactly one clustered index, typically on the primary key, and there can only be one per table since data can only be physically sorted one way). A non-clustered (secondary) index is a separate structure whose leaves store either the row's physical location or, in InnoDB's case, the clustered index key — so looking up a row via a secondary index means one traversal of the secondary index's B+Tree followed by a second traversal of the clustered index (called a 'bookmark lookup' or 'key lookup'), which is why secondary indexes are somewhat more expensive per lookup than the clustered index itself, and why a table can have many non-clustered indexes but only one clustered index. Composite (multi-column) indexes store keys as a concatenated tuple in a defined column order, and can only be used efficiently for queries that filter on a left-prefix of that column order — an index on (last_name, first_name) speeds up queries filtering on last_name alone or on both columns, but not one filtering on first_name alone.",
  realWorldExamples:
    "MySQL's InnoDB storage engine clusters every table by its primary key by default — if you don't declare one, InnoDB silently creates a hidden auto-increment row ID to cluster on — which is why choosing a good, monotonically increasing primary key (like an auto-increment integer or a time-ordered UUID) avoids expensive page splits from random-order inserts. PostgreSQL uses B-tree indexes as the default index type for nearly every use case, but also offers hash indexes (for pure equality), GiST/GIN indexes (for full-text search and array/JSONB containment), and BRIN indexes (for very large, naturally-ordered tables like time-series data, where a tiny summary index suffices). Elasticsearch and other search engines use inverted indexes — conceptually similar to a hash-based structure mapping terms to document lists — which is a completely different indexing strategy optimized for full-text search rather than range queries.",
  useCases: [
    "Speeding up WHERE clause lookups on columns frequently filtered (e.g. user_id, email, order_date)",
    "Enforcing uniqueness efficiently (unique indexes double as fast lookup structures)",
    "Supporting fast ORDER BY / range queries via the B+Tree's sorted, linked leaf structure",
    "Speeding up JOIN operations by indexing foreign key columns",
    "Covering indexes: including extra columns in an index so a query can be answered entirely from the index without touching the table",
  ],
  advantages: [
    "Turns O(n) full table scans into O(log n) lookups for equality and range queries",
    "B+Trees efficiently support both point lookups and range scans / sorted iteration",
    "Hash indexes give true O(1) average-case lookup for pure equality queries",
    "A well-chosen index can also eliminate an explicit sort step (ORDER BY) since B+Tree leaves are already sorted",
  ],
  disadvantages: [
    "Every index adds write overhead — each INSERT/UPDATE/DELETE must also update every affected index",
    "Indexes consume additional disk space, sometimes larger than the table itself for wide composite indexes",
    "Too many indexes on a write-heavy table can slow down writes more than they speed up reads",
    "An index on a low-cardinality column (e.g. a boolean 'is_active' flag) often doesn't help — the optimizer may reasonably choose a full scan anyway since a large fraction of rows match",
    "A composite index only helps queries that use its left-prefix columns; misordering columns can silently make an index useless for a query",
  ],
  commonMisconceptions: [
    "\"More indexes are always better\" — every additional index slows down every write to that table and costs disk space; indexes should be added deliberately based on actual query patterns.",
    "\"An index on a column always gets used\" — the query optimizer may skip an index if it estimates a full scan is cheaper (e.g. the query would return a large fraction of the table, or the column has low cardinality).",
    "\"B-Trees and B+Trees are basically the same thing\" — the leaf-only-data and linked-leaf-list properties of B+Trees are specifically what make them better for disk-based range queries; that's not a minor implementation detail.",
    "\"A composite index on (A, B) helps any query filtering on A or B\" — it only helps queries filtering on a left-prefix: A alone, or A and B together, not B alone.",
    "\"Hash indexes are strictly better than B+Tree indexes because they're O(1)\" — they only support equality lookups; a single ORDER BY or range query makes them unusable for that query.",
  ],
  interviewPerspective:
    "Indexing is asked constantly, often as 'why is my query slow' style questions where the expected answer is diagnosing a missing or misused index. Interviewers frequently ask you to explain precisely why B+Trees, not B-Trees, are used in real databases (the leaf-linking and data-only-at-leaves points are the crux of a strong answer), the difference between clustered and non-clustered indexes, and to reason through when NOT to add an index — a surprisingly good signal of practical experience versus rote memorization.",
  oaPerspective:
    "OA questions test B-Tree/B+Tree order and fan-out arithmetic (given an order m, compute max keys per node, or given a key size and page size, compute achievable fan-out and estimate tree height for N rows), clustered vs non-clustered index definitions, and identifying which queries a given composite index can and cannot accelerate based on left-prefix matching.",
  keyTakeaways: [
    "B+Trees are the standard disk-based index structure because they're wide/shallow (few disk reads per lookup) and have linked, sorted leaves (fast range scans).",
    "B-Trees store data at internal nodes too; B+Trees store data only at leaves, which is what enables the linked-leaf range-scan advantage.",
    "A clustered index defines physical row order on disk; a table can have only one. Non-clustered (secondary) indexes are separate structures and a table can have many.",
    "Hash indexes give O(1) equality lookups but cannot support range queries, ORDER BY, or prefix matching.",
    "Composite indexes only accelerate queries filtering on a left-prefix of the indexed column order.",
    "Indexes trade write performance and disk space for read performance — index only columns that are actually queried frequently.",
  ],
  summaryClosing:
    "Indexing is fundamentally about paying a small, ongoing write-time cost to buy a large read-time speedup, and the B+Tree is the structure the entire relational database world converged on because its shape matches how disks actually work: wide nodes minimize seeks, and linked leaves make ordered access nearly free. Knowing when an index helps — and, just as importantly, when it doesn't — is what separates schema design from query optimization guesswork.",
  relatedTopics: ["Query Optimization", "Normalization", "Concurrency Control & Locking"],
  furtherReading: [
    { label: "Use The Index, Luke", note: "A widely-cited practical guide to SQL indexing and how query planners actually use indexes." },
    { label: "MySQL InnoDB documentation: Clustered and Secondary Indexes", note: "Concrete details on how a production B+Tree-based engine implements clustering." },
  ],
};

export default indexingArticle;
