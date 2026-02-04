import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { ontarioTechCSCourses } from '../data/courseGraphData'

const NON_EARNED_GRADES = new Set(['F', 'WD', 'W', 'NC', 'IP', 'CO'])
const IN_PROGRESS_GRADES = new Set(['IP', 'CO'])

const normalizeCourseCode = (code) => (code || '').replace(/\s+/g, '').toUpperCase()

const totalRequiredCredits = ontarioTechCSCourses.reduce(
  (sum, course) => sum + (course.credits || 0),
  0
)

const seasonRank = {
  Winter: 1,
  'Spring/Summer': 2,
  Spring: 2,
  Summer: 3,
  Fall: 4
}

const getLatestTerm = (courses) => {
  let latest = null
  let latestRank = -1

  courses.forEach((course) => {
    const term = course.term
    if (!term) return
    const match = term.match(/(Fall|Winter|Spring\/Summer|Spring|Summer)\s*(\d{4})/i)
    if (!match) return
    const season = match[1].replace(/\s+/g, '')
    const seasonKey = season === 'Spring/Summer' ? 'Spring/Summer' : season
    const year = Number(match[2])
    const rank = year * 10 + (seasonRank[seasonKey] || 0)
    if (rank > latestRank) {
      latestRank = rank
      latest = `${seasonKey} ${year}`
    }
  })

  return latest
}

const MetricCard = ({ label, value, detail, accent }) => (
  <motion.div
    whileHover={{ y: -6 }}
    transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
    style={{
      background: 'linear-gradient(135deg, rgba(7, 42, 74, 0.7) 0%, rgba(3, 25, 46, 0.9) 100%)',
      borderRadius: '18px',
      padding: '1.5rem',
      border: `1px solid ${accent}`,
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem'
    }}
  >
    <div style={{
      fontSize: '0.85rem',
      fontWeight: 600,
      color: 'rgba(255, 255, 255, 0.7)',
      textTransform: 'uppercase',
      letterSpacing: '0.08em'
    }}>
      {label}
    </div>
    <div style={{
      fontSize: '2.25rem',
      fontWeight: 700,
      color: '#ffffff',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      letterSpacing: '-0.02em'
    }}>
      {value}
    </div>
    <div style={{
      fontSize: '0.95rem',
      color: 'rgba(255, 255, 255, 0.65)',
      lineHeight: 1.5
    }}>
      {detail}
    </div>
  </motion.div>
)

const ProgressBar = ({ label, value, helper, accent }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      color: 'rgba(255, 255, 255, 0.7)',
      fontSize: '0.9rem',
      fontWeight: 600
    }}>
      <span>{label}</span>
      <span style={{ color: '#ffffff', fontSize: '1.1rem' }}>{value}%</span>
    </div>
    <div style={{
      width: '100%',
      height: '10px',
      borderRadius: '999px',
      background: 'rgba(255, 255, 255, 0.1)',
      overflow: 'hidden'
    }}>
      <div style={{
        width: `${value}%`,
        height: '100%',
        background: accent,
        borderRadius: '999px',
        transition: 'width 0.6s ease'
      }} />
    </div>
    <div style={{ color: 'rgba(255, 255, 255, 0.55)', fontSize: '0.85rem' }}>
      {helper}
    </div>
  </div>
)

