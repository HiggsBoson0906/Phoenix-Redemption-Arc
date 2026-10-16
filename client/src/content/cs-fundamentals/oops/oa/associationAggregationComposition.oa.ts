// src/content/cs-fundamentals/oops/oa/associationAggregationComposition.oa.ts

import type { OAQuestion, OARevisionNotes } from "@/types";

export const associationAggregationCompositionRevisionNotes: OARevisionNotes = {
  quickRevision: [
    "Association: general 'knows-a' relationship, no ownership, no lifecycle coupling.",
    "Aggregation: weak 'has-a' — whole holds parts, but parts can outlive the whole and be shared.",
    "Composition: strong 'has-a' — part's lifecycle is bound to the whole; destroyed together, not shared.",
    "The deciding test: if the whole is deleted, does the part still make sense to exist independently?",
    "UML: association = plain line, aggregation = hollow diamond, composition = filled diamond (diamond always at the 'whole' end).",
  ],
  importantFacts: [
    "Classic composition example: Car has-a Engine (engine destroyed with car). Classic aggregation example: Department has-a Professor (professor survives department deletion).",
    "In code, composition usually means the container class instantiates the part internally (e.g. in its own constructor); aggregation usually means the part is passed in from outside (constructor injection/setter).",
    "A single part object being referenced by multiple different container instances simultaneously is only possible under aggregation or association, never composition.",
  ],
  memoryTricks: [
    "'Hollow diamond, hollow promise' — aggregation's hollow diamond means no firm lifecycle promise between part and whole.",
    "'Filled diamond, filled grave' — composition's filled diamond means the part is buried (destroyed) with the whole.",
  ],
};

