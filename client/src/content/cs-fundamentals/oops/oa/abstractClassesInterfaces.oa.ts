// src/content/cs-fundamentals/oops/oa/abstractClassesInterfaces.oa.ts

import type { OAQuestion, OARevisionNotes } from "@/types";

export const abstractClassesInterfacesRevisionNotes: OARevisionNotes = {
  quickRevision: [
    "Abstract class: can have state, constructors, concrete + abstract methods; single inheritance only (extend one).",
    "Interface: traditionally pure method signatures, no instance state; a class can implement many simultaneously.",
    "Java 8+ interfaces can have `default` (with body, overridable) and `static` methods, but still no instance fields.",
    "An abstract class cannot be instantiated directly — `new AbstractClass()` is a compile-time error.",
  ],
  importantFacts: [
    "A class can extend only one class (abstract or not) but can implement any number of interfaces.",
    "If two implemented interfaces provide conflicting default methods, the implementing class must explicitly override to resolve it.",
    "An abstract class can have a constructor, invoked via `super(...)` from a subclass, even though the abstract class itself can't be instantiated.",
    "A class that implements an interface but doesn't provide all abstract method bodies must itself be declared abstract.",
  ],
  memoryTricks: [
    "'Extend one, implement many' — the core structural rule distinguishing abstract classes from interfaces.",
    "Abstract class = partial blueprint with some rooms built; Interface = a checklist of rooms that must exist, historically with no rooms pre-built.",
  ],
};

