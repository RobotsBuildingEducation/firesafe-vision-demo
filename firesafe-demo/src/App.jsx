import { useEffect, useMemo, useState } from 'react'
import heroImg from './assets/hero.png'
import { GEMINI_IMAGE_MODEL, generateFireSafeVisionImage } from './geminiImage'
import './App.css'

const zones = [
  {
    id: 'zone0',
    label: 'Zone 0',
    range: '0-5 ft',
    intent: 'Ember-resistant band',
    focus: 'Replace combustibles closest to the structure with noncombustible surfaces.',
  },
  {
    id: 'zone1',
    label: 'Zone 1',
    range: '5-30 ft',
    intent: 'Lean, clean, green',
    focus: 'Remove dead fuel, separate plant groupings, and keep canopy away from structures.',
  },
  {
    id: 'zone2',
    label: 'Zone 2',
    range: '30-100 ft',
    intent: 'Reduced fuel area',
    focus: 'Thin vegetation, break ladder fuels, and keep access routes visible.',
  },
]

const providerOptions = [
  { id: 'gemini', label: 'Firebase Vertex AI' },
  { id: 'mock', label: 'Mock demo' },
]

const conditionOptions = {
  topography: [
    { value: 'flat', label: 'Flat lot' },
    { value: 'moderate', label: 'Moderate slope' },
    { value: 'steep', label: 'Steep slope' },
    { value: 'wind', label: 'Wind channel' },
  ],
  vegetation: [
    { value: 'clear', label: 'Mostly clear' },
    { value: 'mulch', label: 'Mulch near wall' },
    { value: 'dense', label: 'Dense shrubs' },
    { value: 'dry', label: 'Dry grass/leaves' },
    { value: 'mixed', label: 'Mixed natives' },
  ],
  fence: [
    { value: 'none', label: 'No fence' },
    { value: 'wood', label: 'Wood fence' },
    { value: 'vinyl', label: 'Vinyl fence' },
    { value: 'metal', label: 'Metal fence' },
    { value: 'masonry', label: 'Masonry wall' },
  ],
  hardscape: [
    { value: 'none', label: 'Little hardscape' },
    { value: 'narrow', label: 'Narrow path' },
    { value: 'gravel', label: 'Gravel band' },
    { value: 'pavers', label: 'Pavers/patio' },
    { value: 'concrete', label: 'Concrete apron' },
  ],
}

const riskFactorOptions = [
  { value: 'debris', label: 'Leaf litter' },
  { value: 'furniture', label: 'Patio furniture' },
  { value: 'woodpile', label: 'Wood/storage' },
  { value: 'overhang', label: 'Overhanging branches' },
]

const defaultConditions = {
  zone: 'zone0',
  topography: 'flat',
  vegetation: 'mulch',
  fence: 'wood',
  hardscape: 'none',
  riskFactors: ['debris', 'furniture'],
}

const geminiKeyStorageKey = 'firesafe-vision-gemini-api-key'

function getOptionLabel(group, value) {
  return conditionOptions[group].find((option) => option.value === value)?.label ?? value
}

function buildHazards(conditions) {
  const hazards = []

  if (conditions.zone === 'zone0' && conditions.vegetation !== 'clear') {
    hazards.push({
      severity: 'High',
      title: 'Combustible material in Zone 0',
      body: 'The first five feet should become a noncombustible break with gravel, pavers, or bare mineral soil.',
    })
  }

  if (conditions.fence === 'wood' || conditions.fence === 'vinyl') {
    hazards.push({
      severity: conditions.zone === 'zone0' ? 'High' : 'Medium',
      title: 'Fence material can carry heat',
      body: 'Swap the run nearest the structure for metal, masonry, or a separated gate section.',
    })
  }

  if (conditions.vegetation === 'dense' || conditions.vegetation === 'dry') {
    hazards.push({
      severity: 'High',
      title: 'Vegetation needs spacing',
      body: 'Thin shrubs, remove dead material, and create open gaps between plant masses.',
    })
  }

  if (conditions.hardscape === 'none' || conditions.hardscape === 'narrow') {
    hazards.push({
      severity: 'Medium',
      title: 'Hardscape break is weak',
      body: 'Add a continuous gravel, decomposed granite, paver, or concrete edge along the structure.',
    })
  }

  if (conditions.topography === 'steep' || conditions.topography === 'wind') {
    hazards.push({
      severity: 'Medium',
      title: 'Exposure increases ember pressure',
      body: 'Use wider spacing and prioritize clean edges on the uphill or wind-facing side.',
    })
  }

  if (conditions.riskFactors.includes('debris')) {
    hazards.push({
      severity: 'Medium',
      title: 'Leaf litter creates fine fuel',
      body: 'Clear roofs, gutters, corners, decks, and fence lines before adding new materials.',
    })
  }

  if (conditions.riskFactors.includes('woodpile')) {
    hazards.push({
      severity: 'Medium',
      title: 'Stored combustibles are too close',
      body: 'Move lumber, firewood, and bins outside the immediate home ignition area.',
    })
  }

  if (conditions.riskFactors.includes('overhang')) {
    hazards.push({
      severity: 'Medium',
      title: 'Branches bridge to the roofline',
      body: 'Trim limbs away from roof edges, vents, and chimney openings.',
    })
  }

  if (hazards.length === 0) {
    hazards.push({
      severity: 'Low',
      title: 'No obvious demo hazard selected',
      body: 'Run the real vision model here to inspect materials, vents, slope, and vegetation density.',
    })
  }

  return hazards.slice(0, 5)
}

