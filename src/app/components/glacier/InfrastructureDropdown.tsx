const infrastructure = [
  {
    name: 'Zernez village',
    detail: '4.2 km downstream · pop 1,200 · valley floor',
    risk: 'high' as const,
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="3" y="6" width="10" height="8" rx="1" stroke="#ff5c5c" strokeWidth="1.2"/>
        <path d="M5 6V4a3 3 0 016 0v2" stroke="#ff5c5c" strokeWidth="1.2"/>
        <circle cx="8" cy="10" r="1.5" fill="#ff5c5c" opacity="0.5"/>
      </svg>
    )
  },
  {
    name: 'H27 main road',
    detail: '3.1 km · primary valley artery · no bypass route',
    risk: 'high' as const,
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M2 10h12M4 10L6 6h4l2 4" stroke="#ff5c5c" strokeWidth="1.2" strokeLinecap="round"/>
        <rect x="5" y="7" width="6" height="3" rx="0.5" fill="rgba(255,92,92,0.2)"/>
      </svg>
    )
  },
  {
    name: 'Hydropower intake',
    detail: '6.8 km · 40 MW capacity · Inn river system',
    risk: 'medium' as const,
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 2v3M8 11v3M4 5l2 2M10 9l2 2M2 8h3M11 8h3" stroke="#f5a623" strokeWidth="1.2" strokeLinecap="round"/>
        <circle cx="8" cy="8" r="2.5" stroke="#f5a623" strokeWidth="1.2"/>
      </svg>
    )
  },
  {
    name: 'National park buffer',
    detail: '8.4 km · Swiss NP · protected ecology',
    risk: 'low' as const,
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 3C5.5 3 3 5 3 8s2 5 5 5 5-2.5 5-5-2.5-5-5-5z" stroke="#2dd4a0" strokeWidth="1.2"/>
        <path d="M6 8s.5-2 2-2 2 2 2 2-1 2-2 2-2-2-2-2z" stroke="#2dd4a0" strokeWidth="1" fill="rgba(45,212,160,0.1)"/>
      </svg>
    )
  },
];

const riskStyles = {
  high: {
    bg: 'rgba(255,92,92,0.1)',
    pill: 'var(--red-dim)',
    pillBorder: 'var(--red-mid)',
    pillText: 'var(--glacier-red)'
  },
  medium: {
    bg: 'rgba(245,166,35,0.1)',
    pill: 'var(--amber-dim)',
    pillBorder: 'rgba(245,166,35,0.2)',
    pillText: 'var(--glacier-amber)'
  },
  low: {
    bg: 'rgba(45,212,160,0.08)',
    pill: 'var(--teal-dim)',
    pillBorder: 'rgba(45,212,160,0.2)',
    pillText: 'var(--glacier-teal)'
  },
};

export function InfrastructureDropdown() {
  return (
    <div className="pt-4">
      <div className="flex flex-col">
        {infrastructure.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-3 py-3 border-b last:border-b-0"
            style={{ borderColor: 'var(--glacier-border)' }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: riskStyles[item.risk].bg }}>
              {item.icon}
            </div>
            <div className="flex-1">
              <div className="text-[13px]" style={{ color: 'var(--text)' }}>
                {item.name}
              </div>
              <div className="text-[10px] font-mono mt-0.5" style={{ color: 'var(--text-dim)' }}>
                {item.detail}
              </div>
            </div>
            <div className="text-[10px] px-2.5 py-1 rounded-full flex-shrink-0 border"
              style={{
                background: riskStyles[item.risk].pill,
                color: riskStyles[item.risk].pillText,
                borderColor: riskStyles[item.risk].pillBorder
              }}>
              {item.risk}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-2.5 rounded-xl p-3 border flex items-center gap-2.5"
        style={{
          background: 'rgba(255,92,92,0.07)',
          borderColor: 'rgba(255,92,92,0.2)'
        }}>
        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--glacier-red)' }}></div>
        <div className="text-[11px] leading-relaxed" style={{ color: 'var(--glacier-red)' }}>
          Glacial lake outburst flood (GLOF) probability: <strong>12%</strong> within 5-year window · moraine stability index 0.61 (moderate risk)
        </div>
      </div>
    </div>
  );
}
