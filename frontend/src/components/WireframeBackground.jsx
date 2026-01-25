import { motion } from 'framer-motion'

const Sphere = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    {/* Outer circle */}
    <circle cx="50" cy="50" r="30" fill="none" stroke="#ffd60a" strokeWidth="1.2" strokeOpacity="0.7" />
    {/* Horizontal rings */}
    <ellipse cx="50" cy="50" rx="30" ry="10" fill="none" stroke="#ffd60a" strokeWidth="1" strokeOpacity="0.5" />
    <ellipse cx="50" cy="50" rx="30" ry="20" fill="none" stroke="#fdc500" strokeWidth="0.8" strokeOpacity="0.4" />
    {/* Vertical ring */}
    <ellipse cx="50" cy="50" rx="10" ry="30" fill="none" stroke="#ffd60a" strokeWidth="1" strokeOpacity="0.5" />
  </svg>
)

const Cube3D = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    {/* Front face */}
    <path d="M 30 35 L 70 35 L 70 75 L 30 75 Z" fill="none" stroke="#ffd60a" strokeWidth="1.5" strokeOpacity="0.7" />
    {/* Back face */}
    <path d="M 40 25 L 80 25 L 80 65 L 40 65 Z" fill="none" stroke="#fdc500" strokeWidth="1.5" strokeOpacity="0.5" />
    {/* Connecting edges */}
    <line x1="30" y1="35" x2="40" y2="25" stroke="#ffd60a" strokeWidth="1.2" strokeOpacity="0.6" />
    <line x1="70" y1="35" x2="80" y2="25" stroke="#ffd60a" strokeWidth="1.2" strokeOpacity="0.6" />
    <line x1="70" y1="75" x2="80" y2="65" stroke="#ffd60a" strokeWidth="1.2" strokeOpacity="0.6" />
    <line x1="30" y1="75" x2="40" y2="65" stroke="#ffd60a" strokeWidth="1.2" strokeOpacity="0.6" />
    {/* Inner lines for depth */}
    <line x1="30" y1="35" x2="70" y2="75" stroke="#d3b44e" strokeWidth="0.8" strokeOpacity="0.3" />
    <line x1="70" y1="35" x2="30" y2="75" stroke="#d3b44e" strokeWidth="0.8" strokeOpacity="0.3" />
  </svg>
)

const Octahedron = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    {/* Center diamond */}
    <path d="M 50 20 L 75 50 L 50 80 L 25 50 Z" fill="none" stroke="#013a63" strokeWidth="1.5" strokeOpacity="0.7" />
    {/* Inner lines creating 3D effect */}
    <line x1="50" y1="20" x2="50" y2="80" stroke="#003566" strokeWidth="1" strokeOpacity="0.5" />
    <line x1="25" y1="50" x2="75" y2="50" stroke="#003566" strokeWidth="1" strokeOpacity="0.5" />
    {/* Additional depth lines */}
    <line x1="50" y1="20" x2="25" y2="50" stroke="#013a63" strokeWidth="1.2" strokeOpacity="0.6" />
    <line x1="50" y1="20" x2="75" y2="50" stroke="#013a63" strokeWidth="1.2" strokeOpacity="0.6" />
    <line x1="50" y1="80" x2="25" y2="50" stroke="#003566" strokeWidth="1.2" strokeOpacity="0.5" />
    <line x1="50" y1="80" x2="75" y2="50" stroke="#003566" strokeWidth="1.2" strokeOpacity="0.5" />
  </svg>
)

const Tetrahedron = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    {/* Base triangle */}
    <path d="M 50 25 L 75 70 L 25 70 Z" fill="none" stroke="#ffd60a" strokeWidth="1.5" strokeOpacity="0.7" />
    {/* Back vertex creating 3D */}
    <path d="M 50 25 L 60 45" fill="none" stroke="#fdc500" strokeWidth="1.2" strokeOpacity="0.6" />
    <path d="M 60 45 L 75 70" fill="none" stroke="#fdc500" strokeWidth="1.2" strokeOpacity="0.5" />
    <path d="M 60 45 L 25 70" fill="none" stroke="#fdc500" strokeWidth="1.2" strokeOpacity="0.5" />
    {/* Inner structure */}
    <circle cx="60" cy="45" r="2" fill="#ffd60a" fillOpacity="0.6" />
  </svg>
)