export default function DataDashboard() {
  const [transcriptData, setTranscriptData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    const fetchTranscript = async () => {
      try {
        setLoading(true)
        const response = await fetch('http://localhost:8000/transcripts/latest')
        if (!response.ok) {
          throw new Error('Transcript data unavailable')
        }
        const data = await response.json()
        if (isMounted) {
          setTranscriptData(data)
          setError(null)
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Unable to load transcript data')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchTranscript()

    return () => {
      isMounted = false
    }
  }, [])

  const metrics = useMemo(() => {
    const courses = transcriptData?.courses || []
    const completedCourses = courses.filter(course => (
      course.course_code &&
      course.grade &&
      !NON_EARNED_GRADES.has(course.grade.toUpperCase())
    ))
    const inProgressCourses = courses.filter(course => (
      course.course_code &&
      (!course.grade || IN_PROGRESS_GRADES.has(course.grade.toUpperCase()))
    ))
    const matchedCatalog = new Set()

    completedCourses.forEach((course) => {
      const normalized = normalizeCourseCode(course.course_code)
      if (!normalized) return
      const match = ontarioTechCSCourses.find(item => (
        normalizeCourseCode(item.id) === normalized ||
        normalizeCourseCode(item.code) === normalized
      ))
      if (match) {
        matchedCatalog.add(match.id)
      }
    })

    const completedCount = matchedCatalog.size
    const totalCourses = ontarioTechCSCourses.length
    const remainingCount = Math.max(totalCourses - completedCount, 0)
    const completionRate = totalCourses ? Math.round((completedCount / totalCourses) * 100) : 0
    const creditsEarned = Number(transcriptData?.total_credits_earned || 0)
    const creditsRate = totalRequiredCredits
      ? Math.min(100, Math.round((creditsEarned / totalRequiredCredits) * 100))
      : 0
    const latestTerm = getLatestTerm(courses)
    const matchRate = courses.length
      ? Math.round((matchedCatalog.size / courses.length) * 100)
      : 0

    return {
      completedCount,
      remainingCount,
      completionRate,
      creditsEarned,
      creditsRate,
      totalCourses,
      inProgressCount: inProgressCourses.length,
      latestTerm,
      matchRate
    }
  }, [transcriptData])

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        marginTop: '3.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem'
      }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div>
          <div style={{
            fontSize: '1.4rem',
            fontWeight: 700,
            color: '#ffffff',
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
          }}>
            Progress Intelligence
          </div>
          <div style={{
            fontSize: '1rem',
            color: 'rgba(255, 255, 255, 0.7)',
            marginTop: '0.35rem'
          }}>
            Live metrics from your parsed transcript and catalog data.
          </div>
        </div>
        <div style={{
          padding: '0.5rem 1rem',
          borderRadius: '999px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: '0.85rem',
          fontWeight: 600
        }}>
          Latest term: {metrics.latestTerm || 'N/A'}
        </div>
      </div>

      {loading && (
        <div style={{
          padding: '2rem',
          textAlign: 'center',
          color: 'rgba(255, 255, 255, 0.7)',
          background: 'rgba(6, 32, 58, 0.7)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          Fetching transcript metrics...
        </div>
      )}

      {!loading && error && (
        <div style={{
          padding: '2rem',
          textAlign: 'center',
          color: 'rgba(255, 255, 255, 0.8)',
          background: 'rgba(64, 30, 24, 0.7)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 153, 102, 0.6)'
        }}>
          {error}. Upload a transcript to generate dashboard metrics.
        </div>
      )}

      {!loading && !error && (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.5rem'
          }}>
            <MetricCard
              label="Courses completed"
              value={metrics.completedCount}
              detail={`Out of ${metrics.totalCourses} required courses`}
              accent="rgba(255, 214, 10, 0.6)"
            />
            <MetricCard
              label="Courses remaining"
              value={metrics.remainingCount}
              detail="Based on the Ontario Tech CS catalog"
              accent="rgba(71, 167, 255, 0.6)"
            />
            <MetricCard
              label="Credits earned"
              value={metrics.creditsEarned.toFixed(1)}
              detail={`Credits needed for degree: ${totalRequiredCredits.toFixed(1)}`}
              accent="rgba(110, 231, 183, 0.6)"
            />
            <MetricCard
              label="In progress"
              value={metrics.inProgressCount}
              detail="Courses without final grades yet"
              accent="rgba(248, 113, 113, 0.6)"
            />
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
            background: 'linear-gradient(135deg, rgba(3, 25, 46, 0.9) 0%, rgba(7, 42, 74, 0.8) 100%)',
            borderRadius: '20px',
            padding: '2rem',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 18px 40px rgba(0, 0, 0, 0.3)'
          }}>
            <ProgressBar
              label="Course completion"
              value={metrics.completionRate}
              helper={`${metrics.completedCount} courses matched to catalog`}
              accent="linear-gradient(135deg, var(--gold-bright) 0%, var(--gold-medium) 100%)"
            />
            <ProgressBar
              label="Credit completion"
              value={metrics.creditsRate}
              helper={`${metrics.creditsEarned.toFixed(1)} earned credits`}
              accent="linear-gradient(135deg, #38bdf8 0%, #2563eb 100%)"
            />
            <ProgressBar
              label="Catalog match rate"
              value={metrics.matchRate}
              helper="Transcript courses mapped to program catalog"
              accent="linear-gradient(135deg, #34d399 0%, #10b981 100%)"
            />
          </div>
        </>
      )}
    </motion.section>
  )
}
