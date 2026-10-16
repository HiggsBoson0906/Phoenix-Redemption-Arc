// src/content/cs-fundamentals/oops/interview/polymorphism.interview.ts

import type { InterviewQuestion } from "@/types";

const polymorphismInterviewQuestions: InterviewQuestion[] = [
  {
    id: "polymorphism-iv-1",
    question: "What is polymorphism, and what are its two main forms?",
    difficulty: "Easy",
    detailedAnswer:
      "Polymorphism means 'many forms' — the same method name or call site can behave differently depending on context. The two classic forms are compile-time (static) polymorphism, achieved via method overloading, where the compiler picks among same-named methods with different parameter lists based on the arguments at each call site; and runtime (dynamic) polymorphism, achieved via method overriding, where a subclass redefines an inherited method with an identical signature, and the actual implementation invoked is decided at runtime based on the object's real type, regardless of the reference's declared type.",
    idealAnswer:
      "It's the idea that one method name can mean different things in different contexts. Overloading is the compile-time version — I define add(int, int) and add(double, double) in the same class, and the compiler figures out which one to call based on what I pass in. Overriding is the runtime version — a Dog subclass redefines Animal's speak(), and even if I'm holding it through an Animal-typed reference, calling speak() at runtime correctly gives me Dog's version because the decision is based on the actual object, not the reference type.",
    interviewerExpectations: [
      "Names both forms correctly with the compile-time/runtime distinction",
      "Gives a clean example for each",
      "Doesn't conflate the two mechanisms",
    ],
    followUpQuestions: [
      "How does the compiler decide which overload to call when multiple are applicable?",
      "What's the actual runtime mechanism behind overriding resolution?",
      "Is generics-based polymorphism the same as either of these?",
    ],
    commonMistakes: [
      "Describing only one form and calling it 'polymorphism' in general",
      "Mixing up which one is compile-time vs runtime",
    ],
    discussionPoints: ["Overloading vs overriding", "Compile-time vs runtime resolution", "Generics as a third form"],
  },
  {
    id: "polymorphism-iv-2",
    question: "Explain, conceptually, what a vtable is and why it's needed for runtime polymorphism to work.",
    difficulty: "Medium",
    detailedAnswer:
      "A vtable (virtual method table) is a per-class array of function pointers, with one slot per virtual/overridable method the class defines or inherits, each pointing to whichever implementation is the most-derived override for that class. Every object of a class with virtual methods carries a hidden pointer to its class's vtable, set up during construction. When code calls an overridden method through any reference — even one typed as a superclass — the runtime doesn't consult the reference's declared type at all; it follows the object's own vtable pointer, looks up the method's slot, and jumps to whatever implementation is stored there for that object's actual class. This indirection is exactly what lets `Animal a = new Dog(); a.speak();` correctly invoke Dog's speak() — the vtable lookup is driven by the object, not the variable.",
    idealAnswer:
      "It's essentially a lookup table, one per class, of function pointers for every overridable method — and every object of that class carries a hidden pointer to it. When I call an overridden method, the runtime doesn't look at what type my variable is declared as; it follows the object's own vtable pointer and jumps to whatever's actually stored in that slot for the object's real class. That extra indirection — object to vtable to function pointer — is exactly the mechanism that makes `Animal a = new Dog(); a.speak();` correctly run Dog's version even though `a` is typed as Animal.",
    interviewerExpectations: [
      "Correctly describes vtable as per-class, not per-object",
      "Mentions the hidden per-object pointer to the class's vtable",
      "Connects the mechanism directly to why dynamic dispatch works through a supertype reference",
    ],
    followUpQuestions: [
      "Does every method get a vtable slot, or only some?",
      "What's the performance cost of this indirection compared to a direct function call?",
      "How does Java's default 'virtual unless final/private/static' compare to C++'s 'non-virtual unless marked virtual'?",
    ],
    commonMistakes: [
      "Claiming each object has its own separate vtable rather than a shared per-class one",
      "Being unable to connect the vtable mechanism back to a concrete overriding example",
    ],
    discussionPoints: ["Per-class shared vtable", "Hidden per-object vtable pointer", "Dispatch cost vs static calls"],
  },
  {
    id: "polymorphism-iv-3",
    question: "Can you overload a method by only changing its return type? Why or why not?",
    difficulty: "Medium",
    detailedAnswer:
      "No — in Java (and most statically-typed OOP languages), a method's signature for overload-resolution purposes consists of its name and parameter list, not its return type. Two methods with the same name and identical parameter types but different return types are treated as duplicate declarations and cause a compile-time error, because the compiler has no way to disambiguate which one to call based purely on the call site — the return type alone isn't part of what the compiler uses to resolve a call, especially since a caller might not even use the return value (e.g. calling the method as a standalone statement).",
    idealAnswer:
      "No, and the reason is that overload resolution happens by matching the call site's arguments against parameter lists — the return type isn't part of that matching at all. If you had `int getValue()` and `double getValue()` with no parameters, and someone wrote `getValue();` as a statement without using the result, there'd be no way to know which one they meant, so Java just disallows it outright as a duplicate method error.",
    interviewerExpectations: [
      "Correctly says no",
      "Explains that the method signature for overloading is name + parameters, not return type",
      "Can articulate why (ambiguity when return value isn't used)",
    ],
    followUpQuestions: [
      "Is a method's return type part of its signature in any context in Java?",
      "What is a covariant return type, and how does it relate to overriding?",
      "How would you actually provide two 'getValue'-style methods that differ only in the type they produce?",
    ],
    commonMistakes: [
      "Saying it's allowed, or being unsure",
      "Confusing this rule with covariant return types in overriding (which is a different, valid scenario)",
    ],
    discussionPoints: ["Method signature definition", "Covariant return types in overriding", "Compiler ambiguity"],
  },
  {
    id: "polymorphism-iv-4",
    question: "Why does polymorphism enable more extensible code? Give a concrete example of adding new functionality without modifying existing code.",
    difficulty: "Medium",
    detailedAnswer:
      "Because code written against a supertype or interface reference automatically works correctly with any subclass — including ones that don't exist yet when that code was written — as long as the new subclass correctly overrides the expected methods. Concretely: a `render(List<Shape> shapes)` method that calls `shape.draw()` for each shape in the list works for `Circle`, `Square`, or any future `Hexagon` class added later, purely because `Hexagon` implements/overrides `draw()` — `render()` itself never needs to be touched, tested again, or even recompiled for the new shape to work correctly. This is the essence of the open/closed principle: the system is open for extension (new subclasses) but closed for modification (existing dispatching code stays untouched).",
    idealAnswer:
      "Because you write your logic against the abstraction, not the concrete type, so anything that correctly implements that abstraction just works — even types that didn't exist when you wrote the code. A `render()` function that loops over a `List<Shape>` calling `draw()` on each one doesn't care whether it's a Circle, Square, or a Hexagon class someone adds six months later; as long as Hexagon overrides draw() properly, render() needs zero changes. That's the whole point of the open/closed principle — you extend behavior by adding new subclasses, not by editing the dispatching code itself.",
    interviewerExpectations: [
      "Explains 'works with future subclasses, unmodified' clearly",
      "Gives a concrete, working example (not just an abstract statement)",
      "Connects it to the open/closed principle by name or description",
    ],
    followUpQuestions: [
      "What would happen to this design without polymorphism — how would render() have to be written?",
      "How does this relate to the Strategy or Visitor design patterns?",
      "What's the risk if a new subclass forgets to override a method it should?",
    ],
    commonMistakes: [
      "Giving a purely abstract answer without a concrete example",
      "Not connecting the idea to why this reduces the need to modify existing, already-tested code",
    ],
    discussionPoints: ["Open/closed principle", "Strategy/visitor patterns", "Extensibility without modification"],
  },
  {
    id: "polymorphism-iv-5",
    question:
      "You're designing a payments dashboard that needs to render transaction summaries differently depending on payment type (CreditCard, BankTransfer, Wallet), and product wants new payment types added frequently without redeploying the core rendering logic. How would you use polymorphism to design this, and what would you avoid?",
    difficulty: "Hard",
    detailedAnswer:
      "I'd define a `PaymentMethod` interface (or abstract class) with a method like `renderSummary()` (or a more structured `getSummaryDetails()` returning a view-model object), and have each concrete type — `CreditCardPayment`, `BankTransferPayment`, `WalletPayment` — override it with its own rendering logic. The dashboard's core loop would simply call `payment.renderSummary()` polymorphically across a `List<PaymentMethod>`, needing zero changes when a new payment type is added, as long as the new type correctly implements the interface — satisfying the 'add types frequently without redeploying core logic' requirement directly through dynamic dispatch. I would specifically avoid a large `if (payment instanceof CreditCardPayment) ... else if (payment instanceof BankTransferPayment) ...` chain in the dashboard code, since that pattern requires editing and redeploying the core dashboard logic every single time a new payment type is added — the opposite of what's being asked for, and a classic violation of the open/closed principle. If the actual constraint is that new payment types must be addable via configuration or plugin without even a new class being compiled into the core deployment, I'd also discuss a plugin/registry pattern where implementations of PaymentMethod are dynamically loaded/registered, though the core polymorphic dispatch mechanism stays identical either way.",
    idealAnswer:
      "I'd put a `renderSummary()` method on a `PaymentMethod` interface and let each concrete payment type — credit card, bank transfer, wallet — implement its own version. The dashboard just iterates a list of PaymentMethod and calls renderSummary() on each one polymorphically; adding a new payment type later means writing one new class that implements the interface, with the dashboard's core loop needing zero changes and zero redeploys. What I'd explicitly avoid is a big instanceof/type-check chain in the dashboard code branching on payment type, because that's the exact opposite of what's being asked — every new payment type would require editing that central chain and redeploying it, which is precisely the coupling polymorphism is meant to eliminate.",
    interviewerExpectations: [
      "Proposes an interface/abstract-type with an overridden rendering method per payment type",
      "Explicitly names and rejects the instanceof/type-switch anti-pattern",
      "Connects the design directly to the 'add new types without redeploying core logic' requirement",
      "Optionally discusses plugin/registry patterns for true add-without-recompiling scenarios",
    ],
    followUpQuestions: [
      "How would you handle a payment type needing extra UI fields the interface didn't originally anticipate?",
      "Would you use an abstract class or an interface here, and why?",
      "How would this design change if payment types needed to be loaded as plugins at runtime?",
    ],
    commonMistakes: [
      "Proposing an instanceof/switch-based dispatch as the primary design",
      "Not tying the answer back to the specific 'no redeploy for new types' requirement",
      "Ignoring the interface-vs-abstract-class design choice entirely",
    ],
    discussionPoints: ["Interface-based polymorphic dispatch", "instanceof anti-pattern", "Open/closed principle", "Plugin/registry architectures"],
    scenarioBased: true,
  },
];

export default polymorphismInterviewQuestions;
