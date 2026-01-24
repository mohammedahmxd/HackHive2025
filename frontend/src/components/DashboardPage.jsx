import { motion } from 'framer-motion'
import { useAppContext } from '../context/AppContext'
import { mockUniversities } from '../data/mockData'

export default function DashboardPage({ onBack }) {
  const { university, program, academicYear } = useAppContext()

  // Find the university logo
  const universityData = mockUniversities.find(u => u.name === university)

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

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
        flex: 1
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
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
                marginBottom: '0.5rem'
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
            color: 'rgba(255, 255, 255, 0.8)',
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
          }}>
            {program}
          </div>
          <div style={{
            fontSize: '1.25rem',
            fontWeight: 500,
            color: 'var(--gold-bright)',
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
          }}>
            {academicYear || 'Year 1'}
          </div>
        </motion.div>

        {/* Content will be added here */}
      </div>
    </motion.div>
  )
}
