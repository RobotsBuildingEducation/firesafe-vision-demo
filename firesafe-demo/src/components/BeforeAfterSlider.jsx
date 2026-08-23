import { useState, useRef, useEffect, useCallback } from 'react'
import { HAZARD_LIBRARY, PIN_COORDINATES } from '../data/hazardLibrary'

/**
 * BeforeAfterSlider
 * Interactive split-screen slider comparing the original property photo
 * with the AI-generated or simulated fire-resilient landscape design.
 */
export default function BeforeAfterSlider({
  originalSrc,
  generatedSrc,
  lens = 'both',
  flags = [],
  selectedFlag,
  onSelectFlag,
  isGenerated = true,
}) {
  const [sliderPos, setSliderPos] = useState(50)
  const containerRef = useRef(null)
  const isDragging = useRef(false)

  const updatePosition = useCallback((clientX) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const relativeX = clientX - rect.left
    const percent = (relativeX / rect.width) * 100
    setSliderPos(Math.max(2, Math.min(98, percent)))
  }, [])

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging.current) updatePosition(e.clientX)
    }
    const handleTouchMove = (e) => {
      if (isDragging.current && e.touches[0]) updatePosition(e.touches[0].clientX)
    }
    const handleEnd = () => {
      isDragging.current = false
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('touchmove', handleTouchMove)
    window.addEventListener('mouseup', handleEnd)
    window.addEventListener('touchend', handleEnd)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('mouseup', handleEnd)
      window.removeEventListener('touchend', handleEnd)
    }
  }, [updatePosition])

  const getPinColor = (sev) => {
    if (sev === 'high') return 'var(--sev-high)'
    if (sev === 'medium') return 'var(--sev-med)'
    return 'var(--sev-low)'
  }

  const getVisionLabel = () => {
    if (!isGenerated) return 'Resilient Vision'
    if (lens === 'state') return 'Resilient Vision · State PRC § 4291 (Succulents in Zone 0)'
    if (lens === 'ins') return 'Resilient Vision · IBHS Standard (0-ft Hardscape Apron)'
    return 'Resilient Vision · Both Standards (Hardened + Native Garden)'
  }

  const afterImage = generatedSrc || originalSrc

  return (
    <div
      className="ba"
      ref={containerRef}
      role="region"
      aria-label="Before and after property comparison slider"
    >
      {/* Base / Before Image */}
      <img
        src={originalSrc}
        alt="Current property condition before fire-resilience retrofit"
        className="ba-img-before"
      />

      {/* Hazard Pins on the Before Side */}
      {flags.map((flagCode, idx) => {
        const coords = PIN_COORDINATES[flagCode] || [45 + ((idx * 8) % 40), 50 + ((idx * 10) % 35)]
        const [posX, posY] = coords
        const hazard = HAZARD_LIBRARY[flagCode]
        if (!hazard) return null

        // Only show pin if it sits in the 'before' portion of the split
        if (posX > sliderPos) return null

        const isSelected = selectedFlag === flagCode

        return (
          <button
            key={flagCode}
            type="button"
            className="pin mono"
            data-sel={isSelected ? 'true' : 'false'}
            style={{
              left: `${posX}%`,
              top: `${posY}%`,
              background: getPinColor(hazard.severity),
            }}
            onClick={() => onSelectFlag?.(isSelected ? null : flagCode)}
            aria-label={`${hazard.title} — Hazard ${idx + 1}`}
            title={`${hazard.title} (${hazard.severity.toUpperCase()})`}
          >
            {idx + 1}
          </button>
        )
      })}

      {/* Transformed / After Image (Clipped) */}
      <div
        className="ba-after"
        style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` }}
      >
        <img
          key={afterImage}
          src={afterImage}
          alt="Transformed fire-resilient property design"
          className="ba-img-after"
        />
      </div>

      {/* Tags */}
      <div className="ba-tag" style={{ left: 14 }}>
        Now (High Risk)
      </div>
      <div className="ba-tag" style={{ right: 14 }}>
        {getVisionLabel()}
      </div>

      {/* Divider Handle */}
      <div
        className="ba-handle"
        style={{ left: `${sliderPos}%` }}
        onMouseDown={() => (isDragging.current = true)}
        onTouchStart={() => (isDragging.current = true)}
        aria-label="Drag slider to compare before and after"
      >
        <div className="ba-knob">
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none" aria-hidden="true">
            <path
              d="M5 1L1 6L5 11M11 1L15 6L11 11"
              stroke="#14211B"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}
