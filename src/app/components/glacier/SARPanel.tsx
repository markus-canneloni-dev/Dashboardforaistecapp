const sarMetrics = [
  { label: 'Glacier terminus retreat rate', value: '−38 m / yr', type: 'bad' as const },
  { label: 'Moraine stability index', value: '0.61 — moderate', type: 'warn' as const },
  { label: 'Ice volume proxy (since 2019)', value: '−12%', type: 'bad' as const },
  { label: 'SAR pass coherence score', value: '0.82 — high quality', type: 'good' as const },
  { label: 'Displacement velocity (InSAR)', value: '+4.2 cm / yr', type: 'warn' as const },
];

const valueColors = {
  bad: 'var(--glacier-red)',
  warn: 'var(--glacier-amber)',
  good: 'var(--glacier-teal)',
  neutral: 'var(--text)'
};

export function SARPanel() {
  return (
    <div className="rounded-2xl border overflow-hidden"
      style={{
        background: 'var(--surface)',
        borderColor: 'var(--glacier-border)'
      }}>
      <div className="flex items-center justify-between px-[18px] pt-3.5">
        <div className="text-[11px] uppercase tracking-wider"
          style={{ color: 'var(--text-dim)' }}>
          SAR coherence — ice &amp; moraine stability
        </div>
        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] border"
          style={{
            background: 'var(--teal-dim)',
            color: 'var(--glacier-teal)',
            borderColor: 'rgba(45,212,160,0.25)'
          }}>
          S1 coherence 0.82
        </div>
      </div>

      <div className="px-[18px] py-3.5">
        <div className="flex flex-col gap-2.5">
          {sarMetrics.map((metric, index) => (
            <div
              key={index}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg border"
              style={{
                background: 'var(--surface-raised)',
                borderColor: 'var(--glacier-border)'
              }}>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {metric.label}
              </div>
              <div className="text-[13px] font-mono"
                style={{ color: valueColors[metric.type] }}>
                {metric.value}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-2 rounded-xl p-3 border"
          style={{
            background: 'rgba(45,212,160,0.07)',
            borderColor: 'rgba(45,212,160,0.2)'
          }}>
          <div className="text-[10px] mb-0.5" style={{ color: 'var(--glacier-teal)' }}>
            SAR composite assessment
          </div>
          <div className="text-base" style={{ color: 'var(--glacier-teal)' }}>
            High data confidence · moraine motion detected
          </div>
        </div>
      </div>
    </div>
  );
}
