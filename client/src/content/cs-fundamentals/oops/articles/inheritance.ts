// src/content/cs-fundamentals/oops/articles/inheritance.ts

import type { Article } from "@/types";

const inheritanceArticle: Article = {
  slug: "inheritance",
  title: "Inheritance",
  summary:
    "Inheritance lets a class acquire the fields and methods of another, modeling an 'is-a' relationship — powerful for code reuse, but notorious for the diamond problem and for encouraging fragile, overly deep hierarchies when overused.",
  readingTimeMins: 10,
  beginnerExplanation:
    "Inheritance lets you define a new class (the subclass/derived class) that automatically gets all the fields and methods of an existing class (the superclass/base class), and then adds or overrides behavior on top. It models an 'is-a' relationship — a `Dog` is-a `Animal`, so `Dog extends Animal` in Java (or `class Dog : public Animal` in C++) makes sense; a `Dog` automatically has whatever `Animal` defines (like `eat()`), plus whatever `Dog` adds itself (like `bark()`).\n\nThe main win is code reuse: instead of copy-pasting `eat()` into `Dog`, `Cat`, and `Bird` separately, you write it once in `Animal` and every subclass inherits it for free. The subclass can also override an inherited method to provide its own specialized version — `Dog.makeSound()` might print 'Woof' while `Cat.makeSound()` prints 'Meow', even though both are called through the same `makeSound()` method name defined in `Animal`.",
  detailedBreakdown:
    "There are several shapes inheritance can take. Single inheritance: one subclass extends exactly one superclass (Java restricts classes to this). Multilevel inheritance: a chain, where `C extends B extends A` — C inherits from B, which itself inherits from A, so C transitively gets everything from both. Hierarchical inheritance: multiple subclasses extend the same single superclass (`Dog extends Animal`, `Cat extends Animal` — siblings, not related to each other). Multiple inheritance: a subclass inherits directly from more than one superclass simultaneously — C++ allows this for classes (`class C : public A, public B`), Java disallows it for classes entirely but allows a class to implement multiple interfaces, which sidesteps the sharpest problems multiple inheritance causes.\n\n`super` is the keyword used from within a subclass to explicitly reach the superclass's version of something: `super.methodName()` calls the parent's implementation of an overridden method (useful when you want to extend rather than fully replace parent behavior), and `super(args)` as the first line of a subclass constructor invokes the parent's constructor to ensure the inherited portion of the object is properly initialized before the subclass's own constructor body runs. If a subclass constructor doesn't explicitly call `super(...)`, the compiler inserts an implicit no-argument `super()` call — which fails to compile if the parent class has no no-argument constructor available.\n\nMethod overriding (a subclass redefining a method with the identical signature it inherited) is the mechanism that enables runtime polymorphism, covered in depth in the Polymorphism topic — but it's introduced here because overriding only makes sense in the context of an existing inheritance relationship. A method can only be overridden, not overloaded, when the subclass redeclares it with the exact same name, parameter types, and return type (or a covariant return type) as the parent's version.\n\nThe diamond problem is the classic pitfall of multiple inheritance: if class `D` inherits from both `B` and `C`, and both `B` and `C` inherit from a common ancestor `A` which defines a method `foo()`, then when `D` calls `foo()`, it's ambiguous whether it should resolve to `B`'s version, `C`'s version, or `A`'s original — the inheritance graph literally forms a diamond shape (A at top, B and C in the middle, D at bottom). C++ allows this ambiguity to arise and resolves it either by requiring explicit qualification (`D::foo()` calling `B::foo()` or `C::foo()` explicitly) or, if `B` and `C` both inherit from `A` *virtually* (`class B : public virtual A`), C++ collapses the diagram so `D` gets exactly one shared copy of `A`'s members instead of two separate ones, eliminating the ambiguity and the duplicate-subobject problem simultaneously. Java sidesteps the diamond problem for state entirely by disallowing multiple class inheritance outright; it allows a class to implement multiple interfaces, and if two interfaces provide conflicting `default` method implementations, Java forces the implementing class to explicitly override and resolve the conflict itself (a compile error otherwise) rather than silently picking one.\n\nComposition ('has-a') is frequently the better alternative to inheritance ('is-a'): instead of `ElectricCar extends Car`, you might give `Car` an `Engine` field (`class Car { private Engine engine; }`) and delegate to it. The well-known guideline 'favor composition over inheritance' exists because inheritance creates unusually tight coupling — a subclass depends on its superclass's internal implementation details, not just its public interface (the 'fragile base class problem': changing a base class's internals can silently break subclasses in ways the compiler won't catch), and deep inheritance chains make it hard to reason about which class in the chain actually defines the behavior you're seeing at runtime. Composition keeps components swappable and loosely coupled, at the minor cost of writing explicit delegating methods instead of getting them for free.",
  realWorldExamples:
    "Java's exception hierarchy is a canonical multilevel/hierarchical inheritance example: `Throwable` → `Exception` → `RuntimeException` → `NullPointerException`, where each level adds specificity while inheriting the base `getMessage()`/`printStackTrace()` behavior. GUI frameworks lean heavily on hierarchical inheritance — `Button`, `Checkbox`, and `TextField` all extend a common `Component` base class to share layout/rendering plumbing while each overrides its own rendering logic. Modern game engines and UI libraries increasingly favor composition ('component-based' architectures, e.g. Unity's GameObject-plus-attached-components model) specifically to avoid the deep, fragile inheritance trees that plagued earlier object-oriented game engine designs.",
  useCases: [
    "Sharing common behavior/state across closely related types (Dog/Cat/Bird all extending Animal) to avoid duplicating code",
    "Building extensible frameworks where users subclass a provided base class and override specific hook methods (template method pattern)",
    "Modeling naturally hierarchical domain concepts (Exception hierarchies, UI component trees) where 'is-a' genuinely holds",
  ],
  advantages: [
    "Eliminates duplicated code across related classes by centralizing shared behavior in a common superclass",
    "Enables polymorphism — code written against the superclass type can transparently work with any subclass",
    "Models natural real-world/domain hierarchies clearly when an 'is-a' relationship genuinely exists",
  ],
  disadvantages: [
    "Creates tight coupling between subclass and superclass implementation details (the fragile base class problem)",
    "Deep inheritance chains make it hard to trace which class actually defines the behavior executing at runtime",
    "Multiple inheritance introduces real ambiguity (the diamond problem) that languages must explicitly design around",
  ],
  commonMisconceptions: [
    "\"Inheritance is always the right tool for code reuse\" — composition ('has-a') is frequently a safer, more flexible choice than inheritance ('is-a') when the relationship isn't a genuine specialization.",
    "\"Java doesn't have the diamond problem at all\" — Java avoids it for class state by disallowing multiple class inheritance, but a milder version resurfaces with conflicting `default` methods across multiple implemented interfaces, which Java forces you to resolve explicitly.",
    "\"Overriding and overloading are the same idea\" — overriding redefines an inherited method with an identical signature (runtime-resolved); overloading defines multiple methods with the same name but different signatures in the same class (compile-time-resolved). They're unrelated mechanisms that happen to share the word 'method.'",
  ],
  interviewPerspective:
    "Interviewers use inheritance questions to test whether you understand it as a tool with real trade-offs rather than a default habit. Be ready to explain the exact diamond problem scenario with a drawn diagram, contrast how C++ (virtual inheritance) and Java (no multiple class inheritance, explicit default-method conflict resolution) each solve it, and to argue concretely for composition over inheritance with a specific example (e.g. 'why not model a Car as extending Engine'). A very common follow-up is explaining what `super()` does and why omitting it still compiles (implicit no-arg call) unless the parent lacks a no-arg constructor.",
  oaPerspective:
    "OA rounds test inheritance through 'predict the output' questions involving constructor call order (parent constructor always runs before child constructor body, due to implicit/explicit `super()`), method overriding resolution when called through a base-class reference, and identifying valid vs invalid inheritance syntax across languages (e.g. spotting that Java doesn't allow `class C extends A, B`). Field hiding versus method overriding is a frequent subtle trap — fields are resolved by the reference's static/compile-time type, not the object's runtime type, unlike overridden methods.",
  keyTakeaways: [
    "Inheritance models 'is-a' and lets a subclass reuse and extend a superclass's fields/methods.",
    "Single, multilevel, and hierarchical inheritance are all straightforward; true multiple inheritance of classes causes the diamond problem.",
    "C++ resolves the diamond problem via virtual inheritance; Java avoids it for classes by disallowing multiple class inheritance, and requires explicit resolution for conflicting interface default methods.",
    "`super()` invokes the parent constructor and must run (implicitly or explicitly) before the subclass constructor body; `super.method()` calls the parent's version of an overridden method.",
    "Composition ('has-a') is often a safer alternative to inheritance ('is-a') when the relationship isn't a true specialization, avoiding the fragile base class problem.",
  ],
  summaryClosing:
    "Inheritance is a powerful but sharp tool: it buys real code reuse and enables polymorphism, but at the cost of tight coupling between subclass and superclass. Understanding exactly where it breaks down (the diamond problem, fragile base classes) — and knowing when composition is the better call — is what separates someone who's used inheritance from someone who understands it.",
  relatedTopics: ["Polymorphism", "Abstract Classes & Interfaces", "Association, Aggregation & Composition"],
  furtherReading: [
    { label: "Effective Java, Item 18: Favor composition over inheritance", note: "The canonical argument for when inheritance is the wrong tool." },
    { label: "C++ Virtual Inheritance — cppreference", note: "Precise mechanics of how C++ resolves the diamond problem." },
  ],
};

export default inheritanceArticle;
