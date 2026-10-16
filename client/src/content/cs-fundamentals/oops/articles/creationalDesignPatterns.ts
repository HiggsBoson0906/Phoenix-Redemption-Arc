// src/content/cs-fundamentals/oops/articles/creationalDesignPatterns.ts

import type { Article } from "@/types";

const creationalDesignPatternsArticle: Article = {
  slug: "creational-design-patterns",
  title: "Creational Design Patterns",
  summary:
    "Creational patterns — Singleton, Factory Method, Abstract Factory, Builder, Prototype — are the five classic Gang of Four solutions to one shared problem: making object creation flexible instead of hard-wiring `new SomeConcreteClass()` throughout a codebase.",
  readingTimeMins: 12,
  beginnerExplanation:
    "Every one of these patterns exists to answer the same underlying question: 'how do I create objects without my code becoming rigidly dependent on exactly which concrete class gets created?' If you sprinkle `new ConcreteClassX()` everywhere in your code, adding a new variant or changing how objects are constructed means hunting down and editing every one of those call sites. Creational patterns centralize and abstract that decision so the rest of the codebase depends only on an interface or a factory, never on concrete construction details.\n\nThe five differ in *what specific creation problem* they solve: Singleton controls how many instances exist (exactly one); Factory Method and Abstract Factory control which concrete class gets instantiated and hide that decision behind a common interface; Builder controls how a complex object gets assembled step by step; and Prototype controls creating new objects by cloning an existing one instead of building from scratch.",
  detailedBreakdown:
    "**Singleton** ensures a class has exactly one instance and provides a single global access point to it — used for things like a configuration manager, a connection pool, or a logging service where having two independent instances would cause inconsistent state or wasted resources. The naive implementation (a static instance created lazily on first access via an unsynchronized `if (instance == null) instance = new Singleton();`) is a textbook race condition in multi-threaded environments: two threads can both see `instance == null` simultaneously and both construct separate instances, defeating the entire point. Correct thread-safe approaches include eager initialization (create the instance as a static final field at class-load time — simple, but pays the construction cost even if never used), the synchronized method/double-checked locking pattern (checks null, acquires a lock, checks null again inside the lock before constructing, marking the field `volatile` in Java to prevent instruction-reordering bugs), or the initialization-on-demand holder idiom (a nested static class whose static field is only initialized when first referenced, relying on the JVM's class-loading guarantees for thread safety without explicit locking).\n\n**Factory Method** defines an interface for creating an object but lets subclasses decide which concrete class to instantiate — the pattern is 'one product, multiple concrete implementations, decided by a subclass override.' A `Dialog` base class might declare an abstract `createButton()` method; a `WindowsDialog` subclass overrides it to return a `WindowsButton`, while `MacDialog` returns a `MacButton` — client code calling `dialog.createButton()` never names a concrete button class directly.\n\n**Abstract Factory** takes this a level higher: it provides an interface for creating *families of related objects* without specifying their concrete classes. Where Factory Method produces one product via one overridden method, Abstract Factory produces multiple related products (a button, a checkbox, a scrollbar — all needing to visually match) via one factory object, guaranteeing the whole family is consistent. A `GUIFactory` interface with `createButton()` and `createCheckbox()` methods, implemented by `WindowsFactory` (returning `WindowsButton`/`WindowsCheckbox`) and `MacFactory` (returning `MacButton`/`MacCheckbox`), ensures you never accidentally mix a Windows button with a Mac checkbox — the factory you picked determines the entire consistent family. The key distinction interviewers probe: Factory Method is about one product via inheritance/overriding; Abstract Factory is about a *family* of related products via composition (the factory object itself is usually swapped in, often built using several Factory Methods internally).\n\n**Builder** separates the construction of a complex object from its representation, letting the same step-by-step construction process create different representations — used when an object has many optional parameters/configuration steps and a telescoping constructor (`new Pizza(size, cheese, pepperoni, mushroom, olives, ...)` with a dozen boolean/optional flags) would be unreadable and error-prone. A `PizzaBuilder` exposes chained methods like `.setSize(LARGE).addTopping(CHEESE).addTopping(OLIVES).build()`, and a `Director` class can optionally encapsulate common construction recipes (e.g., `buildMargherita()`) using the builder's steps.\n\n**Prototype** creates new objects by cloning an existing, fully-configured instance rather than constructing from scratch — valuable when object creation is expensive (e.g., involves a database round-trip or heavy computation to reach a particular state) or when you want to create objects that match a runtime-configured template without knowing its concrete class ahead of time. Implemented via a `clone()` method (Java's `Cloneable` interface, or a hand-written copy constructor call), and it directly raises the shallow-vs-deep-copy question from object lifecycle: a naive `clone()` shallow-copies reference fields, so a `Prototype` holding a mutable list must override `clone()` to deep-copy that list, or two 'independent' clones will silently share and corrupt the same underlying data.",
  realWorldExamples:
    "Java's `Runtime.getRuntime()` is a Singleton — there is exactly one JVM runtime object, and the same instance is returned on every call. Java's `Calendar.getInstance()` and various UI toolkits' `getInstance()`-style factory methods return locale/platform-appropriate concrete subclasses without callers ever naming them. Cross-platform GUI toolkits are the standard Abstract Factory example: a single `WidgetFactory` interface abstracts over an entire platform-specific widget family. `StringBuilder`/`StringBuffer` in Java are simplified builders for assembling a String incrementally rather than via error-prone concatenation. `Object.clone()` in Java and copy constructors in C++ directly implement the Prototype pattern; game engines commonly use Prototype to spawn many similar enemies/objects by cloning a pre-configured template rather than re-running expensive setup logic for each one.",
  useCases: [
    "Singleton: shared configuration, logging, connection pools, caches — anywhere exactly one coordinating instance is required",
    "Factory Method: a base class that needs to create objects but wants to let subclasses decide the exact concrete type",
    "Abstract Factory: cross-platform or theme-consistent object families (UI toolkits, database driver families) that must not be mixed",
    "Builder: constructing complex, highly-configurable objects step by step without unreadable multi-argument constructors",
    "Prototype: cheaply duplicating expensive-to-construct objects, or cloning runtime-configured templates whose concrete type isn't known ahead of time",
  ],
  advantages: [
    "All five decouple client code from concrete class names, making it easier to introduce new variants without touching call sites (supporting OCP)",
    "Singleton guarantees controlled, single-point access to shared, expensive, or stateful resources",
    "Abstract Factory guarantees consistency across a whole family of related objects, preventing accidental mismatches",
    "Builder makes complex object construction readable and safe against misordered/omitted parameters",
    "Prototype avoids the cost of re-running expensive initialization logic for near-identical objects",
  ],
  disadvantages: [
    "Singleton is frequently overused as a disguised global variable, making unit testing harder (hidden shared state, hard to substitute a test double) and introducing hidden coupling between unrelated parts of a codebase",
    "Naive Singleton implementations are not thread-safe and can silently produce two instances under concurrent access",
    "Abstract Factory requires creating a new concrete factory class for every new family, which can become a lot of boilerplate for a large number of product variants",
    "Builder adds an extra class and some verbosity for objects that are actually simple enough for a normal constructor",
    "Prototype's clone() must be carefully implemented (deep vs shallow) or it silently introduces the same aliasing bugs as a naive copy constructor",
  ],
  commonMisconceptions: [
    "\"Singleton is always thread-safe by definition\" — only if implemented with explicit synchronization (double-checked locking, eager init, or the holder idiom); the naive lazy version is a classic race condition.",
    "\"Factory Method and Abstract Factory are the same pattern with different names\" — Factory Method produces one product type via subclass overriding; Abstract Factory produces a family of related products via a swappable factory object, often implemented using several Factory Methods internally.",
    "\"Builder is just a constructor with extra steps\" — Builder's real value is enabling the *same* construction process to produce different representations, and making optional/many-parameter construction readable and validated incrementally, not merely deferring assignment.",
    "\"Prototype's clone() is always a deep copy automatically\" — a default/naive clone() is typically shallow; deep-copying any owned mutable reference fields must be handled explicitly by the class author.",
  ],
  interviewPerspective:
    "Interviewers almost always ask you to implement a thread-safe Singleton and explain *why* the naive version breaks under concurrency — be ready to describe double-checked locking with `volatile` (Java) or the initialization-on-demand holder idiom, and to explain why. The second most common ask is 'what's the difference between Factory Method and Abstract Factory,' where the expected answer centers on single product + inheritance vs. product family + composition. Be ready with a realistic example for each of the five, not just a definition.",
  oaPerspective:
    "OA MCQs frequently give a short code snippet (a `getInstance()` method, a factory interface, a chained builder call) and ask which creational pattern it implements, or ask which GoF category (creational/structural/behavioral) a named pattern belongs to. Expect direct questions on thread-safety of Singleton implementations and on distinguishing Factory Method from Abstract Factory by structure.",
  keyTakeaways: [
    "Singleton: exactly one instance, global access point — must be implemented carefully to be thread-safe (double-checked locking or the holder idiom).",
    "Factory Method: one product, concrete type decided by an overriding subclass.",
    "Abstract Factory: a family of related products, concrete family decided by which factory object you use.",
    "Builder: separates complex step-by-step construction from final representation, avoiding telescoping constructors.",
    "Prototype: creates new objects by cloning an existing instance — must handle deep vs shallow copy deliberately.",
  ],
  summaryClosing:
    "All five creational patterns exist to move the 'which concrete class, and how do I build it' decision out of scattered call sites and into one well-defined, swappable place — the specific pattern you pick depends on whether you're controlling instance count (Singleton), product variation (Factory Method/Abstract Factory), construction complexity (Builder), or construction cost (Prototype).",
  relatedTopics: ["SOLID Principles", "Structural & Behavioral Design Patterns", "Abstract Classes & Interfaces"],
  furtherReading: [
    { label: "Gang of Four — Design Patterns: Elements of Reusable Object-Oriented Software", note: "The original catalog defining all five creational patterns." },
    { label: "Java Concurrency in Practice — safe lazy initialization", note: "Covers double-checked locking and the initialization-on-demand holder idiom in depth." },
  ],
};

export default creationalDesignPatternsArticle;
