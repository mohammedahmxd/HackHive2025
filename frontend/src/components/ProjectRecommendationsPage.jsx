import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAppContext } from '../context/AppContext'

export default function ProjectRecommendationsPage({ onBack }) {
  const { selectedCareer } = useAppContext()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (selectedCareer) {
      fetchProjects()
    }
  }, [selectedCareer])

  const fetchProjects = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('http://localhost:8000/projects/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          career_title: selectedCareer.title,
          career_description: selectedCareer.description
        })
      })

      if (!response.ok) {
        console.warn('API failed, using fallback mock data')
        // Use fallback mock data when API fails (quota exceeded, etc.)
        const mockProjects = getMockProjects(selectedCareer.title)
        setProjects(mockProjects)
        setLoading(false)
        return
      }

      const data = await response.json()
      console.log('Project recommendations:', data)
      setProjects(data.projects || [])
    } catch (err) {
      console.warn('Error fetching projects, using fallback:', err)
      // Use fallback mock data on any error
      const mockProjects = getMockProjects(selectedCareer.title)
      setProjects(mockProjects)
    } finally {
      setLoading(false)
    }
  }

  const getMockProjects = (careerTitle) => {
    const baseProjects = {
      'Software Engineer': [
        {
          name: 'Task Management API',
          description: 'Build a RESTful API for managing tasks and projects with user authentication, CRUD operations, and team collaboration features.',
          difficulty: 'Intermediate',
          tech_stack: ['Node.js', 'Express', 'MongoDB', 'JWT', 'Docker'],
          estimated_hours: 40,
          learning_outcomes: ['RESTful API design', 'Authentication & Authorization', 'Database modeling', 'API documentation']
        },
        {
          name: 'Real-time Chat Application',
          description: 'Create a full-stack chat app with WebSocket support, room management, direct messaging, and message history persistence.',
          difficulty: 'Advanced',
          tech_stack: ['React', 'Socket.io', 'Node.js', 'PostgreSQL', 'Redis'],
          estimated_hours: 60,
          learning_outcomes: ['WebSocket programming', 'Real-time systems', 'State management', 'Message queuing']
        },
        {
          name: 'Portfolio Website Builder',
          description: 'Develop a drag-and-drop portfolio builder with customizable themes, responsive design, and export functionality.',
          difficulty: 'Beginner',
          tech_stack: ['React', 'TailwindCSS', 'Firebase', 'React DnD'],
          estimated_hours: 25,
          learning_outcomes: ['Frontend development', 'Drag-and-drop UI', 'Responsive design', 'Component architecture']
        }
      ],
      'Data Scientist': [
        {
          name: 'Customer Churn Prediction',
          description: 'Build a machine learning model to predict customer churn using historical data, feature engineering, and model evaluation.',
          difficulty: 'Intermediate',
          tech_stack: ['Python', 'Pandas', 'Scikit-learn', 'Matplotlib', 'Jupyter'],
          estimated_hours: 35,
          learning_outcomes: ['Data preprocessing', 'Feature engineering', 'Model selection', 'Performance metrics']
        },
        {
          name: 'Sentiment Analysis Dashboard',
          description: 'Create an NLP-powered dashboard to analyze sentiment from social media data with visualizations and trend analysis.',
          difficulty: 'Advanced',
          tech_stack: ['Python', 'NLTK', 'Flask', 'React', 'MongoDB'],
          estimated_hours: 50,
          learning_outcomes: ['Natural Language Processing', 'Text classification', 'Data visualization', 'API development']
        },
        {
          name: 'Sales Forecasting Tool',
          description: 'Develop a time series forecasting model to predict future sales with interactive visualizations and what-if analysis.',
          difficulty: 'Beginner',
          tech_stack: ['Python', 'Pandas', 'Prophet', 'Streamlit'],
          estimated_hours: 30,
          learning_outcomes: ['Time series analysis', 'Statistical modeling', 'Data visualization', 'Dashboard creation']
        }
      ],
      'Machine Learning Engineer': [
        {
          name: 'Image Classification System',
          description: 'Build a deep learning model to classify images using CNNs, with transfer learning and model deployment capabilities.',
          difficulty: 'Advanced',
          tech_stack: ['Python', 'TensorFlow', 'Keras', 'FastAPI', 'Docker'],
          estimated_hours: 55,
          learning_outcomes: ['Convolutional Neural Networks', 'Transfer Learning', 'Model deployment', 'Computer Vision']
        },
        {
          name: 'Recommendation Engine',
          description: 'Create a collaborative filtering recommendation system for movies or products with matrix factorization techniques.',
          difficulty: 'Intermediate',
          tech_stack: ['Python', 'PyTorch', 'Pandas', 'Flask', 'SQLite'],
          estimated_hours: 45,
          learning_outcomes: ['Collaborative filtering', 'Matrix factorization', 'Recommendation algorithms', 'Model evaluation']
        },
        {
          name: 'Text Generation Bot',
          description: 'Develop an LSTM-based text generation model that learns from input text and generates coherent sentences.',
          difficulty: 'Beginner',
          tech_stack: ['Python', 'TensorFlow', 'NLTK', 'Streamlit'],
          estimated_hours: 30,
          learning_outcomes: ['Recurrent Neural Networks', 'LSTM networks', 'Text preprocessing', 'Sequence modeling']
        }
      ],
      'Full Stack Developer': [
        {
          name: 'E-commerce Platform',
          description: 'Build a complete e-commerce site with product catalog, shopping cart, payment integration, and order management.',
          difficulty: 'Advanced',
          tech_stack: ['React', 'Node.js', 'MongoDB', 'Stripe', 'Redis'],
          estimated_hours: 70,
          learning_outcomes: ['Full-stack architecture', 'Payment processing', 'Session management', 'E-commerce workflows']
        },
        {
          name: 'Social Media Dashboard',
          description: 'Create a social platform with user profiles, posts, comments, likes, and real-time notifications.',
          difficulty: 'Intermediate',
          tech_stack: ['Vue.js', 'Express', 'PostgreSQL', 'Socket.io', 'AWS S3'],
          estimated_hours: 50,
          learning_outcomes: ['User authentication', 'Real-time features', 'File uploads', 'Relational databases']
        },
        {
          name: 'Blog CMS',
          description: 'Develop a content management system for blogging with markdown support, categories, tags, and SEO optimization.',
          difficulty: 'Beginner',
          tech_stack: ['Next.js', 'Firebase', 'TailwindCSS', 'Markdown'],
          estimated_hours: 35,
          learning_outcomes: ['Content management', 'Server-side rendering', 'SEO best practices', 'Static site generation']
        }
      ],
      'Web Developer': [
        {
          name: 'Interactive Landing Page',
          description: 'Design and build a modern landing page with animations, responsive design, and contact form integration.',
          difficulty: 'Beginner',
          tech_stack: ['HTML', 'CSS', 'JavaScript', 'GSAP', 'EmailJS'],
          estimated_hours: 20,
          learning_outcomes: ['Responsive design', 'CSS animations', 'Form handling', 'Web performance']
        },
        {
          name: 'Weather Dashboard',
          description: 'Create a weather application that fetches data from APIs and displays forecasts with charts and maps.',
          difficulty: 'Intermediate',
          tech_stack: ['React', 'Chart.js', 'OpenWeather API', 'Leaflet'],
          estimated_hours: 30,
          learning_outcomes: ['API integration', 'Data visualization', 'Geolocation', 'State management']
        },
        {
          name: 'Todo App with Cloud Sync',
          description: 'Build a task management app with drag-and-drop, categories, and cloud synchronization across devices.',
          difficulty: 'Intermediate',
          tech_stack: ['React', 'Firebase', 'React DnD', 'Material-UI'],
          estimated_hours: 40,
          learning_outcomes: ['Cloud databases', 'Real-time sync', 'Drag-and-drop UI', 'Progressive Web Apps']
        }
      ],
      'DevOps Engineer': [
        {
          name: 'CI/CD Pipeline',
          description: 'Set up a complete continuous integration and deployment pipeline with automated testing and deployment.',
          difficulty: 'Advanced',
          tech_stack: ['Jenkins', 'Docker', 'Kubernetes', 'GitHub Actions', 'Terraform'],
          estimated_hours: 60,
          learning_outcomes: ['CI/CD practices', 'Container orchestration', 'Infrastructure as Code', 'Automated testing']
        },
        {
          name: 'Monitoring Dashboard',
          description: 'Create a real-time monitoring system for server metrics, logs, and alerts with custom dashboards.',
          difficulty: 'Intermediate',
          tech_stack: ['Prometheus', 'Grafana', 'Docker', 'Node Exporter', 'AlertManager'],
          estimated_hours: 45,
          learning_outcomes: ['System monitoring', 'Metrics collection', 'Log aggregation', 'Alert configuration']
        },
        {
          name: 'Infrastructure Automation',
          description: 'Automate server provisioning and configuration using infrastructure as code and configuration management.',
          difficulty: 'Beginner',
          tech_stack: ['Terraform', 'Ansible', 'AWS', 'Git'],
          estimated_hours: 35,
          learning_outcomes: ['Infrastructure as Code', 'Cloud provisioning', 'Configuration management', 'Version control']
        }
      ],
      'Mobile Developer': [
        {
          name: 'Fitness Tracking App',
          description: 'Build a cross-platform mobile app to track workouts, calories, and progress with charts and reminders.',
          difficulty: 'Intermediate',
          tech_stack: ['React Native', 'Firebase', 'AsyncStorage', 'Victory Charts'],
          estimated_hours: 50,
          learning_outcomes: ['Mobile development', 'Local storage', 'Push notifications', 'Data visualization']
        },
        {
          name: 'Recipe Sharing Platform',
          description: 'Create a mobile app for sharing recipes with photo uploads, ratings, and social features.',
          difficulty: 'Advanced',
          tech_stack: ['Flutter', 'Firebase', 'Cloud Firestore', 'Firebase Storage'],
          estimated_hours: 65,
          learning_outcomes: ['Cross-platform development', 'Image handling', 'Social features', 'Cloud integration']
        },
        {
          name: 'Expense Tracker',
          description: 'Develop a simple expense tracking app with categories, budgets, and monthly reports.',
          difficulty: 'Beginner',
          tech_stack: ['React Native', 'SQLite', 'React Navigation', 'Chart.js'],
          estimated_hours: 30,
          learning_outcomes: ['Mobile UI/UX', 'Local databases', 'Navigation', 'Data persistence']
        }
      ],
      'Game Developer': [
        {
          name: '2D Platformer Game',
          description: 'Create a 2D platformer game with physics, level design, collectibles, and scoring system.',
          difficulty: 'Intermediate',
          tech_stack: ['Unity', 'C#', 'Tilemap', 'Cinemachine'],
          estimated_hours: 55,
          learning_outcomes: ['Game physics', 'Level design', 'Animation', 'Game mechanics']
        },
        {
          name: 'Puzzle Game',
          description: 'Build a match-3 puzzle game with power-ups, scoring, leaderboards, and progressive difficulty.',
          difficulty: 'Beginner',
          tech_stack: ['Unity', 'C#', 'PlayerPrefs', 'DOTween'],
          estimated_hours: 40,
          learning_outcomes: ['Game logic', 'UI design', 'State machines', 'Game balancing']
        },
        {
          name: 'Multiplayer Battle Game',
          description: 'Develop a real-time multiplayer battle game with networking, matchmaking, and player progression.',
          difficulty: 'Advanced',
          tech_stack: ['Unity', 'Photon', 'C#', 'Mirror Networking'],
          estimated_hours: 80,
          learning_outcomes: ['Multiplayer networking', 'Server-client architecture', 'Matchmaking', 'Real-time sync']
        }
      ],
      'AI/ML Researcher': [
        {
          name: 'Neural Style Transfer',
          description: 'Implement an artistic style transfer system using convolutional neural networks to blend content and style.',
          difficulty: 'Advanced',
          tech_stack: ['Python', 'TensorFlow', 'OpenCV', 'NumPy', 'Jupyter'],
          estimated_hours: 50,
          learning_outcomes: ['Deep learning', 'CNN architectures', 'Image processing', 'Optimization techniques']
        },
        {
          name: 'Reinforcement Learning Agent',
          description: 'Train an RL agent to play classic games using Q-learning and policy gradient methods.',
          difficulty: 'Advanced',
          tech_stack: ['Python', 'OpenAI Gym', 'PyTorch', 'NumPy'],
          estimated_hours: 60,
          learning_outcomes: ['Reinforcement learning', 'Q-learning', 'Policy gradients', 'Environment simulation']
        },
        {
          name: 'Object Detection System',
          description: 'Build an object detection model using YOLO or Faster R-CNN for real-time detection in images and video.',
          difficulty: 'Intermediate',
          tech_stack: ['Python', 'PyTorch', 'OpenCV', 'YOLO', 'COCO Dataset'],
          estimated_hours: 45,
          learning_outcomes: ['Object detection', 'Transfer learning', 'Model fine-tuning', 'Real-time processing']
        }
      ]
    }

    // Normalize the career title for better matching
    const normalizedTitle = careerTitle.toLowerCase().trim()

    console.log('Looking for projects for career:', careerTitle)

    // Try exact match first
    if (baseProjects[careerTitle]) {
      console.log('Found exact match')
      return baseProjects[careerTitle]
    }

    // Map common variations to standard keys
    const careerMappings = {
      'software engineering': 'Software Engineer',
      'software developer': 'Software Engineer',
      'backend developer': 'Software Engineer',
      'frontend developer': 'Web Developer',
      'data science': 'Data Scientist',
      'data analyst': 'Data Scientist',
      'web development': 'Web Developer',
      'web designer': 'Web Developer',
      'machine learning': 'Machine Learning Engineer',
      'ml engineer': 'Machine Learning Engineer',
      'full stack': 'Full Stack Developer',
      'fullstack': 'Full Stack Developer',
      'devops': 'DevOps Engineer',
      'mobile development': 'Mobile Developer',
      'ios developer': 'Mobile Developer',
      'android developer': 'Mobile Developer',
      'game development': 'Game Developer',
      'ai researcher': 'AI/ML Researcher',
      'ml researcher': 'AI/ML Researcher'
    }

    // Check mappings
    for (const [variant, standardKey] of Object.entries(careerMappings)) {
      if (normalizedTitle.includes(variant)) {
        console.log(`Matched "${careerTitle}" to "${standardKey}" via mapping`)
        return baseProjects[standardKey]
      }
    }

    // Try partial match with base project keys
    for (const [key, projects] of Object.entries(baseProjects)) {
      const normalizedKey = key.toLowerCase()
      if (normalizedTitle.includes(normalizedKey) || normalizedKey.includes(normalizedTitle)) {
        console.log(`Matched "${careerTitle}" to "${key}" via partial match`)
        return projects
      }
    }

    console.log('No match found, using default Software Engineer projects')
    // Default to Software Engineer projects
    return baseProjects['Software Engineer']
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return '#4ade80' // green
      case 'intermediate':
        return '#fbbf24' // yellow
      case 'advanced':
        return '#f87171' // red
      default:
        return '#ffffff'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        minHeight: '100vh',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Back Button */}
      <motion.button
        onClick={onBack}
        whileHover={{ x: -4, opacity: 1 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'transparent',
          border: 'none',
          color: '#ffffff',
          fontSize: '1rem',
          cursor: 'pointer',
          marginBottom: '2rem',
          opacity: 0.7,
          transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Back
      </motion.button>

      <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%', flex: 1 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{ marginBottom: '2rem' }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--gold-bright)' }}>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8" fill="none" stroke="var(--blue-dark)" strokeWidth="2"></polyline>
              <line x1="16" y1="13" x2="8" y2="13" stroke="var(--blue-dark)" strokeWidth="2"></line>
              <line x1="16" y1="17" x2="8" y2="17" stroke="var(--blue-dark)" strokeWidth="2"></line>
              <polyline points="10 9 9 9 8 9" stroke="var(--blue-dark)" strokeWidth="2"></polyline>
            </svg>
            <div>
              <h1 style={{
                fontSize: '2.5rem',
                fontWeight: 700,
                marginBottom: '0.5rem',
                fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                color: 'var(--gold-bright)'
              }}>
                Project Recommendations
              </h1>
              <p style={{
                fontSize: '1.125rem',
                opacity: 0.7,
                fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                color: '#ffffff'
              }}>
                {selectedCareer ? `Tailored for ${selectedCareer.title}` : 'Build Your Portfolio'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              textAlign: 'center',
              padding: '4rem',
              color: 'var(--gold-bright)',
              fontSize: '1.25rem',
              fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
            }}
          >
            <div style={{ marginBottom: '1rem' }}>Generating personalized projects...</div>
            <div style={{ fontSize: '0.875rem', opacity: 0.7 }}>This may take a moment</div>
          </motion.div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              padding: '2rem',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '12px',
              color: '#ef4444',
              fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
            }}
          >
            <strong>Error:</strong> {error}
          </motion.div>
        )}

        {/* Projects Grid */}
        {!loading && !error && projects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
              gap: '2rem'
            }}
          >
            {projects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ y: -4, scale: 1.02 }}
                style={{
                  background: 'linear-gradient(135deg, rgba(1, 58, 99, 0.3) 0%, rgba(0, 53, 102, 0.4) 100%)',
                  border: '1px solid var(--blue-medium)',
                  borderRadius: '12px',
                  padding: '2rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.5rem',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--gold-bright)'
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(255, 214, 10, 0.2)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--blue-medium)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                {/* Difficulty Badge */}
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  padding: '0.5rem 1rem',
                  background: getDifficultyColor(project.difficulty),
                  borderRadius: '8px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'var(--blue-dark)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  {project.difficulty}
                </div>

                {/* Project Name */}
                <h2 style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: 'var(--gold-bright)',
                  fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                  marginTop: '1rem',
                  lineHeight: 1.3
                }}>
                  {project.name}
                </h2>

                {/* Description */}
                <p style={{
                  fontSize: '1rem',
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                  lineHeight: 1.6,
                  flex: 1
                }}>
                  {project.description}
                </p>

                {/* Tech Stack */}
                <div>
                  <h3 style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                    marginBottom: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Tech Stack
                  </h3>
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.5rem'
                  }}>
                    {project.tech_stack.map((tech, i) => (
                      <span
                        key={i}
                        style={{
                          padding: '0.375rem 0.75rem',
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 500,
                          color: '#ffffff',
                          fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Learning Outcomes */}
                <div>
                  <h3 style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                    marginBottom: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    What You'll Learn
                  </h3>
                  <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                  }}>
                    {project.learning_outcomes.map((outcome, i) => (
                      <li key={i} style={{
                        fontSize: '0.875rem',
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                        paddingLeft: '1.25rem',
                        position: 'relative'
                      }}>
                        <span style={{
                          position: 'absolute',
                          left: 0,
                          color: 'var(--gold-bright)'
                        }}>✓</span>
                        {outcome}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Estimated Hours */}
                <div style={{
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                  paddingTop: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  Estimated: {project.estimated_hours} hours
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* No Projects */}
        {!loading && !error && projects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              textAlign: 'center',
              padding: '4rem',
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '1.125rem',
              fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
            }}
          >
            No projects found. Try refreshing the page.
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
