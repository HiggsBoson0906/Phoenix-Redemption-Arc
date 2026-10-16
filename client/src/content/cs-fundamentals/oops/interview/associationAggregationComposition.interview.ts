// src/content/cs-fundamentals/oops/interview/associationAggregationComposition.interview.ts

import type { InterviewQuestion } from "@/types";

const associationAggregationCompositionInterviewQuestions: InterviewQuestion[] = [
  {
    id: "association-aggregation-composition-iv-1",
    question: "What is the difference between association, aggregation, and composition?",
    difficulty: "Easy",
    detailedAnswer:
      "All three describe a 'has-a'/'knows-a' relationship between two objects, differentiated by lifecycle coupling and ownership. Association is the most general: two objects reference each other with no ownership implied and no lifecycle dependency — e.g. a Customer and an Order referencing each other. Aggregation is a specialized has-a where one object contains references to others, but those parts can outlive the container and be shared across multiple containers — e.g. a Department having Professors, who survive if the Department is dissolved. Composition is the strongest has-a: the part's lifecycle is bound entirely to the whole's — the part is created and destroyed with the whole and can't be meaningfully shared — e.g. a Car and its Engine.",
    idealAnswer:
      "I think of it as a spectrum based on one question: what happens to the part when the whole is deleted? Association: nothing special, the two objects were never lifecycle-linked. Aggregation: the part survives, because the container just held a reference to something that exists independently — like a Department holding Professors. Composition: the part is destroyed too, because it only existed to serve that one specific whole — like a Car and its Engine. UML draws this as a plain line for association, a hollow diamond for aggregation, and a filled diamond for composition, and that diamond fill is really just a visual cue for the lifecycle rule.",
    interviewerExpectations: [
      "Gives the correct, precise definition of all three, not just composition and aggregation",
      "States the lifecycle-dependency test explicitly, not a vague 'strength' comparison",
      "Provides a correct concrete example for each",
    ],
    followUpQuestions: [
      "Can you give an example where the same design could be either aggregation or composition depending on implementation?",
      "How do you represent each of these in UML?",
      "Which of the three, if any, requires inheritance?",
    ],
    commonMistakes: [
      "Describing aggregation and composition as differing only in vague 'strength' without a concrete test",
      "Forgetting association altogether and only discussing aggregation vs composition",
    ],
    discussionPoints: ["Lifecycle dependency", "UML diamond notation", "Shareability of parts"],
  },
  {
    id: "association-aggregation-composition-iv-2",
    question: "How would you determine, just by reading a class's code, whether it's using aggregation or composition for a given member?",
    difficulty: "Medium",
    detailedAnswer:
      "Look at two things: who constructs the part, and who destroys it. If the containing class instantiates the part object itself (e.g., inside its own constructor, with `new` in Java/C++ or a value member in C++) and destroys it in its own destructor (or implicitly, via value semantics), that's composition — the part has no life outside this specific container. If the part is passed into the container from outside (constructor injection, a setter, or added to a collection after the fact) and the container never destroys it directly, that's aggregation — the part's lifecycle is managed elsewhere and it could be shared or reused. A secondary signal: if the same part instance is ever referenced by more than one container simultaneously in the design, it cannot be composition by definition, since composition requires exclusive ownership.",
    idealAnswer:
      "I check who owns construction and destruction. If the class builds the part itself inside its own constructor and would destroy it in its own destructor — like a House `new`-ing its own Room objects and deleting them when the House is deleted — that's composition. If the part shows up as a constructor parameter or gets injected/added after the object already exists, and the class never destroys it, that's aggregation, because the part clearly has a life of its own outside this container. And if I ever see the exact same part instance handed to two different containers, that rules out composition immediately.",
    interviewerExpectations: [
      "Names both signals: who constructs and who destroys the part",
      "Connects 'constructor injection vs internal instantiation' to aggregation vs composition",
      "Notes that shared references across multiple containers rule out composition",
    ],
    followUpQuestions: [
      "Does using a raw pointer vs a value member in C++ automatically tell you which one it is?",
      "How would dependency injection frameworks (e.g. Spring) typically encourage aggregation over composition?",
      "What's a code smell that suggests a composition relationship was implemented as aggregation by mistake?",
    ],
    commonMistakes: [
      "Assuming pointer/reference member = aggregation and value member = composition without checking who constructs/destroys it",
      "Not mentioning the shared-instance test as a quick disqualifier for composition",
    ],
    discussionPoints: ["Constructor injection vs internal instantiation", "Ownership signals in code", "Exclusive ownership as composition's requirement"],
  },
  {
    id: "association-aggregation-composition-iv-3",
    question: "Give a real-world example where getting aggregation vs. composition wrong in a design would cause an actual bug.",
    difficulty: "Medium",
    detailedAnswer:
      "Consider a `ShoppingCart` that holds `Product` objects. If a developer mistakenly implements this as composition — the `ShoppingCart`'s destructor deletes every `Product` it references — then clearing or deleting a cart would destroy the underlying `Product` catalog entries, breaking every other cart or wishlist that also references those same products, since products are clearly meant to be shared, independently-lifecycled catalog entries (aggregation is correct here). Conversely, consider an `Order` that holds `OrderLineItem` objects created specifically for that order (each line item only makes sense attached to its one order). If a developer implements this as aggregation — passing in line items from outside and never cleaning them up — those line items can leak or become orphaned records with no owning order once the order is deleted, since nothing in the design takes responsibility for destroying them.",
    idealAnswer:
      "A classic one: a shopping cart holding products. If someone wires that up as composition and the cart's destructor deletes its Products, then emptying one user's cart could delete Product objects that are actually shared, global catalog entries other carts still reference — that's a real, production-breaking bug caused by choosing the wrong relationship. The mirror case is an Order holding OrderLineItems that are genuinely specific to that order — if that's implemented as aggregation, with line items passed in and never owned or cleaned up by the Order, you get orphaned line items and memory/resource leaks once orders are deleted, because nobody actually owns their lifecycle.",
    interviewerExpectations: [
      "Provides a concrete, plausible scenario, not just an abstract restatement of the definitions",
      "Explains the actual failure mode (premature deletion of shared data, or orphaned/leaked resources)",
      "Shows the fix direction (which relationship should have been used)",
    ],
    followUpQuestions: [
      "How would you catch this kind of bug in code review before it ships?",
      "How does garbage collection in Java change the severity of getting this wrong, compared to manual memory management in C++?",
      "Would smart pointers (shared_ptr vs unique_ptr) in C++ help enforce the correct relationship here?",
    ],
    commonMistakes: [
      "Giving a purely textbook example (car/engine) without connecting it to an actual bug scenario",
      "Not identifying which specific mistake (composition-instead-of-aggregation vs the reverse) causes which specific failure",
    ],
    discussionPoints: ["Premature deletion of shared resources", "Orphaned/leaked owned resources", "Smart pointer semantics as an enforcement mechanism"],
  },
  {
    id: "association-aggregation-composition-iv-4",
    question: "Why might composition be preferred over inheritance when designing class relationships? How does this connect to aggregation/composition concepts?",
    difficulty: "Hard",
    detailedAnswer:
      "'Favor composition over inheritance' is a design principle stating that building behavior by holding and delegating to other objects (has-a) is often more flexible than deep inheritance hierarchies (is-a), because inheritance couples a subclass tightly to its base class's implementation (fragile base class problem) and is fixed at compile time, while composition lets you swap the contained object's behavior at runtime and avoids forcing an is-a relationship where only a has-a is actually true. For instance, instead of a `SortedList` class inheriting from `ArrayList` (inheriting a huge and possibly inappropriate public interface, since not every ArrayList method makes sense to expose on something meant to stay sorted), you'd have `SortedList` contain an `ArrayList` internally (composition) and expose only the operations that preserve its sorted invariant. Whether that internal containment is aggregation or composition specifically then follows the same lifecycle test as always: if `SortedList` creates and owns its internal list exclusively, it's composition; if the list is injected and could be shared, it's aggregation.",
    idealAnswer:
      "The 'composition over inheritance' guideline exists because inheritance locks in an is-a relationship at compile time and exposes the entire base class interface, even the parts that don't make sense for the subclass — that's the classic problem with, say, extending ArrayList to build a SortedList and inheriting an add(index, item) method that could break the sort invariant. Composition avoids that: SortedList just holds an ArrayList internally and exposes only the methods that keep it sorted, delegating to the contained object. Whether that internal list is composition or aggregation in the strict sense still comes down to the same lifecycle test — does SortedList own and exclusively construct that internal list, or could it be handed a shared one from outside?",
    interviewerExpectations: [
      "States the 'favor composition over inheritance' principle and gives a genuine motivating problem with inheritance (fragile base class, inappropriate inherited interface)",
      "Gives a concrete example (e.g. SortedList vs ArrayList inheritance)",
      "Correctly ties the internal containment back to the aggregation/composition lifecycle distinction",
    ],
    followUpQuestions: [
      "What is the fragile base class problem specifically?",
      "Can you think of a case where inheritance genuinely is the right choice over composition?",
      "How does the Strategy design pattern relate to 'favor composition over inheritance'?",
    ],
    commonMistakes: [
      "Treating this as purely about inheritance without connecting it back to the has-a lifecycle concepts being tested",
      "Giving no concrete example of the fragile-base-class problem",
    ],
    discussionPoints: ["Fragile base class problem", "Compile-time vs runtime flexibility", "Interface leakage through inheritance"],
  },
  {
    id: "association-aggregation-composition-iv-5",
    question:
      "You're designing a ride-sharing platform. A Ride object needs a Driver, a Rider, a Vehicle, and a Route. For each of these four relationships, decide whether Ride should use association, aggregation, or composition, and justify each choice.",
    difficulty: "Hard",
    scenarioBased: true,
    detailedAnswer:
      "Driver: association (or aggregation, referencing an existing Driver record) — a Driver exists completely independently of any single Ride, has an account before and after this ride, and is referenced by many past and future rides; Ride should never construct or destroy a Driver. Rider: identical reasoning — association/aggregation, since the Rider account long outlives this one Ride and is shared across their ride history. Vehicle: aggregation — the Vehicle (and its registration, maintenance history) exists independently of any given Ride and is reused across many rides by the same driver; deleting a completed Ride record must not delete the Vehicle. Route: this is the interesting one — if Route here means a specific, ride-scoped path calculation (turn-by-turn directions computed for this trip, with no meaning outside this ride), that's composition: the Ride creates its own Route instance and it's destroyed with the ride. If instead Route means a reusable, named route (e.g. 'Airport Express') that many rides follow, that's aggregation instead, since it would then have independent existence and be shared. The key design decision is recognizing that 'Route' is ambiguous until you decide whether it's ride-specific computed data or a shared reference entity — and that ambiguity is exactly the kind of judgment call this topic is testing.",
    idealAnswer:
      "For Driver and Rider, I'd use association or aggregation — those are existing accounts that live far beyond any single ride and get referenced by many rides, so Ride should hold references to them but never construct or destroy them. Vehicle is aggregation too — the car exists independently, gets reused across many trips by the same driver, and definitely shouldn't get deleted when a Ride record is deleted. Route is where I'd pause and ask a clarifying question: if 'Route' means the specific turn-by-turn path computed just for this one trip and never reused, I'd make that composition — the Ride computes and owns it, and it's destroyed with the ride. But if 'Route' means a named, reusable path like a saved commute that multiple rides follow, that's aggregation, since it now has independent existence. I'd flag that ambiguity explicitly in a design review rather than silently picking one.",
    interviewerExpectations: [
      "Correctly classifies Driver/Rider/Vehicle as aggregation or association, with lifecycle reasoning tied to each",
      "Recognizes Route as ambiguous and reasons through both interpretations rather than picking one arbitrarily",
      "Explicitly applies the 'does the part survive if the whole is deleted' test to each relationship",
    ],
    followUpQuestions: [
      "How would your answer change if Ride needed to store a historical snapshot of the Vehicle's state at the time of the ride?",
      "Would you model the Ride-Driver relationship differently if a Driver could have multiple concurrent Rides (e.g. carpooling)?",
      "How does this design decision affect how you'd write the Ride class's constructor?",
    ],
    commonMistakes: [
      "Making everything composition because Ride 'has' all four objects, without applying the lifecycle test to each",
      "Not noticing that Route is genuinely ambiguous and needs clarification rather than a confident single answer",
    ],
    discussionPoints: ["Applying the lifecycle test per-relationship", "Ambiguity requiring clarification in real design work", "Historical/snapshot data vs live references"],
  },
];

export default associationAggregationCompositionInterviewQuestions;
