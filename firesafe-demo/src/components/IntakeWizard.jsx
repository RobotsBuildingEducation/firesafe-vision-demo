import { useRef, useState } from 'react'
import ZoneRuler from './ZoneRuler'

const INTAKE_STEPS = [
  {
    title: 'The property',
    help: 'Baseline terrain and fire hazard severity define plant spacing formulas and slope modifiers.',
    qs: [
      {
        id: 'propertyType',
        label: 'What are you assessing?',
        opts: ['Single-family home', 'ADU or detached structure', 'Rural / WUI parcel'],
      },
      {
        id: 'zone',
        label: 'Primary assessment zone',
        help: 'Defensible space is measured outward from the building wall.',
        opts: ['Zone 0 (0–5 ft)', 'Zone 1 (5–30 ft)', 'Zone 2 (30–100 ft)', 'Full parcel (All zones)'],
      },
      {
        id: 'topography',
        label: 'Topography / slope gradient',
        help: 'Wildfire accelerates uphill — slopes greater than 20% require wider plant spacing.',
        opts: ['Flat (<5%)', 'Mild slope (<20%)', 'Moderate slope (20–40%)', 'Steep slope (>40%)', 'Canyon / Saddle', 'Ridgetop'],
      },
      {
        id: 'hazardZone',
        label: 'CAL FIRE Hazard Severity Zone',
        help: 'Check your parcel on the OSFM fire hazard map if you are unsure.',
        opts: ['Moderate', 'High', 'Very High / Extreme', 'Not sure'],
      },
    ],
  },
  {
    title: 'The first five feet',
    help: 'Zone 0: The home ignition zone where 85%+ of ember-driven structure losses begin.',
    qs: [
      {
        id: 'surface',
        label: "What's on the ground within five feet of the wall?",
        opts: ['Mulch or bark', 'Lawn or grass', 'Bare soil', 'Gravel or DG', 'Concrete or pavers', 'Mixed'],
      },
      {
        id: 'veg',
        label: 'Plants or shrubs growing within five feet of the wall?',
        opts: ['Yes', 'A few', 'None'],
      },
      {
        id: 'fence',
        label: 'Fence material where it touches the house',
        help: 'Attached wood or vinyl fences act as a fuse leading flame to siding.',
        opts: ['Wood', 'Vinyl', 'Metal', 'Masonry / Block', 'No fence'],
      },
      {
        id: 'vents',
        label: 'Attic and foundation vent screening',
        help: 'Vents must be protected by 1/16″ to 1/8″ mesh to block ember intrusion.',
        opts: ['Fine metal mesh (1/16″–1/8″)', 'Standard / Coarse mesh', 'None / Open', 'Not sure'],
      },
      {
        id: 'stored',
        label: 'Combustible items stored against the house?',
        help: 'Firewood, plastic bins, propane, patio furniture, door mats.',
        opts: ['Yes', 'No'],
      },
      {
        id: 'gutters',
        label: 'Gutters, eaves, and roof valleys',
        opts: ['Clear of debris', 'Some leaf litter / needles', 'Full of debris', 'Not sure'],
      },
    ],
  },
  {
    title: "What you're working toward",
    help: 'Zone 0 is governed by two different standards. Knowing your goal tailors the recommendations.',
    qs: [
      {
        id: 'goal',
        label: 'Primary objective',
        opts: ['Lower my insurance (IBHS / Safer from Wildfires)', 'Meet the state rules (PRC § 4291)', 'Both insurance discount & code compliance'],
        help: 'The insurance standard (IBHS) is active today and requires zero vegetation in the first five feet.',
      },
      {
        id: 'jurisdiction',
        label: 'Property location / jurisdiction',
        help: 'Some municipalities (like San Diego) adopted local Zone 0 rules ahead of the state.',
        opts: ['Los Angeles County (Unincorporated / Altadena)', 'Pasadena / Foothill Communities', 'City of San Diego', 'Elsewhere in California'],
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

  const isPhotoPhase = currentStep === 3
  const stepObj = INTAKE_STEPS[currentStep]

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    onPhotoSelected(file)
  }

  const isCurrentStepDone = () => {
    if (isPhotoPhase) return Boolean(photoUrl)
    return stepObj.qs.every((q) => Boolean(intakeAnswers[q.id]))
  }

  const ticks = ['Property', 'Zone 0', 'Goal', 'Photo', 'Analysis', 'Report']

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
                <div className="q-label">{q.label}</div>
                {q.help && <div className="q-help">{q.help}</div>}
                <div className="chips">
                  {q.opts.map((opt) => {
                    const isSelected = intakeAnswers[q.id] === opt
                    return (
                      <button
                        key={opt}
                        type="button"
                        className="chip"
                        data-on={isSelected ? 'true' : 'false'}
                        onClick={() => onChangeAnswer(q.id, opt)}
                      >
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
          >
            {photoUrl ? (
              <div className="photo-preview-box">
                <img src={photoUrl} alt="Uploaded property" className="photo-preview-thumb" />
                <div className="photo-preview-meta">
                  <strong>{photoName || 'Selected photo'}</strong>
                  <p>Photo loaded and ready for vision analysis.</p>
                </div>
                <button
                  className="btn btn-ghost"
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Replace photo
                </button>
              </div>
            ) : (
              <>
                <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="var(--sage)" strokeWidth="1.5" style={{ margin: '0 auto 12px', display: 'block' }}>
                  <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <h3>Drop your property photo here</h3>
                <p>JPG, PNG, or WEBP from your phone or desktop.</p>
                <button className="btn" type="button" onClick={() => fileInputRef.current?.click()}>
                  Choose photo
                </button>
              </>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => {
                if (e.target.files?.[0]) handleFile(e.target.files[0])
              }}
            />

            <ul className="shotlist">
              <li>
                <span className="n">01</span>
                <span>Include the ground-to-wall junction in frame — that is where embers collect.</span>
              </li>
              <li>
                <span className="n">02</span>
                <span>Shoot in natural daylight with no heavy flash or extreme shadows.</span>
              </li>
              <li>
                <span className="n">03</span>
                <span>Include fence attachment points and foundation vents where visible.</span>
              </li>
              <li>
                <span className="n">04</span>
                <span>One side at a time: assess each wall / exposure individually.</span>
              </li>
            </ul>
          </div>

          <div className="row">
            <button
              className="btn"
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
              Back
            </button>
          </div>
        </>
      )}
    </div>
  )
}
