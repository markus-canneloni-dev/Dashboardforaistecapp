const growthData = [
  { year: '2016', area: 0.68, width: 28, color: 'rgba(45,212,160,0.4)' },
  { year: '2017', area: 0.82, width: 34, color: 'rgba(45,212,160,0.5)' },
  { year: '2018', area: 1.01, width: 42, color: 'rgba(45,212,160,0.6)' },
  { year: '2019', area: 1.22, width: 51, color: 'rgba(74,158,255,0.5)' },
  { year: '2020', area: 1.42, width: 59, color: 'rgba(74,158,255,0.6)' },
  { year: '2021', area: 1.61, width: 67, color: 'rgba(74,158,255,0.7)' },
  { year: '2022', area: 1.80, width: 75, color: 'rgba(245,166,35,0.6)', highlight: 'amber' },
  { year: '2023', area: 2.23, width: 88, color: 'rgba(255,92,92,0.55)', highlight: 'red' },
  { year: '2024', area: 2.41, width: 100, color: 'rgba(255,92,92,0.7)', highlight: 'red', current: true },
];

export function GrowthPanel() {
  return (
    <div className="rounded-2xl border overflow-hidden"
      style={{
        background: 'var(--surface)',
        borderColor: 'var(--glacier-border)'
      }}>
      <div className="flex items-center justify-between px-[18px] pt-3.5">
        <div className="text-[11px] uppercase tracking-wider"
          style={{ color: 'var(--text-dim)' }}>
          Lake area growth — annual timeseries
        </div>
        <div className="text-[10px] font-mono" style={{ color: 'var(--text-dim)' }}>
          km² / year
        </div>
      </div>

      <div className="px-[18px] py-3.5">
        <div className="flex flex-col gap-2">
          {growthData.map((item) => (
            <div key={item.year} className={`flex items-center gap-2.5 ${item.current ? 'font-medium' : ''}`}>
              <div className="text-[11px] font-mono w-[30px] flex-shrink-0"
                style={{ color: item.current ? 'var(--text)' : 'var(--text-dim)' }}>
                {item.year}
              </div>
              <div className="flex-1 h-4 rounded overflow-hidden relative"
                style={{
                  background: item.current ? 'rgba(255,92,92,0.08)' : 'rgba(255,255,255,0.04)',
                  border: item.current ? '0.5px solid rgba(255,92,92,0.2)' : 'none'
                }}>
                <div
                  className="h-full rounded flex items-center justify-end pr-1.5 transition-all duration-[600ms]"
                  style={{
                    width: `${item.width}%`,
                    background: item.color,
                  }}>
                </div>
              </div>
              <div className="text-[10px] font-mono w-[38px] text-right flex-shrink-0"
                style={{
                  color: item.highlight === 'red' ? 'var(--glacier-red)' :
                         item.highlight === 'amber' ? 'var(--glacier-amber)' :
                         'var(--text-dim)'
                }}>
                {item.area} km²
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3.5 pt-3 border-t flex items-center justify-between"
          style={{ borderColor: 'var(--glacier-border)' }}>
          <div className="text-[10px]" style={{ color: 'var(--text-dim)' }}>
            Historical avg growth: +4.0% / yr
          </div>
          <div className="text-[11px] font-mono font-medium" style={{ color: 'var(--glacier-red)' }}>
            2024: +8.1% — 2× avg
          </div>
        </div>
      </div>
    </div>
  );
}
