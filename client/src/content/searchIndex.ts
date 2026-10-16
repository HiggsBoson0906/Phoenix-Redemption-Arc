// src/content/searchIndex.ts
// Hand-maintained, deliberately lightweight search index — titles and hrefs
// only, never full article/question bodies. This file is imported eagerly by
// GlobalSearch (rendered in the always-mounted Navbar), so pulling in a full
// content module here (e.g. the OS Subject object, which bundles 30 article/
// OA/interview files) would silently defeat route-level code splitting for
// that module. Metadata-only modules (registries, *Meta arrays) are safe to
// import directly since they don't reference article/question bodies.

import { dsaSheets } from "@/content/dsa-sheets/registry";
import { companySheets } from "@/content/company-wise/registry";
import { osTopicsMeta } from "@/content/cs-fundamentals/os/topics";
import { networksTopicsMeta } from "@/content/cs-fundamentals/networks/topics";
import { dbmsTopicsMeta } from "@/content/cs-fundamentals/dbms/topics";
import { oopsTopicsMeta } from "@/content/cs-fundamentals/oops/topics";
import { aptitudeTopicsRegistry } from "@/content/aptitude/registry";
import { behavioralCategories } from "@/content/behavioral/categories";
import { projectInterviewCategories } from "@/content/projects-interview/categories";

export interface SearchIndexEntry {
  id: string;
  title: string;
  subtitle: string;
  href: string;
}

const csFundamentalsSubjectEntries: SearchIndexEntry[] = [
  { id: "subject-os", title: "Operating Systems", subtitle: "CS Fundamentals subject", href: "/learn/os" },
  { id: "subject-networks", title: "Computer Networks", subtitle: "CS Fundamentals subject", href: "/learn/networks" },
  { id: "subject-dbms", title: "Database Management Systems", subtitle: "CS Fundamentals subject", href: "/learn/dbms" },
  { id: "subject-oops", title: "Object-Oriented Programming", subtitle: "CS Fundamentals subject", href: "/learn/oops" },
  { id: "subject-coa", title: "Computer Organization & Architecture", subtitle: "CS Fundamentals subject (coming soon)", href: "/learn/coa" },
  { id: "subject-compiler-design", title: "Compiler Design", subtitle: "CS Fundamentals subject (coming soon)", href: "/learn/compiler-design" },
];

const osTopicEntries: SearchIndexEntry[] = osTopicsMeta.map((t) => ({
  id: `os-topic-${t.slug}`,
  title: t.title,
  subtitle: "Operating Systems topic",
  href: `/learn/os/${t.slug}`,
}));

const osTop40Entry: SearchIndexEntry = {
  id: "os-top-40",
  title: "Top 40 Most Asked OS Interview Questions",
  subtitle: "Operating Systems",
  href: "/learn/os/top-40",
};

const networksTopicEntries: SearchIndexEntry[] = networksTopicsMeta.map((t) => ({
  id: `networks-topic-${t.slug}`,
  title: t.title,
  subtitle: "Computer Networks topic",
  href: `/learn/networks/${t.slug}`,
}));

const networksTop40Entry: SearchIndexEntry = {
  id: "networks-top-40",
  title: "Top 40 Most Asked Computer Networks Interview Questions",
  subtitle: "Computer Networks",
  href: "/learn/networks/top-40",
};

const dbmsTopicEntries: SearchIndexEntry[] = dbmsTopicsMeta.map((t) => ({
  id: `dbms-topic-${t.slug}`,
  title: t.title,
  subtitle: "DBMS topic",
  href: `/learn/dbms/${t.slug}`,
}));

const dbmsTop40Entry: SearchIndexEntry = {
  id: "dbms-top-40",
  title: "Top 40 Most Asked DBMS Interview Questions",
  subtitle: "Database Management Systems",
  href: "/learn/dbms/top-40",
};

const oopsTopicEntries: SearchIndexEntry[] = oopsTopicsMeta.map((t) => ({
  id: `oops-topic-${t.slug}`,
  title: t.title,
  subtitle: "OOPs topic",
  href: `/learn/oops/${t.slug}`,
}));

const oopsTop40Entry: SearchIndexEntry = {
  id: "oops-top-40",
  title: "Top 40 Most Asked OOPs Interview Questions",
  subtitle: "Object-Oriented Programming",
  href: "/learn/oops/top-40",
};

const dsaSheetEntries: SearchIndexEntry[] = dsaSheets.map((s) => ({
  id: `sheet-${s.slug}`,
  title: s.title,
  subtitle: "DSA Sheet",
  href: s.link,
}));

const companySheetEntries: SearchIndexEntry[] = companySheets.map((s) => ({
  id: `company-${s.slug}`,
  title: s.title,
  subtitle: "Company Wise sheet",
  href: s.link,
}));

const aptitudeEntries: SearchIndexEntry[] = aptitudeTopicsRegistry.map((t) => ({
  id: `aptitude-${t.slug}`,
  title: t.title,
  subtitle: t.status === "live" ? "Aptitude topic" : "Aptitude topic (coming soon)",
  href: `/aptitude/${t.slug}`,
}));

const behavioralEntries: SearchIndexEntry[] = behavioralCategories.map((c) => ({
  id: `behavioral-${c.slug}`,
  title: c.title,
  subtitle: "Behavioral / HR category",
  href: "/behavioral",
}));

const projectInterviewEntries: SearchIndexEntry[] = projectInterviewCategories.map((c) => ({
  id: `project-${c.slug}`,
  title: c.title,
  subtitle: "Project Interview category",
  href: "/projects",
}));

export const searchIndex: SearchIndexEntry[] = [
  { id: "home", title: "Home", subtitle: "PrepForge", href: "/" },
  { id: "cp", title: "CP Topics", subtitle: "All DSA sheets", href: "/cp" },
  { id: "learn", title: "CS Fundamentals", subtitle: "All subjects", href: "/learn" },
  { id: "aptitude-home", title: "Aptitude Preparation", subtitle: "All topics", href: "/aptitude" },
  { id: "puzzles-home", title: "Puzzles", subtitle: "All puzzle categories", href: "/puzzles" },
  { id: "companies-home", title: "Company Wise", subtitle: "All companies", href: "/companies" },
  ...dsaSheetEntries,
  ...companySheetEntries,
  ...csFundamentalsSubjectEntries,
  ...osTopicEntries,
  osTop40Entry,
  ...networksTopicEntries,
  networksTop40Entry,
  ...dbmsTopicEntries,
  dbmsTop40Entry,
  ...oopsTopicEntries,
  oopsTop40Entry,
  ...aptitudeEntries,
  { id: "behavioral-home", title: "Behavioral / HR Interview Prep", subtitle: "All categories", href: "/behavioral" },
  ...behavioralEntries,
  { id: "projects-home", title: "Project-Based Interview Questions", subtitle: "All categories", href: "/projects" },
  ...projectInterviewEntries,
];
