import { motion } from 'framer-motion'
import { useRef, useState } from 'react'
import logo from '../images/PathPilot.png'
import { useAppContext } from '../context/AppContext'

export default function LandingPage({ onUpload }) {
  const fileInputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const { setTranscriptFile } = useAppContext()

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
        // Save to global state
        setTranscriptFile(file)
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
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '2rem',
        textAlign: 'center'
      }}
    >
      <motion.img
        src={logo}
        alt="PathPilot Logo"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{
          position: 'relative',
          zIndex: 1,
          width: '120px',
          height: '120px',
          marginBottom: '1.5rem'
        }}
      />

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        style={{
          position: 'relative',
          zIndex: 1,
          fontSize: '4rem',
          fontWeight: 700,
          letterSpacing: '-0.02em',
          marginBottom: '1rem',
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
          color: 'var(--gold-bright)'
        }}
      >
        PathPilot
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        style={{
          position: 'relative',
          zIndex: 1,
          fontSize: '1.25rem',
          fontWeight: 400,
          marginBottom: '3rem',
          maxWidth: '600px',
          lineHeight: '1.6',
          opacity: 0.9,
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
        }}
      >
        Navigate your academic journey and discover your career path
      </motion.p>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      <motion.button
        onClick={handleButtonClick}
        disabled={uploading}
        whileHover={!uploading ? { scale: 1.05, y: -2 } : {}}
        whileTap={!uploading ? { scale: 0.98 } : {}}
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75rem',
          padding: '1rem 2rem',
          fontSize: '1.05rem',
          fontWeight: 600,
          border: 'none',
          borderRadius: '12px',
          background: uploading
            ? 'var(--gray-medium)'
            : 'linear-gradient(135deg, var(--gold-bright) 0%, var(--gold-medium) 100%)',
          color: uploading ? '#ffffff' : 'var(--blue-dark)',
          cursor: uploading ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
          boxShadow: uploading
            ? 'none'
            : '0 4px 20px rgba(255, 214, 10, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="17 8 12 3 7 8"></polyline>
          <line x1="12" y1="3" x2="12" y2="15"></line>
        </svg>
        {uploading ? 'Uploading...' : 'Upload Transcript'}
      </motion.button>
    </motion.div>
  )
}
