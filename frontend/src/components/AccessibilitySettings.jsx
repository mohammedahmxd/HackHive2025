import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppContext } from '../context/AppContext'

export default function AccessibilitySettings() {
  const { highContrast, setHighContrast, reduceMotion, setReduceMotion } = useAppContext()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Accessibility Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={!reduceMotion ? { scale: 1.1 } : {}}
        whileTap={!reduceMotion ? { scale: 0.9 } : {}}
        aria-label="Accessibility Settings"
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          border: 'none',
          background: highContrast
            ? '#ffffff'
            : 'linear-gradient(135deg, var(--gold-bright) 0%, var(--gold-medium) 100%)',
          color: highContrast ? '#000000' : 'var(--blue-dark)',
          cursor: 'pointer',
          boxShadow: highContrast
            ? '0 4px 20px rgba(255, 255, 255, 0.4)'
            : '0 4px 20px rgba(255, 214, 10, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          zIndex: 1000,
          transition: 'all 0.3s ease'
        }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M12 1v6m0 6v6m-6-6h6m6 0h6"></path>
        </svg>
      </motion.button>

      {/* Settings Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
            style={{
              position: 'fixed',
              bottom: '6rem',
              right: '2rem',
              width: '320px',
              background: highContrast
                ? '#000000'
                : 'linear-gradient(135deg, rgba(1, 58, 99, 0.95) 0%, rgba(0, 53, 102, 0.95) 100%)',
              border: highContrast ? '2px solid #ffffff' : '1px solid var(--blue-medium)',
              borderRadius: '16px',
              padding: '1.5rem',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(10px)',
              zIndex: 1000
            }}
          >
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: highContrast ? '#ffffff' : 'var(--gold-bright)',
              marginBottom: '1.5rem',
              fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
            }}>
              Accessibility
            </h3>

            {/* High Contrast Toggle */}
            <div style={{
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: '#ffffff',
                  marginBottom: '0.25rem',
                  fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
                }}>
                  High Contrast
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
                }}>
                  Increase color contrast
                </div>
              </div>
              <button
                onClick={() => setHighContrast(!highContrast)}
                aria-label="Toggle high contrast mode"
                style={{
                  width: '50px',
                  height: '28px',
                  borderRadius: '14px',
                  border: 'none',
                  background: highContrast ? '#ffffff' : 'rgba(255, 255, 255, 0.2)',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'background 0.3s ease'
                }}
              >
                <div style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  background: highContrast ? '#000000' : '#ffffff',
                  position: 'absolute',
                  top: '3px',
                  left: highContrast ? '25px' : '3px',
                  transition: 'left 0.3s ease'
                }} />
              </button>
            </div>

            {/* Reduce Motion Toggle */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: '#ffffff',
                  marginBottom: '0.25rem',
                  fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
                }}>
                  Reduce Motion
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
                }}>
                  Minimize animations
                </div>
              </div>
              <button
                onClick={() => setReduceMotion(!reduceMotion)}
                aria-label="Toggle reduce motion mode"
                style={{
                  width: '50px',
                  height: '28px',
                  borderRadius: '14px',
                  border: 'none',
                  background: reduceMotion ? '#ffffff' : 'rgba(255, 255, 255, 0.2)',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'background 0.3s ease'
                }}
              >
                <div style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  background: reduceMotion ? '#000000' : '#ffffff',
                  position: 'absolute',
                  top: '3px',
                  left: reduceMotion ? '25px' : '3px',
                  transition: 'left 0.3s ease'
                }} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
