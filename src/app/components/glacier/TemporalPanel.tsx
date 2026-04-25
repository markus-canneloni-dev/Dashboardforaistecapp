import { useState } from 'react';

const epochs = [
  { year: 2016, area: '0.68 km²', height: 28, color: 'rgba(45,212,160,0.5)' },
  { year: 2018, area: '1.01 km²', height: 42, color: 'rgba(45,212,160,0.6)' },
  { year: 2020, area: '1.42 km²', height: 59, color: 'rgba(74,158,255,0.6)' },
  { year: 2022, area: '1.80 km²', height: 75, color: 'rgba(245,166,35,0.55)' },
  { year: 2024, area: '2.41 km²', height: 100, color: 'rgba(255,92,92,0.55)', isLatest: true },
];

export function TemporalPanel() {
  const [activeEpoch, setActiveEpoch] = useState(2024);

  return (
    <div className="rounded-2xl border overflow-hidden"
      style={{
        background: 'var(--surface)',
        borderColor: 'var(--glacier-border)'
      }}>
      <div className="px-[18px] pt-3.5">
        <div className="text-[11px] uppercase tracking-wider"
          style={{ color: 'var(--text-dim)' }}>
          Sentinel-2 multitemporal — lake growth story
        </div>
      </div>

      <div className="px-[18px] py-3.5">
        <div className="flex gap-2">
          {epochs.map((epoch) => (
            <div
              key={epoch.year}
              onClick={() => setActiveEpoch(epoch.year)}
              className={`flex-1 rounded-xl border overflow-hidden cursor-pointer transition-colors ${
                activeEpoch === epoch.year ? 'border-[var(--glacier-blue)]' : ''
              }`}
              style={{
                background: 'var(--surface-raised)',
                borderColor: activeEpoch === epoch.year ? 'var(--glacier-blue)' : 'var(--glacier-border)'
              }}>
              <div className="relative h-20 overflow-hidden" style={{ background: '#0d1929' }}>
                <div
                  className="absolute bottom-0 left-0 right-0 transition-all duration-[600ms]"
                  style={{
                    height: `${epoch.height}%`,
                    background: epoch.color,
                    borderRadius: '0 0 var(--r-sm) var(--r-sm)'
                  }}>
                </div>
                <div className="absolute top-1.5 right-1.5 text-[9px] font-mono px-1.5 py-0.5 rounded border backdrop-blur-sm"
                  style={{
                    background: 'rgba(10,15,30,0.8)',
                    borderColor: epoch.isLatest ? 'rgba(74,158,255,0.3)' : 'var(--glacier-border)',
                    color: epoch.isLatest ? 'var(--glacier-blue)' : 'var(--text-dim)'
                  }}>
                  {epoch.isLatest ? 'latest' : 'S2'}
                </div>
              </div>
              <div className="p-2">
                <div className="text-[11px] font-mono" style={{ color: 'var(--text)' }}>
                  {epoch.year}
                </div>
                <div className="text-[10px] font-mono"
                  style={{ color: epoch.isLatest ? 'var(--glacier-red)' : 'var(--text-dim)' }}>
                  {epoch.area}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-2.5 text-[10px] leading-relaxed" style={{ color: 'var(--text-dim)' }}>
          Column fill height = relative lake surface area. Color shift green→amber→red encodes acceleration. Click any epoch to update map view.
        </div>
      </div>
    </div>
  );
}
