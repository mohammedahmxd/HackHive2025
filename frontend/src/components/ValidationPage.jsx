import { useState } from 'react'
import { motion } from 'framer-motion'
import { mockUniversities, mockPrograms } from '../data/mockData'

const transcriptTypes = ['Undergraduate', 'Graduate', 'Postgraduate']
const languages = ['English', 'French', 'Spanish', 'Chinese']

export default function ValidationPage({ onBack, onContinue }) {
  const [selectedUni, setSelectedUni] = useState(null)
  const [selectedProgram, setSelectedProgram] = useState('Computer Science')
  const [selectedTranscript, setSelectedTranscript] = useState('Undergraduate')
  const [selectedLanguage, setSelectedLanguage] = useState('English')
  const [openDropdown, setOpenDropdown] = useState(null)

  const handleContinue = () => {
    onContinue({
      university: selectedUni,
      program: selectedProgram,
      transcriptType: selectedTranscript,
      language: selectedLanguage
    })
  }

  const DropdownSelect = ({ label, value, options, onChange, showLogos = false }) => {
    const isOpen = openDropdown === label

    return (
      <div style={{ position: 'relative', flex: 1 }}>
        <label style={{
          display: 'block',
          marginBottom: '0.5rem',
          fontSize: '0.875rem',
          fontWeight: 500,
          opacity: 0.8
        }}>
          {label}
        </label>
        <button
          onClick={() => setOpenDropdown(isOpen ? null : label)}
          style={{
            width: '100%',
            padding: '0.875rem 1rem',
            background: 'rgba(30, 41, 59, 0.8)',
            border: '1px solid rgba(100, 116, 139, 0.5)',
            borderRadius: '8px',
            color: '#ffffff',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
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
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              marginTop: '0.5rem',
              background: 'rgba(30, 41, 59, 0.95)',
              border: '1px solid rgba(100, 116, 139, 0.5)',
              borderRadius: '8px',
              zIndex: 10,
              maxHeight: '250px',
              overflowY: 'auto'
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
                  transition: 'background 0.15s ease',
                  borderBottom: '1px solid rgba(100, 116, 139, 0.2)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(100, 116, 139, 0.3)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
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
      <button
        onClick={onBack}
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
          transition: 'opacity 0.2s ease'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.opacity = 1 }}
        onMouseLeave={(e) => { e.currentTarget.style.opacity = 0.7 }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Back
      </button>

      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', flex: 1 }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 700,
          marginBottom: '0.75rem',
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
        }}>
          Validate Your Information
        </h1>

        <p style={{
          fontSize: '1.125rem',
          opacity: 0.7,
          marginBottom: '3rem',
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
        }}>
          Please verify the details we extracted from your transcript
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem',
          marginBottom: '3rem',
          alignItems: 'flex-end'
        }}>
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
            <button
              onClick={handleContinue}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '48px',
                height: '48px',
                padding: 0,
                background: '#4ade80',
                border: 'none',
                borderRadius: '8px',
                color: '#ffffff',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                marginBottom: 0
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#22c55e'
                e.currentTarget.style.transform = 'translateX(4px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#4ade80'
                e.currentTarget.style.transform = 'translateX(0)'
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
