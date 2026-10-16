// src/content/cs-fundamentals/dbms/interview/erRelationalModel.interview.ts

import type { InterviewQuestion } from "@/types";

const erRelationalModelInterviewQuestions: InterviewQuestion[] = [
  {
    id: "er-relational-model-iv-1",
    question: "What is the difference between the ER model and the relational model?",
    difficulty: "Easy",
    detailedAnswer:
      "The ER model is a conceptual design tool used during the design phase — it represents data as entities (things), attributes (properties), and relationships (associations), usually drawn as a diagram, and is independent of any specific database technology. The relational model is the logical/physical structure that an actual RDBMS implements: data organized into relations (tables), with rows (tuples) and columns (attributes), governed by keys and constraints. The ER diagram is designed first and then systematically mapped into relational tables — the ER model answers 'what does the data look like conceptually,' the relational model answers 'how is it actually stored and queried.'",
    idealAnswer:
      "I think of the ER model as the whiteboard sketch before you write any SQL — entities, attributes, and relationships with cardinalities — and the relational model as the SQL schema that results from mechanically translating that sketch into tables, primary keys, and foreign keys. They're sequential steps in the same design process, not competing alternatives.",
    interviewerExpectations: [
      "Clear separation of conceptual design (ER) vs logical/physical implementation (relational)",
      "Mentions the mapping process connects the two",
      "Doesn't conflate 'entity' with 'table' as if they were the same term",
    ],
    followUpQuestions: [
      "How do you map an M:N relationship to tables?",
      "What is a weak entity, and how does it map differently?",
      "Can two different ER diagrams produce the same relational schema?",
    ],
    commonMistakes: [
      "Treating 'entity' and 'table' as synonyms without acknowledging the mapping step",
      "Being unable to explain what changes structurally when going from diagram to tables",
    ],
    discussionPoints: ["Conceptual vs logical design", "Mapping rules", "Schema design process"],
  },
  {
    id: "er-relational-model-iv-2",
    question: "How would you map a many-to-many relationship into relational tables? Walk through a concrete example.",
    difficulty: "Medium",
    detailedAnswer:
      "Take Student and Course with an M:N 'Enrolls' relationship. You cannot add a foreign key to either Student or Course directly, because a single studentId column on Course (or vice versa) could only reference one row, but a student can enroll in many courses and a course can have many students. The solution is a junction (bridge) table, e.g. Enrollment, containing studentId (FK to Student.id) and courseId (FK to Course.id), with the primary key typically being the composite (studentId, courseId) to prevent duplicate enrollments. Any attributes that belong to the relationship itself — like enrollmentDate or grade — live on this junction table, not on Student or Course.",
    idealAnswer:
      "I'd explain that a foreign key can only point to one row, so it structurally can't express 'many-to-many' by itself. The fix is a junction table — Enrollment(studentId, courseId, enrollmentDate) — where the composite of both foreign keys becomes the primary key, which also naturally enforces that a student can't enroll in the same course twice. This pattern generalizes to any M:N relationship, including self-referential ones like a Friendship table between two Users.",
    interviewerExpectations: [
      "Correctly explains why a direct foreign key can't work for M:N",
      "Describes the junction table with both foreign keys and a composite primary key",
      "Knows relationship attributes belong on the junction table",
    ],
    followUpQuestions: [
      "What would the primary key of the junction table be, and why?",
      "How would you query 'all courses a given student is enrolled in'?",
      "How does this change if the relationship becomes ternary (three entities)?",
    ],
    commonMistakes: [
      "Suggesting a foreign key on one of the original two tables for M:N",
      "Forgetting to place relationship attributes on the junction table",
    ],
    discussionPoints: ["Junction tables", "Composite primary keys", "Relationship attributes"],
  },
  {
    id: "er-relational-model-iv-3",
    question: "What is a weak entity set, and how is its primary key determined after mapping to the relational model?",
    difficulty: "Medium",
    detailedAnswer:
      "A weak entity set is one whose entities cannot be uniquely identified by their own attributes alone — it has at most a partial key, which distinguishes its entities only within the scope of one owner (strong) entity. For example, Dependent (name, relationship) only makes sense in the context of a specific Employee — two different employees could each have a dependent named 'Alex'. When mapped to a table, a weak entity's primary key is the composite of the owner entity's primary key (included as a foreign key) plus its own partial key — so Dependent's table would have (employeeId, dependentName) as its composite primary key, with employeeId as a foreign key to Employee.",
    idealAnswer:
      "The classic example is Dependent under Employee — a dependent's name alone isn't globally unique, but (employeeId, dependentName) is. So the weak entity's table always carries the owner's key as a foreign key, and that foreign key becomes part of its own composite primary key, which also enforces that the weak entity can't exist without its owner (existence dependency), often reinforced with ON DELETE CASCADE.",
    interviewerExpectations: [
      "Correctly distinguishes partial key from full key",
      "Explains the composite primary key formed with the owner's key",
      "Connects this to existence dependency (weak entity can't exist without its owner)",
    ],
    followUpQuestions: [
      "What happens to Dependent rows if the owning Employee is deleted?",
      "Can a weak entity be the owner of another weak entity?",
      "How is this drawn differently in ER notation (double rectangle, double diamond)?",
    ],
    commonMistakes: [
      "Saying a weak entity simply 'has a foreign key' without addressing key composition",
      "Missing the existence-dependency implication for deletes",
    ],
    discussionPoints: ["Partial key vs full key", "Existence dependency", "Composite primary keys"],
  },
  {
    id: "er-relational-model-iv-4",
    question: "What's the difference between cardinality and participation constraints in an ER diagram?",
    difficulty: "Medium",
    detailedAnswer:
      "Cardinality ratio describes the numerical association between entity instances in a relationship — 1:1, 1:N, or M:N — i.e., how many instances of entity B can be linked to one instance of entity A. Participation constraint describes whether every instance of an entity set is required to participate in the relationship at all — total participation (mandatory, every instance must have at least one relationship instance, drawn with a double line) versus partial participation (optional, drawn with a single line). They answer different questions: cardinality answers 'how many,' participation answers 'is it required.' For example, Department–Employee is 1:N cardinality, and if every employee must be assigned a department, Employee has total participation in that relationship.",
    idealAnswer:
      "Cardinality is about the 'how many' — one department has many employees. Participation is about the 'is it mandatory' — must every employee belong to a department, or could an employee exist with no department yet? They're independent axes; you need both to fully specify a relationship, and getting participation wrong is a common source of incorrectly nullable foreign keys in the final schema.",
    interviewerExpectations: [
      "Clearly separates 'how many' (cardinality) from 'is it required' (participation)",
      "Can give a concrete example combining both",
      "Connects participation constraints to nullability of foreign keys in the mapped schema",
    ],
    followUpQuestions: [
      "How would total participation of Employee in 'works for' affect the deptId column's nullability?",
      "Can a relationship have total participation on both sides?",
      "How is min-max (Chen) notation different from crow's foot notation for expressing these?",
    ],
    commonMistakes: [
      "Conflating cardinality and participation as the same concept",
      "Not connecting participation constraints to actual NOT NULL / constraint decisions in the schema",
    ],
    discussionPoints: ["Cardinality ratios", "Total vs partial participation", "Notation styles"],
  },
  {
    id: "er-relational-model-iv-5",
    question: "You're asked to design the schema for a simple ride-sharing app: Riders request rides, Drivers accept them, each ride has a pickup and drop location, and a rider can rate a completed ride. Walk through your ER model and the resulting tables.",
    difficulty: "Hard",
    detailedAnswer:
      "Entities: Rider (riderId, name, phone), Driver (driverId, name, vehicleInfo), Ride (rideId, pickupLocation, dropLocation, requestedAt, status). Relationships: Rider 'requests' Ride is 1:N (one rider can request many rides over time, but each ride has exactly one requesting rider) — so Ride gets a riderId foreign key. Driver 'accepts' Ride is also 1:N (a driver can accept many rides over time, but a given ride has at most one driver) — so Ride gets a nullable driverId foreign key (nullable because a ride may not yet be accepted). Rating is trickier: it's naturally an attribute of the completed Ride from the rider's perspective — since one ride is rated at most once by the one rider on it, I'd add rating and ratingComment as nullable columns directly on Ride rather than creating a separate table, since there's no M:N or independent lifecycle here. If ratings needed richer behavior (edit history, driver-rates-rider too), I'd split it into a separate Rating table with rideId as a foreign key instead.",
    idealAnswer:
      "I'd start with three core entities — Rider, Driver, Ride — and reason about cardinality one relationship at a time instead of guessing. Rider-to-Ride and Driver-to-Ride are both 1:N from the parent's side, so both riderId and driverId live as foreign keys on the Ride table, with driverId nullable to represent a ride that hasn't been accepted yet. For the rating, since it's a single value tied 1:1 to a completed ride, I'd keep it as columns on Ride rather than over-normalizing into a separate table, but I'd call out that this decision would flip if the product later needs bidirectional ratings or multiple rating events per ride — that's exactly the kind of requirement that would force a redesign, so I'd confirm it with the interviewer before locking it in.",
    interviewerExpectations: [
      "Identifies entities and correctly reasons about each relationship's cardinality independently",
      "Places foreign keys on the correct ('many') side with correct nullability reasoning",
      "Shows judgment about when to add a separate table vs. keep an attribute inline, and flags the decision as requirements-dependent",
    ],
    followUpQuestions: [
      "How would the schema change if a driver could also rate the rider?",
      "How would you handle a ride being reassigned to a different driver mid-trip?",
      "How would you index this schema to make 'find all completed rides for a rider' fast?",
    ],
    commonMistakes: [
      "Making driverId non-nullable on Ride when a ride can legitimately exist before being accepted",
      "Jumping straight to a separate Rating table without justifying why given the stated requirements",
      "Forgetting to reason about cardinality per relationship and instead applying one pattern to everything",
    ],
    discussionPoints: ["Foreign key placement and nullability", "Over-normalization judgment calls", "Schema evolution under changing requirements"],
    scenarioBased: true,
  },
];

export default erRelationalModelInterviewQuestions;
