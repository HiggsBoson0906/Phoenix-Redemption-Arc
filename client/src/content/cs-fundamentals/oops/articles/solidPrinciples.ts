// src/content/cs-fundamentals/oops/articles/solidPrinciples.ts

import type { Article } from "@/types";

const solidPrinciplesArticle: Article = {
  slug: "solid-principles",
  title: "SOLID Principles",
  summary:
    "SOLID is five design guidelines — Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion — that together aim at code that's easy to extend without breaking what already works.",
  readingTimeMins: 12,
  beginnerExplanation:
    "SOLID is an acronym for five principles that Robert C. Martin (Uncle Bob) collected and popularized, each addressing a different way object-oriented code tends to rot as it grows: classes that try to do too much, code that requires editing existing working logic every time a new case shows up, subclasses that quietly break the promises their parent class made, interfaces that force classes to implement methods they don't need, and high-level code that's welded directly to low-level implementation details. None of these are laws enforced by a compiler — they're judgment calls about maintainability that you learn to recognize by their opposite: the code smell each principle is designed to prevent.\n\nThe fastest way to actually understand SOLID is through before/after examples, because each principle is really a name for a specific kind of pain you've probably already felt in real code — a class you were scared to touch, a giant switch statement you had to extend every sprint, a subclass that broke something you didn't expect.",
  detailedBreakdown:
    "**Single Responsibility Principle (SRP)**: A class should have only one reason to change. This doesn't mean 'a class should do only one thing' in a childishly literal sense — it means a class shouldn't bundle together responsibilities that change for different reasons and at different rates, owned by different stakeholders. Code smell: an `Employee` class with `calculatePay()`, `saveToDatabase()`, and `generateReport()` methods bundled together — payroll logic, persistence logic, and reporting logic each change for entirely different business reasons, so a change to the database schema now risks breaking payroll calculation code in the same file. Fix: split into `Employee` (data + payroll logic), `EmployeeRepository` (persistence), and `EmployeeReportGenerator` (reporting) — each class now has exactly one axis along which it needs to change.\n\n**Open/Closed Principle (OCP)**: Software entities should be open for extension but closed for modification — you should be able to add new behavior without editing and risking already-tested existing code. Code smell: a `PaymentProcessor` with `if (type == \"credit_card\") {...} else if (type == \"paypal\") {...}` — adding a new payment method means opening this class, editing a working method, and re-testing everything that already worked. Fix: define a `PaymentMethod` interface with a `process()` method, implement `CreditCardPayment`, `PayPalPayment`, etc. as separate classes, and have `PaymentProcessor` accept any `PaymentMethod` polymorphically — adding Bitcoin support means writing one new class, touching zero existing code.\n\n**Liskov Substitution Principle (LSP)**: Subtypes must be substitutable for their base type without altering the correctness of the program — this is stricter than 'inheritance compiles and runs.' It means any code written against the base class's contract (preconditions, postconditions, invariants) must keep working correctly when handed any subclass instead, with no surprises. The textbook violation: `Square extends Rectangle`, overriding `setWidth()` and `setHeight()` to keep both sides equal. Code that does `rect.setWidth(5); rect.setHeight(4); assert(rect.getArea() == 20)` works for any real `Rectangle` but silently breaks for `Square` (area becomes 16), even though `Square` compiles fine as a `Rectangle` subclass — this is exactly why LSP is about behavioral correctness, not just 'does it inherit and override without a compile error.' Fix: don't model `Square` as a `Rectangle` subclass at all; give both a common `Shape` interface with just `getArea()`, or use composition, since 'a square is mathematically a rectangle' does not imply 'Square should inherit Rectangle's mutable-width/height interface.'\n\n**Interface Segregation Principle (ISP)**: No client should be forced to depend on methods it does not use — many small, focused interfaces beat one large, general-purpose interface. Code smell: an `IWorker` interface with `work()` and `eat()`, implemented by both `HumanWorker` and `RobotWorker` — the `RobotWorker` is now forced to implement a meaningless (or exception-throwing) `eat()` method it has no real behavior for. Fix: split into `IWorkable` (`work()`) and `IFeedable` (`eat()`); `HumanWorker` implements both, `RobotWorker` implements only `IWorkable`, and neither class carries a method that doesn't apply to it.\n\n**Dependency Inversion Principle (DIP)**: High-level modules should not depend on low-level modules — both should depend on abstractions, and abstractions should not depend on details (details should depend on abstractions). Code smell: a `NotificationService` class that directly instantiates and calls `new EmailSender().send(msg)` inside its method body — the high-level notification logic is now welded to one specific low-level implementation, making it untestable (can't inject a mock) and unextendable (adding SMS means editing `NotificationService` directly). Fix: define an `IMessageSender` interface, have `NotificationService` depend on that interface (injected via constructor), and let `EmailSender`, `SMSSender`, etc. implement it — the high-level policy no longer knows or cares which concrete sender it's using, and note this pairs directly with OCP (you can now add senders without modifying `NotificationService`) and with the Strategy pattern (this is precisely how Strategy is implemented).",
  realWorldExamples:
    "Java's `java.io` stream classes largely follow OCP and DIP: `InputStream` is an abstraction that `BufferedInputStream`, `FileInputStream`, and countless others implement, and code written against `InputStream` works with any of them without modification. Spring Framework's dependency injection container is DIP made into a framework feature — your service classes declare dependencies on interfaces, and Spring wires in concrete implementations at runtime, meaning your business logic never directly instantiates its infrastructure. The classic Square-extends-Rectangle LSP violation appears in almost every OOP interview and textbook precisely because it looks correct at the type-system level while being wrong at the behavioral level — a strong signal for why LSP is the most subtle of the five.",
  useCases: [
    "SRP: refactoring a bloated 'god class' that mixes business logic, persistence, and presentation into focused, independently-changeable classes",
    "OCP: building a plugin or strategy system where new behaviors are added as new classes rather than new if/else branches",
    "LSP: validating an inheritance hierarchy actually preserves the base class's behavioral contract before shipping it",
    "ISP: designing framework/library interfaces so implementers aren't forced to stub out irrelevant methods",
    "DIP: structuring layered applications (controller -> service -> repository) so high-level logic depends on interfaces, enabling unit testing via mocks",
  ],
  advantages: [
    "Each principle independently reduces a specific, well-known cause of fragile, hard-to-extend code",
    "Applied together, they make codebases easier to unit test (DIP enables mocking), extend (OCP), and refactor safely (SRP)",
    "They give teams a shared, precise vocabulary for code review feedback ('this violates SRP' is more actionable than 'this class feels messy')",
  ],
  disadvantages: [
    "Over-applying SOLID prematurely (e.g. creating an interface for every class 'just in case') adds indirection and complexity without corresponding benefit — a real anti-pattern nicknamed 'interface bloat'",
    "SRP's 'one reason to change' is subjective and can be interpreted so narrowly that classes become excessively fragmented",
    "LSP violations are subtle and often only surface through careful contract analysis or bugs in production, not compiler errors",
    "Following DIP everywhere without a DI framework can require a lot of manual wiring boilerplate",
  ],
  commonMisconceptions: [
    "\"LSP just means subclasses must compile against the base class type\" — the actual requirement is behavioral: any code relying on the base class's documented behavior must keep working correctly, not merely compile, when given a subclass instance.",
    "\"SRP means a class should have only one method\" — SRP is about one *reason to change* (one responsibility/stakeholder axis), not a method count; a class can have many methods that all serve the same single responsibility.",
    "\"Open/Closed means you can never modify a class again\" — it means you shouldn't need to modify *already-working, tested* code to add new variants of behavior; genuine bug fixes and internal improvements are still expected.",
    "\"Dependency Inversion is the same as Dependency Injection\" — DIP is the design principle (depend on abstractions); Dependency Injection is one common technique/mechanism (usually via a framework) used to satisfy DIP, but you can follow DIP without a DI framework, and use DI without fully respecting DIP.",
  ],
  interviewPerspective:
    "Expect interviewers to name a principle and ask for its precise definition plus a code smell/fix example — and Liskov Substitution specifically is the one where interviewers most often test whether you understand it's about behavioral substitutability, not compile-time inheritance, using the Square/Rectangle example as the standard trap. Be ready to point out that SOLID principles interact (e.g., DIP is what makes OCP practically achievable in a plugin architecture, and ISP is a special case of applying SRP to interfaces).",
  oaPerspective:
    "OA questions typically present a short code snippet with an obvious code smell (a big if/else chain, a fat interface, a subclass that overrides a method to throw `UnsupportedOperationException`) and ask which SOLID principle it violates, or occasionally show a refactored 'after' version and ask which principle was applied. Expect at least one question specifically targeting the Square-extends-Rectangle LSP trap.",
  keyTakeaways: [
    "SRP: one reason to change per class — separate responsibilities that evolve for different reasons.",
    "OCP: extend behavior by adding new code (new classes/implementations), not by editing existing, working code.",
    "LSP: subtypes must be behaviorally substitutable for their base type — preserving correctness, not just compiling.",
    "ISP: prefer many small, focused interfaces over one fat interface that forces irrelevant methods on implementers.",
    "DIP: high-level modules and low-level modules should both depend on abstractions, not on each other directly.",
  ],
  summaryClosing:
    "SOLID isn't five arbitrary rules to memorize — it's five names for five specific, recurring ways OOP code becomes fragile, and every principle is best understood (and best explained in an interview) through the concrete code smell it fixes rather than its dictionary definition alone.",
  relatedTopics: ["Abstract Classes & Interfaces", "Inheritance", "Structural & Behavioral Design Patterns", "Creational Design Patterns"],
  furtherReading: [
    { label: "Robert C. Martin — Agile Software Development, Principles, Patterns, and Practices", note: "The original source that formalized and named the SOLID principles." },
    { label: "Liskov Substitution Principle, Barbara Liskov's 1987 paper", note: "The formal behavioral-subtyping definition LSP is named after." },
  ],
};

export default solidPrinciplesArticle;
