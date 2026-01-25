import { motion } from 'framer-motion'
import { useAppContext } from '../context/AppContext'
import { mockUniversities } from '../data/mockData'

export default function SummaryPage({ onBack }) {
  const { university, program, transcriptType } = useAppContext()

  // Find the university logo
  const universityData = mockUniversities.find(u => u.name === university)
  const currentYear = new Date().getFullYear()

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
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '3rem'
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            textAlign: 'center',
            width: '100%'
          }}
        >
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              fontSize: '3rem',
              fontWeight: 700,
              marginBottom: '1rem',
              fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
              color: 'var(--gold-bright)',
              letterSpacing: '-0.02em'
            }}
          >
            Your Academic Profile
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              fontSize: '1.125rem',
              marginBottom: '3rem',
              fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
            }}
          >
            Here's a summary of your information
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            width: '100%',
            maxWidth: '800px',
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem'
          }}
        >
          {/* University Card */}
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              background: 'linear-gradient(135deg, rgba(1, 58, 99, 0.3) 0%, rgba(0, 53, 102, 0.5) 100%)',
              border: '1px solid var(--blue-medium)',
              borderRadius: '20px',
              padding: '2.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '2rem',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }}
          >
            {universityData?.logo && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{
                  width: '80px',
                  height: '80px',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(255, 214, 10, 0.2)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                  flexShrink: 0
                }}
              >
                <img
                  src={universityData.logo}
                  alt={university}
                  style={{
                    width: '48px',
                    height: '48px',
                    objectFit: 'contain'
                  }}
                  onError={(e) => { e.target.style.display = 'none' }}
                />
              </motion.div>
            )}
            <div style={{ flex: 1 }}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: 'var(--gold-bright)',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  marginBottom: '0.5rem',
                  opacity: 0.8
                }}
              >
                University
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                style={{
                  fontSize: '1.75rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                  letterSpacing: '-0.01em'
                }}
              >
                {university}
              </motion.div>
            </div>
          </motion.div>

          {/* Program Card */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            whileHover={{ scale: 1.02, x: 4 }}
            style={{
              background: 'linear-gradient(135deg, rgba(1, 58, 99, 0.25) 0%, rgba(0, 53, 102, 0.4) 100%)',
              border: '1px solid var(--blue-medium)',
              borderRadius: '16px',
              padding: '2rem',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }}
          >
            <div
              style={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: 'var(--gold-bright)',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                marginBottom: '0.5rem',
                opacity: 0.8
              }}
            >
              Program
            </div>
            <div
              style={{
                fontSize: '1.5rem',
                fontWeight: 600,
                color: '#ffffff',
                fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
              }}
            >
              {program}
            </div>
          </motion.div>

          {/* Year Card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            whileHover={{ scale: 1.02, x: -4 }}
            style={{
              background: 'linear-gradient(135deg, rgba(1, 58, 99, 0.25) 0%, rgba(0, 53, 102, 0.4) 100%)',
              border: '1px solid var(--blue-medium)',
              borderRadius: '16px',
              padding: '2rem',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }}
          >
            <div
              style={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: 'var(--gold-bright)',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                marginBottom: '0.5rem',
                opacity: 0.8
              }}
            >
              Academic Year
            </div>
            <div
              style={{
                fontSize: '1.5rem',
                fontWeight: 600,
                color: '#ffffff',
                fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
              }}
            >
              {currentYear} - {transcriptType}
            </div>
          </motion.div>
        </motion.div>

        {/* Continue Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.98 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            padding: '1rem 2.5rem',
            fontSize: '1.05rem',
            fontWeight: 600,
            border: 'none',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, var(--gold-bright) 0%, var(--gold-medium) 100%)',
            color: 'var(--blue-dark)',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
            boxShadow: '0 4px 20px rgba(255, 214, 10, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
            marginTop: '1rem'
          }}
        >
          Continue
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </motion.button>
      </div>
    </motion.div>
  )
}
