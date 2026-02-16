import { useMemo, useState, useCallback, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  MarkerType,
  Handle,
  Position
} from 'reactflow';
import 'reactflow/dist/style.css';
import { motion } from 'framer-motion';
import {
  ontarioTechCSCourses,
  mockStudentProgress,
  getCourseStatus,
  CourseStatus
} from '../data/courseGraphData';
import { useAppContext } from '../context/AppContext';
import { getSchoolKey } from '../data/schoolMapping';

// Custom node with handles for connections
function CourseNode({ data }) {
  const { course, status, onRemove } = data;

  const statusStyles = {
    [CourseStatus.COMPLETED]: {
      background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
      border: '2px solid #34d399',
      boxShadow: '0 0 15px rgba(52, 211, 153, 0.6)',
      color: '#ffffff'
    },
    [CourseStatus.IN_PROGRESS]: {
      background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
      border: '2px solid #60a5fa',
      boxShadow: '0 0 15px rgba(96, 165, 250, 0.6)',
      color: '#ffffff'
    },
    [CourseStatus.RECOMMENDED]: {
      background: 'linear-gradient(135deg, #14532d 0%, #166534 100%)',
      border: '2px dashed #22c55e',
      boxShadow: '0 0 10px rgba(34, 197, 94, 0.4)',
      color: '#bbf7d0'
    },
    [CourseStatus.NOT_TAKEN]: {
      background: 'linear-gradient(135deg, #18181b 0%, #27272a 100%)',
      border: '1px solid #3f3f46',
      boxShadow: 'none',
      color: '#71717a'
    }
  };

  const style = statusStyles[status] || statusStyles[CourseStatus.NOT_TAKEN];

  return (
    <div
      style={{
        padding: '10px 14px',
        borderRadius: '8px',
        background: style.background,
        border: style.border,
        boxShadow: style.boxShadow,
        width: '130px',
        fontFamily: 'Inter, system-ui, sans-serif',
        position: 'relative'
      }}
    >
      {/* Remove button */}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(course.id);
          }}
          style={{
            position: 'absolute',
            top: '-3px',
            right: '-3px',
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: '#ef4444',
            border: '1px solid #ffffff',
            color: '#ffffff',
            fontSize: '8px',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            transition: 'all 0.2s ease',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
            lineHeight: '1'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#dc2626';
            e.target.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = '#ef4444';
            e.target.style.transform = 'scale(1)';
          }}
          title="Remove course"
        >
          ×
        </button>
      )}

      {/* Connection handles */}
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: '#52525b',
          border: '2px solid #27272a',
          width: 8,
          height: 8
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: '#52525b',
          border: '2px solid #27272a',
          width: 8,
          height: 8
        }}
      />

      <div style={{
        fontSize: '9px',
        fontWeight: 700,
        color: style.color,
        opacity: 0.9,
        letterSpacing: '0.3px',
        marginBottom: '3px'
      }}>
        {course.code}
      </div>
      <div style={{
        fontSize: '10px',
        fontWeight: 500,
        color: style.color,
        lineHeight: 1.25
      }}>
        {course.name}
      </div>
    </div>
  );
}

const nodeTypes = { courseNode: CourseNode };

