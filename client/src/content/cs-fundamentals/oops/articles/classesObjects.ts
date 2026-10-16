// src/content/cs-fundamentals/oops/articles/classesObjects.ts

import type { Article } from "@/types";

const classesObjectsArticle: Article = {
  slug: "classes-objects",
  title: "Classes & Objects",
  summary:
    "A class is a blueprint describing state and behavior; an object is a concrete, independently-existing instance of that blueprint — the foundational vocabulary of every OOP language.",
  readingTimeMins: 8,
  beginnerExplanation:
    "A class is a template — it describes what fields (data) and methods (behavior) something will have, but it doesn't itself occupy memory for a specific thing. An object is what you get when you instantiate that template: it's a real, addressable piece of memory holding actual values for those fields, and you can create as many independent objects from one class as you need.\n\nThink of a class like a blueprint for a house and an object like an actual house built from it. The blueprint specifies \"has N bedrooms, has a door, has a roof,\" but you can't live in a blueprint. Once you build a house from it (instantiate it), you get a real house with its own address, its own paint color, its own furniture — and you can build ten houses from the same blueprint, each independent of the others.",
  detailedBreakdown:
    "In Java or C++, a class declaration bundles two kinds of members: fields (also called instance variables or attributes) that hold per-object state, and methods that define behavior operating on that state. `class Car { String color; int speed; void accelerate() { speed += 10; } }` declares the shape; nothing exists in memory until you write `Car c = new Car();` (Java) or `Car c;` (C++ stack allocation) — that statement is what actually allocates memory and produces an object.\n\nEvery instance method implicitly receives a reference to the object it was called on — `this` in Java/C++/JavaScript, `self` in Python (explicit there, as the first parameter). Inside `accelerate()`, `speed += 10` is shorthand for `this.speed += 10`; `this` is how the method knows *which* object's fields to touch when there could be many `Car` objects alive simultaneously. `this` is also commonly used to disambiguate a constructor parameter from a field of the same name (`this.speed = speed;`) and to enable method chaining by returning `this`.\n\nMembers can be instance-level or static (class-level). Instance fields/methods belong to each object separately — every `Car` has its own `speed`. Static fields/methods belong to the class itself; there is exactly one copy shared across all instances, regardless of how many objects exist. A static counter field incremented in every constructor call is the classic way to track \"how many objects of this class have been created.\" Static methods cannot access instance fields directly (there's no implicit object to operate on) and are typically used for utility functions or factory methods that don't need per-object state.\n\nConstructors are special methods that run exactly once, at object creation, to establish a valid initial state — setting default field values, validating constructor arguments, or acquiring initial resources. A class can have multiple constructors with different parameter lists (constructor overloading), and if you write no constructor at all, Java/C++ silently generate a no-argument default constructor that leaves fields at their zero-values (0, null, false). Constructors are covered in full depth as their own topic; the key thing to internalize here is simply that object creation and field declaration are two separate steps — the class only describes the shape, the constructor (invoked via `new`) is what actually breathes a concrete object into existence.",
  realWorldExamples:
    "Every ORM (Object-Relational Mapper) is a direct application of this: a `User` class maps to a `users` database table, and each row fetched becomes one `User` object with its own `id`, `name`, `email` field values — the class defines the schema, each object is one record. In a game engine, an `Enemy` class defines shared behavior (`takeDamage()`, `moveTowardPlayer()`) while each spawned enemy on screen is a distinct object with its own health, position, and AI state, all running the identical class's logic independently. Java's `Integer.parseInt()` and Math.max() are static methods — you call them on the class itself (`Integer.parseInt(...)`, `Math.max(...)`) because there's no meaningful 'instance' of a math utility.",
  useCases: [
    "Modeling real-world or domain entities (User, Order, BankAccount) as reusable templates with well-defined state and behavior",
    "Static factory methods and utility classes (e.g. Math, Collections) that provide functionality without needing per-instance state",
    "Static counters/registries for tracking or capping how many instances of a class exist (e.g. connection pool limits)",
  ],
  advantages: [
    "Encourages modeling code around real domain concepts, making large codebases easier to reason about",
    "Each object is independently created, modified, and garbage-collected without affecting sibling objects",
    "Static members give a clean, well-scoped place for class-wide state or utility logic without needing a dummy instance",
  ],
  disadvantages: [
    "Overusing classes for trivial data groupings can add ceremony compared to plain structs/records or functional approaches",
    "Static state is effectively global state scoped to the class — it can introduce hidden coupling and make unit testing harder (shared mutable static fields between tests)",
    "Beginners often confuse 'the class' with 'an object of the class,' leading to bugs like expecting a static field to vary per instance",
  ],
  commonMisconceptions: [
    "\"A class occupies memory the way an object does\" — a class is just metadata/a template held by the runtime (e.g. in Java's Method Area); memory for fields is only allocated per object.",
    "\"Static methods can access instance fields directly\" — they can't, because there is no implicit `this`/object for a static method to operate on; you'd need to pass an instance in explicitly.",
    "\"`this`/`self` is optional stylistic sugar\" — it's actually how the runtime disambiguates which object's state a method call is operating on; without it (conceptually), overlapping field/parameter names would be unresolvable.",
  ],
  interviewPerspective:
    "This is the most common 'warm-up' OOP question, but interviewers use it to filter for people who genuinely understand the class/object distinction versus reciting it. Be precise: a class is a compile-time construct/blueprint, an object is a runtime instance with its own memory. Be ready to explain static vs instance members with a concrete example (why can't a static method reference `this`?), and to write a tiny class with both a constructor and a static counter field live in an interview — this combination shows up constantly as a 5-minute coding warm-up before a harder OOP design question.",
  oaPerspective:
    "OA rounds test this almost entirely through 'predict the output' snippets: static field sharing across instances, static vs instance method resolution, and constructor execution order (especially when static/instance initializer blocks are combined with `new`). Expect questions where a static counter is incremented in a constructor and you must trace how many objects were created by counting `new` calls, and questions testing whether you know static members are shared, not duplicated per object.",
  keyTakeaways: [
    "A class is a compile-time blueprint (fields + methods); an object is a runtime instance with its own memory for those fields.",
    "`this`/`self` refers to the specific object a method call is operating on, resolving ambiguity when multiple objects share a class.",
    "Instance members exist per-object; static members exist once per class, shared across every instance.",
    "Constructors run once at creation time to establish valid initial object state; a class can have multiple overloaded constructors.",
  ],
  summaryClosing:
    "Classes and objects are the atomic vocabulary of OOP — every other pillar (encapsulation, inheritance, polymorphism, abstraction) is really just a rule about how classes and objects are allowed to interact. Getting the blueprint-vs-instance distinction, and instance-vs-static scoping, completely solid here makes every subsequent OOP topic click much faster.",
  relatedTopics: ["Encapsulation & Abstraction", "Constructors, Destructors & Object Lifecycle", "Inheritance"],
  furtherReading: [
    { label: "Java Language Specification — Classes", note: "The authoritative definition of class/instance/static semantics in Java." },
    { label: "C++ Reference — Classes", note: "cppreference's treatment of class layout, `this`, and static members." },
  ],
};

export default classesObjectsArticle;