function buildRecommendations(conditions) {
  const commonMaterials = ['gravel', 'decomposed granite', 'stone pavers', 'metal edging']

  if (conditions.zone === 'zone0') {
    return {
      actions: [
        'Create a continuous noncombustible apron around walls, decks, stairs, and fence connections.',
        'Move furniture, bins, planters, and stored items out of the first five feet.',
        'Replace attached wood or vinyl fence sections with metal, masonry, or a separated gate break.',
      ],
      materials: [...commonMaterials, 'concrete splash strip', 'metal gate insert'],
      plants: ['Keep Zone 0 plant-free in this demo', 'Place native palette beyond the five-foot edge'],
    }
  }

  if (conditions.zone === 'zone1') {
    return {
      actions: [
        'Remove dead leaves, dry grass, and fine fuels from planting beds, gutters, roof edges, and decks.',
        'Cluster low-growing plants into islands with open spacing between shrubs and trees.',
        'Trim branches away from the roofline, chimney, vents, and neighboring canopies.',
      ],
      materials: [...commonMaterials, 'drip irrigation', 'fiber-cement planter edge'],
      plants: ['deer grass', 'California fuchsia', 'common yarrow', 'island alumroot'],
    }
  }

  return {
    actions: [
      'Thin shrubs and grasses so fire has fewer continuous paths toward the structure.',
      'Create horizontal and vertical spacing between grass, shrubs, and tree limbs.',
      'Keep access paths, driveways, and utility areas clear for inspection and response crews.',
    ],
    materials: ['gravel access path', 'metal storage shed', 'mulch-free service zone', 'stone retaining edge'],
    plants: ['locally selected ceanothus', 'deer grass', 'California buckwheat', 'coast sunflower'],
  }
}

function scoreAssessment(conditions, hazards) {
  const base = 24
  const severityPoints = hazards.reduce((total, hazard) => {
    if (hazard.severity === 'High') return total + 18
    if (hazard.severity === 'Medium') return total + 10
    return total + 4
  }, base)
  const slopePoints = conditions.topography === 'steep' ? 10 : conditions.topography === 'wind' ? 8 : 0
  return Math.min(96, severityPoints + slopePoints)
}

function createDemoAssessment(conditions, photoName, provider) {
  const hazards = buildHazards(conditions)
  const recommendations = buildRecommendations(conditions)
  const score = scoreAssessment(conditions, hazards)
  const selectedZone = zones.find((zone) => zone.id === conditions.zone)

  return {
    hazards,
    recommendations,
    score,
    summary: `${selectedZone.label} ${selectedZone.range}: convert the closest ignition paths into a clean, noncombustible edge and move fuel outward.`,
    runMeta: {
      provider: providerOptions.find((option) => option.id === provider)?.label ?? 'Mock demo',
      photoName: photoName || 'sample property image',
      generatedAt: new Date().toLocaleString([], {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      }),
    },
  }
}

function buildImagePrompt(conditions, selectedZone, assessment) {
  const hazardText = assessment.hazards.map((hazard) => hazard.title).join(', ')
  const actionText = assessment.recommendations.actions.join(' ')
  const materialText = assessment.recommendations.materials.join(', ')
  const plantText = assessment.recommendations.plants.join(', ')

  return `
Edit the uploaded residential property photo into a realistic fire-resilient design concept.

Preserve the original camera angle, home geometry, property layout, lighting direction, and recognizable materials wherever possible. Output only the transformed "after" property image. Do not add text, labels, diagrams, people, logos, watermarks, smoke, flames, emergency vehicles, or dramatic disaster imagery.

Defensible-space scope:
- ${selectedZone.label} (${selectedZone.range}): ${selectedZone.intent}.
- Topography: ${getOptionLabel('topography', conditions.topography)}.
- Current vegetation: ${getOptionLabel('vegetation', conditions.vegetation)}.
- Fence condition: ${getOptionLabel('fence', conditions.fence)}.
- Existing hardscape: ${getOptionLabel('hardscape', conditions.hardscape)}.
- Selected hazards: ${hazardText}.

Design changes to visualize:
${actionText}

Use these visual materials where they fit the scene: ${materialText}.
Use this plant palette only where plants belong beyond the immediate noncombustible edge: ${plantText}.
Make the result look like a credible Southern California homeowner retrofit: clean gravel or decomposed granite bands, pavers or concrete where useful, spaced low native planting, and noncombustible fence/gate transitions near the structure.
`.trim()
}