// Define course sets for each tab (Ontario Tech)
const ontarioTechCourseSets = {
  all: {
    label: 'All Courses',
    ids: [
      // Year 1 Core
      'MATH1010U', 'MATH1020U', 'PHY1010U', 'PHY1020U',
      'CSCI1030U', 'CSCI1060U', 'CSCI1061U', 'CSCI2050U',
      // Year 2 Core
      'CSCI2000U', 'CSCI2010U', 'CSCI2020U', 'CSCI2040U',
      'CSCI2072U', 'CSCI2110U', 'MATH2050U', 'STAT2010U',
      // Year 3-4 Core
      'CSCI3070U', 'CSCI4040U',
      // AI/Data electives
      'CSCI3010U', 'CSCI3030U', 'CSCI4030U', 'CSCI4050U', 'CSCI4610U',
      // Graphics electives
      'CSCI3090U', 'CSCI4110U', 'CSCI4210U', 'CSCI4220U',
      // Web/Mobile electives
      'CSCI3230U', 'CSCI4100U', 'CSCI4160U', 'CSCI4620U',
      // Languages/Software electives
      'CSCI3055U', 'CSCI3060U', 'CSCI4020U', 'CSCI4060U',
      // Systems electives
      'CSCI3020U', 'CSCI3150U', 'CSCI3310U', 'CSCI4310U',
      // Thesis
      'CSCI4410U', 'CSCI4420U',
      // Business & Comm
      'BUSI1600U', 'COMM1050U'
    ]
  },
  aiData: {
    label: 'AI & Data',
    ids: [
      'CSCI1060U', 'CSCI1061U', 'CSCI2010U', 'CSCI2110U',
      'MATH2050U', 'STAT2010U', 'CSCI3070U',
      'CSCI3010U', 'CSCI3030U', 'CSCI4030U', 'CSCI4050U', 'CSCI4610U'
    ]
  },
  graphics: {
    label: 'Graphics & Vision',
    ids: [
      'CSCI1060U', 'CSCI1061U', 'CSCI2010U', 'MATH2050U', 'CSCI3070U',
      'CSCI3090U', 'CSCI4110U', 'CSCI4210U', 'CSCI4220U'
    ]
  },
  webMobile: {
    label: 'Web & Mobile',
    ids: [
      'CSCI1060U', 'CSCI1061U', 'CSCI2010U', 'CSCI2020U', 'CSCI2040U',
      'CSCI3230U', 'CSCI4100U', 'CSCI4160U', 'CSCI4620U'
    ]
  },
  systems: {
    label: 'Systems & Networks',
    ids: [
      'CSCI1030U', 'CSCI1060U', 'CSCI1061U', 'CSCI2010U', 'CSCI2050U',
      'CSCI3020U', 'CSCI3150U', 'CSCI3310U', 'CSCI4310U'
    ]
  },
  languages: {
    label: 'Languages & Compilers',
    ids: [
      'CSCI1060U', 'CSCI1061U', 'CSCI2010U', 'CSCI2040U', 'CSCI3070U',
      'CSCI3055U', 'CSCI3060U', 'CSCI4020U', 'CSCI4060U'
    ]
  }
};

function generateGraphData(courseIds, studentProgress, isAllTab = false, onRemoveCourse = null, allCourses = ontarioTechCSCourses) {
  const courses = allCourses.filter(c => courseIds.includes(c.id));
  const courseIdSet = new Set(courseIds);

  // Group by year
  const yearGroups = {};
  courses.forEach(course => {
    const year = course.year;
    if (!yearGroups[year]) yearGroups[year] = [];
    yearGroups[year].push(course);
  });

  // Generate nodes
  const nodes = [];
  const xSpacing = isAllTab ? 220 : 200;
  const ySpacing = isAllTab ? 70 : 85;
  const containerHeight = isAllTab ? 650 : 500;

  Object.keys(yearGroups)
    .sort((a, b) => Number(a) - Number(b))
    .forEach((year, yearIndex) => {
      const yearCourses = yearGroups[year];
      const columnX = yearIndex * xSpacing + 80;

      // Center the courses vertically
      const totalHeight = (yearCourses.length - 1) * ySpacing;
      const startY = Math.max(60, (containerHeight - totalHeight) / 2);

      yearCourses.forEach((course, idx) => {
        nodes.push({
          id: course.id,
          type: 'courseNode',
          position: { x: columnX, y: startY + idx * ySpacing },
          data: {
            course,
            status: getCourseStatus(course.id, studentProgress),
            onRemove: onRemoveCourse
          }
        });
      });
    });

  // Generate edges
  const edges = [];
  courses.forEach(course => {
    course.prerequisites.forEach(prereqId => {
      if (!courseIdSet.has(prereqId)) return;

      const sourceStatus = getCourseStatus(prereqId, studentProgress);
      const targetStatus = getCourseStatus(course.id, studentProgress);

      let strokeColor = '#3f3f46';
      let strokeWidth = 2;
      let animated = false;

      if (sourceStatus === CourseStatus.COMPLETED && targetStatus === CourseStatus.COMPLETED) {
        strokeColor = '#34d399';
        strokeWidth = 2;
      } else if (sourceStatus === CourseStatus.COMPLETED && targetStatus === CourseStatus.IN_PROGRESS) {
        strokeColor = '#60a5fa';
        strokeWidth = 2;
        animated = true;
      } else if (sourceStatus === CourseStatus.COMPLETED && targetStatus === CourseStatus.RECOMMENDED) {
        strokeColor = '#22c55e';
        strokeWidth = 2;
        animated = true;
      } else if (targetStatus === CourseStatus.NOT_TAKEN) {
        strokeColor = '#3f3f46';
        strokeWidth = 1;
      }

      edges.push({
        id: `${prereqId}-${course.id}`,
        source: prereqId,
        target: course.id,
        type: 'smoothstep',
        animated,
        style: {
          stroke: strokeColor,
          strokeWidth,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: strokeColor,
          width: 15,
          height: 15
        }
      });
    });
  });

  return { nodes, edges };
}

