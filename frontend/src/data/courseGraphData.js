// Ontario Tech University - Computer Science Course Graph Data
// Based on the official program requirements

// Course status types
export const CourseStatus = {
  COMPLETED: 'completed',
  IN_PROGRESS: 'in_progress',
  NOT_TAKEN: 'not_taken',
  RECOMMENDED: 'recommended'
};

// Course categories for grouping
export const CourseCategory = {
  CORE_CS: 'Core Computer Science',
  MATH: 'Mathematics',
  PHYSICS: 'Physics',
  STATISTICS: 'Statistics',
  ELECTIVE_CS: 'CS Elective',
  ELECTIVE_BUSINESS: 'Business Elective',
  ELECTIVE_COMM: 'Communication Elective',
  ELECTIVE_GENERAL: 'General Elective',
  ELECTIVE_GROUP: 'Elective Group'
};

// All courses in the Ontario Tech CS program
export const ontarioTechCSCourses = [
  // ========== YEAR 1 ==========
  // Math Prerequisites
  {
    id: 'MATH1000U',
    code: 'MATH 1000U',
    name: 'Introductory Calculus',
    credits: 3,
    year: 1,
    semester: 1,
    category: CourseCategory.MATH,
    prerequisites: [],
    description: 'For students without Calculus and Vectors (MCV4U)',
    isAlternative: true,
    alternativeGroup: 'calc1'
  },
  {
    id: 'MATH1010U',
    code: 'MATH 1010U',
    name: 'Calculus I',
    credits: 3,
    year: 1,
    semester: 1,
    category: CourseCategory.MATH,
    prerequisites: [],
    description: 'For students with Grade 12 MHF4U and MCV4U',
    isAlternative: true,
    alternativeGroup: 'calc1'
  },
  {
    id: 'MATH1020U',
    code: 'MATH 1020U',
    name: 'Calculus II',
    credits: 3,
    year: 1,
    semester: 2,
    category: CourseCategory.MATH,
    prerequisites: ['MATH1010U'],
    alternativePrerequisites: ['MATH1000U'],
    description: 'Continuation of calculus concepts'
  },

  // Physics Prerequisites
  {
    id: 'PHY1030U',
    code: 'PHY 1030U',
    name: 'Introductory Physics',
    credits: 3,
    year: 1,
    semester: 1,
    category: CourseCategory.PHYSICS,
    prerequisites: [],
    description: 'For students without Physics SPH4U',
    isAlternative: true,
    alternativeGroup: 'phys1'
  },
  {
    id: 'PHY1010U',
    code: 'PHY 1010U',
    name: 'Physics I',
    credits: 3,
    year: 1,
    semester: 1,
    category: CourseCategory.PHYSICS,
    prerequisites: [],
    description: 'For students with Grade 12 physics',
    isAlternative: true,
    alternativeGroup: 'phys1'
  },
  {
    id: 'PHY1020U',
    code: 'PHY 1020U',
    name: 'Physics II',
    credits: 3,
    year: 1,
    semester: 2,
    category: CourseCategory.PHYSICS,
    prerequisites: ['PHY1010U'],
    alternativePrerequisites: ['PHY1030U'],
    description: 'Continuation of physics concepts'
  },

  // Core CS - Year 1
  {
    id: 'CSCI1030U',
    code: 'CSCI 1030U',
    name: 'Introduction to Computer Science',
    credits: 3,
    year: 1,
    semester: 1,
    category: CourseCategory.CORE_CS,
    prerequisites: [],
    description: 'Fundamental concepts of computer science'
  },
  {
    id: 'CSCI1060U',
    code: 'CSCI 1060U',
    name: 'Programming Workshop I',
    credits: 3,
    year: 1,
    semester: 1,
    category: CourseCategory.CORE_CS,
    prerequisites: [],
    description: 'Introduction to programming concepts and practices'
  },
  {
    id: 'CSCI1061U',
    code: 'CSCI 1061U',
    name: 'Programming Workshop II',
    credits: 3,
    year: 1,
    semester: 2,
    category: CourseCategory.CORE_CS,
    prerequisites: ['CSCI1060U'],
    description: 'Advanced programming concepts'
  },
  {
    id: 'CSCI2050U',
    code: 'CSCI 2050U',
    name: 'Computer Architecture I',
    credits: 3,
    year: 1,
    semester: 2,
    category: CourseCategory.CORE_CS,
    prerequisites: ['CSCI1030U'],
    description: 'Computer organization and architecture fundamentals'
  },

  // ========== YEAR 2 ==========
  {
    id: 'CSCI2000U',
    code: 'CSCI 2000U',
    name: 'Scientific Data Analysis',
    credits: 3,
    year: 2,
    semester: 3,
    category: CourseCategory.CORE_CS,
    prerequisites: ['CSCI1061U'],
    description: 'Data analysis techniques for scientific computing'
  },
  {
    id: 'CSCI2010U',
    code: 'CSCI 2010U',
    name: 'Data Structures',
    credits: 3,
    year: 2,
    semester: 3,
    category: CourseCategory.CORE_CS,
    prerequisites: ['CSCI1061U'],
    description: 'Fundamental data structures and their applications'
  },
  {
    id: 'CSCI2020U',
    code: 'CSCI 2020U',
    name: 'Software Systems Development and Integration',
    credits: 3,
    year: 2,
    semester: 3,
    category: CourseCategory.CORE_CS,
    prerequisites: ['CSCI1061U'],
    description: 'Software development methodologies and integration'
  },
  {
    id: 'CSCI2040U',
    code: 'CSCI 2040U',
    name: 'Software Design and Analysis',
    credits: 3,
    year: 2,
    semester: 4,
    category: CourseCategory.CORE_CS,
    prerequisites: ['CSCI2010U'],
    description: 'Software design principles and analysis techniques'
  },
  {
    id: 'CSCI2072U',
    code: 'CSCI 2072U',
    name: 'Computational Science I',
    credits: 3,
    year: 2,
    semester: 4,
    category: CourseCategory.CORE_CS,
    prerequisites: ['CSCI1061U', 'MATH1020U'],
    description: 'Numerical methods and computational techniques'
  },
  {
    id: 'CSCI2110U',
    code: 'CSCI 2110U',
    name: 'Discrete Mathematics for Computer Scientists',
    credits: 3,
    year: 2,
    semester: 3,
    category: CourseCategory.MATH,
    prerequisites: ['CSCI1030U'],
    description: 'Mathematical foundations for computer science'
  },
  {
    id: 'MATH2050U',
    code: 'MATH 2050U',
    name: 'Linear Algebra',
    credits: 3,
    year: 2,
    semester: 3,
    category: CourseCategory.MATH,
    prerequisites: ['MATH1020U'],
    description: 'Linear algebra concepts and applications'
  },
  {
    id: 'STAT2010U',
    code: 'STAT 2010U',
    name: 'Statistics and Probability for Physical Science',
    credits: 3,
    year: 2,
    semester: 4,
    category: CourseCategory.STATISTICS,
    prerequisites: ['MATH1020U'],
    description: 'Statistical methods for scientific applications'
  },

  // ========== YEAR 3 & 4 CORE ==========
  {
    id: 'CSCI3070U',
    code: 'CSCI 3070U',
    name: 'Analysis and Design of Algorithms',
    credits: 3,
    year: 3,
    semester: 5,
    category: CourseCategory.CORE_CS,
    prerequisites: ['CSCI2010U', 'CSCI2110U'],
    description: 'Algorithm analysis, design techniques, and complexity'
  },
  {
    id: 'CSCI4040U',
    code: 'CSCI 4040U',
    name: 'Ethics, Law and the Social Impacts of Computing',
    credits: 3,
    year: 4,
    semester: 7,
    category: CourseCategory.CORE_CS,
    prerequisites: [],
    description: 'Ethical and legal considerations in computing'
  },

  // ========== ELECTIVE GROUP 1: AI/ML/Data ==========
  {
    id: 'CSCI3010U',
    code: 'CSCI 3010U',
    name: 'Simulation and Modelling',
    credits: 3,
    year: 3,
    semester: 5,
    category: CourseCategory.ELECTIVE_CS,
    prerequisites: ['CSCI2010U', 'STAT2010U'],
    electiveGroup: 1,
    description: 'Computer simulation and modeling techniques'
  },
  {
    id: 'CSCI3030U',
    code: 'CSCI 3030U',
    name: 'Database Systems and Concepts',
    credits: 3,
    year: 3,
    semester: 5,
    category: CourseCategory.ELECTIVE_CS,
    prerequisites: ['CSCI2010U'],
    electiveGroup: 1,
    description: 'Database design, implementation, and management'
  },
  {
    id: 'CSCI4030U',
    code: 'CSCI 4030U',
    name: 'Big Data Analytics',
    credits: 3,
    year: 4,
    semester: 7,
    category: CourseCategory.ELECTIVE_CS,
    prerequisites: ['CSCI3030U'],
    electiveGroup: 1,
    description: 'Large-scale data processing and analytics'
  },
  {
    id: 'CSCI4050U',
    code: 'CSCI 4050U',
    name: 'Machine Learning, Theory and Application',
    credits: 3,
    year: 4,
    semester: 7,
    category: CourseCategory.ELECTIVE_CS,
    prerequisites: ['CSCI3070U', 'STAT2010U', 'MATH2050U'],
    electiveGroup: 1,
    description: 'Machine learning algorithms and applications'
  },
  {
    id: 'CSCI4610U',
    code: 'CSCI 4610U',
    name: 'Artificial Intelligence',
    credits: 3,
    year: 4,
    semester: 7,
    category: CourseCategory.ELECTIVE_CS,
    prerequisites: ['CSCI3070U'],
    electiveGroup: 1,
    description: 'Fundamentals of artificial intelligence'
  },

  // ========== ELECTIVE GROUP 2: Graphics/Vision ==========
  {
    id: 'CSCI3090U',
    code: 'CSCI 3090U',
    name: 'Computer Graphics and Visualization',
    credits: 3,
    year: 3,
    semester: 5,
    category: CourseCategory.ELECTIVE_CS,
    prerequisites: ['CSCI2010U', 'MATH2050U'],
    electiveGroup: 2,
    description: 'Computer graphics fundamentals and visualization'
  },
  {
    id: 'CSCI4110U',
    code: 'CSCI 4110U',
    name: 'Advanced Computer Graphics',
    credits: 3,
    year: 4,
    semester: 7,
    category: CourseCategory.ELECTIVE_CS,
    prerequisites: ['CSCI3090U'],
    electiveGroup: 2,
    description: 'Advanced graphics techniques and rendering'
  },
  {
    id: 'CSCI4210U',
    code: 'CSCI 4210U',
    name: 'Information Visualization',
    credits: 3,
    year: 4,
    semester: 7,
    category: CourseCategory.ELECTIVE_CS,
    prerequisites: ['CSCI3090U'],
    electiveGroup: 2,
    description: 'Visualizing complex information and data'
  },
  {
    id: 'CSCI4220U',
    code: 'CSCI 4220U',
    name: 'Computer Vision',
    credits: 3,
    year: 4,
    semester: 7,
    category: CourseCategory.ELECTIVE_CS,
    prerequisites: ['CSCI3070U', 'MATH2050U'],
    electiveGroup: 2,
    description: 'Image processing and computer vision'
  },

  // ========== ELECTIVE GROUP 3: Web/Mobile/HCI ==========
  {
    id: 'CSCI3230U',
    code: 'CSCI 3230U',
    name: 'Web Application Development',
    credits: 3,
    year: 3,
    semester: 5,
    category: CourseCategory.ELECTIVE_CS,
    prerequisites: ['CSCI2020U'],
    electiveGroup: 3,
    description: 'Modern web application development'
  },
  {
    id: 'CSCI4100U',
    code: 'CSCI 4100U',
    name: 'Mobile Devices',
    credits: 3,
    year: 4,
    semester: 7,
    category: CourseCategory.ELECTIVE_CS,
    prerequisites: ['CSCI2040U'],
    electiveGroup: 3,
    description: 'Mobile application development'
  },
  {
    id: 'CSCI4160U',
    code: 'CSCI 4160U',
    name: 'Interactive Media',
    credits: 3,
    year: 4,
    semester: 7,
    category: CourseCategory.ELECTIVE_CS,
    prerequisites: ['CSCI2040U'],
    electiveGroup: 3,
    description: 'Interactive media design and development'
  },
  {
    id: 'CSCI4620U',
    code: 'CSCI 4620U',
    name: 'Human-Computer Interaction',
    credits: 3,
    year: 4,
    semester: 7,
    category: CourseCategory.ELECTIVE_CS,
    prerequisites: ['CSCI2040U'],
    electiveGroup: 3,
    description: 'HCI principles and user interface design'
  },

  // ========== ELECTIVE GROUP 4: Languages/Software Engineering ==========
  {
    id: 'CSCI3055U',
    code: 'CSCI 3055U',
    name: 'Programming Languages',
    credits: 3,
    year: 3,
    semester: 5,
    category: CourseCategory.ELECTIVE_CS,
    prerequisites: ['CSCI2010U'],
    electiveGroup: 4,
    description: 'Programming language paradigms and concepts'
  },
  {
    id: 'CSCI3060U',
    code: 'CSCI 3060U',
    name: 'Software Quality Assurance',
    credits: 3,
    year: 3,
    semester: 5,
    category: CourseCategory.ELECTIVE_CS,
    prerequisites: ['CSCI2040U'],
    electiveGroup: 4,
    description: 'Software testing and quality assurance'
  },
  {
    id: 'CSCI4020U',
    code: 'CSCI 4020U',
    name: 'Compilers',
    credits: 3,
    year: 4,
    semester: 7,
    category: CourseCategory.ELECTIVE_CS,
    prerequisites: ['CSCI3055U'],
    electiveGroup: 4,
    description: 'Compiler design and implementation'
  },
  {
    id: 'CSCI4060U',
    code: 'CSCI 4060U',
    name: 'Massively Parallel Programming',
    credits: 3,
    year: 4,
    semester: 7,
    category: CourseCategory.ELECTIVE_CS,
    prerequisites: ['CSCI3070U'],
    electiveGroup: 4,
    description: 'Parallel computing and GPU programming'
  },

  // ========== ELECTIVE GROUP 5: Systems/Networks ==========
  {
    id: 'CSCI3020U',
    code: 'CSCI 3020U',
    name: 'Operating Systems',
    credits: 3,
    year: 3,
    semester: 5,
    category: CourseCategory.ELECTIVE_CS,
    prerequisites: ['CSCI2050U', 'CSCI2010U'],
    electiveGroup: 5,
    description: 'Operating system concepts and design'
  },
  {
    id: 'CSCI3150U',
    code: 'CSCI 3150U',
    name: 'Computer Networks',
    credits: 3,
    year: 3,
    semester: 5,
    category: CourseCategory.ELECTIVE_CS,
    prerequisites: ['CSCI2050U'],
    electiveGroup: 5,
    description: 'Network protocols and architecture'
  },
  {
    id: 'CSCI3310U',
    code: 'CSCI 3310U',
    name: 'Systems Programming',
    credits: 3,
    year: 3,
    semester: 6,
    category: CourseCategory.ELECTIVE_CS,
    prerequisites: ['CSCI3020U'],
    electiveGroup: 5,
    description: 'Low-level systems programming'
  },
  {
    id: 'CSCI4310U',
    code: 'CSCI 4310U',
    name: 'Advanced Operating Systems Project',
    credits: 3,
    year: 4,
    semester: 7,
    category: CourseCategory.ELECTIVE_CS,
    prerequisites: ['CSCI3020U'],
    electiveGroup: 5,
    description: 'Advanced OS concepts with project component'
  },

  // ========== THESIS OPTIONS ==========
  {
    id: 'CSCI4410U',
    code: 'CSCI 4410U',
    name: 'Computer Science Thesis Project I',
    credits: 3,
    year: 4,
    semester: 7,
    category: CourseCategory.ELECTIVE_CS,
    prerequisites: ['CSCI3070U'],
    electiveGroup: 5,
    description: 'Independent research project - Part 1'
  },
  {
    id: 'CSCI4420U',
    code: 'CSCI 4420U',
    name: 'Computer Science Thesis Project II',
    credits: 3,
    year: 4,
    semester: 8,
    category: CourseCategory.ELECTIVE_CS,
    prerequisites: ['CSCI4410U'],
    electiveGroup: 6,
    description: 'Independent research project - Part 2'
  },

  // ========== BUSINESS ELECTIVES ==========
  {
    id: 'BUSI1020U',
    code: 'BUSI 1020U',
    name: 'Business Communications',
    credits: 3,
    year: 2,
    semester: 3,
    category: CourseCategory.ELECTIVE_BUSINESS,
    prerequisites: [],
    electiveGroup: 'business',
    description: 'Effective business communication skills'
  },
  {
    id: 'BUSI1600U',
    code: 'BUSI 1600U',
    name: 'Management of the Enterprise',
    credits: 3,
    year: 2,
    semester: 3,
    category: CourseCategory.ELECTIVE_BUSINESS,
    prerequisites: [],
    electiveGroup: 'business',
    description: 'Introduction to business management'
  },
  {
    id: 'BUSI1700U',
    code: 'BUSI 1700U',
    name: 'Introduction to Entrepreneurship',
    credits: 3,
    year: 2,
    semester: 3,
    category: CourseCategory.ELECTIVE_BUSINESS,
    prerequisites: [],
    electiveGroup: 'business',
    description: 'Fundamentals of entrepreneurship'
  },
  {
    id: 'BUSI2000U',
    code: 'BUSI 2000U',
    name: 'Collaborative Leadership',
    credits: 3,
    year: 2,
    semester: 4,
    category: CourseCategory.ELECTIVE_BUSINESS,
    prerequisites: [],
    electiveGroup: 'business',
    description: 'Leadership and team collaboration skills'
  },

  // ========== COMMUNICATION ELECTIVES ==========
  {
    id: 'COMM1050U',
    code: 'COMM 1050U',
    name: 'Technical Communications',
    credits: 3,
    year: 1,
    semester: 2,
    category: CourseCategory.ELECTIVE_COMM,
    prerequisites: [],
    electiveGroup: 'comm',
    description: 'Technical writing and documentation'
  },
  {
    id: 'COMM1100U',
    code: 'COMM 1100U',
    name: 'Introduction to Communication Studies',
    credits: 3,
    year: 1,
    semester: 2,
    category: CourseCategory.ELECTIVE_COMM,
    prerequisites: [],
    electiveGroup: 'comm',
    description: 'Fundamentals of communication theory'
  },
  {
    id: 'COMM1320U',
    code: 'COMM 1320U',
    name: 'Public Speaking',
    credits: 3,
    year: 1,
    semester: 2,
    category: CourseCategory.ELECTIVE_COMM,
    prerequisites: [],
    electiveGroup: 'comm',
    description: 'Effective public speaking and presentation'
  },
  {
    id: 'COMM2311U',
    code: 'COMM 2311U',
    name: 'Writing and Publishing in the Digital Age',
    credits: 3,
    year: 2,
    semester: 3,
    category: CourseCategory.ELECTIVE_COMM,
    prerequisites: [],
    electiveGroup: 'comm',
    description: 'Digital writing and publishing skills'
  },
  {
    id: 'COMM2620U',
    code: 'COMM 2620U',
    name: 'Interpersonal Communication',
    credits: 3,
    year: 2,
    semester: 4,
    category: CourseCategory.ELECTIVE_COMM,
    prerequisites: [],
    electiveGroup: 'comm',
    description: 'Interpersonal communication skills'
  }
];

