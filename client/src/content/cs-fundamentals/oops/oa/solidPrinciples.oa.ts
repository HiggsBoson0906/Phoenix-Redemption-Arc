// src/content/cs-fundamentals/oops/oa/solidPrinciples.oa.ts

import type { OAQuestion, OARevisionNotes } from "@/types";

export const solidPrinciplesRevisionNotes: OARevisionNotes = {
  quickRevision: [
    "S - Single Responsibility: one reason to change per class.",
    "O - Open/Closed: open for extension, closed for modification — add new classes, don't edit working ones.",
    "L - Liskov Substitution: subtypes must be substitutable for base types without breaking correctness.",
    "I - Interface Segregation: many small interfaces beat one fat interface that forces unused methods.",
    "D - Dependency Inversion: depend on abstractions, not concrete implementations; high- and low-level modules both depend on interfaces.",
  ],
  importantFacts: [
    "LSP is about behavioral substitutability, not just successful compilation — the Square-extends-Rectangle case compiles fine but violates LSP.",
    "Dependency Inversion (a design principle) is not the same as Dependency Injection (a technique/mechanism often used to satisfy DIP).",
    "ISP is essentially SRP applied to interfaces: don't force a class to implement methods irrelevant to it.",
    "A large if/else or switch statement that must be edited every time a new case is added is the classic OCP violation.",
  ],
  memoryTricks: [
    "SOLID = Single, Open, Liskov, Interface, Dependency.",
    "'Square breaks the rectangle's promise' — a fast trigger to remember the classic LSP violation example.",
  ],
};

