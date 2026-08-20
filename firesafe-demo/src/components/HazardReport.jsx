import { useState } from 'react'
import ZoneRuler from './ZoneRuler'
import BeforeAfterSlider from './BeforeAfterSlider'
import { HAZARD_LIBRARY } from '../data/hazardLibrary'
import { PLANT_DATABASE } from '../data/plantDatabase'

export default function HazardReport({
  photoUrl,
  generatedImageUrl,
  generatedText,
  flags = [],
  intakeAnswers = {},
  onReset,
  onLearnMore,
}) {
  const [lens, setLens] = useState('both') // 'both' | 'state' | 'ins'
  const [selectedPin, setSelectedPin] = useState(null)
  const [openCard, setOpenCard] = useState(null)

  // Group active flags by defensible zone
  const z0Flags = flags.filter((code) => HAZARD_LIBRARY[code]?.zone === 0)
  const z1Flags = flags.filter((code) => HAZARD_LIBRARY[code]?.zone === 1)
  const z2Flags = flags.filter((code) => HAZARD_LIBRARY[code]?.zone === 2)

  const highSeverityCount = flags.filter((code) => HAZARD_LIBRARY[code]?.severity === 'high').length
  const freeOrLowWins = flags.filter((code) => {
    const cost = HAZARD_LIBRARY[code]?.cost || ''
    return cost.startsWith('Free') || cost.startsWith('Low')
  }).length

  // Blockers for IBHS insurance designation
  const ibhsBlockers = flags.filter((code) => {
    const insStatus = HAZARD_LIBRARY[code]?.ins?.[0] || ''
    return insStatus.startsWith('Required') || insStatus.startsWith('Mandatory')
  })

  // Relevant plant recommendations (Zone 1 & 2 only)
  const recommendedPlants = PLANT_DATABASE.filter((p) => p.highlight).slice(0, 4)

  const handleSelectFlag = (code) => {
    setSelectedPin(code)
    setOpenCard(code)
  }

  const handleToggleCard = (code) => {
    setOpenCard(openCard === code ? null : code)
    setSelectedPin(openCard === code ? null : code)
  }

  const getSeverityStyle = (sev) => {
    if (sev === 'high') return { bg: 'var(--sev-high-bg)', color: 'var(--sev-high)', border: 'var(--sev-high)' }
    if (sev === 'medium') return { bg: 'var(--sev-med-bg)', color: 'var(--sev-med)', border: 'var(--sev-med)' }
    return { bg: 'var(--sev-low-bg)', color: 'var(--sev-low)', border: 'var(--sev-low)' }
  }

  return (
    <div className="report-container">
      {/* Step Ruler */}
      <ZoneRuler
        label="Assessment & Action Plan"
        right="Complete"
        pct={100}
        ticks={['Property', 'Zone 0', 'Goal', 'Photo', 'Analysis', 'Report']}
        active={5}
      />

      {/* Report Header & Filter Lens */}
      <div className="report-header">
        <div>
          <span className="eyebrow">FireSafe Property Report</span>
          <h1 className="display">What we found</h1>
        </div>

        <div className="lens" role="group" aria-label="Filter standard view">
          {[
            ['both', 'Both standards'],
            ['state', 'State rule (PRC 4291)'],
            ['ins', 'Insurance (IBHS / Safer from Wildfires)'],
          ].map(([val, label]) => (
            <button
              key={val}
              type="button"
              data-on={lens === val ? 'true' : 'false'}
              onClick={() => setLens(val)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Before / After Split Slider */}
      <div className="slider-wrapper">
        <BeforeAfterSlider
          originalSrc={photoUrl}
          generatedSrc={generatedImageUrl}
          flags={flags}
          selectedFlag={selectedPin}
          onSelectFlag={handleSelectFlag}
          isGenerated={Boolean(generatedImageUrl)}
        />
        <p className="note">
          Drag the slider handle to compare your property's current state with the fire-resilient design. Numbered pins identify high-risk ignition points detected in the assessment.
        </p>
        {generatedText && <p className="model-note-banner">{generatedText}</p>}
      </div>

      {/* Summary Metrics */}
      <div className="tally">
        <div className="tally-card">
          <div className="num">{flags.length}</div>
          <div className="lab">Conditions flagged</div>
        </div>
        <div className="tally-card">
          <div className="num" style={{ color: highSeverityCount > 0 ? 'var(--sev-high)' : 'inherit' }}>
            {highSeverityCount}
          </div>
          <div className="lab">High priority (Act first)</div>
        </div>
        <div className="tally-card">
          <div className="num" style={{ color: 'var(--deep)' }}>
            {freeOrLowWins}
          </div>
          <div className="lab">Doable this weekend</div>
        </div>
      </div>

      {/* Zone 0 Section */}
      {z0Flags.length > 0 && (
        <div className="zone-section">
          <div className="zone-head">
            <h3>Zone 0 — Ember Ignition Zone</h3>
            <span className="dist mono">0–5 ft from wall</span>
          </div>

          <div className="flag-group">
            {z0Flags.map((code) => {
              const d = HAZARD_LIBRARY[code]
              if (!d) return null
              const isOpen = openCard === code
              const isSelected = selectedPin === code
              const sev = getSeverityStyle(d.severity)
              const isInsLive = lens !== 'state'

              return (
                <article
                  key={code}
                  className="flag"
                  data-open={isOpen ? 'true' : 'false'}
                  data-sel={isSelected ? 'true' : 'false'}
                >
                  <div
                    className="flag-top"
                    onClick={() => handleToggleCard(code)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleToggleCard(code)}
                    aria-expanded={isOpen}
                  >
                    <span className="flag-pin-badge mono" style={{ background: sev.color }}>
                      {flags.indexOf(code) + 1}
                    </span>
                    <span className="flag-code mono" style={{ background: sev.bg, color: sev.color }}>
                      {d.code}
                    </span>
                    <span className="flag-title">{d.title}</span>
                    <svg className="flag-chev" width="9" height="13" viewBox="0 0 7 11" fill="none">
                      <path d="M1 1L5.5 5.5L1 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                  </div>

                  {isOpen && (
                    <div className="flag-body">
                      <p className="flag-obs">{d.why}</p>

                      <div className="statuses">
                        <div className="status" data-live={lens === 'state' || lens === 'both' ? 'true' : 'false'}>
                          <div className="k">State Regulatory Track</div>
                          <div
                            className="v"
                            style={{
                              color: d.reg[0].startsWith('Enforceable') ? 'var(--sev-high)' : 'var(--sage)',
                            }}
                          >
                            {d.reg[0]}
                          </div>
                          <div className="n">{d.reg[1]}</div>
                        </div>

                        <div className="status" data-live={isInsLive ? 'true' : 'false'}>
                          <div className="k">Insurance Standard (IBHS / Safer from Wildfires)</div>
                          <div className="v" style={{ color: 'var(--deep)' }}>
                            {d.ins[0]}
                          </div>
                          <div className="n">{d.ins[1]}</div>
                        </div>
                      </div>

                      <div className="action">
                        <b>Recommended Action</b>
                        <p>{d.action}</p>

                        <b>Approved Materials / Palette</b>
                        <p>{d.options}</p>

                        <b>Estimated Effort & Cost</b>
                        <p style={{ marginBottom: 0 }}>{d.cost}</p>
                      </div>
                    </div>
                  )}
                </article>
              )
            })}
          </div>
        </div>
      )}

      {/* Zone 1 Section */}
      {z1Flags.length > 0 && (
        <div className="zone-section">
          <div className="zone-head">
            <h3>Zone 1 — Lean, Clean & Green</h3>
            <span className="dist mono">5–30 ft perimeter</span>
          </div>

          <div className="flag-group">
            {z1Flags.map((code) => {
              const d = HAZARD_LIBRARY[code]
              if (!d) return null
              const isOpen = openCard === code
              const isSelected = selectedPin === code
              const sev = getSeverityStyle(d.severity)

              return (
                <article
                  key={code}
                  className="flag"
                  data-open={isOpen ? 'true' : 'false'}
                  data-sel={isSelected ? 'true' : 'false'}
                >
                  <div
                    className="flag-top"
                    onClick={() => handleToggleCard(code)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleToggleCard(code)}
                    aria-expanded={isOpen}
                  >
                    <span className="flag-pin-badge mono" style={{ background: sev.color }}>
                      {flags.indexOf(code) + 1}
                    </span>
                    <span className="flag-code mono" style={{ background: sev.bg, color: sev.color }}>
                      {d.code}
                    </span>
                    <span className="flag-title">{d.title}</span>
                    <svg className="flag-chev" width="9" height="13" viewBox="0 0 7 11" fill="none">
                      <path d="M1 1L5.5 5.5L1 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                  </div>

                  {isOpen && (
                    <div className="flag-body">
                      <p className="flag-obs">{d.why}</p>

                      <div className="statuses">
                        <div className="status" data-live="true">
                          <div className="k">State Law (PRC § 4291)</div>
                          <div className="v" style={{ color: 'var(--sev-high)' }}>
                            {d.reg[0]}
                          </div>
                          <div className="n">{d.reg[1]}</div>
                        </div>

                        <div className="status" data-live="true">
                          <div className="k">Insurance Mitigation Credit</div>
                          <div className="v" style={{ color: 'var(--deep)' }}>
                            {d.ins[0]}
                          </div>
                          <div className="n">{d.ins[1]}</div>
                        </div>
                      </div>

                      <div className="action">
                        <b>Recommended Action</b>
                        <p>{d.action}</p>

                        <b>Guidance & Spacing Formula</b>
                        <p>{d.options}</p>

                        <b>Estimated Effort</b>
                        <p style={{ marginBottom: 0 }}>{d.cost}</p>
                      </div>
                    </div>
                  )}
                </article>
              )
            })}
          </div>
        </div>
      )}

      {/* Zone 2 Section */}
      {z2Flags.length > 0 && (
        <div className="zone-section">
          <div className="zone-head">
            <h3>Zone 2 — Reduced Fuel Zone</h3>
            <span className="dist mono">30–100 ft boundary</span>
          </div>

          <div className="flag-group">
            {z2Flags.map((code) => {
              const d = HAZARD_LIBRARY[code]
              if (!d) return null
              const isOpen = openCard === code
              const isSelected = selectedPin === code
              const sev = getSeverityStyle(d.severity)

              return (
                <article
                  key={code}
                  className="flag"
                  data-open={isOpen ? 'true' : 'false'}
                  data-sel={isSelected ? 'true' : 'false'}
                >
                  <div
                    className="flag-top"
                    onClick={() => handleToggleCard(code)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleToggleCard(code)}
                    aria-expanded={isOpen}
                  >
                    <span className="flag-pin-badge mono" style={{ background: sev.color }}>
                      {flags.indexOf(code) + 1}
                    </span>
                    <span className="flag-code mono" style={{ background: sev.bg, color: sev.color }}>
                      {d.code}
                    </span>
                    <span className="flag-title">{d.title}</span>
                    <svg className="flag-chev" width="9" height="13" viewBox="0 0 7 11" fill="none">
                      <path d="M1 1L5.5 5.5L1 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                  </div>

                  {isOpen && (
                    <div className="flag-body">
                      <p className="flag-obs">{d.why}</p>
                      <div className="action">
                        <b>Recommended Action</b>
                        <p>{d.action}</p>
                        <b>Guidance</b>
                        <p>{d.options}</p>
                        <b>Effort</b>
                        <p style={{ marginBottom: 0 }}>{d.cost}</p>
                      </div>
                    </div>
                  )}
                </article>
              )
            })}
          </div>
        </div>
      )}

      {/* Insurance Pathway Card */}
      <div className="pathway">
        <div className="pathway-head">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--deep)" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h3>Your Insurance Discount Pathway</h3>
        </div>
        <p className="sub">
          {ibhsBlockers.length === 0
            ? 'No Zone 0 conditions currently block the IBHS Essential designation on your property.'
            : `${ibhsBlockers.length} ${
                ibhsBlockers.length === 1 ? 'condition stands' : 'conditions stand'
              } between you and the IBHS Essential designation. The standard requires 100% completion of all mandatory items—partial mitigation does not qualify.`}
        </p>

        {ibhsBlockers.length > 0 && (
          <div className="blockers">
            {ibhsBlockers.map((code) => {
              const item = HAZARD_LIBRARY[code]
              return (
                <div className="blocker" key={code}>
                  <span className="b-code mono">{code}</span>
                  <span className="b-action">{item?.action}</span>
                </div>
              )
            })}
          </div>
        )}

        <div className="pathway-callout">
          <strong>Mandated Discounts (10 CCR § 2644.9 & AB 1):</strong>
          <p>
            California law requires insurers pricing wildfire risk to offer documented discounts (typically 5% to 35%) for verified defensible space and home hardening. Photograph all completed retrofits with timestamped documentation for your insurance provider or IBHS assessor.
          </p>
        </div>
      </div>

      {/* Plant Palette */}
      <div className="zone-section" style={{ marginTop: 36 }}>
        <div className="zone-head">
          <h3>Recommended SoCal Fire-Resilient Native Plants</h3>
          <span className="dist mono">For Zone 1 & 2 (Beyond 5 ft)</span>
        </div>
        <div className="plants-grid">
          {recommendedPlants.map((plant) => (
            <div className="plant-card" key={plant.id}>
              <div className="pn">{plant.name}</div>
              <div className="ps mono">{plant.scientific}</div>
              <div className="badge-row">
                <span className="plant-badge">{plant.zone}</span>
                <span className="plant-badge water">{plant.water} water</span>
              </div>
              <div className="pd">{plant.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Printable Report Summary / Contractor Handoff Card */}
      <section className="report-panel printable-summary" aria-label="Shareable contractor handoff">
        <div className="report-copy">
          <p className="eyebrow">Exportable Record</p>
          <h2>One-Page Contractor & Permit Handoff</h2>
          <p>
            Ready-to-print specification containing site conditions, active hazard flags, and code requirements. Hand this to your landscape contractor or local FireSafe Council representative.
          </p>
          <dl className="report-meta-grid">
            <div>
              <dt>Assessed Location</dt>
              <dd>{intakeAnswers.jurisdiction || 'Los Angeles County'}</dd>
            </div>
            <div>
              <dt>Primary Terrain</dt>
              <dd>{intakeAnswers.topography || 'Flat (<5%)'}</dd>
            </div>
            <div>
              <dt>Evaluation Date</dt>
              <dd>{new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</dd>
            </div>
            <div>
              <dt>Standards Checked</dt>
              <dd>CAL FIRE PRC 4291 & IBHS Technical Standard</dd>
            </div>
          </dl>
        </div>

        <button className="secondary-action print-btn" onClick={() => window.print()} type="button">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6 14h12v8H6z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Print / Save PDF Report
        </button>
      </section>

      {/* Bottom Actions */}
      <div className="row bottom-nav-row">
        <button className="btn" type="button" onClick={onReset}>
          Assess Another Photo
        </button>
        <button className="btn btn-ghost" type="button" onClick={onLearnMore}>
          Read Why This Matters
        </button>
      </div>
    </div>
  )
}
