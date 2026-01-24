import { motion } from 'framer-motion'
import { useRef, useState } from 'react'

export default function LandingPage({ onUpload }) {
  const fileInputRef = useRef(null)
  const [uploading, setUploading] = useState(false)

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploading(true)

      // Send file to backend MVC endpoint
      const formData = new FormData()
      formData.append('file', file)

      try {
        const response = await fetch('http://localhost:8000/transcripts/parse', {
          method: 'POST',
          body: formData,
        })

        const data = await response.json()

        console.log('Transcript parsed:', data)
        // Move to validation page
        onUpload(file)
      } catch (error) {
        console.error('Error uploading file:', error)
        alert('Error connecting to server. Make sure the backend is running.')
      } finally {
        setUploading(false)
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '2rem',
        textAlign: 'center'
      }}
    >
      <h1 style={{
        fontSize: '4rem',
        fontWeight: 700,
        letterSpacing: '-0.02em',
        marginBottom: '1rem',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
      }}>
        PathPilot
      </h1>

      <p style={{
        fontSize: '1.25rem',
        fontWeight: 400,
        marginBottom: '3rem',
        maxWidth: '600px',
        lineHeight: '1.6',
        opacity: 0.9,
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
      }}>
        Navigate your academic journey and discover your career path
      </p>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      <button
        onClick={handleButtonClick}
        disabled={uploading}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75rem',
          padding: '0.875rem 1.75rem',
          fontSize: '1rem',
          fontWeight: 500,
          border: 'none',
          borderRadius: '8px',
          background: uploading ? '#9ca3af' : '#6366f1',
          color: '#ffffff',
          cursor: uploading ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease',
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
        }}
        onMouseEnter={(e) => {
          if (!uploading) {
            e.currentTarget.style.background = '#4f46e5';
            e.currentTarget.style.transform = 'scale(1.02)';
          }
        }}
        onMouseLeave={(e) => {
          if (!uploading) {
            e.currentTarget.style.background = '#6366f1';
            e.currentTarget.style.transform = 'scale(1)';
          }
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="17 8 12 3 7 8"></polyline>
          <line x1="12" y1="3" x2="12" y2="15"></line>
        </svg>
        {uploading ? 'Uploading...' : 'Upload Transcript'}
      </button>
    </motion.div>
  )
}
