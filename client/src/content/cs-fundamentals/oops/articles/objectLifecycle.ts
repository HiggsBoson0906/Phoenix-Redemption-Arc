// src/content/cs-fundamentals/oops/articles/objectLifecycle.ts

import type { Article } from "@/types";

const objectLifecycleArticle: Article = {
  slug: "object-lifecycle",
  title: "Constructors, Destructors & Object Lifecycle",
  summary:
    "An object's lifecycle runs from allocation through construction, use, and destruction — constructors guarantee an object starts in a valid state, and destructors guarantee resources are released deterministically or by the garbage collector.",
  readingTimeMins: 9,
  beginnerExplanation:
    "Think of a constructor as move-in day for a new tenant: before anyone can live in the object, the constructor sets up the essentials — assigns default values, opens connections, allocates memory — so the object is never observed in a half-built state. A destructor is the move-out crew: when the object's life is over, it cleans up whatever the constructor (or the object during its life) acquired, like closing a file handle or releasing a network socket.\n\nEvery object goes through the same three phases: birth (allocation + construction), life (method calls that read/mutate its state), and death (destruction + deallocation). Getting the birth and death phases right is what separates code that reliably works from code that leaks memory, double-frees resources, or crashes on an uninitialized field.",
  detailedBreakdown:
    "A class can define several kinds of constructors. A default constructor takes no arguments and sets fields to sane defaults (in C++, if you write no constructor at all, the compiler generates a trivial one that does member-wise default-initialization; in Java, the compiler only supplies a no-arg default constructor if you declare no constructors at all). A parameterized constructor takes arguments so the caller can specify initial state at creation time — this is the normal way to enforce 'objects must always be valid,' since you can require the necessary fields as constructor parameters rather than leaving them settable-later. A copy constructor builds a new object as a copy of an existing one of the same type (`Point(const Point& other)` in C++, or a manually written copy constructor/copy method in Java since Java doesn't synthesize one).\n\nShallow vs. deep copy is the single most interview-tested nuance here. A shallow copy (the compiler-generated default copy constructor in C++, or Java's `Object.clone()` without overriding) copies each field's bits directly — for primitive fields that's correct, but for a field that is a pointer/reference to heap-allocated data, both the original and the copy end up pointing at the *same* underlying object. Mutating one affects the other, and worse, when both objects are destroyed, the same memory gets freed twice (a double-free — undefined behavior in C++, though Java's GC sidesteps the crash by being reference-counted/traced rather than manually freed). A deep copy instead allocates fresh memory for any owned heap data and copies the pointed-to values, giving the copy fully independent state. Any class that manually manages a resource (raw pointer, file handle, socket) needs a hand-written copy constructor/assignment operator (or must explicitly delete them) — this is part of C++'s 'Rule of Three/Five': if you need a custom destructor, copy constructor, or copy assignment operator, you almost certainly need all three (plus move constructor/move assignment in the 'Rule of Five').\n\nDestructor timing differs fundamentally by language. In C++, destructors run deterministically: a stack-allocated object's destructor runs the instant it goes out of scope, and a heap-allocated object's destructor runs the instant `delete` is called on it — this determinism is the foundation of RAII (Resource Acquisition Is Initialization), where a resource's lifetime is bound to an object's lifetime, so acquiring a lock, opening a file, or allocating memory in a constructor and releasing it in the destructor guarantees cleanup even if an exception is thrown mid-function (the stack unwinds and destructors still run). In Java and most garbage-collected languages, there is no destructor with guaranteed timing — `finalize()` (deprecated/removed in modern Java) and even `try-with-resources`/`AutoCloseable.close()` are different mechanisms: `close()` is deterministic (like a destructor) but must be invoked explicitly or via try-with-resources, whereas actual garbage collection of the object's memory happens at an unspecified future time chosen by the GC, not tied to scope exit.\n\nInitialization order is a frequent bug source: in C++, base class subobjects and member fields are constructed in declaration order (member fields in the order they're *declared* in the class, not the order they appear in the constructor's initializer list — mismatching these silently reorders execution and can read uninitialized members), and the base class constructor always runs before the derived class constructor body. Destructors run in the exact reverse order: derived destructor body first, then member destructors, then base class destructor last. Static members belong to the class itself rather than any instance — a `static int count` shared across all objects is initialized once, before `main()` (in C++) or lazily on class load (in Java), and static/class initializer blocks (`static { ... }` in Java) run exactly once per class, before any instance is created, making them the right place for one-time setup like loading configuration shared by every instance.",
  realWorldExamples:
    "A `DatabaseConnection` class in Java uses `try-with-resources` (`implements AutoCloseable`) so that whether the method returns normally or throws, `close()` releases the underlying socket and connection-pool slot deterministically — the same guarantee C++'s RAII gives you automatically via destructors on a stack-allocated `std::fstream` or `std::lock_guard`. A `std::vector`-like custom container class in C++ needs a hand-written copy constructor and destructor because it owns a raw heap-allocated buffer — the compiler's default shallow copy would let two vectors point at (and eventually double-free) the same buffer, which is exactly the bug that motivated C++'s Rule of Three. Static counters (`static int idCounter` incremented in every constructor call) are the standard way interview problems ask you to implement 'assign each object a unique auto-incrementing ID.'",
  useCases: [
    "Guaranteeing an object is never observed in a partially-initialized state (constructor enforces required fields)",
    "Deterministic resource cleanup — closing files, releasing locks, freeing manually-managed memory (RAII in C++, try-with-resources in Java)",
    "Deep-copying objects that own heap-allocated or externally-owned resources so copies don't alias the original's internals",
    "Tracking cross-instance state (e.g., total object count, shared configuration) via static fields and static initializer blocks",
  ],
  advantages: [
    "Constructors centralize and enforce valid initial state, eliminating a whole class of 'used before initialized' bugs",
    "RAII-style destructors make resource cleanup automatic and exception-safe, rather than relying on the caller to remember to clean up",
    "Deep copy semantics, when correctly implemented, let objects be duplicated safely without hidden aliasing",
    "Static members/blocks provide a clean, well-defined place for one-time, class-wide initialization",
  ],
  disadvantages: [
    "Manual resource management (C++) requires disciplined implementation of copy/move constructors and destructors, or the Rule of Five — easy to get wrong",
    "Garbage-collected languages give up deterministic destruction, so relying on 'finalizers' for timely cleanup is unreliable and generally discouraged",
    "Shallow copy bugs (aliased pointers, double frees) are subtle, often not caught until production under specific object-lifetime conditions",
    "Complex initialization order across inheritance hierarchies (base constructors, member declaration order) can be a source of hard-to-spot bugs",
  ],
  commonMisconceptions: [
    "\"Java has destructors\" — Java has no deterministic destructor; `finalize()` was unreliable and is deprecated/removed, and `close()`/try-with-resources is a different, application-level mechanism you must invoke, not the GC's own cleanup.",
    "\"The default copy constructor is always fine\" — it's fine only when every field is a value type or an object the class doesn't uniquely own; the moment a field is a raw pointer/handle to owned resources, shallow copy creates dangerous aliasing.",
    "\"Static fields are initialized in the constructor\" — static fields belong to the class and are initialized once (via static initializers), independent of how many instances are ever constructed, or even if none are.",
    "\"C++ member initializer list order follows what I typed\" — it always follows declaration order in the class body; the initializer list's written order is cosmetic and mismatches can cause subtle bugs when one member's initializer depends on another.",
  ],
  interviewPerspective:
    "Interviewers use this topic to check whether you actually understand memory ownership, not just syntax: expect 'implement a copy constructor for a class with a raw pointer member and explain why the default one is dangerous,' 'what is RAII and why does C++ favor it over garbage collection for resource management,' and 'walk through base-to-derived constructor and destructor call order in an inheritance chain.' A strong answer always ties the concept back to a concrete bug (double-free, resource leak, use of uninitialized memory) rather than reciting definitions.",
  oaPerspective:
    "OA questions often show a short C++/Java snippet with a class that has a pointer/reference member and ask what happens when it's copied (shallow copy bug) or destroyed twice, or ask you to trace constructor/destructor call order across a small inheritance hierarchy. Expect direct questions on 'which constructor is called when' (default vs parameterized vs copy) and on where static blocks execute relative to instance construction.",
  keyTakeaways: [
    "Constructors guarantee valid initial state; C++ generates a trivial default one only if you declare no constructors at all, Java similarly only if none are declared.",
    "Deep copy allocates independent memory for owned resources; shallow copy just copies references/pointers and can cause aliasing and double-frees.",
    "RAII binds resource lifetime to object lifetime via deterministic C++ destructors; garbage-collected languages need explicit close()/try-with-resources instead since GC timing isn't deterministic.",
    "Construction order: base class first, then members in declaration order, then the constructor body; destruction is the exact reverse.",
    "Static members belong to the class, not instances, and static initializer blocks run once, before any instance is created.",
  ],
  summaryClosing:
    "Object lifecycle is where OOP theory meets real resource management — get construction, copying, and destruction right and your objects are self-consistent and leak-free; get them wrong and you've written the exact class of bugs (uninitialized reads, double-frees, resource leaks) that interviewers most love to probe.",
  relatedTopics: ["Classes & Objects", "Inheritance", "Encapsulation & Abstraction"],
  furtherReading: [
    { label: "C++ Rule of Three/Five/Zero", note: "Canonical guidance on when you must define copy/move constructors and destructors together." },
    { label: "Java try-with-resources (AutoCloseable)", note: "The deterministic-cleanup alternative to destructors in a garbage-collected language." },
  ],
};

export default objectLifecycleArticle;
