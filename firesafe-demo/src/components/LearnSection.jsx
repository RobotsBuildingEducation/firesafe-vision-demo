import { MYTHS, DEFENSIBLE_ZONES, SOURCES } from '../data/mythsAndSources'
import { PLANT_DATABASE, PLANTS_TO_AVOID, PLANT_SELECTION_PRINCIPLES } from '../data/plantDatabase'

export default function LearnSection({ onStartAssessment }) {
  return (
    <div className="learn-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="eyebrow kicker">Why this exists</div>
        <h1 className="hero-title">
          Most homes don't burn from the front. They burn from the edges.
        </h1>
        <p className="hero-p">
          In catastrophic Southern California wildfires, whole neighborhood blocks are lost while the trees between them remain standing. That pattern isn't random. Over 85% of destroyed structures ignite from <em>wind-blown embers</em> that travel miles ahead of the fire front, lodging into dry bark mulch banked against siding, unrated vent screens, roof eaves, and patio corners.
        </p>
        <p className="hero-p">
          <strong>FireSafe Vision</strong> translates complex defensible space science and dual regulatory/insurance standards into actionable, visual intelligence for your property.
        </p>
      </section>

      {/* Myths Section */}
      <section className="sect">
        <h2>What people get wrong</h2>
        <p className="lede">
          Five common assumptions about wildfire defense, and what California fire science and statutory code actually prove.
        </p>
        <div className="myth-list">
          {MYTHS.map((m) => (
            <article className="myth-row" key={m.id}>
              <div className="myth-q">
                <span
                  className="verdict mono"
                  data-v={m.verdict}
                >
                  {m.verdict === 'partly' ? 'Partly True' : 'False'}
                </span>
                <p>{m.question}</p>
              </div>
              <p className="myth-a">{m.answer}</p>
            </article>
          ))}
        </div>
      </section>

      {/* The Three Defensible Zones */}
      <section className="sect">
        <h2>The Three Defensible Space Zones</h2>
        <p className="lede">
          Defensible space is organized by radial distance from the exterior wall of your home. Each concentric band serves a specific thermodynamic purpose.
        </p>
        <div className="zonecards">
          {DEFENSIBLE_ZONES.map((z) => (
            <div className="zonecard" key={z.zone}>
              <div className="zh">
                <span className="band mono">{z.range}</span>
                <h3>
                  {z.zone}: {z.title}
                </h3>
              </div>
              <p className="zone-sub">{z.subtitle}</p>
              <p className="zone-principle">{z.corePrinciple}</p>
              <ul className="zone-bullets">
                {z.requirements.map((req, i) => (
                  <li key={i} dangerouslySetInnerHTML={{ __html: req }} />
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Dual Standards Deep Dive */}
      <section className="sect">
        <h2>Two Standards, Not One</h2>
        <p className="lede">
          This is the critical distinction that almost nobody explains. The first five feet around your structure is governed by two separate systems operating on different timelines with distinct rules.
        </p>

        <div className="tracks">
          <div className="track">
            <div className="th">
              <h3>Track A: State Regulatory Rule</h3>
              <span className="badge draft">Still a Draft</span>
            </div>
            <p className="auth mono">PRC § 4291 · AB 3074 · Board of Forestry</p>
            <p>
              AB 3074 directed the Board of Forestry to establish a statewide Zone 0 ember-resistant rule. The initial adoption deadline passed without finalization, and the latest draft was released in April 2026. While Zone 1 and 2 rules are legally inspected and enforced today, statewide Zone 0 citations are not yet active (except in cities like San Diego that enacted local ordinances).
            </p>
            <dl>
              <div>
                <dt>In force today</dt>
                <dd>Zone 1 (5–30 ft) and Zone 2 (30–100 ft) — strictly enforced and inspected.</dd>
              </div>
              <div>
                <dt>Penalties if ignored</dt>
                <dd>Citations from $100–$500 and property tax lien risk on Zone 1/2 non-compliance.</dd>
              </div>
              <div>
                <dt>Watch for</dt>
                <dd>Local municipal codes that enacted Zone 0 requirements ahead of the state.</dd>
              </div>
            </dl>
          </div>

          <div className="track" data-live="true">
            <div className="th">
              <h3>Track B: Insurance Standard</h3>
              <span className="badge active">In Force Today</span>
            </div>
            <p className="auth mono">IBHS Wildfire Prepared Home™ · 10 CCR § 2644.9</p>
            <p>
              The Insurance Institute for Business & Home Safety operates an active, certifiable designation standard (Essential and Enhanced tiers). Under California's "Safer from Wildfires" regulations (expanded by AB 1 in Jan 2026), admitted insurers pricing wildfire risk are required by law to offer premium discounts for verified compliance.
            </p>
            <dl>
              <div>
                <dt>In force today</dt>
                <dd>Fully actionable right now. Homeowners can apply for designation this month.</dd>
              </div>
              <div>
                <dt>Financial value</dt>
                <dd>Documented premium credits between 5% and 35%, plus a pathway off the CA FAIR Plan.</dd>
              </div>
              <div>
                <dt>The key rule</dt>
                <dd>100% compliance on all mandatory items — partial mitigation does not qualify.</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="divergence-callout">
          <strong>Where the two standards diverge:</strong>
          <p>
            The state's draft allows an exception for well-irrigated, low-growing native succulents (like Dudleya) in Zone 0. In contrast, the IBHS Insurance standard permits <em>zero vegetation</em> in the first five feet. If your goal is securing an insurance discount or exiting the FAIR Plan, follow the stricter IBHS standard.
          </p>
        </div>
      </section>

      {/* Fire-Resilient Plant Selection & Avoidance */}
      <section className="sect">
        <h2>Plant Selection Principles & Avoidance Guide</h2>
        <p className="lede">
          Past the 5-foot noncombustible perimeter, plant selection and ongoing maintenance determine your property's fire resistance.
        </p>

        <div className="principles-grid">
          {PLANT_SELECTION_PRINCIPLES.map((principle) => (
            <div className="principle-card" key={principle.trait}>
              <h4>{principle.trait}</h4>
              <p>{principle.desc}</p>
            </div>
          ))}
        </div>

        <h3 style={{ marginTop: 32, marginBottom: 12 }}>High-Risk Plants to Avoid Near Structures</h3>
        <div className="avoid-grid">
          {PLANTS_TO_AVOID.map((p) => (
            <div className="avoid-card" key={p.name}>
              <div className="avoid-head">
                <span className="avoid-name">{p.name}</span>
                <span className="avoid-sci mono">{p.scientific}</span>
              </div>
              <p className="avoid-reason">{p.reason}</p>
            </div>
          ))}
        </div>

        <h3 style={{ marginTop: 32, marginBottom: 12 }}>Recommended SoCal Native Species (Zones 1 & 2)</h3>
        <div className="plants-grid">
          {PLANT_DATABASE.map((plant) => (
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
      </section>

      {/* Authoritative Sources */}
      <section className="sect">
        <h2>Primary Sources & References</h2>
        <p className="lede">
          Every recommendation and metric in FireSafe Vision is grounded in authoritative state fire codes and scientific research.
        </p>
        <div className="srcs">
          {SOURCES.map((s) => (
            <a
              className="src"
              key={s.name}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="sname">{s.name} ↗</div>
              <div className="swhat">{s.scope}</div>
            </a>
          ))}
        </div>
      </section>

      {/* Call to action */}
      <div className="cta-strip">
        <h2>Evaluate Your Own Property</h2>
        <p>
          Answer six quick questions and upload a photo of your structure. You will receive an immediate breakdown of flagged conditions, the dual-standard status of each item, and an actionable roadmap to resilience.
        </p>
        <button className="btn cta-btn" type="button" onClick={onStartAssessment}>
          Start Property Assessment
        </button>
      </div>
    </div>
  )
}
