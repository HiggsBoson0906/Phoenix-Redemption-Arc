// src/content/cs-fundamentals/oops/articles/polymorphism.ts

import type { Article } from "@/types";

const polymorphismArticle: Article = {
  slug: "polymorphism",
  title: "Polymorphism",
  summary:
    "Polymorphism lets the same method call behave differently depending on either the compile-time argument types (overloading) or the runtime object type (overriding) — the mechanism that makes OOP code genuinely extensible.",
  readingTimeMins: 10,
  beginnerExplanation:
    "Polymorphism literally means 'many forms' — the idea that the same method name or the same line of calling code can produce different behavior depending on context. There are two flavors: compile-time (static) polymorphism, resolved by the compiler before the program even runs, and runtime (dynamic) polymorphism, resolved while the program is actually executing, based on the real type of the object involved.\n\nCompile-time polymorphism is method overloading: you define multiple methods with the same name but different parameter lists in the same class (`add(int, int)` and `add(double, double)`), and the compiler decides which one to call based on the argument types you pass at each call site. Runtime polymorphism is method overriding: a subclass redefines a method it inherited with the identical signature, and which version actually runs is decided at runtime based on the real object behind the reference — even if the reference variable is declared as the superclass type.",
  detailedBreakdown:
    "Overloading is resolved entirely at compile time by looking at the number, types, and order of arguments at the call site — the compiler picks the best-matching method signature and bakes that choice directly into the compiled code. This means overloading has nothing to do with inheritance or object identity at all; it's purely a same-class, same-name, different-parameter-list mechanism. Overloaded methods can also differ in return type, but *only* changing the return type while keeping identical parameters is not enough to overload (Java specifically requires parameter lists to differ, not just return type).\n\nOverriding is resolved at runtime through dynamic dispatch. When a subclass provides a new implementation of a method with the exact same signature (same name, same parameters, same or covariant return type) as one it inherited, calling that method through any reference — even one declared as the superclass type — invokes the subclass's version, because the language looks at the object's actual runtime type, not the reference's declared type. This is what lets you write `Animal a = new Dog(); a.speak();` and get Dog's overridden behavior even though `a` is typed as `Animal`.\n\nThe mechanism that makes runtime dispatch efficient is the virtual method table (vtable), used conceptually by C++, Java, and most OOP runtimes. Each class with overridable (virtual, in C++ terms) methods gets one vtable — an array of function pointers, one slot per virtual method, pointing to whichever implementation is the 'most derived' one for that class. Every object of that class carries a hidden pointer to its class's vtable (set up by the constructor). When you call an overridden method through a reference, the runtime doesn't look at the reference's declared type at all — it follows the object's vtable pointer, looks up the method's slot, and jumps to whatever function pointer is stored there for that specific object's actual class. Because a subclass's vtable is built by copying the parent's vtable and then patching in the subclass's overridden slots, calling `speak()` through an `Animal`-typed reference pointing at a `Dog` object correctly lands on `Dog::speak` — the object's own vtable, not the reference's static type, decides. C++ requires you to explicitly mark a method `virtual` to get this behavior (non-virtual methods are resolved statically by reference type, like fields); Java methods are virtual/overridable by default unless marked `final`, `private`, or `static`.\n\nA third, looser form sometimes discussed is 'parametric polymorphism' — generics/templates (Java generics, C++ templates), where the same code works across different types without overloading or overriding at all, just type parameters. It's a related but distinct idea from the classic ad-hoc (overloading) and subtype (overriding) polymorphism this topic focuses on.\n\nPolymorphism is what makes OOP code extensible: code written against a supertype/interface (`void render(List<Shape> shapes) { for (Shape s : shapes) s.draw(); }`) works correctly for any current or *future* subclass of `Shape`, without the `render` method ever needing to change. Adding a new `Triangle` subclass that overrides `draw()` doesn't require touching `render()` at all — this is the essence of the open/closed principle (open for extension, closed for modification), and it's precisely what makes plugin architectures, visitor patterns, and strategy patterns possible.",
  realWorldExamples:
    "`System.out.println()` in Java is overloaded dozens of times (`println(int)`, `println(String)`, `println(double)`, `println(Object)`) — the compiler picks the exact overload based on the argument's compile-time type. A shape-drawing application with a `List<Shape> shapes` containing a mix of `Circle`, `Square`, and `Triangle` objects can call `shape.draw()` in a single loop and get each shape's own correct rendering logic via runtime polymorphism/dynamic dispatch, without a single if/else checking 'what type is this.' JDBC's `Connection`/`Statement`/`ResultSet` are all interfaces — your code calls `connection.createStatement()` polymorphically without knowing or caring whether the actual runtime object is MySQL's, PostgreSQL's, or Oracle's driver implementation underneath.",
  useCases: [
    "Writing code against a common supertype/interface that transparently works with any current or future subclass (extensible plugin/strategy architectures)",
    "Overloading utility/constructor methods to accept different parameter combinations for convenience (e.g. multiple StringBuilder or ArrayList constructors)",
    "Replacing large if/else or switch chains that branch on an object's concrete type with a single polymorphic method call",
  ],
  advantages: [
    "Lets new subclasses be added without modifying existing code that operates on the supertype (open/closed principle)",
    "Eliminates repetitive type-checking branches (`if (shape instanceof Circle) ... else if ...`) in favor of a single dispatched call",
    "Overloading improves call-site readability by allowing one intuitive method name across multiple sensible parameter combinations",
  ],
  disadvantages: [
    "Runtime dispatch through a vtable has a small performance cost (an extra pointer indirection) compared to a direct, statically-resolved function call",
    "Overuse of deep polymorphic hierarchies can make it hard to know, just by reading a call site, which actual implementation will execute",
    "Overload resolution can produce genuinely surprising results with autoboxing/widening conversions across multiple candidate overloads if signatures are too similar",
  ],
  commonMisconceptions: [
    "\"Overloading and overriding are basically the same thing\" — overloading is same-class, same-name, different-parameter-list, resolved at compile time; overriding is subclass-redefines-inherited-method with an identical signature, resolved at runtime. They're unrelated mechanisms.",
    "\"You can overload a method just by changing its return type\" — Java requires the parameter list to differ; changing only the return type with identical parameters is a compile error (duplicate method signature).",
    "\"A vtable lookup happens for every method call, even non-virtual ones\" — non-virtual methods (or `final`/`private`/`static` methods in Java, or non-`virtual` methods in C++) are resolved statically at compile time with a direct call, no vtable indirection involved at all.",
  ],
  interviewPerspective:
    "This is one of the most reliably-asked OOP topics, and interviewers specifically probe the compile-time-vs-runtime distinction because it's so often blurred. Be precise about *when* each is resolved (compiler for overloading, runtime object type for overriding) and be ready to explain vtables conceptually — what they are, why they exist, and why non-virtual/static/final methods skip that indirection entirely. A frequent follow-up is 'why can't you overload by return type alone,' and another is walking through exactly how `Animal a = new Dog(); a.speak();` resolves to Dog's method despite the `Animal` reference type.",
  oaPerspective:
    "OA MCQs test overload resolution rules (which overload is chosen given specific argument types, including tricky widening/autoboxing cases), and constantly include 'predict the output' snippets calling an overridden method through a superclass reference to test whether you understand dynamic dispatch versus static field resolution. Expect direct questions defining vtables and asking which kind of methods (static, private, final in Java; non-virtual in C++) are NOT subject to dynamic dispatch.",
  keyTakeaways: [
    "Compile-time (static) polymorphism = method overloading, resolved by the compiler using argument types at the call site.",
    "Runtime (dynamic) polymorphism = method overriding, resolved using the object's actual runtime type via the vtable, regardless of the reference's declared type.",
    "A vtable is a per-class array of function pointers for virtual/overridable methods; each object holds a hidden pointer to its class's vtable, enabling dynamic dispatch.",
    "Java methods are virtual by default (overridable) unless `final`, `private`, or `static`; C++ methods are non-virtual by default unless explicitly marked `virtual`.",
    "Polymorphism enables the open/closed principle — new subclasses extend behavior without modifying code written against the supertype.",
  ],
  summaryClosing:
    "Polymorphism is the payoff of the type hierarchies inheritance and interfaces build — it's the reason OOP code can be written once against an abstraction and correctly handle types that didn't even exist when that code was written. Knowing precisely which kind of polymorphism resolves when, and understanding the vtable mechanism underneath dynamic dispatch, is what turns 'I've used polymorphism' into genuine understanding.",
  relatedTopics: ["Inheritance", "Abstract Classes & Interfaces", "Classes & Objects"],
  furtherReading: [
    { label: "C++ Virtual Functions and vtables — cppreference/Stroustrup FAQ", note: "The clearest low-level explanation of how vtables actually work in C++." },
    { label: "Java Language Specification — Overload Resolution (§15.12)", note: "The exact rules the compiler uses to pick an overload." },
  ],
};

export default polymorphismArticle;
