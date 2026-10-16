// src/content/company-wise/registry.ts
// Single source of truth for every company-specific sheet shown on the
// Company Wise landing page and in the navbar dropdown.

import type { SheetMeta } from "@/types";

export const companySheets: SheetMeta[] = [
  {
    slug: "de-shaw",
    title: "DE Shaw OA Problems",
    description: "DSA problems curated from DE Shaw's Online Assessment rounds.",
    icon: "🏦",
    link: "/company/de-shaw",
  },
  {
    slug: "rippling",
    title: "Rippling OA & Interview Problems",
    description: "OA patterns, the story-chain DSA round, and the stateful-service/LLD family.",
    icon: "🧬",
    link: "/company/rippling",
  },
  {
    slug: "titan",
    title: "Titan (Directi–Nova) SDE-1 Problems",
    description: "Binary search on answer, shortest paths, DSU/MST and greedy+heap.",
    icon: "🪐",
    link: "/company/titan",
  },
  {
    slug: "tekion",
    title: "Tekion SDE-1 Preparation Problems",
    description: "Tree, array, stack, and design-heavy problems from the Tekion SDE-1 preparation guide.",
    icon: "🚗",
    link: "/company/tekion",
  },
];
