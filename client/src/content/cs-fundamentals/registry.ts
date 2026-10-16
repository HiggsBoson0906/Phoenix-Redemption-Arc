// src/content/cs-fundamentals/registry.ts
// Lists every CS-fundamentals subject. `csFundamentalsSubjects` is pure
// metadata — safe to import from anywhere (including the always-mounted
// search index) without pulling in any article/OA/interview content.
//
// Full Subject content (articles, OA banks, interview banks, Top-40) is only
// ever loaded via `getBuiltSubject`, which dynamically imports the specific
// subject module on demand. This keeps each subject in its own lazy chunk —
// visiting the OS Top-40 page never downloads Networks content and vice
// versa, and adding a 3rd/4th/5th built subject doesn't inflate a shared
// "registry" bundle the way eagerly importing every Subject object here
// would (confirmed via `npm run build` chunk output — that eager-import
// version produced a single 650KB+ chunk once two subjects were live).

import type { Subject, SubjectMeta } from "@/types";

export const csFundamentalsSubjects: SubjectMeta[] = [
  {
    slug: "os",
    title: "Operating Systems",
    shortTitle: "OS",
    description:
      "Processes, threads, scheduling, deadlocks, synchronization, memory management, and file systems — the systems-thinking core of every SDE interview loop.",
    icon: "🖥️",
    status: "live",
  },
  {
    slug: "networks",
    title: "Computer Networks",
    shortTitle: "CN",
    description:
      "OSI/TCP-IP layers, IP addressing, routing, congestion control, DNS, HTTP internals, and network security — the networking core of every SDE interview loop.",
    icon: "🌐",
    status: "live",
  },
  {
    slug: "dbms",
    title: "Database Management Systems",
    shortTitle: "DBMS",
    description:
      "ER modeling, normalization, SQL, transactions, concurrency control, indexing, query optimization, recovery, and NoSQL — the data layer core of every SDE interview loop.",
    icon: "🗄️",
    status: "live",
  },
  {
    slug: "oops",
    title: "Object-Oriented Programming",
    shortTitle: "OOPs",
    description:
      "Classes, encapsulation, inheritance, polymorphism, abstraction, SOLID principles, and design patterns — the design-thinking core of every SDE interview loop.",
    icon: "🧩",
    status: "live",
  },
  {
    slug: "coa",
    title: "Computer Organization & Architecture",
    shortTitle: "COA",
    description: "CPU design, memory hierarchy, cache, pipelining, and instruction cycles.",
    icon: "⚙️",
    status: "coming-soon",
  },
  {
    slug: "compiler-design",
    title: "Compiler Design",
    shortTitle: "Compilers",
    description: "Lexical analysis, parsing, semantic analysis, code generation, and optimization phases.",
    icon: "🔧",
    status: "coming-soon",
  },
];

/** Dynamic import loaders — one per built subject, each its own lazy chunk. */
const builtSubjectLoaders: Record<string, () => Promise<{ default: Subject }>> = {
  os: () => import("./os"),
  networks: () => import("./networks"),
  dbms: () => import("./dbms"),
  oops: () => import("./oops"),
};

export async function getBuiltSubject(slug: string): Promise<Subject | undefined> {
  const loader = builtSubjectLoaders[slug];
  if (!loader) return undefined;
  const mod = await loader();
  return mod.default;
}
