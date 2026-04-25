const parameters = [
  {
    label: 'SAR coherence',
    source: 'Sentinel-1 · C-band',
    score: 8.2,
    weight: '30%',
    contribution: '2.46',
    color: 'var(--glacier-blue)',
    width: 82
  },
  {
    label: 'Optical detection',
    source: 'Sentinel-2 · B3/B8/B11',
    score: 7.8,
    weight: '30%',
    contribution: '2.34',
    color: 'var(--glacier-teal)',
    width: 78
  },
  {
    label: 'Growth acceleration',
    source: 'Δ area vs 5-yr mean',
    score: 9.1,
    weight: '25%',
    contribution: '2.28',
    color: 'var(--glacier-red)',
    width: 91
  },
  {
    label: 'Downstream exposure',
    source: 'OSM infrastructure + pop',
    score: 6.4,
    weight: '15%',
    contribution: '0.96',
    color: 'var(--glacier-amber)',
    width: 64
  },
];

export function ParametersPanel() {
  return (
    <div className="rounded-2xl border overflow-hidden"
      style={{
        background: 'var(--surface)',
        borderColor: 'var(--glacier-border)'
      }}>
      <div className="flex items-center justify-between px-[18px] pt-3.5">
        <div className="text-[11px] uppercase tracking-wider"
          style={{ color: 'var(--text-dim)' }}>
          4-parameter risk model — backend output
        </div>
        <div className="text-[10px] font-mono" style={{ color: 'var(--text-dim)' }}>
          weighted composite
        </div>
      </div>

      <div className="px-[18px] py-3.5">
        <div className="grid grid-cols-2 gap-2.5 mb-2.5">
          {parameters.map((param) => (
            <div key={param.label} className="rounded-xl p-3 border"
              style={{
                background: 'var(--surface-raised)',
                borderColor: 'var(--glacier-border)'
              }}>
              <div className="text-[10px] uppercase tracking-wider mb-1.5"
                style={{ color: 'var(--text-dim)' }}>
                {param.label}
              </div>
              <div className="text-[9px] font-mono mb-1" style={{ color: 'var(--text-dim)' }}>
                {param.source}
              </div>
              <div className="text-2xl tracking-tight mb-0.5"
                style={{ color: param.color }}>
                {param.score}
              </div>
              <div className="text-[10px] mb-2" style={{ color: 'var(--text-dim)' }}>
                weight: {param.weight}  →  contribution: {param.contribution}
              </div>
              <div className="h-[3px] rounded overflow-hidden"
                style={{ background: 'var(--glacier-border)' }}>
                <div
                  className="h-full rounded"
                  style={{
                    width: `${param.width}%`,
                    background: param.color
                  }}>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl p-3 border flex items-center justify-between"
          style={{
            background: 'rgba(74,158,255,0.08)',
            borderColor: 'rgba(74,158,255,0.2)'
          }}>
          <div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Composite priority score
            </div>
            <div className="text-[10px] font-mono mt-0.5" style={{ color: 'var(--text-dim)' }}>
              8.2×0.30 + 7.8×0.30 + 9.1×0.25 + 6.4×0.15
            </div>
          </div>
          <div className="text-[22px]" style={{ color: 'var(--glacier-blue)' }}>
            74 / 100
          </div>
        </div>
      </div>
    </div>
  );
}
