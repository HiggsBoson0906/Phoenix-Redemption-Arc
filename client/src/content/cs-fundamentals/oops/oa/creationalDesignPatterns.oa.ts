// src/content/cs-fundamentals/oops/oa/creationalDesignPatterns.oa.ts

import type { OAQuestion, OARevisionNotes } from "@/types";

export const creationalDesignPatternsRevisionNotes: OARevisionNotes = {
  quickRevision: [
    "Singleton: exactly one instance, global access point. Must be made thread-safe explicitly (double-checked locking, eager init, or holder idiom).",
    "Factory Method: one product, subclass decides concrete type via overriding.",
    "Abstract Factory: a family of related products, concrete family decided by which factory object is used.",
    "Builder: step-by-step construction of a complex object, separate from its final representation; avoids telescoping constructors.",
    "Prototype: create new objects by cloning an existing instance; must explicitly handle deep vs shallow copy.",
  ],
  importantFacts: [
    "All five are Creational patterns in the GoF classification — they deal with object creation mechanisms.",
    "Naive lazy Singleton (unsynchronized null-check-then-create) is a race condition under concurrency.",
    "Abstract Factory is often implemented internally using multiple Factory Methods, one per product in the family.",
    "Java's Cloneable/clone() is the direct language-level support for Prototype; the default clone() is a shallow copy.",
  ],
  memoryTricks: [
    "'One product, subclass picks' = Factory Method. 'Whole matching family, factory picks' = Abstract Factory.",
    "'Double-check before you build' — double-checked locking checks null twice (once outside, once inside the lock) before constructing the Singleton.",
  ],
};

