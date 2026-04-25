export function TitleBar() {
  return (
    <div className="h-10 flex items-center justify-between px-4 sticky top-0 z-50 border-b"
      style={{
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(20px)',
        borderColor: 'var(--glacier-border)'
      }}>
      <div className="flex items-center gap-2.5">
        <div className="w-[18px] h-[18px] rounded flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, var(--glacier-blue) 0%, var(--glacier-teal) 100%)' }}>
          <svg viewBox="0 0 10 10" fill="none" className="w-2.5 h-2.5">
            <path d="M2 7 Q5 2 8 7" stroke="white" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
            <circle cx="5" cy="4" r="1" fill="white" opacity="0.7"/>
          </svg>
        </div>
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
          GlacierWatch — Risk Intelligence Dashboard
        </span>
      </div>
      <div className="flex gap-px">
        <div className="w-[46px] h-[30px] flex items-center justify-center cursor-pointer rounded hover:bg-white/8 transition-colors text-[10px]"
          style={{ color: 'var(--text-muted)' }}>
          &#8211;
        </div>
        <div className="w-[46px] h-[30px] flex items-center justify-center cursor-pointer rounded hover:bg-white/8 transition-colors text-[10px]"
          style={{ color: 'var(--text-muted)' }}>
          &#9633;
        </div>
        <div className="w-[46px] h-[30px] flex items-center justify-center cursor-pointer rounded hover:bg-[#c42b1c] hover:text-white transition-colors text-[10px]"
          style={{ color: 'var(--text-muted)' }}>
          &#10005;
        </div>
      </div>
    </div>
  );
}
