import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAppContext } from '../context/AppContext'

export default function LinkedInJobsPage({ onBack }) {
  const { university, program, careerPath } = useAppContext()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedCareerPath, setSelectedCareerPath] = useState(careerPath || 'Data Engineering')

  const careerPaths = [
    'Data Engineering',
    'Software Engineering',
    'Machine Learning Engineer',
    'Full Stack Developer',
    'DevOps Engineer',
    'Cloud Engineer',
    'Cybersecurity Analyst',
    'Product Manager',
    'UI/UX Designer',
    'Data Scientist'
  ]

  const fetchJobs = async (path) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('http://localhost:8000/linkedin/jobs/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          university: university || 'Ontario Tech University',
          program: program || 'Computer Science',
          career_path: path,
          location: 'Canada'
        })
      })

      if (!response.ok) {
        throw new Error('Failed to fetch jobs')
      }

      const data = await response.json()
      setJobs(data.jobs || [])
    } catch (err) {
      setError(err.message)
      console.error('Error fetching jobs:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs(selectedCareerPath)
  }, [selectedCareerPath])

  const handleCareerPathChange = (path) => {
    setSelectedCareerPath(path)
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
            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#0077B5' }}>
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            <div>
              <h1 style={{
                fontSize: '2.5rem',
                fontWeight: 700,
                marginBottom: '0.5rem',
                fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                color: 'var(--gold-bright)'
              }}>
                Job Recommendations
              </h1>
              <p style={{
                fontSize: '1.125rem',
                opacity: 0.7,
                fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                color: '#ffffff'
              }}>
                {university || 'Ontario Tech University'} • {program || 'Computer Science'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Career Path Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            marginBottom: '2rem',
            background: 'linear-gradient(135deg, rgba(1, 58, 99, 0.3) 0%, rgba(0, 53, 102, 0.4) 100%)',
            border: '1px solid var(--blue-medium)',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
          }}
        >
          <label style={{
            display: 'block',
            marginBottom: '1rem',
            fontSize: '0.875rem',
            fontWeight: 600,
            color: 'var(--gold-bright)',
            letterSpacing: '0.02em',
            textTransform: 'uppercase'
          }}>
            Select Career Path
          </label>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}>
            {careerPaths.map((path) => (
              <motion.button
                key={path}
                onClick={() => handleCareerPathChange(path)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: selectedCareerPath === path
                    ? 'linear-gradient(135deg, var(--gold-bright) 0%, var(--gold-medium) 100%)'
                    : 'rgba(255, 255, 255, 0.05)',
                  border: selectedCareerPath === path ? 'none' : '1px solid var(--blue-medium)',
                  borderRadius: '8px',
                  color: selectedCareerPath === path ? 'var(--blue-dark)' : '#ffffff',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                  boxShadow: selectedCareerPath === path ? '0 4px 20px rgba(255, 214, 10, 0.4)' : 'none'
                }}
              >
                {path}
              </motion.button>
            ))}
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
            <div style={{ marginBottom: '1rem' }}>Searching LinkedIn for {selectedCareerPath} jobs...</div>
            <div style={{ fontSize: '0.875rem', opacity: 0.7 }}>This may take 30-60 seconds</div>
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

        {/* Jobs Grid */}
        {!loading && !error && jobs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
              gap: '1.5rem'
            }}
          >
            {jobs.map((job, index) => (
              <motion.a
                key={job.id || index}
                href={job.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -4, scale: 1.02 }}
                style={{
                  textDecoration: 'none',
                  background: 'linear-gradient(135deg, rgba(1, 58, 99, 0.3) 0%, rgba(0, 53, 102, 0.4) 100%)',
                  border: '1px solid var(--blue-medium)',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem'
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
                {/* Company Logo */}
                {job.companyLogo && (
                  <img
                    src={job.companyLogo}
                    alt={job.company}
                    style={{
                      width: '48px',
                      height: '48px',
                      objectFit: 'contain',
                      borderRadius: '8px'
                    }}
                    onError={(e) => { e.target.style.display = 'none' }}
                  />
                )}

                {/* Job Title */}
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: 'var(--gold-bright)',
                  fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                  margin: 0,
                  lineHeight: 1.3
                }}>
                  {job.title}
                </h3>

                {/* Company Name */}
                <div style={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: '#ffffff',
                  fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
                }}>
                  {job.company}
                </div>

                {/* Location & Type */}
                <div style={{
                  display: 'flex',
                  gap: '1rem',
                  flexWrap: 'wrap',
                  fontSize: '0.875rem',
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
                }}>
                  <span>{job.location}</span>
                  <span>•</span>
                  <span>{job.employmentType}</span>
                  <span>•</span>
                  <span>{job.seniorityLevel}</span>
                </div>

                {/* Description Preview */}
                {job.description && (
                  <p style={{
                    fontSize: '0.875rem',
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                    lineHeight: 1.6,
                    margin: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical'
                  }}>
                    {job.description}
                  </p>
                )}

                {/* Posted Date */}
                <div style={{
                  fontSize: '0.75rem',
                  color: 'rgba(255, 255, 255, 0.5)',
                  fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
                }}>
                  Posted: {job.postedAt}
                </div>
              </motion.a>
            ))}
          </motion.div>
        )}

        {/* No Jobs */}
        {!loading && !error && jobs.length === 0 && (
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
            No jobs found for {selectedCareerPath}. Try selecting a different career path.
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
