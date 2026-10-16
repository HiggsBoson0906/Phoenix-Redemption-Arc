// src/content/cs-fundamentals/oops/interview/solidPrinciples.interview.ts

import type { InterviewQuestion } from "@/types";

const solidPrinciplesInterviewQuestions: InterviewQuestion[] = [
  {
    id: "solid-principles-iv-1",
    question: "What does the Single Responsibility Principle actually mean, and what's a real example of violating it?",
    difficulty: "Easy",
    detailedAnswer:
      "SRP states a class should have only one reason to change — one responsibility, owned by one stakeholder/axis of change, not literally 'one method' or 'one thing it does.' A common violation: an `Employee` class with `calculateSalary()`, `saveToDatabase()`, and `generateReport()` all in one class — payroll rules, persistence/schema concerns, and reporting format each change independently and for different business reasons, so a database migration risks touching (and breaking) payroll logic that lives in the same file. The fix is splitting into `Employee` (domain data + payroll logic), `EmployeeRepository` (persistence), and `EmployeeReportGenerator` (reporting), so each class changes only when its one specific concern changes.",
    idealAnswer:
      "SRP means a class should have exactly one reason to change, not one method — a class can have many methods as long as they all serve the same responsibility. The violation I see most often is a class like Employee that mixes calculateSalary(), saveToDatabase(), and generateReport() together; those are three totally different concerns — payroll rules, persistence, reporting — that change for different reasons, so bundling them means a schema change can accidentally break payroll logic sitting in the same class. Splitting it into Employee, EmployeeRepository, and an EmployeeReportGenerator gives each one a single, isolated reason to ever be modified.",
    interviewerExpectations: [
      "Correctly states 'one reason to change,' not a method-count misconception",
      "Gives a concrete before/after example with named responsibilities",
      "Explains the actual risk of violating SRP (unrelated changes ending up coupled)",
    ],
    followUpQuestions: [
      "How granular is too granular when splitting responsibilities?",
      "How does SRP relate to the 'god class' anti-pattern?",
      "Can a class satisfy SRP and still have ten methods?",
    ],
    commonMistakes: [
      "Claiming SRP means 'one method per class'",
      "Giving only the definition with no concrete violating example",
    ],
    discussionPoints: ["Reason to change vs method count", "God class anti-pattern", "Stakeholder-driven responsibility boundaries"],
  },
  {
    id: "solid-principles-iv-2",
    question: "Explain the Liskov Substitution Principle precisely — why is 'a subclass that compiles and overrides methods correctly' not sufficient to satisfy it?",
    difficulty: "Medium",
    detailedAnswer:
      "LSP requires that objects of a subtype be substitutable for objects of the base type without altering the correctness of the program — this is a behavioral guarantee about preconditions, postconditions, and invariants, not a type-system/compilation guarantee. The standard demonstration is Square extending Rectangle: if Square overrides setWidth/setHeight to keep both sides equal, it compiles fine and technically 'is-a' Rectangle in the type system, but any code that correctly relied on Rectangle's actual behavior — like setting width and height independently and expecting area to reflect exactly those two values — silently gets the wrong answer when handed a Square. The type checker is satisfied; the behavioral contract is not. That's precisely why LSP violations aren't caught by compilers and require actual reasoning about what the base type's contract promises callers.",
    idealAnswer:
      "The key insight is that LSP is about behavior, not syntax — a subclass can override every method with the correct signature and still violate LSP if it changes what those methods actually guarantee. Square-extends-Rectangle is the canonical case: Square compiles perfectly as a Rectangle and overrides setWidth/setHeight validly, but it silently breaks any code that assumed setting width and height independently would give you an area equal to their product — because Square forces them to stay equal. Nothing about that shows up as a compiler error; it shows up as a wrong answer at runtime. That's why I always describe LSP as 'can I substitute this subtype in and trust the program still behaves correctly,' not 'does this subtype inherit correctly.'",
    interviewerExpectations: [
      "Explicitly separates 'compiles/type-checks' from 'behaviorally correct'",
      "Uses the Square/Rectangle example (or an equally precise equivalent) correctly",
      "Explains why this can't be caught by the compiler",
    ],
    followUpQuestions: [
      "How would you redesign Square and Rectangle to avoid this LSP violation?",
      "Can you think of an LSP violation that doesn't involve overriding a setter?",
      "What are preconditions and postconditions in the context of LSP?",
    ],
    commonMistakes: [
      "Defining LSP as just 'subclasses should work wherever the base class is used' without explaining what 'work' means behaviorally",
      "Using an incorrect or garbled version of the Square/Rectangle example",
    ],
    discussionPoints: ["Behavioral subtyping", "Preconditions/postconditions/invariants", "Why compilers can't catch LSP violations"],
  },
  {
    id: "solid-principles-iv-3",
    question: "What's the difference between the Open/Closed Principle and the Dependency Inversion Principle? Aren't they basically the same thing?",
    difficulty: "Medium",
    detailedAnswer:
      "They're related but distinct. Open/Closed is about extensibility direction: a module should be extendable with new behavior without modifying its existing, already-tested source code — typically achieved via polymorphism, where new variants are added as new classes implementing a shared interface rather than new branches in an existing conditional. Dependency Inversion is about the direction of source-code dependencies: high-level modules shouldn't depend on low-level modules directly — both should depend on abstractions, so a policy-level class (e.g. `NotificationService`) references an interface (`IMessageSender`) rather than a concrete class (`EmailSender`). In practice they reinforce each other: DIP is usually what *makes OCP achievable* in a real dependency graph — if `NotificationService` depended directly on `EmailSender`, you couldn't add an `SMSSender` without editing `NotificationService`; because it depends on the `IMessageSender` abstraction instead, adding `SMSSender` satisfies OCP for free. But you can violate one without violating the other: a single class that has zero external dependencies at all can still violate OCP via an internal if/else chain, and DIP is really about dependency direction between layers, not about extension mechanics.",
    idealAnswer:
      "They're closely linked but answer different questions. OCP asks: can I add new behavior without editing working code? DIP asks: which direction do my dependencies point — does my high-level logic depend on concrete low-level details, or on abstractions? In practice, DIP is usually the enabling mechanism for OCP: if my NotificationService depends on an IMessageSender interface instead of a concrete EmailSender class, then adding SMS support means writing a new SMSSender class and wiring it in — zero edits to NotificationService, which is exactly OCP. But you can imagine violating OCP without any dependency-direction issue at all — like a single self-contained class with an if/else chain and no external dependencies — so I wouldn't call them the same principle, just principles that usually work together.",
    interviewerExpectations: [
      "Clearly distinguishes 'extension without modification' (OCP) from 'dependency direction on abstractions' (DIP)",
      "Explains how DIP typically enables OCP in practice with a concrete example",
      "Gives an example where one could be violated without the other",
    ],
    followUpQuestions: [
      "Can you give an example of an OCP violation that has nothing to do with DIP?",
      "How does a dependency injection framework like Spring make DIP easier to apply consistently?",
      "Which design patterns most directly help implement OCP?",
    ],
    commonMistakes: [
      "Treating OCP and DIP as interchangeable without explaining how they actually differ",
      "Failing to explain the enabling relationship between DIP and OCP",
    ],
    discussionPoints: ["Extension mechanics vs dependency direction", "How DIP enables OCP in practice", "Polymorphism as the common implementation tool"],
  },
  {
    id: "solid-principles-iv-4",
    question: "Can following SOLID principles too aggressively make code worse? Give a concrete example.",
    difficulty: "Hard",
    detailedAnswer:
      "Yes — over-applying SOLID, especially OCP and ISP, without a real need produces speculative generality and interface bloat: creating an interface for every class 'just in case it needs to be swapped later,' or splitting a cohesive two-method class into three interfaces because ISP says 'small interfaces,' adds a layer of indirection that makes the codebase harder to navigate (you now jump through an interface to find the one implementation that will ever exist) without any corresponding flexibility benefit, since that flexibility is never actually exercised. A concrete example: wrapping a simple `TaxCalculator` class — which will only ever have one implementation, calculating tax with a fixed, stable formula — behind an `ITaxCalculator` interface, a `TaxCalculatorFactory`, and dependency injection wiring, all to satisfy DIP/OCP 'preemptively,' when nothing in the actual requirements suggests a second implementation is coming. This is sometimes called 'speculative generality' or the YAGNI ('You Aren't Gonna Need It') violation — SOLID principles are meant to solve *actual* recurring pain (a real second implementation, a real need to mock in tests, a real history of edits to the same conditional), not to be applied uniformly as decoration.",
    idealAnswer:
      "Definitely — the failure mode is usually called speculative generality: wrapping every single class behind an interface and a factory 'just in case' you need a second implementation someday, even when nothing about the requirements suggests one is coming. I've seen a simple, single-formula TaxCalculator turned into an ITaxCalculator interface plus a TaxCalculatorFactory plus DI wiring for a class that will only ever have one real implementation — that's pure overhead with zero actual flexibility gained, and it makes the code harder to read because now you have to jump through an interface to find the one class that implements it. SOLID principles are meant to address real, recurring pain — an actual second payment method showing up, an actual need to mock a dependency in tests — not to be applied uniformly everywhere as a checklist.",
    interviewerExpectations: [
      "Acknowledges that SOLID is not an absolute law and can be over-applied",
      "Names the failure mode concretely (speculative generality / interface bloat / YAGNI)",
      "Gives a specific, plausible over-engineering example",
    ],
    followUpQuestions: [
      "How do you decide when a principle is worth applying versus when it's premature?",
      "What's the relationship between YAGNI and SOLID?",
      "Have you had to push back on a design that over-applied SOLID? What did you do?",
    ],
    commonMistakes: [
      "Insisting SOLID should always be applied maximally with no acknowledgment of trade-offs",
      "Vague hand-waving about 'over-engineering' without a concrete example tied to a specific principle",
    ],
    discussionPoints: ["Speculative generality", "YAGNI", "Judgment over dogma in applying design principles"],
  },
  {
    id: "solid-principles-iv-5",
    question:
      "You inherit a NotificationSystem class that looks like this:\n\nclass NotificationSystem {\n  void notify(String type, String message) {\n    if (type.equals(\"EMAIL\")) { new EmailSender().send(message); }\n    else if (type.equals(\"SMS\")) { new SmsSender().send(message); }\n    else if (type.equals(\"PUSH\")) { new PushSender().send(message); }\n  }\n}\n\nYour team wants to add Slack and WhatsApp notifications next quarter, and also wants to unit test the existing logic without actually sending real messages. Refactor this to follow SOLID principles and walk through your reasoning.",
    difficulty: "Hard",
    scenarioBased: true,
    detailedAnswer:
      "This class violates OCP (every new channel requires editing the if/else chain) and DIP (NotificationSystem directly instantiates concrete sender classes, making it untestable without real side effects). The refactor: define a `NotificationChannel` interface with a single `send(String message)` method; implement `EmailSender`, `SmsSender`, `PushSender` as classes implementing that interface (unchanged internally); change `NotificationSystem` to depend on a `List<NotificationChannel>` (or a `Map<String, NotificationChannel>`) injected via its constructor, rather than instantiating senders itself, and have `notify()` simply call `channel.send(message)` polymorphically on whichever channel(s) it's given. This satisfies OCP directly — adding `SlackSender` and `WhatsAppSender` next quarter means writing two new classes implementing `NotificationChannel` and registering them at the composition root, with zero edits to `NotificationSystem`. It satisfies DIP because `NotificationSystem` (high-level policy) now depends only on the `NotificationChannel` abstraction, not on concrete senders. And it directly solves the testing requirement: tests can inject a `FakeNotificationChannel` (a test double implementing the same interface, recording calls instead of sending real messages) into `NotificationSystem`'s constructor, verifying `notify()` calls `send()` with the right message without touching any real email/SMS/push infrastructure. I'd also double check ISP here — if `NotificationChannel` starts accumulating channel-specific methods (e.g. `sendWithAttachment()` only Email supports), split those into a separate, optional interface rather than forcing every channel to implement irrelevant methods.",
    idealAnswer:
      "First I'd name the two problems precisely: this violates Open/Closed because every new channel means editing this exact if/else block, and it violates Dependency Inversion because NotificationSystem is 'new'-ing up concrete sender classes itself, which is also exactly why you can't unit test it without real side effects. My fix: pull out a NotificationChannel interface with one send(message) method, make EmailSender/SmsSender/PushSender implement it without changing their internals, and change NotificationSystem to receive its channels through the constructor instead of constructing them itself. Now adding Slack and WhatsApp next quarter is just two new classes implementing NotificationChannel, registered wherever the app wires things up — I don't touch NotificationSystem at all, which is OCP working as intended. And for testing, since NotificationSystem now depends on the NotificationChannel abstraction, I can inject a fake test-double channel that just records what it was called with, and assert on that, with zero real messages sent — that's DIP directly enabling the testability the team asked for. If channels start needing wildly different extra methods later, I'd split those into a separate interface too, so I don't force every channel to implement things it doesn't need — that's ISP.",
    interviewerExpectations: [
      "Correctly names both violated principles (OCP and DIP) with accurate justification",
      "Produces a concrete, correct refactor (interface + constructor injection + polymorphic dispatch)",
      "Explicitly connects the refactor to both stated requirements: adding new channels, and testability via fakes/mocks",
    ],
    followUpQuestions: [
      "How would you register/wire the concrete channel implementations without NotificationSystem knowing about them directly?",
      "What if different channels need different configuration (e.g. Slack needs a webhook URL) — how does that affect the interface design?",
      "Is this refactor also an instance of the Strategy design pattern? Why or why not?",
    ],
    commonMistakes: [
      "Only removing the if/else chain without also removing the direct instantiation (still violates DIP even with polymorphism)",
      "Not connecting the refactor back to the specific testability requirement the scenario asked for",
    ],
    discussionPoints: ["OCP via polymorphism", "DIP via constructor injection", "Test doubles enabled by depending on abstractions", "Strategy pattern connection"],
  },
];

export default solidPrinciplesInterviewQuestions;
