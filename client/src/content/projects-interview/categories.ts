// src/content/projects-interview/categories.ts

import type { ProjectInterviewCategory } from "@/types";

export const projectInterviewCategories: ProjectInterviewCategory[] = [
  {
    slug: "resume-projects",
    title: "Resume Project Discussions",
    description:
      "Learn how to walk an interviewer through any project on your resume clearly, confidently, and in the right level of detail.",
    icon: "📄",
  },
  {
    slug: "architecture",
    title: "Architecture Discussions",
    description:
      "Explain how the pieces of your project fit together and why you structured the system the way you did.",
    icon: "🏛️",
  },
  {
    slug: "design-decisions",
    title: "Design Decisions",
    description:
      "Justify the specific technical choices you made, from tech stack to data model, with sound engineering reasoning.",
    icon: "🧩",
  },
  {
    slug: "trade-offs",
    title: "Trade-offs",
    description:
      "Show that you understand every engineering decision has a cost, and articulate what you gained and gave up.",
    icon: "⚖️",
  },
  {
    slug: "scalability",
    title: "Scalability",
    description:
      "Discuss how your project would hold up under real-world load and what you'd change to scale it further.",
    icon: "📈",
  },
  {
    slug: "security",
    title: "Security",
    description:
      "Talk through how you protected user data, authenticated requests, and guarded against common vulnerabilities.",
    icon: "🔒",
  },
  {
    slug: "performance",
    title: "Performance Optimization",
    description:
      "Describe how you identified bottlenecks in your project and the concrete steps you took to speed it up.",
    icon: "⚡",
  },
  {
    slug: "testing",
    title: "Testing",
    description:
      "Explain your approach to verifying correctness, from unit tests to end-to-end coverage and edge cases.",
    icon: "🧪",
  },
  {
    slug: "deployment",
    title: "Deployment",
    description:
      "Walk through how you shipped your project to a real environment and made it accessible to users.",
    icon: "🚀",
  },
  {
    slug: "ci-cd",
    title: "CI/CD",
    description:
      "Discuss how you automated building, testing, and releasing your project so changes ship safely and quickly.",
    icon: "🔁",
  },
  {
    slug: "monitoring",
    title: "Monitoring",
    description:
      "Show how you'd know if your project broke in production and how you'd track its health over time.",
    icon: "📊",
  },
  {
    slug: "database-design",
    title: "Database Design",
    description:
      "Justify your schema, relationships, and indexing choices, and how they support the queries your app actually runs.",
    icon: "🗄️",
  },
  {
    slug: "api-design",
    title: "API Design",
    description:
      "Explain how you designed the interfaces between your frontend, backend, and any external services.",
    icon: "🔌",
  },
  {
    slug: "caching",
    title: "Caching",
    description:
      "Discuss where and how you'd cache data in your project, and how you'd keep that cache correct.",
    icon: "🧠",
  },
  {
    slug: "challenges",
    title: "Challenges Faced",
    description:
      "Turn the hardest technical problem you hit into a compelling story about how you debugged and solved it.",
    icon: "🧗",
  },
  {
    slug: "failures-lessons",
    title: "Failures and Lessons Learned",
    description:
      "Talk honestly about what went wrong in your project and what you'd genuinely do differently next time.",
    icon: "🪞",
  },
];
