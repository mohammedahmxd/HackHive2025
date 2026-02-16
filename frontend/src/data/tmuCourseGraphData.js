// Toronto Metropolitan University - Computer Science Course Graph Data
// Based on the official 2025-2026 program requirements

import { CourseStatus, CourseCategory } from './courseGraphData';

// All courses in the TMU CS program
export const tmuCSCourses = [
  // ========== YEAR 1 ==========
  {
    id: 'CPS109',
    code: 'CPS 109',
    name: 'Computer Science I',
    credits: 1,
    year: 1,
    semester: 1,
    category: CourseCategory.CORE_CS,
    prerequisites: [],
    description: 'Introductory programming: abstraction, modelling, algorithm design'
  },
  {
    id: 'CPS106',
    code: 'CPS 106',
    name: 'Introduction to Multimedia Computation',
    credits: 1,
    year: 1,
    semester: 1,
    category: CourseCategory.CORE_CS,
    prerequisites: [],
    description: 'Computing and programming using Python with multimedia problems',
    isAlternative: true,
    alternativeGroup: 'intro_cs'
  },
  {
    id: 'MTH110',
    code: 'MTH 110',
    name: 'Discrete Mathematics I',
    credits: 1,
    year: 1,
    semester: 1,
    category: CourseCategory.MATH,
    prerequisites: [],
    description: 'Propositional/predicate logic, set theory, relations, functions, proofs'
  },
  {
    id: 'MTH108',
    code: 'MTH 108',
    name: 'Linear Algebra',
    credits: 1,
    year: 1,
    semester: 1,
    category: CourseCategory.MATH,
    prerequisites: [],
    description: 'Systems of linear equations, matrices, determinants, vectors, eigenvalues'
  },
  {
    id: 'MTH207',
    code: 'MTH 207',
    name: 'Calculus and Computational Methods I',
    credits: 1,
    year: 1,
    semester: 2,
    category: CourseCategory.MATH,
    prerequisites: [],
    description: 'Calculus of one variable: derivatives, differentiation, integration'
  },
  {
    id: 'PCS110',
    code: 'PCS 110',
    name: 'Physics',
    credits: 1,
    year: 1,
    semester: 2,
    category: CourseCategory.PHYSICS,
    prerequisites: [],
    description: 'Vectors, motion, Newton\'s laws, electrostatics, DC circuits, magnetic fields'
  },
  {
    id: 'BLG143',
    code: 'BLG 143',
    name: 'Biology I',
    credits: 1,
    year: 1,
    semester: 1,
    category: CourseCategory.ELECTIVE_GENERAL,
    prerequisites: [],
    description: 'Cellular and molecular mechanisms: macromolecules, enzymes, genetics',
    electiveGroup: 'science'
  },
  {
    id: 'CHY103',
    code: 'CHY 103',
    name: 'General Chemistry I',
    credits: 1,
    year: 1,
    semester: 2,
    category: CourseCategory.ELECTIVE_GENERAL,
    prerequisites: [],
    description: 'Compounds, reactions, stoichiometry, equilibrium, acids/bases',
    electiveGroup: 'science'
  },

  // ========== YEAR 2 ==========
  {
    id: 'CPS209',
    code: 'CPS 209',
    name: 'Computer Science II',
    credits: 1,
    year: 2,
    semester: 3,
    category: CourseCategory.CORE_CS,
    prerequisites: ['CPS109'],
    description: 'Code structure, algorithm development, OO design principles'
  },
  {
    id: 'CPS213',
    code: 'CPS 213',
    name: 'Computer Organization I',
    credits: 1,
    year: 2,
    semester: 3,
    category: CourseCategory.CORE_CS,
    prerequisites: [],
    description: 'Digital system design: binary numbers, Boolean algebra, logic gates'
  },
  {
    id: 'CPS305',
    code: 'CPS 305',
    name: 'Data Structures',
    credits: 1,
    year: 2,
    semester: 4,
    category: CourseCategory.CORE_CS,
    prerequisites: ['CPS209'],
    description: 'Stacks, queues, lists, trees, graphs, searching, sorting, hashing'
  },
  {
    id: 'CPS310',
    code: 'CPS 310',
    name: 'Computer Organization II',
    credits: 1,
    year: 2,
    semester: 4,
    category: CourseCategory.CORE_CS,
    prerequisites: ['CPS213'],
    description: 'Memory, CPU architecture, instruction sets, assembler, I/O, RISC/CISC'
  },
  {
    id: 'CPS412',
    code: 'CPS 412',
    name: 'Social Issues, Ethics and Professionalism',
    credits: 1,
    year: 2,
    semester: 4,
    category: CourseCategory.CORE_CS,
    prerequisites: [],
    description: 'Social, legal, and ethical issues in computing: privacy, IP, professional ethics'
  },
  {
    id: 'CMN300',
    code: 'CMN 300',
    name: 'Communication in the Computer Industry',
    credits: 1,
    year: 2,
    semester: 3,
    category: CourseCategory.ELECTIVE_COMM,
    prerequisites: [],
    description: 'Technical communication for audiences with varying technical knowledge'
  },

  // ========== YEAR 3 ==========
  {
    id: 'CPS393',
    code: 'CPS 393',
    name: 'Introduction to UNIX, C and C++',
    credits: 1,
    year: 3,
    semester: 5,
    category: CourseCategory.CORE_CS,
    prerequisites: ['CPS209'],
    description: 'UNIX operating system, C and C++ programming languages'
  },
  {
    id: 'CPS406',
    code: 'CPS 406',
    name: 'Introduction to Software Engineering',
    credits: 1,
    year: 3,
    semester: 5,
    category: CourseCategory.CORE_CS,
    prerequisites: ['CPS209'],
    description: 'OO software engineering: requirements, modeling, design, testing, UML'
  },
  {
    id: 'CPS420',
    code: 'CPS 420',
    name: 'Discrete Structures',
    credits: 1,
    year: 3,
    semester: 5,
    category: CourseCategory.CORE_CS,
    prerequisites: ['CPS305', 'MTH110'],
    description: 'Proof techniques, induction, graphs, trees, finite automata, counting'
  },
  {
    id: 'CPS506',
    code: 'CPS 506',
    name: 'Comparative Programming Languages',
    credits: 1,
    year: 3,
    semester: 5,
    category: CourseCategory.CORE_CS,
    prerequisites: ['CPS209'],
    description: 'Major programming paradigms with emphasis on functional programming'
  },
  {
    id: 'CPS510',
    code: 'CPS 510',
    name: 'Database Systems I',
    credits: 1,
    year: 3,
    semester: 6,
    category: CourseCategory.CORE_CS,
    prerequisites: ['CPS305'],
    description: 'Database organization, design, and relational DBMS'
  },
  {
    id: 'CPS590',
    code: 'CPS 590',
    name: 'Operating Systems I',
    credits: 1,
    year: 3,
    semester: 6,
    category: CourseCategory.CORE_CS,
    prerequisites: ['CPS305', 'CPS393'],
    description: 'System calls, processes, synchronization, memory management, file systems'
  },
  {
    id: 'MTH380',
    code: 'MTH 380',
    name: 'Probability and Statistics I',
    credits: 1,
    year: 3,
    semester: 5,
    category: CourseCategory.STATISTICS,
    prerequisites: ['MTH207'],
    description: 'Descriptive statistics, probability laws, discrete/continuous distributions'
  },

  // ========== YEAR 4 - Core ==========
  {
    id: 'CPS616',
    code: 'CPS 616',
    name: 'Algorithms',
    credits: 1,
    year: 4,
    semester: 7,
    category: CourseCategory.CORE_CS,
    prerequisites: ['CPS305', 'CPS420'],
    description: 'Complexity analysis, divide-and-conquer, greedy, dynamic programming, NP-completeness'
  },
  {
    id: 'CPS706',
    code: 'CPS 706',
    name: 'Computer Networks I',
    credits: 1,
    year: 4,
    semester: 7,
    category: CourseCategory.CORE_CS,
    prerequisites: ['CPS590'],
    description: 'Internet architecture, TCP/IP, routing algorithms, LANs'
  },

  // ========== YEAR 4 - CS Electives ==========
  {
    id: 'CPS633',
    code: 'CPS 633',
    name: 'Computer Security',
    credits: 1,
    year: 4,
    semester: 7,
    category: CourseCategory.ELECTIVE_CS,
    prerequisites: ['CPS393'],
    electiveGroup: 1,
    description: 'Security policies, access control, authentication, encryption, firewalls'
  },
  {
    id: 'CPS721',
    code: 'CPS 721',
    name: 'Artificial Intelligence I',
    credits: 1,
    year: 4,
    semester: 7,
    category: CourseCategory.ELECTIVE_CS,
    prerequisites: ['CPS305', 'CPS420', 'MTH380'],
    electiveGroup: 1,
    description: 'Knowledge representation, search, NLP, planning, belief networks, learning'
  },
  {
    id: 'CPS610',
    code: 'CPS 610',
    name: 'Database Systems II',
    credits: 1,
    year: 4,
    semester: 7,
    category: CourseCategory.ELECTIVE_CS,
    prerequisites: ['CPS510'],
    electiveGroup: 1,
    description: 'Embedded DB languages, transactions, distributed DBs, NOSQL, concurrency'
  },
  {
    id: 'CPS613',
    code: 'CPS 613',
    name: 'Human-Computer Interaction',
    credits: 1,
    year: 4,
    semester: 7,
    category: CourseCategory.ELECTIVE_CS,
    prerequisites: ['CPS209'],
    electiveGroup: 2,
    description: 'HCI concepts, usability testing, UI paradigms, GUI development'
  },
  {
    id: 'CPS707',
    code: 'CPS 707',
    name: 'Software Verification and Validation',
    credits: 1,
    year: 4,
    semester: 8,
    category: CourseCategory.ELECTIVE_CS,
    prerequisites: ['CPS406', 'CPS420', 'MTH380'],
    electiveGroup: 2,
    description: 'Statistical/functional testing, test data analysis, static/dynamic analysis'
  },
  {
    id: 'CPS714',
    code: 'CPS 714',
    name: 'Software Project Management',
    credits: 1,
    year: 4,
    semester: 8,
    category: CourseCategory.ELECTIVE_CS,
    prerequisites: ['CPS406'],
    electiveGroup: 2,
    description: 'Managing large complex software projects with industry-standard techniques'
  },
  {
    id: 'CPS731',
    code: 'CPS 731',
    name: 'Software Engineering I',
    credits: 1,
    year: 4,
    semester: 7,
    category: CourseCategory.ELECTIVE_CS,
    prerequisites: ['CPS406'],
    electiveGroup: 2,
    description: 'Life cycles, process modelling, configuration management, quality, CASE tools'
  },
  {
    id: 'CPS831',
    code: 'CPS 831',
    name: 'Software Engineering II',
    credits: 1,
    year: 4,
    semester: 8,
    category: CourseCategory.ELECTIVE_CS,
    prerequisites: ['CPS731'],
    electiveGroup: 2,
    description: 'Formal specification, fault-tolerance, reliability, metrics, standards'
  },
  {
    id: 'CPS845',
    code: 'CPS 845',
    name: 'Extreme Programming and Agile Processes',
    credits: 1,
    year: 4,
    semester: 8,
    category: CourseCategory.ELECTIVE_CS,
    prerequisites: ['CPS406'],
    electiveGroup: 2,
    description: 'XP development methodology, rules, practices, and agile methods'
  },
  {
    id: 'CPS847',
    code: 'CPS 847',
    name: 'Software Tools for Startups',
    credits: 1,
    year: 4,
    semester: 7,
    category: CourseCategory.ELECTIVE_CS,
    prerequisites: ['CPS209'],
    electiveGroup: 3,
    description: 'Git, Docker, databases, middleware, front-end libraries for startups'
  },
  {
    id: 'CPS853',
    code: 'CPS 853',
    name: 'Creating Big Data Systems',
    credits: 1,
    year: 4,
    semester: 8,
    category: CourseCategory.ELECTIVE_CS,
    prerequisites: ['CPS406', 'CPS420', 'CPS510'],
    electiveGroup: 1,
    description: 'Building Big Data analytic and transactional systems at large scale'
  },
  {
    id: 'CPS865',
    code: 'CPS 865',
    name: 'Model-Driven Software Engineering',
    credits: 1,
    year: 4,
    semester: 8,
    category: CourseCategory.ELECTIVE_CS,
    prerequisites: ['CPS406'],
    electiveGroup: 2,
    description: 'MDSE foundations: models, transformations, MDA, domain-specific modeling'
  },

  // ========== LIBERAL STUDIES / OPEN ELECTIVES ==========
  {
    id: 'PCS111',
    code: 'PCS 111',
    name: 'Physics in the News',
    credits: 1,
    year: 2,
    semester: 3,
    category: CourseCategory.ELECTIVE_GENERAL,
    prerequisites: [],
    electiveGroup: 'liberal',
    description: 'Scientific topics: energy, climate, space travel, high-tech devices'
  },
  {
    id: 'CPS650',
    code: 'CPS 650',
    name: 'Computational Thinking in Our World',
    credits: 1,
    year: 3,
    semester: 5,
    category: CourseCategory.ELECTIVE_GENERAL,
    prerequisites: [],
    electiveGroup: 'liberal',
    description: 'Why computers and computation are ubiquitous in modern society'
  },
  {
    id: 'ELE900',
    code: 'ELE 900',
    name: 'AI: Sociotechnical Perspective',
    credits: 1,
    year: 3,
    semester: 6,
    category: CourseCategory.ELECTIVE_GENERAL,
    prerequisites: [],
    electiveGroup: 'liberal',
    description: 'Critical introduction to AI and its real-world applications'
  },
  {
    id: 'GEO609',
    code: 'GEO 609',
    name: 'Cyberspace and Geography',
    credits: 1,
    year: 3,
    semester: 6,
    category: CourseCategory.ELECTIVE_GENERAL,
    prerequisites: [],
    electiveGroup: 'liberal',
    description: 'Global communication systems and WWW impacts on socio-economic relationships'
  },
  {
    id: 'MTH511',
    code: 'MTH 511',
    name: 'Limitations of Measurement',
    credits: 1,
    year: 2,
    semester: 4,
    category: CourseCategory.ELECTIVE_GENERAL,
    prerequisites: [],
    electiveGroup: 'liberal',
    description: 'Measurement error, reliability, and limitations in science and commerce'
  },
  {
    id: 'MTH599',
    code: 'MTH 599',
    name: 'Foundations of Mathematical Thought',
    credits: 1,
    year: 3,
    semester: 6,
    category: CourseCategory.ELECTIVE_GENERAL,
    prerequisites: [],
    electiveGroup: 'liberal',
    description: 'The nature of mathematical thought, certainty, and foundations'
  },

  // ========== PROFESSIONAL ELECTIVES ==========
  {
    id: 'ITM330',
    code: 'ITM 330',
    name: 'Supply Chain Process Architecture',
    credits: 1,
    year: 4,
    semester: 7,
    category: CourseCategory.ELECTIVE_BUSINESS,
    prerequisites: [],
    electiveGroup: 'professional',
    description: 'Enterprise-wide integrated systems and process thinking'
  },
  {
    id: 'ITM350',
    code: 'ITM 350',
    name: 'Concepts of e-Business',
    credits: 1,
    year: 4,
    semester: 7,
    category: CourseCategory.ELECTIVE_BUSINESS,
    prerequisites: [],
    electiveGroup: 'professional',
    description: 'Concepts, technology, and applications of electronic business'
  },
  {
    id: 'ITM410',
    code: 'ITM 410',
    name: 'Business Process Design',
    credits: 1,
    year: 4,
    semester: 8,
    category: CourseCategory.ELECTIVE_BUSINESS,
    prerequisites: [],
    electiveGroup: 'professional',
    description: 'Principles of business process design for performance improvement'
  },
  {
    id: 'ITM735',
    code: 'ITM 735',
    name: 'ICT and Diversity Management',
    credits: 1,
    year: 4,
    semester: 8,
    category: CourseCategory.ELECTIVE_BUSINESS,
    prerequisites: [],
    electiveGroup: 'professional',
    description: 'Equity, diversity, and inclusion principles with ICT'
  },

  // ========== CO-OP / RESEARCH ==========
  {
    id: 'SCI999',
    code: 'SCI 999',
    name: 'Research Practicum',
    credits: 0,
    year: 3,
    semester: 5,
    category: CourseCategory.ELECTIVE_GENERAL,
    prerequisites: [],
    electiveGroup: 'coop',
    description: 'Non-credit research practicum with a faculty team'
  }
];

