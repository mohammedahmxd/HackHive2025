import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAppContext } from '../context/AppContext'

export default function ProfessorRecommendationsPage({ onBack }) {
  const { program } = useAppContext()
  const [allProfessors, setAllProfessors] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('rating') // 'rating', 'difficulty', 'numRatings'
  const [includeRelated, setIncludeRelated] = useState(true) // Include related disciplines
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const LIMIT = 100

  const fetchProfessors = async (isLoadMore = false) => {
    if (isLoadMore) {
      setLoadingMore(true)
    } else {
      setLoading(true)
      setOffset(0)
      setAllProfessors([])
    }
    setError(null)

    try {
      const currentOffset = isLoadMore ? offset : 0
      const response = await fetch(`http://localhost:8000/professors/top?limit=${LIMIT + currentOffset}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch professors')
      }

      const data = await response.json()
      console.log('Received professors:', data.count, 'professors')

      const newProfessors = data.professors || []
      const techProfs = newProfessors.filter(p => {
        const dept = p.department.toLowerCase()
        return dept.includes('computer science') ||
          dept.includes('computer sci') ||
          dept.includes('software') ||
          dept.includes('engineering') ||
          dept.includes('mathematics') ||
          dept.includes('math') ||
          dept.includes('statistics') ||
          dept.includes('data science') ||
          dept.includes('information') ||
          dept.includes('physics') ||
          dept.includes('technology')
      })
      console.log('Tech-related professors:', techProfs.length)
      console.log('Departments:', [...new Set(techProfs.map(p => p.department))])

      setAllProfessors(newProfessors)
      setOffset(currentOffset + LIMIT)

      // Check if there are more professors to load
      if (newProfessors.length < currentOffset + LIMIT) {
        setHasMore(false)
      }
    } catch (err) {
      setError(err.message)
      console.error('Error fetching professors:', err)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  useEffect(() => {
    fetchProfessors()
  }, [])

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight

      // Load more when user is 300px from bottom
      if (scrollTop + windowHeight >= documentHeight - 300 && !loadingMore && !loading && hasMore) {
        fetchProfessors(true)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [loadingMore, loading, hasMore, offset])

  const handleSearch = (e) => {
    e.preventDefault()
  }

  // Filter professors based on search query and departments (client-side filtering)
  const filteredProfessors = allProfessors.filter(prof => {
    const dept = prof.department.toLowerCase()

    // First filter: Department filtering based on includeRelated toggle
    const isCS = dept.includes('computer science') || dept.includes('computer sci')

    if (includeRelated) {
      // Include CS and related tech departments
      const isTechRelated =
        isCS ||
        dept.includes('software') ||
        dept.includes('engineering') ||
        dept.includes('mathematics') ||
        dept.includes('math') ||
        dept.includes('statistics') ||
        dept.includes('data science') ||
        dept.includes('information') ||
        dept.includes('physics') ||
        dept.includes('technology')

      if (!isTechRelated) return false
    } else {
      // Only Computer Science
      if (!isCS) return false
    }

    // Second filter: apply search query if exists
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      return (
        prof.firstName.toLowerCase().includes(query) ||
        prof.lastName.toLowerCase().includes(query)
      )
    }

    return true
  })

  // Sort professors based on selected option
  const sortedProfessors = [...filteredProfessors].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.avgRating - a.avgRating
      case 'difficulty':
        return a.avgDifficulty - b.avgDifficulty // Lower difficulty first
      case 'numRatings':
        return b.numRatings - a.numRatings
      default:
        return 0
    }
  })

  const professors = sortedProfessors

  const getRatingColor = (rating) => {
    if (rating >= 4.0) return '#4ade80' // green
    if (rating >= 3.0) return '#fbbf24' // yellow
    return '#f87171' // red
  }

  const getDifficultyColor = (difficulty) => {
    if (difficulty >= 4.0) return '#f87171' // red (very hard)
    if (difficulty >= 3.0) return '#fbbf24' // yellow (moderate)
    return '#4ade80' // green (easy)
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
      {/* Back Button */}
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

      <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%', flex: 1 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{ marginBottom: '2rem' }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            {/* Rate My Professor Icon */}
            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#FFD60A' }}>
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
            </svg>
            <div>
              <h1 style={{
                fontSize: '2.5rem',
                fontWeight: 700,
                marginBottom: '0.5rem',
                fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                color: 'var(--gold-bright)'
              }}>
                Professor Recommendations
              </h1>
              <p style={{
                fontSize: '1.125rem',
                opacity: 0.7,
                fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                color: '#ffffff'
              }}>
                Ontario Tech University • Computer Science
              </p>
            </div>
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.form
          onSubmit={handleSearch}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            marginBottom: '1.5rem',
            background: 'linear-gradient(135deg, rgba(1, 58, 99, 0.3) 0%, rgba(0, 53, 102, 0.4) 100%)',
            border: '1px solid var(--blue-medium)',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
          }}
        >
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a professor by name..."
              style={{
                flex: 1,
                padding: '0.875rem 1.25rem',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--blue-medium)',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '1rem',
                fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                outline: 'none',
                transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--gold-bright)'
                e.target.style.boxShadow = '0 0 0 3px rgba(255, 214, 10, 0.1)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--blue-medium)'
                e.target.style.boxShadow = 'none'
              }}
            />
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '0.875rem 2rem',
                background: 'linear-gradient(135deg, var(--gold-bright) 0%, var(--gold-medium) 100%)',
                border: 'none',
                borderRadius: '8px',
                color: 'var(--blue-dark)',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                boxShadow: '0 4px 20px rgba(255, 214, 10, 0.4)',
                transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
              }}
            >
              Search
            </motion.button>
            {searchQuery && (
              <motion.button
                type="button"
                onClick={() => setSearchQuery('')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: '0.875rem 1.5rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--blue-medium)',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                  transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                }}
              >
                Clear
              </motion.button>
            )}
          </div>
        </motion.form>

        {/* Sort and Filter Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          style={{
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <label style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'rgba(255, 255, 255, 0.8)',
              fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
            }}>
              Sort by:
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '0.75rem 1rem',
                background: 'linear-gradient(135deg, rgba(1, 58, 99, 0.3) 0%, rgba(0, 53, 102, 0.4) 100%)',
                border: '1px solid var(--blue-medium)',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '0.875rem',
                fontWeight: 600,
                fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                cursor: 'pointer',
                outline: 'none',
                transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--gold-bright)'
                e.target.style.boxShadow = '0 0 0 3px rgba(255, 214, 10, 0.1)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--blue-medium)'
                e.target.style.boxShadow = 'none'
              }}
            >
              <option value="rating" style={{ background: '#001529', color: '#ffffff' }}>Highest Rating</option>
              <option value="difficulty" style={{ background: '#001529', color: '#ffffff' }}>Lowest Difficulty</option>
              <option value="numRatings" style={{ background: '#001529', color: '#ffffff' }}>Most Ratings</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <label style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'rgba(255, 255, 255, 0.8)',
              fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
            }}>
              Disciplines:
            </label>
            <select
              value={includeRelated ? 'all' : 'cs'}
              onChange={(e) => setIncludeRelated(e.target.value === 'all')}
              style={{
                padding: '0.75rem 1rem',
                background: 'linear-gradient(135deg, rgba(1, 58, 99, 0.3) 0%, rgba(0, 53, 102, 0.4) 100%)',
                border: '1px solid var(--blue-medium)',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '0.875rem',
                fontWeight: 600,
                fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                cursor: 'pointer',
                outline: 'none',
                transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--gold-bright)'
                e.target.style.boxShadow = '0 0 0 3px rgba(255, 214, 10, 0.1)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--blue-medium)'
                e.target.style.boxShadow = 'none'
              }}
            >
              <option value="cs" style={{ background: '#001529', color: '#ffffff' }}>Computer Science Only</option>
              <option value="all" style={{ background: '#001529', color: '#ffffff' }}>All Related Disciplines</option>
            </select>
          </div>

          <div style={{
            fontSize: '0.875rem',
            color: 'rgba(255, 255, 255, 0.6)',
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
            marginLeft: 'auto'
          }}>
            Showing {professors.length} professor{professors.length !== 1 ? 's' : ''}
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              textAlign: 'center',
              padding: '4rem',
              color: 'var(--gold-bright)',
              fontSize: '1.25rem',
              fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
            }}
          >
            <div style={{ marginBottom: '1rem' }}>Loading professors...</div>
          </motion.div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              padding: '2rem',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '12px',
              color: '#ef4444',
              fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
            }}
          >
            <strong>Error:</strong> {error}
          </motion.div>
        )}

        {/* Professors Grid */}
        {!loading && !error && professors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '1.5rem'
            }}
          >
            {professors.map((prof, index) => (
              <motion.a
                key={prof.id || index}
                href={`https://www.ratemyprofessors.com/professor/${prof.id}`}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -4, scale: 1.02 }}
                style={{
                  textDecoration: 'none',
                  background: 'linear-gradient(135deg, rgba(1, 58, 99, 0.3) 0%, rgba(0, 53, 102, 0.4) 100%)',
                  border: '1px solid var(--blue-medium)',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--gold-bright)'
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(255, 214, 10, 0.2)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--blue-medium)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                {/* Professor Name */}
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: 'var(--gold-bright)',
                  fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                  margin: 0,
                  lineHeight: 1.3
                }}>
                  {prof.firstName} {prof.lastName}
                </h3>

                {/* Department */}
                <div style={{
                  fontSize: '0.875rem',
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
                }}>
                  {prof.department}
                </div>

                {/* Ratings Section */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem',
                  marginTop: '0.5rem'
                }}>
                  {/* Overall Rating */}
                  <div style={{
                    background: 'rgba(0, 0, 0, 0.2)',
                    borderRadius: '8px',
                    padding: '1rem',
                    textAlign: 'center'
                  }}>
                    <div style={{
                      fontSize: '2rem',
                      fontWeight: 700,
                      color: getRatingColor(prof.avgRating),
                      fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
                    }}>
                      {prof.avgRating.toFixed(1)}
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: 'rgba(255, 255, 255, 0.5)',
                      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                      marginTop: '0.25rem'
                    }}>
                      Quality
                    </div>
                  </div>

                  {/* Difficulty */}
                  <div style={{
                    background: 'rgba(0, 0, 0, 0.2)',
                    borderRadius: '8px',
                    padding: '1rem',
                    textAlign: 'center'
                  }}>
                    <div style={{
                      fontSize: '2rem',
                      fontWeight: 700,
                      color: getDifficultyColor(prof.avgDifficulty),
                      fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
                    }}>
                      {prof.avgDifficulty.toFixed(1)}
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: 'rgba(255, 255, 255, 0.5)',
                      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                      marginTop: '0.25rem'
                    }}>
                      Difficulty
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div style={{
                  display: 'flex',
                  gap: '1rem',
                  fontSize: '0.875rem',
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                  paddingTop: '0.5rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <span>{prof.numRatings} ratings</span>
                  {prof.wouldTakeAgainPercent !== null && (
                    <>
                      <span>•</span>
                      <span>{prof.wouldTakeAgainPercent}% would take again</span>
                    </>
                  )}
                </div>
              </motion.a>
            ))}
          </motion.div>
        )}

        {/* No Professors */}
        {!loading && !error && professors.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              textAlign: 'center',
              padding: '4rem',
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '1.125rem',
              fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
            }}
          >
            {searchQuery.trim()
              ? `No professors found for "${searchQuery}". Try a different search.`
              : 'No professors found.'
            }
          </motion.div>
        )}

        {/* Loading More Indicator */}
        {loadingMore && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              textAlign: 'center',
              padding: '2rem',
              color: 'var(--gold-bright)',
              fontSize: '1rem',
              fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
            }}
          >
            Loading more professors...
          </motion.div>
        )}

        {/* End of Results */}
        {!loading && !loadingMore && !hasMore && professors.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              textAlign: 'center',
              padding: '2rem',
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: '0.875rem',
              fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
            }}
          >
            You've reached the end of the list
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
