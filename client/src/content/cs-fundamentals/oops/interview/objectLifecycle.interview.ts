// src/content/cs-fundamentals/oops/interview/objectLifecycle.interview.ts

import type { InterviewQuestion } from "@/types";

const objectLifecycleInterviewQuestions: InterviewQuestion[] = [
  {
    id: "object-lifecycle-iv-1",
    question: "What are the different types of constructors and when would you use each?",
    difficulty: "Easy",
    detailedAnswer:
      "A default constructor takes no arguments and sets fields to baseline values; it's useful when a sensible zero-state exists (e.g. an empty list). A parameterized constructor accepts arguments so the caller supplies required initial state at creation time, which is the best way to enforce that an object can never exist without its essential fields set (e.g. requiring a `Point(int x, int y)` rather than allowing an uninitialized point). A copy constructor builds a new object as a copy of an existing one of the same type — in C++ you get one by default (member-wise shallow copy) unless you write your own; in Java there's no synthesized copy constructor at all, so you write one explicitly (or override clone()) when you need copy semantics.",
    idealAnswer:
      "I'd distinguish three: default (no-arg, sets sane defaults), parameterized (forces the caller to supply required state up front, which is the main tool for making 'invalid objects' unrepresentable), and copy (builds a new object from an existing one). I reach for parameterized constructors most often in real code because they push validation and required-field enforcement to the earliest possible point — object creation — rather than letting an object exist in a half-configured state that some other method has to guard against.",
    interviewerExpectations: [
      "Names all three constructor types with a correct one-line definition each",
      "Explains why parameterized constructors help enforce valid state",
      "Knows that C++ synthesizes a copy constructor by default but Java does not",
    ],
    followUpQuestions: [
      "What does the compiler-generated copy constructor do in C++, and when does it become dangerous?",
      "Why doesn't Java provide a synthesized copy constructor?",
      "Can a class have multiple parameterized constructors? What's that called?",
    ],
    commonMistakes: [
      "Forgetting the copy constructor entirely when listing types",
      "Claiming Java auto-generates a copy constructor the way C++ does",
    ],
    discussionPoints: ["Constructor overloading", "Enforcing valid state at construction time", "Language differences in synthesized constructors"],
  },
  {
    id: "object-lifecycle-iv-2",
    question: "Explain the difference between shallow copy and deep copy, and why the distinction matters.",
    difficulty: "Medium",
    detailedAnswer:
      "A shallow copy duplicates an object field-by-field, but for any field that is a pointer/reference to heap-allocated or externally-owned data, it copies the *pointer value* itself, not the data it points to — so the original and the copy end up referencing the same underlying object. A deep copy instead allocates new memory for any owned resource and copies the actual pointed-to values, so the two objects are fully independent afterward. The distinction matters because with a shallow copy, mutating the shared data through one object silently affects the other (an aliasing bug), and if both objects independently free/delete that shared resource in their destructors, you get a double-free — undefined behavior in C++ that commonly manifests as a crash or heap corruption.",
    idealAnswer:
      "Shallow copy copies the reference, not the referent — if my class holds a raw pointer to a heap array, a shallow copy gives me two objects pointing at the *same* array. That's fine for read-only sharing, but it's a landmine if either object mutates the array thinking it's private, or if both destructors try to free it — that's a double-free. A deep copy actually allocates a new array and copies the values over, so the two objects are truly independent. Any class that owns a resource — not just borrows a reference to one someone else manages — needs to think carefully about which one it wants and implement its copy constructor/assignment operator accordingly.",
    interviewerExpectations: [
      "Correctly explains that shallow copy duplicates the reference, not the referent",
      "Names the concrete failure modes: aliasing and double-free",
      "Recognizes this is a decision the class author must make deliberately, not something to leave to chance",
    ],
    followUpQuestions: [
      "How would you implement a correct deep copy for a class holding a raw int* array in C++?",
      "Does Java's default Object.clone() perform a shallow or deep copy?",
      "When is a shallow copy actually the right choice?",
    ],
    commonMistakes: [
      "Saying deep copy is 'always better' without acknowledging its extra cost",
      "Not connecting shallow copy to the double-free bug specifically",
    ],
    discussionPoints: ["Aliasing bugs", "Double-free / use-after-free", "Ownership semantics"],
  },
  {
    id: "object-lifecycle-iv-3",
    question: "What is RAII, and how does it change the way you write resource-managing code in C++ compared to Java?",
    difficulty: "Medium",
    detailedAnswer:
      "RAII (Resource Acquisition Is Initialization) ties a resource's lifetime directly to an object's lifetime: you acquire the resource in the constructor and release it in the destructor, so the compiler's deterministic destructor calls — guaranteed to run at scope exit, including during exception unwinding — become your cleanup mechanism. This means a `std::lock_guard` releases a mutex the instant it goes out of scope, and a `std::ifstream` closes its file the same way, with zero risk of forgetting to clean up even on an exceptional exit path. Java has no deterministic destructor (finalize() was unreliable and is deprecated), so the equivalent discipline is explicit: implement AutoCloseable and use try-with-resources, which the compiler desugars into a try/finally that calls close() — functionally similar guarantee, but it requires the caller to opt in syntactically rather than getting it automatically from object lifetime.",
    idealAnswer:
      "RAII means I don't write explicit cleanup code scattered through my function — I just wrap the resource in an object whose constructor acquires it and destructor releases it, and the language guarantees the destructor runs when that object leaves scope, exception or not. In C++ that's automatic and invisible once the wrapper class exists — that's why smart pointers and lock_guard exist. In Java, since there's no deterministic destructor, I have to explicitly implement AutoCloseable and use try-with-resources to get an equivalent guarantee — the mechanism is opt-in rather than automatic, so it's easier to forget on a class that should be closeable but wasn't marked as such.",
    interviewerExpectations: [
      "Correctly defines RAII and connects it to deterministic C++ destructors",
      "Explains why exception safety is a key benefit (stack unwinding still runs destructors)",
      "Contrasts with Java's try-with-resources as the non-automatic equivalent",
    ],
    followUpQuestions: [
      "What happens to RAII cleanup if an exception is thrown mid-constructor?",
      "Name two standard-library C++ classes that rely on RAII.",
      "Why was Java's finalize() deprecated?",
    ],
    commonMistakes: [
      "Describing RAII as a garbage-collection technique",
      "Missing the exception-safety angle entirely",
    ],
    discussionPoints: ["Deterministic destruction", "Exception safety / stack unwinding", "try-with-resources as Java's analog"],
  },
  {
    id: "object-lifecycle-iv-4",
    question: "Trace through what happens, in order, when a Derived object (which inherits from Base, and both have members with their own constructors) is constructed and then destroyed.",
    difficulty: "Hard",
    detailedAnswer:
      "Construction order: (1) Base's member fields are initialized in their declaration order, (2) Base's constructor body runs, (3) Derived's own member fields are initialized in their declaration order (their constructors run, using any member initializer list values or default initializers), (4) Derived's constructor body runs last. Destruction is the exact mirror in reverse: (1) Derived's destructor body runs first, (2) Derived's member fields are destroyed in reverse declaration order, (3) Base's destructor body runs, (4) Base's member fields are destroyed in reverse declaration order. The underlying rule is simple once stated as a principle: you can't run derived-class logic on a base that doesn't exist yet, so construction must build the base first; symmetrically, you shouldn't tear down the base while derived-class state built on top of it might still reference it, so destruction removes the derived layer first.",
    idealAnswer:
      "I think of it as building layer by layer, outside-in for construction and inside-out for destruction. So: Base's members initialize, then Base's constructor body runs, then Derived's members initialize, then Derived's constructor body runs — Derived can't safely run its own setup until the Base it depends on fully exists. Destruction just reverses that exactly: Derived's destructor body first, then Derived's members are torn down, then Base's destructor body, then Base's members. It's the same reasoning in reverse — you don't want to destroy the foundation while something built on top of it might still touch it.",
    interviewerExpectations: [
      "Gets the four-step order right for both construction and destruction",
      "Explains *why* the order must be this way, not just recites it",
      "Understands that member field order within a class follows declaration order, not initializer-list order",
    ],
    followUpQuestions: [
      "What happens if a base class constructor calls a virtual function that's overridden in Derived?",
      "Why must destructors in a polymorphic base class typically be declared virtual?",
      "If member initializer list order differs from declaration order, which one wins?",
    ],
    commonMistakes: [
      "Reversing the order (claiming Derived constructs before Base)",
      "Not knowing that destruction is the exact mirror of construction",
    ],
    discussionPoints: ["Base-to-derived construction", "Derived-to-base destruction", "Virtual destructors in polymorphic hierarchies"],
  },
  {
    id: "object-lifecycle-iv-5",
    question:
      "You're reviewing a C++ class `ImageBuffer` that owns a raw `unsigned char* pixels` heap array, has a custom destructor freeing it, but no custom copy constructor or copy assignment operator. QA reports intermittent crashes when ImageBuffer objects are passed by value into a function. Diagnose the bug and walk through the fix.",
    difficulty: "Hard",
    scenarioBased: true,
    detailedAnswer:
      "Passing an object by value invokes its copy constructor. Since ImageBuffer has a custom destructor but relies on the compiler-generated (shallow) copy constructor, every pass-by-value creates a new ImageBuffer whose `pixels` pointer is copied verbatim — both the original and the temporary now point at the same heap array. When the function returns, the temporary's destructor runs and frees `pixels`; the original object still holds a now-dangling pointer to freed memory, and if the original is used again (or destroyed later), that's a use-after-free or a double-free — exactly the kind of intermittent, timing-dependent crash QA is seeing, since it often only manifests when the freed memory gets reused/overwritten before the bug is observed. The fix follows the Rule of Three/Five directly: implement a custom copy constructor and copy assignment operator that perform a genuine deep copy — allocate a new buffer of the same size and copy the pixel bytes into it — so each ImageBuffer instance owns its own independent buffer. A more idiomatic modern-C++ fix is to replace the raw pointer with a `std::vector<unsigned char>` or a `std::unique_ptr` with an explicit deep-copying wrapper (or mark the class move-only and pass by reference/move instead of by value, avoiding the copy entirely if copies aren't actually needed).",
    idealAnswer:
      "The moment I hear 'owns a raw pointer, has a custom destructor, no custom copy constructor,' that's the Rule of Three violation — the compiler is shallow-copying that pixels pointer on every pass-by-value, so you get two objects sharing one buffer, and whichever one's destructor runs first frees it out from under the other. That explains the intermittent crashes perfectly, since it depends on when the freed memory gets reused. My fix: either write a real deep-copying copy constructor and copy assignment operator that allocate a fresh buffer and copy the bytes, or better, sidestep the whole problem by switching pixels to a std::vector<unsigned char> so the standard library handles correct copy/move semantics for me, and pass ImageBuffer by const reference instead of by value wherever I don't actually need a copy.",
    interviewerExpectations: [
      "Correctly identifies the root cause as a Rule of Three violation causing shallow-copy aliasing",
      "Explains the use-after-free/double-free mechanism concretely, tied to pass-by-value semantics",
      "Proposes both a direct fix (deep-copying copy constructor/assignment) and a more idiomatic modern-C++ alternative",
    ],
    followUpQuestions: [
      "How would a move constructor change this analysis if the function only needed to consume the buffer once?",
      "Why is passing by const reference often preferable to passing by value here regardless of the copy bug?",
      "What tool (e.g. AddressSanitizer, Valgrind) would you use to confirm this diagnosis in practice?",
    ],
    commonMistakes: [
      "Blaming the destructor itself rather than the missing copy constructor/assignment operator",
      "Proposing a fix that only patches the copy constructor but ignores copy assignment operator, leaving the bug reachable via `a = b;`",
    ],
    discussionPoints: ["Rule of Three/Five", "Use-after-free vs double-free", "Pass-by-value vs pass-by-reference", "RAII wrapper types (vector, unique_ptr)"],
  },
];

export default objectLifecycleInterviewQuestions;