// Mock student progress for TMU CS
export const tmuMockStudentProgress = {
  studentId: 'STU002',
  studentName: 'Jordan Lee',
  program: 'Computer Science',
  university: 'Toronto Metropolitan University',
  currentYear: 3,
  currentSemester: 5,

  completedCourses: [
    'CPS109', 'CPS213', 'MTH110', 'MTH108', 'BLG143',
    'MTH207', 'PCS110', 'CHY103',
    'CPS209', 'CPS305', 'CPS310', 'CPS412', 'CMN300',
    'PCS111', 'MTH511'
  ],

  inProgressCourses: [
    'CPS393', 'CPS406', 'CPS420', 'MTH380'
  ],

  recommendedCourses: [
    'CPS506', 'CPS510', 'CPS590', 'CPS650'
  ]
};

// Tab definitions for TMU CS course graph
export const tmuCourseSets = {
  all: {
    label: 'All Courses',
    ids: [
      // Year 1
      'CPS109', 'MTH110', 'MTH108', 'BLG143',
      'MTH207', 'PCS110', 'CHY103',
      // Year 2
      'CPS209', 'CPS213', 'CPS305', 'CPS310', 'CPS412', 'CMN300',
      'PCS111', 'MTH511',
      // Year 3
      'CPS393', 'CPS406', 'CPS420', 'CPS506', 'CPS510', 'CPS590', 'MTH380',
      'CPS650', 'ELE900', 'GEO609', 'MTH599',
      // Year 4
      'CPS616', 'CPS706', 'CPS633', 'CPS721',
      'CPS610', 'CPS613', 'CPS731', 'CPS847',
      'ITM330', 'ITM350'
    ]
  },
  aiData: {
    label: 'AI & Data',
    ids: [
      'CPS109', 'CPS209', 'CPS305', 'MTH110', 'CPS420', 'MTH380',
      'CPS510', 'CPS616', 'CPS721', 'CPS610', 'CPS853'
    ]
  },
  softwareEng: {
    label: 'Software Engineering',
    ids: [
      'CPS109', 'CPS209', 'CPS305', 'CPS406',
      'CPS731', 'CPS831', 'CPS845', 'CPS865', 'CPS707', 'CPS714'
    ]
  },
  systems: {
    label: 'Systems & Networks',
    ids: [
      'CPS109', 'CPS209', 'CPS213', 'CPS310', 'CPS305', 'CPS393',
      'CPS590', 'CPS706', 'CPS633'
    ]
  },
  theory: {
    label: 'Theory & Math',
    ids: [
      'MTH110', 'MTH108', 'MTH207', 'MTH380',
      'CPS305', 'CPS420', 'CPS616', 'CPS506'
    ]
  },
  webHCI: {
    label: 'Web & HCI',
    ids: [
      'CPS109', 'CPS209', 'CPS406', 'CPS506',
      'CPS613', 'CPS847'
    ]
  }
};

// Elective group descriptions for TMU CS
export const tmuElectiveGroups = {
  1: {
    name: 'AI, Data & Security',
    description: 'Choose from: AI, Computer Security, Database Systems II, Big Data',
    required: 2
  },
  2: {
    name: 'Software Engineering',
    description: 'Choose from: SE I/II, V&V, Project Management, Agile, MDSE',
    required: 2
  },
  3: {
    name: 'Tools & Applied',
    description: 'Choose from: Startup Tools, HCI',
    required: 1
  },
  'liberal': {
    name: 'Liberal Studies',
    description: 'Two lower-level and two upper-level liberal studies courses',
    required: 4
  },
  'professional': {
    name: 'Professional Elective',
    description: 'Choose from ITM courses',
    required: 1
  },
  'science': {
    name: 'Science Elective',
    description: 'Choose from Biology, Chemistry, or other science courses',
    required: 1
  }
};
