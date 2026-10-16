// src/content/cs-fundamentals/oops/oa/structuralBehavioralPatterns.oa.ts

import type { OAQuestion, OARevisionNotes } from "@/types";

export const structuralBehavioralPatternsRevisionNotes: OARevisionNotes = {
  quickRevision: [
    "Structural (Adapter, Decorator, Facade): about composing classes/objects into larger structures.",
    "Behavioral (Observer, Strategy, Command): about communication and distributing responsibility for behavior.",
    "Adapter: translates one interface into another expected interface for compatibility.",
    "Decorator: adds behavior dynamically via wrapping, avoiding subclass explosion.",
    "Facade: simplifies a complex multi-class subsystem behind one entry-point interface.",
    "Observer: one-to-many notification when a subject's state changes.",
    "Strategy: family of interchangeable algorithms, swappable at runtime.",
    "Command: encapsulates a request as an object, enabling undo/queuing/logging.",
  ],
  importantFacts: [
    "Adapter usually wraps exactly one incompatible class to match one expected interface; Facade usually coordinates many subsystem classes behind one simplified interface.",
    "Decorator and the wrapped object implement the same interface, so decorators can be stacked/nested arbitrarily.",
    "Strategy is selected by the client/context from outside; State is about an object transitioning its own behavior based on internal state — structurally similar, conceptually different.",
    "Command decouples the invoker (who triggers an action) from the receiver (who performs it), commonly enabling undo via a stored inverse action.",
  ],
  memoryTricks: [
    "'A-D-F compose, O-S-C communicate' — Adapter/Decorator/Facade are structural (composition); Observer/Strategy/Command are behavioral (communication).",
    "'Adapter fits one plug, Facade simplifies the whole panel' — Adapter is one-to-one interface translation, Facade is many-to-one simplification.",
  ],
};

