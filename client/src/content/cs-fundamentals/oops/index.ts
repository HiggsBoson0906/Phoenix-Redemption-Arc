// src/content/cs-fundamentals/oops/index.ts
// Assembles every OOPs content file into one Subject object consumed by the
// cs-fundamentals pages.

import type { Subject, Topic } from "@/types";
import { oopsTopicsMeta } from "./topics";
import oopsTop40 from "./top-40";

import classesObjectsArticle from "./articles/classesObjects";
import encapsulationAbstractionArticle from "./articles/encapsulationAbstraction";
import inheritanceArticle from "./articles/inheritance";
import polymorphismArticle from "./articles/polymorphism";
import abstractClassesInterfacesArticle from "./articles/abstractClassesInterfaces";
import objectLifecycleArticle from "./articles/objectLifecycle";
import associationAggregationCompositionArticle from "./articles/associationAggregationComposition";
import solidPrinciplesArticle from "./articles/solidPrinciples";
import creationalDesignPatternsArticle from "./articles/creationalDesignPatterns";
import structuralBehavioralPatternsArticle from "./articles/structuralBehavioralPatterns";

import { classesObjectsRevisionNotes, classesObjectsOAQuestions } from "./oa/classesObjects.oa";
import { encapsulationAbstractionRevisionNotes, encapsulationAbstractionOAQuestions } from "./oa/encapsulationAbstraction.oa";
import { inheritanceRevisionNotes, inheritanceOAQuestions } from "./oa/inheritance.oa";
import { polymorphismRevisionNotes, polymorphismOAQuestions } from "./oa/polymorphism.oa";
import { abstractClassesInterfacesRevisionNotes, abstractClassesInterfacesOAQuestions } from "./oa/abstractClassesInterfaces.oa";
import { objectLifecycleRevisionNotes, objectLifecycleOAQuestions } from "./oa/objectLifecycle.oa";
import { associationAggregationCompositionRevisionNotes, associationAggregationCompositionOAQuestions } from "./oa/associationAggregationComposition.oa";
import { solidPrinciplesRevisionNotes, solidPrinciplesOAQuestions } from "./oa/solidPrinciples.oa";
import { creationalDesignPatternsRevisionNotes, creationalDesignPatternsOAQuestions } from "./oa/creationalDesignPatterns.oa";
import { structuralBehavioralPatternsRevisionNotes, structuralBehavioralPatternsOAQuestions } from "./oa/structuralBehavioralPatterns.oa";

import classesObjectsInterviewQuestions from "./interview/classesObjects.interview";
import encapsulationAbstractionInterviewQuestions from "./interview/encapsulationAbstraction.interview";
import inheritanceInterviewQuestions from "./interview/inheritance.interview";
import polymorphismInterviewQuestions from "./interview/polymorphism.interview";
import abstractClassesInterfacesInterviewQuestions from "./interview/abstractClassesInterfaces.interview";
import objectLifecycleInterviewQuestions from "./interview/objectLifecycle.interview";
import associationAggregationCompositionInterviewQuestions from "./interview/associationAggregationComposition.interview";
import solidPrinciplesInterviewQuestions from "./interview/solidPrinciples.interview";
import creationalDesignPatternsInterviewQuestions from "./interview/creationalDesignPatterns.interview";
import structuralBehavioralPatternsInterviewQuestions from "./interview/structuralBehavioralPatterns.interview";

const articlesBySlug = {
  "classes-objects": classesObjectsArticle,
  "encapsulation-abstraction": encapsulationAbstractionArticle,
  inheritance: inheritanceArticle,
  polymorphism: polymorphismArticle,
  "abstract-classes-interfaces": abstractClassesInterfacesArticle,
  "object-lifecycle": objectLifecycleArticle,
  "association-aggregation-composition": associationAggregationCompositionArticle,
  "solid-principles": solidPrinciplesArticle,
  "creational-design-patterns": creationalDesignPatternsArticle,
  "structural-behavioral-patterns": structuralBehavioralPatternsArticle,
} as const;

const oaBySlug: Record<
  string,
  { notes: typeof classesObjectsRevisionNotes; questions: typeof classesObjectsOAQuestions }
> = {
  "classes-objects": { notes: classesObjectsRevisionNotes, questions: classesObjectsOAQuestions },
  "encapsulation-abstraction": { notes: encapsulationAbstractionRevisionNotes, questions: encapsulationAbstractionOAQuestions },
  inheritance: { notes: inheritanceRevisionNotes, questions: inheritanceOAQuestions },
  polymorphism: { notes: polymorphismRevisionNotes, questions: polymorphismOAQuestions },
  "abstract-classes-interfaces": { notes: abstractClassesInterfacesRevisionNotes, questions: abstractClassesInterfacesOAQuestions },
  "object-lifecycle": { notes: objectLifecycleRevisionNotes, questions: objectLifecycleOAQuestions },
  "association-aggregation-composition": { notes: associationAggregationCompositionRevisionNotes, questions: associationAggregationCompositionOAQuestions },
  "solid-principles": { notes: solidPrinciplesRevisionNotes, questions: solidPrinciplesOAQuestions },
  "creational-design-patterns": { notes: creationalDesignPatternsRevisionNotes, questions: creationalDesignPatternsOAQuestions },
  "structural-behavioral-patterns": { notes: structuralBehavioralPatternsRevisionNotes, questions: structuralBehavioralPatternsOAQuestions },
};

const interviewBySlug: Record<string, typeof classesObjectsInterviewQuestions> = {
  "classes-objects": classesObjectsInterviewQuestions,
  "encapsulation-abstraction": encapsulationAbstractionInterviewQuestions,
  inheritance: inheritanceInterviewQuestions,
  polymorphism: polymorphismInterviewQuestions,
  "abstract-classes-interfaces": abstractClassesInterfacesInterviewQuestions,
  "object-lifecycle": objectLifecycleInterviewQuestions,
  "association-aggregation-composition": associationAggregationCompositionInterviewQuestions,
  "solid-principles": solidPrinciplesInterviewQuestions,
  "creational-design-patterns": creationalDesignPatternsInterviewQuestions,
  "structural-behavioral-patterns": structuralBehavioralPatternsInterviewQuestions,
};

const oopsTopics: Topic[] = oopsTopicsMeta.map((meta) => {
  const article = articlesBySlug[meta.slug as keyof typeof articlesBySlug];
  const oa = oaBySlug[meta.slug];
  return {
    ...meta,
    readingTimeMins: article?.readingTimeMins,
    article,
    oaRevisionNotes: oa?.notes,
    oaQuestions: oa?.questions,
    interviewQuestions: interviewBySlug[meta.slug],
  };
});

const oopsSubject: Subject = {
  slug: "oops",
  title: "Object-Oriented Programming",
  shortTitle: "OOPs",
  description:
    "Classes, encapsulation, inheritance, polymorphism, abstraction, SOLID principles, and design patterns — the design-thinking core of every SDE interview loop.",
  icon: "🧩",
  status: "live",
  topics: oopsTopics,
  top40: oopsTop40,
};

export default oopsSubject;