// Mock student progress data - simulating a student partway through their degree
export const mockStudentProgress = {
  studentId: 'STU001',
  studentName: 'Alex Johnson',
  program: 'Computer Science',
  university: 'Ontario Tech University',
  currentYear: 3,
  currentSemester: 5,

  // Courses the student has completed
  completedCourses: [
    'MATH1010U', 'MATH1020U', 'PHY1010U', 'PHY1020U',
    'CSCI1030U', 'CSCI1060U', 'CSCI1061U', 'CSCI2050U',
    'CSCI2000U', 'CSCI2010U', 'CSCI2020U', 'CSCI2040U',
    'CSCI2072U', 'CSCI2110U', 'MATH2050U', 'STAT2010U',
    'COMM1050U', 'BUSI1600U'
  ],

  // Courses currently in progress
  inProgressCourses: [
    'CSCI3070U', 'CSCI3030U', 'CSCI3020U'
  ],

  // Recommended next courses (based on prerequisites met and program requirements)
  recommendedCourses: [
    'CSCI3090U', 'CSCI3230U', 'CSCI3055U', 'CSCI4040U'
  ]
};

// Helper function to get course status for a student
export function getCourseStatus(courseId, studentProgress) {
  if (studentProgress.completedCourses.includes(courseId)) {
    return CourseStatus.COMPLETED;
  }
  if (studentProgress.inProgressCourses.includes(courseId)) {
    return CourseStatus.IN_PROGRESS;
  }
  if (studentProgress.recommendedCourses.includes(courseId)) {
    return CourseStatus.RECOMMENDED;
  }
  return CourseStatus.NOT_TAKEN;
}

