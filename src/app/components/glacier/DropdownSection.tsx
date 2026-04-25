import { useState } from 'react';

interface DropdownSectionProps {
  title: string;
  children: React.ReactNode;
}

export function DropdownSection({ title, children }: DropdownSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-2xl border overflow-hidden"
      style={{
        background: 'var(--surface)',
        borderColor: 'var(--glacier-border)'
      }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-[18px] py-4 text-left transition-colors"
        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
        <div className="text-[13px]" style={{ color: 'var(--text)' }}>
          {title}
        </div>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className="transition-transform"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            color: 'var(--text-muted)'
          }}>
          <path
            d="M4 6l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="px-[18px] pb-4 border-t"
          style={{ borderColor: 'var(--glacier-border)' }}>
          {children}
        </div>
      )}
    </div>
  );
}
