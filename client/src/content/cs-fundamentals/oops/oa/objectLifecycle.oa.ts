// src/content/cs-fundamentals/oops/oa/objectLifecycle.oa.ts

import type { OAQuestion, OARevisionNotes } from "@/types";

export const objectLifecycleRevisionNotes: OARevisionNotes = {
  quickRevision: [
    "Constructor kinds: default (no args), parameterized (args), copy (builds from another same-type object).",
    "Shallow copy copies pointer/reference values (aliasing risk); deep copy copies the pointed-to data (independent).",
    "RAII (C++): bind resource lifetime to object lifetime — acquire in constructor, release in destructor.",
    "Construction order: base class constructor, then member fields in declaration order, then constructor body.",
    "Destruction order is the exact reverse of construction order.",
    "Static members belong to the class, initialized once, independent of instance count.",
  ],
  importantFacts: [
    "C++ generates a default constructor, copy constructor, destructor, and copy assignment operator only if you declare none of them (and the rules get more nuanced once you declare any one of them).",
    "Java has no deterministic destructor; finalize() is deprecated — use try-with-resources/AutoCloseable.close() for deterministic cleanup.",
    "Member initializer list order in C++ constructors is cosmetic; actual initialization follows declaration order in the class.",
    "A double-free (freeing the same heap memory twice) is classic undefined behavior caused by shallow-copying a class that owns a raw pointer.",
  ],
  memoryTricks: [
    "Rule of Three/Five: if you write a custom destructor, copy constructor, or copy assignment operator, you likely need all three (plus move ctor/assignment for Five).",
    "'Construct base-to-derived, destruct derived-to-base' — construction flows outward from the base, destruction flows inward to the base.",
  ],
};

