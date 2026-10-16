// src/content/cs-fundamentals/oops/top-40.ts
// The 40 highest-frequency Object-Oriented Programming interview questions
// across product companies, startups, service companies, and FAANG-style loops.

import type { Top40Question } from "@/types";

const oopsTop40: Top40Question[] = [
  {
    id: "oops-top40-1",
    rank: 1,
    question: "What are the four pillars of Object-Oriented Programming?",
    difficulty: "Easy",
    frequency: "Very High",
    shortAnswer:
      "Encapsulation (bundling data and behavior, controlling access), Abstraction (hiding implementation complexity behind a simple interface), Inheritance (reusing/extending behavior from a parent class), and Polymorphism (the same interface behaving differently depending on the actual object type).",
    detailedAnswer:
      "These four pillars work together, not in isolation — encapsulation protects an object's internal state, abstraction defines what it exposes, inheritance lets related types share and extend behavior, and polymorphism lets calling code work with those related types uniformly through a common interface.",
    deepExplanation:
      "A strong answer gives one crisp example per pillar rather than just definitions — e.g. encapsulation via private fields with getters, abstraction via an interface hiding a complex algorithm, inheritance via a Shape base class, polymorphism via calling `.area()` on different shape subtypes and getting the correct behavior for each.",
    realWorldRelevance:
      "Every mainstream OOP language (Java, C++, C#, Python) is designed around enabling these four pillars, and virtually every OOP interview begins with this question as a warm-up before going deeper into any one pillar.",
    keywords: ["encapsulation", "abstraction", "inheritance", "polymorphism"],
    commonMistakes: ["Only listing the four terms without a concrete example for each"],
    relatedTopics: ["Encapsulation & Abstraction", "Inheritance", "Polymorphism"],
    followUpQuestions: ["Give a concrete code example of polymorphism.", "How are encapsulation and abstraction actually different?"],
    tags: ["Must Know"],
    companyStyleTags: ["Startup-style", "Amazon-style"],
  },
  {
    id: "oops-top40-2",
    rank: 2,
    question: "What's the difference between encapsulation and abstraction? They're often confused.",
    difficulty: "Medium",
    frequency: "Very High",
    shortAnswer:
      "Encapsulation is about bundling data with the methods that operate on it and restricting direct access (an implementation technique, achieved via access modifiers); abstraction is about exposing only essential behavior while hiding complexity (a design concept, achieved via interfaces/abstract classes).",
    detailedAnswer:
      "Encapsulation answers 'how do we protect and bundle this data' (a private field with a public getter); abstraction answers 'what should the outside world even need to know about this' (a `Vehicle` interface with a `drive()` method, hiding entirely how driving is implemented for each vehicle type).",
    deepExplanation:
      "A useful way to keep them straight: encapsulation is about ACCESS CONTROL of data; abstraction is about COMPLEXITY HIDING of behavior — you can have one without emphasizing the other, though real OOP designs use both together constantly.",
    realWorldRelevance:
      "A car's steering wheel and pedals are abstraction (you don't need to know the engine internals to drive); the car's locked hood and sealed engine compartment are encapsulation (you're restricted from directly touching the internals) — a commonly used analogy that maps cleanly to the technical distinction.",
    keywords: ["access control vs complexity hiding", "getters/setters vs interfaces"],
    commonMistakes: ["Treating the two terms as interchangeable synonyms"],
    relatedTopics: ["Encapsulation & Abstraction"],
    followUpQuestions: ["Can you have abstraction without encapsulation, or vice versa?", "How does an interface achieve abstraction specifically?"],
    tags: ["Must Know", "Frequently Asked"],
    companyStyleTags: ["Amazon-style", "Google-style", "Startup-style"],
  },
  {
    id: "oops-top40-3",
    rank: 3,
    question: "What's the difference between method overloading and method overriding?",
    difficulty: "Easy",
    frequency: "Very High",
    shortAnswer:
      "Overloading is having multiple methods with the SAME name but different parameter signatures within the same class (resolved at compile time); overriding is a subclass providing its OWN implementation of a method already defined in its parent class with the SAME signature (resolved at runtime based on the actual object type).",
    detailedAnswer:
      "Overloading is a form of compile-time (static) polymorphism — the compiler picks the right method based on the arguments used at the call site; overriding is a form of runtime (dynamic) polymorphism — the actual method that runs depends on the real object type, decided at runtime, even if the calling code only knows the base type.",
    deepExplanation:
      "Overriding requires the exact same method signature and typically requires the base method to be marked overridable (`virtual` in C++, overridable-by-default in Java unless `final`) — a method with the same name but different parameters in a subclass is actually overloading, not overriding, a subtlety worth stating explicitly.",
    realWorldRelevance:
      "Overriding is precisely what enables polymorphic code like `for (Shape s : shapes) s.draw()` calling the correct `draw()` implementation for each shape type at runtime, which is foundational to extensible OOP design.",
    keywords: ["compile-time vs runtime polymorphism", "same signature (override) vs different signature (overload)"],
    commonMistakes: ["Confusing a same-name-different-parameters subclass method with overriding"],
    relatedTopics: ["Polymorphism", "Inheritance"],
    followUpQuestions: ["What is a vtable and how does it relate to method overriding?", "Can you overload constructors? Give an example."],
    tags: ["Must Know", "Frequently Asked"],
    companyStyleTags: ["Amazon-style", "Microsoft-style"],
  },
  {
    id: "oops-top40-4",
    rank: 4,
    question: "What is the diamond problem in multiple inheritance, and how do different languages handle it?",
    difficulty: "Hard",
    frequency: "High",
    shortAnswer:
      "The diamond problem occurs when a class inherits from two classes that both inherit from a common base class, creating ambiguity about which inherited version of a shared method/field to use. Java avoids it by disallowing multiple class inheritance entirely (allowing multiple INTERFACE implementation instead); C++ allows multiple inheritance but requires explicit disambiguation or virtual inheritance to solve it.",
    detailedAnswer:
      "In C++, if classes B and C both inherit from A, and class D inherits from both B and C, D ends up with two separate copies of A's members unless A is inherited virtually (`virtual public A`), which ensures only one shared instance of A exists in D.",
    deepExplanation:
      "Java's design choice — single class inheritance but multiple interface implementation — sidesteps the diamond problem structurally rather than solving it at the language-mechanics level, which is exactly why interviewers ask this: it tests whether you understand WHY Java made that specific design trade-off.",
    realWorldRelevance:
      "This exact ambiguity is why many modern languages (Java, C#) deliberately restrict multiple class inheritance while still allowing the flexibility of implementing multiple interfaces, treating it as a solved design problem rather than a language limitation.",
    keywords: ["virtual inheritance", "single class inheritance + multiple interfaces"],
    commonMistakes: ["Not knowing why Java disallows multiple class inheritance specifically because of this problem"],
    relatedTopics: ["Inheritance", "Abstract Classes & Interfaces"],
    followUpQuestions: ["How does C++'s virtual inheritance actually resolve this?", "Why can a class implement multiple interfaces but extend only one class?"],
    tags: ["Advanced"],
    companyStyleTags: ["Google-style", "Microsoft-style"],
  },
  {
    id: "oops-top40-5",
    rank: 5,
    question: "What's the difference between an abstract class and an interface? When would you use each?",
    difficulty: "Medium",
    frequency: "Very High",
    shortAnswer:
      "An abstract class can have both implemented and unimplemented (abstract) methods, constructors, and instance state, but a class can only extend one; an interface traditionally declares only method signatures (modern languages allow default implementations too) with no state, and a class can implement many interfaces.",
    detailedAnswer:
      "Use an abstract class when related classes share significant common implementation/state and a clear 'is-a' hierarchy exists; use an interface when you want to define a capability/contract (like `Comparable` or `Serializable`) that unrelated classes across different hierarchies can all implement.",
    deepExplanation:
      "Modern Java interfaces supporting default methods have blurred this distinction somewhat, but the core difference remains: interfaces still can't hold instance state (fields with per-object values) the way abstract classes can, and multiple interface implementation is unrestricted while abstract class inheritance is still single.",
    realWorldRelevance:
      "A classic real design choice: `Animal` might be an abstract class (shared state like `name`, `age`), while `Comparable` or `Flyable` would be interfaces — capabilities that cut across unrelated class hierarchies (a `Bird` and a `Plane` can both be `Flyable` despite no shared ancestry).",
    keywords: ["shared state + single inheritance (abstract class)", "capability contract + multiple implementation (interface)"],
    commonMistakes: ["Saying interfaces 'can never have any implementation' without acknowledging default methods in modern languages"],
    relatedTopics: ["Abstract Classes & Interfaces"],
    followUpQuestions: ["Can an abstract class have a constructor? Why would it need one if it can't be instantiated directly?", "What are default methods in Java interfaces?"],
    tags: ["Must Know", "Frequently Asked"],
    companyStyleTags: ["Amazon-style", "Microsoft-style", "Startup-style"],
  },
  {
    id: "oops-top40-6",
    rank: 6,
    question: "What is the difference between composition and inheritance? Why is 'favor composition over inheritance' common advice?",
    difficulty: "Hard",
    frequency: "High",
    shortAnswer:
      "Inheritance models an 'is-a' relationship by extending a base class, tightly coupling subclass to superclass implementation details; composition models a 'has-a' relationship by including an instance of another class as a field, achieving code reuse with much looser coupling and more runtime flexibility.",
    detailedAnswer:
      "Inheritance can lead to fragile hierarchies — changing a base class can unexpectedly break subclasses relying on its exact internal behavior (the 'fragile base class' problem), and deep hierarchies become hard to reason about; composition avoids this since the composed object is used only through its own public interface, and can even be swapped at runtime.",
    deepExplanation:
      "This is precisely why the Strategy pattern (composing a behavior object rather than inheriting to get that behavior) is favored in many modern designs — it achieves the same 'different behavior for different cases' goal as inheritance-based polymorphism, but with a swappable, more testable, more loosely-coupled structure.",
    realWorldRelevance:
      "'Favor composition over inheritance' is one of the most repeated pieces of OOP design advice specifically because deep inheritance hierarchies are a well-documented, recurring source of maintenance pain in large real-world codebases.",
    keywords: ["is-a vs has-a", "fragile base class problem", "Strategy pattern"],
    commonMistakes: ["Treating this as 'inheritance is always bad' rather than a nuanced trade-off"],
    relatedTopics: ["Association, Aggregation & Composition", "Structural & Behavioral Design Patterns"],
    followUpQuestions: ["What is the fragile base class problem, concretely?", "Give an example of refactoring an inheritance-based design into a composition-based one."],
    tags: ["Advanced"],
    companyStyleTags: ["Google-style", "Amazon-style"],
  },
  {
    id: "oops-top40-7",
    rank: 7,
    question: "What's the difference between aggregation and composition?",
    difficulty: "Medium",
    frequency: "High",
    shortAnswer:
      "Both are 'has-a' relationships, but composition means the contained object's lifecycle is bound to the container (it's destroyed when the container is — e.g. a House and its Rooms); aggregation means the contained object can exist independently of the container (e.g. a University and its Students, who exist before/after enrollment).",
    detailedAnswer:
      "In composition, the 'part' typically has no meaningful existence outside the 'whole' and is usually created/owned entirely by it; in aggregation, the 'part' is usually passed in or referenced, and could be shared across or outlive multiple containers.",
    deepExplanation:
      "The lifecycle dependency is the precise technical distinction, not just 'how strong the relationship feels' — this is the detail interviewers specifically check for, since many candidates describe the difference vaguely rather than in terms of object lifetime.",
    realWorldRelevance:
      "This distinction matters concretely for memory management and design correctness — deep-copying or cascade-deleting a composed object is usually correct, doing the same to an aggregated object would incorrectly destroy something that should have survived independently.",
    keywords: ["lifecycle dependency", "has-a relationship spectrum"],
    commonMistakes: ["Describing the difference only as 'strong vs weak' without mentioning lifecycle ownership specifically"],
    relatedTopics: ["Association, Aggregation & Composition"],
    followUpQuestions: ["Give an example of aggregation and one of composition from a real domain model.", "How does this distinction affect how you'd write a destructor/cleanup logic?"],
    tags: ["Frequently Asked"],
    companyStyleTags: ["Amazon-style", "Microsoft-style"],
  },
  {
    id: "oops-top40-8",
    rank: 8,
    question: "Explain the Liskov Substitution Principle with an example of a violation.",
    difficulty: "Hard",
    frequency: "High",
    shortAnswer:
      "LSP states that objects of a subclass should be substitutable for objects of their base class without breaking the correctness of the program — a subtype must honor the base type's behavioral contract, not just its method signatures. The classic violation example: a Square extending Rectangle that overrides setWidth/setHeight to keep both sides equal, breaking code that assumes setting width and height independently works as it does for any Rectangle.",
    detailedAnswer:
      "The Square/Rectangle example is subtle because it's geometrically valid ('a square IS a rectangle') but behaviorally wrong for OOP purposes — code written against the Rectangle contract (assuming width and height can vary independently) breaks silently when handed a Square, even though it type-checks fine.",
    deepExplanation:
      "This is exactly why LSP is considered the hardest SOLID principle to internalize — it's not a structural/syntactic rule the compiler can check, but a BEHAVIORAL contract that requires the subtype to preserve the base type's invariants and expectations, which requires actual design judgment, not just correct inheritance syntax.",
    realWorldRelevance:
      "LSP violations are a common real root cause of 'this works for most subclasses but breaks for this one specific type' bugs in production object hierarchies, especially ones that grew organically without this principle in mind.",
    keywords: ["behavioral substitutability", "Square/Rectangle classic example"],
    commonMistakes: ["Reducing LSP to 'subclasses should work wherever the base class is used' without explaining the BEHAVIORAL contract nuance"],
    relatedTopics: ["SOLID Principles"],
    followUpQuestions: ["How would you redesign the Square/Rectangle hierarchy to avoid this violation?", "Is LSP checkable by a compiler, or does it require design judgment?"],
    tags: ["Advanced"],
    companyStyleTags: ["Google-style", "Amazon-style"],
  },
  {
    id: "oops-top40-9",
    rank: 9,
    question: "What is the Single Responsibility Principle, and why does it matter?",
    difficulty: "Medium",
    frequency: "High",
    shortAnswer:
      "SRP states that a class should have only one reason to change — i.e., one clearly-defined responsibility — rather than mixing multiple unrelated concerns (like business logic, persistence, and formatting) into a single class.",
    detailedAnswer:
      "A class violating SRP (e.g. a `Report` class that both calculates report data AND formats it AND saves it to a file) tends to be harder to test, harder to reuse, and more likely to need changes for unrelated reasons — splitting these into a calculator, a formatter, and a persister each with one job addresses this.",
    deepExplanation:
      "'One reason to change' is a more precise framing than the often-misquoted 'a class should do one thing,' since a class can legitimately have several related methods as long as they all serve the SAME responsibility/reason for changing.",
    realWorldRelevance:
      "SRP violations are one of the most common real code-smell findings in code review — a class that keeps needing changes for seemingly unrelated reasons is a strong practical signal it's actually bundling multiple responsibilities.",
    keywords: ["one reason to change", "separation of concerns"],
    commonMistakes: ["Oversimplifying SRP to 'one method per class' rather than 'one responsibility, which can span several related methods'"],
    relatedTopics: ["SOLID Principles"],
    followUpQuestions: ["Give an example of a class violating SRP and how you'd refactor it.", "How does SRP relate to high cohesion?"],
    tags: ["Frequently Asked"],
    companyStyleTags: ["Amazon-style", "Startup-style"],
  },
  {
    id: "oops-top40-10",
    rank: 10,
    question: "What is the Open/Closed Principle?",
    difficulty: "Medium",
    frequency: "High",
    shortAnswer:
      "A class/module should be open for extension but closed for modification — you should be able to add new behavior without changing existing, already-tested code, typically achieved via abstraction (interfaces/polymorphism) so new cases are added as new classes rather than new conditional branches in existing code.",
    detailedAnswer:
      "A classic violation is a method with a long `if/else` or `switch` chain checking a type field to decide behavior — every new type requires modifying that existing method (risking breaking existing cases); the OCP-compliant fix is polymorphism: each type implements its own version of the behavior, and adding a new type means adding a new class, not touching existing code.",
    deepExplanation:
      "OCP and polymorphism are deeply connected — polymorphic dispatch (calling `shape.area()` and letting each subtype provide its own implementation) is precisely the mechanism that makes OCP achievable in practice, rather than it being an abstract aspiration.",
    realWorldRelevance:
      "Plugin architectures and strategy-pattern-based designs are real, common applications of OCP — new functionality (a new payment method, a new export format) is added as a new implementation of an existing interface, without touching the code that already works.",
    keywords: ["extension without modification", "polymorphism over conditionals"],
    commonMistakes: ["Not connecting OCP concretely to replacing conditional type-checks with polymorphic dispatch"],
    relatedTopics: ["SOLID Principles", "Polymorphism"],
    followUpQuestions: ["Refactor a type-checking if/else chain into an OCP-compliant design.", "How does the Strategy pattern help satisfy OCP?"],
    tags: ["Frequently Asked"],
    companyStyleTags: ["Amazon-style", "Google-style"],
  },
  {
    id: "oops-top40-11",
    rank: 11,
    question: "What is the Interface Segregation Principle?",
    difficulty: "Medium",
    frequency: "Medium",
    shortAnswer:
      "Clients shouldn't be forced to depend on methods they don't use — favor several small, focused interfaces over one large, general-purpose interface that forces implementers to provide (or stub out) methods irrelevant to them.",
    detailedAnswer:
      "A classic violation: a single `Worker` interface with `work()` and `eat()` methods, forced onto a `RobotWorker` class that has no meaningful implementation for `eat()` — splitting into separate `Workable` and `Eatable` interfaces lets `RobotWorker` implement only what actually applies to it.",
    deepExplanation:
      "ISP is essentially SRP applied specifically to interfaces rather than classes — the same underlying idea (don't bundle unrelated responsibilities together) applied at the contract-definition level instead of the implementation level.",
    realWorldRelevance:
      "Bloated 'god interfaces' that accumulate methods over time (often from convenience rather than design) are a common real symptom of ISP violation, usually surfacing as classes with empty or exception-throwing stub method implementations.",
    keywords: ["small focused interfaces", "avoiding forced unused-method implementations"],
    commonMistakes: ["Not recognizing ISP as SRP's interface-level counterpart"],
    relatedTopics: ["SOLID Principles", "Abstract Classes & Interfaces"],
    followUpQuestions: ["What's a code smell that signals an ISP violation?", "How does ISP relate to the Single Responsibility Principle?"],
    tags: ["Frequently Asked"],
    companyStyleTags: ["Amazon-style", "Microsoft-style"],
  },
  {
    id: "oops-top40-12",
    rank: 12,
    question: "What is the Dependency Inversion Principle, and how does it relate to dependency injection?",
    difficulty: "Hard",
    frequency: "High",
    shortAnswer:
      "High-level modules shouldn't depend directly on low-level modules — both should depend on abstractions (interfaces); dependency injection is a common practical TECHNIQUE for achieving this, where a class receives its dependencies (as interfaces) from outside rather than constructing concrete implementations itself.",
    detailedAnswer:
      "Without DIP, a high-level `OrderService` directly instantiating a concrete `MySQLDatabase` class is tightly coupled to that specific implementation; with DIP, `OrderService` depends on a `Database` interface, and the concrete implementation (MySQL, Postgres, an in-memory fake for testing) is supplied from outside — inverting the direction of the dependency.",
    deepExplanation:
      "DIP is a PRINCIPLE (a design goal: depend on abstractions); dependency injection is a PATTERN/TECHNIQUE (a mechanism: pass dependencies in via constructor/setter/framework) commonly used to achieve that goal — conflating the two is one of the most common mix-ups in this area.",
    realWorldRelevance:
      "This principle is exactly what makes unit testing practical in real codebases — injecting a fake/mock implementation of a dependency (like a test double for a database or external API) instead of the real one is only possible because the high-level code depends on an abstraction, not a concrete class.",
    keywords: ["depend on abstractions", "dependency injection as a technique for DIP"],
    commonMistakes: ["Treating 'Dependency Inversion' and 'Dependency Injection' as the exact same thing rather than principle vs technique"],
    relatedTopics: ["SOLID Principles", "Abstract Classes & Interfaces"],
    followUpQuestions: ["How does DIP make unit testing easier?", "Give an example of inverting a concrete dependency into an interface."],
    tags: ["Advanced"],
    companyStyleTags: ["Google-style", "Amazon-style"],
  },
  {
    id: "oops-top40-13",
    rank: 13,
    question: "What is the Singleton pattern, and what are the risks of using it?",
    difficulty: "Medium",
    frequency: "Very High",
    shortAnswer:
      "Singleton ensures a class has exactly one instance and provides a single global access point to it (via a private constructor and a static accessor method) — commonly used for shared resources like configuration or a connection pool, but risks include hidden global state, tight coupling, and thread-safety bugs if not implemented carefully in concurrent code.",
    detailedAnswer:
      "A naive Singleton implementation can create two instances under concurrent first-access in a multi-threaded environment unless properly synchronized (e.g. via double-checked locking, an eagerly-initialized static instance, or a language-level guarantee like Java's enum singleton or static initialization holder pattern).",
    deepExplanation:
      "Singleton is also one of the most criticized design patterns in modern practice specifically because it introduces global mutable state and hidden dependencies, making unit testing harder (you can't easily swap in a test double) — many teams prefer dependency injection of a single shared instance instead of a true Singleton pattern.",
    realWorldRelevance:
      "Logger instances and application-wide configuration objects are classic legitimate Singleton use cases, but overusing Singleton for general object sharing is a widely recognized anti-pattern in real production codebases.",
    keywords: ["private constructor + static accessor", "thread-safety", "hidden global state criticism"],
    commonMistakes: ["Not mentioning thread-safety concerns in a multi-threaded implementation"],
    relatedTopics: ["Creational Design Patterns"],
    followUpQuestions: ["How would you make a Singleton thread-safe in Java or C++?", "Why is Singleton considered an anti-pattern by some engineers?"],
    tags: ["Must Know", "Frequently Asked"],
    companyStyleTags: ["Amazon-style", "Google-style", "Startup-style"],
  },
  {
    id: "oops-top40-14",
    rank: 14,
    question: "What's the difference between Factory Method and Abstract Factory patterns?",
    difficulty: "Hard",
    frequency: "Medium",
    shortAnswer:
      "Factory Method defines a single method for creating ONE type of product, letting subclasses decide which concrete class to instantiate; Abstract Factory provides an interface for creating FAMILIES of related products (multiple factory methods bundled together), ensuring the products created together are compatible with each other.",
    detailedAnswer:
      "A Factory Method might be `createButton()` overridden per platform to return the right button type; an Abstract Factory would be a `UIFactory` interface with `createButton()` AND `createCheckbox()` AND `createScrollbar()` together, so a `WindowsUIFactory` guarantees you get a consistent, compatible set of Windows-style widgets rather than mixing styles.",
    deepExplanation:
      "Abstract Factory is often implemented USING multiple Factory Methods internally — the two patterns aren't mutually exclusive; Abstract Factory is really 'one level up' in scope, coordinating creation of related object families rather than a single product type.",
    realWorldRelevance:
      "Cross-platform UI toolkits are the textbook real-world use case for Abstract Factory, ensuring visually and behaviorally consistent widget families per platform without scattering platform-check conditionals throughout application code.",
    keywords: ["single product (Factory Method)", "product families (Abstract Factory)"],
    commonMistakes: ["Treating the two patterns as interchangeable rather than differing in scope"],
    relatedTopics: ["Creational Design Patterns"],
    followUpQuestions: ["When would you choose Abstract Factory over a simple Factory Method?", "How does the Builder pattern differ from these two?"],
    tags: ["Advanced"],
    companyStyleTags: ["Google-style", "Microsoft-style"],
  },
  {
    id: "oops-top40-15",
    rank: 15,
    question: "What is the Builder pattern, and when would you use it over a constructor with many parameters?",
    difficulty: "Medium",
    frequency: "High",
    shortAnswer:
      "The Builder pattern constructs a complex object step-by-step via chained method calls, each setting one aspect of the object, finishing with a `build()` call — used instead of a constructor with many parameters (a 'telescoping constructor') to make object creation more readable and to allow optional parameters without needing dozens of constructor overloads.",
    detailedAnswer:
      "Without Builder, supporting many optional parameters typically means either a huge constructor (error-prone — easy to mix up parameter order, especially for same-typed parameters) or many overloaded constructors covering different combinations (the 'telescoping constructor' anti-pattern); Builder solves both by using descriptively-named methods for each optional field.",
    deepExplanation:
      "A well-designed Builder can also enforce invariants at `build()` time (validating that required fields were actually set) and can produce immutable final objects, combining flexibility during construction with safety in the finished object.",
    realWorldRelevance:
      "Builder is extremely common in real codebases for constructing configuration objects, HTTP request objects, or complex domain entities with many optional fields — Java's `StringBuilder` and many HTTP client libraries expose Builder-style fluent APIs for exactly this reason.",
    keywords: ["telescoping constructor problem", "fluent step-by-step construction"],
    commonMistakes: ["Not identifying the telescoping constructor problem as the specific pain point Builder solves"],
    relatedTopics: ["Creational Design Patterns", "Constructors, Destructors & Object Lifecycle"],
    followUpQuestions: ["How would you enforce required fields are set before build() succeeds?", "How does Builder help produce immutable objects?"],
    tags: ["Frequently Asked"],
    companyStyleTags: ["Amazon-style", "Startup-style"],
  },
  {
    id: "oops-top40-16",
    rank: 16,
    question: "What is the Observer pattern, and where have you seen it used in real systems?",
    difficulty: "Medium",
    frequency: "High",
    shortAnswer:
      "Observer defines a one-to-many dependency where a 'subject' notifies a list of registered 'observers' automatically whenever its state changes, without the subject needing to know any details about what the observers actually do in response.",
    detailedAnswer:
      "The subject maintains a list of observers and exposes subscribe/unsubscribe methods; when a relevant state change happens, it iterates the list calling each observer's update method — decoupling the subject entirely from the specific reactions its observers implement.",
    deepExplanation:
      "This pattern is the conceptual foundation of most event-driven and reactive programming systems — GUI event listeners, pub/sub messaging systems, and reactive streams (like RxJS) are all recognizable variations of the same core Observer idea at different scales.",
    realWorldRelevance:
      "Every 'addEventListener' call in frontend JavaScript, every message broker subscription, and every model-view update mechanism in an MVC framework is a real-world instance of the Observer pattern in action.",
    keywords: ["subject-observer", "publish-subscribe", "decoupled notification"],
    commonMistakes: ["Not connecting the pattern to a concrete, recognizable real-world instance (like event listeners)"],
    relatedTopics: ["Structural & Behavioral Design Patterns"],
    followUpQuestions: ["What's a risk of the Observer pattern if observers aren't properly unsubscribed?", "How does Observer relate to pub/sub messaging systems?"],
    tags: ["Frequently Asked"],
    companyStyleTags: ["Amazon-style", "Uber-style"],
  },
  {
    id: "oops-top40-17",
    rank: 17,
    question: "What is the Strategy pattern, and how does it help avoid large conditional blocks?",
    difficulty: "Medium",
    frequency: "High",
    shortAnswer:
      "Strategy encapsulates a family of interchangeable algorithms/behaviors behind a common interface, letting the client choose (or be given) which concrete strategy to use at runtime — replacing a large if/else or switch statement selecting behavior with polymorphic dispatch to a chosen strategy object.",
    detailedAnswer:
      "For example, instead of a `calculatePrice()` method with a big switch on discount type, each discount type becomes its own class implementing a common `DiscountStrategy` interface, and the context object simply calls `strategy.apply(price)` — adding a new discount type means adding a new class, not modifying the existing switch (directly satisfying the Open/Closed Principle).",
    deepExplanation:
      "Strategy and the 'favor composition over inheritance' advice are closely linked — instead of subclassing to get different behavior, you compose the context object with a chosen strategy instance, which can even be swapped at runtime, something inheritance-based designs can't do after object creation.",
    realWorldRelevance:
      "Sorting algorithms selectable via a comparator, payment processing supporting multiple payment methods, and validation logic with swappable rule sets are all common real applications of the Strategy pattern.",
    keywords: ["interchangeable algorithms", "replacing conditionals with polymorphism"],
    commonMistakes: ["Not connecting Strategy directly to the Open/Closed Principle and composition-over-inheritance"],
    relatedTopics: ["Structural & Behavioral Design Patterns", "SOLID Principles"],
    followUpQuestions: ["Refactor a large if/else discount calculation into the Strategy pattern.", "How is Strategy different from simply passing a function/lambda as a parameter?"],
    tags: ["Frequently Asked"],
    companyStyleTags: ["Amazon-style", "Google-style"],
  },
  {
    id: "oops-top40-18",
    rank: 18,
    question: "What is the Adapter pattern, and when would you need one?",
    difficulty: "Medium",
    frequency: "Medium",
    shortAnswer:
      "Adapter converts the interface of an existing class into another interface that client code expects, letting incompatible interfaces work together without modifying either the existing class or the client code — commonly needed when integrating a third-party library whose interface doesn't match what your application code expects.",
    detailedAnswer:
      "An Adapter wraps the incompatible class internally and translates calls from the expected interface into calls the wrapped class actually understands — the client code only ever talks to the Adapter's interface, unaware of the underlying incompatible implementation being adapted.",
    deepExplanation:
      "This is distinct from Facade (which simplifies/unifies a complex subsystem's interface for convenience) — Adapter specifically exists to solve an INCOMPATIBILITY between an existing interface and an expected one, not just to simplify a complex one.",
    realWorldRelevance:
      "Wrapping a legacy or third-party API to match your application's internal interface conventions — so the rest of your code doesn't need to know about that external library's quirks — is an extremely common real Adapter use case, especially when swapping vendors later.",
    keywords: ["interface translation", "third-party integration"],
    commonMistakes: ["Confusing Adapter (solving incompatibility) with Facade (simplifying complexity)"],
    relatedTopics: ["Structural & Behavioral Design Patterns"],
    followUpQuestions: ["How is Adapter different from Facade?", "Give a real example where you'd need an Adapter for a third-party library."],
    tags: ["Frequently Asked"],
    companyStyleTags: ["Amazon-style", "Microsoft-style"],
  },
  {
    id: "oops-top40-19",
    rank: 19,
    question: "What is the difference between a shallow copy and a deep copy?",
    difficulty: "Medium",
    frequency: "High",
    shortAnswer:
      "A shallow copy duplicates an object's top-level fields, but if a field is a reference/pointer to another object, both the original and copy end up pointing to the SAME underlying object; a deep copy recursively duplicates every referenced object too, so the copy is fully independent of the original.",
    detailedAnswer:
      "A shallow copy is faster and simpler but can cause subtle bugs — mutating a shared nested object through the copy unexpectedly affects the original too, since they still point to the same underlying data; a deep copy avoids this at the cost of more computation and memory.",
    deepExplanation:
      "Implementing a correct deep copy for objects with circular references (A references B which references A) requires tracking already-copied objects to avoid infinite recursion — a genuinely tricky edge case worth mentioning for a strong answer.",
    realWorldRelevance:
      "This distinction is a very common real bug source — code that assumes a copied object is fully independent, only to have a mutation unexpectedly 'leak' back into the original because the copy was shallow, not deep.",
    keywords: ["reference sharing (shallow)", "full independence (deep)", "circular reference handling"],
    commonMistakes: ["Not mentioning the shared-reference bug risk that shallow copies specifically introduce"],
    relatedTopics: ["Constructors, Destructors & Object Lifecycle"],
    followUpQuestions: ["How would you implement a deep copy for an object with circular references?", "Which does a default copy constructor perform in C++ — shallow or deep?"],
    tags: ["Frequently Asked"],
    companyStyleTags: ["Amazon-style", "Google-style"],
  },
  {
    id: "oops-top40-20",
    rank: 20,
    question: "What is a virtual function, and how does it enable runtime polymorphism (conceptually, what is a vtable)?",
    difficulty: "Hard",
    frequency: "High",
    shortAnswer:
      "A virtual function is a method that can be overridden in a derived class, with the actual implementation invoked determined by the object's real runtime type rather than the compile-time reference/pointer type — implemented conceptually via a vtable (virtual table), a per-class array of function pointers that each object instance references, letting the correct overridden function be looked up at runtime.",
    detailedAnswer:
      "Each class with virtual functions gets one vtable; each object instance of that class holds a hidden pointer to its class's vtable; calling a virtual function means looking up the correct function pointer in that vtable at runtime rather than resolving it directly at compile time (as non-virtual/static calls do) — this indirection is exactly what enables dynamic dispatch.",
    deepExplanation:
      "This mechanism has a small but real runtime cost (an extra pointer dereference per virtual call, plus the memory overhead of the vtable pointer per object) — a nuance worth mentioning to show you understand polymorphism isn't entirely free, even though it's usually a worthwhile trade-off.",
    realWorldRelevance:
      "Understanding vtables concretely explains real debugging scenarios like why calling a virtual function from a base class CONSTRUCTOR doesn't dispatch to the derived class's override in C++ (the derived vtable isn't fully set up yet during base construction) — a genuinely tricky, real gotcha.",
    keywords: ["dynamic dispatch", "vtable / virtual table", "hidden vtable pointer"],
    commonMistakes: ["Describing virtual functions only in Java/C# terms without being able to explain the underlying vtable mechanism"],
    relatedTopics: ["Polymorphism", "Inheritance"],
    followUpQuestions: ["Why doesn't calling a virtual method from a base class constructor invoke the derived override?", "What's the performance cost of virtual functions?"],
    tags: ["Advanced"],
    companyStyleTags: ["Google-style", "Microsoft-style"],
  },
  {
    id: "oops-top40-21",
    rank: 21,
    question: "Can a constructor be private? What would be the point?",
    difficulty: "Medium",
    frequency: "Medium",
    shortAnswer:
      "Yes — a private constructor prevents external code from directly instantiating a class with `new`, commonly used to enforce controlled object creation, such as in the Singleton pattern (only the class itself can create its one instance) or in factory-method-based creation (forcing all instantiation through a static factory method).",
    detailedAnswer:
      "This is a deliberate design technique to control HOW and WHEN instances are created — beyond Singleton, it's also used for utility classes with only static methods (preventing any instantiation at all) and for classes that should only be created via a named static factory method for clarity (e.g. `Optional.of(value)` instead of a raw constructor).",
    deepExplanation:
      "A private constructor combined with a static factory method also allows the factory to return a cached/reused instance, a subclass instance, or even null/an alternate type in some languages — flexibility a public constructor can never provide, since a constructor always returns a new instance of exactly that class.",
    realWorldRelevance:
      "Java's `Optional.of()`/`Optional.empty()` and many builder/factory-based libraries rely on exactly this technique to control instantiation and provide more descriptive, flexible object-creation APIs than a raw public constructor would allow.",
    keywords: ["Singleton enforcement", "static factory methods", "utility class prevention"],
    commonMistakes: ["Assuming a private constructor means the class can never be instantiated at all"],
    relatedTopics: ["Constructors, Destructors & Object Lifecycle", "Creational Design Patterns"],
    followUpQuestions: ["How does a private constructor support the Singleton pattern specifically?", "What's an advantage of a static factory method over a public constructor?"],
    tags: ["Advanced"],
    companyStyleTags: ["Google-style", "Amazon-style"],
  },
  {
    id: "oops-top40-22",
    rank: 22,
    question: "What's the difference between static and instance (non-static) members?",
    difficulty: "Easy",
    frequency: "Very High",
    shortAnswer:
      "A static member belongs to the CLASS itself — one single copy shared across all instances; an instance member belongs to each individual OBJECT — every instance gets its own separate copy with potentially different values.",
    detailedAnswer:
      "Static members are accessed via the class name (not requiring an object) and are useful for data/behavior that's inherently shared (a counter of how many instances exist, a utility method not needing any instance state); instance members require an actual object to exist and operate on that specific object's data.",
    deepExplanation:
      "A common subtlety: a static method cannot directly access instance (non-static) members, since a static method isn't tied to any particular object — it has no implicit `this`/`self` to operate on, which is exactly why the compiler rejects such attempts.",
    realWorldRelevance:
      "Utility/helper methods (like `Math.max()`) are classic static methods needing no per-instance state; counting active connections or total instances created is a classic static field use case.",
    keywords: ["class-level vs instance-level", "no implicit this in static context"],
    commonMistakes: ["Not knowing why a static method can't directly access instance members"],
    relatedTopics: ["Classes & Objects"],
    followUpQuestions: ["Why can't a static method access instance variables directly?", "Can a static method be overridden? Why or why not?"],
    tags: ["Must Know"],
    companyStyleTags: ["Startup-style", "Amazon-style"],
  },
  {
    id: "oops-top40-23",
    rank: 23,
    question: "Design a class hierarchy for a payment processing system supporting credit cards, PayPal, and bank transfers.",
    difficulty: "Hard",
    frequency: "High",
    shortAnswer:
      "Define a `PaymentMethod` interface with a `processPayment(amount)` method; each payment type (`CreditCardPayment`, `PayPalPayment`, `BankTransferPayment`) implements it with its own logic — the calling code (e.g. a checkout service) depends only on the `PaymentMethod` interface, letting new payment methods be added later without modifying existing checkout logic.",
    detailedAnswer:
      "This is a direct real-world application of the Strategy pattern (interchangeable payment 'strategies' behind a common interface) combined with the Open/Closed and Dependency Inversion principles — the checkout service depends on the abstraction, not concrete payment classes, so it's both extensible and testable (you can inject a fake `PaymentMethod` for tests).",
    deepExplanation:
      "A strong answer also considers cross-cutting concerns naturally arising from this design: how to handle payment-specific validation, how to represent success/failure results uniformly across very different underlying APIs (credit card gateways vs PayPal's API vs bank transfer processing), and whether a common result type or exception hierarchy is needed.",
    realWorldRelevance:
      "This is essentially how real payment processing systems (Stripe's own SDK design, e-commerce checkout systems) are architected — a unified interface over genuinely different underlying payment provider APIs.",
    keywords: ["Strategy pattern application", "interface-based extensibility"],
    commonMistakes: [
      "Using a type-checking if/else chain in the checkout logic instead of polymorphic dispatch",
      "Not considering how to represent success/failure uniformly across different payment types",
    ],
    relatedTopics: ["Structural & Behavioral Design Patterns", "SOLID Principles", "Abstract Classes & Interfaces"],
    followUpQuestions: [
      "How would you add a new payment method without modifying existing code?",
      "How would you handle a payment method needing extra steps (like 3D Secure verification) that others don't?",
    ],
    tags: ["Advanced"],
    companyStyleTags: ["Amazon-style", "Uber-style", "Startup-style"],
  },
  {
    id: "oops-top40-24",
    rank: 24,
    question: "What is operator overloading, and what are its risks?",
    difficulty: "Medium",
    frequency: "Medium",
    shortAnswer:
      "Operator overloading lets you redefine what a built-in operator (like `+` or `==`) does for instances of a custom class (e.g. adding two `Vector` objects with `+`) — the risk is reduced code clarity if the overloaded behavior isn't intuitive or consistent with what the operator normally implies, potentially surprising readers.",
    detailedAnswer:
      "A well-designed overload (like `+` concatenating strings, or adding two Money/Vector objects) matches the operator's natural mathematical meaning; a poorly-designed one (overloading `+` to do something unrelated, like triggering a network call) violates the principle of least astonishment and makes code harder to reason about.",
    deepExplanation:
      "Not all OOP languages support operator overloading — Java notably does not (aside from String's built-in `+` concatenation), a deliberate design choice to avoid the readability risks, while C++ and Python embrace it more fully, trusting developer discipline instead.",
    realWorldRelevance:
      "Numeric/vector/matrix classes in scientific computing libraries (NumPy in Python, Eigen in C++) are the classic legitimate, widely-used real-world case for operator overloading, since it makes mathematical code read naturally close to actual math notation.",
    keywords: ["operator redefinition", "principle of least astonishment"],
    commonMistakes: ["Not knowing Java deliberately omits general operator overloading as a design choice"],
    relatedTopics: ["Classes & Objects", "Polymorphism"],
    followUpQuestions: ["Why doesn't Java support general operator overloading?", "Give an example of a poorly-designed operator overload."],
    tags: ["Advanced"],
    companyStyleTags: ["Microsoft-style"],
  },
  {
    id: "oops-top40-25",
    rank: 25,
    question: "What is the difference between 'is-a' and 'has-a' relationships, and how do you decide which fits a given design?",
    difficulty: "Medium",
    frequency: "High",
    shortAnswer:
      "'Is-a' (inheritance) means a subclass is a specialized version of its parent and should be usable anywhere the parent is expected (per LSP); 'has-a' (composition/aggregation) means a class contains or uses another class as a component without being a specialized version of it — deciding between them means asking whether the relationship is genuinely one of specialization or one of containment/usage.",
    detailedAnswer:
      "A common test: if you can honestly say 'X is a specialized kind of Y, and everywhere Y is expected, X should work correctly too,' inheritance fits; if the relationship is really 'X uses/contains/relies on a Y to do its job,' composition fits better, even if 'X is-a Y' sounds superficially plausible in plain English.",
    deepExplanation:
      "This is exactly the reasoning that catches the classic Square/Rectangle LSP trap — 'a Square is-a Rectangle' sounds true geometrically, but fails the substitutability test behaviorally, revealing that inheritance was the wrong tool for that specific relationship despite sounding right in English.",
    realWorldRelevance:
      "This decision directly shapes real class hierarchy design quality — defaulting to inheritance whenever a relationship 'sounds like' is-a in English, without checking substitutability, is one of the most common real design mistakes in OOP codebases.",
    keywords: ["substitutability test", "specialization vs containment/usage"],
    commonMistakes: ["Deciding purely based on how the relationship sounds in English rather than checking behavioral substitutability"],
    relatedTopics: ["Inheritance", "Association, Aggregation & Composition"],
    followUpQuestions: ["Apply this test to the Square/Rectangle example.", "Give an example where 'is-a' sounds right in English but composition is actually the better design."],
    tags: ["Frequently Asked"],
    companyStyleTags: ["Amazon-style", "Google-style"],
  },
  {
    id: "oops-top40-26",
    rank: 26,
    question: "What is method hiding, and how is it different from method overriding?",
    difficulty: "Hard",
    frequency: "Medium",
    shortAnswer:
      "Method hiding occurs when a subclass defines a STATIC method with the same signature as a static method in its parent — unlike overriding, which method actually executes is determined by the reference/pointer's declared (compile-time) type, not the object's actual runtime type, since static methods aren't part of dynamic dispatch at all.",
    detailedAnswer:
      "This means calling a hidden static method through a base-class-typed reference always calls the BASE class's version, even if the underlying object is actually a subclass instance — the opposite behavior from instance method overriding, which is exactly why this distinction is a common 'gotcha' question.",
    deepExplanation:
      "This subtlety exists precisely because static methods belong to the class, not any instance, so there's no vtable-style dynamic dispatch involved at all — the call is resolved entirely at compile time based on the reference type, unlike virtual instance methods.",
    realWorldRelevance:
      "This is a genuinely common source of confusing bugs for developers who assume ALL same-signature subclass methods behave polymorphically like overriding does, not realizing static methods behave completely differently.",
    keywords: ["static method resolution", "compile-time vs runtime binding for statics"],
    commonMistakes: ["Assuming static 'method hiding' behaves the same as instance method overriding"],
    relatedTopics: ["Inheritance", "Polymorphism"],
    followUpQuestions: ["Trace through a code example showing method hiding's surprising behavior.", "Why can't static methods be part of dynamic dispatch?"],
    tags: ["Advanced"],
    companyStyleTags: ["Google-style", "Microsoft-style"],
  },
  {
    id: "oops-top40-27",
    rank: 27,
    question: "What are access modifiers, and what's the difference between protected and private?",
    difficulty: "Easy",
    frequency: "High",
    shortAnswer:
      "Access modifiers (public, protected, private, and package/default in Java) control visibility of class members — private restricts access to only within the same class; protected additionally allows access from subclasses (and often same-package code), while public allows access from anywhere.",
    detailedAnswer:
      "Protected exists specifically to support inheritance — a subclass often needs access to certain parent implementation details that shouldn't be exposed to completely unrelated external code, striking a middle ground between private (too restrictive for subclassing needs) and public (too permissive, breaking encapsulation).",
    deepExplanation:
      "Access modifier rules and defaults vary meaningfully by language (Java's package-private default, C++'s default private for classes vs public for structs, Python's convention-only underscore-prefix 'privacy' with no true enforcement) — a nuanced answer acknowledges this isn't perfectly universal across languages.",
    realWorldRelevance:
      "Choosing the right access level for each field/method is a real, everyday API design decision — exposing too much breaks encapsulation and locks in implementation details as a public contract; exposing too little forces awkward workarounds for legitimate subclass or same-package needs.",
    keywords: ["public/protected/private", "encapsulation enforcement"],
    commonMistakes: ["Not knowing protected specifically exists to support subclass access"],
    relatedTopics: ["Encapsulation & Abstraction", "Classes & Objects"],
    followUpQuestions: ["How does Python's approach to access control differ from Java/C++?", "When would you choose protected over private?"],
    tags: ["Must Know"],
    companyStyleTags: ["Startup-style", "Amazon-style"],
  },
  {
    id: "oops-top40-28",
    rank: 28,
    question: "What is the Decorator pattern, and how is it different from just using inheritance to add functionality?",
    difficulty: "Hard",
    frequency: "Medium",
    shortAnswer:
      "Decorator wraps an object to add new behavior dynamically at runtime, without modifying the original class or requiring a new subclass for every possible combination of added features — unlike inheritance, which would need a separate subclass (and potentially an exploding number of subclasses) for every combination of optional features.",
    detailedAnswer:
      "Each Decorator implements the same interface as the object it wraps, forwards calls to the wrapped object, and adds its own behavior before/after — decorators can be stacked/composed in any combination and order at runtime, something a fixed inheritance hierarchy can't achieve without a combinatorial explosion of subclasses.",
    deepExplanation:
      "The classic example is a `Coffee` interface with a base `SimpleCoffee` implementation, decorated by `MilkDecorator`, `SugarDecorator`, etc. — wrapping `new SugarDecorator(new MilkDecorator(new SimpleCoffee()))` composes behaviors flexibly at runtime instead of needing a `CoffeeWithMilkAndSugar` subclass defined upfront.",
    realWorldRelevance:
      "Java's I/O stream classes (wrapping a `FileInputStream` with a `BufferedInputStream` wrapping a `GZIPInputStream`) are a well-known real standard-library example of the Decorator pattern in active use.",
    keywords: ["dynamic composition", "avoiding subclass combinatorial explosion"],
    commonMistakes: ["Not explaining WHY inheritance alone would require a combinatorial explosion of subclasses for the same flexibility"],
    relatedTopics: ["Structural & Behavioral Design Patterns", "Association, Aggregation & Composition"],
    followUpQuestions: ["Walk through Java's I/O stream classes as a real Decorator example.", "How would you implement a decorator that can be stacked in any order?"],
    tags: ["Advanced"],
    companyStyleTags: ["Google-style", "Microsoft-style"],
  },
  {
    id: "oops-top40-29",
    rank: 29,
    question: "What is a copy constructor, and when does the compiler generate a default one?",
    difficulty: "Medium",
    frequency: "Medium",
    shortAnswer:
      "A copy constructor creates a new object as a copy of an existing object of the same class. Many languages (like C++) automatically generate a default copy constructor if none is explicitly defined, which performs a shallow, member-wise copy — which is often WRONG for classes managing resources like raw pointers, requiring a custom copy constructor implementing a proper deep copy.",
    detailedAnswer:
      "The classic bug this causes in C++: a class holding a raw pointer to dynamically allocated memory, relying on the compiler-generated shallow copy constructor, ends up with two objects both pointing to (and both eventually trying to free) the same memory — a double-free bug — unless a custom deep-copy constructor (or smart pointers avoiding the issue entirely) is used.",
    deepExplanation:
      "This is exactly why the 'Rule of Three/Five' exists in C++ — if you need a custom destructor, you almost certainly also need a custom copy constructor and copy assignment operator (and move constructor/assignment in the 'Rule of Five'), since the default shallow-copy behavior is unsafe for resource-managing classes.",
    realWorldRelevance:
      "This is a genuinely common, real source of subtle memory bugs (double-free, use-after-free) in C++ code specifically, which is exactly why the Rule of Three/Five is considered essential foundational C++ knowledge.",
    keywords: ["shallow default copy constructor", "Rule of Three/Five", "double-free risk"],
    commonMistakes: ["Not connecting the default shallow copy constructor to real double-free/dangling-pointer bugs"],
    relatedTopics: ["Constructors, Destructors & Object Lifecycle"],
    followUpQuestions: ["What is the Rule of Three/Five in C++?", "How would smart pointers help avoid this specific bug?"],
    tags: ["Advanced"],
    companyStyleTags: ["Microsoft-style", "Google-style"],
  },
  {
    id: "oops-top40-30",
    rank: 30,
    question: "What is polymorphism's role in enabling extensible, maintainable software design?",
    difficulty: "Medium",
    frequency: "High",
    shortAnswer:
      "Polymorphism lets calling code work with objects through a shared interface without knowing their concrete type, so new types can be introduced later and 'just work' with existing code — this is the mechanism that makes the Open/Closed Principle achievable, and underlies most extensible plugin-style architectures.",
    detailedAnswer:
      "Without polymorphism, adding a new case (a new shape type, a new payment method, a new file format) typically requires finding and modifying every conditional that checks for known types; with polymorphism, adding a new case means adding a new class implementing the existing interface — existing code doesn't change at all.",
    deepExplanation:
      "This is precisely why polymorphism is considered the pillar most directly tied to software's long-term extensibility and maintainability, rather than just being a syntactic feature — it's the structural mechanism underlying most 'good' OOP design advice (OCP, Strategy pattern, plugin architectures).",
    realWorldRelevance:
      "Plugin systems, extensible file format handlers, and multi-provider integrations (multiple cloud storage backends behind one interface) are all real architectures fundamentally built on polymorphism enabling extension without modification.",
    keywords: ["extensibility", "Open/Closed Principle enablement"],
    commonMistakes: ["Describing polymorphism only mechanically (overriding) without connecting it to WHY it matters for design"],
    relatedTopics: ["Polymorphism", "SOLID Principles"],
    followUpQuestions: ["Give a concrete example of a plugin architecture enabled by polymorphism.", "How does this connect to the Strategy pattern?"],
    tags: ["Frequently Asked"],
    companyStyleTags: ["Amazon-style", "Google-style"],
  },
  {
    id: "oops-top40-31",
    rank: 31,
    question: "You're reviewing a pull request with a class hierarchy 5 levels deep, and a bug was just found in the base class that broke 3 unrelated subclasses. What would you flag, and how would you suggest fixing it?",
    difficulty: "Hard",
    frequency: "Medium",
    shortAnswer:
      "This is a textbook fragile base class problem from over-relying on deep inheritance — I'd flag the hierarchy depth itself as a maintainability risk and suggest refactoring toward composition (extracting the genuinely shared behavior into standalone, composable components) rather than continuing to build on an increasingly fragile inheritance chain.",
    detailedAnswer:
      "I'd specifically look at which behavior each of the 3 broken subclasses actually needed from the base class — if it's a small, focused set of methods, that's a strong signal those should become separate composed objects/interfaces (favoring composition), rather than inherited from a deep, increasingly overloaded base class trying to serve everyone.",
    deepExplanation:
      "A senior-level answer also considers the migration path pragmatically — a full rewrite of a 5-level hierarchy is often too risky to do all at once, so I'd suggest incrementally extracting the most fragile/shared pieces into composed components first, verified with tests, rather than a single large risky refactor.",
    realWorldRelevance:
      "Deep inheritance hierarchies accumulating unrelated shared behavior in a base class is one of the most common real, organically-grown OOP anti-patterns in large legacy codebases, and recognizing + addressing it incrementally is a genuinely valuable practical skill.",
    keywords: ["fragile base class problem", "incremental refactor toward composition"],
    commonMistakes: [
      "Proposing a full rewrite instead of an incremental, risk-managed refactor",
      "Not identifying the deep hierarchy itself as the root design issue",
    ],
    relatedTopics: ["Inheritance", "Association, Aggregation & Composition", "SOLID Principles"],
    followUpQuestions: [
      "How would you prioritize which parts of the hierarchy to refactor first?",
      "How would you ensure the refactor doesn't introduce new regressions?",
    ],
    tags: ["Advanced"],
    companyStyleTags: ["Google-style", "Amazon-style", "Uber-style"],
  },
  {
    id: "oops-top40-32",
    rank: 32,
    question: "What is the difference between a class and an object?",
    difficulty: "Easy",
    frequency: "Very High",
    shortAnswer:
      "A class is a blueprint/template defining the structure (fields) and behavior (methods) that its instances will have; an object is an actual instance of a class, with its own real values stored in memory for those fields.",
    detailedAnswer:
      "Just as a house blueprint isn't itself a house you can live in, a class isn't itself a usable entity until instantiated — many objects (houses) can be created from one class (blueprint), each with independent field values (paint color, furniture) despite sharing the same structural definition.",
    deepExplanation:
      "This distinction seems basic but is foundational to everything else in OOP — every subsequent concept (inheritance, polymorphism, encapsulation) is really describing rules about how classes and their instances relate to and interact with each other.",
    realWorldRelevance:
      "This is genuinely the first concept taught in any OOP course for good reason — literally every other OOP concept builds directly on the class/object distinction being crystal clear first.",
    keywords: ["blueprint vs instance"],
    commonMistakes: ["Using 'class' and 'object' interchangeably in explanations"],
    relatedTopics: ["Classes & Objects"],
    followUpQuestions: ["Can two objects of the same class have different values for the same field? Why?", "What's stored in memory for a class itself versus for each object?"],
    tags: ["Must Know"],
    companyStyleTags: ["Startup-style"],
  },
  {
    id: "oops-top40-33",
    rank: 33,
    question: "What is the Facade pattern, and how is it different from the Adapter pattern?",
    difficulty: "Medium",
    frequency: "Medium",
    shortAnswer:
      "Facade provides a simplified, unified interface over a complex subsystem with many interacting parts, purely for convenience/ease of use; Adapter exists specifically to make an EXISTING incompatible interface match what client code expects — Facade simplifies complexity, Adapter resolves incompatibility.",
    detailedAnswer:
      "A Facade might expose one `startComputer()` method that internally coordinates calls to a dozen different subsystems (CPU, memory, disk, BIOS) — the subsystems' interfaces aren't incompatible with anything, they're just numerous and complex to coordinate correctly, which is exactly what Facade hides.",
    deepExplanation:
      "Confusing these two is common precisely because both 'wrap' something, but the underlying MOTIVATION differs entirely — ask 'is this solving an incompatibility problem (Adapter) or a complexity/usability problem (Facade)' to tell them apart quickly.",
    realWorldRelevance:
      "Simplified SDK/client library wrappers over complex underlying cloud service APIs are a common real Facade use case, providing a small, convenient surface area over a much larger and more complex actual API surface.",
    keywords: ["complexity simplification (Facade) vs interface incompatibility (Adapter)"],
    commonMistakes: ["Not being able to articulate the distinct MOTIVATION behind each pattern, just that both 'wrap' something"],
    relatedTopics: ["Structural & Behavioral Design Patterns"],
    followUpQuestions: ["Give a real example of a Facade you've used or built.", "Could a single class technically be both a Facade and an Adapter? Explain."],
    tags: ["Advanced"],
    companyStyleTags: ["Microsoft-style", "Google-style"],
  },
  {
    id: "oops-top40-34",
    rank: 34,
    question: "What is cohesion and coupling, and how do they relate to good OOP design?",
    difficulty: "Medium",
    frequency: "High",
    shortAnswer:
      "Cohesion measures how closely related and focused the responsibilities within a single class/module are (higher cohesion is better); coupling measures how much different classes/modules depend on each other's internal details (lower coupling is better) — good OOP design aims for high cohesion within classes and low coupling between them.",
    detailedAnswer:
      "A highly cohesive class does one clearly-defined job well (closely related to SRP); low coupling means classes interact through well-defined, stable interfaces rather than reaching into each other's internals, so changes in one class are less likely to ripple into unrelated others.",
    deepExplanation:
      "Most SOLID principles are really specific, actionable techniques for achieving 'high cohesion, low coupling' in practice — SRP directly drives cohesion, while DIP/ISP/OCP all directly drive lower coupling, which is a useful unifying way to remember why SOLID matters at all.",
    realWorldRelevance:
      "Codebases with low cohesion and high coupling are the classic real symptom of 'everything is scary to change because touching one thing breaks five unrelated things' — a pain point virtually every engineer has experienced in a legacy codebase.",
    keywords: ["high cohesion (good)", "low coupling (good)", "SOLID as tools for both"],
    commonMistakes: ["Not connecting cohesion/coupling as the underlying goals that SOLID principles are practical tools for achieving"],
    relatedTopics: ["SOLID Principles", "Association, Aggregation & Composition"],
    followUpQuestions: ["How does the Single Responsibility Principle directly improve cohesion?", "How does Dependency Inversion directly reduce coupling?"],
    tags: ["Frequently Asked"],
    companyStyleTags: ["Amazon-style", "Google-style"],
  },
  {
    id: "oops-top40-35",
    rank: 35,
    question: "What is method resolution order, and how does it matter in languages supporting multiple inheritance (like Python)?",
    difficulty: "Hard",
    frequency: "Medium",
    shortAnswer:
      "Method Resolution Order (MRO) is the specific, deterministic order a language searches parent classes to find which implementation of a method to use when multiple inheritance is involved — Python uses the C3 linearization algorithm specifically to produce a consistent, predictable MRO even in diamond-shaped inheritance graphs.",
    detailedAnswer:
      "Without a well-defined MRO algorithm, diamond-shaped multiple inheritance (the same ambiguity C++ faces) would have unpredictable or inconsistent method resolution; C3 linearization guarantees a consistent order that respects both local precedence (a class's own listed parent order) and a monotonic consistency requirement across the whole hierarchy.",
    deepExplanation:
      "You can actually inspect a Python class's MRO directly via `ClassName.__mro__` or `ClassName.mro()` — a good answer demonstrates awareness that this isn't just theoretical, it's an inspectable, deterministic runtime property of the class.",
    realWorldRelevance:
      "Python's extensive real-world use of multiple inheritance (especially via mixins) makes understanding MRO a genuinely practical necessity for correctly reasoning about which mixin's method actually executes when several are combined.",
    keywords: ["C3 linearization", "__mro__", "diamond inheritance in Python"],
    commonMistakes: ["Assuming multiple inheritance in Python is unpredictable/undefined rather than governed by a specific deterministic algorithm"],
    relatedTopics: ["Inheritance"],
    followUpQuestions: ["How would you inspect a class's MRO in Python?", "How does mixin-based design in Python rely on MRO working correctly?"],
    tags: ["Advanced"],
    companyStyleTags: ["Google-style"],
  },
  {
    id: "oops-top40-36",
    rank: 36,
    question: "What is immutability in OOP, and why is it valuable, especially in concurrent code?",
    difficulty: "Medium",
    frequency: "Medium",
    shortAnswer:
      "An immutable object's state cannot change after construction — any 'modification' instead produces a new object — which is valuable because immutable objects are inherently thread-safe (no risk of one thread seeing a partially-updated state from another) and easier to reason about, since their state never changes unexpectedly.",
    detailedAnswer:
      "Implementing immutability typically means making all fields final/read-only, not exposing any mutator methods, and ensuring any mutable fields (like a list) are defensively copied on construction/access so external code can't mutate the internal state through a returned reference.",
    deepExplanation:
      "A subtle but important detail: simply marking a field `final`/`readonly` isn't enough if that field holds a reference to a MUTABLE object (like a List) — true immutability requires either using immutable collection types or defensively copying on both input and output to fully prevent external mutation of internal state.",
    realWorldRelevance:
      "Java's String and modern record/data-class features in many languages default to immutability specifically because it eliminates entire categories of concurrency bugs (no locking needed to safely share an immutable object across threads) at essentially zero synchronization cost.",
    keywords: ["thread-safety without locking", "defensive copying for full immutability"],
    commonMistakes: ["Assuming marking a field final/readonly alone guarantees full immutability, ignoring mutable referenced objects"],
    relatedTopics: ["Encapsulation & Abstraction", "Constructors, Destructors & Object Lifecycle"],
    followUpQuestions: ["Why is a `final` field holding a mutable List not truly immutable?", "How does immutability simplify concurrent programming specifically?"],
    tags: ["Advanced"],
    companyStyleTags: ["Google-style", "Amazon-style"],
  },
  {
    id: "oops-top40-37",
    rank: 37,
    question: "What is the difference between abstraction achieved via abstract classes versus abstraction achieved via interfaces, in terms of design flexibility?",
    difficulty: "Hard",
    frequency: "Medium",
    shortAnswer:
      "Abstract classes provide abstraction WITH shared implementation/state but limit a class to a single inheritance chain; interfaces provide abstraction as a pure contract (with optional default behavior in modern languages) that a class can adopt many of simultaneously — the flexibility trade-off is single-inheritance-with-reuse versus multiple-contracts-without-shared-state.",
    detailedAnswer:
      "Choosing abstract class locks a type into one specific hierarchy (useful when there's genuinely one natural 'kind-of' taxonomy); choosing interfaces lets a type freely mix multiple unrelated capabilities (a class can be `Serializable`, `Comparable`, AND `Runnable` simultaneously) without being forced into any single rigid hierarchy.",
    deepExplanation:
      "This is exactly why many modern API designs (like Java's collections framework) favor interfaces heavily for public contracts while using abstract classes more sparingly, internally, for genuine shared-implementation convenience — a deliberate design philosophy, not an accident.",
    realWorldRelevance:
      "Real large-scale API design (Java Collections, .NET's collection interfaces) consistently favors interface-heavy public contracts specifically for this multiple-capability flexibility, reserving abstract classes for narrower internal implementation reuse.",
    keywords: ["single hierarchy + shared state (abstract class)", "multiple contracts + no shared state (interface)"],
    commonMistakes: ["Not articulating the actual flexibility trade-off, just repeating syntax differences"],
    relatedTopics: ["Abstract Classes & Interfaces"],
    followUpQuestions: ["Why does Java's Collections framework favor interfaces so heavily?", "Give an example where a class needs multiple unrelated capabilities and how interfaces solve it."],
    tags: ["Advanced"],
    companyStyleTags: ["Google-style", "Amazon-style"],
  },
  {
    id: "oops-top40-38",
    rank: 38,
    question: "How would you refactor a tightly-coupled notification system (a class with if/else branches for Email, SMS, and Push notifications) to be more extensible?",
    difficulty: "Hard",
    frequency: "High",
    shortAnswer:
      "Extract a `NotificationChannel` interface with a `send(message)` method; implement `EmailNotification`, `SmsNotification`, `PushNotification` as separate classes; have the notification service depend on a list/collection of `NotificationChannel` instances (injected in) rather than branching on type internally — directly applying the Strategy pattern plus Dependency Inversion.",
    detailedAnswer:
      "This refactor makes adding a new channel (e.g. Slack notifications) require only a new class implementing the interface — zero changes to the existing notification service — and makes the service trivially testable by injecting fake/mock channel implementations instead of triggering real emails/SMS in tests.",
    deepExplanation:
      "A senior-level answer also considers how to handle partial failures gracefully in this new design (if the Email channel fails but SMS succeeds, what should the overall result be?) — a good design surfaces per-channel results rather than a single opaque success/failure for the whole batch.",
    realWorldRelevance:
      "This exact refactor pattern — replacing type-checking branches with a polymorphic interface plus injected implementations — is one of the most common, genuinely valuable real refactoring moves applied to legacy code during any code quality improvement effort.",
    keywords: ["Strategy pattern refactor", "Dependency Inversion", "per-channel failure handling"],
    commonMistakes: [
      "Only extracting the interface without also addressing how the service obtains/manages its list of channels (dependency injection)",
      "Not considering partial-failure handling in the new design",
    ],
    relatedTopics: ["Structural & Behavioral Design Patterns", "SOLID Principles"],
    followUpQuestions: [
      "How would you handle one channel failing while others succeed?",
      "How would this refactor make unit testing the notification service easier?",
    ],
    tags: ["Advanced"],
    companyStyleTags: ["Amazon-style", "Uber-style", "Google-style"],
  },
  {
    id: "oops-top40-39",
    rank: 39,
    question: "What is the difference between abstract methods and virtual methods?",
    difficulty: "Medium",
    frequency: "Medium",
    shortAnswer:
      "An abstract method has NO implementation in the declaring (abstract) class and MUST be overridden by any concrete subclass; a virtual method DOES have a default implementation in the base class, which subclasses MAY optionally override if they need different behavior, but aren't required to.",
    detailedAnswer:
      "A class containing even one abstract method must itself be declared abstract and cannot be instantiated directly; a class with only virtual (not abstract) methods can be instantiated as-is, using the base implementations wherever a subclass hasn't overridden them.",
    deepExplanation:
      "This distinction directly maps to a design decision: use abstract methods when there's genuinely no sensible default behavior and every subclass MUST provide its own (like `calculateArea()` on a generic `Shape`); use virtual methods when there's a reasonable default that most subclasses can just inherit as-is, with only some needing to customize it.",
    realWorldRelevance:
      "Template Method pattern implementations rely on exactly this distinction — a base class defines the overall algorithm structure with some steps as abstract (subclasses must define) and others as virtual with sensible defaults (subclasses may override).",
    keywords: ["mandatory override (abstract)", "optional override with default (virtual)"],
    commonMistakes: ["Treating 'abstract' and 'virtual' as synonyms rather than mandatory-vs-optional override requirements"],
    relatedTopics: ["Abstract Classes & Interfaces", "Polymorphism"],
    followUpQuestions: ["What is the Template Method pattern and how does it use both abstract and virtual methods together?", "Can a class with zero abstract methods still be declared abstract? Why might you do that?"],
    tags: ["Frequently Asked"],
    companyStyleTags: ["Microsoft-style", "Amazon-style"],
  },
  {
    id: "oops-top40-40",
    rank: 40,
    question: "How would you implement a thread-safe Singleton in a language like Java or C++, and what are the trade-offs between different approaches?",
    difficulty: "Hard",
    frequency: "Medium",
    shortAnswer:
      "Options include eager initialization (create the instance at class-load time — simple and thread-safe by the language's own class-loading guarantees, but creates the instance even if never used), synchronized lazy initialization (thread-safe but pays a locking cost on every access unless combined with double-checked locking), and the initialization-on-demand holder idiom / Java's enum singleton (lazy, thread-safe, and lock-free after the JVM's own guarantees).",
    detailedAnswer:
      "Double-checked locking requires the instance reference to be `volatile` in Java specifically to prevent a subtle reordering bug where another thread could observe a partially-constructed object; the holder idiom (a nested static class holding the instance) sidesteps this entirely by relying on the JVM's guarantee that a class's static initialization is both lazy and thread-safe by default.",
    deepExplanation:
      "A senior-level answer explicitly compares the trade-offs rather than naming just one 'correct' approach — eager initialization trades unnecessary-creation-cost for simplicity and zero synchronization concerns; the holder idiom gets true lazy initialization with no explicit locking at all, which is why it's often considered the best default in Java specifically.",
    realWorldRelevance:
      "Getting Singleton thread-safety subtly wrong (missing `volatile`, incorrect double-checked locking) is a real, documented historical source of hard-to-reproduce concurrency bugs, which is exactly why this specific implementation detail is such a common deep-dive interview question.",
    keywords: ["eager vs lazy initialization", "double-checked locking + volatile", "initialization-on-demand holder idiom"],
    commonMistakes: ["Presenting double-checked locking without mentioning the necessary `volatile` keyword in Java"],
    relatedTopics: ["Creational Design Patterns", "Constructors, Destructors & Object Lifecycle"],
    followUpQuestions: [
      "Why does double-checked locking require a volatile field in Java specifically?",
      "Why is the initialization-on-demand holder idiom often preferred over double-checked locking?",
    ],
    tags: ["Advanced"],
    companyStyleTags: ["Google-style", "Amazon-style", "Microsoft-style"],
  },
];

export default oopsTop40;
