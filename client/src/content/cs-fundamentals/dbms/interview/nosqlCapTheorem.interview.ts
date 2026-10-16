// src/content/cs-fundamentals/dbms/interview/nosqlCapTheorem.interview.ts

import type { InterviewQuestion } from "@/types";

const nosqlCapTheoremInterviewQuestions: InterviewQuestion[] = [
  {
    id: "nosql-cap-theorem-iv-1",
    question: "State the CAP theorem precisely. What is the most common way people get it wrong?",
    difficulty: "Easy",
    detailedAnswer:
      "The CAP theorem states that during an actual network partition, a distributed data store can guarantee at most two of the following three properties: Consistency (every read gets the most recent write, or an error), Availability (every request to a non-failing node gets a non-error response), and Partition tolerance (the system keeps operating despite dropped or delayed messages between nodes). The most common mistake is treating this as an always-on trade-off — 'you can only ever have two of the three' — when the theorem specifically applies to the moment a partition is actually happening; outside a partition, a well-built system can offer both consistency and availability at the same time.",
    idealAnswer:
      "During an actual network partition, you can only guarantee two of Consistency, Availability, and Partition tolerance — not all three. The mistake almost everyone makes is treating this as a permanent, always-active trade-off, saying things like 'this system is CA so it must not care about partitions.' That's not right — the theorem is conditional on a partition actually occurring. When the network is healthy, there's no forced trade-off; both C and A can coexist just fine. Since any real multi-node system on an unreliable network will eventually see a partition, in practice the meaningful design choice is CP versus AP.",
    interviewerExpectations: [
      "States all three properties correctly with precise definitions",
      "Explicitly calls out that the trade-off is conditional on an actual partition, not a permanent state",
    ],
    followUpQuestions: [
      "Why is partition tolerance treated as essentially mandatory for distributed systems?",
      "Can you name a system that leans CP and one that leans AP?",
    ],
    commonMistakes: [
      "Stating CAP as 'pick any two of three, always' with no partition qualifier",
      "Confusing CAP's Consistency with ACID's Consistency",
    ],
    discussionPoints: ["Precise definitions of C, A, P", "The 'only during a partition' nuance"],
  },
  {
    id: "nosql-cap-theorem-iv-2",
    question: "What is eventual consistency, and why would a system deliberately choose it over strong consistency?",
    difficulty: "Medium",
    detailedAnswer:
      "Eventual consistency guarantees that if no new writes occur to a given piece of data, all replicas will eventually converge to the same value — it does not guarantee that a read immediately after a write reflects that write on every replica. Systems choose it deliberately to maximize availability and minimize latency: an AP system can accept a write or serve a read from whichever replica is reachable, even during a network partition or under high load, without waiting for cross-replica coordination. This trade-off makes sense when the application can tolerate briefly stale data in exchange for the system always being responsive — a like-count or view-count being off by a few for a moment is harmless, but the system being completely unavailable is a real user-facing failure.",
    idealAnswer:
      "Eventual consistency means replicas are allowed to disagree temporarily, but if writes stop, they'll all converge to the same value eventually — just not necessarily right away. Systems choose this deliberately when staying available and fast matters more than every read being perfectly up to date. A social media like-count is a great example: if it's off by one for half a second after a partition, nobody notices or cares, but if the whole feature goes down because the database refused to serve a stale read, that's a real, visible problem. The trade-off only makes sense when the business impact of staleness is genuinely low.",
    interviewerExpectations: [
      "Defines eventual consistency correctly (convergence over time, not immediate)",
      "Gives a concrete example of when the trade-off is acceptable",
    ],
    followUpQuestions: [
      "How do systems like Cassandra or DynamoDB resolve conflicting writes to different replicas?",
      "What's a scenario where eventual consistency would be unacceptable?",
    ],
    commonMistakes: [
      "Describing eventual consistency as 'the data is wrong' rather than 'temporarily stale, guaranteed to converge'",
      "Not providing a concrete real-world example",
    ],
    discussionPoints: ["Convergence guarantee", "Availability/latency trade-off", "Appropriate use cases"],
  },
  {
    id: "nosql-cap-theorem-iv-3",
    question: "Compare document, key-value, column-family, and graph NoSQL data models — when would you pick each?",
    difficulty: "Medium",
    detailedAnswer:
      "Document stores (MongoDB, Couchbase) store semi-structured, nested JSON-like documents and suit data with a natural hierarchical shape and evolving schema, like a product catalog where different categories have very different attributes. Key-value stores (Redis, DynamoDB in simple usage) map an opaque value to a key and suit the simplest, fastest access pattern — always fetching by a known key — making them ideal for caching, session storage, and leaderboards. Column-family stores (Cassandra, HBase, Bigtable) organize sparse data into column families optimized for extremely high write throughput and are common for time-series, IoT telemetry, and logging/analytics workloads where write volume dominates and queries are mostly range scans by a partition/row key. Graph databases (Neo4j, Neptune) store nodes and edges as first-class citizens and excel at relationship-traversal queries — social graphs, recommendation engines, fraud-ring detection — that would otherwise require expensive multi-way joins in a relational schema.",
    idealAnswer:
      "I'd pick based on the shape of the access pattern, not just the data. Document stores fit naturally nested, schema-flexible data — think a product catalog with wildly different fields per category. Key-value stores are for pure 'give me the value for this key, fast' access, like a session cache or leaderboard. Column-family stores are built for very high write throughput and range scans, which is why they're common for time-series and IoT data. Graph databases shine specifically when the interesting part of the query is relationships — friend-of-a-friend, fraud rings — because that's a natural fit for nodes and edges instead of repeated joins. None of these are universally 'better' than the others; they're each optimized for a different shape of problem.",
    interviewerExpectations: [
      "Correctly matches each model to a distinct, realistic use case",
      "Frames the choice around access pattern, not popularity or trendiness",
    ],
    followUpQuestions: [
      "Why would a relational join be expensive for a deep friend-of-a-friend query, and how does a graph database avoid that?",
      "Could you use a key-value store to build a rough approximation of a document store? What would you lose?",
    ],
    commonMistakes: [
      "Treating all NoSQL databases as interchangeable",
      "Not being able to justify why a specific model fits a specific access pattern",
    ],
    discussionPoints: ["Document vs key-value vs column-family vs graph", "Access-pattern-driven selection"],
  },
  {
    id: "nosql-cap-theorem-iv-4",
    question: "How would you classify PostgreSQL with synchronous replication, and Cassandra with its default settings, under CAP — and justify it?",
    difficulty: "Hard",
    detailedAnswer:
      "PostgreSQL configured with synchronous replication is CP-leaning: when a partition prevents the primary from confirming a write on its synchronous replica, the system will block or reject that write rather than risk serving inconsistent data — sacrificing availability to preserve consistency. Cassandra, in its default configuration, is AP-leaning: it will accept a write on any available replica (via its peer-to-peer, leaderless architecture) and reconcile any conflicts later using mechanisms like last-write-wins timestamps or tunable read-repair, prioritizing staying responsive over guaranteeing every read is immediately up to date. It's worth being precise here: neither classification is an absolute, unchangeable law — Cassandra supports tunable per-query consistency levels (e.g., QUORUM) that shift it toward stronger consistency at the cost of some availability, and PostgreSQL can be run with asynchronous replication instead, shifting it toward availability at the cost of a small consistency/durability window. So the CP/AP label really describes each system's default design center and lean, not a rigid unbreakable classification.",
    idealAnswer:
      "PostgreSQL with synchronous replication is CP — if it can't confirm the write on the sync replica during a partition, it blocks or fails the write rather than risk giving back inconsistent data later. Cassandra by default is AP — it'll happily accept a write on whatever replica is reachable and sort out any conflicts afterward, because staying responsive is the priority. But I'd be careful not to present these as fixed forever — Cassandra lets you dial up consistency per query with something like QUORUM reads and writes, and Postgres can be run async instead of sync, which shifts it toward availability. So really I'm describing each system's default lean and design philosophy, not an unchangeable law carved into the software.",
    interviewerExpectations: [
      "Correctly classifies both systems with a clear justification tied to their actual replication behavior",
      "Adds the nuance that these are tunable defaults/leans, not absolute unchangeable properties",
    ],
    followUpQuestions: [
      "How does Cassandra's QUORUM consistency level work, and what does it trade off?",
      "What would change about PostgreSQL's CAP classification if it used asynchronous replication instead?",
    ],
    commonMistakes: [
      "Treating CP/AP classification as a fixed, immutable property of the software rather than a configurable default",
      "Not justifying the classification with the actual replication/failure behavior",
    ],
    discussionPoints: ["Synchronous vs asynchronous replication", "Cassandra tunable consistency (QUORUM)", "Default lean vs absolute law"],
  },
  {
    id: "nosql-cap-theorem-iv-5",
    question: "You're designing a new service and need to decide between a relational database and a document store. Walk me through your decision process.",
    difficulty: "Hard",
    detailedAnswer:
      "I'd start with the data's natural shape and access pattern rather than any general preference: does the data have a stable, well-understood relational structure that benefits from multi-table joins and referential integrity (favors relational), or is it naturally nested/document-shaped with fields that vary significantly between records (favors a document store)? Next, I'd assess the transactional integrity requirements: does correctness depend on atomic operations spanning multiple related records (e.g., debiting one account and crediting another must both happen or neither) — that strongly favors a relational database's mature multi-row ACID transaction support, though modern document stores like MongoDB do offer multi-document transactions now, just historically with more overhead and less maturity than relational engines. Third, I'd look at read/write scale and latency requirements: if I expect very high write throughput that needs to scale horizontally across many commodity nodes with flexible schema evolution, a document or column-family store may fit better operationally. Finally, I'd consider query patterns: if the service needs complex, ad-hoc, multi-table queries and reporting, SQL's expressiveness and mature tooling (indexes, query planners, EXPLAIN) are a real advantage; if access is overwhelmingly by a known key or a predictable document shape, the flexibility overhead of relational modeling may not be paying for itself. In practice, I'd also consider the team's existing operational expertise and tooling — introducing a brand-new database technology has a real organizational cost beyond the pure technical trade-off.",
    idealAnswer:
      "I'd start with the shape of the data and how the service accesses it, not a general philosophy. If the data is naturally relational — think orders, customers, line items with real referential integrity needs — and I need transactional guarantees across multiple related writes, like a payment touching two account balances atomically, I'd lean relational; that's a strength SQL databases have had refined for decades. If the data naturally nests and the schema varies a lot record to record — like a product catalog where a shirt and a laptop have completely different attribute sets — a document store avoids a lot of awkward, sparse relational modeling. I'd also think about scale: if I expect very high write volume that needs to spread across many nodes, and I can tolerate slightly relaxed consistency for that specific data, a document or column-family store might scale more naturally. And I'd weigh query needs — if this service needs rich ad-hoc joins and reporting, SQL's tooling is hard to beat. Finally, I wouldn't ignore the practical side: does my team already run and operate one of these well? Introducing a brand-new database just for one service has a real ongoing cost that should factor into the decision, not just the pure technical fit.",
    interviewerExpectations: [
      "Structures the decision around concrete criteria (data shape, transactional needs, scale, query patterns) rather than a vague preference",
      "Acknowledges nuance — e.g., modern document stores do support multi-document transactions now",
      "Mentions the practical/organizational cost of introducing new technology, not just pure technical fit",
    ],
    followUpQuestions: [
      "What would change your decision if this service needed to support complex ad-hoc reporting queries later?",
      "How would you migrate if you chose one and later realized the other was a better fit?",
      "Would you ever use both databases together for the same service? Give an example.",
    ],
    commonMistakes: [
      "Answering with a blanket 'always use SQL' or 'always use NoSQL' rule instead of criteria-driven reasoning",
      "Ignoring operational/team-familiarity cost as a real factor in the decision",
    ],
    discussionPoints: ["Data shape and access pattern", "Transactional integrity needs", "Scale and write throughput", "Team operational expertise as a real cost"],
    scenarioBased: true,
  },
];

export default nosqlCapTheoremInterviewQuestions;
