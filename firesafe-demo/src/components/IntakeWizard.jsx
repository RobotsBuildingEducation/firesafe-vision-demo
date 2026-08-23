import { useRef, useState, useEffect } from 'react'
import ZoneRuler from './ZoneRuler'

const INTAKE_STEPS = [
  {
    title: 'The property',
    help: 'Baseline terrain and fire hazard severity define plant spacing formulas and slope modifiers.',
    qs: [
      {
        id: 'propertyType',
        label: 'What are you assessing?',
        multi: false,
        opts: ['Single-family home', 'ADU or detached structure', 'Rural / WUI parcel'],
      },
      {
        id: 'zone',
        label: 'Defensible space zones to evaluate',
        help: 'Defensible space is measured radially outward from the building wall.',
        multi: true,
        opts: ['Zone 0 (0–5 ft)', 'Zone 1 (5–30 ft)', 'Zone 2 (30–100 ft)'],
      },
      {
        id: 'topography',
        label: 'Topography / slope & terrain features',
        help: 'Wildfire accelerates uphill — slopes greater than 20% and canyon funnels multiply fire spread.',
        multi: true,
        opts: ['Flat (<5%)', 'Mild slope (<20%)', 'Moderate slope (20–40%)', 'Steep slope (>40%)', 'Canyon / Saddle wind corridor', 'Ridgetop exposure'],
      },
      {
        id: 'hazardZone',
        label: 'CAL FIRE Fire Hazard Severity Zone (FHSZ)',
        help: 'Check your parcel on the OSFM fire hazard map if you are unsure.',
        multi: false,
        opts: ['Moderate', 'High', 'Very High / Extreme', 'Not sure'],
      },
    ],
  },
  {
    title: 'The first five feet & structure ignition points',
    help: 'Zone 0 & Ember Defense: Over 85% of destroyed structures ignite from embers entering vents, gutters, or banked mulch.',
    qs: [
      {
        id: 'surface',
        label: "What ground materials exist within 5 ft of your exterior walls?",
        help: 'Select all surfaces present around your foundation, porches, and perimeter.',
        multi: true,
        opts: [
          'Bark / Wood mulch',
          'Lawn or turf grass',
          'Gravel / Decomposed granite',
          'Concrete / Pavers / Flagstone',
          'Bare dry soil / Dirt',
        ],
      },
      {
        id: 'veg',
        label: 'What vegetation is growing within 5 ft of walls or touching structure?',
        help: 'IBHS Insurance standard requires 0 ft vegetation; state draft allows irrigated succulents.',
        multi: true,
        opts: [
          'Dense shrubs touching siding',
          'Low perennials / succulents (e.g. Dudleya)',
          'Tree branches overhanging / touching roof',
          'Climbing ivy / vines on exterior walls',
          'None (Zero vegetation in 0–5 ft)',
        ],
      },
      {
        id: 'fence',
        label: 'Attached fences, decks, and side transitions',
        help: 'Attached combustible structures function like a fuse guiding flame directly into siding.',
        multi: true,
        opts: [
          'Wood fence / gate attached to house',
          'Vinyl fence attached to house',
          'Metal / Wrought iron transition gate',
          'Wood deck / stairs attached',
          'Masonry / Stone / Stucco wall',
          'No attached fence or deck',
        ],
      },
      {
        id: 'vents',
        label: 'Attic, soffit, and foundation vent protections',
        help: 'Embers enter standard 1/4″ vents and ignite attics from the inside.',
        multi: true,
        opts: [
          'Fine 1/16″–1/8″ corrosion-resistant metal mesh',
          'Coarse 1/4″ wire mesh / open vents',
          'Soffit / Under-eave vents present',
          'Foundation / Crawlspace vents present',
          'Not sure of vent ratings',
        ],
      },
      {
        id: 'stored',
        label: 'Movable combustible items against or under structure',
        help: 'High-intensity point fires that crack windows and ignite eaves.',
        multi: true,
        opts: [
          'Firewood stack near wall (<30 ft)',
          'Trash / Recycle / Green bins against siding',
          'Propane tank / Gas BBQ grill near wall',
          'Wood patio furniture / Combustible door mats',
          'None (Zone 0 clean & clear)',
        ],
      },
      {
        id: 'gutters',
        label: 'Roof valleys, eaves, and rain gutters',
        help: 'Wind-blown embers settle in dry organic roof litter.',
        multi: true,
        opts: [
          'Pine needles / dry leaves in gutters',
          'Accumulated debris in roof valleys',
          'Dead branches / needles on roof deck',
          'Clean & clear of debris',
        ],
      },
    ],
  },
  {
    title: "Your resilience pathway & jurisdiction",
    help: 'Knowing your primary goal customizes the regulatory vs. insurance standards alignment.',
    qs: [
      {
        id: 'goal',
        label: 'Primary objective',
        multi: false,
        opts: [
          'Both insurance discount & code compliance',
          'Lower my insurance (IBHS / Safer from Wildfires)',
          'Meet state fire mandate (PRC § 4291)',
        ],
        help: 'IBHS designation unlocks 5%–35% insurance credits backed by CA Insurance Regulation 10 CCR § 2644.9.',
      },
      {
        id: 'jurisdiction',
        label: 'Property location / jurisdiction',
        multi: false,
        help: 'Some municipalities (like San Diego) enforce local Zone 0 ordinances ahead of the state.',
        opts: [
          'Los Angeles County (Unincorporated / Altadena)',
          'Pasadena / Foothill Communities',
          'City of San Diego',
          'Orange / Riverside / San Bernardino County',
          'Northern / Central California',
        ],
      },
    ],
  },
]

