import { createContext, useContext, useState } from 'react'

const AppContext = createContext()

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}

export const AppProvider = ({ children }) => {
  const [transcriptFile, setTranscriptFile] = useState(null)
  const [university, setUniversity] = useState(null)
  const [program, setProgram] = useState(null)
  const [transcriptType, setTranscriptType] = useState(null)
  const [language, setLanguage] = useState(null)
  const [academicYear, setAcademicYear] = useState(null)

  const value = {
    transcriptFile,
    setTranscriptFile,
    university,
    setUniversity,
    program,
    setProgram,
    transcriptType,
    setTranscriptType,
    language,
    setLanguage,
    academicYear,
    setAcademicYear
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
