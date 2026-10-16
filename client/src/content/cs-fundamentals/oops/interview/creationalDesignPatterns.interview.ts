// src/content/cs-fundamentals/oops/interview/creationalDesignPatterns.interview.ts

import type { InterviewQuestion } from "@/types";

const creationalDesignPatternsInterviewQuestions: InterviewQuestion[] = [
  {
    id: "creational-design-patterns-iv-1",
    question: "What problem does the Singleton pattern solve, and when would you actually reach for it?",
    difficulty: "Easy",
    detailedAnswer:
      "Singleton ensures a class has exactly one instance across the entire application and provides a single, well-known access point to it — useful when having a second instance would cause inconsistency or wasted resources: a single shared configuration object, a single connection pool, a single logging service. Implementation-wise it typically means a private constructor (so external code can't call `new`), a private static field holding the one instance, and a public static `getInstance()` method that creates it on first access (or eagerly at class load) and returns the same instance thereafter.",
    idealAnswer:
      "I reach for Singleton when having more than one instance would actually be wrong for the system, not just wasteful — like a single application-wide logging service or a connection pool where a second instance would mean connections aren't actually being pooled anymore. Mechanically it's a private constructor so nobody outside can 'new' it, a private static instance field, and a public static getInstance() that returns the same object every time. I'm cautious with it though, since it's easy to reach for Singleton just because something 'feels global,' and that tends to produce hidden shared state that makes testing harder.",
    interviewerExpectations: [
      "Names the core guarantee (exactly one instance, global access point) precisely",
      "Gives a legitimate use case, not just 'when you want a global variable'",
      "Shows awareness that Singleton can be overused (sets up a natural follow-up)",
    ],
    followUpQuestions: [
      "How would you make a Singleton implementation thread-safe?",
      "What are the downsides of using Singleton too liberally?",
      "How would you unit test a class that depends on a Singleton?",
    ],
    commonMistakes: [
      "Describing Singleton as simply 'a class you don't instantiate more than once' without mentioning the private constructor / access point mechanics",
      "Not acknowledging any downside when asked generally about the pattern",
    ],
    discussionPoints: ["Private constructor + static access point", "Legitimate vs disguised-global-variable use", "Testability concerns"],
  },
  {
    id: "creational-design-patterns-iv-2",
    question: "Walk me through implementing a thread-safe Singleton in a multi-threaded environment, and explain what goes wrong with the naive version.",
    difficulty: "Medium",
    scenarioBased: true,
    detailedAnswer:
      "The naive lazy version — `if (instance == null) { instance = new Singleton(); } return instance;` with no synchronization — has a race window: two threads can both evaluate `instance == null` as true before either has assigned it, so both proceed to construct and assign, and briefly two different objects exist, one of which silently overwrites the other in the static field. There are three standard fixes. (1) Eager initialization: declare `private static final Singleton instance = new Singleton();` so the JVM's class-loading guarantees construct it exactly once, safely, before it's ever used — simple, but pays construction cost even if the Singleton is never actually used. (2) Double-checked locking: check `instance == null` outside a synchronized block (fast path once initialized), and if null, enter a `synchronized` block, check `instance == null` *again* (in case another thread constructed it while we were waiting for the lock), and only then construct — critically, the field must be declared `volatile` in Java, because without it, another thread could observe a non-null reference to a *partially constructed* object due to instruction reordering during construction. (3) Initialization-on-demand holder idiom: put the instance in a private static nested class; the JVM only loads (and thus initializes) that nested class the first time it's referenced inside `getInstance()`, and class loading itself is already thread-safe by JVM spec, so this gets lazy, thread-safe initialization with zero explicit locking overhead after the first call.",
    idealAnswer:
      "The naive version just does 'if instance is null, create it' with no synchronization, and the failure mode is that two threads can both see null at the same time and both construct their own instance — briefly you have two Singletons, and whichever assignment happens last wins, silently breaking the single-instance guarantee. My default fix is the initialization-on-demand holder idiom — put the instance as a static field inside a private static nested class, and only reference that nested class inside getInstance(); the JVM guarantees nested-class initialization is thread-safe and happens exactly once, lazily, so I get correctness with no manual locking at all. If I need a Java version that predates that idiom being idiomatic, or want something more explicit, double-checked locking works too, but it's easy to get wrong if you forget to mark the field volatile — without that, a thread could see a non-null reference to an object whose constructor hasn't fully finished running, due to reordering.",
    interviewerExpectations: [
      "Correctly explains the race window in the naive version",
      "Describes at least double-checked locking correctly, including the volatile requirement and why it's needed",
      "Bonus: mentions the holder idiom or eager initialization as alternatives",
    ],
    followUpQuestions: [
      "Why specifically does 'volatile' matter for double-checked locking in Java?",
      "What's the trade-off of eager initialization compared to lazy approaches?",
      "How does an enum-based Singleton in Java sidestep some of these issues?",
    ],
    commonMistakes: [
      "Proposing double-checked locking without mentioning volatile",
      "Claiming the naive version 'usually works fine in practice' without acknowledging it's a genuine race condition",
    ],
    discussionPoints: ["Race condition in naive lazy init", "Double-checked locking + volatile", "Holder idiom", "Eager vs lazy initialization trade-off"],
  },
  {
    id: "creational-design-patterns-iv-3",
    question: "What's the difference between Factory Method and Abstract Factory? Give an example of each.",
    difficulty: "Medium",
    detailedAnswer:
      "Factory Method defines a creation method for a *single* product type, whose concrete implementation is decided by an overriding subclass — e.g., a `Dialog` base class declares `abstract Button createButton()`, and `WindowsDialog` overrides it to return `WindowsButton` while `MacDialog` returns `MacButton`; the pattern is fundamentally about inheritance and overriding one method. Abstract Factory operates one level higher: it defines an interface for creating an entire *family* of related products, implemented by concrete factory classes, and the pattern is fundamentally about composition — client code holds a reference to a `GUIFactory` object and calls its methods (`createButton()`, `createCheckbox()`), and swapping which concrete factory (`WindowsFactory` vs `MacFactory`) you hand it swaps the entire consistent family at once. A useful way to see the relationship: an Abstract Factory's concrete implementations are often internally just a bundle of several Factory Methods, one per product in the family.",
    idealAnswer:
      "Factory Method is about one product — you override a single method in a subclass to decide the concrete type, like a Dialog base class with an abstract createButton() that WindowsDialog and MacDialog each override differently. Abstract Factory is about a whole family of products that need to stay consistent with each other — a GUIFactory interface with createButton() and createCheckbox(), where a WindowsFactory gives you both a WindowsButton and a WindowsCheckbox together, so you never end up accidentally mixing a Mac checkbox into a Windows dialog. The mental shortcut I use: Factory Method is inheritance-based and produces one thing; Abstract Factory is composition-based (you hold a factory object) and produces a matched set of things.",
    interviewerExpectations: [
      "Correctly identifies Factory Method as single-product/inheritance-based",
      "Correctly identifies Abstract Factory as family-of-products/composition-based",
      "Gives a correct, distinct example for each rather than reusing one example loosely for both",
    ],
    followUpQuestions: [
      "Can Abstract Factory be implemented using Factory Methods internally? How?",
      "When would you choose Abstract Factory over just multiple independent Factory Methods?",
      "How does this pattern pair with Dependency Inversion Principle?",
    ],
    commonMistakes: [
      "Describing them as 'basically the same thing'",
      "Mixing up which one handles 'families' vs 'a single product'",
    ],
    discussionPoints: ["Inheritance vs composition", "Single product vs product family", "Consistency guarantee across a family"],
  },
  {
    id: "creational-design-patterns-iv-4",
    question: "When would you use the Builder pattern instead of a regular constructor, and why is a 'telescoping constructor' a code smell?",
    difficulty: "Medium",
    detailedAnswer:
      "A telescoping constructor is when a class offers a growing set of overloaded constructors to handle optional parameters — `Pizza(size)`, `Pizza(size, cheese)`, `Pizza(size, cheese, pepperoni)`, and so on — which quickly becomes unreadable (callers can't tell which boolean/int at which position means what) and error-prone (easy to pass parameters in the wrong order when several are the same type). Builder solves this by exposing named, chained setter-style methods (`.setSize(LARGE).addTopping(CHEESE)`) ending in a `.build()` call that assembles the final immutable object, making construction self-documenting and letting you add validation logic incrementally or at build time. It's most valuable when a class has many optional parameters, some of which only make sense in combination, or when you want the constructed object to be immutable once built (the builder handles the mutable assembly phase; the final product doesn't need mutable setters at all).",
    idealAnswer:
      "A telescoping constructor is what you get when a class keeps adding overloaded constructors to handle every combination of optional parameters — Pizza(size), Pizza(size, cheese), Pizza(size, cheese, pepperoni) — and eventually callers can't tell what a five-argument call even means without checking the class definition, especially once you have multiple parameters of the same type. Builder fixes this with chained, named methods like setSize() and addTopping(), ending in build(), so construction reads like a sentence and you can't misplace an argument. I reach for it specifically when a class has several optional parameters or when I want the final object to be immutable — the Builder absorbs all the mutable, step-by-step assembly, and the product itself never needs a setter.",
    interviewerExpectations: [
      "Explains the telescoping constructor problem concretely (readability + parameter-order error risk)",
      "Describes Builder's chained/named method structure and .build() finalization",
      "Connects Builder to enabling immutability of the final object",
    ],
    followUpQuestions: [
      "How does a Director class fit into the Builder pattern?",
      "How would you make the built object immutable once construction finishes?",
      "Is Builder overkill for a class with only two optional parameters?",
    ],
    commonMistakes: [
      "Describing Builder purely as 'a class with setters' without connecting it to the telescoping constructor problem it fixes",
      "Missing the immutability benefit entirely",
    ],
    discussionPoints: ["Telescoping constructor code smell", "Chained/fluent method calls", "Immutability of the final built object", "Director as an optional recipe encapsulator"],
  },
  {
    id: "creational-design-patterns-iv-5",
    question:
      "You're building a game where enemies of a given type share the same base stats (health, attack, sprite, loot table structure) but each spawned enemy needs its own independent state (its own current health, its own loot instance). Constructing an enemy from scratch involves loading a sprite from disk and parsing a loot table file — both are slow. How would you use the Prototype pattern here, and what's the one bug you must avoid?",
    difficulty: "Hard",
    scenarioBased: true,
    detailedAnswer:
      "Prototype fits directly: create one fully-configured 'template' `Enemy` instance per enemy type at load time (paying the sprite-loading and loot-table-parsing cost exactly once), and spawn every actual in-game enemy by cloning that template rather than re-running the expensive setup for each spawn. The one bug that must be avoided is a shallow clone: if `Enemy.clone()` is implemented via a naive `Object.clone()` or a hand-rolled clone that copies reference fields directly, then every cloned enemy's `lootTable` (and any other mutable reference field, like a `currentBuffs` list) would point at the *same* underlying object as the template and every other clone — one enemy picking up loot or gaining a buff would corrupt the shared state for every enemy of that type simultaneously. The fix is a deep-copy-aware `clone()`: primitive fields (current health, attack) copy fine by value, the shared immutable data (sprite image, base stats) can legitimately be shared by reference since it never changes per-instance, but any per-instance *mutable* state (loot table instance, buffs, current health if tracked via a mutable object rather than a primitive) must be explicitly deep-copied inside `clone()` so each spawned enemy owns independent state.",
    idealAnswer:
      "This is exactly what Prototype is for — I'd build one fully set-up template Enemy per type at load time, doing the expensive sprite loading and loot-table parsing exactly once, and then every actual spawn just clones that template instead of redoing all that work. The bug I'd be paranoid about is a shallow clone: if clone() just copies references, every spawned enemy's loot table object is literally the same object as the template's and every sibling enemy's, so one enemy looting an item would silently show up as looted for every enemy of that type. My rule for writing clone() here: things that are genuinely shared and immutable — like the sprite image, or base stat definitions — are fine to share by reference, but anything mutable and meant to be per-instance, like the loot table instance or current health if it's not a plain primitive, has to be explicitly deep-copied inside clone(), not just field-copied.",
    interviewerExpectations: [
      "Correctly identifies Prototype as the fitting pattern and explains the cost-avoidance motivation (expensive setup done once)",
      "Names the specific bug: shallow clone causing shared mutable state across supposedly-independent clones",
      "Distinguishes which fields are safe to share by reference (immutable/shared) vs which must be deep-copied (mutable/per-instance)",
    ],
    followUpQuestions: [
      "How would you implement this in Java using Cloneable, or in C++ using a copy constructor?",
      "What if the loot table itself needs to be shared read-only across enemies of the same type, but each enemy's inventory (looted items) must be independent?",
      "How does this connect back to the shallow-vs-deep-copy discussion from object lifecycle/constructors?",
    ],
    commonMistakes: [
      "Proposing Prototype without addressing the deep-copy requirement at all",
      "Deep-copying everything indiscriminately, including data that's genuinely safe and more efficient to share (like the immutable sprite)",
    ],
    discussionPoints: ["Prototype for expensive-to-construct objects", "Shallow vs deep copy in clone()", "Distinguishing shared-immutable vs per-instance-mutable state"],
  },
];

export default creationalDesignPatternsInterviewQuestions;