function App() {
  const [photoUrl, setPhotoUrl] = useState('')
  const [photoFile, setPhotoFile] = useState(null)
  const [photoName, setPhotoName] = useState('')
  const [conditions, setConditions] = useState(defaultConditions)
  const [provider, setProvider] = useState('gemini')
  const [generatedImageUrl, setGeneratedImageUrl] = useState('')
  const [generatedText, setGeneratedText] = useState('')
  const [generationError, setGenerationError] = useState('')
  const [geminiApiKey, setGeminiApiKey] = useState(
    () => window.localStorage.getItem(geminiKeyStorageKey) ?? '',
  )
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [assessment, setAssessment] = useState(null)

  useEffect(() => {
    return () => {
      if (photoUrl) URL.revokeObjectURL(photoUrl)
    }
  }, [photoUrl])

  const selectedZone = useMemo(
    () => zones.find((zone) => zone.id === conditions.zone),
    [conditions.zone],
  )

  const previewHazards = useMemo(() => buildHazards(conditions), [conditions])
  const currentHazards = assessment?.hazards ?? previewHazards
  const currentScore = assessment?.score ?? scoreAssessment(conditions, previewHazards)
  const scoreLevel = currentScore >= 70 ? 'High' : currentScore >= 45 ? 'Medium' : 'Lower'
  const imageSource = photoUrl || heroImg
  const visionImageSource = generatedImageUrl || imageSource
  const hasGeneratedImage = Boolean(generatedImageUrl)

  function clearGeneratedVision() {
    setGeneratedImageUrl('')
    setGeneratedText('')
    setGenerationError('')
  }

  function updateCondition(key, value) {
    setConditions((current) => ({ ...current, [key]: value }))
    setAssessment(null)
    clearGeneratedVision()
  }

  function toggleRiskFactor(value) {
    setConditions((current) => {
      const hasValue = current.riskFactors.includes(value)
      const riskFactors = hasValue
        ? current.riskFactors.filter((factor) => factor !== value)
        : [...current.riskFactors, value]
      return { ...current, riskFactors }
    })
    setAssessment(null)
    clearGeneratedVision()
  }

  function selectProvider(value) {
    setProvider(value)
    setAssessment(null)
    clearGeneratedVision()
  }

  function updateGeminiApiKey(value) {
    setGeminiApiKey(value)

    if (value.trim()) {
      window.localStorage.setItem(geminiKeyStorageKey, value.trim())
      return
    }

    window.localStorage.removeItem(geminiKeyStorageKey)
  }

  function handlePhotoChange(event) {
    const file = event.target.files?.[0]
    if (!file) return

    const nextUrl = URL.createObjectURL(file)
    if (photoUrl) URL.revokeObjectURL(photoUrl)
    setPhotoUrl(nextUrl)
    setPhotoFile(file)
    setPhotoName(file.name)
    setAssessment(null)
    clearGeneratedVision()
  }

  async function runAssessment() {
    setIsAnalyzing(true)
    setGenerationError('')

    const nextAssessment = createDemoAssessment(conditions, photoName, provider)

    try {
      if (provider === 'gemini') {
        const imageResult = await generateFireSafeVisionImage({
          apiKey: geminiApiKey,
          photoFile,
          prompt: buildImagePrompt(conditions, selectedZone, nextAssessment),
        })

        setGeneratedImageUrl(imageResult.imageUrl)
        setGeneratedText(imageResult.text)
        setAssessment({
          ...nextAssessment,
          runMeta: {
            ...nextAssessment.runMeta,
            provider: 'Gemini Nano Banana',
            imageModel: imageResult.model,
          },
        })
        return
      }

      await new Promise((resolve) => {
        window.setTimeout(resolve, 600)
      })
      setGeneratedImageUrl('')
      setGeneratedText('')
      setAssessment(nextAssessment)
    } catch (error) {
      setAssessment(nextAssessment)
      setGenerationError(error instanceof Error ? error.message : 'Gemini image generation failed.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  function printReport() {
    window.print()
  }

  return (
    <div className="app-shell">
      <aside className="control-panel" aria-label="Assessment controls">
        <div className="brand-block">
          <span className="brand-mark">FS</span>
          <div>
            <p className="eyebrow">FireSafe Vision</p>
            <h1>Property assessment demo</h1>
          </div>
        </div>

        <div className="step-strip" aria-label="Demo steps">
          <span>Photo</span>
          <span>Conditions</span>
          <span>Vision</span>
          <span>Report</span>
        </div>

        <form className="intake-form">
          <section className="panel-section">
            <div className="section-heading">
              <span>01</span>
              <h2>Property photo</h2>
            </div>
            <label className="upload-dropzone" htmlFor="photo-upload">
              <input id="photo-upload" type="file" accept="image/*" onChange={handlePhotoChange} />
              <span>{photoName || 'Choose image'}</span>
              <strong>{photoName ? 'Replace' : 'Upload'}</strong>
            </label>
          </section>

          <section className="panel-section">
            <div className="section-heading">
              <span>02</span>
              <h2>Assessment zone</h2>
            </div>
            <div className="zone-grid" role="radiogroup" aria-label="Assessment zone">
              {zones.map((zone) => (
                <button
                  className={conditions.zone === zone.id ? 'zone-button active' : 'zone-button'}
                  key={zone.id}
                  onClick={() => updateCondition('zone', zone.id)}
                  type="button"
                >
                  <span>{zone.label}</span>
                  <strong>{zone.range}</strong>
                </button>
              ))}
            </div>
          </section>

          <section className="panel-section">
            <div className="section-heading">
              <span>03</span>
              <h2>Site conditions</h2>
            </div>
            <div className="field-grid">
              <label>
                <span>Topography</span>
                <select
                  value={conditions.topography}
                  onChange={(event) => updateCondition('topography', event.target.value)}
                >
                  {conditionOptions.topography.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>Vegetation</span>
                <select
                  value={conditions.vegetation}
                  onChange={(event) => updateCondition('vegetation', event.target.value)}
                >
                  {conditionOptions.vegetation.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>Fence</span>
                <select
                  value={conditions.fence}
                  onChange={(event) => updateCondition('fence', event.target.value)}
                >
                  {conditionOptions.fence.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>Hardscape</span>
                <select
                  value={conditions.hardscape}
                  onChange={(event) => updateCondition('hardscape', event.target.value)}
                >
                  {conditionOptions.hardscape.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="risk-checkboxes" aria-label="Current risk factors">
              {riskFactorOptions.map((factor) => (
                <label key={factor.value}>
                  <input
                    checked={conditions.riskFactors.includes(factor.value)}
                    onChange={() => toggleRiskFactor(factor.value)}
                    type="checkbox"
                  />
                  <span>{factor.label}</span>
                </label>
              ))}
            </div>
          </section>

          <section className="panel-section">
            <div className="section-heading">
              <span>04</span>
              <h2>AI adapter</h2>
            </div>
            <div className="provider-row" role="radiogroup" aria-label="AI provider">
              {providerOptions.map((option) => (
                <button
                  className={provider === option.id ? 'provider-button active' : 'provider-button'}
                  key={option.id}
                  onClick={() => selectProvider(option.id)}
                  type="button"
                >
                  {option.label}
                </button>
              ))}
            </div>
            <div className="model-field">
              <span>Image model</span>
              <strong>{GEMINI_IMAGE_MODEL}</strong>
              <small>
                {geminiApiKey.trim()
                  ? 'Direct Gemini API key fallback'
                  : 'Vertex AI Gemini API via Firebase AI Logic'}
              </small>
            </div>
            <label className="key-field">
              <span>Gemini API key fallback</span>
              <input
                autoComplete="off"
                onChange={(event) => updateGeminiApiKey(event.target.value)}
                placeholder="Optional: paste GEMINI_API_KEY"
                type="password"
                value={geminiApiKey}
              />
            </label>
            {generationError ? (
              <p className="error-message" role="alert">
                {generationError}
              </p>
            ) : null}
            <button className="primary-action" disabled={isAnalyzing} onClick={runAssessment} type="button">
              {isAnalyzing
                ? provider === 'gemini'
                  ? 'Calling Gemini...'
                  : 'Generating...'
                : provider === 'gemini'
                  ? 'Generate with Gemini'
                  : 'Generate mock vision'}
            </button>
          </section>
        </form>
      </aside>

      <main className="workspace">
        <section className="workspace-header">
          <div>
            <p className="eyebrow">Selected scope</p>
            <h2>
              {selectedZone.label} · {selectedZone.intent}
            </h2>
            <p>{selectedZone.focus}</p>
          </div>
          <div className="risk-meter" style={{ '--risk-score': `${currentScore}%` }}>
            <span>{currentScore}</span>
            <small>{scoreLevel}</small>
          </div>
        </section>

        <section className="vision-grid" aria-label="Before and after vision">
          <article className="image-panel">
            <div className="image-panel-head">
              <span>Current state</span>
              <strong>{photoName || 'Sample yard'}</strong>
            </div>
            <div className="property-frame">
              <img src={imageSource} alt="Current property condition" />
              <span className="photo-badge">{getOptionLabel('vegetation', conditions.vegetation)}</span>
            </div>
          </article>

          <article className="image-panel">
            <div className="image-panel-head">
              <span>Fire-resilient vision</span>
              <strong>{assessment ? assessment.runMeta.provider : 'Pending run'}</strong>
            </div>
            <div className={hasGeneratedImage ? 'property-frame generated-frame' : 'property-frame vision-frame'}>
              <img src={visionImageSource} alt="Generated fire-resilient property vision" />
              {!hasGeneratedImage ? (
                <>
                  <div className="gravel-band" aria-hidden="true"></div>
                  <div className="plant-island island-one" aria-hidden="true"></div>
                  <div className="plant-island island-two" aria-hidden="true"></div>
                  <span className="callout callout-top">Metal break</span>
                  <span className="callout callout-bottom">Gravel edge</span>
                  <span className="callout callout-side">Spaced natives</span>
                </>
              ) : null}
            </div>
            {generatedText ? <p className="model-note">{generatedText}</p> : null}
          </article>
        </section>

        <section className="intelligence-grid">
          <article className="analysis-panel">
            <div className="panel-title-row">
              <div>
                <p className="eyebrow">Vision analysis</p>
                <h2>Hazard flags</h2>
              </div>
              <span className="status-pill">{assessment ? 'Generated' : 'Preview'}</span>
            </div>
            <ul className="hazard-list">
              {currentHazards.map((hazard) => (
                <li key={`${hazard.title}-${hazard.severity}`}>
                  <span className={`severity ${hazard.severity.toLowerCase()}`}>{hazard.severity}</span>
                  <div>
                    <strong>{hazard.title}</strong>
                    <p>{hazard.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </article>

          <article className="analysis-panel">
            <div className="panel-title-row">
              <div>
                <p className="eyebrow">Action plan</p>
                <h2>Recommendations</h2>
              </div>
              <span className="status-pill">{selectedZone.range}</span>
            </div>
            {assessment ? (
              <>
                <ol className="action-list">
                  {assessment.recommendations.actions.map((action) => (
                    <li key={action}>{action}</li>
                  ))}
                </ol>
                <div className="tag-group" aria-label="Recommended materials">
                  {assessment.recommendations.materials.map((material) => (
                    <span key={material}>{material}</span>
                  ))}
                </div>
                <div className="plant-strip" aria-label="Plant palette">
                  {assessment.recommendations.plants.map((plant) => (
                    <span key={plant}>{plant}</span>
                  ))}
                </div>
              </>
            ) : (
              <p className="empty-state">Generate a vision to lock the current recommendations.</p>
            )}
          </article>
        </section>

        <section className="report-panel" aria-label="Shareable report">
          <div className="report-copy">
            <p className="eyebrow">Shareable output</p>
            <h2>One-page contractor handoff</h2>
            <p>
              {assessment
                ? assessment.summary
                : 'The report will combine the uploaded image, transformed view, hazards, and material list.'}
            </p>
            <dl>
              <div>
                <dt>Photo</dt>
                <dd>{assessment?.runMeta.photoName ?? photoName ?? 'Not selected'}</dd>
              </div>
              <div>
                <dt>Conditions</dt>
                <dd>
                  {getOptionLabel('topography', conditions.topography)} ·{' '}
                  {getOptionLabel('fence', conditions.fence)}
                </dd>
              </div>
              <div>
                <dt>Generated</dt>
                <dd>{assessment?.runMeta.generatedAt ?? 'Pending'}</dd>
              </div>
              <div>
                <dt>Model</dt>
                <dd>{assessment?.runMeta.imageModel ?? (provider === 'gemini' ? GEMINI_IMAGE_MODEL : 'Mock')}</dd>
              </div>
            </dl>
          </div>
          <button className="secondary-action" onClick={printReport} type="button">
            Print report
          </button>
        </section>
      </main>
    </div>
  )
}

export default App