export const solidPrinciplesOAQuestions: OAQuestion[] = [
  {
    id: "solid-principles-oa-1",
    question: "The Single Responsibility Principle states that a class should:",
    options: [
      "Have exactly one public method",
      "Have only one reason to change",
      "Never be extended by a subclass",
      "Implement only one interface",
    ],
    correctAnswerIndex: 1,
    explanation: "SRP is about having a single axis of change/responsibility, not a method count restriction.",
    difficulty: "Easy",
    topicTags: ["SRP"],
  },
  {
    id: "solid-principles-oa-2",
    question:
      "class Invoice {\n  void calculateTotal() { /* ... */ }\n  void printInvoice() { /* formats and prints to console */ }\n  void saveToDatabase() { /* JDBC code */ }\n}\nWhich SOLID principle does this class most clearly violate?",
    options: ["Liskov Substitution Principle", "Single Responsibility Principle", "Interface Segregation Principle", "Open/Closed Principle"],
    correctAnswerIndex: 1,
    explanation: "Invoice bundles business logic, presentation, and persistence — three responsibilities that change for different reasons — violating SRP.",
    difficulty: "Medium",
    topicTags: ["SRP", "code identification"],
  },
  {
    id: "solid-principles-oa-3",
    question:
      "class DiscountCalculator {\n  double calculate(String customerType, double amount) {\n    if (customerType.equals(\"REGULAR\")) return amount * 0.95;\n    else if (customerType.equals(\"PREMIUM\")) return amount * 0.90;\n    else if (customerType.equals(\"VIP\")) return amount * 0.80;\n    return amount;\n  }\n}\nAdding a new customer type requires editing this method's body. Which principle is violated?",
    options: ["Open/Closed Principle", "Dependency Inversion Principle", "Liskov Substitution Principle", "Single Responsibility Principle"],
    correctAnswerIndex: 0,
    explanation: "New behavior requires modifying existing, working code rather than extending via new classes — the textbook OCP violation.",
    difficulty: "Medium",
    topicTags: ["OCP", "code identification"],
  },
  {
    id: "solid-principles-oa-4",
    question:
      "class Rectangle {\n  protected int width, height;\n  void setWidth(int w) { width = w; }\n  void setHeight(int h) { height = h; }\n  int getArea() { return width * height; }\n}\nclass Square extends Rectangle {\n  @Override void setWidth(int w) { width = height = w; }\n  @Override void setHeight(int h) { width = height = h; }\n}\nvoid resize(Rectangle r) {\n  r.setWidth(5);\n  r.setHeight(4);\n  assert r.getArea() == 20; // passes for Rectangle, fails for Square (area=16)\n}\nWhich principle does Square's design violate?",
    options: ["Interface Segregation Principle", "Liskov Substitution Principle", "Single Responsibility Principle", "Dependency Inversion Principle"],
    correctAnswerIndex: 1,
    explanation: "Square compiles as a Rectangle but breaks code that correctly relies on Rectangle's behavioral contract (independent width/height) — a classic LSP violation.",
    difficulty: "Hard",
    topicTags: ["LSP", "code identification"],
  },
  {
    id: "solid-principles-oa-5",
    question: "What does the Liskov Substitution Principle actually require, precisely?",
    options: [
      "Subclasses must override every method of the base class",
      "Objects of a subtype must be substitutable for objects of the base type without altering the correctness of the program",
      "A subclass must have more methods than its base class",
      "A subclass must never call super() in its constructor",
    ],
    correctAnswerIndex: 1,
    explanation: "LSP is a behavioral correctness requirement — substituting a subtype must not break code written against the base type's contract.",
    difficulty: "Medium",
    topicTags: ["LSP"],
  },
  {
    id: "solid-principles-oa-6",
    question:
      "interface Worker {\n  void work();\n  void eat();\n}\nclass RobotWorker implements Worker {\n  public void work() { /* ... */ }\n  public void eat() { throw new UnsupportedOperationException(); }\n}\nWhich principle is violated?",
    options: ["Interface Segregation Principle", "Open/Closed Principle", "Liskov Substitution Principle only", "None — this is correct design"],
    correctAnswerIndex: 0,
    explanation: "RobotWorker is forced to implement eat(), a method irrelevant to it, because Worker is a 'fat' interface bundling unrelated capabilities — an ISP violation (note it also creates an LSP problem via the thrown exception, but the root design defect is ISP).",
    difficulty: "Medium",
    topicTags: ["ISP", "code identification"],
  },
  {
    id: "solid-principles-oa-7",
    question: "The Interface Segregation Principle is best summarized as:",
    options: [
      "No client should be forced to depend on methods it does not use",
      "Every class must implement at least two interfaces",
      "Interfaces should always be abstract classes instead",
      "A class should never implement more than one interface",
    ],
    correctAnswerIndex: 0,
    explanation: "ISP advocates many small, focused interfaces so implementers aren't burdened with irrelevant methods.",
    difficulty: "Easy",
    topicTags: ["ISP"],
  },
  {
    id: "solid-principles-oa-8",
    question:
      "class OrderService {\n  private EmailSender sender = new EmailSender();\n  void notifyCustomer(String msg) { sender.send(msg); }\n}\nWhich principle does this design violate, and why?",
    options: [
      "SRP, because OrderService has two responsibilities",
      "Dependency Inversion Principle, because the high-level OrderService directly depends on the concrete low-level EmailSender instead of an abstraction",
      "LSP, because EmailSender cannot be substituted",
      "ISP, because EmailSender has too many methods",
    ],
    correctAnswerIndex: 1,
    explanation: "OrderService instantiates and depends directly on a concrete class rather than an interface/abstraction, violating DIP and making it hard to swap or mock the sender.",
    difficulty: "Medium",
    topicTags: ["DIP", "code identification"],
  },
  {
    id: "solid-principles-oa-9",
    question: "What is the correct relationship between Dependency Inversion Principle (DIP) and Dependency Injection (DI)?",
    options: [
      "They are exactly the same thing",
      "DIP is the design principle (depend on abstractions); DI is a common technique/mechanism used to satisfy DIP",
      "DI is a principle and DIP is a framework",
      "DIP only applies to Java, DI only applies to C++",
    ],
    correctAnswerIndex: 1,
    explanation: "DIP is about what to depend on (abstractions); DI is how you typically wire those abstractions to concrete implementations at runtime.",
    difficulty: "Hard",
    topicTags: ["DIP", "dependency injection"],
  },
  {
    id: "solid-principles-oa-10",
    question: "Which SOLID principle is most directly responsible for making unit testing with mock objects practical?",
    options: ["Single Responsibility Principle", "Open/Closed Principle", "Dependency Inversion Principle", "Liskov Substitution Principle"],
    correctAnswerIndex: 2,
    explanation: "Because DIP has high-level code depend on abstractions/interfaces, tests can substitute a mock implementation for the real one at those seams.",
    difficulty: "Medium",
    topicTags: ["DIP", "testing"],
  },
  {
    id: "solid-principles-oa-11",
    question:
      "abstract class Bird {\n  abstract void fly();\n}\nclass Penguin extends Bird {\n  void fly() { throw new UnsupportedOperationException(\"Penguins can't fly\"); }\n}\nWhich principle does this design most clearly violate?",
    options: ["Open/Closed Principle", "Liskov Substitution Principle", "Interface Segregation Principle only", "Single Responsibility Principle"],
    correctAnswerIndex: 1,
    explanation: "Any code that correctly calls fly() on a Bird reference will break at runtime when handed a Penguin, since Penguin cannot honor the base class's implied contract — a direct LSP violation.",
    difficulty: "Medium",
    topicTags: ["LSP", "code identification"],
  },
  {
    id: "solid-principles-oa-12",
    question: "A team refactors a giant if/else chain selecting shipping-cost strategies into a ShippingStrategy interface with one implementation class per carrier, injected into the OrderProcessor. Which principles does this refactor primarily satisfy?",
    options: [
      "Only Single Responsibility Principle",
      "Open/Closed Principle and Dependency Inversion Principle",
      "Only Interface Segregation Principle",
      "None — this adds unnecessary complexity",
    ],
    correctAnswerIndex: 1,
    explanation: "New carriers can be added as new classes without editing OrderProcessor (OCP), and OrderProcessor now depends on the ShippingStrategy abstraction rather than concrete carrier logic (DIP).",
    difficulty: "Hard",
    topicTags: ["OCP", "DIP", "Strategy pattern"],
    companyStyle: "Amazon",
  },
];
