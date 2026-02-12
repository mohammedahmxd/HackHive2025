import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAppContext } from '../context/AppContext'
import { mockUniversities } from '../data/mockData'
import CourseGraph from './CourseGraph'
import LinkedInJobsPage from './LinkedInJobsPage'
import ProfessorRecommendationsPage from './ProfessorRecommendationsPage'
import ProjectRecommendationsPage from './ProjectRecommendationsPage'

export default function DashboardPage({ onBack }) {
  const { university, program, academicYear, highContrast, reduceMotion } = useAppContext()
  const [hoveredCard, setHoveredCard] = useState(null)
  const [expandedView, setExpandedView] = useState(null)

  // Find the university logo
  const universityData = mockUniversities.find(u => u.name === university)

  return (
    <motion.div
      initial={!reduceMotion ? { opacity: 0, y: 40 } : { opacity: 1 }}
      animate={{ opacity: 1, y: 0 }}
      exit={!reduceMotion ? { opacity: 0, y: -40 } : { opacity: 1 }}
      transition={{ duration: reduceMotion ? 0 : 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        minHeight: '100vh',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <motion.button
        onClick={onBack}
        whileHover={!reduceMotion ? { x: -4, opacity: 1 } : {}}
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

      <div style={{
        maxWidth: '1600px',
        margin: '0 auto',
        width: '100%',
        flex: 1
      }}>
        <motion.div
          initial={!reduceMotion ? { opacity: 0, y: 20 } : { opacity: 1 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.5, delay: reduceMotion ? 0 : 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '3rem',
            textAlign: 'center'
          }}
        >
          {universityData?.logo && (
            <img
              src={universityData.logo}
              alt={university}
              style={{
                width: '48px',
                height: '48px',
                objectFit: 'contain',
                marginBottom: '0.5rem',
                filter: highContrast ? 'brightness(1.2) contrast(1.3)' : 'none'
              }}
              onError={(e) => { e.target.style.display = 'none' }}
            />
          )}
          <div style={{
            fontSize: '2rem',
            fontWeight: 700,
            color: '#ffffff',
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
            letterSpacing: '-0.02em'
          }}>
            {university}
          </div>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: 600,
            color: highContrast ? '#ffffff' : 'rgba(255, 255, 255, 0.8)',
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
          }}>
            {program}
          </div>
          <div style={{
            fontSize: '1.25rem',
            fontWeight: 500,
            color: highContrast ? '#ffffff' : 'var(--gold-bright)',
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
          }}>
            {academicYear || 'Year 1'}
          </div>
        </motion.div>

        {/* Course Requirement Graph */}
        <motion.div
          initial={!reduceMotion ? { opacity: 0, y: 30 } : { opacity: 1 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.6, delay: reduceMotion ? 0 : 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div style={{
            fontSize: '1.25rem',
            fontWeight: 600,
            color: '#ffffff',
            marginBottom: '1rem',
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
            textAlign: 'center'
          }}>
            Course Requirements & Progress
          </div>
          <CourseGraph />
        </motion.div>

        {/* Three Card Section */}
        <motion.div
          initial={!reduceMotion ? { opacity: 0, y: 30 } : { opacity: 1 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.6, delay: reduceMotion ? 0 : 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            marginTop: '3rem',
            display: 'flex',
            flexDirection: 'row',
            gap: '1.5rem',
            height: '400px'
          }}
        >
          {['linkedin', 'professor', 'project'].map((cardType, index) => {
            const cardData = {
              linkedin: {
                title: 'Job Recommendations',
                subtitle: 'Find jobs tailored to your career path',
                logo: (
                  <svg viewBox="0 0 24 24" width="64" height="64" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                ),
                color: '#0077B5'
              },
              professor: {
                title: 'Professor Connections',
                subtitle: 'Find and connect with top-rated professors',
                logo: (
                  <svg viewBox="0 0 24 24" width="64" height="64" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 14l9-5-9-5-9 5 9 5z"/>
                    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"/>
                  </svg>
                ),
                color: '#00C851'
              },
              project: {
                title: 'Project Recommendations',
                subtitle: 'Discover projects tailored to your skills',
                logo: (
                  <svg viewBox="0 0 24 24" width="64" height="64" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                  </svg>
                ),
                color: '#FFD60A'
              }
            }

            const data = cardData[cardType]
            const isHovered = hoveredCard === cardType
            const otherCardsHovered = hoveredCard && hoveredCard !== cardType

            // Calculate flex value based on hover state
            let flexValue = 1 // Default: equal space (1/3 each)
            if (isHovered) {
              flexValue = 2 // Hovered card takes 2/3
            } else if (otherCardsHovered) {
              flexValue = 0.5 // Other cards share remaining 1/3 (0.5 each)
            }

            return (
              <motion.div
                key={cardType}
                animate={!reduceMotion ? { flex: flexValue } : { flex: 1 }}
                transition={{ duration: reduceMotion ? 0 : 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                onMouseEnter={() => !reduceMotion && setHoveredCard(cardType)}
                onMouseLeave={() => !reduceMotion && setHoveredCard(null)}
                onClick={() => setExpandedView(cardType)}
                style={{
                  background: highContrast
                    ? (isHovered ? '#ffffff' : '#1a1a1a')
                    : (isHovered
                      ? 'linear-gradient(135deg, rgba(1, 58, 99, 0.5) 0%, rgba(0, 53, 102, 0.6) 100%)'
                      : 'linear-gradient(135deg, rgba(1, 58, 99, 0.3) 0%, rgba(0, 53, 102, 0.4) 100%)'),
                  border: highContrast
                    ? (isHovered ? '3px solid #ffffff' : '2px solid #666666')
                    : ('2px solid ' + (isHovered ? 'var(--gold-bright)' : 'var(--blue-medium)')),
                  borderRadius: '16px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '1.5rem',
                  overflow: 'hidden',
                  position: 'relative',
                  padding: '2rem',
                  boxShadow: highContrast
                    ? (isHovered ? '0 8px 24px rgba(255, 255, 255, 0.4)' : '0 2px 8px rgba(0, 0, 0, 0.5)')
                    : (isHovered
                      ? '0 12px 40px rgba(255, 214, 10, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
                      : '0 4px 12px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.08)'),
                  transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                {/* Logo */}
                <motion.div
                  animate={!reduceMotion ? {
                    scale: isHovered ? 1.15 : 1,
                    rotate: isHovered ? 5 : 0
                  } : {}}
                  transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                  style={{
                    color: highContrast
                      ? (isHovered ? '#000000' : '#ffffff')
                      : (isHovered ? data.color : 'rgba(255, 255, 255, 0.6)'),
                    transition: 'color 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    filter: isHovered && !highContrast ? `drop-shadow(0 0 20px ${data.color}40)` : 'none'
                  }}
                >
                  {data.logo}
                </motion.div>

                {/* Title and Subtitle */}
                <motion.div
                  animate={!reduceMotion ? { scale: isHovered ? 1.05 : 1 } : {}}
                  transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem',
                    textAlign: 'center'
                  }}
                >
                  <div style={{
                    fontSize: isHovered ? '1.75rem' : '1.5rem',
                    fontWeight: 700,
                    color: highContrast
                      ? (isHovered ? '#000000' : '#ffffff')
                      : (isHovered ? 'var(--gold-bright)' : '#ffffff'),
                    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                    transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    letterSpacing: '-0.02em'
                  }}>
                    {data.title}
                  </div>
                  <motion.div
                    animate={!reduceMotion ? {
                      opacity: isHovered ? 1 : 0.5,
                      y: isHovered ? 0 : 5
                    } : {}}
                    transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                    style={{
                      fontSize: '1rem',
                      fontWeight: 500,
                      color: highContrast
                        ? (isHovered ? '#000000' : '#ffffff')
                        : 'rgba(255, 255, 255, 0.8)',
                      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                      maxWidth: '280px',
                      opacity: highContrast ? 1 : (isHovered ? 1 : 0.5)
                    }}
                  >
                    {data.subtitle}
                  </motion.div>
                </motion.div>

                {/* Arrow indicator on hover */}
                <motion.div
                  animate={!reduceMotion ? {
                    opacity: isHovered ? 1 : 0,
                    y: isHovered ? 0 : 10
                  } : { opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                  style={{
                    position: 'absolute',
                    bottom: '1.5rem',
                    color: highContrast ? '#000000' : 'var(--gold-bright)'
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </motion.div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>

      {/* Expanded Views */}
      {expandedView === 'linkedin' && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#00111F',
          zIndex: 1000,
          overflowY: 'auto'
        }}>
          <LinkedInJobsPage onBack={() => setExpandedView(null)} />
        </div>
      )}

      {expandedView === 'professor' && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#00111F',
          zIndex: 1000,
          overflowY: 'auto'
        }}>
          <ProfessorRecommendationsPage onBack={() => setExpandedView(null)} />
        </div>
      )}

      {expandedView === 'project' && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#00111F',
          zIndex: 1000,
          overflowY: 'auto'
        }}>
          <ProjectRecommendationsPage onBack={() => setExpandedView(null)} />
        </div>
      )}
    </motion.div>
  )
}