export default function IntakeWizard({
  intakeAnswers,
  onChangeAnswer,
  onPhotoSelected,
  photoName,
  photoUrl,
  onProceedToScan,
}) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [currentStep])

  const isPhotoPhase = currentStep === 3
  const stepObj = INTAKE_STEPS[currentStep]

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    onPhotoSelected(file)
  }

  const handleToggleOption = (q, opt) => {
    if (!q.multi) {
      onChangeAnswer(q.id, opt)
      return
    }

    const currentVal = intakeAnswers[q.id]
    const currentList = Array.isArray(currentVal)
      ? currentVal
      : currentVal
      ? [currentVal]
      : []

    const isNoneOption =
      opt.startsWith('None') ||
      opt.startsWith('Clean & clear') ||
      opt.startsWith('No attached') ||
      opt.startsWith('Flat (<5%)')

    let nextList

    if (isNoneOption) {
      if (currentList.includes(opt)) {
        nextList = []
      } else {
        nextList = [opt]
      }
    } else {
      // Remove any exclusive "None" options when selecting a hazard
      const filtered = currentList.filter(
        (item) =>
          !item.startsWith('None') &&
          !item.startsWith('Clean & clear') &&
          !item.startsWith('No attached'),
      )

      if (filtered.includes(opt)) {
        nextList = filtered.filter((item) => item !== opt)
      } else {
        nextList = [...filtered, opt]
      }
    }

    onChangeAnswer(q.id, nextList)
  }

  const isOptionSelected = (q, opt) => {
    const val = intakeAnswers[q.id]
    if (q.multi) {
      if (Array.isArray(val)) return val.includes(opt)
      return val === opt
    }
    return val === opt
  }

  const isCurrentStepDone = () => {
    if (isPhotoPhase) return Boolean(photoUrl)
    return stepObj.qs.every((q) => {
      const val = intakeAnswers[q.id]
      if (q.multi) {
        return Array.isArray(val) ? val.length > 0 : Boolean(val)
      }
      return Boolean(val)
    })
  }

  const ticks = ['Property', 'Zone 0 & Hazards', 'Goals', 'Photo', 'Analysis', 'Report']

  return (
    <div className="fsv-narrow">
      <ZoneRuler
        label={isPhotoPhase ? 'Property Photo' : stepObj.title}
        right={`Step ${currentStep + 1} of 6`}
        pct={((currentStep + 1) / 6) * 100}
        ticks={ticks}
        active={currentStep}
      />

      {!isPhotoPhase ? (
        <>
          <h1 className="step-title">{stepObj.title}</h1>
          <p className="step-subtitle">{stepObj.help}</p>

          <div className="card intake-card">
            {stepObj.qs.map((q) => (
              <div className="q" key={q.id}>
                <div className="q-head">
                  <div className="q-label">{q.label}</div>
                  <span className="q-type-badge mono">
                    {q.multi ? 'Select all that apply' : 'Select one'}
                  </span>
                </div>
                {q.help && <div className="q-help">{q.help}</div>}
                <div className="chips">
                  {q.opts.map((opt) => {
                    const isSelected = isOptionSelected(q, opt)
                    return (
                      <button
                        key={opt}
                        type="button"
                        className="chip"
                        data-on={isSelected ? 'true' : 'false'}
                        data-multi={q.multi ? 'true' : 'false'}
                        onClick={() => handleToggleOption(q, opt)}
                      >
                        {q.multi && (
                          <span className="chip-check" aria-hidden="true">
                            {isSelected ? '✓ ' : '+ '}
                          </span>
                        )}
                        {opt}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="row">
            <button
              className="btn"
              type="button"
              disabled={!isCurrentStepDone()}
              onClick={() => setCurrentStep((prev) => prev + 1)}
            >
              {currentStep < 2 ? 'Continue' : 'Add your photo'}
            </button>
            {currentStep > 0 && (
              <button
                className="btn btn-ghost"
                type="button"
                onClick={() => setCurrentStep((prev) => prev - 1)}
              >
                Back
              </button>
            )}
          </div>
        </>
      ) : (
        <>
          <h1 className="step-title">Upload property photo</h1>
          <p className="step-subtitle">
            Capture or upload a photo showing the ground-to-wall junction of your property (the first five feet).
          </p>

          <div
            className="drop"
            data-over={isDragOver ? 'true' : 'false'}
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragOver(true)
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => {
              e.preventDefault()
              setIsDragOver(false)
              if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0])
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => {
                if (e.target.files?.[0]) handleFile(e.target.files[0])
              }}
            />

            {photoUrl ? (
              <div className="preview-wrap">
                <img src={photoUrl} alt="Uploaded property" className="photo-preview" />
                <div className="preview-meta">
                  <span className="pname mono">{photoName}</span>
                  <span className="reup">Click or drop to replace</span>
                </div>
              </div>
            ) : (
              <div className="drop-cta">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div className="drop-title">Drop your property photo here</div>
                <p className="drop-sub">or click to browse files (JPEG, PNG, HEIC up to 20MB)</p>
              </div>
            )}
          </div>

          <div className="shotlist card">
            <h3>Photo best practices for accurate assessment</h3>
            <ul>
              <li><strong>Show ground to wall:</strong> Frame the junction where soil/mulch meets your siding or foundation.</li>
              <li><strong>Include key structures:</strong> Capture attached fences, stairs, low windows, and foundation vents.</li>
              <li><strong>Good lighting:</strong> Daytime shots in even sunlight allow Gemini to clearly segment materials.</li>
            </ul>
          </div>

          <div className="row">
            <button
              className="btn btn-scan"
              type="button"
              disabled={!photoUrl}
              onClick={onProceedToScan}
            >
              Analyze & Generate FireSafe Vision
            </button>
            <button
              className="btn btn-ghost"
              type="button"
              onClick={() => setCurrentStep(2)}
            >
              Back to questionnaire
            </button>
          </div>
        </>
      )}
    </div>
  )
}
