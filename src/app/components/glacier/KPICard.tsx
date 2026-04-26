interface KPICardProps {
  label: string;
  value: string | number;
  unit?: string;
  delta: string;
  type: 'red' | 'blue' | 'amber' | 'teal';
  deltaType?: 'up' | 'neutral' | 'good';
}

export function KPICard({ label, value, unit, delta, type, deltaType = 'up' }: KPICardProps) {
  const colors = {
    red: 'var(--glacier-red)',
    blue: 'var(--glacier-blue)',
    amber: 'var(--glacier-amber)',
    teal: 'var(--glacier-teal)',
  };

  const deltaColors = {
    up: 'var(--glacier-red)',
    neutral: 'var(--text-dim)',
    good: 'var(--glacier-teal)',
  };

  return (
    <div className="relative rounded-2xl p-4 border transition-colors overflow-hidden"
      style={{
        background: 'var(--surface)',
        borderColor: 'var(--glacier-border)',
        animation: 'fadeSlideIn 0.4s ease both'
      }}
      onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--border-bright)'}
      onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--glacier-border)'}>
      <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
        style={{ background: colors[type] }}></div>

      <div className={`${label === 'RISK SCORE' ? 'text-[14px]' : 'text-[11px]'} uppercase tracking-wider mb-2`}
        style={{ color: 'var(--text-dim)' }}>
        {label}
      </div>

      <div className={`${label === 'RISK SCORE' ? 'text-5xl' : 'text-3xl'} tracking-tight leading-none mb-1.5`}
        style={{ color: colors[type] }}>
        {value}
        {unit && (
          <span className={`${label === 'RISK SCORE' ? 'text-lg' : 'text-sm'} ml-0.5`} style={{ color: 'var(--text-muted)' }}>
            {unit}
          </span>
        )}
      </div>

      <div className="flex items-center gap-1 text-[12px] font-mono"
        style={{ color: deltaColors[deltaType] }}>
        {delta}
      </div>
    </div>
  );
}