export const abstractClassesInterfacesOAQuestions: OAQuestion[] = [
  {
    id: "abstract-classes-interfaces-oa-1",
    question: "How many classes can a single Java class extend, and how many interfaces can it implement?",
    options: ["Extend many, implement one", "Extend one, implement many", "Extend many, implement many", "Extend one, implement one"],
    correctAnswerIndex: 1,
    explanation: "Java restricts a class to extending exactly one class (abstract or concrete) but allows implementing any number of interfaces simultaneously.",
    difficulty: "Easy",
    topicTags: ["basics"],
  },
  {
    id: "abstract-classes-interfaces-oa-2",
    question:
      "Predict the output:\n\nabstract class Shape {\n  abstract double area();\n}\npublic class Main {\n  public static void main(String[] args) {\n    Shape s = new Shape();\n  }\n}",
    options: ["0.0", "null", "Compile-time error: Shape is abstract; cannot be instantiated", "Runtime exception"],
    correctAnswerIndex: 2,
    explanation: "An abstract class can never be instantiated directly with `new`, regardless of whether it has abstract methods pending; this is a compile-time error, verified by direct compilation.",
    difficulty: "Easy",
    topicTags: ["abstract class", "puzzle"],
  },
  {
    id: "abstract-classes-interfaces-oa-3",
    question:
      "Predict the output:\n\ninterface Greetable {\n  default String greet() { return \"Hello from interface\"; }\n}\nabstract class Person implements Greetable {\n  String name;\n  Person(String name) { this.name = name; }\n  abstract String describe();\n}\nclass Student extends Person {\n  Student(String name) { super(name); }\n  String describe() { return name + \" is a student\"; }\n}\npublic class Main {\n  public static void main(String[] args) {\n    Person p = new Student(\"Alice\");\n    System.out.println(p.describe());\n    System.out.println(p.greet());\n  }\n}",
    options: [
      "Alice is a student\\nHello from interface",
      "Compile-time error: Person must implement greet()",
      "null is a student\\nHello from interface",
      "Alice is a student\\nCompile-time error",
    ],
    correctAnswerIndex: 0,
    explanation: "Person doesn't need to implement greet() because the interface already provides a usable default implementation. Student inherits both Person's constructor-set name and the interface's default greet(), so describe() prints 'Alice is a student' and greet() prints the interface's default message. Verified by execution.",
    difficulty: "Hard",
    topicTags: ["default methods", "abstract class", "puzzle"],
    companyStyle: "Amazon OA",
  },
  {
    id: "abstract-classes-interfaces-oa-4",
    question: "Which of the following can a traditional (pre-Java 8 style) interface NOT contain?",
    options: ["Method signatures", "Constants (public static final fields)", "Instance (non-static) fields with per-object state", "Nothing — interfaces can contain any of these"],
    correctAnswerIndex: 2,
    explanation: "Interfaces cannot hold instance state — any field declared in an interface is implicitly public, static, and final, meaning it's a shared constant, not per-object mutable state.",
    difficulty: "Medium",
    topicTags: ["interfaces"],
  },
  {
    id: "abstract-classes-interfaces-oa-5",
    question: "What must an implementing class do if two interfaces it implements both declare a conflicting `default` method with the same signature?",
    options: [
      "Nothing; Java picks the first interface listed",
      "The class must override the method itself to explicitly resolve the conflict",
      "The program throws a runtime exception when the method is called",
      "Java disallows implementing two interfaces at all in this situation",
    ],
    correctAnswerIndex: 1,
    explanation: "Java refuses to silently choose between two conflicting default method implementations — the implementing class must override the method itself, optionally calling a specific interface's version via InterfaceName.super.method().",
    difficulty: "Hard",
    topicTags: ["default methods", "diamond problem"],
  },
  {
    id: "abstract-classes-interfaces-oa-6",
    question: "Can an abstract class have a constructor?",
    options: [
      "No, abstract classes cannot have constructors",
      "Yes, and it's invoked via `super(...)` when a subclass is instantiated",
      "Yes, but it can never be called",
      "Only if the abstract class has zero abstract methods",
    ],
    correctAnswerIndex: 1,
    explanation: "Abstract classes can have constructors just like any other class; they simply can't be invoked via `new AbstractClass()` directly — a concrete subclass's constructor calls it via `super(...)`.",
    difficulty: "Medium",
    topicTags: ["abstract class", "constructors"],
  },
  {
    id: "abstract-classes-interfaces-oa-7",
    question: "What happens if a concrete (non-abstract) class implements an interface but fails to provide an implementation for one of its abstract methods?",
    options: [
      "It compiles fine, and the method does nothing at runtime",
      "It fails to compile, unless the class itself is also declared abstract",
      "Java automatically generates a default no-op implementation",
      "It compiles, but calling the missing method throws a NullPointerException",
    ],
    correctAnswerIndex: 1,
    explanation: "A class must implement every abstract method from any interface it implements (except default/static ones) unless it declares itself abstract, deferring the obligation to its own subclasses.",
    difficulty: "Medium",
    topicTags: ["interfaces", "abstract methods"],
  },
  {
    id: "abstract-classes-interfaces-oa-8",
    question: "Why don't interfaces (in their traditional form) suffer from the classic state-based diamond problem when a class implements two of them?",
    options: [
      "Because Java doesn't allow implementing two interfaces at once",
      "Because interfaces traditionally carry no instance state, so there is no ambiguous shared field to duplicate or resolve",
      "Because interfaces are compiled differently from classes entirely",
      "Because default methods are banned in Java",
    ],
    correctAnswerIndex: 1,
    explanation: "The sharpest part of the diamond problem is ambiguity over shared inherited *state*; since traditional interfaces hold no instance fields, there's nothing to duplicate, leaving only the milder default-method conflict, which Java resolves by requiring explicit override.",
    difficulty: "Hard",
    topicTags: ["interfaces", "diamond problem"],
  },
  {
    id: "abstract-classes-interfaces-oa-9",
    question: "When is it more appropriate to use an abstract class instead of an interface?",
    options: [
      "When unrelated classes need to share a single capability",
      "When a group of closely related subtypes needs to share meaningful common state or partially-implemented behavior",
      "When you need a class to implement multiple unrelated contracts",
      "Abstract classes should always be avoided in favor of interfaces",
    ],
    correctAnswerIndex: 1,
    explanation: "Abstract classes are the better fit when related subtypes genuinely share state or reusable implementation, since interfaces (even with default methods) cannot hold per-object instance state.",
    difficulty: "Medium",
    topicTags: ["design", "abstract class vs interface"],
  },
  {
    id: "abstract-classes-interfaces-oa-10",
    question: "In C++, what is the conventional equivalent of a Java 'interface'?",
    options: [
      "A struct with only public fields",
      "An abstract class where every method is a pure virtual function (`= 0`) and there are no data members",
      "A namespace with free functions",
      "A template class"
    ],
    correctAnswerIndex: 1,
    explanation: "C++ has no dedicated `interface` keyword; the conventional equivalent is an abstract class composed entirely of pure virtual functions and no data members, mirroring an interface's pure-contract role.",
    difficulty: "Medium",
    topicTags: ["C++", "interfaces"],
  },
  {
    id: "abstract-classes-interfaces-oa-11",
    question: "Which is a valid reason to combine an interface with a separate abstract class implementing it partially?",
    options: [
      "To make the interface instantiable directly",
      "To let the abstract class provide reusable partial implementation of the interface's contract, reducing boilerplate for concrete subclasses",
      "Because Java requires every interface to have a corresponding abstract class",
      "To avoid ever writing a concrete class"
    ],
    correctAnswerIndex: 1,
    explanation: "This 'abstract base class implementing an interface' pattern (e.g. Java's AbstractList implementing List) lets concrete subclasses reuse common logic while still satisfying the interface's public contract, avoiding duplicated boilerplate across every concrete implementer.",
    difficulty: "Hard",
    topicTags: ["design pattern", "abstract class"],
  },
  {
    id: "abstract-classes-interfaces-oa-12",
    question: "Which statement about interface fields in Java is correct?",
    options: [
      "Interface fields are mutable and per-instance by default",
      "Interface fields are implicitly public, static, and final (constants)",
      "Interfaces cannot declare any fields at all, even constants",
      "Interface fields default to private visibility"
    ],
    correctAnswerIndex: 1,
    explanation: "Any field declared inside a Java interface is implicitly `public static final`, meaning it's a shared, immutable constant rather than per-object mutable state.",
    difficulty: "Medium",
    topicTags: ["interfaces", "fields"],
  },
];