export default function CourseGraph({ studentProgress: studentProgressProp }) {
  const { university, programSlug } = useAppContext();
  const schoolKey = getSchoolKey(university);

  // Dynamic course data from backend
  const [dynamicCourses, setDynamicCourses] = useState(null);
  const [dynamicCourseSets, setDynamicCourseSets] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (schoolKey && schoolKey !== 'ontariotech' && programSlug) {
      setLoading(true);
      fetch(`http://localhost:8000/catalog/program-courses?school=${schoolKey}&program=${programSlug}`)
        .then(res => res.json())
        .then(data => {
          if (!data.use_local && data.courses) {
            setDynamicCourses(data.courses);
            setDynamicCourseSets(data.course_sets);
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setDynamicCourses(null);
      setDynamicCourseSets(null);
    }
  }, [schoolKey, programSlug]);

  const allCourses = dynamicCourses || ontarioTechCSCourses;
  const courseSets = dynamicCourseSets || ontarioTechCourseSets;
  const studentProgress = studentProgressProp || mockStudentProgress;

  const [activeTab, setActiveTab] = useState('all');
  const [hiddenCourses, setHiddenCourses] = useState(new Set());
  const [visibleStatuses, setVisibleStatuses] = useState(new Set([
    CourseStatus.COMPLETED,
    CourseStatus.IN_PROGRESS,
    CourseStatus.RECOMMENDED,
    CourseStatus.NOT_TAKEN
  ]));

  const handleRemoveCourse = useCallback((courseId) => {
    setHiddenCourses(prev => new Set([...prev, courseId]));
  }, []);

  const handleResetHidden = useCallback(() => {
    setHiddenCourses(new Set());
  }, []);

  const toggleStatusVisibility = useCallback((status) => {
    setVisibleStatuses(prev => {
      const newSet = new Set(prev);
      if (newSet.has(status)) {
        newSet.delete(status);
      } else {
        newSet.add(status);
      }
      return newSet;
    });
  }, []);

  const handleDownloadCourses = useCallback(() => {
    let visibleCourseIds = courseSets[activeTab].ids.filter(id => !hiddenCourses.has(id));
    
    // Filter by visible statuses
    visibleCourseIds = visibleCourseIds.filter(id => {
      const status = getCourseStatus(id, studentProgress);
      return visibleStatuses.has(status);
    });
    
    const visibleCourses = allCourses.filter(c => visibleCourseIds.includes(c.id));
    
    // Create a structured data object
    const courseData = {
      exportDate: new Date().toISOString(),
      tab: courseSets[activeTab].label,
      totalCourses: visibleCourses.length,
      courses: visibleCourses.map(course => ({
        code: course.code,
        name: course.name,
        credits: course.credits,
        year: course.year,
        semester: course.semester,
        category: course.category,
        prerequisites: course.prerequisites,
        description: course.description,
        status: getCourseStatus(course.id, studentProgress)
      }))
    };

    // Convert to JSON string
    const jsonString = JSON.stringify(courseData, null, 2);
    
    // Create blob and download
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `course-selection-${activeTab}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [activeTab, hiddenCourses, visibleStatuses, studentProgress, allCourses, courseSets]);

  const { initialNodes, initialEdges } = useMemo(() => {
    let filteredIds = courseSets[activeTab].ids.filter(id => !hiddenCourses.has(id));
    
    // Filter by visible statuses
    filteredIds = filteredIds.filter(id => {
      const status = getCourseStatus(id, studentProgress);
      return visibleStatuses.has(status);
    });
    
    const { nodes, edges } = generateGraphData(filteredIds, studentProgress, activeTab === 'all', handleRemoveCourse, allCourses);
    return { initialNodes: nodes, initialEdges: edges };
  }, [activeTab, studentProgress, hiddenCourses, visibleStatuses, handleRemoveCourse, allCourses, courseSets]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update nodes/edges when tab changes, courses are hidden, or status visibility changes
  useMemo(() => {
    let filteredIds = courseSets[activeTab].ids.filter(id => !hiddenCourses.has(id));
    
    // Filter by visible statuses
    filteredIds = filteredIds.filter(id => {
      const status = getCourseStatus(id, studentProgress);
      return visibleStatuses.has(status);
    });
    
    const { nodes: newNodes, edges: newEdges } = generateGraphData(filteredIds, studentProgress, activeTab === 'all', handleRemoveCourse, allCourses);
    setNodes(newNodes);
    setEdges(newEdges);
  }, [activeTab, studentProgress, hiddenCourses, visibleStatuses, handleRemoveCourse, setNodes, setEdges, allCourses, courseSets]);

  // Reset tab when courses change
  useEffect(() => {
    setActiveTab('all');
    setHiddenCourses(new Set());
  }, [allCourses]);

  const stats = useMemo(() => ({
    completed: studentProgress.completedCourses.length,
    inProgress: studentProgress.inProgressCourses.length,
    recommended: studentProgress.recommendedCourses.length
  }), [studentProgress]);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          width: '100%',
          borderRadius: '12px',
          overflow: 'hidden',
          background: '#09090b',
          border: '1px solid #27272a',
          height: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Inter, system-ui, sans-serif',
          color: '#71717a',
          fontSize: '14px'
        }}
      >
        Loading course graph...
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        width: '100%',
        borderRadius: '12px',
        overflow: 'hidden',
        background: '#09090b',
        border: '1px solid #27272a'
      }}
    >
      {/* Tab Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        borderBottom: '1px solid #27272a',
        background: '#0a0a0a'
      }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {Object.entries(courseSets).map(([key, { label }]) => (
            <button
              key={key}
              onClick={() => {
                setActiveTab(key);
                setHiddenCourses(new Set()); // Reset hidden courses when switching tabs
                // Reset status visibility when switching tabs
                setVisibleStatuses(new Set([
                  CourseStatus.COMPLETED,
                  CourseStatus.IN_PROGRESS,
                  CourseStatus.RECOMMENDED,
                  CourseStatus.NOT_TAKEN
                ]));
              }}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                background: activeTab === key
                  ? 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)'
                  : '#18181b',
                color: activeTab === key ? '#ffffff' : '#71717a',
                fontSize: '12px',
                fontWeight: 600,
                fontFamily: 'Inter, system-ui, sans-serif',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: activeTab === key ? '0 0 12px rgba(59, 130, 246, 0.4)' : 'none'
              }}
            >
              {label}
            </button>
          ))}
          
          {/* Action buttons */}
          {hiddenCourses.size > 0 && (
            <button
              onClick={handleResetHidden}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                background: '#27272a',
                color: '#a1a1aa',
                fontSize: '12px',
                fontWeight: 600,
                fontFamily: 'Inter, system-ui, sans-serif',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                marginLeft: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#3f3f46';
                e.target.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#27272a';
                e.target.style.color = '#a1a1aa';
              }}
              title="Show all courses"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              Reset ({hiddenCourses.size})
            </button>
          )}
          
          <button
            onClick={handleDownloadCourses}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
              color: '#ffffff',
              fontSize: '12px',
              fontWeight: 600,
              fontFamily: 'Inter, system-ui, sans-serif',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              marginLeft: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 0 12px rgba(16, 185, 129, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.target.style.boxShadow = '0 0 16px rgba(16, 185, 129, 0.5)';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.boxShadow = '0 0 12px rgba(16, 185, 129, 0.3)';
              e.target.style.transform = 'translateY(0)';
            }}
            title="Download visible courses"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Download
          </button>
        </div>

        {/* Progress Stats */}
        <div style={{
          display: 'flex',
          gap: '20px',
          fontFamily: 'Inter, system-ui, sans-serif'
        }}>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '18px', fontWeight: 700, color: '#34d399' }}>{stats.completed}</span>
            <span style={{ fontSize: '10px', color: '#71717a', marginLeft: '4px' }}>done</span>
          </div>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '18px', fontWeight: 700, color: '#60a5fa' }}>{stats.inProgress}</span>
            <span style={{ fontSize: '10px', color: '#71717a', marginLeft: '4px' }}>current</span>
          </div>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '18px', fontWeight: 700, color: '#22c55e' }}>{stats.recommended}</span>
            <span style={{ fontSize: '10px', color: '#71717a', marginLeft: '4px' }}>next</span>
          </div>
        </div>
      </div>

      {/* Graph Container */}
      <div style={{ height: activeTab === 'all' ? '700px' : '550px', position: 'relative', transition: 'height 0.3s ease' }}>
        {/* Legend */}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          zIndex: 10,
          background: 'rgba(0,0,0,0.85)',
          padding: '10px 14px',
          borderRadius: '8px',
          border: '1px solid #27272a',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          fontFamily: 'Inter, system-ui, sans-serif'
        }}>
          {[
            { label: 'Completed', color: '#34d399', glow: true, status: CourseStatus.COMPLETED },
            { label: 'In Progress', color: '#60a5fa', glow: true, status: CourseStatus.IN_PROGRESS },
            { label: 'Recommended', color: '#22c55e', dashed: true, status: CourseStatus.RECOMMENDED },
            { label: 'Not Taken', color: '#3f3f46', status: CourseStatus.NOT_TAKEN }
          ].map(item => {
            const isVisible = visibleStatuses.has(item.status);
            return (
              <div
                key={item.label}
                onClick={() => toggleStatusVisibility(item.status)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  padding: '4px 6px',
                  borderRadius: '4px',
                  transition: 'all 0.2s ease',
                  opacity: isVisible ? 1 : 0.4,
                  background: isVisible ? 'transparent' : 'rgba(255, 255, 255, 0.05)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = isVisible ? 'transparent' : 'rgba(255, 255, 255, 0.05)';
                }}
                title={`Click to ${isVisible ? 'hide' : 'show'} ${item.label} courses`}
              >
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '3px',
                  background: item.dashed ? 'transparent' : item.glow ? item.color + '40' : '#27272a',
                  border: item.dashed ? `2px dashed ${item.color}` : `2px solid ${item.color}`,
                  boxShadow: item.glow ? `0 0 8px ${item.color}` : 'none',
                  opacity: isVisible ? 1 : 0.5
                }} />
                <span style={{ fontSize: '10px', color: isVisible ? '#a1a1aa' : '#52525b' }}>
                  {item.label}
                  {!isVisible && ' (hidden)'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Year Labels */}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          display: 'flex',
          gap: '160px',
          fontFamily: 'Inter, system-ui, sans-serif'
        }}>
          {['Year 1', 'Year 2', 'Year 3', 'Year 4'].map(year => (
            <div key={year} style={{
              fontSize: '10px',
              fontWeight: 600,
              color: '#52525b',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              background: 'rgba(0,0,0,0.6)',
              padding: '4px 8px',
              borderRadius: '4px'
            }}>
              {year}
            </div>
          ))}
        </div>

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.4}
          maxZoom={1.5}
          proOptions={{ hideAttribution: true }}
          nodesDraggable={true}
          nodesConnectable={false}
          defaultEdgeOptions={{
            type: 'smoothstep',
            style: { strokeWidth: 2 }
          }}
        >
          <Background variant="dots" gap={20} size={1} color="#1f1f1f" />
          <Controls
            showInteractive={false}
            position="bottom-right"
            style={{
              background: '#18181b',
              border: '1px solid #27272a',
              borderRadius: '6px'
            }}
          />
        </ReactFlow>
      </div>

      <style>{`
        .react-flow__controls button {
          background: #18181b !important;
          border: 1px solid #27272a !important;
          border-radius: 4px !important;
          width: 26px !important;
          height: 26px !important;
        }
        .react-flow__controls button:hover {
          background: #27272a !important;
        }
        .react-flow__controls button svg {
          fill: #a1a1aa !important;
        }
        .react-flow__edge-path {
          stroke-linecap: round;
        }
        .react-flow__handle {
          opacity: 0;
        }
      `}</style>
    </motion.div>
  );
}
