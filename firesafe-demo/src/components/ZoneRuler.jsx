/**
 * ZoneRuler
 * Signature visual measuring device showing progress through the workflow
 * and defensible space distance markers.
 */
export default function ZoneRuler({ label, right, pct = 0, ticks = [], active = 0 }) {
  return (
    <div className="ruler" role="progressbar" aria-valuenow={pct} aria-valuemin="0" aria-valuemax="100">
      <div className="ruler-cap">
        <span className="eyebrow">{label}</span>
        {right && <span className="eyebrow">{right}</span>}
      </div>
      <div className="ruler-track">
        <div className="ruler-fill" style={{ width: `${Math.min(100, Math.max(0, pct))}%` }} />
      </div>
      {ticks.length > 0 && (
        <div className="ruler-ticks">
          {ticks.map((tick, i) => {
            const leftPct = (i / (ticks.length - 1)) * 100
            const isPassed = i <= active
            return (
              <div
                key={tick}
                className="ruler-tick"
                data-on={isPassed ? 'true' : 'false'}
                style={{ left: `${leftPct}%` }}
              >
                <i />
                <span>{tick}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
