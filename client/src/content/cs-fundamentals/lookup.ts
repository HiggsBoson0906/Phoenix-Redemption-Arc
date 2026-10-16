// src/content/cs-fundamentals/lookup.ts

import { getBuiltSubject } from "./registry";

export async function findTopic(subjectSlug: string | undefined, topicSlug: string | undefined) {
  if (!subjectSlug || !topicSlug) return null;
  const subject = await getBuiltSubject(subjectSlug);
  if (!subject) return null;
  const topic = subject.topics.find((t) => t.slug === topicSlug);
  if (!topic) return null;
  return { subject, topic };
}
