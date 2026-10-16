// src/content/cs-fundamentals/oops/articles/associationAggregationComposition.ts

import type { Article } from "@/types";

const associationAggregationCompositionArticle: Article = {
  slug: "association-aggregation-composition",
  title: "Association, Aggregation & Composition",
  summary:
    "These are the three flavors of the 'has-a' relationship between objects, distinguished not by vague 'strength' but by one precise question: does the part's lifecycle depend on the whole's?",
  readingTimeMins: 8,
  beginnerExplanation:
    "Imagine three kinds of relationships in real life: a teacher and a student know each other but neither owns the other (association); a university department and its professors — the department 'has' professors, but if the department is dissolved, the professors still exist and can join another department (aggregation); and a human body and its heart — the heart is created with the body and dies with it, it cannot exist independently as part of a different body (composition). All three are 'has-a' relationships, but they differ in exactly one dimension: what happens to the part when the whole goes away.\n\nThis lifecycle question is the entire distinction. It is not about how 'close' or 'important' the relationship feels — it's a concrete, checkable fact about object lifetime that you can point to in code.",
  detailedBreakdown:
    "Association is the most general relationship: two independent objects interact or reference each other, with no ownership implied in either direction and no lifecycle coupling at all. A `Teacher` object holding a reference to `Student` objects (and vice versa) is an association — a `Student` object's existence is completely unaffected by whether any particular `Teacher` object exists, and a `Teacher` can exist with zero students. Association can be one-to-one, one-to-many, or many-to-many, and can be unidirectional (only one side holds a reference) or bidirectional (both sides reference each other).\n\nAggregation is a specialized 'has-a' association where one object (the whole) contains or is composed of references to other objects (the parts), but — this is the defining test — the parts can outlive the whole and can be shared across multiple wholes. A `Department` holding a `List<Professor>` is aggregation: if the `Department` object is deleted, the `Professor` objects are not destroyed — they exist independently and could be reassigned to a different `Department`. In code, aggregation typically looks like the container class receiving already-constructed part objects (often via constructor injection or a setter) rather than creating them itself, and it never deletes/destroys them in its own destructor.\n\nComposition is the strong form: the whole owns the part exclusively, and the part's lifecycle is bound to the whole's — when the whole is destroyed, the parts are destroyed with it, and the parts cannot be meaningfully shared with another whole. A `House` containing `Room` objects is composition: rooms are created when the house is built and demolished when the house is demolished; a `Room` object doesn't independently exist for some other `House` to reference. In C++, composition is often implemented literally by making the part a member field by value (not a pointer), so its constructor/destructor is automatically invoked alongside the containing object's; in Java, composition is a design discipline enforced by the container class instantiating the part internally (e.g., in its own constructor) and never exposing a way to hand that same part instance to another container.\n\nThe UML convention reflects this exactly: association is drawn as a plain line, aggregation as a line with an open (hollow) diamond at the whole's end, and composition as a line with a filled (solid) diamond at the whole's end — the filled diamond visually signals 'this part cannot exist without this specific whole.' A practical test to apply to any 'has-a' relationship in a design: ask 'if I delete the container object right now, does the contained object still make sense to exist independently?' If yes, and it could be shared or reused elsewhere, it's aggregation (or plain association if there's no containment at all). If no — deleting the container should delete the part too, and the part exists only in service of this one specific container — it's composition.",
  realWorldExamples:
    "A `Car` composed of an `Engine` is composition: that specific engine object is created when the car is assembled and scrapped when the car is scrapped — it isn't handed off to another car. A `Playlist` holding references to `Song` objects is aggregation: deleting a playlist doesn't delete the songs, and the same `Song` can appear in multiple playlists simultaneously. A `Customer` and an `Order` referencing each other (the order knows which customer placed it, the customer can look up their orders) is association — neither object owns or controls the other's lifecycle, they just know about each other. GUI frameworks like Java Swing show composition clearly: a `JFrame` creates and owns its `JPanel` children, and destroying the frame destroys its panels.",
  useCases: [
    "Modeling ownership hierarchies where components must not outlive their container (composition) — e.g. a document and its embedded paragraphs",
    "Modeling shared or reusable resources referenced by multiple containers (aggregation) — e.g. employees shared across projects",
    "Modeling peer relationships between independently-lifecycled objects with no containment (association) — e.g. a customer referencing a support agent",
    "Deciding constructor design: composition typically constructs its parts internally, aggregation typically receives already-built parts via dependency injection",
  ],
  advantages: [
    "Composition gives strong encapsulation and guarantees no dangling/orphaned parts, since the container manages the part's full lifecycle",
    "Aggregation enables resource sharing and reuse across multiple containers without duplicating objects",
    "Association models loosely-coupled relationships accurately without forcing artificial ownership where none exists",
    "Correctly distinguishing the three makes UML/design diagrams communicate intent precisely to other engineers",
  ],
  disadvantages: [
    "Composition can make unit testing harder, since you often can't inject a mock/fake part — the container builds its own",
    "Aggregation requires careful lifecycle management elsewhere in the system (who deletes the shared part, and when?), which can lead to leaks or premature deletion if ownership is unclear",
    "Overusing association without any real containment structure can produce a tangled web of mutual references that's hard to reason about",
    "Getting the choice wrong (e.g. modeling composition as aggregation) can lead to dangling references or premature destruction bugs",
  ],
  commonMisconceptions: [
    "\"Aggregation and composition differ only in how 'tightly coupled' the classes feel\" — the actual, checkable distinction is lifecycle dependency and shareability, not a vague notion of closeness.",
    "\"Composition just means 'has a member field'\" — in Java, holding a reference field to another object doesn't automatically mean composition; it's composition only if the container exclusively creates and owns that object's lifecycle.",
    "\"Association always means one object calls the other's methods\" — association just requires a reference/relationship to exist; it says nothing about which direction calls happen or whether calls happen at all.",
    "\"You can tell aggregation vs composition just by looking at UML without checking the code\" — the diamond notation is a shorthand for a lifecycle rule that must actually hold in the implementation; mislabeling is common when developers guess based on how 'important' the relationship looks.",
  ],
  interviewPerspective:
    "This is a favorite 'do you actually understand OOP modeling, or just syntax' question. Interviewers routinely give a code snippet (e.g., a `Car` class with an `Engine` field) and ask whether it's aggregation or composition, expecting you to answer based on who constructs the `Engine` and whether it could be shared — not a guess. Be ready to give the canonical examples (car-engine for composition, university-department-professor for aggregation) and to explain the UML diamond notation.",
  oaPerspective:
    "OA MCQs frequently present a short class snippet and ask you to classify the relationship as association/aggregation/composition based on how the part object is constructed (passed in via constructor vs. `new`'d internally) and whether the destructor/lifecycle is tied together. Expect direct 'match the UML diamond to the relationship type' questions as well.",
  keyTakeaways: [
    "Association is the general relationship: two objects reference each other with no ownership or lifecycle coupling.",
    "Aggregation is a weak has-a: the whole holds the part, but the part can outlive the whole and be shared across wholes.",
    "Composition is a strong has-a: the part's lifecycle is bound to the whole's — it's created and destroyed with the container and isn't shared.",
    "The correct test is lifecycle dependency, not subjective 'tightness' — ask 'does the part still make sense to exist if the whole is deleted right now?'",
    "UML: association is a plain line, aggregation is a hollow diamond, composition is a filled diamond, always at the whole's end.",
  ],
  summaryClosing:
    "Association, aggregation, and composition form a precise spectrum of ownership, not a fuzzy vibe — and being able to point to the exact lifecycle rule that distinguishes them (rather than reciting 'composition is stronger') is what separates someone who has memorized OOP vocabulary from someone who can actually model a real system correctly.",
  relatedTopics: ["Classes & Objects", "Encapsulation & Abstraction", "Inheritance"],
  furtherReading: [
    { label: "UML Class Diagram notation reference", note: "Covers the exact diamond notation for aggregation vs composition." },
    { label: "GoF Design Patterns — composition over inheritance", note: "Explains why favoring composition often yields more flexible designs than deep inheritance hierarchies." },
  ],
};

export default associationAggregationCompositionArticle;