export const objectLifecycleOAQuestions: OAQuestion[] = [
  {
    id: "object-lifecycle-oa-1",
    question: "What is the primary purpose of a constructor?",
    options: [
      "To destroy an object when it goes out of scope",
      "To initialize an object's state at the moment it is created",
      "To allocate memory for the class definition itself",
      "To copy static fields between instances",
    ],
    correctAnswerIndex: 1,
    explanation: "A constructor's job is to bring a newly allocated object into a valid, well-defined initial state.",
    difficulty: "Easy",
    topicTags: ["constructors"],
  },
  {
    id: "object-lifecycle-oa-2",
    question:
      "class Buffer {\n  int* data;\n public:\n  Buffer(int size) { data = new int[size]; }\n  ~Buffer() { delete[] data; }\n};\nBuffer a(10);\nBuffer b = a; // uses compiler-generated copy constructor\nWhat bug does this program most likely trigger?",
    options: [
      "A compile error since Buffer has no copy constructor",
      "A double-free when both a and b are destroyed, since the default copy constructor shallow-copies the data pointer",
      "A memory leak only, no crash",
      "Nothing — the compiler automatically deep-copies arrays",
    ],
    correctAnswerIndex: 1,
    explanation: "The compiler-generated copy constructor copies the pointer value, so a.data and b.data point to the same heap array; both destructors call delete[] on it, freeing it twice (undefined behavior).",
    difficulty: "Hard",
    topicTags: ["shallow copy", "deep copy", "destructors"],
  },
  {
    id: "object-lifecycle-oa-3",
    question: "In C++, when is a stack-allocated object's destructor guaranteed to run?",
    options: [
      "Only when the program exits",
      "The instant the object goes out of scope",
      "Only if delete is explicitly called on it",
      "At an unspecified time chosen by the garbage collector",
    ],
    correctAnswerIndex: 1,
    explanation: "C++ destructors for stack objects run deterministically at scope exit — this determinism underlies RAII.",
    difficulty: "Medium",
    topicTags: ["RAII", "destructors"],
  },
  {
    id: "object-lifecycle-oa-4",
    question: "Why doesn't Java have a true destructor equivalent to C++'s?",
    options: [
      "Java objects never need cleanup",
      "Java uses garbage collection, so object memory reclamation timing is not deterministic; finalize() was unreliable and is deprecated",
      "Java classes cannot own resources",
      "Java constructors automatically release resources",
    ],
    correctAnswerIndex: 1,
    explanation: "Since the GC decides when to reclaim memory, there's no deterministic point to run cleanup code the way a C++ destructor guarantees; try-with-resources/close() fills that gap explicitly.",
    difficulty: "Medium",
    topicTags: ["destructors", "garbage collection"],
  },
  {
    id: "object-lifecycle-oa-5",
    question:
      "class Base {\n public:\n  Base() { std::cout << \"Base\"; }\n  ~Base() { std::cout << \"~Base\"; }\n};\nclass Derived : public Base {\n public:\n  Derived() { std::cout << \"Derived\"; }\n  ~Derived() { std::cout << \"~Derived\"; }\n};\nWhat is printed when a Derived object is created and then destroyed?",
    options: [
      "DerivedBase~Derived~Base",
      "BaseDerived~Derived~Base",
      "BaseDerived~Base~Derived",
      "Derived~Derived",
    ],
    correctAnswerIndex: 1,
    explanation: "Construction runs base-to-derived (Base's constructor first, then Derived's), and destruction runs derived-to-base (Derived's destructor first, then Base's).",
    difficulty: "Hard",
    topicTags: ["initialization order", "inheritance"],
  },
  {
    id: "object-lifecycle-oa-6",
    question: "What does a deep copy do that a shallow copy does not?",
    options: [
      "Copies primitive fields",
      "Allocates new memory for owned heap resources and copies the pointed-to data, rather than just copying the reference",
      "Copies static fields per-instance",
      "Runs the destructor twice",
    ],
    correctAnswerIndex: 1,
    explanation: "Deep copy gives the new object fully independent ownership of any resource the original owned, instead of both objects aliasing the same underlying memory.",
    difficulty: "Easy",
    topicTags: ["deep copy"],
  },
  {
    id: "object-lifecycle-oa-7",
    question: "A static member variable in a class is best described as:",
    options: [
      "A variable local to each object, reinitialized on every constructor call",
      "A variable shared by all instances of the class, existing independently of any particular instance",
      "A variable only accessible inside the destructor",
      "A variable that must be reinitialized manually in every method",
    ],
    correctAnswerIndex: 1,
    explanation: "Static members belong to the class itself, are initialized once, and are shared across every instance.",
    difficulty: "Easy",
    topicTags: ["static members"],
  },
  {
    id: "object-lifecycle-oa-8",
    question:
      "class Widget {\n  int a = compute();\n  int b = 5;\n public:\n  Widget() : b(10), a(20) {}\n};\nAssuming member declaration order is a then b, what are the final values of a and b?",
    options: [
      "a = compute(), b = 5, because default member initializers win",
      "a = 20, b = 10, matching the initializer list order written",
      "a = 20, b = 10, because members initialize in declaration order (a then b), regardless of initializer list order",
      "Compilation error",
    ],
    correctAnswerIndex: 2,
    explanation: "Member initialization always follows declaration order in the class body (a, then b) — the order written in the initializer list is purely cosmetic and doesn't change execution order; here it still resolves to a=20, b=10 since both are explicitly listed, just executed in declared order.",
    difficulty: "Hard",
    topicTags: ["initialization order", "member initializer list"],
  },
  {
    id: "object-lifecycle-oa-9",
    question: "What is RAII (Resource Acquisition Is Initialization)?",
    options: [
      "A garbage collection algorithm",
      "A pattern where a resource's lifetime is bound to an object's lifetime — acquired in the constructor, released in the destructor",
      "A rule that all resources must be acquired lazily",
      "A Java-specific memory management strategy",
    ],
    correctAnswerIndex: 1,
    explanation: "RAII ties resource cleanup to deterministic destructor calls, guaranteeing release even when exceptions unwind the stack.",
    difficulty: "Medium",
    topicTags: ["RAII"],
  },
  {
    id: "object-lifecycle-oa-10",
    question: "Which C++ guideline states that if you define a custom destructor, you likely also need a custom copy constructor and copy assignment operator?",
    options: ["The Rule of One", "The Rule of Three", "The Diamond Rule", "The Liskov Rule"],
    correctAnswerIndex: 1,
    explanation: "The Rule of Three (extended to Five with move semantics) exists because the compiler-generated shallow copy/assignment is almost always wrong once a class manually manages a resource.",
    difficulty: "Medium",
    topicTags: ["Rule of Three"],
    companyStyle: "Amazon",
  },
  {
    id: "object-lifecycle-oa-11",
    question: "Java's try-with-resources statement is most analogous to which C++ concept?",
    options: ["Static initializer blocks", "RAII / stack-allocated destructors", "The default constructor", "Multiple inheritance"],
    correctAnswerIndex: 1,
    explanation: "Both guarantee a resource is deterministically released at the end of a scope, even if an exception occurs.",
    difficulty: "Medium",
    topicTags: ["RAII", "try-with-resources"],
  },
  {
    id: "object-lifecycle-oa-12",
    question: "If a class declares no constructors at all in C++, what does the compiler do?",
    options: [
      "Refuses to compile",
      "Generates a default constructor that default-initializes members",
      "Generates only a copy constructor",
      "Makes the class abstract",
    ],
    correctAnswerIndex: 1,
    explanation: "With zero user-declared constructors, the compiler synthesizes a trivial default constructor (along with copy constructor, destructor, and copy assignment, subject to further rules).",
    difficulty: "Easy",
    topicTags: ["default constructor"],
  },
];
