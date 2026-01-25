// Mock data for CS student example
export const mockUniversities = [
  { name: 'University of Toronto', logo: 'https://www.utoronto.ca/favicon.ico' },
  { name: 'University of Waterloo', logo: 'https://uwaterloo.ca/favicon.ico' },
  { name: 'University of British Columbia', logo: 'https://www.ubc.ca/favicon.ico' },
  { name: 'McGill University', logo: 'https://www.mcgill.ca/favicon.ico' },
  { name: 'McMaster University', logo: 'https://www.mcmaster.ca/favicon.ico' },
  { name: 'York University', logo: 'https://www.yorku.ca/favicon.ico' },
  { name: 'Western University', logo: 'https://www.uwo.ca/favicon.ico' },
  { name: 'Queen\'s University', logo: 'https://www.queensu.ca/favicon.ico' },
  { name: 'University of Alberta', logo: 'https://www.ualberta.ca/favicon.ico' },
  { name: 'University of Calgary', logo: 'https://www.ucalgary.ca/favicon.ico' },
  { name: 'Simon Fraser University', logo: 'https://www.sfu.ca/favicon.ico' },
  { name: 'Dalhousie University', logo: 'https://www.dal.ca/favicon.ico' },
  { name: 'University of Ottawa', logo: 'https://www.uottawa.ca/favicon.ico' },
  { name: 'Carleton University', logo: 'https://carleton.ca/favicon.ico' },
  { name: 'Toronto Metropolitan University', logo: 'https://www.torontomu.ca/favicon.ico' },
  { name: 'Ontario Tech University', logo: 'https://ontariotechu.ca/favicon.ico' },
  { name: 'University of Victoria', logo: 'https://www.uvic.ca/favicon.ico' },
  { name: 'University of Manitoba', logo: 'https://umanitoba.ca/favicon.ico' },
  { name: 'University of Saskatchewan', logo: 'https://www.usask.ca/favicon.ico' }
];

export const mockPrograms = [
  'Computer Science',
  'Software Engineering',
  'Computer Engineering',
  'Data Science',
  'Information Technology',
  'Artificial Intelligence',
  'Cybersecurity'
];

export const mockCourses = {
  completed: [
    { id: 'CS101', name: 'Intro to Programming', semester: 1, prerequisites: [] },
    { id: 'MATH101', name: 'Calculus I', semester: 1, prerequisites: [] },
    { id: 'CS102', name: 'Data Structures', semester: 2, prerequisites: ['CS101'] },
    { id: 'CS201', name: 'Algorithms', semester: 3, prerequisites: ['CS102'] },
    { id: 'CS202', name: 'Database Systems', semester: 3, prerequisites: ['CS102'] },
    { id: 'CS301', name: 'Operating Systems', semester: 4, prerequisites: ['CS201'] },
    { id: 'CS302', name: 'Computer Networks', semester: 4, prerequisites: ['CS201'] }
  ],
  inProgress: [
    { id: 'CS401', name: 'Machine Learning', semester: 5, prerequisites: ['CS201', 'MATH101'] },
    { id: 'CS402', name: 'Web Development', semester: 5, prerequisites: ['CS202'] }
  ],
  remaining: [
    { id: 'CS403', name: 'Cloud Computing', semester: 6, prerequisites: ['CS302'] },
    { id: 'CS404', name: 'Cybersecurity', semester: 6, prerequisites: ['CS302'] },
    { id: 'CS405', name: 'Mobile Development', semester: 7, prerequisites: ['CS402'] },
    { id: 'CS406', name: 'AI Ethics', semester: 7, prerequisites: ['CS401'] },
    { id: 'CS499', name: 'Capstone Project', semester: 8, prerequisites: ['CS403', 'CS404'] }
  ]
};

export const mockCareers = [
  {
    id: 1,
    title: 'Full Stack Developer',
    description: 'Build end-to-end web applications',
    icon: '💻'
  },
  {
    id: 2,
    title: 'Machine Learning Engineer',
    description: 'Develop AI and ML solutions',
    icon: '🤖'
  },
  {
    id: 3,
    title: 'Cloud Architect',
    description: 'Design scalable cloud infrastructure',
    icon: '☁️'
  }
];

export const mockLinkedInConnections = [
  {
    id: 1,
    name: 'Sarah Chen',
    title: 'Senior Full Stack Developer @ Google',
    company: 'Google',
    avatar: '👩‍💻'
  },
  {
    id: 2,
    name: 'Michael Rodriguez',
    title: 'Lead Full Stack Engineer @ Meta',
    company: 'Meta',
    avatar: '👨‍💻'
  },
  {
    id: 3,
    name: 'Emily Johnson',
    title: 'Full Stack Developer @ Amazon',
    company: 'Amazon',
    avatar: '👩‍💼'
  },
  {
    id: 4,
    name: 'David Kim',
    title: 'Software Engineer @ Microsoft',
    company: 'Microsoft',
    avatar: '👨‍💼'
  },
  {
    id: 5,
    name: 'Priya Patel',
    title: 'Full Stack Developer @ Shopify',
    company: 'Shopify',
    avatar: '👩‍💻'
  },
  {
    id: 6,
    name: 'James Liu',
    title: 'Senior Software Engineer @ Netflix',
    company: 'Netflix',
    avatar: '👨‍💻'
  }
];

export const mockProjects = [
  {
    id: 1,
    title: 'E-Commerce Platform',
    description: 'Build a full-stack online store with React, Node.js, and MongoDB',
    techStack: ['React', 'Node.js', 'Express', 'MongoDB', 'Stripe'],
    difficulty: 'Intermediate',
    estimatedTime: '4-6 weeks'
  },
  {
    id: 2,
    title: 'Real-Time Chat Application',
    description: 'Create a WebSocket-based chat app with user authentication',
    techStack: ['React', 'Socket.io', 'Node.js', 'PostgreSQL'],
    difficulty: 'Advanced',
    estimatedTime: '3-4 weeks'
  },
  {
    id: 3,
    title: 'Task Management Dashboard',
    description: 'Develop a Kanban-style project management tool',
    techStack: ['React', 'TypeScript', 'Firebase', 'Tailwind CSS'],
    difficulty: 'Beginner',
    estimatedTime: '2-3 weeks'
  },
  {
    id: 4,
    title: 'Social Media Analytics',
    description: 'Build a dashboard to analyze social media metrics',
    techStack: ['React', 'D3.js', 'Python', 'FastAPI', 'Redis'],
    difficulty: 'Advanced',
    estimatedTime: '5-7 weeks'
  },
  {
    id: 5,
    title: 'Portfolio Website Builder',
    description: 'Create a drag-and-drop portfolio website builder',
    techStack: ['React', 'Next.js', 'Tailwind CSS', 'Supabase'],
    difficulty: 'Intermediate',
    estimatedTime: '3-5 weeks'
  }
];
