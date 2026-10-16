// src/content/aptitude/registry.ts
// Single source of truth for every aptitude topic card shown on the Aptitude
// landing page. Live topics have full content modules under ./topics; the
// remaining topics are advertised here so the full information architecture
// is visible before content is written for them.

import type { AptitudeTopicMeta } from "@/types";

export const aptitudeTopicsRegistry: AptitudeTopicMeta[] = [
  // Live
  { slug: "percentage", title: "Percentage", status: "live", icon: "📊" },
  { slug: "profit-and-loss", title: "Profit & Loss", status: "live", icon: "💰" },
  { slug: "time-and-work", title: "Time & Work", status: "live", icon: "⏱️" },
  { slug: "number-system", title: "Number System", status: "live", icon: "🔢" },

  // Coming soon
  { slug: "ratio-and-proportion", title: "Ratio & Proportion", status: "coming-soon", icon: "⚖️" },
  { slug: "average", title: "Average", status: "coming-soon", icon: "➗" },
  { slug: "time-speed-distance", title: "Time, Speed & Distance", status: "coming-soon", icon: "🚗" },
  { slug: "partnership", title: "Partnership", status: "coming-soon", icon: "🤝" },
  { slug: "ages", title: "Ages", status: "coming-soon", icon: "🎂" },
  { slug: "mixture-and-alligation", title: "Mixture & Alligation", status: "coming-soon", icon: "🧪" },
  { slug: "boats-and-streams", title: "Boats & Streams", status: "coming-soon", icon: "🚤" },
  { slug: "pipes-and-cisterns", title: "Pipes & Cisterns", status: "coming-soon", icon: "🚰" },
  { slug: "hcf-and-lcm", title: "HCF & LCM", status: "coming-soon", icon: "🔣" },
  { slug: "simple-interest", title: "Simple Interest", status: "coming-soon", icon: "🏦" },
  { slug: "compound-interest", title: "Compound Interest", status: "coming-soon", icon: "📈" },
  { slug: "probability", title: "Probability", status: "coming-soon", icon: "🎲" },
  { slug: "permutation-and-combination", title: "Permutation & Combination", status: "coming-soon", icon: "🔀" },
  { slug: "data-interpretation", title: "Data Interpretation", status: "coming-soon", icon: "📉" },
  { slug: "logical-reasoning", title: "Logical Reasoning", status: "coming-soon", icon: "🧠" },
  { slug: "analytical-reasoning", title: "Analytical Reasoning", status: "coming-soon", icon: "🕵️" },
  { slug: "coding-decoding", title: "Coding-Decoding", status: "coming-soon", icon: "🔐" },
  { slug: "blood-relations", title: "Blood Relations", status: "coming-soon", icon: "👪" },
  { slug: "seating-arrangement", title: "Seating Arrangement", status: "coming-soon", icon: "🪑" },
  { slug: "puzzles", title: "Puzzles", status: "coming-soon", icon: "🧩" },
];
