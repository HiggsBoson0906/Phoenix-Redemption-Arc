// src/content/cs-fundamentals/oops/interview/structuralBehavioralPatterns.interview.ts

import type { InterviewQuestion } from "@/types";

const structuralBehavioralPatternsInterviewQuestions: InterviewQuestion[] = [
  {
    id: "structural-behavioral-patterns-iv-1",
    question: "What's the difference between the Adapter and Facade patterns? Both seem to 'simplify' an interface.",
    difficulty: "Easy",
    detailedAnswer:
      "Adapter solves interface *compatibility*: you have an existing class with an interface that doesn't match what your client code expects, and Adapter wraps it, translating calls from the expected interface into calls the existing class actually understands — typically one adapter wrapping one adaptee, with no new simplification, just translation. Facade solves *complexity*: you have a subsystem made of many classes that each need to be coordinated correctly to perform a common task, and Facade provides one simplified entry-point method that internally orchestrates all of them — it's about hiding coordination complexity across multiple classes, not translating a mismatched interface. A useful test: if you're wrapping one class to make it fit an interface you didn't design, that's Adapter; if you're wrapping many classes to spare callers from orchestrating them all correctly themselves, that's Facade.",
    idealAnswer:
      "I distinguish them by what problem each is actually solving. Adapter is about compatibility — I have some existing class whose interface doesn't match what my code expects, so I wrap it and translate calls, usually one class to one class. Facade is about complexity — I have a whole subsystem of classes that need to be called in the right order to do one logical thing, so I give callers one simple method that does that coordination internally. If I'm translating a mismatched interface, that's Adapter; if I'm hiding orchestration across many classes behind one simple entry point, that's Facade.",
    interviewerExpectations: [
      "Clearly separates 'compatibility/translation' (Adapter) from 'simplification of complexity/orchestration' (Facade)",
      "Notes the typical one-to-one (Adapter) vs one-to-many (Facade) shape",
      "Gives at least one concrete example distinguishing the two",
    ],
    followUpQuestions: [
      "Can Facade internally use Adapters? Give an example of when that would make sense.",
      "Does Facade hide the subsystem completely from advanced callers?",
      "Give a real standard-library example of each.",
    ],
    commonMistakes: [
      "Treating Adapter and Facade as interchangeable 'wrapper' patterns with no real distinction",
      "Missing the one-to-one vs one-to-many shape difference",
    ],
    discussionPoints: ["Interface compatibility vs subsystem simplification", "One-to-one vs one-to-many composition", "Standard library examples"],
  },
  {
    id: "structural-behavioral-patterns-iv-2",
    question: "How does the Decorator pattern let you avoid a 'combinatorial explosion' of subclasses? Walk through a concrete example.",
    difficulty: "Medium",
    detailedAnswer:
      "If you tried to model every combination of optional add-on behaviors via inheritance — say, a `Coffee` base class with subclasses for every combination of milk, sugar, and whipped cream — you'd need a subclass for each combination (`CoffeeWithMilk`, `CoffeeWithSugar`, `CoffeeWithMilkAndSugar`, `CoffeeWithMilkAndWhippedCream`, ...), growing exponentially with the number of optional behaviors, and adding one new optional behavior would multiply the required subclasses further. Decorator avoids this by having each optional behavior be its own small class implementing the *same* interface as the base object and wrapping an instance of that interface internally — `MilkDecorator implements Coffee` holds a wrapped `Coffee` and adds its own cost on top of the wrapped object's `cost()`. Since decorators and the base object share an interface, you can nest them in any combination at runtime: `new SugarDecorator(new MilkDecorator(new SimpleCoffee()))` gives you coffee+milk+sugar without ever defining a `CoffeeWithMilkAndSugar` class — you get 2^n possible combinations from just n decorator classes plus the base, instead of needing up to 2^n subclasses.",
    idealAnswer:
      "The problem with pure inheritance here is that you'd need one subclass per *combination* of optional behaviors, not per behavior — CoffeeWithMilk, CoffeeWithSugar, CoffeeWithMilkAndSugar, and it keeps multiplying every time you add a new optional extra. Decorator instead gives each optional behavior its own small wrapper class that implements the same interface as what it's wrapping — so MilkDecorator implements Coffee, wraps a Coffee internally, and adds its own cost on top of whatever it's wrapping. Because everything shares the same interface, I can nest them in any order at runtime — new SugarDecorator(new MilkDecorator(new SimpleCoffee())) — and get any combination I want from just a handful of decorator classes instead of one class per possible combination.",
    interviewerExpectations: [
      "Clearly explains why inheritance alone requires a subclass per combination, not per behavior",
      "Explains that decorators share the wrapped object's interface, enabling arbitrary nesting",
      "Uses a correct, concrete example (coffee, I/O streams, or equivalent)",
    ],
    followUpQuestions: [
      "How does Java's I/O stream design (BufferedReader wrapping InputStreamReader wrapping FileInputStream) relate to this?",
      "What's a downside of deeply nested decorator chains?",
      "How would a decorator's constructor typically be structured?",
    ],
    commonMistakes: [
      "Describing Decorator without explaining the actual combinatorial-explosion problem it solves",
      "Confusing Decorator with Adapter (translation) rather than 'added behavior'",
    ],
    discussionPoints: ["Combinatorial explosion via inheritance", "Shared interface enabling arbitrary nesting", "Java I/O streams as the canonical real-world example"],
  },
  {
    id: "structural-behavioral-patterns-iv-3",
    question: "Explain the Observer pattern and a real risk you should watch for when using it in a large system.",
    difficulty: "Medium",
    detailedAnswer:
      "Observer defines a one-to-many relationship where a subject maintains a list of observers and notifies all of them automatically when its state changes, without needing to know their concrete types — only that they implement a shared `Observer` interface (typically an `update()` method). This decouples the subject from specific dependents, letting new observer types be added freely without modifying the subject. The real risk in large systems is update cascades and hidden performance/ordering issues: if observer A's `update()` method itself triggers a change that notifies other observers (including possibly re-triggering the original subject), you can get deep, hard-to-trace call chains, redundant re-computation, or even infinite notification loops; and if there are many observers, a single state change can silently become an expensive fan-out of work that's easy to lose track of just by reading the subject's code, since the subject itself looks trivially simple.",
    idealAnswer:
      "Observer is a one-to-many notification setup — a subject holds a list of observers and calls something like update() on each one whenever its state changes, and it never needs to know their concrete classes, just that they implement the Observer interface. That decoupling is great for extensibility, but the real risk I watch for is update cascades: if handling a notification in one observer triggers another change that fires more notifications, you can get deep, hard-to-trace chains or even infinite loops, and none of that complexity is visible just by reading the subject's code, since from its perspective it's just calling update() on a list. In practice I'd be careful about how much work observers do synchronously inside update(), and whether any observer can indirectly re-trigger the same subject.",
    interviewerExpectations: [
      "Correctly explains the subject-observer decoupling mechanism",
      "Names a genuine risk (cascading notifications, performance fan-out, or infinite loops), not just a generic downside",
      "Shows awareness that the risk is hidden by the pattern's apparent simplicity",
    ],
    followUpQuestions: [
      "How would you detect or prevent an infinite notification loop in an Observer-based system?",
      "How does this pattern relate to the publish-subscribe architectural pattern used in distributed systems?",
      "Should observer notifications be synchronous or asynchronous, and what's the trade-off?",
    ],
    commonMistakes: [
      "Only describing the mechanism with no discussion of real risks",
      "Giving a vague risk like 'it can be slow' without explaining the actual cascading/fan-out mechanism",
    ],
    discussionPoints: ["Subject-observer decoupling", "Update cascades / notification loops", "Sync vs async notification trade-offs"],
  },
  {
    id: "structural-behavioral-patterns-iv-4",
    question: "How is the Strategy pattern different from the State pattern, given they have almost identical class structure?",
    difficulty: "Hard",
    detailedAnswer:
      "Structurally, both involve a context object holding a reference to an interchangeable interface implementation and delegating behavior to it — which is exactly why they're so often confused. The difference is in *who decides* which implementation is active and *why* it changes. In Strategy, the client (external code) chooses which concrete strategy to inject into the context, typically once, based on external configuration or a one-time decision (e.g., 'this checkout should use CreditCardStrategy'), and the strategy itself has no awareness of other strategies or any notion of 'transitioning.' In State, the context's *current state object* is part of the object's own internal, evolving condition, and states often trigger their own transitions — a `VendingMachine` in a `NoCoinState` might, upon receiving a coin, transition itself to a `HasCoinState`, and the state objects typically know about and can switch to other state objects. So Strategy is about swapping *how* an algorithm is performed (chosen externally, relatively static), while State is about modeling *what phase of a lifecycle* an object is currently in (transitions driven internally, dynamic and expected to change over the object's life).",
    idealAnswer:
      "They look almost identical in a class diagram — a context holding a reference to an interface, with multiple interchangeable implementations — so the real distinction is behavioral, not structural. In Strategy, some external client picks the implementation once, from the outside, because it wants a particular algorithm — like choosing CreditCardStrategy for this checkout — and the strategy has no idea other strategies exist. In State, the context's current implementation represents its own internal lifecycle phase, and the state objects themselves often trigger the transitions — a vending machine's NoCoinState, on receiving a coin, switches the machine into HasCoinState itself. So I'd say Strategy answers 'which algorithm should I use for this,' chosen externally and fairly static, while State answers 'what phase is this object currently in,' driven internally and expected to keep changing.",
    interviewerExpectations: [
      "Acknowledges the structural similarity honestly rather than inventing a fake structural difference",
      "Correctly locates the real distinction: who decides the active implementation, and whether transitions happen",
      "Gives a correct example of each (payment strategy vs vending machine/traffic light states)",
    ],
    followUpQuestions: [
      "Can a Strategy pattern evolve into a State pattern over a codebase's lifetime? How would you notice?",
      "Do State pattern implementations need to know about each other? Why might that matter for testing?",
      "Give an example of a system where you'd clearly want State over Strategy.",
    ],
    commonMistakes: [
      "Claiming there's a structural difference between Strategy and State when there largely isn't one",
      "Not being able to explain who triggers transitions in State vs who chooses a strategy in Strategy",
    ],
    discussionPoints: ["Structural similarity vs behavioral intent", "External selection (Strategy) vs internal transition (State)", "Static vs dynamic implementation lifetime"],
  },
  {
    id: "structural-behavioral-patterns-iv-5",
    question:
      "Your team's notification system is a single class, NotificationManager, with a giant if/else chain choosing between email/SMS/push logic inline, and marketing now wants an undo-able 'send campaign' feature with a history of the last 10 sent campaigns that can be reversed (e.g., recall a wrongly-sent campaign before it's fully delivered). Design a refactor using the patterns from this topic, and explain your reasoning for each choice.",
    difficulty: "Hard",
    scenarioBased: true,
    detailedAnswer:
      "Two separate concerns here call for two different patterns. First, the if/else chain choosing between email/SMS/push is a Strategy problem: define a `NotificationChannel` interface with a `send(message)` method, implement `EmailChannel`, `SmsChannel`, `PushChannel`, and have `NotificationManager` hold and delegate to whichever `NotificationChannel` it's configured with — this removes the conditional entirely and lets new channels be added as new classes (this also happens to satisfy OCP/DIP). Second, and more centrally to the new requirement, 'send campaign with undo and a history of the last 10' is a textbook Command problem: define a `Command` interface with `execute()` and `undo()`; implement `SendCampaignCommand`, which captures everything needed to both send *and* reverse a specific campaign send (the campaign payload, the list of channels/recipients targeted, and enough state to issue a 'recall' — e.g., cancelling still-queued sends or issuing a retraction message for already-sent ones where the channel supports it). `NotificationManager` (or a new `CampaignInvoker`) maintains a bounded history — a deque/stack capped at 10 — pushing each executed `SendCampaignCommand` onto it; undo pops the most recent command and calls its `undo()`. This cleanly separates 'which channel performs the actual send' (Strategy, injected into each Command or into the manager) from 'what action was taken and how do I reverse it' (Command), and the two patterns compose naturally: each `SendCampaignCommand` can internally use whichever `NotificationChannel` strategies are relevant to that campaign's targeted channels.",
    idealAnswer:
      "I'd treat this as two separate problems that call for two different patterns. The existing if/else channel selection is a Strategy fix — pull out a NotificationChannel interface with send(), implement EmailChannel/SmsChannel/PushChannel, and have NotificationManager just delegate to whichever channel it's given, no conditional needed, and new channels are just new classes. The new undo-able campaign history is Command — I'd define a Command interface with execute() and undo(), and a SendCampaignCommand that captures everything needed to both send the campaign and reverse it later, like which channels and recipients were targeted and how to issue a recall through each. Then I'd keep a capped history — a deque holding the last 10 executed commands — pushing each SendCampaignCommand after execute(), and undo just pops the most recent one and calls its undo(). The nice part is these compose: each SendCampaignCommand can internally use the NotificationChannel strategies for whatever channels that particular campaign touched, so the 'which channel does the sending' decision and the 'what did I do and how do I reverse it' decision stay cleanly separate.",
    interviewerExpectations: [
      "Correctly identifies Strategy for the channel-selection refactor and Command for the undo/history requirement — not conflating the two",
      "Designs a plausible Command implementation that captures enough state to genuinely support undo/recall, not just execute()",
      "Explains how a bounded history (last 10) would be implemented and how undo interacts with it",
      "Notes that the two patterns compose (Command using Strategy internally) rather than treating them as competing solutions",
    ],
    followUpQuestions: [
      "What happens if a campaign has already been fully delivered when undo is called — can you meaningfully 'undo' that?",
      "How would you extend this to support redo, not just undo?",
      "Would you make the history thread-safe if multiple team members could trigger sends concurrently?",
    ],
    commonMistakes: [
      "Proposing only Strategy and ignoring the undo/history requirement, or vice versa",
      "Designing a Command whose undo() is a no-op or hand-waved, without addressing what 'recall' actually requires per channel",
    ],
    discussionPoints: ["Strategy for interchangeable channel logic", "Command for undo-able, history-tracked actions", "Composing multiple patterns in one design", "Real-world limits of 'undo' for already-delivered actions"],
  },
];

export default structuralBehavioralPatternsInterviewQuestions;
