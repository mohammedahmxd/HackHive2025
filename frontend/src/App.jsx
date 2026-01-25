import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { AppProvider, useAppContext } from './context/AppContext'
import ValidationPage from './components/ValidationPage'
import LandingPage from './components/LandingPage'
import CareerSelectionPage from './components/CareerSelectionPage'
import DashboardPage from './components/DashboardPage'

function AppContent() {
  const [currentPage, setCurrentPage] = useState('landing')
  const { setSelectedCareer, setCareerPath } = useAppContext()

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
    <div className="app">
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
