const infrastructure = [
  {
    name: 'Chungthang Town',
    detail: '~65 km · Major settlement; site of the destroyed Teesta III dam',
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
    name: 'National Highway 10',
    detail: '~100+ km · Critical artery connecting Sikkim to the rest of India',
    risk: 'high' as const,
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M2 10h12M4 10L6 6h4l2 4" stroke="#ff5c5c" strokeWidth="1.2" strokeLinecap="round"/>
        <rect x="5" y="7" width="6" height="3" rx="0.5" fill="rgba(255,92,92,0.2)"/>
      </svg>
    )
  },
  {
    name: 'Singtam/Rangpo',
    detail: '~130-135 km · Downstream hubs with significant residential density',
    risk: 'medium' as const,
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="2" y="5" width="4" height="6" rx="0.5" stroke="#f5a623" strokeWidth="1.2"/>
        <rect x="7" y="3" width="4" height="8" rx="0.5" stroke="#f5a623" strokeWidth="1.2"/>
        <rect x="12" y="6" width="3" height="5" rx="0.5" stroke="#f5a623" strokeWidth="1.2"/>
        <circle cx="4" cy="13" r="0.8" fill="#f5a623" opacity="0.5"/>
        <circle cx="9" cy="13" r="0.8" fill="#f5a623" opacity="0.5"/>
      </svg>
    )
  },
  {
    name: 'Teesta River Basin',
    detail: '~140+ km · Crucial agricultural and riparian land/ecosystems',
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
              <div className="text-[14px]" style={{ color: 'var(--text)' }}>
                {item.name}
              </div>
              <div className="text-[12px] mt-1" style={{ color: 'var(--text-muted)' }}>
                {item.detail}
              </div>
            </div>
            <div className="text-[11px] px-3 py-1.5 rounded-full flex-shrink-0 border"
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
    </div>
  );
}
