import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { AppProvider, useAppContext } from './context/AppContext'
import ValidationPage from './components/ValidationPage'
import LandingPage from './components/LandingPage'
import CareerSelectionPage from './components/CareerSelectionPage'
import DashboardPage from './components/DashboardPage'
import AccessibilitySettings from './components/AccessibilitySettings'

function AppContent() {
  const [currentPage, setCurrentPage] = useState('landing')
  const { setSelectedCareer, setCareerPath, highContrast, reduceMotion } = useAppContext()

  const handleUploadClick = (file) => {
    console.log('File selected:', file)
    setCurrentPage('validation')
  }

  const handleValidationBack = () => {
    setCurrentPage('landing')
  }

  const handleValidationContinue = () => {
    setCurrentPage('career-selection')
  }

  const handleCareerSelectionBack = () => {
    setCurrentPage('validation')
  }

  const handleSelectCareer = (career) => {
    console.log('Selected career:', career)
    setSelectedCareer(career)
    setCareerPath(career.title)
    setCurrentPage('dashboard')
  }

  return (
    <div
      className="app"
      style={{
        background: highContrast
          ? '#000000'
          : 'linear-gradient(180deg, #00111F 0%, #001428 100%)',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
        transition: reduceMotion ? 'none' : 'background 0.3s ease'
      }}
    >
      <AnimatePresence mode="wait">
        {currentPage === 'landing' && (
          <LandingPage key="landing" onUpload={handleUploadClick} />
        )}
        {currentPage === 'validation' && (
          <ValidationPage key="validation" onBack={handleValidationBack} onContinue={handleValidationContinue} />
        )}
        {currentPage === 'career-selection' && (
          <CareerSelectionPage key="career-selection" onBack={handleCareerSelectionBack} onSelectCareer={handleSelectCareer} />
        )}
        {currentPage === 'dashboard' && (
          <DashboardPage key="dashboard" onBack={() => setCurrentPage('career-selection')} />
        )}
      </AnimatePresence>
      <AccessibilitySettings />
    </div>
  )
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}

export default App
