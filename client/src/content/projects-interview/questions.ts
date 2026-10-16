// src/content/projects-interview/questions.ts

import type { ProjectInterviewQuestion } from "@/types";

export const projectInterviewQuestions: ProjectInterviewQuestion[] = [
  // ---------------- resume-projects ----------------
  {
    id: "resume-projects-1",
    categorySlug: "resume-projects",
    question: "Walk me through one of the projects on your resume.",
    difficulty: "Easy",
    detailedAnswer:
      "This is almost always the opening question of a technical interview, and interviewers use it to calibrate everything that follows: how you communicate, how deeply you actually understand what you built, and where to dig next. What they are NOT asking for is a feature list read off your resume. They want a structured narrative: what problem the project solved, who it was for, what you personally built, which technologies you chose and why, and what the measurable outcome or learning was. A strong pattern to use is Situation → Task → Action → Result, or more simply: problem, approach, your role, outcome. For example, if you built a food-delivery clone, don't say 'I made a food delivery app with React and Node.' Say what real-world problem it mimics (real-time order tracking, multi-actor systems with customers/restaurants/delivery agents), what was technically interesting about it (state synchronization, geolocation updates), and what you'd improve if you had more time. Keep the opening to 60-90 seconds — long enough to show substance, short enough that the interviewer can steer with follow-ups.",
    idealInterviewAnswer:
      "I'll walk you through [project name], a [one-line description, e.g. 'full-stack food-delivery platform with real-time order tracking']. The problem I wanted to solve was [core problem]. I built the frontend in [tech] and the backend in [tech], and I was responsible for [your specific role — e.g. 'the entire backend, including the order state machine and the WebSocket layer for live tracking']. The most technically interesting part was [one genuinely hard piece], where I had to [briefly explain the approach]. By the end, it supported [concrete outcome — e.g. 'the full order lifecycle from placement to delivery with sub-second location updates']. If I extended it further, I'd focus on [one realistic next step, e.g. 'adding a proper queueing layer for order dispatch']. I'm happy to go deeper into any part of it — the architecture, the data model, or specific challenges I ran into.",
    interviewerExpectations: [
      "A clear, structured narrative rather than a rambling feature list",
      "Evidence that the candidate actually built (not copy-pasted) the project",
      "Ability to identify what was technically interesting or hard, not just what exists",
      "A natural stopping point that invites follow-up questions rather than over-explaining everything",
    ],
    followUpQuestions: [
      "Which part of this project did you personally write versus use a library or template for?",
      "What was the hardest bug you ran into while building this?",
      "If you had two more weeks, what would you add or change?",
      "Why did you choose this project to put on your resume?",
    ],
    commonMistakes: [
      "Reciting the tech stack as a list of buzzwords with no reasoning behind any choice",
      "Going too deep into UI/visual details instead of the underlying engineering",
      "Failing to mention their specific role on team projects, leaving the interviewer unsure what they actually did",
      "Talking for 5+ minutes without pausing, leaving no room for the interviewer to guide the conversation",
    ],
    keyDiscussionPoints: [
      "The real-world problem the project addresses",
      "Your specific contribution and ownership",
      "One genuinely hard technical piece, explained briefly",
      "A measurable or concrete outcome",
      "A natural, honest next step or limitation",
    ],
  },
  {
    id: "resume-projects-2",
    categorySlug: "resume-projects",
    question: "How did you decide what to build for this project, and why does it matter?",
    difficulty: "Easy",
    detailedAnswer:
      "Interviewers ask this to test motivation and product sense — whether you can identify a real problem and reason about why a solution matters, rather than picking a project purely because a tutorial existed for it. This matters more for freshers because most student projects are inherently 'clones' (an e-commerce clone, a chat app, a URL shortener); the differentiator is whether you can articulate the underlying problem class those projects represent. A URL shortener is really about hashing/collision handling and high-read low-write systems. A chat app is really about real-time bidirectional communication and message ordering. Explaining the 'why' behind your choice — even if it was 'I wanted to learn WebSockets and building a chat app was the most concrete way to force myself to' — shows self-directed learning, which recruiters value highly in freshers who don't yet have production experience to point to.",
    idealInterviewAnswer:
      "I chose to build [project] because I wanted to get hands-on with [specific concept, e.g. 'real-time systems and WebSocket-based communication'], and I felt that reading about it wasn't enough — I needed to build something where that concept was actually load-bearing, not decorative. I picked [project type] specifically because it forces you to deal with [core technical problem, e.g. 'message ordering and connection drops'], which you can't fake or skip. It also mattered to me personally because [genuine personal reason, e.g. 'I noticed a gap in how my college handled X']. Looking back, the choice was good because it pushed me to learn [skill], but if I were choosing again I might also consider [related problem] to round out the experience.",
    interviewerExpectations: [
      "Genuine motivation beyond 'it was a popular tutorial project'",
      "Ability to name the underlying technical concept the project was chosen to explore",
      "Self-awareness about the project's scope and limitations",
      "Some evidence of independent thinking rather than just following instructions",
    ],
    followUpQuestions: [
      "What alternative project ideas did you consider before settling on this one?",
      "What specific skill gap were you trying to close by building this?",
      "Was this a solo project or a team project, and how was the idea chosen?",
      "Looking back, would you pick the same project again?",
    ],
    commonMistakes: [
      "Saying 'it was in my course syllabus' with no further reasoning",
      "Being unable to name the core technical concept the project exercises",
      "Overclaiming originality for what is clearly a well-known clone project",
      "Not connecting the project choice to any personal learning goal",
    ],
    keyDiscussionPoints: [
      "The underlying technical concept the project was chosen to practice",
      "Genuine motivation, even if simple",
      "Awareness of the project's scope and what it does/doesn't cover",
      "Honest reflection on whether the choice was a good one",
    ],
  },

  // ---------------- architecture ----------------
  {
    id: "architecture-1",
    categorySlug: "architecture",
    question: "Describe the overall architecture of your project.",
    difficulty: "Medium",
    detailedAnswer:
      "This question tests whether you can zoom out from code you wrote line-by-line and describe the system as a set of components and the data/control flow between them. Interviewers are listening for a mental model, not implementation minutiae. A good answer names the major layers (client, API/backend, database, any external services), how they communicate (REST, WebSockets, message queues), and where state lives. For a typical student full-stack project — say a blog platform — a clean answer is: 'React frontend talks to an Express REST API over HTTPS; the API validates and authorizes requests, then reads/writes to a PostgreSQL database; images are uploaded directly to object storage via a presigned URL rather than routed through the backend.' That last detail (presigned URLs) signals you thought about not routing binary data through your API server unnecessarily — exactly the kind of small architectural judgment interviewers want to hear. Being able to sketch this on a whiteboard/verbally, top to bottom, in under two minutes is the goal.",
    idealInterviewAnswer:
      "At a high level, [project] has three layers: a [frontend tech] client, a [backend tech] API server, and a [database] for persistence. The client talks to the backend over [REST/GraphQL/WebSockets], and the backend is responsible for [validation/auth/business logic] before touching the database. I also used [any external service — e.g. cloud storage, a third-party auth provider] for [specific purpose], mainly because [reasoning, e.g. 'I didn't want to store or manage passwords myself']. State that needs to persist across sessions lives in the database; anything ephemeral, like [session data / cart state], I kept in [wherever, e.g. 'client-side state or a Redis-backed session store']. If I were to draw this, the request would flow: client → API → business logic layer → database, with [caching/queue/external service] sitting at [specific point in the flow].",
    interviewerExpectations: [
      "A clear top-down description of major components and how they connect",
      "Correct identification of where state lives and how data flows through the system",
      "Reasoning behind including any external service or infrastructure piece",
      "Ability to describe this without reading code — a genuine mental model",
    ],
    followUpQuestions: [
      "Which component would break first under heavy load?",
      "Why did you put business logic in the backend instead of the client (or vice versa)?",
      "How do the frontend and backend agree on data shapes / contracts?",
      "If you added a mobile app tomorrow, what would need to change in this architecture?",
    ],
    commonMistakes: [
      "Describing individual files/functions instead of components and data flow",
      "Not knowing where session/auth state actually lives",
      "Forgetting to mention external dependencies (storage, third-party APIs) that are part of the real architecture",
      "Being unable to explain why a particular layer exists at all",
    ],
    keyDiscussionPoints: [
      "The major components and the technology each uses",
      "How components communicate and in what format",
      "Where state and persistence live",
      "Reasoning behind any external services or infrastructure choices",
    ],
  },
  {
    id: "architecture-2",
    categorySlug: "architecture",
    question: "Why did you choose a monolithic structure vs. splitting your project into separate services?",
    difficulty: "Medium",
    detailedAnswer:
      "This tests whether you understand that microservices are not a default 'better' choice but a trade-off suited to specific organizational and scaling problems. For a student or fresher project, a monolith is almost always the right call, and interviewers want to hear you justify that rather than apologize for it. Microservices solve problems like independent team ownership, independently scaling hot components, and isolating failure domains — problems a single-developer or small-team project with modest traffic simply doesn't have. What they add is real operational cost: network calls where function calls used to be, distributed transactions, service discovery, more complex deployment and monitoring. A strong answer explains that a monolith kept the project simple to build, test, and deploy given the team size and timeline, while acknowledging which specific piece (e.g., an image-processing worker, or a notification sender) would be the first candidate to split out if the system needed to scale — showing you understand the decision is context-dependent, not permanent.",
    idealInterviewAnswer:
      "I built [project] as a monolith — a single [backend tech] application talking to one database. I chose that deliberately, not by default: with [team size, e.g. 'just myself'] and a [timeframe], the overhead of running and coordinating multiple services — service discovery, network calls instead of function calls, distributed debugging — would have slowed me down far more than it would have helped. Microservices earn their cost when you have independent teams that need to deploy separately, or when one component has wildly different scaling needs than the rest. Neither was true here. That said, if I were to scale this, the first thing I'd pull out into its own service would be [specific piece, e.g. 'the notification/email sending logic'], because it's naturally async and has a different failure profile than the core request path.",
    interviewerExpectations: [
      "Understanding that microservices solve organizational/scaling problems, not code cleanliness",
      "Ability to name the real costs of microservices (network calls, distributed debugging, deployment complexity)",
      "A defensible reason for the choice given team size and project scope",
      "Identification of what would realistically be split out first if the project grew",
    ],
    followUpQuestions: [
      "At what point would you actually consider splitting this into services?",
      "What's the difference between a modular monolith and a true microservice architecture?",
      "How would you handle a failure in one part of your monolith without taking down the whole app?",
      "What's the hardest part of debugging a distributed system compared to a monolith?",
    ],
    commonMistakes: [
      "Saying microservices are 'more scalable' as a blanket, unqualified statement",
      "Being unable to name a single real cost of microservices",
      "Claiming a microservice architecture without being able to explain how services actually discover or call each other",
      "Not being able to say what they'd split out first if asked",
    ],
    keyDiscussionPoints: [
      "The actual problems microservices solve (independent scaling, team ownership, fault isolation)",
      "The real operational costs they introduce",
      "Why the chosen structure fit the project's team size and scope",
      "What the first realistic service extraction would be",
    ],
  },

  // ---------------- design-decisions ----------------
  {
    id: "design-decisions-1",
    categorySlug: "design-decisions",
    question: "Why did you choose your particular tech stack for this project?",
    difficulty: "Easy",
    detailedAnswer:
      "This question checks whether your technology choices were deliberate or accidental — did you pick tools because they fit the problem, because you wanted to learn them, or purely because a tutorial used them? All three are legitimate reasons for a student project, but you have to be honest and specific about which one applied and be able to connect the tool to a property it gave you. For example, choosing React because of component reusability and a large ecosystem is fine; choosing MongoDB because 'it's flexible' is a weak, generic answer unless you can say what specifically was flexible about your data (e.g., you had documents with varying optional fields that would've meant a lot of nullable columns in a relational schema). Interviewers are also probing whether you understand the alternative you didn't pick — if you can't say what you'd lose by switching to the alternative, it suggests the choice wasn't really considered.",
    idealInterviewAnswer:
      "I went with [stack, e.g. 'React, Node/Express, and PostgreSQL']. For the frontend, I picked [choice] because [concrete reason, e.g. 'I needed reusable, stateful UI components and a large ecosystem of libraries for things like forms and routing']. On the backend, I chose [choice] because [reason tied to the project's actual needs, e.g. 'I wanted a single language across the stack to move faster as a solo developer']. For storage, I went with [database] over [alternative] because my data was [structured/relational vs. flexible/document-like], and I needed [specific property, e.g. 'strong consistency for financial-like operations']. I did consider [alternative technology] but decided against it because [specific trade-off, e.g. 'it would have added operational complexity I didn't need at this scale'].",
    interviewerExpectations: [
      "A specific, project-grounded reason for each major technology choice",
      "Awareness of at least one alternative and why it wasn't chosen",
      "Honesty about learning-driven choices versus purely technical ones",
      "No buzzword-only justifications ('it's fast', 'it's modern') without backing",
    ],
    followUpQuestions: [
      "What would you lose if you had to rebuild this with [alternative technology]?",
      "Was there any part of the stack you regret choosing, in hindsight?",
      "How did you evaluate the trade-offs between the options you considered?",
      "If this project needed to support 100x the users, which part of the stack would be the first bottleneck?",
    ],
    commonMistakes: [
      "Giving generic, textbook reasons ('MongoDB is flexible', 'React is popular') with no connection to the actual project",
      "Being unable to name any alternative that was considered and rejected",
      "Claiming a purely technical justification when the real reason was 'I already knew this tool'",
      "Contradicting themselves when a follow-up probes the choice further",
    ],
    keyDiscussionPoints: [
      "Specific properties each technology gave the project (not generic praise)",
      "At least one alternative considered and why it was rejected",
      "Honesty about learning-driven vs. purely technical motivations",
      "Awareness of the choice's limitations",
    ],
  },
  {
    id: "design-decisions-2",
    categorySlug: "design-decisions",
    question: "How did you design the data model for your project, and why?",
    difficulty: "Medium",
    detailedAnswer:
      "Data modeling questions test whether you think about how entities relate to each other and how those relationships are actually queried, not just whether you can draw boxes and arrows. A good process to describe: identify the core entities (e.g., for an e-commerce clone: User, Product, Order, OrderItem, Cart), figure out the cardinality between them (a User has many Orders, an Order has many OrderItems, each OrderItem references one Product), and then decide normalization level based on how the data is read and written. For instance, storing the product's price on the OrderItem at the time of purchase (rather than always joining to the live Product table) is a deliberate denormalization decision — it preserves historical accuracy even if the product's price changes later. Being able to explain a decision like that shows real modeling maturity, because it demonstrates you thought about a subtle correctness bug (price changing retroactively) before it happened.",
    idealInterviewAnswer:
      "The core entities in [project] were [list, e.g. 'User, Product, Order, and OrderItem']. I modeled [relationship] as [one-to-many/many-to-many] because [reasoning]. One decision I'm fairly happy with is that I [specific modeling choice, e.g. 'stored a snapshot of the product price on each OrderItem instead of always joining to the live Product table'], because otherwise a price change later would silently rewrite the historical value of past orders, which is a correctness bug, not just a performance detail. For indexing, I added an index on [column] because [query pattern] was the most frequent read path. If I rebuilt this today, I'd probably reconsider [one honest limitation, e.g. 'how I handled soft deletes'], since it made a couple of queries more awkward than they needed to be.",
    interviewerExpectations: [
      "Clear identification of core entities and their relationships/cardinality",
      "At least one specific, reasoned modeling decision (not just 'I normalized it')",
      "Awareness of how the schema is actually queried, not just how it's structured",
      "Honest reflection on a modeling choice they'd revisit",
    ],
    followUpQuestions: [
      "How would this schema change if a Product could belong to multiple categories?",
      "What indexes did you add, and how did you decide where they were needed?",
      "How do you handle a user deleting their account when they have existing orders?",
      "What's a query in your app that would be slow with this schema at scale?",
    ],
    commonMistakes: [
      "Describing tables without ever mentioning relationships or cardinality",
      "Not being able to justify a single normalization or denormalization decision",
      "Ignoring how the data is actually read when describing how it's structured",
      "Claiming a perfect schema with no acknowledged trade-offs or limitations",
    ],
    keyDiscussionPoints: [
      "Core entities and the relationships between them",
      "At least one deliberate normalization/denormalization decision and its reasoning",
      "How query patterns influenced the schema or indexing",
      "An honest limitation they'd change on a redo",
    ],
  },

  // ---------------- trade-offs ----------------
  {
    id: "trade-offs-1",
    categorySlug: "trade-offs",
    question: "What trade-offs did you make while designing your project's database schema?",
    difficulty: "Medium",
    detailedAnswer:
      "Trade-off questions exist to test whether you understand that every design decision has a cost, and whether you can articulate that cost precisely instead of pretending your design was strictly better in every way. In schema design specifically, the classic tension is normalization (fewer duplicated writes, strong consistency, more joins) versus denormalization (faster reads, some duplicated data, risk of staleness). A concrete example: in a blog platform, you could store an author's name only on the User table and join it in on every post fetch (normalized), or copy the author's display name onto each Post row at write time (denormalized) to avoid a join on every read. The trade-off: the denormalized version is faster to read and simpler to query, but if the user changes their display name, either you update every post (extra write cost) or you accept slightly stale display names — a business decision, not just a technical one. A strong answer names both sides explicitly and explains which one they picked and why it fit their access pattern.",
    idealInterviewAnswer:
      "One trade-off I made was around [specific decision, e.g. 'whether to normalize the author's name onto every post or always join against the users table']. I chose [your specific choice] because my project reads [posts/data] far more often than it writes them, so optimizing for read speed made sense even at the cost of [downside, e.g. 'needing to update denormalized copies if the author's name changes']. The alternative — staying fully normalized — would have kept the data perfectly consistent at all times, but meant an extra join on every single read, which didn't seem worth it given how rarely usernames change. I think this was the right call for the read/write ratio in my app, though at a larger scale I'd probably introduce a background job to propagate name changes rather than leaving it purely denormalized.",
    interviewerExpectations: [
      "Explicit acknowledgment that a trade-off exists — not a claim that the choice was free",
      "Both sides of the trade-off named clearly (what was gained, what was given up)",
      "Reasoning tied to actual access patterns (read/write ratio) rather than guesswork",
      "Awareness of how the decision could be revisited or mitigated at larger scale",
    ],
    followUpQuestions: [
      "How would you keep denormalized data from going stale?",
      "What would change about this decision if writes became much more frequent than reads?",
      "Can you give another example of a trade-off elsewhere in your project?",
      "How would you measure whether this decision was actually the right one?",
    ],
    commonMistakes: [
      "Describing a decision as purely positive with no acknowledged downside",
      "Confusing 'trade-off' with just 'a decision I made' without naming what was sacrificed",
      "Giving a textbook definition of normalization without applying it to their own project",
      "Being unable to say what would change their decision under different conditions",
    ],
    keyDiscussionPoints: [
      "A specific, real trade-off from their own project, not a generic one",
      "Both sides of the trade-off named explicitly",
      "Reasoning grounded in actual read/write patterns",
      "How the decision could evolve if conditions changed",
    ],
  },
  {
    id: "trade-offs-2",
    categorySlug: "trade-offs",
    question: "Why did you choose [technology X] over [technology Y] for your project, and what did you give up?",
    difficulty: "Medium",
    detailedAnswer:
      "This is a generalized version of the tech-stack question but specifically forces trade-off thinking rather than just justification. The interviewer wants to hear you name a concrete downside of your own choice — most candidates can explain why they picked X, but freeze when asked what they lost by not picking Y. A good example: choosing SQL (e.g., PostgreSQL) over a NoSQL document store for a project with relational data gives you strong consistency, joins, and transactional guarantees, but you give up the schema flexibility of adding new fields without migrations, and horizontal write-scaling is harder. Or: choosing REST over GraphQL gives you simplicity, caching via HTTP semantics, and a smaller learning curve, but you give up the ability for the client to request exactly the fields it needs, which can mean over-fetching. The key skill being tested is intellectual honesty — can you critique your own decision without being defensive about it?",
    idealInterviewAnswer:
      "I chose [your specific choice] over [alternative] mainly because [core reason tied to the project's needs]. What I gave up by not choosing [alternative] was [specific, honest downside — e.g. 'the schema flexibility of a document store, so every new field I add now needs a migration']. In practice that trade-off was worth it for me because [reasoning, e.g. 'my data was genuinely relational — orders reference users and products — and I valued the consistency guarantees more than the flexibility']. If my project had needed to handle much more varied, semi-structured data, or if I'd been iterating on the schema extremely rapidly early on, I probably would have leaned the other way. I don't think either choice is universally better — it depended on the shape of my data and how often it was likely to change.",
    interviewerExpectations: [
      "A specific, non-defensive answer that names a real downside of their own choice",
      "Reasoning tied to the actual shape and access pattern of their data",
      "Understanding that the alternative isn't 'wrong', just suited to different conditions",
      "Ability to say under what conditions they'd have chosen differently",
    ],
    followUpQuestions: [
      "Under what circumstances would you have made the opposite choice?",
      "Did this decision cause you any real problems during development?",
      "How would you migrate away from this choice if it became a bottleneck later?",
      "What's a scenario where [technology Y] would clearly be the better choice?",
    ],
    commonMistakes: [
      "Refusing to name any real downside of their chosen technology",
      "Trash-talking the alternative technology instead of giving a balanced comparison",
      "Giving a decision that has nothing to do with their project's actual data or access patterns",
      "Contradicting their stated reasoning when pushed on a follow-up",
    ],
    keyDiscussionPoints: [
      "A specific downside honestly acknowledged, not just upsides",
      "Reasoning grounded in the actual shape of the problem/data",
      "Recognition that the alternative is contextually appropriate, not objectively worse",
      "Conditions under which the decision would flip",
    ],
  },

  // ---------------- scalability ----------------
  {
    id: "scalability-1",
    categorySlug: "scalability",
    question: "How would your project handle 100x the current number of users?",
    difficulty: "Hard",
    detailedAnswer:
      "This question tests systems thinking under growth, and interviewers know full well your student project has never seen real traffic — they want to see you reason about bottlenecks methodically rather than panic or hand-wave. The standard mental model: identify what's stateful vs. stateless, because stateless components (like a typical API server) can be horizontally scaled by just running more copies behind a load balancer, while stateful components (a single database instance) become the bottleneck first. Walk through the request path and ask 'what breaks first?' Usually it's the database — too many concurrent connections or slow queries — followed by any single points of failure like an in-memory session store tied to one server instance. Solutions to mention: horizontal scaling with a load balancer for the app tier, moving session state out of memory into something shared (Redis) so any server can handle any request, adding read replicas or caching for the database, and asynchronous processing (queues) for anything that doesn't need to happen synchronously in the request path, like sending emails.",
    idealInterviewAnswer:
      "Right now [project] runs as a single instance talking directly to one database, so at 100x traffic the first thing to break would be the database — either connection exhaustion or slow queries under load, since I only have [current indexing/caching setup]. To fix this, I'd first make the API layer stateless — right now, [if applicable: 'I'm storing session data in memory', or 'my app is already mostly stateless'] — so I could run multiple instances behind a load balancer. For the database, I'd add read replicas since my traffic is read-heavy, and introduce caching with something like Redis for the most frequently read, rarely changing data, like [example]. I'd also move anything non-critical to the request path, like [email sending / notifications], into a background queue so it doesn't block user-facing requests. The database would still eventually need sharding or partitioning if writes became the bottleneck, but that's a much later step.",
    interviewerExpectations: [
      "Ability to identify the actual first bottleneck (usually the database or in-memory state), not a vague 'add more servers'",
      "Understanding of the difference between stateless and stateful components and why that matters for horizontal scaling",
      "Concrete mitigations: load balancing, caching, read replicas, async processing",
      "Recognition that different fixes apply at different scale thresholds (caching before sharding, for example)",
    ],
    followUpQuestions: [
      "How would you make your API stateless if it currently isn't?",
      "What would you cache, and how would you invalidate that cache?",
      "At what point would read replicas stop being enough, and what would you do next?",
      "How would you find out where the actual bottleneck is before optimizing blindly?",
    ],
    commonMistakes: [
      "Saying 'I'd just add more servers' without addressing the stateful database bottleneck",
      "Not knowing whether their own app is stateless or stateful",
      "Jumping straight to exotic solutions like sharding without mentioning simpler first steps like caching or read replicas",
      "Giving textbook scalability vocabulary with no connection to their specific project's request path",
    ],
    keyDiscussionPoints: [
      "Identifying the real first bottleneck by walking through the request path",
      "Stateless vs. stateful components and why that distinction drives horizontal scaling",
      "Concrete, ordered mitigations (load balancing, caching, replicas, async queues)",
      "Awareness that scaling solutions apply progressively, not all at once",
    ],
  },
  {
    id: "scalability-2",
    categorySlug: "scalability",
    question: "What's the difference between horizontal and vertical scaling, and which would you apply to your project first?",
    difficulty: "Easy",
    detailedAnswer:
      "This is a fundamentals check disguised as a project question — the interviewer wants to confirm you know the concept before trusting your answers to harder scalability questions. Vertical scaling means giving a single machine more resources (more CPU, RAM, faster disk); it's simple — no architectural changes needed — but has a hard ceiling (there's a biggest machine you can buy) and is a single point of failure. Horizontal scaling means running more machines/instances and distributing load across them; it has effectively no ceiling and improves fault tolerance (one instance dying doesn't take down the whole app), but requires the component being scaled to be stateless, or for state to be externalized (shared database, shared cache/session store). For a student project, the practical answer is almost always: vertical scaling first, because it's a one-line change on most hosting platforms and buys time; horizontal scaling is the real long-term answer but requires you to first make the app stateless.",
    idealInterviewAnswer:
      "Vertical scaling means making a single server bigger — more CPU, more RAM — and horizontal scaling means running more copies of the server and spreading traffic across them with a load balancer. For [project], I'd reach for vertical scaling first, mainly because it requires zero code changes — on most hosting platforms it's a config change — so it's the fastest way to buy headroom if traffic suddenly grew. But it has a ceiling, and it's a single point of failure: if that one bigger machine goes down, the whole app goes down. Horizontal scaling is the real long-term fix, but it requires the app to be stateless — right now [describe current state handling], so before I could horizontally scale, I'd need to move any session/state data out of the server's memory into something shared, like Redis or the database itself.",
    interviewerExpectations: [
      "Correct, precise definitions of both scaling types",
      "Understanding of the ceiling and single-point-of-failure limitation of vertical scaling",
      "Understanding that horizontal scaling requires statelessness or externalized state",
      "A sensible, practical recommendation for their own project's current state",
    ],
    followUpQuestions: [
      "What in your current project would prevent horizontal scaling right now?",
      "What does 'statelessness' actually mean for a web server?",
      "How does a load balancer decide which instance to route a request to?",
      "What happens to in-memory session data if you horizontally scale without externalizing it?",
    ],
    commonMistakes: [
      "Mixing up the definitions of horizontal and vertical scaling",
      "Not mentioning the single-point-of-failure downside of vertical scaling",
      "Recommending horizontal scaling without acknowledging the statelessness precondition",
      "Treating this as a purely theoretical question with no connection to their own project's current architecture",
    ],
    keyDiscussionPoints: [
      "Precise definitions of horizontal vs. vertical scaling",
      "The ceiling and fault-tolerance trade-offs of each",
      "The statelessness precondition for horizontal scaling",
      "A concrete, practical recommendation grounded in their project's current state",
    ],
  },

  // ---------------- security ----------------
  {
    id: "security-1",
    categorySlug: "security",
    question: "How does authentication and authorization work in your project?",
    difficulty: "Medium",
    detailedAnswer:
      "Interviewers ask this because auth bugs are among the most common and most dangerous mistakes in student projects, and it's a fast way to gauge security maturity. The key distinction to get right: authentication is proving who you are (login, verifying credentials), authorization is proving what you're allowed to do once identified (can this user delete this specific resource?). A common weak answer only covers login and ignores authorization entirely — e.g., an app that checks a valid JWT exists but never checks whether the JWT's user actually owns the resource being modified, which is an IDOR (Insecure Direct Object Reference) vulnerability. A strong answer explains the login flow (password hashing with bcrypt/argon2, never storing plaintext passwords), how sessions are maintained (JWT vs. server-side sessions, and the trade-offs — JWTs are stateless and scale easily but are hard to revoke; sessions are easy to revoke but require shared/centralized storage), and then explicitly walks through an authorization check on a specific endpoint, like 'only the user who created a post can edit or delete it, enforced by comparing the authenticated user's ID against the resource's owner ID on every mutating request.'",
    idealInterviewAnswer:
      "Authentication in my project works by [describe flow — e.g. 'hashing passwords with bcrypt before storing them, and issuing a JWT on successful login that the client sends in the Authorization header on subsequent requests']. I chose [JWT/sessions] because [reasoning, e.g. 'it kept the backend stateless, which mattered since I wanted to be able to run multiple instances']. For authorization, every mutating endpoint checks not just that the request has a valid token, but that the authenticated user actually owns or has permission to act on the specific resource — for example, before deleting a post, I check that the post's `userId` matches the token's user ID, not just that some valid user is logged in. That distinction matters because without it, any logged-in user could delete anyone else's data just by guessing IDs. One thing I'd improve is [honest gap, e.g. 'adding refresh tokens so access tokens can be short-lived without forcing frequent re-logins'].",
    interviewerExpectations: [
      "Clear separation of authentication (who you are) from authorization (what you can do)",
      "Correct handling of passwords — hashing, never storing or logging plaintext",
      "An explicit example of an authorization check tied to resource ownership, not just 'is logged in'",
      "Awareness of the trade-offs between session-based and token-based auth",
    ],
    followUpQuestions: [
      "How would an attacker try to access another user's data in your app, and what stops them?",
      "How do you handle logout or token revocation with JWTs?",
      "What would happen if your JWT secret leaked?",
      "How do you handle role-based permissions, like an admin vs. a regular user?",
    ],
    commonMistakes: [
      "Only describing login and never mentioning authorization checks at all",
      "Storing or comparing plaintext passwords instead of hashed ones",
      "Confusing authentication and authorization terminology",
      "Not being able to explain how their app prevents one user from accessing another user's data",
    ],
    keyDiscussionPoints: [
      "The distinction between authentication and authorization",
      "Password handling and hashing",
      "Session vs. token-based auth trade-offs",
      "A concrete resource-ownership authorization check",
    ],
  },
  {
    id: "security-2",
    categorySlug: "security",
    question: "What did you do to protect your project against common web vulnerabilities like SQL injection or XSS?",
    difficulty: "Medium",
    detailedAnswer:
      "This question probes whether security was a deliberate practice or an accident of using a framework that happened to protect you. SQL injection happens when user input is concatenated directly into a query string, letting an attacker inject their own SQL; the fix is parameterized queries or an ORM that does this by default (Sequelize, Prisma, SQLAlchemy) — never building query strings via string concatenation with user input. Cross-Site Scripting (XSS) happens when unescaped user input is rendered directly into HTML, letting an attacker inject a script that runs in another user's browser (e.g., a malicious `<script>` tag in a comment field); the fix is that modern frontend frameworks like React escape content by default unless you explicitly opt out (`dangerouslySetInnerHTML`), so the honest answer for most student projects is 'I avoided XSS mostly by not opting out of React's default escaping' — which is a legitimate answer as long as you understand why it works, not just that it does. A strong answer also mentions input validation on the backend (never trusting client-side validation alone) and, for a truly polished answer, CSRF protection or rate limiting on sensitive endpoints like login.",
    idealInterviewAnswer:
      "For SQL injection, I used [ORM/parameterized queries, e.g. 'Prisma/Sequelize'], which parameterizes every query under the hood, so I never built SQL strings by concatenating user input directly — that's the main defense. For XSS, I relied on [framework]'s default behavior of escaping any content rendered from variables, and I made sure I never used [dangerouslySetInnerHTML / innerHTML] with unsanitized user input anywhere in the app. I also validate and sanitize input on the backend, not just the frontend, since client-side validation can always be bypassed by someone hitting the API directly with a tool like Postman. One thing I added on top of that was rate limiting on the login endpoint, to make brute-force password guessing slower and more detectable. I haven't implemented full CSRF protection yet, which is something I'd add if this were a production system.",
    interviewerExpectations: [
      "Correct explanation of how SQL injection happens and why parameterized queries/ORMs prevent it",
      "Correct explanation of how XSS happens and how their framework mitigates it by default",
      "Understanding that client-side validation is not a security boundary — backend must re-validate",
      "Honesty about what wasn't implemented, rather than overclaiming full security coverage",
    ],
    followUpQuestions: [
      "What would happen if you had built a raw SQL query using string concatenation with user input?",
      "Have you ever used dangerouslySetInnerHTML or similar in your project, and if so, how did you sanitize the input?",
      "What is CSRF, and does your project have any protection against it?",
      "How would you rate-limit an endpoint, and why does that help security?",
    ],
    commonMistakes: [
      "Claiming 'my app is secure' with no explanation of any specific mechanism",
      "Not knowing why an ORM or parameterized queries prevent SQL injection",
      "Assuming client-side validation alone is sufficient protection",
      "Being unfamiliar with basic vulnerability names (SQLi, XSS, CSRF) entirely",
    ],
    keyDiscussionPoints: [
      "How SQL injection works and how parameterized queries/ORMs prevent it",
      "How XSS works and how the frontend framework mitigates it by default",
      "Backend re-validation of all input, regardless of frontend checks",
      "Honest acknowledgment of security gaps not yet addressed",
    ],
  },

  // ---------------- performance ----------------
  {
    id: "performance-1",
    categorySlug: "performance",
    question: "How did you identify and fix a performance bottleneck in your project?",
    difficulty: "Medium",
    detailedAnswer:
      "This question tests whether you optimize based on measurement or guesswork — a hugely important engineering habit. The right process, and the one interviewers want to hear, is: measure first (using browser devtools, an API response-time log, a database EXPLAIN plan, or a profiler), identify the actual bottleneck, form a hypothesis about the cause, fix it, then measure again to confirm improvement. A classic student-project example: a page listing items feels slow, you check the network tab and see the API call itself takes 2 seconds, you check the backend logs or add timing and find a database query is the slow part, you run EXPLAIN on it and discover it's doing a full table scan because there's no index on the column you're filtering by, you add the index, and the query time drops from 2s to 20ms. Naming the tool used to measure (not just the fix) is what separates a credible answer from a guessed one — 'I made it faster' without describing how you found the bottleneck sounds like luck, not skill.",
    idealInterviewAnswer:
      "I noticed [specific symptom, e.g. 'the product listing page was taking a few seconds to load']. Instead of guessing, I used [tool, e.g. 'the browser's network tab / an EXPLAIN query / a simple console.time around the handler'] to actually measure where the time was going, and found that [root cause, e.g. 'a single database query was taking most of the request time because it was scanning the whole table without an index']. Once I confirmed that with [evidence], the fix was to [specific fix, e.g. 'add an index on the column being filtered on, and paginate the results instead of returning everything at once']. After the change, the same request went from [before] to [after] — I re-measured with the same tool to confirm it wasn't a fluke. The bigger lesson for me was to always profile before optimizing, since my first guess about the cause was actually wrong.",
    interviewerExpectations: [
      "A measurement-first approach, not a guess-and-check story",
      "Naming a specific tool or technique used to find the bottleneck",
      "A concrete root cause (not vague — e.g., 'missing index', not just 'the database was slow')",
      "Before/after numbers or at least a clear statement of improvement",
    ],
    followUpQuestions: [
      "What tool did you use to measure the performance, specifically?",
      "How did you confirm the fix actually worked, rather than assuming it did?",
      "Was there ever a case where your first guess about the bottleneck was wrong?",
      "What would you do if adding an index didn't fully solve the problem?",
    ],
    commonMistakes: [
      "Describing a fix with no mention of how the bottleneck was actually identified",
      "Guessing at a cause without ever measuring or profiling",
      "Vague claims like 'I optimized the database' with no specific mechanism named",
      "No before/after comparison to demonstrate the fix actually worked",
    ],
    keyDiscussionPoints: [
      "A measurement-first methodology (profiling, timing, EXPLAIN plans)",
      "A specific, named root cause",
      "The concrete fix applied",
      "Verification that the fix actually improved things, with numbers if possible",
    ],
  },
  {
    id: "performance-2",
    categorySlug: "performance",
    question: "How would you improve the frontend load time of your application?",
    difficulty: "Medium",
    detailedAnswer:
      "This question checks whether you understand frontend performance beyond 'it just loads fast because I wrote clean code.' The real levers are: reducing the amount of JavaScript shipped (code-splitting so users only download what the current route needs, lazy-loading components that aren't immediately visible), reducing image payload (compressing images, using modern formats like WebP, serving responsively sized images), minimizing render-blocking resources (deferring non-critical CSS/JS), and caching static assets aggressively with proper cache headers so repeat visits are near-instant. Measurement tools matter here too — Lighthouse, Chrome DevTools' Performance and Network tabs, and Core Web Vitals (Largest Contentful Paint, First Input Delay/Interaction to Next Paint, Cumulative Layout Shift) give concrete, industry-standard metrics rather than a vague 'feels fast' impression. A strong answer picks one or two concrete techniques actually applied (or honestly not yet applied) rather than reciting the full list abstractly.",
    idealInterviewAnswer:
      "For [project], the biggest lever was [specific technique actually used or planned, e.g. 'code-splitting by route, so a user visiting the login page doesn't download the JavaScript for the dashboard']. I used [tool, e.g. 'Lighthouse'] to get a baseline, which flagged [specific issue, e.g. 'a large unoptimized hero image and an unnecessarily large JS bundle'] as the main contributors to a slow Largest Contentful Paint. I fixed the image issue by [compressing/using WebP/lazy-loading below-the-fold images], and reduced the bundle by [lazy-loading a heavy library that was only needed on one page]. That combination brought my Lighthouse performance score from [before] to [after]. If I kept going, the next thing I'd tackle is [honest next step, e.g. 'setting proper cache headers on static assets so repeat visits skip re-downloading unchanged files'].",
    interviewerExpectations: [
      "Concrete, named techniques (code-splitting, image optimization, caching) rather than vague claims",
      "Use of an actual measurement tool (Lighthouse, DevTools) to identify and confirm issues",
      "Familiarity with at least one Core Web Vital and what it measures",
      "Honesty about what's implemented versus what's still a known gap",
    ],
    followUpQuestions: [
      "What is Largest Contentful Paint, and why does it matter?",
      "What's the difference between code-splitting and lazy-loading?",
      "How do browser caching headers work, and what would you set for a static JS bundle with a hashed filename?",
      "How would you measure whether your optimization actually helped real users, not just in a lab test?",
    ],
    commonMistakes: [
      "Vague claims like 'I made it fast' with no specific technique or measurement",
      "Not knowing any Core Web Vitals or performance measurement tools",
      "Confusing code-splitting with minification or other unrelated optimizations",
      "Ignoring images/assets entirely and only discussing JavaScript",
    ],
    keyDiscussionPoints: [
      "Specific frontend performance techniques applied (code-splitting, image optimization, caching)",
      "Use of measurement tools like Lighthouse or DevTools",
      "At least one Core Web Vital and what it represents",
      "Honest before/after or a clear next step",
    ],
  },

  // ---------------- testing ----------------
  {
    id: "testing-1",
    categorySlug: "testing",
    question: "What was your testing strategy for this project?",
    difficulty: "Medium",
    detailedAnswer:
      "This tests whether the candidate treats correctness as a deliberate practice rather than an afterthought — and it's a very common weak spot for student projects, so a thoughtful answer here stands out. The standard mental model to reference is the testing pyramid: many fast, cheap unit tests (testing a single function or component in isolation), fewer integration tests (testing that multiple pieces work together correctly, like an API endpoint hitting a real or test database), and very few slow, expensive end-to-end tests (testing the full user flow through a real browser). A credible student answer doesn't need 100% coverage or a full pyramid — it needs an honest description of what was actually tested and why those parts were chosen, e.g., 'I unit-tested the pricing calculation logic because it was the easiest to get subtly wrong, and I manually tested the UI flows since I didn't have time to set up Cypress.' Interviewers are more impressed by honest, reasoned coverage than by a vague claim of '100% test coverage' that falls apart under a follow-up question.",
    idealInterviewAnswer:
      "I focused my testing effort on [specific area, e.g. 'the business logic that was easy to get subtly wrong, like discount/pricing calculations and the order state machine'], using [framework, e.g. 'Jest'] for unit tests. For the API layer, I wrote a smaller set of integration tests that hit real endpoints against a test database to make sure the request/response contract actually worked end-to-end, not just the logic in isolation. I didn't get to full end-to-end browser testing with something like Cypress or Playwright — for the UI flows, I relied on manual testing, which I know is the weakest part of my current strategy. If I extended this, the highest-value next test would be an end-to-end test of the [critical flow, e.g. 'checkout process'], since that's the flow where a silent bug would do the most damage.",
    interviewerExpectations: [
      "A reasoned prioritization of what to test, not a claim of blanket full coverage",
      "Understanding of the difference between unit, integration, and end-to-end tests",
      "Specific examples of what was actually tested and why those areas mattered most",
      "Honesty about testing gaps and what the highest-value next test would be",
    ],
    followUpQuestions: [
      "Can you walk me through one specific unit test you wrote?",
      "How did you test code that depends on an external service or the database?",
      "What's a bug that your tests would NOT have caught?",
      "How would you test the [critical flow] end-to-end if you had more time?",
    ],
    commonMistakes: [
      "Claiming '100% coverage' without being able to describe a single actual test",
      "Not knowing the difference between unit and integration tests",
      "Testing only trivial code (getters/setters) while leaving complex business logic untested",
      "No acknowledgment of any testing gap at all — overclaiming completeness",
    ],
    keyDiscussionPoints: [
      "A reasoned prioritization of what got tested and why",
      "Understanding of unit vs. integration vs. end-to-end tests",
      "A specific, concrete example of a test written",
      "Honest acknowledgment of testing gaps and next steps",
    ],
  },
  {
    id: "testing-2",
    categorySlug: "testing",
    question: "How do you handle testing code that depends on external services, like a payment gateway or a third-party API?",
    difficulty: "Hard",
    detailedAnswer:
      "This question separates candidates who've only ever tested pure, self-contained functions from those who've dealt with real-world testing challenges. External dependencies are a problem for tests because they're slow, can be flaky/unavailable, may cost money to call (like a real payment gateway), and make tests non-deterministic. The standard solution is to introduce a boundary/interface between your code and the external service, then use mocking or stubbing to replace the real service with a fake one during tests — the fake returns predictable, controlled responses so you can test how your code behaves in success cases, error cases, and edge cases (like a payment failing) without ever hitting the real service. For integration-style confidence that the real service integration actually works, many teams use a small number of tests against the provider's official sandbox/test-mode environment (e.g., Stripe's test mode) rather than mocking everything, since mocks can drift from the real API's actual behavior over time.",
    idealInterviewAnswer:
      "For [external dependency, e.g. 'the payment gateway'], I didn't want my tests to actually hit the real service — that would be slow, could cost money, and would make my test suite fail if their service happened to be down, which isn't a bug in my code. So I mocked the [service]'s client in my unit tests, controlling exactly what response it returned, which let me test how my code handles both the success case and failure cases, like a declined payment, without needing the real service to cooperate. For a bit more confidence that my integration with the real API actually works, I also [ran a small number of tests against the provider's sandbox/test mode, if applicable, or: 'manually tested against their test mode at least once before considering the integration done']. The trade-off is that a pure mock can drift from the real API's actual behavior over time, so I wouldn't rely on mocks alone for something this critical in a production system.",
    interviewerExpectations: [
      "Understanding of why external dependencies are problematic for automated tests (speed, cost, flakiness, non-determinism)",
      "Knowledge of mocking/stubbing to isolate code under test",
      "Ability to describe testing both success and failure paths of the external dependency",
      "Awareness that mocks can drift from real behavior, and some real-service testing still has value",
    ],
    followUpQuestions: [
      "What's the difference between a mock and a stub?",
      "How would you test what happens if the payment gateway times out?",
      "Have you heard of contract testing, and what problem does it solve?",
      "Would you ever let a test hit the real external service, and under what conditions?",
    ],
    commonMistakes: [
      "Saying tests just call the real external service directly with no isolation",
      "Not knowing what mocking is or why it's useful",
      "Only testing the happy path and never testing how the code handles the external service failing",
      "Believing mocks are a perfect substitute for real integration testing with no caveats",
    ],
    keyDiscussionPoints: [
      "Why external dependencies are problematic in automated tests",
      "Mocking/stubbing to isolate the code under test",
      "Testing both success and failure paths of the dependency",
      "The limits of mocking and the value of some real/sandbox testing",
    ],
  },
  // ---------------- deployment ----------------
  {
    id: "deployment-1",
    categorySlug: "deployment",
    question: "How did you deploy your project, and what does that process look like?",
    difficulty: "Easy",
    detailedAnswer:
      "This checks whether the project actually left your laptop and became a real, reachable system — a meaningful signal because it means you dealt with environment differences, configuration, and real infrastructure, not just local development. A complete answer names where each piece lives: the frontend (often a static host/CDN like Vercel, Netlify, or GitHub Pages, since static assets don't need a server), the backend (a platform like Render, Railway, Heroku, or a cloud VM/container service), and the database (often a managed database service rather than self-hosted, since managing your own database server adds operational burden you don't need as a student). It should also mention environment variables/secrets management (never committing API keys or database URLs to source control) and how configuration differs between local development and production. Bonus points for mentioning a custom domain, HTTPS, or basic uptime — small details that show the deployment was treated as a real, finished part of the project rather than an afterthought.",
    idealInterviewAnswer:
      "I deployed the frontend to [platform, e.g. 'Vercel'] since it's a static React build and doesn't need a persistent server — it deploys automatically from my main branch. The backend runs on [platform, e.g. 'Render/Railway'], and the database is a managed [database] instance on [provider] rather than something I host myself, mainly because I didn't want to deal with backups and server maintenance on top of everything else. Configuration like the database URL and API keys are stored as environment variables on the hosting platform, not committed to the repo — I keep a `.env.example` file in the repo so it's clear what variables are needed without exposing the actual secrets. One gap in my current setup is [honest gap, e.g. 'I don't have a staging environment, so I test changes locally before pushing straight to production'], which I know isn't ideal for a real production system.",
    interviewerExpectations: [
      "Clear separation of where each component (frontend, backend, database) actually runs",
      "Correct handling of secrets/environment variables — never committed to source control",
      "Understanding of why a managed database service is often preferable to self-hosting for a small project",
      "Honest acknowledgment of what's missing (staging environment, rollback strategy, etc.)",
    ],
    followUpQuestions: [
      "How do you handle different environment variables between local development and production?",
      "What would happen if you pushed a broken change directly to your deployed backend?",
      "How would you roll back a bad deployment?",
      "Why did you choose a managed database instead of hosting your own?",
    ],
    commonMistakes: [
      "Saying the project 'just runs locally' when the question assumes a real deployment",
      "Admitting API keys or secrets were committed directly into the repository",
      "Not knowing which platform actually hosts which part of the application",
      "No mention of how environment-specific configuration is handled",
    ],
    keyDiscussionPoints: [
      "Where each component (frontend, backend, database) is actually hosted",
      "Secrets and environment variable management",
      "Why a managed service was chosen over self-hosting, where applicable",
      "Honest gaps like missing staging environments or rollback plans",
    ],
  },
  {
    id: "deployment-2",
    categorySlug: "deployment",
    question: "What is the difference between blue-green deployment and rolling deployment, and would either make sense for your project?",
    difficulty: "Hard",
    detailedAnswer:
      "This is a more advanced deployment-strategy question, usually asked to see if the candidate has thought beyond 'push to main and it redeploys.' Rolling deployment replaces instances of the old version with the new version gradually, one (or a few) at a time, so there's no full-capacity downtime, but for a brief period both old and new versions are serving traffic simultaneously, which requires the two versions to be compatible (especially with the database schema). Blue-green deployment keeps two full, identical environments — 'blue' (current live) and 'green' (new version) — and switches all traffic over at once (usually via a load balancer or DNS change) once the green environment is verified healthy, giving instant rollback by just switching back to blue if something's wrong, at the cost of running double the infrastructure during the switch. For a student project, the honest answer is usually that the hosting platform's default deploy (often closer to a simple replace, sometimes with brief downtime) is what's actually happening, but being able to explain what blue-green/rolling would add — zero-downtime and safer rollback — shows you understand the next level of maturity even if you haven't implemented it.",
    idealInterviewAnswer:
      "Rolling deployment gradually replaces old instances with new ones, so you avoid full downtime, but both versions run simultaneously for a bit, which means your database schema and API need to stay backward-compatible during that window. Blue-green deployment keeps two complete environments and switches traffic all at once after the new one's verified healthy, which gives you a near-instant rollback — just switch back — at the cost of running two full environments during the deploy. Right now, [project] deploys on [platform], which does [describe actual behavior, e.g. 'a straightforward replace, so there can be a few seconds of downtime during a deploy']. For a project at this scale, that's an acceptable trade-off given the low traffic and the cost of setting up something more sophisticated. If this were a production system with real users depending on uptime, I'd lean toward rolling deployments for cost efficiency, or blue-green if instant rollback safety mattered more than infrastructure cost.",
    interviewerExpectations: [
      "Correct, precise definitions of both rolling and blue-green deployment",
      "Understanding of the backward-compatibility requirement during rolling deploys",
      "Understanding of the cost trade-off (double infrastructure) for blue-green",
      "Honest, sensible mapping of these concepts back to what their own project's hosting actually does",
    ],
    followUpQuestions: [
      "What could go wrong if your API changes in a way that's incompatible with your database schema during a rolling deploy?",
      "How do you verify the 'green' environment is healthy before switching traffic to it?",
      "What is a canary deployment, and how does it differ from blue-green?",
      "Does your current hosting platform have any downtime during a deploy? How would you find out?",
    ],
    commonMistakes: [
      "Confusing blue-green and rolling deployment definitions",
      "Not mentioning the backward-compatibility requirement for rolling deploys",
      "Claiming their student project already uses blue-green deployment without being able to explain how",
      "Treating this as pure theory disconnected from what their actual hosting platform does",
    ],
    keyDiscussionPoints: [
      "Precise definitions of rolling vs. blue-green deployment",
      "The backward-compatibility requirement during rolling deploys",
      "The infrastructure cost trade-off of blue-green",
      "An honest mapping to what their own project's deployment actually does today",
    ],
  },

  // ---------------- ci-cd ----------------
  {
    id: "ci-cd-1",
    categorySlug: "ci-cd",
    question: "Did you set up a CI/CD pipeline for your project? Walk me through what it does.",
    difficulty: "Medium",
    detailedAnswer:
      "CI/CD questions test whether you automate quality gates and release, or rely on manually running tests and manually deploying (which doesn't scale and is error-prone). Continuous Integration (CI) means every push/PR automatically triggers a pipeline that installs dependencies, lints, type-checks, and runs tests — catching problems before they're merged, not after. Continuous Deployment/Delivery (CD) means a successful build on the main branch automatically deploys (or prepares to deploy) to production, removing manual, error-prone deploy steps. A typical student-project pipeline using GitHub Actions might: trigger on every push/PR, install dependencies, run the linter, run the test suite, run a type-check (for TypeScript), and then, only if all of that passes and the branch is main, trigger a deploy (or, on many modern host platforms like Vercel/Render, the platform's own git integration handles the deploy step automatically once the code lands on main). Being able to say what would happen if a test failed (the pipeline blocks the merge/deploy) is the detail that proves you actually understand what a 'gate' is, not just that a pipeline exists.",
    idealInterviewAnswer:
      "Yes — I set up a GitHub Actions pipeline that runs on every push and pull request. It installs dependencies, runs [linter], runs the [test suite], and runs a type-check since the project is in TypeScript. If any of those steps fail, the pipeline fails and I can see that directly on the PR before merging, which stops a broken change from ever reaching main. For deployment, [describe: 'I let the hosting platform's own git integration handle it — once code lands on main and CI is green, it auto-deploys', or 'I added a separate deploy step that only runs after tests pass']. The main value I got from this wasn't really about automation for its own sake — it was that I could no longer accidentally merge code that broke the build, since the pipeline would catch it and block the merge. If I extended this, I'd add [next step, e.g. 'a required status check so main is protected and can't be merged into without CI passing'].",
    interviewerExpectations: [
      "Clear distinction between what CI does (test/lint/build gates) and what CD does (automated deploy)",
      "Understanding that a failing pipeline step should block merge/deploy, not just log a warning",
      "A specific, real pipeline description (tool used, steps run) rather than a vague 'yes I have CI/CD'",
      "Awareness of what a next improvement would be (branch protection, required checks, etc.)",
    ],
    followUpQuestions: [
      "What happens in your pipeline if a test fails on a pull request?",
      "How long does your pipeline take to run, and would that become a problem as the test suite grows?",
      "Have you set up branch protection rules so CI is actually required before merging?",
      "What's the difference between continuous delivery and continuous deployment?",
    ],
    commonMistakes: [
      "Claiming to have CI/CD without being able to name a single actual pipeline step",
      "Not knowing what happens when a pipeline step fails",
      "Confusing CI (testing/build gates) with CD (deployment automation) as the same thing",
      "Describing manual steps (running tests locally before pushing) as if that were CI",
    ],
    keyDiscussionPoints: [
      "The distinction between CI (testing/quality gates) and CD (deployment automation)",
      "Specific, real pipeline steps actually configured",
      "What happens when a gate fails (blocks merge/deploy)",
      "A sensible next improvement to the pipeline",
    ],
  },
  {
    id: "ci-cd-2",
    categorySlug: "ci-cd",
    question: "How would you add a testing or quality gate to prevent broken code from being deployed?",
    difficulty: "Medium",
    detailedAnswer:
      "This tests whether you think about pipelines as enforcement mechanisms, not just automation conveniences. A 'gate' is a required check that must pass before code can proceed to the next stage — merge, or deploy. The layered approach worth describing: a linter catches style/obvious-bug issues fast; a type-checker (for TypeScript) catches a whole class of bugs before runtime; unit/integration tests verify actual behavior; and, for the deploy stage specifically, you can add a smoke test after deployment (a quick automated check that the live app actually responds correctly) so a 'successful' deploy that's actually broken gets caught immediately rather than by a user reporting it. Branch protection rules (requiring CI to pass, requiring at least one review, disallowing direct pushes to main) turn these checks from optional/advisory into hard requirements that literally can't be bypassed by the GitHub/GitLab UI — that's the detail that distinguishes 'I have tests' from 'I have a quality gate.'",
    idealInterviewAnswer:
      "The core idea is that a check only counts as a gate if it can actually block a merge or deploy, not just run and report a result that gets ignored. In my pipeline, [describe, e.g. 'the test and lint steps must pass for the GitHub Actions workflow to succeed'], and I'd pair that with a branch protection rule on main requiring that check to pass before a PR can even be merged — otherwise someone could just ignore a red CI run and merge anyway. On the deploy side, beyond just 'the build succeeded,' I'd add a basic smoke test right after deployment — something like hitting a health-check endpoint or the homepage and confirming it returns a 200 — so that if the deploy itself silently broke something (like a missing environment variable in production), it's caught automatically rather than by a user. Right now my project has [what's actually implemented] and is missing [honest gap].",
    interviewerExpectations: [
      "Understanding that a 'gate' must be enforced (blocking), not just informational",
      "Mention of branch protection or required status checks as the enforcement mechanism",
      "Awareness of post-deploy verification (smoke tests/health checks), not just pre-merge checks",
      "Honest mapping to what's actually implemented in their own project versus what's aspirational",
    ],
    followUpQuestions: [
      "What's a smoke test, and how would you write one for your project?",
      "How would you prevent someone from merging a PR with a failing CI check?",
      "What would you do if your test suite became slow and started blocking developers unnecessarily?",
      "How do you decide what belongs in a fast pre-merge gate versus a slower post-deploy check?",
    ],
    commonMistakes: [
      "Describing tests that run but don't actually block anything from happening",
      "Not mentioning branch protection or any enforcement mechanism at all",
      "Confusing a health check/smoke test with a full test suite",
      "Overclaiming a fully automated gate exists when it's actually a manual step",
    ],
    keyDiscussionPoints: [
      "The difference between a check that runs and a gate that actually blocks",
      "Branch protection / required status checks as the enforcement mechanism",
      "Post-deploy smoke tests or health checks as a final safety net",
      "Honest state of what's implemented vs. aspirational",
    ],
  },

  // ---------------- monitoring ----------------
  {
    id: "monitoring-1",
    categorySlug: "monitoring",
    question: "How would you know if your project went down in production right now?",
    difficulty: "Medium",
    detailedAnswer:
      "This question exposes a very common gap in student projects: zero observability, meaning the only way to find out something's broken is a user complaining or the candidate happening to check. Interviewers want to hear about at least a basic layered approach: logging (recording what happened — errors, requests — somewhere durable, not just console.log that vanishes), error tracking (a tool like Sentry that captures unhandled exceptions with stack traces and alerts you), uptime monitoring (an external service like UptimeRobot or a simple health-check endpoint polled periodically, since it checks availability from the outside, the way a real user would experience it), and metrics/dashboards for things like request latency and error rate over time. The key insight to communicate: monitoring from inside the app (logs) tells you why something broke; monitoring from outside the app (uptime checks) tells you that something broke at all, even if the whole process crashed and can't log anything about its own death.",
    idealInterviewAnswer:
      "Honestly, right now [project] has [current state — be honest, e.g. 'basic console logging on the backend, but nothing that would alert me automatically if it went down']. If someone hit a broken deploy or the server crashed, the way I'd currently find out is [current reality, e.g. 'a user telling me, or me happening to check']. What I'd add first is external uptime monitoring — something like UptimeRobot pinging a `/health` endpoint every few minutes and emailing or messaging me if it stops responding, since that tells me the app is down even if the process crashed so hard it can't log anything about its own failure. Second, I'd add an error-tracking tool like Sentry so unhandled exceptions get captured with a stack trace and I get notified, instead of silently failing or only showing up as a vague 500 error to the user. Right now I mostly rely on manually checking logs, which I know doesn't scale.",
    interviewerExpectations: [
      "Honest acknowledgment of the current (often minimal) monitoring state, not overclaiming",
      "Understanding of the difference between internal logging and external uptime monitoring",
      "Knowledge of at least one real tool category (error tracking, uptime monitoring, logging aggregation)",
      "Understanding of WHY external monitoring matters (catches full-process crashes that logs can't)",
    ],
    followUpQuestions: [
      "What's the difference between logging and monitoring?",
      "If your server crashed entirely, how would internal logging even help you find out?",
      "What would you want to be alerted about immediately versus just recorded for later review?",
      "How would you avoid alert fatigue if you added monitoring to a real production system?",
    ],
    commonMistakes: [
      "Claiming full monitoring/alerting exists when it's actually just console.log statements",
      "Not distinguishing between logging (internal, explains why) and uptime monitoring (external, detects that something is wrong)",
      "Naming no specific tool or technique at all",
      "Assuming they'd always be actively watching logs in real time, which doesn't scale",
    ],
    keyDiscussionPoints: [
      "Honest current state of observability in their own project",
      "The distinction between internal logging and external uptime monitoring",
      "At least one concrete tool or technique (Sentry, UptimeRobot, health-check endpoint)",
      "Why external, outside-in monitoring catches failures internal logging can't",
    ],
  },
  {
    id: "monitoring-2",
    categorySlug: "monitoring",
    question: "What metrics would you track to understand the health of your application?",
    difficulty: "Medium",
    detailedAnswer:
      "This tests whether the candidate knows what 'health' actually means quantitatively, beyond 'it's up or it's down.' A well-known framework worth referencing is the RED method for services: Rate (how many requests per second is the system handling), Errors (what fraction of those requests are failing), and Duration (how long requests take, ideally tracked as percentiles like p50/p95/p99 rather than just an average, since averages hide the fact that some meaningful fraction of users might be having a much worse experience). For a database specifically, connection pool usage and slow-query counts matter. For business-relevant health beyond pure infra, things like daily active users or signup conversion can matter too, though those are product metrics rather than system-health metrics. The key subtlety worth mentioning: percentiles matter more than averages, because a p99 latency spike means 1% of your users are having a terrible experience even while the average looks fine — averages can hide real problems.",
    idealInterviewAnswer:
      "I'd track request rate, error rate, and response time — the standard three signals for any service. For response time specifically, I'd want percentiles like p95 or p99, not just the average, because an average can look perfectly healthy while a meaningful chunk of users are actually having a slow experience — a few very slow outlier requests get smoothed out by a lot of fast ones in an average. Error rate matters as a percentage of total requests, not just a raw count, since a raw count doesn't tell you if things are getting worse relative to traffic. For [project] specifically, I'd also want to track [something domain-relevant, e.g. 'database query time separately from total request time, since that's usually where the bottleneck actually is']. Right now I don't have this instrumented at all — the honest next step would be adding basic request timing middleware and logging that data somewhere queryable.",
    interviewerExpectations: [
      "Mention of rate, errors, and duration (or equivalent) as the core health signals",
      "Understanding that percentiles (p95/p99) reveal problems that averages hide",
      "Ability to tie a metric back to something specific and relevant in their own project",
      "Honest acknowledgment of current instrumentation gaps",
    ],
    followUpQuestions: [
      "Why would you look at p99 latency instead of just the average?",
      "How would you track these metrics in practice — what tool or approach would you use?",
      "What would a sudden spike in error rate but stable request rate suggest to you?",
      "How would you decide what threshold should trigger an alert versus just being logged?",
    ],
    commonMistakes: [
      "Only mentioning uptime/downtime with no quantitative metrics at all",
      "Not knowing what a percentile is or why it matters over an average",
      "Naming metrics with no connection to how they'd actually be measured or used",
      "Confusing business metrics (signups, revenue) with system health metrics when the question is about application health",
    ],
    keyDiscussionPoints: [
      "Rate, errors, duration (or equivalent) as core health signals",
      "Why percentiles matter more than averages for latency",
      "A metric tied specifically to their own project's likely bottleneck",
      "Honest current state of instrumentation",
    ],
  },

  // ---------------- database-design ----------------
  {
    id: "database-design-1",
    categorySlug: "database-design",
    question: "Why did you choose a relational database or a NoSQL database for your project?",
    difficulty: "Medium",
    detailedAnswer:
      "This tests whether the database choice was driven by the actual shape of the data and its access patterns, or by familiarity/hype. Relational databases (PostgreSQL, MySQL) enforce a schema up front, support strong consistency and multi-table transactions (ACID guarantees), and are a natural fit when your data has clear relationships that you'll query with joins — e.g., orders referencing users and products. NoSQL document stores (MongoDB) allow flexible, schema-less documents and can be a better fit when your data is naturally hierarchical/nested and doesn't have many cross-entity relationships, or when the schema is expected to change frequently and rapidly during early development. The honest, nuanced answer most interviewers respect: for most CRUD-style student projects with clearly related entities (users, posts, orders), a relational database is usually the better technical fit, and MongoDB is often chosen instead simply because it's perceived as easier to start with — which is a legitimate reason to admit, but you should also be able to say what you'd give up (transactional guarantees across related documents, join-based queries) by making that choice.",
    idealInterviewAnswer:
      "I chose [your database] because my data was [describe shape, e.g. 'clearly relational — users have many orders, and orders reference specific products, and I needed to query across those relationships often']. That made [relational DB] a natural fit, since I get joins and transactional guarantees for free, which mattered for [specific case, e.g. 'making sure an order and its line items are created atomically']. If my data had instead been more like independent, self-contained documents with few cross-references — [example, e.g. 'a collection of user-generated posts with embedded comments'] — I probably would have leaned toward a document store like MongoDB instead, since forcing that into a rigid relational schema wouldn't have bought me much. I did consider [the alternative] but decided the join/consistency guarantees mattered more for my use case than schema flexibility.",
    interviewerExpectations: [
      "Reasoning grounded in the actual shape and relationships of the project's data",
      "Understanding of what relational databases give you (joins, ACID transactions, enforced schema)",
      "Understanding of what document stores give you (flexible schema, natural fit for nested/hierarchical data)",
      "Ability to name a scenario where the opposite choice would have been more appropriate",
    ],
    followUpQuestions: [
      "What is an ACID transaction, and where in your project would that guarantee actually matter?",
      "How would you model a many-to-many relationship in a document database?",
      "What would you lose if you migrated this project to the other type of database?",
      "Have you ever needed a transaction that spans multiple documents or tables in your project?",
    ],
    commonMistakes: [
      "Choosing a database purely because 'it's what the tutorial used' with no independent reasoning",
      "Not understanding what ACID transactions actually guarantee",
      "Claiming NoSQL is simply 'more scalable' than relational databases as an unqualified, generic statement",
      "Being unable to describe a scenario where the opposite database type would fit better",
    ],
    keyDiscussionPoints: [
      "Reasoning grounded in the actual relationships and shape of the project's data",
      "What relational databases provide (joins, ACID transactions, schema enforcement)",
      "What document databases provide (schema flexibility, natural fit for nested data)",
      "A scenario where the opposite choice would have been better",
    ],
  },
  {
    id: "database-design-2",
    categorySlug: "database-design",
    question: "How did you decide which columns or fields to index in your database?",
    difficulty: "Medium",
    detailedAnswer:
      "Indexing questions test whether the candidate understands indexes as a deliberate, query-driven decision rather than something added blindly to 'make things faster.' The core mental model: an index speeds up reads that filter, sort, or join on a given column (turning an O(n) full table scan into something closer to O(log n)), but it isn't free — every index adds overhead to writes (inserts/updates/deletes must also update the index) and consumes additional storage. So the right process is to look at your actual, frequent query patterns — the WHERE, JOIN, and ORDER BY clauses that run often — and index those columns specifically, not every column 'just in case.' A concrete example: in a blog platform, if you frequently query posts by `userId` (to show a user's posts) or filter by `status = 'published'`, those are strong index candidates; indexing a rarely-queried column like `updatedAt` when nothing filters or sorts by it is wasted overhead. Foreign key columns are almost always good index candidates since they're joined on frequently.",
    idealInterviewAnswer:
      "I indexed columns based on how they were actually queried, not just proactively indexing everything. For example, I added an index on [column, e.g. 'userId on the posts table'] because fetching 'all posts by a given user' was one of the most frequent queries in the app, and without an index that would be a full table scan as the table grew. I also indexed [another column, e.g. foreign keys generally], since those get joined on constantly. I was careful not to over-index, though — every index adds write overhead and storage, so I didn't add one on columns like [rarely filtered column] that are barely ever part of a WHERE or ORDER BY clause. If I noticed a specific slow query in the future, my process would be to run EXPLAIN on it, see whether it's doing a sequential scan, and only then decide whether a new index is actually justified.",
    interviewerExpectations: [
      "Understanding that indexes speed up reads (filter/sort/join) at the cost of write overhead and storage",
      "A query-pattern-driven approach, not indexing every column indiscriminately",
      "Mention of foreign keys as natural index candidates",
      "Familiarity with using EXPLAIN or a similar tool to verify whether an index is actually needed",
    ],
    followUpQuestions: [
      "What's the write-side cost of adding an index?",
      "How would you check whether a query is actually using an index or doing a full table scan?",
      "What is a composite index, and when would you use one over two separate indexes?",
      "Would you index a boolean column like `isActive`? Why or why not?",
    ],
    commonMistakes: [
      "Believing indexes are free and should be added to every column",
      "Not knowing that indexes slow down writes, only that they speed up reads",
      "Being unable to name a single specific column they indexed and why",
      "Not knowing any tool (like EXPLAIN) to verify whether an index is actually being used",
    ],
    keyDiscussionPoints: [
      "Indexes speed up reads but add write and storage overhead",
      "A query-pattern-driven approach to choosing which columns to index",
      "Foreign keys as natural index candidates",
      "Using EXPLAIN or similar tooling to verify index usage",
    ],
  },

  // ---------------- api-design ----------------
  {
    id: "api-design-1",
    categorySlug: "api-design",
    question: "How did you design the API for your project, and why does its structure make sense?",
    difficulty: "Medium",
    detailedAnswer:
      "This checks whether the candidate designed the API intentionally around resources and consistent conventions, or just added ad-hoc endpoints as features were built. For a REST API, the standard mental model is resource-oriented URLs (`/posts`, `/posts/:id/comments`) combined with HTTP methods conveying intent (GET for reads, POST for creation, PUT/PATCH for updates, DELETE for removal), consistent response shapes (so the frontend doesn't need special-case parsing per endpoint), and meaningful HTTP status codes (200 for success, 201 for created, 400 for bad input, 401/403 for auth issues, 404 for not found, 500 for server errors) rather than always returning 200 with an error message buried in the body. Versioning (`/api/v1/...`) is worth mentioning if the API might evolve in breaking ways. A strong answer also discusses pagination for list endpoints (never returning an unbounded list) and how errors are communicated consistently, e.g., a standard `{ error: { message, code } }` shape across all failure responses.",
    idealInterviewAnswer:
      "I designed the API around resources rather than actions — so instead of an endpoint like `/getUserPosts`, I have `GET /users/:id/posts`, and creating a post is `POST /posts`, following REST conventions where the HTTP verb conveys the intent. I kept response shapes consistent — every successful response returns [describe shape], and every error returns [describe shape, e.g. 'a consistent { error: { message } } object'], so the frontend doesn't need custom parsing logic per endpoint. For list endpoints like fetching posts, I added pagination with [limit/offset or cursor-based pagination] instead of returning every row at once, since that would get slow and heavy as data grew. I used proper status codes too — a 404 when a resource doesn't exist, a 401 when the request isn't authenticated, rather than always returning 200 with an error message in the body, which makes debugging and client-side error handling much easier.",
    interviewerExpectations: [
      "Resource-oriented URL design with HTTP methods conveying intent",
      "Consistent response and error shapes across endpoints",
      "Correct, meaningful use of HTTP status codes",
      "Pagination on list endpoints rather than unbounded responses",
    ],
    followUpQuestions: [
      "How does your frontend know whether a request succeeded or failed?",
      "Why did you use PATCH instead of PUT (or vice versa) for updates?",
      "How would you version this API if you needed to make a breaking change?",
      "How does pagination work in your list endpoints — offset-based or cursor-based, and why?",
    ],
    commonMistakes: [
      "Using verbs in URLs (`/getUser`, `/createPost`) instead of resource-oriented nouns",
      "Always returning HTTP 200 even on errors, with error details buried in the response body",
      "No pagination on endpoints that return lists, risking unbounded response sizes",
      "Inconsistent response shapes across different endpoints, forcing special-case frontend parsing",
    ],
    keyDiscussionPoints: [
      "Resource-oriented URLs with HTTP methods conveying intent",
      "Consistent response and error shapes",
      "Correct use of HTTP status codes",
      "Pagination on list endpoints",
    ],
  },
  {
    id: "api-design-2",
    categorySlug: "api-design",
    question: "How would you handle a breaking change to your API without disrupting existing clients?",
    difficulty: "Hard",
    detailedAnswer:
      "This question tests whether the candidate thinks about an API as a contract with consumers, not just an internal implementation detail that can change freely. Even for a student project, the reasoning is directly transferable: if a mobile app and a web frontend both depend on the same API, changing a response field's name or type breaks the client that wasn't updated in lockstep. The standard solutions: versioning the API (`/api/v1/` vs `/api/v2/`, or a version header) so old clients keep hitting the old contract while new clients opt into the new one; additive-only changes when possible (adding a new field is safe, removing or renaming an existing field is not); and a deprecation window (announcing that a field/endpoint will be removed, giving clients time to migrate, then removing it later) rather than breaking things instantly. A strong answer distinguishes between a genuinely breaking change (removing/renaming a field, changing a field's type or meaning) and a non-breaking, additive change (adding a new optional field), since only the former needs this careful handling.",
    idealInterviewAnswer:
      "First, I'd figure out if the change is actually breaking — adding a new optional field is safe and doesn't need special handling, but renaming or removing an existing field, or changing what a field means, would break any client still expecting the old shape. For a genuinely breaking change, I'd version the API — either a URL prefix like `/api/v2/` or a version header — so existing clients keep talking to the old version unchanged while new or updated clients use the new one. I'd also want a deprecation period: keep the old version running and clearly communicate a removal timeline, rather than deleting it the moment the new version ships. In my project specifically, [describe current reality, e.g. 'I don't have formal versioning set up since there's only one client I control, but if I added a mobile app that couldn't always update in lockstep with the backend, this is exactly the kind of problem I'd need to solve'].",
    interviewerExpectations: [
      "Distinguishing between breaking and non-breaking (additive) API changes",
      "Knowledge of versioning strategies (URL versioning, header versioning)",
      "Understanding of deprecation periods rather than instant removal",
      "Honest, sensible mapping to whether this actually matters yet for their own project",
    ],
    followUpQuestions: [
      "What's the difference between versioning via the URL path and versioning via a header?",
      "How would you communicate a deprecation to API consumers in practice?",
      "Is adding a new required field to a request body a breaking change? Why?",
      "How long would you keep an old API version running before removing it?",
    ],
    commonMistakes: [
      "Not distinguishing between a breaking change and a safe, additive change",
      "Suggesting the fix is simply 'tell all the clients to update' with no versioning strategy",
      "Not knowing any concrete versioning mechanism",
      "Overcomplicating the answer for a project that genuinely has only one client and doesn't need this yet, without acknowledging that context",
    ],
    keyDiscussionPoints: [
      "Breaking vs. non-breaking (additive) API changes",
      "Versioning strategies (URL path, header)",
      "Deprecation periods rather than instant removal",
      "Honest context about whether this problem actually applies to their project yet",
    ],
  },

  // ---------------- caching ----------------
  {
    id: "caching-1",
    categorySlug: "caching",
    question: "Where would you introduce caching in your project, and how would you keep the cache correct?",
    difficulty: "Hard",
    detailedAnswer:
      "Caching questions test both where to cache (identifying data that's read often and changes rarely, since that's the sweet spot where caching pays off) and, more importantly, the harder half of the problem: cache invalidation — keeping cached data from silently going stale. The three classic write strategies worth naming: write-through (write to cache and database together, synchronously — always consistent, but every write pays the cost of updating both), write-back/write-behind (write to cache immediately, asynchronously flush to the database later — fast writes, but risk of data loss if the cache dies before flushing), and cache-aside/lazy-loading (application checks cache first, falls through to the database and populates the cache on a miss — simple and common, but the first request after a miss is always slow, and stale data can persist until it expires). TTLs (time-to-live) bound how long stale data can persist even if you forget to explicitly invalidate. A subtler, more advanced concept worth mentioning if pushed further: cache stampede — when a popular cached key expires and a huge burst of concurrent requests all miss the cache at once and hammer the database simultaneously, which can be mitigated with locking or staggered/jittered expiry.",
    idealInterviewAnswer:
      "I'd cache [specific example, e.g. 'a list of trending or popular items on the homepage'], because it's read very frequently but doesn't need to be perfectly up-to-the-second accurate. I'd use a cache-aside pattern: check [Redis/in-memory cache] first, and on a miss, fetch from the database and populate the cache for next time. To keep it from going stale, I'd set a TTL — say [duration], since some staleness is acceptable for this particular data — and I'd also explicitly invalidate the cache key whenever the underlying data changes through my own write path, like [example, e.g. 'clearing the cache entry when a new item is created'], rather than relying purely on the TTL to eventually catch up. I'd avoid caching something like [example of bad candidate, e.g. 'a user's current cart total'], since correctness matters more than speed there and staleness could actually mislead the user.",
    interviewerExpectations: [
      "Identification of specific, well-chosen data to cache (read-heavy, write-light, tolerant of some staleness)",
      "A named caching strategy (cache-aside, write-through, or write-back) and understanding of its trade-offs",
      "A concrete invalidation approach — TTL and/or explicit invalidation on write, not just 'it expires eventually'",
      "Recognition of what should NOT be cached (data where strict correctness matters more than speed)",
    ],
    followUpQuestions: [
      "What happens if two requests try to update the same cached data at the same time?",
      "What is a cache stampede, and how would you prevent one?",
      "How would you decide on the right TTL for a given piece of cached data?",
      "What's the risk of write-back caching compared to write-through?",
    ],
    commonMistakes: [
      "Saying 'I'd add caching everywhere to make it faster' with no discussion of invalidation at all",
      "Not knowing the difference between cache-aside, write-through, and write-back",
      "Suggesting caching data that genuinely requires strict, real-time correctness",
      "Treating a TTL alone as a complete invalidation strategy without considering explicit invalidation on write",
    ],
    keyDiscussionPoints: [
      "Specific, well-reasoned choice of what to cache",
      "A named caching strategy and its trade-offs",
      "A concrete invalidation approach (TTL and/or explicit invalidation)",
      "Awareness of what shouldn't be cached",
    ],
  },
  {
    id: "caching-2",
    categorySlug: "caching",
    question: "What's the difference between client-side caching, CDN caching, and server-side/database caching, and which did you use?",
    difficulty: "Medium",
    detailedAnswer:
      "This tests whether the candidate understands that 'caching' isn't one single layer but exists at multiple points in a request's journey, each solving a different problem. Client-side caching (browser cache, controlled via HTTP headers like Cache-Control and ETags) avoids the network round-trip entirely for repeat requests to the same static asset — great for JS/CSS bundles, images, fonts. CDN caching puts copies of static (or sometimes semi-dynamic) content on servers geographically close to the user, reducing latency and offloading traffic from the origin server — commonly used for static frontend assets and images. Server-side/application caching (in-memory or Redis) avoids expensive recomputation or repeated database hits for data computed or fetched inside the backend. Database-level caching/query caching sits closest to the data itself. A well-rounded answer identifies which layer(s) the project actually uses today and reasons about why a particular type of data belongs in a particular layer — e.g., a user's personalized dashboard shouldn't be CDN-cached (it's not the same for everyone), but the app's static JS bundle absolutely should be.",
    idealInterviewAnswer:
      "In [project], I used [layer(s) actually used, e.g. 'the CDN my hosting platform provides for static assets like the JS bundle and images, plus browser caching via cache headers for those same assets']. Those are a natural fit because that content is identical for every user and rarely changes, especially with content-hashed filenames — so a long cache lifetime is safe, and the browser or CDN can serve repeat visitors without even hitting my server. I [did/didn't] add server-side caching with something like Redis for [specific dynamic data], since that data is fetched from the database on every request but doesn't change often. I was careful not to CDN-cache anything personalized, like [example, e.g. 'a logged-in user's dashboard'], since that would mean one user's private or personalized data could get served to someone else, which would be both wrong and a serious privacy problem.",
    interviewerExpectations: [
      "Clear distinction between client-side, CDN, and server-side/database caching layers",
      "Correct reasoning about which layer suits which kind of data (static/shared vs. dynamic/personalized)",
      "Awareness that CDN-caching personalized data is a serious correctness and privacy bug",
      "An honest description of which layer(s) their own project actually uses",
    ],
    followUpQuestions: [
      "What HTTP headers control browser caching behavior?",
      "Why is it safe to cache a JS bundle forever if the filename includes a content hash?",
      "What would go wrong if you accidentally CDN-cached a personalized API response?",
      "How does a CDN decide when its cached copy of an asset is stale?",
    ],
    commonMistakes: [
      "Treating 'caching' as one undifferentiated concept with no distinction between layers",
      "Not knowing what a CDN actually does or why it reduces latency",
      "Suggesting personalized or private data could be CDN-cached without acknowledging the danger",
      "Being unable to say which caching layer, if any, their own project actually uses",
    ],
    keyDiscussionPoints: [
      "Clear distinction between client-side, CDN, and server-side caching",
      "Reasoning about which layer suits static/shared vs. dynamic/personalized data",
      "The danger of CDN-caching personalized or private data",
      "Honest description of what their own project actually implements",
    ],
  },

  // ---------------- challenges ----------------
  {
    id: "challenges-1",
    categorySlug: "challenges",
    question: "What was the hardest technical challenge you faced while building this project, and how did you solve it?",
    difficulty: "Medium",
    detailedAnswer:
      "This is one of the most common project-interview questions, and it's really testing your debugging process and resilience, not just the final fix. Interviewers want a structured story: what the symptom was, why it was confusing or hard (not a challenge if it was trivial to spot), the steps taken to narrow down the root cause, and what was learned. A weak answer picks a 'challenge' that was actually easy (like 'I didn't know CSS flexbox') — a strong answer picks something with real depth, like a race condition, a subtle off-by-one bug that only showed up with specific data, a state synchronization bug in a real-time feature, or a performance cliff that only appeared at a certain data size. The specific technical narrative matters far more than the topic: a good structure is 'here's the symptom, here's why my first hypothesis was wrong, here's how I actually found the real cause, here's the fix, here's what I'd do differently to catch this earlier next time.' This doubles as a strong signal of debugging methodology, which is one of the most transferable engineering skills there is.",
    idealInterviewAnswer:
      "The hardest issue I ran into was [specific technical problem, e.g. 'a race condition where two rapid requests to update the same resource could overwrite each other's changes']. It was confusing at first because it only happened intermittently and I couldn't reproduce it reliably just by testing normally. I eventually narrowed it down by [specific debugging step, e.g. 'adding detailed logging around the update path and noticing two requests with overlapping timestamps'], which told me the real problem was [root cause, e.g. 'a read-then-write pattern with no locking, so a stale read could clobber a newer write']. I fixed it by [specific fix, e.g. 'using an atomic database update instead of a separate read-then-write, or adding optimistic locking with a version column']. The bigger lesson was that intermittent bugs are almost always concurrency-related, and now I reach for that hypothesis much earlier when something is hard to reproduce.",
    interviewerExpectations: [
      "A genuinely non-trivial technical challenge, not a basic syntax/setup issue",
      "A clear debugging narrative: symptom, investigation steps, root cause, fix",
      "Specific technical detail, not a vague 'it was hard and then I fixed it'",
      "A real lesson learned that would change future behavior, not a throwaway line",
    ],
    followUpQuestions: [
      "What was your first hypothesis, and why was it wrong?",
      "How did you actually confirm the root cause before applying a fix?",
      "How would you prevent this class of bug from happening again?",
      "Did you add a test to catch this specific bug if it happened again?",
    ],
    commonMistakes: [
      "Picking a 'challenge' that was actually trivial, like learning a new syntax",
      "Skipping straight from symptom to fix with no investigation narrative in between",
      "Being unable to explain the actual root cause in technical terms",
      "No mention of any lesson learned or process change afterward",
    ],
    keyDiscussionPoints: [
      "A genuinely challenging, non-trivial technical problem",
      "A clear investigation narrative from symptom to root cause",
      "Specific technical detail about the fix",
      "A real, applied lesson learned",
    ],
  },
  {
    id: "challenges-2",
    categorySlug: "challenges",
    question: "Describe a time you had to learn a completely new technology quickly to finish your project.",
    difficulty: "Easy",
    detailedAnswer:
      "This tests learning agility, which matters enormously for freshers since almost every first job will require picking up unfamiliar tools quickly. Interviewers aren't looking for a specific technology name — they're looking for your learning process: how you scoped down the problem to what you actually needed to know (rather than trying to learn an entire framework/language exhaustively), what resources you used (official docs vs. random tutorials — official docs is generally a stronger signal since it shows you can read primary sources rather than depending on secondhand explanations), and how you validated your understanding (building a tiny throwaway example before integrating into the real project is a strong, methodical habit). A good answer also acknowledges a mistake made during that learning process, since real learning almost always includes some wrong turns, and admitting that shows honesty over a suspiciously smooth narrative.",
    idealInterviewAnswer:
      "When building [project], I needed to use [technology/concept, e.g. 'WebSockets', 'a specific cloud service', 'a new state-management library'], which I'd never worked with before. Instead of trying to learn everything about it upfront, I scoped down to exactly what I needed — [specific narrow goal, e.g. 'just enough to open a persistent connection and broadcast a message to multiple clients'] — and built a tiny, throwaway example completely separate from my actual project first, so I could experiment without breaking anything that already worked. I mainly used [official docs / a specific well-regarded resource], and ran into [an honest mistake, e.g. 'a misunderstanding about how connections were being cleaned up, which caused a memory leak in my toy example'], which actually taught me more than getting it right the first time would have. Once the small example worked the way I expected, I integrated the real pattern into my project with much more confidence.",
    interviewerExpectations: [
      "A clear, specific learning process, not just 'I read the docs and figured it out'",
      "Evidence of scoping down to what's actually needed rather than trying to learn everything",
      "Use of a small, isolated example/prototype before integrating into the real project",
      "Honesty about a mistake or wrong turn during the learning process",
    ],
    followUpQuestions: [
      "What resource did you find most useful, and why?",
      "What's something you got wrong at first when learning this?",
      "How long did it take you to get from zero knowledge to a working integration?",
      "How do you decide how deep to go when learning something new versus just getting it working?",
    ],
    commonMistakes: [
      "A vague, generic answer with no specific technology or learning process described",
      "Claiming to have mastered the technology fully rather than learning just enough to solve the problem",
      "No mention of any mistake or difficulty along the way, which reads as dishonest",
      "Not connecting the story back to a real, concrete outcome in their project",
    ],
    keyDiscussionPoints: [
      "A specific technology and a clear scoped-down learning goal",
      "The resources and process used to learn it",
      "Use of a small prototype before integrating into the real project",
      "An honest mistake made along the way and what it taught them",
    ],
  },

  // ---------------- failures-lessons ----------------
  {
    id: "failures-lessons-1",
    categorySlug: "failures-lessons",
    question: "What would you do differently if you rebuilt this project from scratch today?",
    difficulty: "Medium",
    detailedAnswer:
      "This question tests self-awareness and growth — whether you can honestly critique your own past decisions rather than defending everything you built as if it were perfect. Interviewers are somewhat suspicious of candidates who claim their project has no flaws; it usually means either the project was too simple to reveal any real trade-offs, or the candidate lacks the self-reflection to identify them. A strong answer names something specific and technical — not 'I'd use a nicer UI library' but something that reveals genuine growth in understanding, like a data model decision made too early without understanding future query patterns, or under-investing in tests/error handling, or a naive first attempt at a feature (like polling instead of WebSockets for real-time updates) that worked but wasn't the right long-term approach. The best answers connect the hindsight directly to something learned afterward — 'I didn't understand X well when I started, and now that I do, I'd approach it differently' — because that shows the reflection led to actual new knowledge, not just regret.",
    idealInterviewAnswer:
      "If I rebuilt [project] today, the biggest thing I'd change is [specific technical decision, e.g. 'how I modeled the relationship between orders and their line items — I locked in a schema early without fully thinking through how I'd query historical data, and it caused some awkward workarounds later']. At the time, I didn't yet understand [concept, e.g. 'the trade-off between normalization and query convenience'] well enough to make that call deliberately — I was mostly guessing. Now that I understand it better, I'd [concrete alternative approach]. I'd also invest more in [second honest gap, e.g. 'automated testing from the start, rather than adding it late, since retrofitting tests onto existing code was much harder than writing them alongside the feature']. I don't think this makes the original project a failure — it did what I needed it to at the time — but it's a clear example of how my understanding has grown since I built it.",
    interviewerExpectations: [
      "A specific, technical answer rather than a vague or purely cosmetic complaint",
      "Genuine self-critique that doesn't defend every original decision as correct",
      "A clear connection between the hindsight and something actually learned since then",
      "Balance — acknowledging a real flaw without dismissing the project's original value entirely",
    ],
    followUpQuestions: [
      "What made you realize this was the wrong approach — was it a specific incident?",
      "Have you actually gone back and fixed this, or is it still as-is?",
      "What would you keep exactly the same if you rebuilt it?",
      "How has this specific lesson influenced how you approach new projects now?",
    ],
    commonMistakes: [
      "Claiming the project has no flaws or nothing they'd change",
      "Naming only cosmetic changes (UI polish) instead of a real technical/architectural lesson",
      "Being unable to connect the hindsight to any specific new understanding gained afterward",
      "Being overly self-critical in a way that undermines confidence in the original work entirely",
    ],
    keyDiscussionPoints: [
      "A specific, technical (not cosmetic) change they'd make",
      "Genuine self-critique balanced with fair credit to the original decision's context",
      "A clear connection to something learned since building the project",
      "Evidence of growth in understanding, not just regret",
    ],
  },
  {
    id: "failures-lessons-2",
    categorySlug: "failures-lessons",
    question: "Tell me about a bug that made it into production (or a demo) and what you learned from it.",
    difficulty: "Medium",
    detailedAnswer:
      "This tests honesty and accountability under a mildly uncomfortable question, plus whether failures actually change future behavior. Everyone who has shipped anything has had something break at a bad moment — a demo crashing, a bug a user found, a deploy that silently broke a feature — and refusing to admit one is itself a red flag, since it suggests either dishonesty or that the person hasn't shipped enough to have hit this yet. The strongest structure: describe the failure concretely and without excessive self-flagellation, explain the root cause (was it a missing test? An edge case never considered? A rushed change with no review?), and most importantly, describe a specific process change made afterward — not just 'I was more careful,' but something concrete like 'I added a specific test for that edge case' or 'I stopped merging directly to main and started using a checklist before demos.' The process change is the part that proves real learning occurred, rather than the failure being quickly forgotten.",
    idealInterviewAnswer:
      "During [context, e.g. 'a live demo of my project'], [specific failure, e.g. 'the app crashed when a user submitted a form with an empty field, because I'd only ever tested it with valid input']. It was embarrassing in the moment, but the root cause was simple: I hadn't handled that edge case, and because I'd only manually tested happy-path scenarios, I never caught it beforehand. Afterward, I went back and added [specific fix, e.g. 'input validation on both the frontend and backend for that field'], and more importantly, I changed my process — I now [concrete process change, e.g. 'deliberately test empty/invalid input for every form before considering a feature done, and keep a short pre-demo checklist so I don't rely purely on memory']. It was a useful failure in the sense that it made me take edge-case testing much more seriously than I had been, and I haven't had a similar issue since.",
    interviewerExpectations: [
      "Willingness to honestly admit a real failure rather than deflecting or claiming none exist",
      "A clear, specific root cause, not just 'something broke'",
      "A concrete process or behavioral change made afterward, not just 'I was more careful'",
      "A tone that's honest and matter-of-fact rather than either defensive or excessively self-critical",
    ],
    followUpQuestions: [
      "How did you find out about the bug — did a user report it, or did you catch it yourself?",
      "How long did it take to fix once you knew the root cause?",
      "Did you add a test to make sure this specific bug can't happen again?",
      "Has the process change you made actually caught a similar issue since then?",
    ],
    commonMistakes: [
      "Claiming to have never shipped a bug, which reads as evasive or inexperienced",
      "Blaming external factors entirely with no acknowledgment of what could have been done differently",
      "No concrete process change mentioned — just a vague 'I'll be more careful next time'",
      "Excessive self-criticism that makes the interviewer question the candidate's confidence rather than their honesty",
    ],
    keyDiscussionPoints: [
      "An honest, specific account of a real failure",
      "A clear, concrete root cause",
      "A specific process or behavioral change made afterward",
      "A balanced, matter-of-fact tone",
    ],
  },
];
