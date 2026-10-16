// src/content/cs-fundamentals/oops/articles/abstractClassesInterfaces.ts

import type { Article } from "@/types";

const abstractClassesInterfacesArticle: Article = {
  slug: "abstract-classes-interfaces",
  title: "Abstract Classes & Interfaces",
  summary:
    "Abstract classes and interfaces both let you define a contract without full implementation, but they differ sharply in what they can share (state vs pure behavior) and how many a single class can extend or implement.",
  readingTimeMins: 9,
  beginnerExplanation:
    "An abstract class is a class that cannot be instantiated directly — you can't write `new Shape()` if `Shape` is abstract — and it can mix fully-implemented methods with abstract methods (declared but with no body, forcing subclasses to provide one). An interface, in its classic form, is a pure contract: a list of method signatures with no implementation at all, describing *what* a class can do without saying *how*. A class 'is-a' its abstract superclass (single inheritance only), but a class can 'promise to do' many different interfaces at once (multiple interface implementation is allowed).\n\nA simple mental model: use an abstract class when a group of related classes share meaningful common state or implementation (e.g. all `Employee` subtypes share a `name` field and a `calculatePayroll()` helper) — use an interface when you're describing a capability that unrelated classes might share (e.g. `Flyable`, implemented by both `Bird` and `Airplane`, which otherwise have nothing to do with each other).",
  detailedBreakdown:
    "An abstract class (declared `abstract class X` in Java, or a C++ class with at least one pure virtual function `virtual void foo() = 0;`) can have constructors, instance fields with real state, fully-implemented concrete methods, and abstract methods with no body that subclasses must implement. It cannot be instantiated directly, but subclasses call its constructor via `super(...)` just like any other inheritance relationship. A class can extend only one abstract class (Java disallows multiple class inheritance, abstract or not), so this remains a single-inheritance relationship.\n\nAn interface, classically, declares only method signatures (and constants) with no implementation and no instance state — it's a pure contract. Modern Java (since Java 8) added `default` methods, which let an interface provide a concrete fallback implementation that implementing classes inherit automatically unless they choose to override it, and `static` methods, which belong to the interface itself. This blurred the historically sharp line between interfaces and abstract classes somewhat, but a fundamental distinction remains: interfaces still cannot hold instance state (no non-static, non-final fields), and a class can implement any number of interfaces simultaneously, whereas it can extend only one class (abstract or not).\n\nThis 'implement many interfaces, extend only one class' asymmetry is precisely why interfaces sidestep the sharpest version of the diamond problem: since interfaces (traditionally) carry no state, there's no ambiguity about *which copy* of some field a class should have when implementing multiple interfaces — there's no state to duplicate in the first place. The milder version that does arise with modern default methods (two interfaces providing conflicting default implementations of the same signature) is handled by forcing the implementing class to explicitly override and resolve the conflict, rather than the language silently picking one, as covered in the Inheritance topic.\n\nWhen to use which: reach for an abstract class when subtypes share substantial common state or behavior that benefits from being written once (a template method pattern, where the abstract class defines the overall algorithm skeleton and subclasses fill in specific steps, is a classic use). Reach for an interface when you're defining a capability or role that logically unrelated classes might all satisfy, when you need a class to support multiple contracts simultaneously, or when you want maximum flexibility for future implementers who might not want to be locked into a specific class hierarchy. In practice, many well-designed systems combine both: an interface defines the public contract (`PaymentMethod`), and an abstract class (`AbstractPaymentMethod`) provides a partial, reusable implementation of that interface that concrete subclasses (`CreditCardPayment`) can extend to avoid rewriting common boilerplate — this is a well-known pattern sometimes called the 'abstract base class + interface' combo.\n\nC++ has no separate `interface` keyword; the equivalent is an abstract class where every method is a pure virtual function (`virtual void foo() = 0;`) and there are no data members — by convention, this plays the same role as a Java interface, and C++ does allow a class to inherit from multiple such 'interface-like' abstract classes simultaneously (true multiple inheritance), managing the diamond problem the same way described in the Inheritance topic (virtual inheritance) if it arises.",
  realWorldExamples:
    "Java's `Comparable<T>` and `Comparator<T>` are interfaces — many unrelated classes (`String`, `Integer`, a custom `Employee` class) can implement `Comparable` to support sorting, even though they share no common ancestor otherwise. Java's `AbstractList` provides a partial `List` implementation (handling iteration logic generically) that concrete classes like `ArrayList` extend, filling in only the specifics — a textbook abstract-class-plus-interface combination. GUI frameworks often use abstract classes for widget base types (`AbstractButton` in Swing, sharing common rendering/event-handling state) while using interfaces like `ActionListener` to describe a pure behavioral contract (respond to a click) that any class, related or not, can implement.",
  useCases: [
    "Sharing common state and partial implementation across closely related subtypes (abstract class + template method pattern)",
    "Defining a capability/role multiple unrelated classes can satisfy simultaneously (interfaces like Comparable, Serializable, Runnable)",
    "Combining both: an interface for the public contract, an abstract class implementing it partially to reduce boilerplate for concrete subclasses",
  ],
  advantages: [
    "Abstract classes let you avoid duplicating shared state/logic across subclasses while still forcing specific methods to be implemented per subclass",
    "Interfaces allow a single class to satisfy multiple unrelated contracts simultaneously, which single-inheritance abstract classes cannot do",
    "Both let you write code against a contract/abstraction rather than a concrete implementation, enabling polymorphism and easier testing (mocking an interface)",
  ],
  disadvantages: [
    "A class can only extend one abstract class, which can force awkward hierarchy decisions if a type genuinely needs to share implementation from two unrelated sources",
    "Overusing interfaces with many default methods can quietly reintroduce multiple-inheritance-style complexity and default-method conflict resolution",
    "Excessive abstraction layers (interface implemented by abstract class implemented by concrete class) can make it harder to trace actual behavior without IDE navigation",
  ],
  commonMisconceptions: [
    "\"Interfaces can never have any implementation\" — since Java 8, interfaces can have `default` and `static` methods with real implementations, though they still cannot hold instance (non-static, non-final) state.",
    "\"Abstract classes and interfaces are interchangeable — just pick either\" — abstract classes support shared state and single inheritance; interfaces support no state (traditionally) but multiple implementation. The choice has real structural consequences, not just stylistic ones.",
    "\"A class implementing multiple interfaces is basically multiple inheritance and has the same diamond problem\" — because interfaces (traditionally) carry no state, the sharpest part of the diamond problem (which copy of shared state to use) doesn't apply; only the milder default-method conflict can occur, and Java requires it to be resolved explicitly.",
  ],
  interviewPerspective:
    "This is asked constantly as 'when would you use an abstract class vs an interface,' and interviewers are listening for a decision framework (shared state/implementation → abstract class; multiple unrelated contracts → interface), not a memorized bullet-point list. Be ready to explain exactly how Java 8's default methods changed the classic distinction, why a class can implement many interfaces but extend only one class, and to design a small example live (e.g. 'design PaymentMethod as an interface and show a partial AbstractPaymentMethod implementing it').",
  oaPerspective:
    "OA MCQs frequently test the exact syntax/legality rules: can an interface have a constructor (no), can an abstract class have a constructor (yes, called via subclass's super()), can you instantiate an abstract class directly (no, compile error), and whether a class can extend two abstract classes (no, only interfaces support multiple implementation in Java). Expect at least one question distinguishing 'abstract method with no body forces subclass implementation' from 'default method provides a usable fallback subclasses may override.'",
  keyTakeaways: [
    "An abstract class can hold state, provide concrete methods, and have constructors, but a class can extend only one (single inheritance).",
    "A traditional interface has no state and only method signatures; Java 8+ interfaces can add default/static methods with real implementations, but still no instance state.",
    "A class can implement any number of interfaces simultaneously, which is how Java achieves multiple-inheritance-like flexibility without the state-level diamond problem.",
    "Choose an abstract class when subtypes share meaningful implementation/state; choose an interface when defining a capability that logically unrelated classes might satisfy.",
    "Conflicting default methods from multiple implemented interfaces must be explicitly resolved by the implementing class — Java will not silently pick one.",
  ],
  summaryClosing:
    "Abstract classes and interfaces both let you program against a contract instead of a concrete type, but they solve different structural problems — one shares implementation down a single-inheritance chain, the other describes a capability any number of unrelated classes can adopt. Knowing precisely which trade-off you're making, and how to combine both in the same design, is what turns this from a memorized definition into a real design skill.",
  relatedTopics: ["Inheritance", "Polymorphism", "Encapsulation & Abstraction"],
  furtherReading: [
    { label: "Java Documentation — Abstract Methods and Classes", note: "Oracle's official tutorial covering abstract class syntax and rules." },
    { label: "Java Documentation — Default Methods", note: "Explains why default methods were added in Java 8 and their conflict-resolution rules." },
  ],
};

export default abstractClassesInterfacesArticle;
