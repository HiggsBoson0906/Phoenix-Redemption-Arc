// src/content/cs-fundamentals/oops/interview/abstractClassesInterfaces.interview.ts

import type { InterviewQuestion } from "@/types";

const abstractClassesInterfacesInterviewQuestions: InterviewQuestion[] = [
  {
    id: "abstract-classes-interfaces-iv-1",
    question: "What is the difference between an abstract class and an interface?",
    difficulty: "Easy",
    detailedAnswer:
      "An abstract class can hold instance state (fields), have constructors, and mix fully-implemented concrete methods with abstract methods that subclasses must implement — but a class can extend only one abstract class, since Java disallows multiple class inheritance. An interface traditionally holds no instance state and declares only method signatures (a pure contract); since Java 8, interfaces can also have default methods (with a body, which implementing classes inherit unless they override) and static methods, but they still cannot hold per-object mutable fields. Crucially, a class can implement any number of interfaces simultaneously, giving far more flexibility than single-inheritance abstract classes for combining multiple contracts.",
    idealAnswer:
      "The structural difference that matters most is: you can only extend one abstract class, but you can implement as many interfaces as you want. Abstract classes are for when related types genuinely share state or reusable implementation — like a base Employee class with a name field and a calculatePay() helper. Interfaces are for describing a capability that logically unrelated classes might share — like Comparable, which String, Integer, and a custom class can all implement despite having nothing else in common.",
    interviewerExpectations: [
      "States the single-inheritance vs multiple-implementation asymmetry explicitly",
      "Mentions state: abstract classes can hold it, interfaces (traditionally) cannot",
      "Aware of Java 8 default methods without overstating how much they blurred the line",
    ],
    followUpQuestions: [
      "How did Java 8 default methods change this distinction?",
      "Can an abstract class implement an interface?",
      "Give me a concrete example of when you'd pick one over the other.",
    ],
    commonMistakes: [
      "Saying interfaces can never have any implementation at all (outdated post-Java-8)",
      "Not mentioning the extend-one vs implement-many asymmetry",
    ],
    discussionPoints: ["Single vs multiple inheritance", "State vs pure contract", "Default methods"],
  },
  {
    id: "abstract-classes-interfaces-iv-2",
    question: "How did default methods in Java 8 change the classic abstract-class-vs-interface distinction, and did they reintroduce any version of the diamond problem?",
    difficulty: "Medium",
    detailedAnswer:
      "Before Java 8, interfaces were pure contracts — 100% abstract, no implementation whatsoever. Java 8 added default methods, letting an interface provide a concrete fallback body that implementing classes inherit automatically unless they choose to override it, largely to allow adding new methods to existing interfaces (like `Collection.stream()`) without breaking every existing implementer. This did reintroduce a milder version of the diamond problem: if a class implements two interfaces that both provide conflicting default implementations of the same method signature, Java refuses to guess which one applies — it forces the implementing class to explicitly override the method and resolve the conflict itself (optionally delegating to a specific interface's version via `InterfaceName.super.method()`). This is much less severe than the classic state-based diamond problem, though, because interfaces still cannot hold instance state, so there's no ambiguity about which copy of some field to use — only about which behavior to run.",
    idealAnswer:
      "Before default methods, interfaces were pure signatures — no behavior at all. Default methods let Java add new methods to interfaces like Collection without breaking every class that already implemented it, since the default body kicks in automatically. It does bring back a lighter version of the diamond problem: if two interfaces you implement both give a conflicting default for the same method, Java won't silently pick one — it makes you override it yourself and decide. But it's genuinely milder than the classic version because there's still no shared state involved, just conflicting behavior to choose between.",
    interviewerExpectations: [
      "Explains the historical motivation for default methods (interface evolution, e.g. Collection.stream())",
      "Correctly identifies the conflict-resolution requirement as mandatory explicit override",
      "Notes this is milder than the state-based diamond problem, and explains why",
    ],
    followUpQuestions: [
      "How do you call a specific interface's default method explicitly when resolving a conflict?",
      "Why did the Collections framework specifically need default methods?",
      "Are static methods on interfaces inherited by implementing classes the same way default methods are?",
    ],
    commonMistakes: [
      "Not knowing default methods exist or their motivation",
      "Claiming this is identical in severity to the classic multiple-inheritance diamond problem",
    ],
    discussionPoints: ["Interface evolution", "Default method conflict resolution", "InterfaceName.super syntax"],
  },
  {
    id: "abstract-classes-interfaces-iv-3",
    question: "Why can a class implement multiple interfaces but extend only one class? What problem would allowing multiple class inheritance create?",
    difficulty: "Medium",
    detailedAnswer:
      "Allowing a class to extend multiple classes would reintroduce the full diamond problem for state: if two parent classes both define a field or a concrete method with the same name, and both ultimately derive from a common ancestor, it becomes genuinely ambiguous which version/copy the subclass should inherit — C++ allows this and resolves it with explicit qualification or virtual inheritance, at the cost of real complexity. Interfaces sidestep this because they traditionally hold no instance state at all, so there's no shared field to duplicate or disambiguate; the only possible conflict is over behavior (default methods), which Java resolves by forcing explicit override rather than silently choosing. Restricting extension to one class keeps state inheritance unambiguous while still letting a class satisfy many independent behavioral contracts via interfaces.",
    idealAnswer:
      "Because state is the dangerous part — if you could extend two classes that both had a field or method inherited from some common ancestor, you'd get the full diamond problem: which copy does the subclass actually have? Java sidesteps that entirely by only allowing one class to extend. Interfaces don't have that danger because they don't carry state, so implementing many of them just means promising to fulfill many independent behavioral contracts, with the only possible clash being conflicting default methods — which Java handles by making you resolve it explicitly instead of guessing.",
    interviewerExpectations: [
      "Explicitly connects the restriction to avoiding state-based diamond ambiguity",
      "Explains why interfaces are safe to allow multiply (no state to conflict over)",
      "Doesn't just state the rule without explaining the underlying reason",
    ],
    followUpQuestions: [
      "How does C++ allow multiple class inheritance despite this risk? What's the trade-off?",
      "Is there ever a legitimate need for a class to inherit implementation from two unrelated sources? How would you achieve that in Java?",
      "What is 'interface segregation' and how does it relate to designing many small interfaces?",
    ],
    commonMistakes: [
      "Only stating 'Java just doesn't allow it' without explaining the underlying diamond-problem motivation",
      "Confusing this with why static methods can't be overridden",
    ],
    discussionPoints: ["Diamond problem avoidance", "Composition as an alternative for shared implementation", "Interface segregation principle"],
  },
  {
    id: "abstract-classes-interfaces-iv-4",
    question: "You're reviewing a PR where a developer created an interface with 15 methods for a `Vehicle` type, and every implementing class only actually needs 3-4 of them, throwing UnsupportedOperationException for the rest. What would you flag?",
    difficulty: "Medium",
    detailedAnswer:
      "This is a violation of the Interface Segregation Principle (the 'I' in SOLID) — a fat interface forces implementers to either provide meaningless/throwing implementations for methods they don't logically support, or accept a leaky, dishonest contract. I'd flag that throwing UnsupportedOperationException from an interface method is a code smell indicating the interface's contract doesn't actually apply uniformly to all its implementers — callers holding a reference to the interface type have no static guarantee the operation will actually work, defeating the whole purpose of programming against an abstraction. I'd recommend splitting the 15-method interface into smaller, focused interfaces (e.g. `Drivable`, `Refuelable`, `Chargeable` for electric-specific behavior) so each concrete class implements only the interfaces whose full contract it can genuinely honor, which also means callers can depend on exactly the narrower capability they need instead of the full 15-method surface.",
    idealAnswer:
      "That's a classic interface segregation violation — a bloated interface forcing classes to either fake-implement methods that don't make sense for them or throw at runtime, which quietly breaks the whole point of the interface as a reliable contract. I'd suggest breaking it into smaller, role-specific interfaces — something like Drivable, Refuelable, maybe Chargeable for electric vehicles — so each class only implements what it can genuinely support, and callers depending on just one capability aren't coupled to the other fourteen methods they don't care about.",
    interviewerExpectations: [
      "Names the Interface Segregation Principle (or describes it precisely even without the name)",
      "Identifies throwing UnsupportedOperationException as the concrete symptom of the problem",
      "Proposes splitting into smaller, focused interfaces as the fix",
    ],
    followUpQuestions: [
      "How would you migrate existing code depending on the old fat interface to the new smaller ones?",
      "Is there ever a legitimate reason to have a large interface?",
      "How does this relate to the Liskov Substitution Principle?",
    ],
    commonMistakes: [
      "Not recognizing UnsupportedOperationException-throwing methods as a design smell",
      "Suggesting an abstract class as the fix without addressing the interface segregation issue itself",
    ],
    discussionPoints: ["Interface Segregation Principle", "Fat interface anti-pattern", "Liskov Substitution Principle connection"],
  },
  {
    id: "abstract-classes-interfaces-iv-5",
    question:
      "Design a class hierarchy for a payment processing system that must support credit cards, bank transfers, and digital wallets today, with new payment methods added regularly. Would you use abstract classes, interfaces, or both, and why?",
    difficulty: "Hard",
    detailedAnswer:
      "I'd start with a `PaymentMethod` interface defining the essential contract every payment type must honor: `authorize(amount)`, `capture()`, `refund(amount)` — this is the capability description, and since payment types like CreditCard, BankTransfer, and DigitalWallet are otherwise unrelated in implementation, an interface (not a shared base class) is the right tool for the pure contract. I'd then likely introduce an `AbstractPaymentMethod` abstract class implementing `PaymentMethod` that provides genuinely shared, reusable logic — e.g. common validation (amount > 0), a shared audit-logging hook called before/after every authorize/capture/refund, and a `transactionId` field with its generation logic — since this state and behavior really is common across most payment types and shouldn't be duplicated in each concrete class. Concrete classes (`CreditCardPayment`, `BankTransferPayment`, `DigitalWalletPayment`) would extend `AbstractPaymentMethod`, adding only their type-specific logic (e.g. CVV validation for credit cards, IBAN validation for bank transfers). For payment-type-specific optional capabilities that don't apply to all types — e.g. `Refundable` might not apply to certain irreversible transfer types, or `Recurring` for subscription-capable methods — I'd model those as small, separate interfaces a given concrete class opts into, rather than bloating the core `PaymentMethod` contract, directly avoiding the fat-interface/interface-segregation problem. This design lets new payment methods (say, a future `CryptoPayment`) be added by writing one new class extending `AbstractPaymentMethod`, with zero changes to any existing dispatching code, satisfying the 'add new payment methods regularly' requirement through polymorphism and the open/closed principle.",
    idealAnswer:
      "I'd use both, each for what it's good at. A `PaymentMethod` interface defines the core contract — authorize, capture, refund — since credit cards, bank transfers, and wallets are otherwise unrelated implementations sharing just that capability. Then an `AbstractPaymentMethod` class implementing that interface holds the genuinely shared logic: common amount validation, an audit-logging hook, a transactionId field — stuff that really is common and shouldn't be copy-pasted into every concrete class. Concrete types extend that abstract class and only add their specific logic, like CVV checks for credit cards. For capabilities that don't apply to every type — like recurring billing only some methods support — I'd pull those into small separate interfaces a class opts into, rather than jamming everything into one bloated PaymentMethod interface. That way, adding a new payment method later is just one new class, no existing code touched.",
    interviewerExpectations: [
      "Uses an interface for the core, universally-shared contract",
      "Uses an abstract class for genuinely shared implementation/state (not just for the sake of using both)",
      "Separates optional/type-specific capabilities into smaller interfaces rather than bloating the main contract",
      "Explicitly connects the design to supporting frequent addition of new payment types without modifying existing code",
    ],
    followUpQuestions: [
      "How would you handle a payment method that needs to skip the shared audit-logging hook for a legitimate reason?",
      "Would you make AbstractPaymentMethod's authorize() a template method calling abstract hook methods? Walk through that.",
      "How would this design support adding a completely new capability like fraud scoring without touching every existing payment class?",
    ],
    commonMistakes: [
      "Using only an abstract class with no interface, losing the flexibility for unrelated future payment types",
      "Using only an interface and duplicating common validation/logging logic in every concrete class",
      "Cramming every possible capability into one large PaymentMethod interface",
    ],
    discussionPoints: ["Interface + abstract class combination", "Template method pattern", "Interface segregation for optional capabilities", "Open/closed principle for extensibility"],
    scenarioBased: true,
  },
];

export default abstractClassesInterfacesInterviewQuestions;
