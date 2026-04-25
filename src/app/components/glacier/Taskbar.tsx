import { useState, useEffect } from 'react';

export function Taskbar() {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
      setDate(now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 h-12 flex items-center justify-center gap-1.5 z-50 border-t"
      style={{
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(24px)',
        borderColor: 'var(--glacier-border)'
      }}>
      <div className="w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer transition-colors border border-transparent"
        style={{ background: 'var(--surface-raised)' }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'var(--surface-raised)'}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <rect x="2" y="2" width="6" height="6" rx="1" fill="rgba(74,158,255,0.8)"/>
          <rect x="10" y="2" width="6" height="6" rx="1" fill="rgba(74,158,255,0.6)"/>
          <rect x="2" y="10" width="6" height="6" rx="1" fill="rgba(74,158,255,0.6)"/>
          <rect x="10" y="10" width="6" height="6" rx="1" fill="rgba(74,158,255,0.4)"/>
        </svg>
      </div>

      <div className="w-px h-6" style={{ background: 'var(--glacier-border)' }}></div>

      <div className="w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer transition-colors border"
        style={{ background: 'rgba(74,158,255,0.15)', borderColor: 'rgba(74,158,255,0.3)' }}
        title="GlacierWatch">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M3 13 Q9 4 15 13" stroke="#4a9eff" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
          <circle cx="9" cy="7" r="2" fill="#4a9eff" opacity="0.6"/>
        </svg>
        <div className="absolute bottom-1 w-1 h-1 rounded-full" style={{ background: 'var(--glacier-blue)' }}></div>
      </div>

      <div className="absolute right-4 text-right font-mono"
        style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
        <div>{time}</div>
        <div style={{ fontSize: '10px' }}>{date}</div>
      </div>
    </div>
  );
}
