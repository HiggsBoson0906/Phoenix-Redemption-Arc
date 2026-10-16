// src/content/cs-fundamentals/oops/oa/polymorphism.oa.ts

import type { OAQuestion, OARevisionNotes } from "@/types";

export const polymorphismRevisionNotes: OARevisionNotes = {
  quickRevision: [
    "Compile-time/static polymorphism = method overloading (resolved by argument types at compile time).",
    "Runtime/dynamic polymorphism = method overriding (resolved by the object's actual type at runtime, via the vtable).",
    "A vtable is a per-class array of function pointers for virtual methods; each object holds a pointer to its class's vtable.",
    "Java methods are virtual (overridable) by default unless `final`, `private`, or `static`; C++ methods need explicit `virtual`.",
  ],
  importantFacts: [
    "Overloading requires a different parameter list — changing only the return type does not create a valid overload.",
    "Overload resolution (which overload is picked) happens at compile time, based on the reference's declared/static type — even when the actual object is a subclass with additional overloads.",
    "Java overload resolution prefers widening primitive conversion (int→long) over autoboxing (int→Integer) when both are applicable.",
    "Static, private, and final methods are not dynamically dispatched — they are resolved at compile time, just like fields.",
  ],
  memoryTricks: [
    "'Overloading = same class, same name, different signature, compiler decides.' 'Overriding = subclass, same signature, runtime decides.'",
    "vtable = 'virtual table' = one array of function pointers per class, one pointer per object to find it.",
  ],
};