export const structuralBehavioralPatternsOAQuestions: OAQuestion[] = [
  {
    id: "structural-behavioral-patterns-oa-1",
    question: "Which of the following is a Structural design pattern?",
    options: ["Observer", "Strategy", "Adapter", "Command"],
    correctAnswerIndex: 2,
    explanation: "Adapter is Structural — it's about composing/translating between class interfaces, not about runtime communication between objects.",
    difficulty: "Easy",
    topicTags: ["classification"],
  },
  {
    id: "structural-behavioral-patterns-oa-2",
    question:
      "class LegacyPrinter {\n  void printOldFormat(String s) { /* ... */ }\n}\ninterface Printer {\n  void print(String s);\n}\nclass PrinterAdapter implements Printer {\n  private LegacyPrinter legacy;\n  PrinterAdapter(LegacyPrinter l) { legacy = l; }\n  public void print(String s) { legacy.printOldFormat(s); }\n}\nWhich pattern is illustrated?",
    options: ["Decorator", "Adapter", "Facade", "Observer"],
    correctAnswerIndex: 1,
    explanation: "PrinterAdapter translates calls from the expected Printer interface into the legacy class's incompatible method — the definition of Adapter.",
    difficulty: "Medium",
    topicTags: ["Adapter", "code identification"],
  },
  {
    id: "structural-behavioral-patterns-oa-3",
    question:
      "interface Coffee { double cost(); }\nclass SimpleCoffee implements Coffee { public double cost() { return 2.0; } }\nclass MilkDecorator implements Coffee {\n  private Coffee wrapped;\n  MilkDecorator(Coffee c) { wrapped = c; }\n  public double cost() { return wrapped.cost() + 0.5; }\n}\nWhich pattern does MilkDecorator implement?",
    options: ["Adapter", "Facade", "Decorator", "Command"],
    correctAnswerIndex: 2,
    explanation: "MilkDecorator wraps a Coffee instance and adds behavior (extra cost) dynamically while implementing the same interface — the Decorator pattern.",
    difficulty: "Medium",
    topicTags: ["Decorator", "code identification"],
  },
  {
    id: "structural-behavioral-patterns-oa-4",
    question: "What is the main problem the Decorator pattern solves, compared to using subclassing alone?",
    options: [
      "It removes the need for interfaces entirely",
      "It avoids a combinatorial explosion of subclasses needed to represent every combination of optional behaviors",
      "It makes objects immutable",
      "It guarantees thread safety",
    ],
    correctAnswerIndex: 1,
    explanation: "Instead of a subclass per combination (e.g. CoffeeWithMilkAndSugar), Decorator composes independent wrapper objects that can be combined in any order at runtime.",
    difficulty: "Medium",
    topicTags: ["Decorator"],
  },
  {
    id: "structural-behavioral-patterns-oa-5",
    question:
      "class HomeTheaterFacade {\n  void watchMovie() {\n    projector.on();\n    screen.lower();\n    soundSystem.setVolume(5);\n    dvdPlayer.play();\n  }\n}\nWhich pattern is this, and why?",
    options: [
      "Adapter, because it translates interfaces",
      "Facade, because it provides one simplified entry point that coordinates a complex multi-class subsystem",
      "Observer, because it notifies multiple objects",
      "Strategy, because it swaps algorithms",
    ],
    correctAnswerIndex: 1,
    explanation: "watchMovie() hides the coordination of multiple subsystem classes behind a single simple method call — the defining trait of Facade.",
    difficulty: "Easy",
    topicTags: ["Facade", "code identification"],
  },
  {
    id: "structural-behavioral-patterns-oa-6",
    question: "What is the key structural difference between Adapter and Facade?",
    options: [
      "There is no difference, they're the same pattern",
      "Adapter typically translates one incompatible interface to match an expected one (usually one class); Facade simplifies access to a whole subsystem of multiple classes",
      "Facade only works with abstract classes",
      "Adapter can only be used for legacy code",
    ],
    correctAnswerIndex: 1,
    explanation: "Adapter is about compatibility (usually one-to-one interface translation); Facade is about simplification (usually one-to-many, coordinating a subsystem).",
    difficulty: "Hard",
    topicTags: ["Adapter", "Facade"],
  },
  {
    id: "structural-behavioral-patterns-oa-7",
    question:
      "interface Observer { void update(float temp); }\nclass WeatherStation {\n  private List<Observer> observers = new ArrayList<>();\n  void registerObserver(Observer o) { observers.add(o); }\n  void setTemperature(float t) {\n    for (Observer o : observers) o.update(t);\n  }\n}\nWhich pattern is this?",
    options: ["Strategy", "Command", "Observer", "Decorator"],
    correctAnswerIndex: 2,
    explanation: "WeatherStation (the subject) maintains a list of Observers and notifies all of them on state change — the Observer pattern's defining structure.",
    difficulty: "Easy",
    topicTags: ["Observer", "code identification"],
  },
  {
    id: "structural-behavioral-patterns-oa-8",
    question: "In the Observer pattern, what does the subject need to know about its observers?",
    options: [
      "Their exact concrete class and internal implementation",
      "Only that they implement the Observer interface — the subject stays decoupled from concrete observer types",
      "Nothing at all, not even that they exist",
      "Their source code, to call private methods directly",
    ],
    correctAnswerIndex: 1,
    explanation: "The subject depends only on the Observer interface/contract, allowing new observer types to be added without modifying the subject.",
    difficulty: "Medium",
    topicTags: ["Observer"],
  },
  {
    id: "structural-behavioral-patterns-oa-9",
    question:
      "interface PaymentStrategy { void pay(double amount); }\nclass CreditCardStrategy implements PaymentStrategy { public void pay(double amount) { /* ... */ } }\nclass Checkout {\n  private PaymentStrategy strategy;\n  Checkout(PaymentStrategy s) { strategy = s; }\n  void checkout(double amount) { strategy.pay(amount); }\n}\nWhich pattern is this?",
    options: ["Command", "Strategy", "Adapter", "Facade"],
    correctAnswerIndex: 1,
    explanation: "Checkout delegates to an interchangeable PaymentStrategy implementation chosen at runtime, without any conditional branching — the Strategy pattern.",
    difficulty: "Medium",
    topicTags: ["Strategy", "code identification"],
  },
  {
    id: "structural-behavioral-patterns-oa-10",
    question: "How does the Strategy pattern differ from simply passing a hardcoded if/else chain to select behavior?",
    options: [
      "There is no real difference",
      "Strategy encapsulates each algorithm as its own class implementing a common interface, so new algorithms are added without modifying existing conditional logic (supporting OCP)",
      "Strategy can only be used with exactly two algorithms",
      "Strategy requires the algorithm to be chosen at compile time only",
    ],
    correctAnswerIndex: 1,
    explanation: "Strategy replaces conditional branching with polymorphism, letting new algorithm variants be added as new classes rather than new branches.",
    difficulty: "Medium",
    topicTags: ["Strategy", "OCP"],
  },
  {
    id: "structural-behavioral-patterns-oa-11",
    question:
      "interface Command { void execute(); void undo(); }\nclass LightOnCommand implements Command {\n  private Light light;\n  LightOnCommand(Light l) { light = l; }\n  public void execute() { light.on(); }\n  public void undo() { light.off(); }\n}\nclass RemoteControl {\n  private Command lastCommand;\n  void pressButton(Command c) { c.execute(); lastCommand = c; }\n  void pressUndo() { lastCommand.undo(); }\n}\nWhich pattern is this, and what capability does it directly enable?",
    options: [
      "Observer; it enables notifications",
      "Command; it encapsulates a request as an object, directly enabling undo functionality without RemoteControl knowing what the command does",
      "Adapter; it translates the Light interface",
      "Facade; it simplifies the Light subsystem",
    ],
    correctAnswerIndex: 1,
    explanation: "The request (turning a light on) is encapsulated as a Command object with execute()/undo(), and the invoker (RemoteControl) stays decoupled from the concrete action — this is the Command pattern, and it directly enables undo.",
    difficulty: "Hard",
    topicTags: ["Command", "code identification"],
  },
  {
    id: "structural-behavioral-patterns-oa-12",
    question: "Which of these patterns is primarily responsible for decoupling the object that triggers an action from the object that performs it, while also enabling undo/redo?",
    options: ["Observer", "Strategy", "Command", "Decorator"],
    correctAnswerIndex: 2,
    explanation: "Command turns a request into a standalone object, so the invoker doesn't need to know the receiver or the operation details, and undo/redo becomes straightforward to implement via stored commands.",
    difficulty: "Medium",
    topicTags: ["Command"],
    companyStyle: "Microsoft-style",
  },
];
