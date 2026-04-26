export function Header() {
  return (
    <div>
      <div className="text-[32px] tracking-tight leading-tight mb-3" style={{ color: 'var(--text)' }}>
        South Lhonak Lake
      </div>
      <div className="flex items-center gap-2.5">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[13px] border"
          style={{
            background: 'rgba(16,185,129,0.1)',
            color: '#10b981',
            borderColor: 'rgba(16,185,129,0.3)'
          }}>
          <div className="w-2 h-2 rounded-full" style={{ background: '#10b981' }}></div>
          Active Monitoring
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[13px] border"
          style={{
            background: 'rgba(220,38,38,0.1)',
            color: '#dc2626',
            borderColor: 'rgba(220,38,38,0.3)'
          }}>
          <div className="w-2 h-2 rounded-full" style={{ background: '#dc2626' }}></div>
          High Alert
        </div>
      </div>
    </div>
  );
}
