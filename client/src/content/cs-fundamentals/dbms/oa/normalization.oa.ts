// src/content/cs-fundamentals/dbms/oa/normalization.oa.ts

import type { OAQuestion, OARevisionNotes } from "@/types";

export const normalizationRevisionNotes: OARevisionNotes = {
  quickRevision: [
    "1NF: atomic column values only, no repeating groups or multi-valued columns.",
    "2NF: 1NF + no non-prime attribute is partially dependent on part of a composite candidate key.",
    "3NF: 2NF + no non-prime attribute is transitively dependent on the candidate key through a non-key attribute.",
    "BCNF: for every non-trivial FD X -> Y, X must be a superkey (no exception even if Y is prime, unlike 3NF).",
  ],
  importantFacts: [
    "A single-column primary key table automatically satisfies 2NF once in 1NF — partial dependency needs a composite key to even be possible.",
    "Prime attribute = part of some candidate key; non-prime = part of no candidate key.",
    "Every BCNF relation is in 3NF; not every 3NF relation is in BCNF (they diverge only with overlapping candidate keys).",
    "Functional dependency X -> Y: rows agreeing on X must agree on Y.",
    "Normalization trades read-time JOINs for write-time integrity; denormalization is the reverse trade-off, common in analytics.",
  ],
  memoryTricks: [
    "'2NF kills partial, 3NF kills transitive' — partial dependency (part of key -> non-prime attribute) breaks 2NF; transitive dependency (non-key -> non-prime attribute) breaks 3NF.",
    "BCNF = '3NF without mercy' — removes 3NF's one exception (that Y can be a prime attribute).",
  ],
};