export const associationAggregationCompositionOAQuestions: OAQuestion[] = [
  {
    id: "association-aggregation-composition-oa-1",
    question: "What is the single defining difference between aggregation and composition?",
    options: [
      "Aggregation uses inheritance, composition doesn't",
      "Whether the part's lifecycle is bound to the whole's (composition) or independent of it (aggregation)",
      "Composition only applies to primitive types",
      "Aggregation always implies a one-to-one relationship",
    ],
    correctAnswerIndex: 1,
    explanation: "The lifecycle dependency is the concrete, checkable distinction — not vague 'strength' of relationship.",
    difficulty: "Easy",
    topicTags: ["aggregation vs composition"],
  },
  {
    id: "association-aggregation-composition-oa-2",
    question:
      "class Engine {};\nclass Car {\n  Engine engine; // member by value, constructed inside Car's constructor\n public:\n  Car() : engine() {}\n};\nWhat relationship does Car have with Engine?",
    options: ["Association", "Aggregation", "Composition", "Inheritance"],
    correctAnswerIndex: 2,
    explanation: "Engine is constructed by Car itself, held by value, and destroyed automatically when Car is destroyed — the defining signature of composition.",
    difficulty: "Medium",
    topicTags: ["composition", "code identification"],
  },
  {
    id: "association-aggregation-composition-oa-3",
    question:
      "class Professor {};\nclass Department {\n  List<Professor> professors;\n public:\n  Department(List<Professor> existingProfessors) { professors = existingProfessors; }\n};\nWhat relationship does Department have with Professor?",
    options: ["Composition", "Aggregation", "Inheritance", "Polymorphism"],
    correctAnswerIndex: 1,
    explanation: "Professor objects are constructed elsewhere and passed in, meaning they can outlive the Department and be shared — this is aggregation.",
    difficulty: "Medium",
    topicTags: ["aggregation", "code identification"],
  },
  {
    id: "association-aggregation-composition-oa-4",
    question: "In UML class diagrams, which diamond represents composition?",
    options: ["Hollow (open) diamond", "Filled (solid) diamond", "No diamond, just an arrow", "A dashed line"],
    correctAnswerIndex: 1,
    explanation: "A filled diamond at the 'whole' end denotes composition — the strong, lifecycle-bound has-a relationship.",
    difficulty: "Easy",
    topicTags: ["UML notation"],
  },
  {
    id: "association-aggregation-composition-oa-5",
    question: "A Customer class and an Order class each hold a reference to the other, but neither creates, owns, or destroys the other. What relationship is this?",
    options: ["Composition", "Aggregation", "Association", "Aggregation and composition both"],
    correctAnswerIndex: 2,
    explanation: "With no ownership or lifecycle coupling in either direction, this is a plain association (bidirectional in this case).",
    difficulty: "Easy",
    topicTags: ["association"],
  },
  {
    id: "association-aggregation-composition-oa-6",
    question: "Can the same part object be legitimately referenced by two different 'whole' objects at the same time under composition?",
    options: [
      "Yes, that's the point of composition",
      "No — composition implies exclusive ownership, so sharing a part across two wholes violates the composition contract",
      "Yes, but only in Java",
      "Only if the part is immutable",
    ],
    correctAnswerIndex: 1,
    explanation: "Composition means exclusive ownership; a part shared across multiple wholes is, by definition, not composition (it would be aggregation or association instead).",
    difficulty: "Medium",
    topicTags: ["composition", "ownership"],
  },
  {
    id: "association-aggregation-composition-oa-7",
    question: "A Playlist class stores a List<Song>, where Song objects are created independently (e.g. by a music library) and can appear in multiple playlists. This is:",
    options: ["Composition", "Aggregation", "Inheritance", "Encapsulation"],
    correctAnswerIndex: 1,
    explanation: "Songs outlive any given playlist and can be shared across playlists — this is the textbook definition of aggregation.",
    difficulty: "Easy",
    topicTags: ["aggregation"],
  },
  {
    id: "association-aggregation-composition-oa-8",
    question: "Which of the following is true about all three: association, aggregation, and composition?",
    options: [
      "They all require inheritance",
      "They are all forms of a 'has-a' or 'knows-a' relationship between two distinct objects",
      "They all imply the part cannot be shared",
      "They all require the diamond notation in UML",
    ],
    correctAnswerIndex: 1,
    explanation: "All three describe relationships between separate objects; they differ only in ownership/lifecycle coupling, not in whether a relationship exists.",
    difficulty: "Medium",
    topicTags: ["association", "aggregation", "composition"],
  },
  {
    id: "association-aggregation-composition-oa-9",
    question: "If deleting object A automatically and necessarily destroys object B (which cannot exist meaningfully elsewhere), what is B's relationship to A?",
    options: ["B is associated with A", "B is aggregated by A", "B is composed within A (composition)", "B inherits from A"],
    correctAnswerIndex: 2,
    explanation: "Automatic, necessary destruction of the part alongside the whole, with no independent existence, is the definition of composition.",
    difficulty: "Easy",
    topicTags: ["composition"],
  },
  {
    id: "association-aggregation-composition-oa-10",
    question:
      "class House {\n  Room* rooms[10];\n public:\n  House() { for (int i = 0; i < 10; i++) rooms[i] = new Room(); }\n  ~House() { for (int i = 0; i < 10; i++) delete rooms[i]; }\n};\nWhat relationship does House have with Room?",
    options: ["Aggregation, since Room is stored as a pointer", "Composition, since House creates and destroys every Room it owns", "Association only", "Undefined — pointers always imply aggregation"],
    correctAnswerIndex: 1,
    explanation: "Using pointers doesn't automatically mean aggregation — what matters is that House both allocates (new) and deallocates (delete) every Room, meaning Rooms cannot outlive or be shared outside this House. That's composition.",
    difficulty: "Hard",
    topicTags: ["composition", "pointers vs ownership"],
    companyStyle: "TCS NQT",
  },
  {
    id: "association-aggregation-composition-oa-11",
    question: "Why is 'strength of relationship' considered a weak/imprecise way to distinguish aggregation from composition in an interview answer?",
    options: [
      "Because strength is a purely syntactic property that has no bearing on design",
      "Because it's subjective and doesn't give a concrete, checkable rule — lifecycle dependency and shareability are the actual testable criteria",
      "Because aggregation is always stronger than composition",
      "Because strength only applies to inheritance, not to has-a relationships",
    ],
    correctAnswerIndex: 1,
    explanation: "Interviewers want the concrete lifecycle test, not a vague adjective — 'strength' alone doesn't tell you which relationship you're looking at.",
    difficulty: "Medium",
    topicTags: ["interview reasoning"],
  },
  {
    id: "association-aggregation-composition-oa-12",
    question: "Which relationship allows the fewest constraints between the two participating objects?",
    options: ["Composition", "Aggregation", "Association", "All three are equally constrained"],
    correctAnswerIndex: 2,
    explanation: "Association is the most general and least constrained relationship — no ownership, no lifecycle coupling, just a reference between independent objects.",
    difficulty: "Easy",
    topicTags: ["association"],
  },
];
