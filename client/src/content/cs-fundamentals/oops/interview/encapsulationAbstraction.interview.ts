// src/content/cs-fundamentals/oops/interview/encapsulationAbstraction.interview.ts

import type { InterviewQuestion } from "@/types";

const encapsulationAbstractionInterviewQuestions: InterviewQuestion[] = [
  {
    id: "encapsulation-abstraction-iv-1",
    question: "What is the difference between encapsulation and abstraction? These are often confused — explain precisely.",
    difficulty: "Easy",
    detailedAnswer:
      "Encapsulation is a mechanism: bundling data and the methods that operate on it into one unit (a class), and restricting direct external access to that data using access modifiers, forcing callers through controlled methods. Abstraction is a design principle: deciding what essential behavior to expose to a caller while hiding the complex or irrelevant implementation details behind that exposed interface. Encapsulation answers 'who can touch this data and how'; abstraction answers 'what does the caller actually need to know to use this correctly.' They often appear together in well-designed classes but are conceptually independent — you can have one without a meaningful degree of the other.",
    idealAnswer:
      "I think of encapsulation as protecting data — private fields plus validating getters/setters so nothing can corrupt an object's internal state from outside. Abstraction is about simplifying what's exposed — like a car's steering wheel hiding the engine's complexity. A `BankAccount` class shows both together: the balance is private (encapsulation, so no one can set it to an invalid value directly) and `withdraw()`/`deposit()` are the only exposed operations (abstraction, since the caller never needs to know how the balance is persisted or audited internally).",
    interviewerExpectations: [
      "Clean, non-circular definitions of both terms",
      "Explains they can exist independently, not just 'they're related'",
      "Uses one concrete example that demonstrates both simultaneously",
    ],
    followUpQuestions: [
      "Can you have encapsulation without abstraction? Give an example.",
      "How is abstraction achieved concretely in Java — what language features realize it?",
      "Does Python have real encapsulation given it lacks a `private` keyword?",
    ],
    commonMistakes: [
      "Treating the two terms as synonyms or giving a circular definition ('abstraction is hiding things, encapsulation is also hiding things')",
      "Failing to mention access modifiers as the actual encapsulation mechanism",
    ],
    discussionPoints: ["Access modifiers", "Abstract classes/interfaces", "Design vs mechanism distinction"],
  },
  {
    id: "encapsulation-abstraction-iv-2",
    question: "Can you have encapsulation without meaningful abstraction? Walk through an example.",
    difficulty: "Medium",
    detailedAnswer:
      "Yes. Consider a class where every field is `private` but every field has a trivial getter and setter that simply reads or writes the raw value with zero validation or derived logic — e.g. `private int age; public int getAge() { return age; } public void setAge(int a) { age = a; }`. This technically satisfies encapsulation's mechanical definition (data is private, access happens through methods), but it provides no real abstraction: the caller can still set age to -50, and the getter/setter pair exposes the exact same information and mutability as a plain public field would, just with extra ceremony. Real abstraction would involve the class deciding what operations actually make sense (e.g. `celebrateBirthday()` incrementing age by exactly 1, with no direct setter at all) rather than mechanically mirroring every field.",
    idealAnswer:
      "Sure — a lot of 'anemic' Java beans do exactly this: private fields with auto-generated getters and setters that have zero logic. It's encapsulated in the narrow sense that fields aren't public, but there's no real abstraction because the class isn't hiding any complexity or enforcing any invariant — you could set `age` to -50 through the setter just as easily as if the field were public. Real abstraction would mean exposing behavior like `celebrateBirthday()` instead of a raw `setAge()`, so the class actually controls what states are valid.",
    interviewerExpectations: [
      "Concrete counter-example with a pass-through getter/setter",
      "Explains why it technically satisfies encapsulation's definition but adds no real abstraction value",
      "Can propose what genuine abstraction would look like instead",
    ],
    followUpQuestions: [
      "What would you change about this class to add real abstraction?",
      "Is an 'anemic domain model' an anti-pattern? Why?",
      "Would you say abstraction requires encapsulation as a prerequisite?",
    ],
    commonMistakes: [
      "Claiming encapsulation and abstraction always go hand-in-hand",
      "Not being able to produce a concrete pass-through-getter counter-example",
    ],
    discussionPoints: ["Anemic domain model anti-pattern", "Invariant enforcement", "API design intent vs mechanical privacy"],
  },
  {
    id: "encapsulation-abstraction-iv-3",
    question: "Explain Java's four access modifiers and their exact visibility scopes.",
    difficulty: "Medium",
    detailedAnswer:
      "`private`: accessible only within the declaring class itself, not even subclasses. Default/package-private (no modifier written): accessible to any class within the same package, regardless of inheritance relationship. `protected`: accessible within the same package (like default) plus from subclasses even if they live in a different package. `public`: accessible from anywhere, any package, any class. The visibility strictly widens in that order: private ⊂ default ⊂ protected ⊂ public, each one being a superset of accessibility of the one before it.",
    idealAnswer:
      "Private is the tightest — only the class itself. Default, when you write no modifier at all, opens it up to the whole package. Protected keeps that package access but also lets subclasses reach it even from outside the package, which is the one people usually get wrong — they think protected is just 'private but for subclasses,' forgetting it also grants same-package access to non-subclasses. Public is obviously accessible everywhere.",
    interviewerExpectations: [
      "All four levels named correctly with correct relative ordering",
      "Correctly describes protected's dual scope (package + subclasses cross-package)",
      "No confusion between default and protected",
    ],
    followUpQuestions: [
      "Why would a language designer include both default and protected if they overlap so much?",
      "How does C++'s access control differ from Java's, particularly around friend classes?",
      "Can a subclass reduce the visibility of an inherited method when overriding it?",
    ],
    commonMistakes: [
      "Saying protected is 'only for subclasses,' forgetting package-level access",
      "Reversing the private/public ordering",
    ],
    discussionPoints: ["Package-private semantics", "Protected's dual scope", "C++ friend classes as a contrast"],
  },
  {
    id: "encapsulation-abstraction-iv-4",
    question: "You review a PR where a class returns a private `List` field directly from a getter, and the caller later mutates it. Is this a problem? How would you fix it?",
    difficulty: "Medium",
    detailedAnswer:
      "Yes, this is a real encapsulation break, often called a 'representation exposure' or 'leaky abstraction' bug — even though the field is marked `private`, returning a direct reference to a mutable collection lets any external caller bypass all of the class's own validation logic and mutate internal state at will, since Java (and most OOP languages) pass object references, not deep copies. I'd flag it and recommend either returning an unmodifiable/immutable view (`Collections.unmodifiableList(...)` in Java), returning a defensive copy of the list, or exposing only specific mutation methods (`addItem()`, `removeItem()`) that go through validation instead of exposing the raw collection at all.",
    idealAnswer:
      "I'd flag it immediately — `private` only stops direct field access syntax-wise, but if the getter hands back a live reference to a mutable List, the caller can call `.add()` or `.clear()` on it and silently corrupt the object's real internal state, completely bypassing any invariant checks the class thinks it's enforcing. The fix depends on intent: if callers just need to read it, wrap it in `Collections.unmodifiableList()` or return a copy; if callers legitimately need to mutate the collection, expose deliberate methods like `addItem(x)` that can validate the input, rather than handing out the raw backing list.",
    interviewerExpectations: [
      "Identifies this as a real, common encapsulation-breaking bug (not just a style nitpick)",
      "Understands references vs copies for mutable objects",
      "Proposes at least one concrete fix (defensive copy, unmodifiable wrapper, or dedicated mutation methods)",
    ],
    followUpQuestions: [
      "Does the same problem apply to returning a private array? A private Date/mutable object?",
      "What's the performance cost of always returning defensive copies, and how would you weigh it?",
      "How does this relate to immutability as a broader design principle?",
    ],
    commonMistakes: [
      "Assuming `private` alone fully protects the field regardless of what a getter returns",
      "Only proposing 'just don't call the getter' rather than fixing the API",
    ],
    discussionPoints: ["Representation exposure", "Defensive copying", "Immutable views vs mutable collections"],
  },
  {
    id: "encapsulation-abstraction-iv-5",
    question:
      "Design a `UserAccount` class for a system storing passwords and account balances, focusing specifically on how you'd apply encapsulation and abstraction to keep it secure and misuse-resistant. What would you deliberately NOT expose?",
    difficulty: "Hard",
    detailedAnswer:
      "I'd make every field private: `passwordHash` (never store or expose a raw password — hash it with a salted algorithm like bcrypt at creation time), `balance`, and `accountId`. I would not expose a `getPasswordHash()` at all if avoidable, or if the persistence layer genuinely needs it, restrict it to package-private/internal visibility so only trusted internal code can read it — the public API would only expose a `verifyPassword(String attempt)` method that internally hashes the attempt and compares, never handing the hash itself back out. For balance, I would not expose a public `setBalance()` at all; instead I'd expose intent-revealing operations like `deposit(amount)`, `withdraw(amount)` (validating sufficient funds and non-negative amounts), and possibly `applyInterest()` — all of which enforce business invariants that a raw setter would let any caller violate. I would also avoid exposing the account's transaction history as a mutable list — either return an immutable/defensive-copy view or a read-only stream, so a caller can't secretly delete a past transaction. The overarching design abstraction is: expose behavior (verifyPassword, withdraw, deposit) not raw state (passwordHash, balance) — this is exactly where encapsulation (private fields, controlled mutation) and abstraction (an interface describing 'what an account can do' rather than 'what data an account holds') reinforce each other for a security-sensitive class.",
    idealAnswer:
      "The password would never be stored in plaintext or exposed via any getter — only a salted hash internally, with a `verifyPassword(attempt)` method that does the hash-and-compare itself and returns a boolean, so the hash itself never leaves the class. Balance wouldn't get a public setter at all; I'd only expose `deposit()` and `withdraw()`, each validating amounts and sufficient funds, because a bare setter would let a caller set balance to anything, bypassing every business rule the account is supposed to enforce. I'd also be careful with anything that returns a collection, like transaction history — handing back a live mutable list would let external code silently rewrite financial history, so I'd return either an immutable copy or a read-only view. The underlying principle across all of this: the public interface should describe *what you can do* to the account, never *what data it holds*, which is really encapsulation and abstraction working together for a security-critical type.",
    interviewerExpectations: [
      "No plaintext password storage or exposure; verify-by-hash pattern",
      "No public setBalance(); only validated deposit/withdraw-style operations",
      "Recognizes transaction history / collections need defensive exposure too",
      "Articulates the 'expose behavior, not state' principle explicitly",
    ],
    followUpQuestions: [
      "How would you handle the case where an internal admin tool genuinely needs to adjust balance directly (e.g. correcting an error)?",
      "Would you make UserAccount immutable? What would that entail?",
      "How does this design change if you also need to support serialization to JSON for an API response?",
    ],
    commonMistakes: [
      "Exposing a raw password field or getter under any circumstance",
      "Adding a generic `setBalance()` 'for convenience'",
      "Forgetting that returned collections (like transaction history) need the same protection as scalar fields",
    ],
    discussionPoints: ["Password hashing patterns", "Behavior-oriented API design", "Defensive copying for collections", "Security-sensitive class design"],
    scenarioBased: true,
  },
];

export default encapsulationAbstractionInterviewQuestions;
