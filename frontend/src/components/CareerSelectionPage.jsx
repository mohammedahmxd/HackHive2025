import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAppContext } from '../context/AppContext'

export default function CareerSelectionPage({ onBack, onSelectCareer }) {
  const { careerRecommendations } = useAppContext()
  const [selectedIndex, setSelectedIndex] = useState(null)

  console.log('CareerSelectionPage - Career recommendations:', careerRecommendations)

  const handleSelectCareer = () => {
    if (selectedIndex !== null && careerRecommendations[selectedIndex]) {
      onSelectCareer(careerRecommendations[selectedIndex])
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

      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', flex: 1 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{ marginBottom: '3rem', textAlign: 'center' }}
        >
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 700,
            marginBottom: '1rem',
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
            color: 'var(--gold-bright)'
          }}>
            Choose Your Career Path
          </h1>
          <p style={{
            fontSize: '1.125rem',
            opacity: 0.8,
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
            color: '#ffffff'
          }}>
            Based on your transcript, we recommend these career paths
          </p>
        </motion.div>

        {/* Career Cards */}
        {careerRecommendations.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '2rem',
            marginBottom: '3rem'
          }}>
            {careerRecommendations.map((career, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                  boxShadow: selectedIndex === index
                    ? '0 16px 48px rgba(255, 214, 10, 0.4)'
                    : '0 12px 36px rgba(0, 53, 102, 0.3)'
                }}
                onClick={() => setSelectedIndex(index)}
                style={{
                  background: selectedIndex === index
                    ? 'linear-gradient(135deg, rgba(255, 214, 10, 0.15) 0%, rgba(253, 197, 0, 0.15) 100%)'
                    : 'linear-gradient(135deg, rgba(1, 58, 99, 0.3) 0%, rgba(0, 53, 102, 0.4) 100%)',
                  border: selectedIndex === index
                    ? '2px solid var(--gold-bright)'
                    : '2px solid var(--blue-medium)',
                  borderRadius: '16px',
                  padding: '2rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  position: 'relative',
                  boxShadow: selectedIndex === index
                    ? '0 12px 40px rgba(255, 214, 10, 0.3)'
                    : '0 4px 12px rgba(0, 0, 0, 0.2)'
                }}
              >
                {/* Confidence Badge */}
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  padding: '0.5rem 1rem',
                  background: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: '8px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: career.confidence >= 0.8 ? '#4ade80' : career.confidence >= 0.6 ? '#fbbf24' : '#f87171'
                }}>
                  {Math.round(career.confidence * 100)}% Match
                </div>

                {/* Career Title */}
                <h2 style={{
                  fontSize: '1.75rem',
                  fontWeight: 700,
                  color: selectedIndex === index ? 'var(--gold-bright)' : '#ffffff',
                  fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                  marginBottom: '1rem',
                  marginTop: '1rem',
                  transition: 'color 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                }}>
                  {career.title}
                </h2>

                {/* Description */}
                <p style={{
                  fontSize: '1rem',
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                  lineHeight: 1.6,
                  marginBottom: '1.5rem'
                }}>
                  {career.description}
                </p>

                {/* Why Recommended */}
                <div style={{
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                  paddingTop: '1.5rem'
                }}>
                  <h3 style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: 'var(--gold-bright)',
                    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                    marginBottom: '1rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Why We Recommend This
                  </h3>
                  <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem'
                  }}>
                    {career.why_recommended.map((reason, i) => (
                      <li key={i} style={{
                        fontSize: '0.875rem',
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                        paddingLeft: '1.5rem',
                        position: 'relative'
                      }}>
                        <span style={{
                          position: 'absolute',
                          left: 0,
                          color: 'var(--gold-bright)'
                        }}>•</span>
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Selection Indicator */}
                {selectedIndex === index && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    style={{
                      position: 'absolute',
                      top: '1rem',
                      left: '1rem',
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'var(--gold-bright)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--blue-dark)" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '4rem',
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '1.125rem',
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
          }}>
            No career recommendations available. Please go back and try again.
          </div>
        )}

        {/* Continue Button */}
        {careerRecommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '2rem'
            }}
          >
            <motion.button
              onClick={handleSelectCareer}
              disabled={selectedIndex === null}
              whileHover={selectedIndex !== null ? {
                scale: 1.05,
                boxShadow: '0 12px 40px rgba(255, 214, 10, 0.5)'
              } : {}}
              whileTap={selectedIndex !== null ? { scale: 0.95 } : {}}
              animate={selectedIndex !== null ? {
                boxShadow: [
                  '0 8px 32px rgba(255, 214, 10, 0.4)',
                  '0 8px 32px rgba(255, 214, 10, 0.6)',
                  '0 8px 32px rgba(255, 214, 10, 0.4)',
                ]
              } : {}}
              transition={{
                boxShadow: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
              style={{
                padding: '1rem 3rem',
                background: selectedIndex !== null
                  ? 'linear-gradient(135deg, var(--gold-bright) 0%, var(--gold-medium) 100%)'
                  : 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '12px',
                color: selectedIndex !== null ? 'var(--blue-dark)' : 'rgba(255, 255, 255, 0.5)',
                fontSize: '1.125rem',
                fontWeight: 700,
                cursor: selectedIndex !== null ? 'pointer' : 'not-allowed',
                fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                boxShadow: selectedIndex !== null ? '0 8px 32px rgba(255, 214, 10, 0.4)' : 'none',
                transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                opacity: selectedIndex !== null ? 1 : 0.5
              }}
            >
              Continue to Dashboard
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
