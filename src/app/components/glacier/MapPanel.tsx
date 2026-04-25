import { useState, useEffect, useRef } from 'react';

const timeViews = [
  { label: '1 Year Before', year: 2023, lakeSize: 88 },
  { label: 'Current', year: 2024, lakeSize: 100 },
  { label: '1 Year After (Projected)', year: 2025, lakeSize: 110, isProjected: true },
];

export function MapPanel() {
  const [selectedView, setSelectedView] = useState(1); // Start with Current
  const [mapLoaded, setMapLoaded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const currentView = timeViews[selectedView];

  // Generate OpenStreetMap embed URL
  const lat = 46.9553;
  const lon = 10.7572;
  const zoom = 14;

  useEffect(() => {
    setMapLoaded(false);
    const timer = setTimeout(() => setMapLoaded(true), 100);
    return () => clearTimeout(timer);
  }, [selectedView]);

  return (
    <div className="rounded-2xl border overflow-hidden"
      style={{
        background: 'var(--surface)',
        borderColor: 'var(--glacier-border)'
      }}>
      <div className="flex items-center justify-between px-[18px] pt-3.5">
        <div className="text-[11px] uppercase tracking-wider"
          style={{ color: 'var(--text-dim)' }}>
          Satellite lake polygon — {currentView.label}
        </div>
        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] border"
          style={{
            background: currentView.isProjected ? 'var(--amber-dim)' : 'var(--teal-dim)',
            color: currentView.isProjected ? 'var(--glacier-amber)' : 'var(--glacier-teal)',
            borderColor: currentView.isProjected ? 'rgba(245,166,35,0.2)' : 'rgba(45,212,160,0.25)'
          }}>
          {currentView.isProjected ? 'Projected' : `Sentinel-2 ${currentView.year}`}
        </div>
      </div>

      <div className="relative h-[480px] mt-3.5 overflow-hidden rounded-lg" style={{ background: '#e8f4f8' }}>
        {/* OpenStreetMap iframe embed */}
        <iframe
          ref={iframeRef}
          key={selectedView}
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${lon-0.015},${lat-0.01},${lon+0.015},${lat+0.01}&layer=mapnik&marker=${lat},${lon}`}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            opacity: mapLoaded ? 1 : 0,
            transition: 'opacity 0.3s'
          }}
          title="OpenStreetMap"
        />

        {/* SVG overlay for lake polygon */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
          viewBox="0 0 600 480"
          preserveAspectRatio="xMidYMid slice"
          style={{ mixBlendMode: 'normal' }}>
          <defs>
            <radialGradient id="glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={currentView.isProjected ? "#d97706" : "#2563eb"} stopOpacity="0.2"/>
              <stop offset="100%" stopColor={currentView.isProjected ? "#d97706" : "#2563eb"} stopOpacity="0"/>
            </radialGradient>
          </defs>

          {/* Historical extent (dashed outline) */}
          <ellipse
            cx="295"
            cy="240"
            rx="45"
            ry="28"
            fill="none"
            stroke="#059669"
            strokeWidth="2"
            strokeDasharray="8,4"
            opacity="0.8"
          />

          {/* Current lake boundary */}
          <ellipse
            cx="295"
            cy="240"
            rx={58 * (currentView.lakeSize / 100)}
            ry={35 * (currentView.lakeSize / 100)}
            fill={currentView.isProjected ? "#d97706" : "#2563eb"}
            opacity="0.35"
            className="transition-all duration-700"
          />
          <ellipse
            cx="295"
            cy="240"
            rx={58 * (currentView.lakeSize / 100)}
            ry={35 * (currentView.lakeSize / 100)}
            fill="url(#glow)"
            className="transition-all duration-700"
          />
          <ellipse
            cx="295"
            cy="240"
            rx={58 * (currentView.lakeSize / 100)}
            ry={35 * (currentView.lakeSize / 100)}
            fill="none"
            stroke={currentView.isProjected ? "#d97706" : "#2563eb"}
            strokeWidth="2.5"
            opacity="0.9"
            className="transition-all duration-700"
          />

          {/* Lake center marker */}
          <circle cx="295" cy="240" r="5" fill="white" opacity="0.9"/>
          <circle cx="295" cy="240" r="3" fill={currentView.isProjected ? "#d97706" : "#2563eb"}/>
        </svg>

        {/* Overlay labels */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 text-[10px] font-mono px-2 py-1.5 rounded border backdrop-blur-sm z-[1000] pointer-events-none"
          style={{
            background: 'rgba(255,255,255,0.95)',
            borderColor: 'var(--glacier-border)',
            color: 'var(--text-muted)'
          }}>
          Gepatschferner — {currentView.year}
        </div>

        <div className="absolute top-3 right-3 text-[10px] font-mono px-2.5 py-1.5 rounded border backdrop-blur-sm z-[1000] pointer-events-none"
          style={{
            background: 'rgba(255,255,255,0.95)',
            borderColor: 'var(--glacier-border)',
            color: 'var(--text-dim)'
          }}>
          46.96°N 10.76°E · 2847m
        </div>

        <div className="absolute bottom-3 left-3 px-3 py-2 rounded-lg border backdrop-blur-lg z-[1000] pointer-events-none"
          style={{
            background: 'rgba(255,255,255,0.98)',
            borderColor: 'var(--glacier-border)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 text-[10px]" style={{ color: 'var(--text-muted)' }}>
              <div className="w-2 h-2 rounded-full" style={{ background: currentView.isProjected ? '#d97706' : '#2563eb' }}></div>
              Current boundary
            </div>
            <div className="flex items-center gap-1.5 text-[10px]" style={{ color: 'var(--text-muted)' }}>
              <div className="w-3 h-0.5" style={{ background: '#059669' }}></div>
              Historical extent
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 px-[18px] py-3 border-t"
        style={{
          borderColor: 'var(--glacier-border)',
          background: 'rgba(0,0,0,0.02)'
        }}>
        <div className="text-[10px] font-mono whitespace-nowrap" style={{ color: 'var(--text-dim)' }}>
          Time view →
        </div>
        <div className="flex gap-2 flex-1">
          {timeViews.map((view, index) => (
            <button
              key={index}
              onClick={() => setSelectedView(index)}
              className={`flex-1 text-[11px] font-mono px-3 py-2 rounded-lg cursor-pointer transition-all ${
                selectedView === index ? 'shadow-lg' : ''
              }`}
              style={{
                color: selectedView === index ? 'var(--text)' : 'var(--text-dim)',
                background: selectedView === index ? 'var(--blue-dim)' : 'transparent',
                border: selectedView === index ? '0.5px solid var(--glacier-blue)' : '0.5px solid transparent'
              }}>
              {view.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
