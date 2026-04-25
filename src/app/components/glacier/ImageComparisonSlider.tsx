import { useState, useRef, useEffect, useCallback, memo } from 'react';

interface ImageComparisonSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  defaultPosition?: number; // 0-100, default 50
}

function ImageComparisonSliderComponent({
  beforeImage,
  afterImage,
  beforeLabel = 'Before',
  afterLabel = 'After',
  defaultPosition = 50
}: ImageComparisonSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(defaultPosition);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = (x / rect.width) * 100;

    // Clamp between 0 and 100
    const clampedPercentage = Math.min(Math.max(percentage, 0), 100);
    setSliderPosition(clampedPercentage);
  }, []);

  const handleMouseDown = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    handleMove(e.clientX);
  }, [isDragging, handleMove]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    handleMove(e.touches[0].clientX);
  }, [isDragging, handleMove]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove, { passive: false });
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleMouseUp);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden cursor-col-resize select-none"
      style={{ touchAction: 'none' }}
      onMouseDown={(e) => {
        handleMove(e.clientX);
        handleMouseDown();
      }}
      onTouchStart={(e) => {
        handleMove(e.touches[0].clientX);
        handleMouseDown();
      }}
    >
      {/* After image (right side) - full width */}
      <div className="absolute inset-0">
        <img
          src={afterImage}
          alt={afterLabel}
          className="w-full h-full object-cover"
          draggable={false}
        />
        {/* After label */}
        <div
          className="absolute top-4 right-4 px-3 py-1.5 rounded-lg text-xs font-mono border backdrop-blur-sm pointer-events-none z-10"
          style={{
            background: 'rgba(255,255,255,0.95)',
            borderColor: 'var(--glacier-border)',
            color: 'var(--text-muted)'
          }}
        >
          {afterLabel}
        </div>
      </div>

      {/* Before image (left side) - clipped by slider position */}
      <div
        className="absolute inset-0 transition-none"
        style={{
          clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`
        }}
      >
        <img
          src={beforeImage}
          alt={beforeLabel}
          className="w-full h-full object-cover"
          draggable={false}
        />
        {/* Before label */}
        <div
          className="absolute top-4 left-4 px-3 py-1.5 rounded-lg text-xs font-mono border backdrop-blur-sm pointer-events-none z-10"
          style={{
            background: 'rgba(255,255,255,0.95)',
            borderColor: 'var(--glacier-border)',
            color: 'var(--text-muted)',
            opacity: sliderPosition > 15 ? 1 : 0,
            transition: 'opacity 0.2s'
          }}
        >
          {beforeLabel}
        </div>
      </div>

      {/* Slider handle */}
      <div
        className="absolute top-0 bottom-0 w-1 cursor-col-resize z-20"
        style={{
          left: `${sliderPosition}%`,
          background: 'white',
          boxShadow: '0 0 10px rgba(0,0,0,0.3)',
          transform: 'translateX(-50%)'
        }}
      >
        {/* Handle circle */}
        <div
          className="absolute top-1/2 left-1/2 w-10 h-10 rounded-full flex items-center justify-center"
          style={{
            background: 'white',
            border: '2px solid var(--glacier-blue)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            transform: 'translate(-50%, -50%)',
            cursor: 'col-resize'
          }}
        >
          {/* Left arrow */}
          <svg width="8" height="12" viewBox="0 0 8 12" fill="none" className="mr-0.5">
            <path d="M6 10L2 6L6 2" stroke="var(--glacier-blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {/* Right arrow */}
          <svg width="8" height="12" viewBox="0 0 8 12" fill="none" className="ml-0.5">
            <path d="M2 2L6 6L2 10" stroke="var(--glacier-blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* Top indicator */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 flex items-center justify-center rounded-full"
          style={{
            background: 'white',
            border: '1px solid var(--glacier-border)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="text-[10px] font-mono" style={{ color: 'var(--glacier-blue)' }}>
            ↕
          </div>
        </div>

        {/* Bottom indicator */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-8 flex items-center justify-center rounded-full"
          style={{
            background: 'white',
            border: '1px solid var(--glacier-border)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            transform: 'translate(-50%, 50%)'
          }}
        >
          <div className="text-[10px] font-mono" style={{ color: 'var(--glacier-blue)' }}>
            ↕
          </div>
        </div>
      </div>

      {/* Instructions overlay (fades out after first interaction) */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-5 transition-opacity duration-500"
        style={{
          background: 'rgba(0,0,0,0.3)',
          opacity: isDragging || sliderPosition !== defaultPosition ? 0 : 1
        }}
      >
        <div
          className="px-4 py-2 rounded-lg text-sm"
          style={{
            background: 'rgba(255,255,255,0.95)',
            color: 'var(--text)',
            border: '1px solid var(--glacier-border)'
          }}
        >
          ← Drag to compare →
        </div>
      </div>
    </div>
  );
}

export const ImageComparisonSlider = memo(ImageComparisonSliderComponent);