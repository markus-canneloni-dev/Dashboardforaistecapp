const contributingMaps = [
  {
    name: 'SAR Coherence Map',
    source: 'Sentinel-1 · C-band',
    contribution: 'Ice & moraine stability detection',
    score: 8.2,
    color: 'var(--glacier-blue)'
  },
  {
    name: 'Optical Detection Map',
    source: 'Sentinel-2 · B3/B8/B11',
    contribution: 'Lake boundary delineation',
    score: 7.8,
    color: 'var(--glacier-teal)'
  },
  {
    name: 'Growth Acceleration Map',
    source: 'Δ area vs 5-yr mean',
    contribution: 'Temporal expansion analysis',
    score: 9.1,
    color: 'var(--glacier-red)'
  },
  {
    name: 'Downstream Exposure Map',
    source: 'OSM infrastructure + population',
    contribution: 'Risk corridor mapping',
    score: 6.4,
    color: 'var(--glacier-amber)'
  },
];

export function ContributingMapsDropdown() {
  return (
    <div className="pt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {contributingMaps.map((map, index) => (
          <div
            key={index}
            className="rounded-xl p-3 border cursor-pointer transition-colors"
            style={{
              background: 'var(--surface-raised)',
              borderColor: 'var(--glacier-border)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--border-bright)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--glacier-border)'}>
            <div className="text-[12px] mb-1" style={{ color: 'var(--text)' }}>
              {map.name}
            </div>
            <div className="text-[10px] font-mono mb-2" style={{ color: 'var(--text-dim)' }}>
              {map.source}
            </div>
            <div className="text-[10px] mb-3" style={{ color: 'var(--text-muted)' }}>
              {map.contribution}
            </div>
            <div className="flex items-center justify-between">
              <div className="text-xl tracking-tight" style={{ color: map.color }}>
                {map.score}
              </div>
              <div className="text-[10px] px-2 py-1 rounded border"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  borderColor: 'var(--glacier-border)',
                  color: 'var(--text-dim)'
                }}>
                View map
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