// Helper function to check if prerequisites are met
export function arePrerequisitesMet(courseId, studentProgress) {
  const course = ontarioTechCSCourses.find(c => c.id === courseId);
  if (!course) return false;

  const completedOrInProgress = [
    ...studentProgress.completedCourses,
    ...studentProgress.inProgressCourses
  ];

  // Check main prerequisites
  const mainPrereqsMet = course.prerequisites.every(prereq =>
    completedOrInProgress.includes(prereq)
  );

  // Check alternative prerequisites if main ones aren't met
  if (!mainPrereqsMet && course.alternativePrerequisites) {
    return course.alternativePrerequisites.every(prereq =>
      completedOrInProgress.includes(prereq)
    );
  }

  return mainPrereqsMet;
}

// Elective group descriptions
export const electiveGroups = {
  1: {
    name: 'AI/ML & Data',
    description: 'Choose one from: Simulation, Databases, Big Data, ML, or AI',
    required: 1
  },
  2: {
    name: 'Graphics & Vision',
    description: 'Choose one from: Graphics, Advanced Graphics, Info Viz, or Computer Vision',
    required: 1
  },
  3: {
    name: 'Web/Mobile/HCI',
    description: 'Choose one from: Web Dev, Mobile, Interactive Media, or HCI',
    required: 1
  },
  4: {
    name: 'Languages & Software',
    description: 'Choose one from: Programming Languages, SQA, Compilers, or Parallel Programming',
    required: 1
  },
  5: {
    name: 'Systems & Networks',
    description: 'Choose one from: OS, Networks, Systems Programming, Advanced OS, or Thesis I',
    required: 1
  },
  6: {
    name: 'Capstone',
    description: 'Choose Thesis II or a senior CS elective',
    required: 1
  },
  'business': {
    name: 'Business Elective',
    description: 'At least 3 credit hours required',
    required: 1
  },
  'comm': {
    name: 'Communication Elective',
    description: 'At least 3 credit hours required',
    required: 1
  }
};