const SimpleLine = ({ x, y, size }) => (
  <svg
    style={{
      position: 'absolute',
      left: `${x}%`,
      top: `${y}%`,
      width: size,
      height: size,
      pointerEvents: 'none'
    }}
    viewBox="0 0 100 100"
  >
    {/* Single diagonal line with dots at ends */}
    <line x1="10" y1="10" x2="90" y2="90" stroke="#ffd60a" strokeWidth="1.2" strokeOpacity="0.6" />
    <circle cx="10" cy="10" r="3" fill="#ffd60a" fillOpacity="0.7" />
    <circle cx="90" cy="90" r="3" fill="#ffd60a" fillOpacity="0.7" />
  </svg>
)

const HorizontalLine = ({ x, y, size }) => (
  <svg
    style={{
      position: 'absolute',
      left: `${x}%`,
      top: `${y}%`,
      width: size,
      height: size,
      pointerEvents: 'none'
    }}
    viewBox="0 0 100 100"
  >
    {/* Horizontal line with dots */}
    <line x1="10" y1="50" x2="90" y2="50" stroke="#ffd60a" strokeWidth="1.2" strokeOpacity="0.6" />
    <circle cx="10" cy="50" r="3" fill="#ffd60a" fillOpacity="0.7" />
    <circle cx="90" cy="50" r="3" fill="#ffd60a" fillOpacity="0.7" />
  </svg>
)

const RadialLines = ({ x, y, size }) => (
  <svg
    style={{
      position: 'absolute',
      left: `${x}%`,
      top: `${y}%`,
      width: size,
      height: size,
      pointerEvents: 'none'
    }}
    viewBox="0 0 100 100"
  >
    {/* Center point */}
    <circle cx="50" cy="50" r="3" fill="#013a63" fillOpacity="0.7" />
    {/* Radiating lines */}
    <line x1="50" y1="50" x2="50" y2="10" stroke="#013a63" strokeWidth="1" strokeOpacity="0.5" />
    <line x1="50" y1="50" x2="85" y2="25" stroke="#013a63" strokeWidth="1" strokeOpacity="0.5" />
    <line x1="50" y1="50" x2="90" y2="50" stroke="#013a63" strokeWidth="1" strokeOpacity="0.5" />
    <line x1="50" y1="50" x2="85" y2="75" stroke="#013a63" strokeWidth="1" strokeOpacity="0.5" />
    <line x1="50" y1="50" x2="50" y2="90" stroke="#013a63" strokeWidth="1" strokeOpacity="0.5" />
    <line x1="50" y1="50" x2="15" y2="75" stroke="#013a63" strokeWidth="1" strokeOpacity="0.5" />
    <line x1="50" y1="50" x2="10" y2="50" stroke="#013a63" strokeWidth="1" strokeOpacity="0.5" />
    <line x1="50" y1="50" x2="15" y2="25" stroke="#013a63" strokeWidth="1" strokeOpacity="0.5" />
    {/* Endpoint dots */}
    <circle cx="50" cy="10" r="2" fill="#003566" fillOpacity="0.6" />
    <circle cx="85" cy="25" r="2" fill="#003566" fillOpacity="0.6" />
    <circle cx="90" cy="50" r="2" fill="#003566" fillOpacity="0.6" />
    <circle cx="85" cy="75" r="2" fill="#003566" fillOpacity="0.6" />
    <circle cx="50" cy="90" r="2" fill="#003566" fillOpacity="0.6" />
    <circle cx="15" cy="75" r="2" fill="#003566" fillOpacity="0.6" />
    <circle cx="10" cy="50" r="2" fill="#003566" fillOpacity="0.6" />
    <circle cx="15" cy="25" r="2" fill="#003566" fillOpacity="0.6" />
  </svg>
)

