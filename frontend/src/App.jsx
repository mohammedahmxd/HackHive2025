import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import ValidationPage from './components/ValidationPage'
import LandingPage from './components/LandingPage'

function App() {
  const [currentPage, setCurrentPage] = useState('landing')
  const [transcriptData, setTranscriptData] = useState(null)

  const handleUploadClick = (file) => {
    // TODO: When backend is ready, send file to /api/parse-transcript
    console.log('File selected:', file)
    setTranscriptData({ file })
    setCurrentPage('validation')
  }

  const handleBack = () => {
    setCurrentPage('landing')
    setTranscriptData(null)
  }

  const handleContinue = (validationData) => {
    // TODO: When backend is ready, send validationData to /api/generate-schedule
    console.log('Validation data:', validationData)
    setCurrentPage('dashboard')
  }

  return (
    <div className="app">
      <AnimatePresence mode="wait">
        {currentPage === 'landing' && (
          <LandingPage key="landing" onUpload={handleUploadClick} />
        )}
        {currentPage === 'validation' && (
          <ValidationPage key="validation" onBack={handleBack} onContinue={handleContinue} />
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
