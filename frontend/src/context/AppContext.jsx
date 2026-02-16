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
  const [transcriptData, setTranscriptData] = useState(null) // Parsed transcript from backend
  const [university, setUniversity] = useState(null)
  const [program, setProgram] = useState(null)
  const [transcriptType, setTranscriptType] = useState(null)
  const [language, setLanguage] = useState(null)
  const [academicYear, setAcademicYear] = useState(null)
  const [careerPath, setCareerPath] = useState(null)
  const [careerRecommendations, setCareerRecommendations] = useState([]) // 3 career options from Gemini
  const [selectedCareer, setSelectedCareer] = useState(null) // Full career object with description
  const [courses, setCourses] = useState([]) // Parsed courses from transcript
  const [enrichedCourses, setEnrichedCourses] = useState([]) // Enriched courses with catalog data
  const [programSlug, setProgramSlug] = useState(null) // Program slug for API lookups (e.g. 'computer_sci')

  // Accessibility settings
  const [highContrast, setHighContrast] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)

  const value = {
    transcriptFile,
    setTranscriptFile,
    transcriptData,
    setTranscriptData,
    university,
    setUniversity,
    program,
    setProgram,
    transcriptType,
    setTranscriptType,
    language,
    setLanguage,
    academicYear,
    setAcademicYear,
    careerPath,
    setCareerPath,
    careerRecommendations,
    setCareerRecommendations,
    selectedCareer,
    setSelectedCareer,
    courses,
    setCourses,
    enrichedCourses,
    setEnrichedCourses,
    programSlug,
    setProgramSlug,
    highContrast,
    setHighContrast,
    reduceMotion,
    setReduceMotion
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
