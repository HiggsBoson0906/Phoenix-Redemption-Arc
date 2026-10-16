// src/content/cs-fundamentals/oops/interview/inheritance.interview.ts

import type { InterviewQuestion } from "@/types";

const inheritanceInterviewQuestions: InterviewQuestion[] = [
  {
    id: "inheritance-iv-1",
    question: "What is inheritance, and what relationship does it model?",
    difficulty: "Easy",
    detailedAnswer:
      "Inheritance lets a subclass acquire the fields and methods of a superclass, modeling an 'is-a' relationship — a Dog is-a Animal, so it makes sense for Dog to inherit Animal's shared behavior (like eat()) while adding or overriding its own (like bark()). The subclass gets code reuse for free and can be used polymorphically wherever the superclass type is expected.",
    idealAnswer:
      "Inheritance is how you say 'this class is a specialized version of that class.' If Dog extends Animal, every Dog automatically has whatever Animal defines, and I only need to write Dog-specific behavior in Dog itself. It's fundamentally an 'is-a' relationship — I'd only reach for inheritance when that phrase actually reads naturally; if it doesn't, that's usually a sign composition is the better fit.",
    interviewerExpectations: [
      "Correctly identifies 'is-a' as the relationship",
      "Mentions both code reuse and enabling polymorphism",
      "Can give a clean example",
    ],
    followUpQuestions: [
      "How is this different from composition's 'has-a' relationship?",
      "What's the difference between inheritance and interface implementation?",
      "Can a subclass access private members of its superclass?",
    ],
    commonMistakes: [
      "Describing inheritance purely as 'code reuse' without mentioning the 'is-a' semantic requirement",
      "Confusing inheritance with composition",
    ],
    discussionPoints: ["is-a vs has-a", "Code reuse", "Polymorphism enablement"],
  },
  {
    id: "inheritance-iv-2",
    question: "Explain the diamond problem and how C++ and Java each handle it differently.",
    difficulty: "Medium",
    detailedAnswer:
      "The diamond problem arises when a class D inherits from two classes B and C, which both inherit from a common ancestor A. If A defines a member, D effectively has two inheritance paths to it (through B and through C), creating ambiguity about which copy or version D should use when both B and C might override or duplicate it. C++ permits multiple class inheritance and lets this ambiguity occur, requiring either explicit scope-qualified calls (D::foo() resolving to B::foo() specifically) or, better, declaring the inheritance of A as 'virtual' in both B and C so the compiler collapses A into a single shared subobject, removing both the duplication and the ambiguity. Java sidesteps the class-level version of this problem entirely by disallowing multiple inheritance of classes — a class can only extend one other class. Java does allow multiple interface implementation, though, and if two interfaces both provide a default method with the same signature, Java forces the implementing class to explicitly override that method itself to resolve the conflict, refusing to compile otherwise.",
    idealAnswer:
      "It's the classic ambiguity where D inherits the same ancestor A twice, once through B and once through C, so it's unclear which version of A's stuff D should actually get. C++ allows this to happen since it supports multiple class inheritance, and fixes it with virtual inheritance — marking the inheritance from A as virtual in both B and C so the compiler only keeps one shared copy of A instead of two. Java just doesn't let a class inherit from two classes in the first place, so the class-level diamond can't happen; the closest Java gets is two interfaces with clashing default methods, which it handles by making you write the resolution yourself rather than guessing.",
    interviewerExpectations: [
      "Correct definition of the diamond shape/ambiguity",
      "Explains C++'s virtual inheritance mechanism specifically, not just 'C++ handles it somehow'",
      "Explains Java's two-part answer: no multiple class inheritance, but explicit default-method conflict resolution for interfaces",
    ],
    followUpQuestions: [
      "What does 'virtual inheritance' actually change about the object's memory layout in C++?",
      "How would you explicitly call a specific parent's version of an ambiguous method in C++?",
      "Show me how you'd resolve two clashing default methods in Java code.",
    ],
    commonMistakes: [
      "Saying 'Java doesn't have the diamond problem at all' without qualifying that it resurfaces with interface default methods",
      "Not knowing the term 'virtual inheritance' or its purpose in C++",
    ],
    discussionPoints: ["Virtual inheritance", "Interface default method conflicts", "Language design trade-offs"],
  },
  {
    id: "inheritance-iv-3",
    question: "What is the difference between method overriding and field hiding, and why does it matter which reference type you use?",
    difficulty: "Medium",
    detailedAnswer:
      "Method overriding is resolved dynamically (at runtime) based on the actual object's type — calling an overridden method through a superclass reference still invokes the subclass's version, because the JVM/runtime consults the object's actual class via its vtable/method dispatch table. Field access, in contrast, is resolved statically (at compile time) based on the declared/reference type, not the object's runtime type — if a subclass redeclares a field with the same name as the superclass, accessing that field through a superclass-typed reference returns the superclass's field value, even if the underlying object is actually the subclass. This is called field hiding, not overriding, and it's a common source of confusing 'predict the output' bugs precisely because it behaves oppositely to how overridden methods behave.",
    idealAnswer:
      "Overridden methods use dynamic dispatch — the actual runtime type of the object decides which version runs, regardless of what type the reference variable is declared as. Fields don't work that way at all; field access is resolved purely by the reference's compile-time type, so if Animal and Dog both declare a field called `name`, and I access it through an `Animal`-typed reference pointing at a Dog object, I get Animal's `name`, not Dog's — even though calling an overridden method on that same reference would correctly give me Dog's behavior. It's a classic trap in 'predict the output' questions for exactly this reason.",
    interviewerExpectations: [
      "Clearly distinguishes static (field) vs dynamic (method) resolution",
      "Can predict the output of a concrete mixed field/method example correctly",
      "Uses correct terminology: 'field hiding' not 'field overriding'",
    ],
    followUpQuestions: [
      "Why does Java design fields this way instead of making them dynamically dispatched too?",
      "Does the same static/dynamic distinction apply to static methods?",
      "How would you avoid this confusion in real code?",
    ],
    commonMistakes: [
      "Assuming fields are dynamically dispatched just like methods",
      "Calling field hiding 'field overriding' (fields cannot be overridden, only hidden)",
    ],
    discussionPoints: ["Static vs dynamic binding", "vtables/dispatch tables", "Field hiding pitfalls"],
  },
  {
    id: "inheritance-iv-4",
    question: "When would you choose composition over inheritance, and what problem does it solve?",
    difficulty: "Medium",
    detailedAnswer:
      "Composition ('has-a', embedding a reference to another object and delegating to it) is generally preferable when the relationship isn't a true specialization, or when you need flexibility to swap implementations at runtime. Inheritance creates the fragile base class problem: a subclass can depend on the internal implementation details of its superclass, not just its public contract, so seemingly safe internal changes to the superclass can silently break subclass behavior in ways the compiler won't catch. Inheritance is also fixed at compile time — you can't change what a subclass extends at runtime — whereas composition lets you inject a different implementation of a contained object dynamically (e.g. swap which `PaymentProcessor` a `Checkout` class delegates to). A commonly cited concrete example against inheritance is modeling a `Stack` as `extends ArrayList` — the Stack would inherit every ArrayList method, including ones that violate stack semantics like `add(index, item)`, breaking the Stack's own invariants; composing a Stack with a private ArrayList field and exposing only push()/pop() avoids that entirely.",
    idealAnswer:
      "I'd reach for composition whenever the relationship isn't genuinely 'is-a,' or when I want to be able to swap behavior at runtime rather than being locked into whatever the compile-time class hierarchy says. The textbook problem with inheritance here is the fragile base class issue — a subclass can end up depending on implementation details of the parent that aren't part of its real contract, so an internal refactor of the parent can silently break subclasses. The classic bad example is making Stack extend ArrayList — you'd inherit list methods like inserting at an arbitrary index, which completely violates what a stack is supposed to guarantee. Composing a Stack with a private list inside it and exposing only push/pop keeps the actual contract intact.",
    interviewerExpectations: [
      "Names the fragile base class problem explicitly",
      "Gives a concrete anti-pattern example (e.g. Stack extends ArrayList)",
      "Mentions runtime flexibility of composition vs compile-time fixed inheritance",
    ],
    followUpQuestions: [
      "How would you refactor a 'Stack extends ArrayList' design using composition?",
      "Does composition have any downsides compared to inheritance?",
      "How does dependency injection relate to this choice?",
    ],
    commonMistakes: [
      "Giving only a vague 'composition is more flexible' answer without a concrete failure mode of inheritance",
      "Claiming inheritance should basically never be used",
    ],
    discussionPoints: ["Fragile base class problem", "Stack-extends-ArrayList anti-pattern", "Runtime flexibility", "Delegation"],
  },
  {
    id: "inheritance-iv-5",
    question:
      "You're reviewing a PR that introduces a five-level-deep inheritance chain (PaymentMethod → CardPayment → CreditCardPayment → RewardsCreditCardPayment → PremiumRewardsCreditCardPayment) to model different payment types, and QA reports that a bug fix in the base class unexpectedly broke behavior three levels down. What would you flag, and how would you redesign this?",
    difficulty: "Hard",
    detailedAnswer:
      "I'd flag the depth itself as the root cause: five levels of inheritance means understanding the actual runtime behavior of PremiumRewardsCreditCardPayment requires reading and mentally merging five separate classes, and any method any ancestor defines or overrides can affect behavior arbitrarily far down the chain — this is a textbook fragile base class scenario, exactly why the bug fix at the top rippled downward unexpectedly. I'd redesign this around composition and interfaces instead: define a `PaymentMethod` interface describing the essential contract (`authorize()`, `charge()`, `refund()`), and instead of subclassing for every variation, compose behavior out of small, focused strategy objects — e.g. a `CreditCardPayment` class that holds a `RewardsPolicy` object (which could be `NoRewards`, `StandardRewards`, or `PremiumRewards`) and delegates reward calculation to it. This flattens the hierarchy to one or two levels, makes each variation (reward tier) independently testable, and lets you mix and match reward policies with card types without needing a new subclass for every combination — avoiding combinatorial explosion of subclasses that deep inheritance chains are especially prone to as more payment method variations get added over time.",
    idealAnswer:
      "The five-level chain is the actual problem — at that depth, nobody can hold the full runtime behavior of the leaf class in their head, they have to trace through every ancestor, and that's exactly why a base-class fix rippled down unexpectedly; it's the fragile base class problem in action. I'd push back on the PR and suggest flattening this with composition: a `PaymentMethod` interface for the core contract, and then compose in the varying pieces — like a separate `RewardsPolicy` object a CreditCardPayment holds and delegates to, rather than creating a new subclass for every reward tier. That also solves a growth problem this design has: as soon as you need 'premium rewards debit payment' too, a pure inheritance model forces combinatorial subclassing, while composition just lets you mix a DebitPayment with a PremiumRewardsPolicy directly.",
    interviewerExpectations: [
      "Identifies chain depth itself, not just 'a bug,' as the design smell",
      "Explicitly names the fragile base class problem as the mechanism behind the reported bug",
      "Proposes a concrete composition/interface-based redesign, not just 'refactor it'",
      "Recognizes the combinatorial-subclass-explosion risk as the hierarchy grows",
    ],
    followUpQuestions: [
      "How would you migrate existing code depending on the old class hierarchy without breaking callers?",
      "Would you keep any inheritance at all in the redesign, or go fully composition-based?",
      "How does the Strategy design pattern relate to what you just described?",
    ],
    commonMistakes: [
      "Treating this as an isolated bug to patch rather than a structural design issue",
      "Proposing to 'just add more unit tests' without addressing the coupling itself",
      "Not connecting the fix to a named pattern (composition/strategy) that makes the redesign concrete",
    ],
    discussionPoints: ["Fragile base class problem", "Deep inheritance chains", "Strategy pattern via composition", "Combinatorial subclass explosion"],
    scenarioBased: true,
  },
];

export default inheritanceInterviewQuestions;
