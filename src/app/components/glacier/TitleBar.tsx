export function TitleBar() {
  return (
    <div className="h-10 flex items-center justify-between px-4 sticky top-0 z-50 border-b"
      style={{
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(20px)',
        borderColor: 'var(--glacier-border)'
      }}>
      <div className="flex items-center gap-2.5">
        <img
          src="/src/imports/AISTec_logo_dark_background-1.png"
          alt="AISTech Logo"
          className="h-6"
        />
        <span className="text-[13px]" style={{ color: 'var(--text-muted)' }}>
          GLOF Risk Platform
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