const GeometricLines = ({ x, y, size }) => (
  <svg
    style={{
      position: 'absolute',
      left: `${x}%`,
      top: `${y}%`,
      width: size,
      height: size,
      pointerEvents: 'none'
    }}
    viewBox="0 0 100 100"
  >
    {/* Parallel diagonal lines */}
    <line x1="20" y1="10" x2="80" y2="40" stroke="#ffd60a" strokeWidth="1" strokeOpacity="0.5" />
    <line x1="20" y1="30" x2="80" y2="60" stroke="#ffd60a" strokeWidth="1" strokeOpacity="0.5" />
    <line x1="20" y1="50" x2="80" y2="80" stroke="#ffd60a" strokeWidth="1" strokeOpacity="0.5" />
    {/* Connecting dots */}
    <circle cx="20" cy="10" r="2" fill="#ffd60a" fillOpacity="0.6" />
    <circle cx="80" cy="40" r="2" fill="#ffd60a" fillOpacity="0.6" />
    <circle cx="20" cy="50" r="2" fill="#ffd60a" fillOpacity="0.6" />
    <circle cx="80" cy="80" r="2" fill="#ffd60a" fillOpacity="0.6" />
  </svg>
)

export default function WireframeBackground() {
  // Reduced to 5 shapes with much longer cycles and clearer spacing
  const shapes = [
    { id: 1, type: 'sphere', size: 100, left: '10%', top: '15%', duration: 8, delay: 0 },
    { id: 2, type: 'cube3d', size: 90, left: '80%', top: '20%', duration: 8, delay: 12 },
    { id: 3, type: 'octahedron', size: 95, left: '15%', top: '70%', duration: 8, delay: 24 },
    { id: 4, type: 'sphere', size: 85, left: '75%', top: '65%', duration: 8, delay: 36 },
    { id: 5, type: 'tetrahedron', size: 90, left: '45%', top: '40%', duration: 8, delay: 48 }
  ]

  const linePatterns = [
    { id: 'p1', type: 'simple', x: 5, y: 35, size: 110, duration: 7, delay: 6 },
    { id: 'p2', type: 'radial', x: 70, y: 10, size: 100, duration: 7, delay: 18 },
    { id: 'p3', type: 'geometric', x: 35, y: 60, size: 120, duration: 7, delay: 30 },
    { id: 'p4', type: 'horizontal', x: 80, y: 80, size: 95, duration: 7, delay: 42 }
  ]

  const renderShape = (type, size) => {
    switch (type) {
      case 'sphere': return <Sphere size={size} />
      case 'cube3d': return <Cube3D size={size} />
      case 'octahedron': return <Octahedron size={size} />
      case 'tetrahedron': return <Tetrahedron size={size} />
      default: return <Sphere size={size} />
    }
  }

  const renderPattern = (type, x, y, size) => {
    switch (type) {
      case 'simple': return <SimpleLine x={x} y={y} size={size} />
      case 'horizontal': return <HorizontalLine x={x} y={y} size={size} />
      case 'radial': return <RadialLines x={x} y={y} size={size} />
      case 'geometric': return <GeometricLines x={x} y={y} size={size} />
      default: return null
    }
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      pointerEvents: 'none',
      zIndex: 0,
      opacity: 0.7
    }}>
      {/* Line patterns - spawn and fade */}
      {linePatterns.map((pattern) => (
        <motion.div
          key={pattern.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: [0, 0, 0.7, 0.7, 0, 0],
            scale: [0.8, 0.8, 1, 1, 0.8, 0.8]
          }}
          transition={{
            duration: 60,
            delay: pattern.delay,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.05, 0.15, 0.85, 0.95, 1]
          }}
        >
          {renderPattern(pattern.type, pattern.x, pattern.y, pattern.size)}
        </motion.div>
      ))}

      {/* 3D shapes - spawn and fade (no movement) */}
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          initial={{
            opacity: 0,
            scale: 0.7,
            rotate: 0
          }}
          animate={{
            opacity: [0, 0, 1, 1, 0, 0],
            scale: [0.7, 0.7, 1, 1, 0.7, 0.7],
            rotate: [0, 0, 180, 360, 360, 360]
          }}
          transition={{
            duration: 60,
            delay: shape.delay,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.05, 0.15, 0.85, 0.95, 1]
          }}
          style={{
            position: 'absolute',
            left: shape.left,
            top: shape.top,
            width: shape.size,
            height: shape.size,
            filter: 'blur(0.3px)'
          }}
        >
          {renderShape(shape.type, shape.size)}
        </motion.div>
      ))}
    </div>
  )
}