export const creationalDesignPatternsOAQuestions: OAQuestion[] = [
  {
    id: "creational-design-patterns-oa-1",
    question: "Which creational pattern guarantees a class has exactly one instance with a single global access point?",
    options: ["Factory Method", "Singleton", "Builder", "Prototype"],
    correctAnswerIndex: 1,
    explanation: "Singleton restricts instantiation to exactly one object and exposes a single access point (commonly getInstance()).",
    difficulty: "Easy",
    topicTags: ["Singleton"],
  },
  {
    id: "creational-design-patterns-oa-2",
    question:
      "class Config {\n  private static Config instance;\n  static Config getInstance() {\n    if (instance == null) { instance = new Config(); }\n    return instance;\n  }\n}\nWhy is this Singleton implementation unsafe in a multi-threaded environment?",
    options: [
      "It doesn't compile",
      "Two threads can both see instance == null simultaneously and each construct a separate Config, violating the single-instance guarantee",
      "It uses too much memory",
      "It is actually completely safe as written",
    ],
    correctAnswerIndex: 1,
    explanation: "Without synchronization, two threads can race past the null check before either assigns instance, producing two separate objects.",
    difficulty: "Medium",
    topicTags: ["Singleton", "thread safety"],
  },
  {
    id: "creational-design-patterns-oa-3",
    question: "What technique correctly fixes the race condition in a lazily-initialized Singleton while avoiding locking on every call?",
    options: [
      "Removing the null check entirely",
      "Double-checked locking with a volatile instance field",
      "Making getInstance() private",
      "Using a non-static instance field",
    ],
    correctAnswerIndex: 1,
    explanation: "Double-checked locking checks null, synchronizes only if null, checks null again inside the lock, and requires 'volatile' in Java to prevent reordering issues from publishing a partially-constructed object.",
    difficulty: "Hard",
    topicTags: ["Singleton", "double-checked locking"],
  },
  {
    id: "creational-design-patterns-oa-4",
    question:
      "abstract class Dialog {\n  abstract Button createButton();\n  void render() { Button b = createButton(); b.paint(); }\n}\nclass WindowsDialog extends Dialog {\n  Button createButton() { return new WindowsButton(); }\n}\nWhich creational pattern does this illustrate?",
    options: ["Abstract Factory", "Factory Method", "Builder", "Prototype"],
    correctAnswerIndex: 1,
    explanation: "A single product (Button) is created via a method overridden by a subclass — the defining structure of Factory Method.",
    difficulty: "Medium",
    topicTags: ["Factory Method", "code identification"],
  },
  {
    id: "creational-design-patterns-oa-5",
    question:
      "interface GUIFactory {\n  Button createButton();\n  Checkbox createCheckbox();\n}\nclass MacFactory implements GUIFactory {\n  public Button createButton() { return new MacButton(); }\n  public Checkbox createCheckbox() { return new MacCheckbox(); }\n}\nWhich pattern is this?",
    options: ["Factory Method", "Abstract Factory", "Singleton", "Builder"],
    correctAnswerIndex: 1,
    explanation: "A single factory object produces a whole family of related products (Button and Checkbox) that stay consistent with each other — this is Abstract Factory.",
    difficulty: "Medium",
    topicTags: ["Abstract Factory", "code identification"],
  },
  {
    id: "creational-design-patterns-oa-6",
    question: "What is the key structural difference between Factory Method and Abstract Factory?",
    options: [
      "Factory Method uses no inheritance at all",
      "Factory Method produces one product via a method overridden by a subclass; Abstract Factory produces a family of related products via a swappable factory object",
      "Abstract Factory can only be used for GUI code",
      "There is no real difference; they are the same pattern",
    ],
    correctAnswerIndex: 1,
    explanation: "Factory Method centers on overriding a single creation method; Abstract Factory centers on an interface exposing creation methods for multiple related products.",
    difficulty: "Hard",
    topicTags: ["Factory Method", "Abstract Factory"],
  },
  {
    id: "creational-design-patterns-oa-7",
    question:
      "Pizza pizza = new Pizza.Builder().setSize(\"Large\").addTopping(\"Cheese\").addTopping(\"Olives\").build();\nWhich creational pattern is this?",
    options: ["Prototype", "Singleton", "Builder", "Abstract Factory"],
    correctAnswerIndex: 2,
    explanation: "Chained, step-by-step configuration ending in a build() call, avoiding a telescoping constructor, is the Builder pattern.",
    difficulty: "Easy",
    topicTags: ["Builder", "code identification"],
  },
  {
    id: "creational-design-patterns-oa-8",
    question: "What problem does the Builder pattern primarily solve?",
    options: [
      "Ensuring only one instance of a class exists",
      "Avoiding unreadable, error-prone constructors with many optional parameters (telescoping constructors)",
      "Cloning existing objects cheaply",
      "Hiding which concrete subclass is instantiated",
    ],
    correctAnswerIndex: 1,
    explanation: "Builder separates complex, multi-step construction from the object's final representation, replacing telescoping constructors with readable, chained configuration.",
    difficulty: "Easy",
    topicTags: ["Builder"],
  },
  {
    id: "creational-design-patterns-oa-9",
    question:
      "class Enemy implements Cloneable {\n  List<Item> loot;\n  public Enemy clone() { \n    Enemy copy = (Enemy) super.clone(); // default Object.clone()\n    return copy;\n  }\n}\nWhat bug does this clone() implementation have?",
    options: [
      "It doesn't compile since Enemy doesn't implement Serializable",
      "It performs a shallow copy — the clone's loot list is the same list reference as the original, so mutating one affects the other",
      "Cloneable requires a private constructor",
      "There is no bug; this is a correct deep copy",
    ],
    correctAnswerIndex: 1,
    explanation: "Object.clone()'s default behavior field-copies references; loot is copied as a reference, not a new list, so the clone aliases the original's loot list.",
    difficulty: "Hard",
    topicTags: ["Prototype", "shallow copy"],
  },
  {
    id: "creational-design-patterns-oa-10",
    question: "The Prototype pattern is most useful when:",
    options: [
      "You need exactly one instance of a class",
      "Object creation is expensive or the concrete type isn't known ahead of time, and cloning an existing configured instance is cheaper/simpler than building from scratch",
      "You need to construct a complex object step by step",
      "You need to create families of related objects",
    ],
    correctAnswerIndex: 1,
    explanation: "Prototype avoids re-running expensive or type-unknown construction logic by cloning an already-configured template instance instead.",
    difficulty: "Medium",
    topicTags: ["Prototype"],
  },
  {
    id: "creational-design-patterns-oa-11",
    question: "All five patterns — Singleton, Factory Method, Abstract Factory, Builder, Prototype — belong to which GoF pattern category?",
    options: ["Structural", "Behavioral", "Creational", "Architectural"],
    correctAnswerIndex: 2,
    explanation: "All five deal with object creation mechanisms and are classified as Creational patterns in the Gang of Four catalog.",
    difficulty: "Easy",
    topicTags: ["GoF classification"],
  },
  {
    id: "creational-design-patterns-oa-12",
    question: "Which initialization strategy for Singleton avoids explicit locking on every call while still being thread-safe, by relying on JVM class-loading guarantees?",
    options: ["Naive lazy initialization", "Eager initialization only", "Initialization-on-demand holder idiom (a static nested class)", "Double-checked locking without volatile"],
    correctAnswerIndex: 2,
    explanation: "The holder idiom defers construction to a nested static class that the JVM guarantees is initialized exactly once, safely, only when first accessed — no explicit synchronized block needed.",
    difficulty: "Hard",
    topicTags: ["Singleton", "holder idiom"],
    companyStyle: "Google-style",
  },
];
