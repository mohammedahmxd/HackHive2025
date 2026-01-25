import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { AppProvider } from './context/AppContext'
import ValidationPage from './components/ValidationPage'
import LandingPage from './components/LandingPage'
import DashboardPage from './components/DashboardPage'

function App() {
  const [currentPage, setCurrentPage] = useState('landing')

  const handleUploadClick = (file) => {
    console.log('File selected:', file)
    setCurrentPage('validation')
  }

  const handleBack = () => {
    setCurrentPage('landing')
  }

  const handleContinue = () => {
    setCurrentPage('dashboard')
  }

  return (
    <AppProvider>
      <div className="app">
        <AnimatePresence mode="wait">
          {currentPage === 'landing' && (
            <LandingPage key="landing" onUpload={handleUploadClick} />
          )}
          {currentPage === 'validation' && (
            <ValidationPage key="validation" onBack={handleBack} onContinue={handleContinue} />
          )}
          {currentPage === 'dashboard' && (
            <DashboardPage key="dashboard" onBack={() => setCurrentPage('validation')} />
          )}
        </AnimatePresence>
      </div>
    </AppProvider>
  )
}

export default App
