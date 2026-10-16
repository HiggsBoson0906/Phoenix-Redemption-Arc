// src/content/cs-fundamentals/oops/oa/classesObjects.oa.ts

import type { OAQuestion, OARevisionNotes } from "@/types";

export const classesObjectsRevisionNotes: OARevisionNotes = {
  quickRevision: [
    "Class = blueprint (compile-time); Object = instance (runtime, has its own memory).",
    "`this` (Java/C++) / `self` (Python) refers to the current object a method is executing on.",
    "Instance members: one copy per object. Static members: one copy shared by the whole class.",
    "Static methods have no `this` — they cannot directly access instance fields/methods.",
  ],
  importantFacts: [
    "If no constructor is written, the compiler generates a public no-argument default constructor.",
    "A static field is initialized once when the class is first loaded, not once per object creation.",
    "Static methods can be called via the class name directly (`ClassName.method()`) without creating any object.",
    "In Java, `this()` inside a constructor calls another overloaded constructor of the same class (constructor chaining).",
  ],
  memoryTricks: [
    "'Static sticks to the class, instance sticks to the object' — one copy vs many copies.",
    "Blueprint (class) vs building (object): you can't live inside a blueprint.",
  ],
};

export const classesObjectsOAQuestions: OAQuestion[] = [
  {
    id: "classes-objects-oa-1",
    question: "What is the correct relationship between a class and an object?",
    options: [
      "A class is an instance of an object",
      "An object is an instance of a class",
      "They are interchangeable terms",
      "A class can only ever produce one object",
    ],
    correctAnswerIndex: 1,
    explanation: "A class is a blueprint; an object is a concrete instance created from that blueprint, with its own memory for fields.",
    difficulty: "Easy",
    topicTags: ["basics"],
  },
  {
    id: "classes-objects-oa-2",
    question:
      "Predict the output:\n\nclass Counter {\n  static int count = 0;\n  Counter() { count++; }\n}\npublic class Main {\n  public static void main(String[] args) {\n    new Counter();\n    new Counter();\n    Counter c3 = new Counter();\n    System.out.println(Counter.count);\n  }\n}",
    options: ["0", "1", "2", "3"],
    correctAnswerIndex: 3,
    explanation:
      "`count` is static, so all Counter instances share the same field. Each of the three `new Counter()` calls runs the constructor once, incrementing the single shared `count` from 0 to 3. Output: 3.",
    difficulty: "Medium",
    topicTags: ["static", "puzzle"],
    companyStyle: "TCS NQT",
  },
  {
    id: "classes-objects-oa-3",
    question: "Which of the following can a static method NOT do directly?",
    options: [
      "Access another static field of the same class",
      "Access an instance field of the same class",
      "Be called without creating an object",
      "Be called using the class name",
    ],
    correctAnswerIndex: 1,
    explanation: "A static method has no implicit `this`/object reference, so it cannot access instance (non-static) fields or methods without an explicit object reference.",
    difficulty: "Medium",
    topicTags: ["static"],
  },
  {
    id: "classes-objects-oa-4",
    question: "In Java, what happens if you declare a class with no constructor at all?",
    options: [
      "The class becomes abstract automatically",
      "The compiler inserts a public no-argument default constructor",
      "The class cannot be instantiated",
      "A compile-time error is raised",
    ],
    correctAnswerIndex: 1,
    explanation: "If no constructor is explicitly written, the compiler generates a default no-argument constructor that leaves fields at their default zero-values.",
    difficulty: "Easy",
    topicTags: ["constructors"],
  },
  {
    id: "classes-objects-oa-5",
    question:
      "Predict the output:\n\nclass Box {\n  int size;\n  Box(int size) {\n    this.size = size;\n  }\n}\npublic class Main {\n  public static void main(String[] args) {\n    Box b1 = new Box(5);\n    Box b2 = new Box(10);\n    b1.size = 20;\n    System.out.println(b1.size + \" \" + b2.size);\n  }\n}",
    options: ["5 10", "20 10", "20 20", "10 20"],
    correctAnswerIndex: 1,
    explanation: "`size` is an instance field, so `b1` and `b2` have independent copies. b1 starts at 5, is reassigned to 20; b2 stays at 10, unaffected by changes to b1. Output: '20 10'.",
    difficulty: "Easy",
    topicTags: ["instance fields", "puzzle"],
  },
  {
    id: "classes-objects-oa-6",
    question: "What does the `this` keyword refer to inside a non-static instance method?",
    options: [
      "The class itself",
      "The object on which the method was invoked",
      "The parent class",
      "A static copy of the object",
    ],
    correctAnswerIndex: 1,
    explanation: "`this` is a reference to the specific object instance the method call is operating on, used to access that object's own fields and methods.",
    difficulty: "Easy",
    topicTags: ["this"],
  },
  {
    id: "classes-objects-oa-7",
    question: "How many objects of class `Point` are created by the statement `Point p = new Point(1, 2);`?",
    options: ["0", "1", "2", "Depends on the constructor body"],
    correctAnswerIndex: 1,
    explanation: "A single `new` expression allocates exactly one object; `p` is simply a reference variable pointing to that one object.",
    difficulty: "Easy",
    topicTags: ["object creation"],
  },
  {
    id: "classes-objects-oa-8",
    question: "Which statement about static fields is TRUE?",
    options: [
      "Each object gets its own separate copy of a static field",
      "Static fields are re-initialized every time a new object is created",
      "All instances of a class share a single copy of a static field",
      "Static fields cannot be modified after class loading",
    ],
    correctAnswerIndex: 2,
    explanation: "Static fields belong to the class, not any individual object, so exactly one shared copy exists regardless of how many instances are created.",
    difficulty: "Medium",
    topicTags: ["static"],
  },
  {
    id: "classes-objects-oa-9",
    question: "Why does Python require `self` as the explicit first parameter of instance methods, unlike Java's implicit `this`?",
    options: [
      "Python does not support objects",
      "Python's method resolution is purely syntactic and requires the object reference to be passed explicitly as a normal parameter",
      "Python methods cannot access instance state at all",
      "`self` is optional in Python and never used",
    ],
    correctAnswerIndex: 1,
    explanation: "Python doesn't have hidden/implicit parameters — an instance method is really just a function whose first parameter conventionally receives the calling object, making `self` explicit rather than compiler-injected as `this` is in Java/C++.",
    difficulty: "Medium",
    topicTags: ["python", "language comparison"],
  },
  {
    id: "classes-objects-oa-10",
    question: "What is the main memory-allocation difference between a class and an object?",
    options: [
      "A class occupies heap memory just like an object",
      "A class is metadata describing structure; memory for fields is only allocated when an object is instantiated",
      "An object never occupies memory, only the class does",
      "Both occupy identical memory regions"
    ],
    correctAnswerIndex: 1,
    explanation: "The class itself is stored as metadata (e.g. in the JVM's Method Area); actual memory for field values is allocated on the heap (or stack, for value types) only when an object is created via `new` or equivalent.",
    difficulty: "Medium",
    topicTags: ["memory model"],
  },
  {
    id: "classes-objects-oa-11",
    question:
      "Predict the output:\n\nclass Employee {\n  static String company = \"Acme\";\n  String name;\n  Employee(String name) { this.name = name; }\n}\npublic class Main {\n  public static void main(String[] args) {\n    Employee e1 = new Employee(\"Alice\");\n    Employee e2 = new Employee(\"Bob\");\n    e1.company = \"Globex\";\n    System.out.println(e1.company + \" \" + e2.company);\n  }\n}",
    options: ["Acme Acme", "Globex Acme", "Globex Globex", "Compile-time error"],
    correctAnswerIndex: 2,
    explanation: "`company` is static, so even though it's accessed via `e1.company`, it refers to the single shared class-level field. Setting it through `e1` changes it for every instance, including `e2`. Output: 'Globex Globex'.",
    difficulty: "Hard",
    topicTags: ["static", "puzzle"],
    companyStyle: "Amazon OA",
  },
  {
    id: "classes-objects-oa-12",
    question: "Which of these is a valid use case for a static factory method instead of a public constructor?",
    options: [
      "When you need a different set of fields per object",
      "When you want a descriptive method name (e.g. `of()`, `createDefault()`) or want to control/cache instance creation without exposing `new`",
      "When the class should never be instantiated at all",
      "Static factory methods are functionally identical to constructors in every respect and offer no benefit",
    ],
    correctAnswerIndex: 1,
    explanation: "Static factory methods can have meaningful names, can return cached/pre-existing instances instead of always allocating new ones, and can return a subtype — none of which a constructor (which always returns a new instance of exactly its own class) can do.",
    difficulty: "Hard",
    topicTags: ["static", "design"],
  },
];