export const polymorphismOAQuestions: OAQuestion[] = [
  {
    id: "polymorphism-oa-1",
    question: "Which of the following is an example of compile-time (static) polymorphism?",
    options: ["Method overriding", "Method overloading", "Dynamic dispatch via vtable", "Runtime type identification"],
    correctAnswerIndex: 1,
    explanation: "Method overloading is resolved entirely by the compiler based on argument types at each call site, making it compile-time/static polymorphism.",
    difficulty: "Easy",
    topicTags: ["basics"],
  },
  {
    id: "polymorphism-oa-2",
    question: "What is a vtable used for?",
    options: [
      "Storing all static fields of a class",
      "Storing function pointers to the correct implementation of each virtual method, enabling dynamic dispatch",
      "Storing the source code of overloaded methods",
      "Managing garbage collection roots",
    ],
    correctAnswerIndex: 1,
    explanation: "A vtable is a per-class array of function pointers, one slot per virtual/overridable method, letting the runtime jump to the correct (possibly overridden) implementation based on the object's actual class.",
    difficulty: "Medium",
    topicTags: ["vtable"],
  },
  {
    id: "polymorphism-oa-3",
    question:
      "Predict the output:\n\nclass Parent {\n  void show(int x) { System.out.println(\"Parent.show(int): \" + x); }\n}\nclass Child extends Parent {\n  void show(int x) { System.out.println(\"Child.show(int): \" + x); }\n  void show(double x) { System.out.println(\"Child.show(double): \" + x); }\n}\npublic class Main {\n  public static void main(String[] args) {\n    Parent p = new Child();\n    p.show(10);\n  }\n}",
    options: [
      "Parent.show(int): 10",
      "Child.show(int): 10",
      "Child.show(double): 10.0",
      "Compile-time error",
    ],
    correctAnswerIndex: 1,
    explanation: "Overload resolution (which show() signature is even callable) happens at compile time based on the reference's declared type Parent, which only declares show(int) — so show(double) isn't visible at all here. But which implementation actually runs is resolved at runtime via dynamic dispatch on the real object (a Child), so Child's override of show(int) executes. Verified by execution.",
    difficulty: "Hard",
    topicTags: ["overloading", "overriding", "puzzle"],
    companyStyle: "Amazon OA",
  },
  {
    id: "polymorphism-oa-4",
    question: "Which of these is NOT a valid way to overload a method in Java?",
    options: [
      "Changing the number of parameters",
      "Changing the types of parameters",
      "Changing only the return type while keeping identical parameters",
      "Changing the order of differently-typed parameters",
    ],
    correctAnswerIndex: 2,
    explanation: "Java requires the parameter list to differ for a valid overload; two methods with the same name and identical parameter list but different return types is a compile-time duplicate-method error.",
    difficulty: "Medium",
    topicTags: ["overloading"],
  },
  {
    id: "polymorphism-oa-5",
    question: "Which kind of methods are NOT subject to dynamic dispatch (i.e., are resolved statically) in Java?",
    options: ["Public instance methods", "Protected instance methods", "static, private, and final methods", "Overridden methods called via a superclass reference"],
    correctAnswerIndex: 2,
    explanation: "static, private, and final methods cannot be overridden, so there's no ambiguity to resolve at runtime — they're bound at compile time, just like fields.",
    difficulty: "Medium",
    topicTags: ["dynamic dispatch"],
  },
  {
    id: "polymorphism-oa-6",
    question:
      "Predict the output:\n\npublic class Main {\n  static void show(long x) { System.out.println(\"long: \" + x); }\n  static void show(Integer x) { System.out.println(\"Integer: \" + x); }\n  public static void main(String[] args) {\n    int a = 5;\n    show(a);\n  }\n}",
    options: ["Integer: 5", "long: 5", "Compile-time error: ambiguous method call", "Runtime exception"],
    correctAnswerIndex: 1,
    explanation: "When both a widening primitive conversion (int to long) and autoboxing (int to Integer) are applicable overloads, Java's overload resolution prefers widening over autoboxing, so show(long) is chosen. Verified by execution.",
    difficulty: "Hard",
    topicTags: ["overloading", "autoboxing", "puzzle"],
    companyStyle: "Google-style",
  },
  {
    id: "polymorphism-oa-7",
    question: "In C++, what must you do to make a base class method eligible for dynamic dispatch when called through a base class pointer?",
    options: [
      "Nothing, all methods are virtual by default",
      "Mark it with the `virtual` keyword",
      "Mark it `static`",
      "Declare it inside a struct instead of a class",
    ],
    correctAnswerIndex: 1,
    explanation: "Unlike Java, C++ methods are non-virtual (statically resolved) by default; a method must be explicitly declared `virtual` in the base class for calls through a base pointer/reference to dynamically dispatch to an overriding subclass implementation.",
    difficulty: "Medium",
    topicTags: ["C++", "virtual functions"],
  },
  {
    id: "polymorphism-oa-8",
    question: "How does each object typically gain access to its class's vtable at runtime?",
    options: [
      "The object copies the entire vtable into its own memory",
      "The object stores a hidden pointer to its class's single shared vtable",
      "The vtable is recomputed on every method call",
      "Objects do not have any connection to a vtable; only classes do",
    ],
    correctAnswerIndex: 1,
    explanation: "Each object carries a hidden pointer (set up during construction) to its class's vtable, which is a single structure shared by all instances of that class — the object doesn't get its own copy of the table itself.",
    difficulty: "Hard",
    topicTags: ["vtable", "memory model"],
  },
  {
    id: "polymorphism-oa-9",
    question: "Why does polymorphism support the open/closed principle (open for extension, closed for modification)?",
    options: [
      "Because it prevents any new subclasses from being created",
      "Because code written against a supertype/interface can work with new subclasses without being modified",
      "Because it eliminates the need for interfaces",
      "Because polymorphism only applies to final classes",
    ],
    correctAnswerIndex: 1,
    explanation: "Code that calls methods through a supertype/interface reference automatically works correctly with any new subclass that overrides those methods, so existing code doesn't need modification to support new extensions — the definition of open/closed.",
    difficulty: "Medium",
    topicTags: ["design principles"],
  },
  {
    id: "polymorphism-oa-10",
    question:
      "Predict the output:\n\nclass Shape {\n  double area() { return 0; }\n}\nclass Circle extends Shape {\n  double radius;\n  Circle(double r) { radius = r; }\n  @Override\n  double area() { return 3.14 * radius * radius; }\n}\npublic class Main {\n  public static void main(String[] args) {\n    Shape s = new Circle(2);\n    System.out.println(s.area());\n  }\n}",
    options: ["0.0", "12.56", "Compile-time error", "NaN"],
    correctAnswerIndex: 1,
    explanation: "Even though `s` is declared as type Shape, dynamic dispatch resolves area() to Circle's overridden version at runtime based on the actual object, computing 3.14 * 2 * 2 = 12.56.",
    difficulty: "Medium",
    topicTags: ["overriding", "puzzle"],
    companyStyle: "TCS NQT",
  },
  {
    id: "polymorphism-oa-11",
    question: "What is 'parametric polymorphism' (as in Java generics or C++ templates), and how does it differ from overloading/overriding?",
    options: [
      "It's identical to method overloading",
      "It lets the same code operate uniformly across different types via type parameters, without multiple explicit method signatures or subclass-specific overrides",
      "It only applies to primitive types",
      "It requires runtime reflection to work",
    ],
    correctAnswerIndex: 1,
    explanation: "Generics/templates let one piece of code (e.g. a generic List<T>) work across many types using a type parameter, which is a distinct form of polymorphism from both overloading (multiple signatures) and overriding (subtype-based dynamic dispatch).",
    difficulty: "Hard",
    topicTags: ["generics", "parametric polymorphism"],
  },
  {
    id: "polymorphism-oa-12",
    question: "Which statement correctly contrasts overloading and overriding?",
    options: [
      "Overloading is resolved at runtime; overriding is resolved at compile time",
      "Overloading requires inheritance; overriding does not",
      "Overloading is same-class/different-signature resolved at compile time; overriding is subclass/same-signature resolved at runtime",
      "They are the exact same mechanism with different names",
    ],
    correctAnswerIndex: 2,
    explanation: "Overloading happens within one class with differing parameter lists and is resolved by the compiler; overriding happens across an inheritance relationship with an identical signature and is resolved dynamically based on the runtime object type.",
    difficulty: "Easy",
    topicTags: ["overloading vs overriding"],
  },
];
