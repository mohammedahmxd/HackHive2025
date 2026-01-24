import { useState } from 'react'
import { motion } from 'framer-motion'
import { mockUniversities, mockPrograms } from '../data/mockData'
import { useAppContext } from '../context/AppContext'

const transcriptTypes = ['Undergraduate', 'Graduate', 'Postgraduate']
const languages = ['English', 'French', 'Spanish', 'Chinese']

export default function ValidationPage({ onBack, onContinue }) {
  const {
    university,
    setUniversity,
    program,
    setProgram,
    transcriptType,
    setTranscriptType,
    language,
    setLanguage
  } = useAppContext()

  const [selectedUni, setSelectedUni] = useState(university || null)
  const [selectedProgram, setSelectedProgram] = useState(program || 'Computer Science')
  const [selectedTranscript, setSelectedTranscript] = useState(transcriptType || 'Undergraduate')
  const [selectedLanguage, setSelectedLanguage] = useState(language || 'English')
  const [openDropdown, setOpenDropdown] = useState(null)

  const handleContinue = () => {
    // Save to global state
    setUniversity(selectedUni)
    setProgram(selectedProgram)
    setTranscriptType(selectedTranscript)
    setLanguage(selectedLanguage)

    onContinue()
  }

  const DropdownSelect = ({ label, value, options, onChange, showLogos = false }) => {
    const isOpen = openDropdown === label

    return (
      <div style={{ position: 'relative', flex: 1 }}>
        <label style={{
          display: 'block',
          marginBottom: '0.5rem',
          fontSize: '0.875rem',
          fontWeight: 600,
          opacity: 0.9,
          color: 'var(--gold-bright)',
          letterSpacing: '0.02em',
          textTransform: 'uppercase'
        }}>
          {label}
        </label>
        <button
          onClick={() => setOpenDropdown(isOpen ? null : label)}
          style={{
            width: '100%',
            padding: '0.875rem 1rem',
            background: isOpen
              ? 'linear-gradient(135deg, rgba(1, 58, 99, 0.4) 0%, rgba(0, 53, 102, 0.6) 100%)'
              : 'linear-gradient(135deg, rgba(1, 58, 99, 0.2) 0%, rgba(0, 53, 102, 0.3) 100%)',
            border: isOpen ? '1px solid var(--gold-bright)' : '1px solid var(--blue-medium)',
            borderRadius: '12px',
            color: '#ffffff',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            boxShadow: isOpen
              ? '0 4px 20px rgba(255, 214, 10, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              : '0 2px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
          }}
          onMouseEnter={(e) => {
            if (!isOpen) {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(1, 58, 99, 0.3) 0%, rgba(0, 53, 102, 0.5) 100%)'
              e.currentTarget.style.borderColor = 'rgba(255, 214, 10, 0.5)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }
          }}
          onMouseLeave={(e) => {
            if (!isOpen) {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(1, 58, 99, 0.2) 0%, rgba(0, 53, 102, 0.3) 100%)'
              e.currentTarget.style.borderColor = 'var(--blue-medium)'
              e.currentTarget.style.transform = 'translateY(0)'
            }
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {showLogos && value && (
              <img
                src={mockUniversities.find(u => u.name === value)?.logo}
                alt={value}
                style={{
                  width: '20px',
                  height: '20px',
                  objectFit: 'contain'
                }}
                onError={(e) => { e.target.style.display = 'none' }}
              />
            )}
            <span>{value || `Select ${label}`}</span>
          </div>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease'
            }}
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>

        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              marginTop: '0.5rem',
              background: 'linear-gradient(135deg, rgba(1, 58, 99, 0.95) 0%, rgba(0, 53, 102, 0.98) 100%)',
              border: '1px solid var(--gold-bright)',
              borderRadius: '12px',
              zIndex: 10,
              maxHeight: '250px',
              overflowY: 'auto',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 214, 10, 0.1)',
              backdropFilter: 'blur(10px)'
            }}
          >
            {options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  onChange(option)
                  setOpenDropdown(null)
                }}
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem',
                  background: 'transparent',
                  border: 'none',
                  color: '#ffffff',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '1rem',
                  transition: 'all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(90deg, rgba(255, 214, 10, 0.15) 0%, rgba(255, 214, 10, 0.05) 100%)'
                  e.currentTarget.style.paddingLeft = '1.25rem'
                  e.currentTarget.style.borderLeft = '3px solid var(--gold-bright)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.paddingLeft = '1rem'
                  e.currentTarget.style.borderLeft = 'none'
                }}
              >
                {showLogos && (
                  <img
                    src={mockUniversities.find(u => u.name === option)?.logo}
                    alt={option}
                    style={{
                      width: '20px',
                      height: '20px',
                      objectFit: 'contain'
                    }}
                    onError={(e) => { e.target.style.display = 'none' }}
                  />
                )}
                <span>{option}</span>
              </button>
            ))}
          </motion.div>
        )}
      </div>
    )
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
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            fontSize: '2.5rem',
            fontWeight: 700,
            marginBottom: '0.75rem',
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
            color: 'var(--gold-bright)'
          }}
        >
          Validate Your Information
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            fontSize: '1.125rem',
            opacity: 0.7,
            marginBottom: '3rem',
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
          }}
        >
          Please verify the details we extracted from your transcript
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
            marginBottom: '3rem',
            alignItems: 'flex-end'
          }}
        >
          <DropdownSelect
            label="University"
            value={selectedUni}
            options={mockUniversities.map(u => u.name)}
            onChange={setSelectedUni}
            showLogos={true}
          />
          <DropdownSelect
            label="Program"
            value={selectedProgram}
            options={mockPrograms}
            onChange={setSelectedProgram}
            showLogos={false}
          />
          <DropdownSelect
            label="Transcript Type"
            value={selectedTranscript}
            options={transcriptTypes}
            onChange={setSelectedTranscript}
            showLogos={false}
          />
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem' }}>
            <DropdownSelect
              label="Preferred Language"
              value={selectedLanguage}
              options={languages}
              onChange={setSelectedLanguage}
              showLogos={false}
            />
            <motion.button
              onClick={handleContinue}
              whileHover={{ scale: 1.1, x: 4 }}
              whileTap={{ scale: 0.95 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '48px',
                height: '48px',
                padding: 0,
                background: 'linear-gradient(135deg, var(--gold-bright) 0%, var(--gold-medium) 100%)',
                border: 'none',
                borderRadius: '12px',
                color: 'var(--blue-dark)',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                marginBottom: 0,
                boxShadow: '0 4px 20px rgba(255, 214, 10, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