export const normalizationOAQuestions: OAQuestion[] = [
  {
    id: "normalization-oa-1",
    question:
      "Consider the relation Orders(OrderID, ProductID, ProductName, Quantity) with functional dependencies: {OrderID, ProductID} -> Quantity, and ProductID -> ProductName. The candidate key is (OrderID, ProductID). What is the highest normal form this relation currently satisfies?",
    options: ["1NF only", "2NF only", "3NF", "BCNF"],
    correctAnswerIndex: 0,
    explanation:
      "All values are atomic, so it satisfies 1NF. But ProductID -> ProductName is a partial dependency: ProductID is only part of the candidate key (OrderID, ProductID), yet it alone determines the non-prime attribute ProductName. This violates 2NF, so the relation satisfies 1NF only (not 2NF, and therefore not 3NF or BCNF either).",
    difficulty: "Hard",
    topicTags: ["normal form identification", "partial dependency"],
    companyStyle: "Amazon OA",
  },
  {
    id: "normalization-oa-2",
    question: "What is a partial dependency, and which normal form does it violate?",
    options: [
      "A non-prime attribute depends on the whole candidate key; violates 1NF",
      "A non-prime attribute depends on only part of a composite candidate key; violates 2NF",
      "A prime attribute depends on a non-key attribute; violates 3NF",
      "A column holds multiple values; violates BCNF",
    ],
    correctAnswerIndex: 1,
    explanation: "A partial dependency occurs when a non-prime attribute is functionally dependent on a proper subset of a composite candidate key rather than the whole key — this is exactly what 2NF forbids.",
    difficulty: "Medium",
    topicTags: ["2NF", "partial dependency"],
  },
  {
    id: "normalization-oa-3",
    question:
      "Relation Employee(EmpID, EmpName, DeptID, DeptName) has FDs: EmpID -> EmpName, DeptID and DeptID -> DeptName. EmpID is the only candidate key. What normal form does this relation violate?",
    options: ["It violates 1NF", "It violates 2NF", "It violates 3NF (but satisfies 2NF)", "It is already in BCNF"],
    correctAnswerIndex: 2,
    explanation: "Since EmpID is a single-column key, 2NF is automatically satisfied. But EmpID -> DeptID -> DeptName is a transitive dependency (DeptID is not a key, yet determines the non-prime attribute DeptName), which violates 3NF.",
    difficulty: "Hard",
    topicTags: ["normal form identification", "transitive dependency"],
    companyStyle: "TCS NQT",
  },
  {
    id: "normalization-oa-4",
    question: "Which of the following best defines Third Normal Form (3NF)?",
    options: [
      "Every attribute must be atomic",
      "The table is in 2NF, and no non-prime attribute is transitively dependent on the candidate key",
      "Every determinant must be a candidate key, with no exceptions",
      "The table has no foreign keys",
    ],
    correctAnswerIndex: 1,
    explanation: "3NF requires 2NF plus the absence of transitive dependencies of non-prime attributes on the key through another non-key attribute.",
    difficulty: "Medium",
    topicTags: ["3NF"],
  },
  {
    id: "normalization-oa-5",
    question: "How does BCNF differ from 3NF?",
    options: [
      "BCNF requires atomic values, 3NF does not",
      "BCNF requires every determinant of a non-trivial FD to be a superkey, with no exception for the dependent being a prime attribute; 3NF allows that exception",
      "3NF is stricter than BCNF",
      "There is no real difference; they are interchangeable terms",
    ],
    correctAnswerIndex: 1,
    explanation: "3NF permits a non-superkey determinant if the dependent attribute is prime (part of some candidate key); BCNF removes this exception entirely, making it strictly stricter than or equal to 3NF.",
    difficulty: "Medium",
    topicTags: ["BCNF", "3NF"],
  },
  {
    id: "normalization-oa-6",
    question:
      "Relation R(Student, Subject, Teacher) has candidate keys (Student, Subject) and (Student, Teacher), with the FD Teacher -> Subject (each teacher teaches exactly one subject). Does the FD Teacher -> Subject violate 3NF?",
    options: [
      "Yes, because Teacher is not a superkey",
      "No, because Subject is a prime attribute (part of the candidate key (Student, Subject)), so 3NF's exception applies",
      "Yes, because Subject is not atomic",
      "No, because Teacher determines Student as well",
    ],
    correctAnswerIndex: 1,
    explanation: "3NF only requires that for X -> Y, either X is a superkey OR Y is a prime attribute. Here Teacher is not a superkey, but Subject is prime (part of (Student, Subject)), so the exception saves this from violating 3NF — even though it does violate BCNF.",
    difficulty: "Hard",
    topicTags: ["3NF", "BCNF", "prime attribute"],
  },
  {
    id: "normalization-oa-7",
    question: "Does the relation R(Student, Subject, Teacher) with candidate keys (Student, Subject) and (Student, Teacher), and FD Teacher -> Subject, satisfy BCNF?",
    options: [
      "Yes, it satisfies BCNF",
      "No — Teacher -> Subject violates BCNF since Teacher is not a superkey",
      "Yes, because it already satisfies 3NF",
      "Cannot be determined without more data",
    ],
    correctAnswerIndex: 1,
    explanation: "BCNF requires every determinant of a non-trivial FD to be a superkey with no exceptions. Teacher is not a superkey (it doesn't determine Student), so Teacher -> Subject violates BCNF even though it satisfies 3NF.",
    difficulty: "Hard",
    topicTags: ["BCNF"],
  },
  {
    id: "normalization-oa-8",
    question: "Which of the following violates First Normal Form (1NF)?",
    options: [
      "A Student table where StudentID is the primary key",
      "A Contact table with a column PhoneNumbers storing '9876543210, 9123456780' in a single cell",
      "An Order table with a foreign key CustomerID",
      "A Product table with a CHECK constraint on price",
    ],
    correctAnswerIndex: 1,
    explanation: "Storing multiple phone numbers in a single column violates atomicity, the core requirement of 1NF — each column must hold a single indivisible value.",
    difficulty: "Easy",
    topicTags: ["1NF"],
  },
  {
    id: "normalization-oa-9",
    question: "Why is denormalization sometimes used deliberately in real systems?",
    options: [
      "To eliminate all data redundancy",
      "To reduce the number of JOINs needed for read-heavy queries, trading storage/consistency risk for read performance",
      "Because normalized schemas cannot store NULL values",
      "It is required by the SQL standard for all reporting tables",
    ],
    correctAnswerIndex: 1,
    explanation: "Denormalization intentionally reintroduces redundancy to avoid expensive joins on read-heavy paths (e.g. analytics/reporting), accepting the trade-off of potential update anomalies.",
    difficulty: "Medium",
    topicTags: ["denormalization"],
  },
  {
    id: "normalization-oa-10",
    question: "In the relation StudentCourse(StudentID, CourseID, StudentName, CourseName) with candidate key (StudentID, CourseID), which decomposition correctly resolves the 2NF violation?",
    options: [
      "Leave the table as-is; it is already in 2NF",
      "Student(StudentID, StudentName), Course(CourseID, CourseName), Enrollment(StudentID, CourseID)",
      "Merge everything into one table with a surrogate key",
      "StudentName(StudentID, CourseID, StudentName) only",
    ],
    correctAnswerIndex: 1,
    explanation: "StudentID -> StudentName and CourseID -> CourseName are both partial dependencies on the composite key. Decomposing into Student, Course, and a junction Enrollment table removes both partial dependencies.",
    difficulty: "Medium",
    topicTags: ["2NF", "decomposition"],
  },
  {
    id: "normalization-oa-11",
    question: "A relation is in 2NF but you discover a non-prime attribute that depends on another non-prime attribute (not directly on the key). This is an example of:",
    options: ["A partial dependency, violating 2NF", "A transitive dependency, violating 3NF", "A trivial dependency, which is always allowed", "A multi-valued dependency, violating 4NF"],
    correctAnswerIndex: 1,
    explanation: "A non-prime attribute depending on another non-prime attribute (rather than directly on the candidate key) is the definition of a transitive dependency, which 3NF specifically forbids.",
    difficulty: "Medium",
    topicTags: ["3NF", "transitive dependency"],
  },
  {
    id: "normalization-oa-12",
    question: "Which sequence correctly orders the normal forms from least to most restrictive?",
    options: ["3NF, 2NF, 1NF, BCNF", "1NF, 2NF, 3NF, BCNF", "BCNF, 3NF, 2NF, 1NF", "2NF, 1NF, BCNF, 3NF"],
    correctAnswerIndex: 1,
    explanation: "Each normal form is a stricter subset of the previous: every table in 2NF is in 1NF, every table in 3NF is in 2NF, and every table in BCNF is in 3NF — but not necessarily the reverse.",
    difficulty: "Easy",
    topicTags: ["normal forms", "ordering"],
  },
];
