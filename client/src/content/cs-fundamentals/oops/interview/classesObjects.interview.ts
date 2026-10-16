// src/content/cs-fundamentals/oops/interview/classesObjects.interview.ts

import type { InterviewQuestion } from "@/types";

const classesObjectsInterviewQuestions: InterviewQuestion[] = [
  {
    id: "classes-objects-iv-1",
    question: "What is the difference between a class and an object?",
    difficulty: "Easy",
    detailedAnswer:
      "A class is a compile-time construct — a blueprint that declares what fields (state) and methods (behavior) instances of it will have, but it doesn't itself hold any data for a specific 'thing.' An object is a runtime instance created from that blueprint via a constructor call (`new ClassName(...)`); it occupies its own memory, holding actual values for the fields the class declared. You can create many independent objects from the same class, each with different field values but identical behavior (methods).",
    idealAnswer:
      "I'd describe a class as a blueprint and an object as the actual thing built from it — like a car's design spec versus an individual car rolling off the assembly line. The class defines that every Car has a color and a speed and can accelerate; each object is a specific car with its own color and speed value, occupying its own memory, independent of every other Car object.",
    interviewerExpectations: [
      "Clear articulation of 'blueprint vs instance'",
      "Mentions that objects have independent memory/state",
      "Can give a concrete example unprompted",
    ],
    followUpQuestions: [
      "What's stored in memory for a class versus for an object?",
      "Can two objects of the same class have different behavior?",
      "What triggers the actual creation of an object?",
    ],
    commonMistakes: [
      "Saying 'a class is an object' or using the terms interchangeably",
      "Failing to mention that memory is only allocated at object creation, not at class declaration",
    ],
    discussionPoints: ["Blueprint vs instance", "Memory allocation timing", "Object identity vs equality"],
  },
  {
    id: "classes-objects-iv-2",
    question: "Explain the difference between static and instance members with an example.",
    difficulty: "Easy",
    detailedAnswer:
      "Instance members (fields and methods) belong to each object separately — every object gets its own copy of instance fields, and instance methods operate on the specific object they're called on via `this`/`self`. Static members belong to the class itself; there's exactly one copy shared by every instance, and static methods have no implicit object reference, so they cannot directly touch instance fields. A classic example is a static `int totalCreated` field incremented inside every constructor — it tracks how many objects have been made across the entire class, because all instances read and write the same shared field.",
    idealAnswer:
      "Instance members are per-object — if I have a `Car` class with an instance field `speed`, every car has its own independent speed. Static members are per-class — if I add a static field `numberOfCarsCreated` and increment it in the constructor, every single Car object shares that one counter, so after creating three cars, the static field reads 3 no matter which car object you check it through.",
    interviewerExpectations: [
      "Correctly identifies 'one copy per object' vs 'one copy per class'",
      "Gives a concrete, working example (often a counter)",
      "Understands static methods can't access instance state directly",
    ],
    followUpQuestions: [
      "Why can't a static method access an instance field directly?",
      "When would you deliberately choose a static method over an instance method?",
      "Are static fields thread-safe by default?",
    ],
    commonMistakes: [
      "Claiming static fields get a fresh copy per object",
      "Not knowing static methods lack a `this` reference",
    ],
    discussionPoints: ["Shared vs per-object state", "Utility/factory methods", "Thread-safety of static mutable state"],
  },
  {
    id: "classes-objects-iv-3",
    question: "What is the purpose of the `this` keyword, and can you give a scenario where omitting it would cause a bug?",
    difficulty: "Medium",
    detailedAnswer:
      "`this` (or `self` in Python) is an implicit reference to the specific object a method or constructor is currently executing on. It's essential for disambiguating between a field and a same-named parameter/local variable, and for enabling method chaining (returning `this` from a builder-style method). A classic bug: if a constructor is written as `Point(int x, int y) { x = x; y = y; }` without `this.x = x;`, the assignment `x = x` just assigns the parameter to itself — the object's actual field is left uninitialized (defaulting to 0), because the parameter `x` shadows the field `x` inside the constructor's scope.",
    idealAnswer:
      "`this` tells the runtime 'apply this operation to the object the current method call belongs to.' The most common real bug from skipping it is in constructors: if I write `Point(int x, int y) { x = x; y = y; }`, both assignments do nothing useful because the parameter name shadows the field name — I've assigned the parameter to itself, and the object's actual `x`/`y` fields silently stay at their default value of 0. Writing `this.x = x;` is what correctly assigns the parameter's value into the object's field.",
    interviewerExpectations: [
      "Correct definition of `this` as an object reference",
      "Can produce a concrete shadowing bug example",
      "Understands the default-value consequence of the bug",
    ],
    followUpQuestions: [
      "How does Python's `self` differ mechanically from Java's `this`?",
      "Can `this` be reassigned inside a method?",
      "How is `this` used in method chaining / builder patterns?",
    ],
    commonMistakes: [
      "Describing `this` only vaguely as 'referring to the class' instead of the specific object",
      "Not recognizing the shadowing bug when shown the buggy constructor",
    ],
    discussionPoints: ["Variable shadowing", "Constructor correctness", "Builder pattern chaining"],
  },
  {
    id: "classes-objects-iv-4",
    question: "If you have 100 objects of the same class, and you increment a static counter field in the constructor, will each object see a different value? Walk through what actually happens in memory.",
    difficulty: "Medium",
    detailedAnswer:
      "No — all 100 objects will see the exact same value when they read that static field, because a static field has a single storage location associated with the class itself (in Java, stored in the class's runtime data area, not in any individual object's per-instance memory). Each of the 100 constructor calls executes `counter++` against that one shared location, so after all 100 objects are constructed, the field's value is 100, and every object (or the class itself) reading `counter` sees 100 — not a per-object count. Only if the counter were an instance field would each object get its own independent copy, always resetting to whatever the constructor initializes it to.",
    idealAnswer:
      "They'd all see the same final value — say 100 after all 100 constructors have run — because a static field isn't duplicated per object; it lives once in memory tied to the class itself, and every constructor call is incrementing that single shared slot. If I actually wanted a per-object 'my ID number' style field, I'd need to assign an instance field to the current static counter's value at construction time and then increment the static counter, so each object captures a different snapshot at creation time while the static field itself keeps counting up globally.",
    interviewerExpectations: [
      "Correctly says all instances observe the same static value",
      "Explains static storage as class-level, not per-object",
      "Can describe how to actually get a per-object unique ID (snapshot pattern) if asked",
    ],
    followUpQuestions: [
      "How would you give each object a unique, sequential ID instead?",
      "Is incrementing a shared static counter from multiple threads safe?",
      "Where does the JVM actually store static fields?",
    ],
    commonMistakes: [
      "Assuming each object gets an independent copy of the static counter",
      "Confusing 'static' with 'final'/immutable",
    ],
    discussionPoints: ["Static storage location", "Thread-safety of shared static state", "Unique-ID snapshot pattern"],
  },
  {
    id: "classes-objects-iv-5",
    question:
      "You're designing a `ConnectionPool` class for a service that must never allow more than N database connections to be created at once. How would you use static members and constructor design to enforce this, and what pitfalls would you watch for in a multi-threaded environment?",
    difficulty: "Hard",
    detailedAnswer:
      "I'd make the constructor private (or package-private) and expose a static factory method (e.g. `ConnectionPool.acquire()`) that checks a static counter (or better, a static/shared collection of available connections) against the limit N before creating or handing out a connection — this prevents callers from bypassing the limit via `new ConnectionPool()` directly. The static counter itself must be protected against race conditions: two threads calling `acquire()` simultaneously could both read the counter as N-1, both pass the check, and both create a connection, breaching the limit. I'd guard the check-and-increment with a lock/synchronized block (or use an atomic counter with compare-and-swap) so the read-check-increment sequence is atomic. I'd also design object lifecycle carefully — a 'release' path that decrements the same static counter when a connection is returned to the pool, and ideally use a bounded blocking queue (like Java's `ArrayBlockingQueue`) as the actual pool data structure, since it handles the wait-if-full/wait-if-empty semantics correctly without manual counter bookkeeping.",
    idealAnswer:
      "I'd hide the constructor and force creation through a static factory method that consults a shared static counter or, better, a bounded concurrent queue holding the available connections — that's the actual enforcement mechanism, since a bare static int counter checked-then-incremented isn't atomic and two threads can race past the limit simultaneously. I'd use an AtomicInteger or a lock around the check-and-increment, or just delegate the whole thing to a data structure like ArrayBlockingQueue(N) that already handles bounded capacity and blocking correctly. I'd also make sure there's a symmetric 'release' operation that returns the connection and decrements/re-enqueues, otherwise the pool leaks capacity over time as connections are used and never returned.",
    interviewerExpectations: [
      "Uses private constructor + static factory to control instantiation",
      "Identifies the check-then-act race condition on the static counter",
      "Proposes a concrete concurrency-safe fix (atomic counter, lock, or bounded concurrent collection)",
      "Considers the release/return path, not just acquisition",
    ],
    followUpQuestions: [
      "What's the difference between `synchronized`, a `Lock`, and an `AtomicInteger` here?",
      "How would you test that the pool never exceeds N connections under concurrent load?",
      "Would you make ConnectionPool itself a singleton? Why or why not?",
    ],
    commonMistakes: [
      "Proposing a plain static int counter without addressing the race condition",
      "Forgetting the release/return-to-pool path entirely",
      "Conflating 'private constructor' alone with actual thread-safety",
    ],
    discussionPoints: ["Static factory methods", "Race conditions on shared static state", "Bounded resource pools", "Singleton vs pooled instances"],
    scenarioBased: true,
  },
];

export default classesObjectsInterviewQuestions;
