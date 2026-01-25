import { motion } from 'framer-motion'
import { useRef, useState } from 'react'
import logo from '../images/pathpilot1.png'
import { useAppContext } from '../context/AppContext'

export default function LandingPage({ onUpload }) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const { setTranscriptFile, setTranscriptData, setUniversity, setProgram, setCourses } = useAppContext();

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch(
          "http://localhost:8000/transcripts/parse",
          {
            method: "POST",
            body: formData,
          },
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ detail: response.statusText }));
          throw new Error(errorData.detail || `Server error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        console.log("Transcript parsed:", data);

        // Save file and parsed data to global state
        setTranscriptFile(file);
        setTranscriptData(data);

        // Pre-fill context with parsed data
        if (data.university_name) setUniversity(data.university_name);
        if (data.program_name) setProgram(data.program_name);
        if (data.courses) setCourses(data.courses);

        // Move to validation page with parsed data
        onUpload(data);
      } catch (error) {
        console.error("Error uploading file:", error);
        const errorMessage = error.message || "Error connecting to server. Make sure the backend is running on http://localhost:8000";
        alert(errorMessage);
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -40 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          padding: "2rem",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
      {/* Animated gradient orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(255, 214, 10, 0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        style={{
          position: 'absolute',
          bottom: '10%',
          right: '10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(0, 53, 102, 0.2) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <motion.img
        src={logo}
        alt="PathPilot Logo"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 0.6,
          delay: 0.2,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        style={{
          position: "relative",
          zIndex: 1,
          width: "180px",
          height: "auto",
          marginBottom: "1.5rem",
        }}
      />

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        style={{
          position: "relative",
          zIndex: 1,
          fontSize: "5rem",
          fontWeight: 800,
          letterSpacing: "-0.04em",
          marginBottom: "1rem",
          fontFamily: "Inter, system-ui, -apple-system, sans-serif",
          color: "var(--gold-bright)",
          textShadow: "0 0 40px rgba(255, 214, 10, 0.3)",
          filter: "drop-shadow(0 4px 20px rgba(255, 214, 10, 0.2))",
          lineHeight: "1.1",
        }}
      >
        PathPilot
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        style={{
          position: "relative",
          zIndex: 1,
          fontSize: "1.25rem",
          fontWeight: 400,
          marginBottom: "3rem",
          maxWidth: "600px",
          lineHeight: "1.6",
          opacity: 0.9,
          fontFamily: "Inter, system-ui, -apple-system, sans-serif",
        }}
      >
        Navigate your academic journey and discover your career path
      </motion.p>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      <motion.button
        onClick={handleButtonClick}
        disabled={uploading}
        whileHover={!uploading ? { scale: 1.05, y: -2, boxShadow: "0 12px 40px rgba(255, 214, 10, 0.5)" } : {}}
        whileTap={!uploading ? { scale: 0.98 } : {}}
        animate={!uploading ? {
          boxShadow: [
            "0 8px 32px rgba(255, 214, 10, 0.4)",
            "0 8px 32px rgba(255, 214, 10, 0.6)",
            "0 8px 32px rgba(255, 214, 10, 0.4)",
          ]
        } : {}}
        transition={{
          boxShadow: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.75rem",
          padding: "1rem 2rem",
          fontSize: "1.05rem",
          fontWeight: 600,
          border: "none",
          borderRadius: "12px",
          background: uploading
            ? "var(--gray-medium)"
            : "linear-gradient(135deg, var(--gold-bright) 0%, var(--gold-medium) 100%)",
          color: uploading ? "#ffffff" : "var(--blue-dark)",
          cursor: uploading ? "not-allowed" : "pointer",
          transition: "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          fontFamily: "Inter, system-ui, -apple-system, sans-serif",
          boxShadow: uploading
            ? "none"
            : "0 4px 20px rgba(255, 214, 10, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="17 8 12 3 7 8"></polyline>
          <line x1="12" y1="3" x2="12" y2="15"></line>
        </svg>
        {uploading ? "Uploading..." : "Upload Transcript"}
      </motion.button>
    </motion.div>
  );
}
