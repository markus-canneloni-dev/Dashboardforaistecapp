import { useState, useEffect, useMemo } from 'react';
import Map, { Marker } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { RiskScoreBreakdown } from './RiskScoreBreakdown';
import { DropdownSection } from './DropdownSection';
import { InfrastructureDropdown } from './InfrastructureDropdown';

// Monthly data for 2023 (July through October)
const monthlyData = [
  {
    label: 'July',
    month: 'July',
    index: 0,
    view1Image: '/src/imports/1_sentinel2_July_rgb.png',
    view2Image: '/src/imports/1_RGBMask_July.png',
    view3Image: '/src/imports/1_DEMLake_July.png',
    view4Image: '/src/imports/1_SAR_July.png'
  },
  {
    label: 'August',
    month: 'August',
    index: 1,
    view1Image: '/src/imports/2_sentinel2_August_rgb.png',
    view2Image: '/src/imports/2_RGBMask_August.png',
    view3Image: '/src/imports/2_DEMLake_August.png',
    view4Image: '/src/imports/2_SAR_August.png'
  },
  {
    label: 'September',
    month: 'September',
    index: 2,
    view1Image: '/src/imports/3_sentinel2_September_rgb.png',
    view2Image: '/src/imports/3_RGBMask_September.png',
    view3Image: '/src/imports/3_DEMLake_September.png',
    view4Image: '/src/imports/3_SAR_September.png'
  },
  {
    label: 'October',
    month: 'October',
    index: 3,
    view1Image: '/src/imports/4_sentinel2_October_rgb.png',
    view2Image: '/src/imports/4_RGBMask_October.png',
    view3Image: '/src/imports/4_DEMLake_October.png',
    view4Image: '/src/imports/4_SAR_Oktober.png'
  },
];

// South Lhonak Lake location (India)
// Bounding box: Upper Left (27.9241212851121, 88.17761983942778), Lower Right (27.905815, 88.214225)

// Key locations for GLOF risk assessment
const locations = {
  glacialOrigin: [
    {
      name: 'South Lhonak Glacier',
      lat: 27.905,
      lng: 88.172,
      type: 'origin'
    },
    {
      name: 'South Lhonak Lake',
      lat: 27.913,
      lng: 88.199,
      type: 'hazard'
    }
  ],
  downstreamImpact: [
    {
      name: 'Chungthang Town',
      lat: 27.605,
      lng: 88.643,
      distance: '~65 km',
      description: 'Major settlement; site of the destroyed Teesta III dam',
      riskLevel: 'high'
    },
    {
      name: 'National Highway 10',
      lat: 27.45,
      lng: 88.60,
      distance: '~100+ km',
      description: 'Critical artery connecting Sikkim to the rest of India',
      riskLevel: 'high'
    },
    {
      name: 'Singtam/Rangpo',
      lat: 27.234,
      lng: 88.513,
      distance: '~130-135 km',
      description: 'Downstream hubs with significant residential density',
      riskLevel: 'medium'
    },
    {
      name: 'Teesta River Basin',
      lat: 27.10,
      lng: 88.48,
      distance: '~140+ km',
      description: 'Crucial agricultural and riparian land/ecosystems',
      riskLevel: 'low'
    }
  ]
};

// Flow path along Teesta River (simplified polyline)
const flowPath = [
  [88.199, 27.913], // South Lhonak Lake
  [88.25, 27.85],
  [88.35, 27.75],
  [88.45, 27.68],
  [88.55, 27.65],
  [88.643, 27.605], // Chungthang Town
  [88.60, 27.50],
  [88.60, 27.45],   // National Highway 10
  [88.57, 27.35],
  [88.513, 27.234], // Singtam/Rangpo
  [88.50, 27.17],
  [88.48, 27.10]    // Teesta River Basin
];

export function MapPanel() {
  const [viewMode, setViewMode] = useState<'risk' | 'map' | 'satellite' | 'outburst'>('risk');
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(0); // Start with July
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const currentMonth = monthlyData[selectedMonthIndex];

  // Preload all images
  useEffect(() => {
    const imagesToPreload = monthlyData.flatMap(month =>
      [month.view1Image, month.view2Image, month.view3Image, month.view4Image].filter(img => img)
    );

    let loadedCount = 0;
    const totalImages = imagesToPreload.length;

    if (totalImages === 0) {
      setImagesLoaded(true);
      return;
    }

    imagesToPreload.forEach(src => {
      const img = new Image();
      img.onload = () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          setImagesLoaded(true);
        }
      };
      img.onerror = () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          setImagesLoaded(true);
        }
      };
      img.src = src;
    });
  }, []);

  // Map style with OSM tiles
  const mapStyle = useMemo(() => ({
    version: 8 as const,
    sources: {
      'osm-tiles': {
        type: 'raster' as const,
        tiles: [
          'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
          'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
          'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
        ],
        tileSize: 256,
        attribution: '&copy; OpenStreetMap contributors'
      }
    },
    layers: [
      {
        id: 'osm-background',
        type: 'raster' as const,
        source: 'osm-tiles',
        minzoom: 0,
        maxzoom: 22
      }
    ]
  }), []);

  return (
    <div className="rounded-2xl border overflow-hidden"
      style={{
        background: 'var(--surface)',
        borderColor: 'var(--glacier-border)'
      }}>
      {/* Tab Navigation */}
      <div className="flex items-center gap-6 px-[18px] pt-3.5 border-b" style={{ borderColor: 'var(--glacier-border)' }}>
        <button
          onClick={() => setViewMode('risk')}
          className="px-4 py-2 text-[13px] transition-all border-b-2"
          style={{
            color: viewMode === 'risk' ? 'var(--glacier-red)' : 'var(--text-dim)',
            borderColor: viewMode === 'risk' ? 'var(--glacier-red)' : 'transparent',
            fontWeight: viewMode === 'risk' ? 500 : 400
          }}>
          Risk Analysis
        </button>
        <button
          onClick={() => setViewMode('map')}
          className="px-4 py-2 text-[13px] transition-all border-b-2"
          style={{
            color: viewMode === 'map' ? 'var(--glacier-blue)' : 'var(--text-dim)',
            borderColor: viewMode === 'map' ? 'var(--glacier-blue)' : 'transparent',
            fontWeight: viewMode === 'map' ? 500 : 400
          }}>
          Map View
        </button>
        <button
          onClick={() => setViewMode('satellite')}
          className="px-4 py-2 text-[13px] transition-all border-b-2"
          style={{
            color: viewMode === 'satellite' ? 'var(--glacier-blue)' : 'var(--text-dim)',
            borderColor: viewMode === 'satellite' ? 'var(--glacier-blue)' : 'transparent',
            fontWeight: viewMode === 'satellite' ? 500 : 400
          }}>
          Analysis Grid
        </button>
        <button
          onClick={() => setViewMode('outburst')}
          className="px-4 py-2 text-[13px] transition-all border-b-2"
          style={{
            color: viewMode === 'outburst' ? 'var(--glacier-blue)' : 'var(--text-dim)',
            borderColor: viewMode === 'outburst' ? 'var(--glacier-blue)' : 'transparent',
            fontWeight: viewMode === 'outburst' ? 500 : 400
          }}>
          Outburst Events
        </button>
        {viewMode === 'satellite' && (
          <div className="ml-auto inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] border"
            style={{
              background: 'var(--teal-dim)',
              color: 'var(--glacier-teal)',
              borderColor: 'rgba(5,150,105,0.25)'
            }}>
            {currentMonth.month} 2023
          </div>
        )}
      </div>

      {/* Tab Content */}
      {viewMode === 'risk' ? (
        <div className="p-[18px] flex flex-col gap-4">
          <RiskScoreBreakdown />
          <DropdownSection title="Downstream Infrastructure">
            <InfrastructureDropdown />
          </DropdownSection>
        </div>
      ) : viewMode === 'map' ? (
        <>
          <div className="relative h-[480px] mt-3.5">
          <Map
            initialViewState={{
              longitude: 88.35,
              latitude: 27.50,
              zoom: 8.5
            }}
            style={{ width: '100%', height: '100%' }}
            mapStyle={mapStyle}
            maxZoom={20}
            minZoom={7}
            attributionControl={false}
            reuseMaps
          >
            {/* Glacial origin markers */}
            {locations.glacialOrigin.map((loc, idx) => (
              <Marker
                key={`origin-${idx}`}
                longitude={loc.lng}
                latitude={loc.lat}
                anchor="center"
              >
                <div className="relative">
                  <div
                    className={`w-5 h-5 rounded-full border-2 ${loc.type === 'hazard' ? 'animate-pulse' : ''}`}
                    style={{
                      background: loc.type === 'hazard' ? '#dc2626' : '#0ea5e9',
                      borderColor: 'white',
                      boxShadow: '0 3px 10px rgba(0,0,0,0.4)'
                    }}
                  />
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] font-mono px-2 py-1 rounded backdrop-blur-sm"
                    style={{
                      background: 'rgba(255,255,255,0.95)',
                      color: 'var(--text)',
                      border: '0.5px solid var(--glacier-border)',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}>
                    {loc.name}
                  </div>
                </div>
              </Marker>
            ))}

            {/* Downstream impact markers */}
            {locations.downstreamImpact.map((loc, idx) => {
              const riskColors = {
                high: '#dc2626',
                medium: '#f59e0b',
                low: '#10b981'
              };
              const markerColor = riskColors[loc.riskLevel as keyof typeof riskColors];

              return (
                <Marker
                  key={`downstream-${idx}`}
                  longitude={loc.lng}
                  latitude={loc.lat}
                  anchor="center"
                >
                  <div className="relative group">
                    <div
                      className="w-4 h-4 rounded border-2"
                      style={{
                        background: markerColor,
                        borderColor: 'white',
                        boxShadow: '0 3px 8px rgba(0,0,0,0.4)'
                      }}
                    />
                    <div className="absolute top-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] font-mono px-2 py-1 rounded backdrop-blur-sm"
                      style={{
                        background: 'rgba(255,255,255,0.95)',
                        color: 'var(--text-muted)',
                        border: '0.5px solid var(--glacier-border)',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                      }}>
                      {loc.name}
                      <div className="text-[9px]" style={{ color: 'var(--text-dim)' }}>
                        {loc.distance}
                      </div>
                    </div>
                  </div>
                </Marker>
              );
            })}
          </Map>

          {/* Legend */}
          <div className="absolute bottom-3 left-3 px-4 py-3 rounded-lg border backdrop-blur-lg z-[1000] pointer-events-none"
            style={{
              background: 'rgba(255,255,255,0.98)',
              borderColor: 'var(--glacier-border)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2.5 text-[12px]" style={{ color: 'var(--text-muted)' }}>
                <div className="w-3.5 h-3.5 rounded-full" style={{ background: '#0ea5e9', border: '2px solid white' }}></div>
                Glacial origin
              </div>
              <div className="flex items-center gap-2.5 text-[12px]" style={{ color: 'var(--text-muted)' }}>
                <div className="w-3.5 h-3.5 rounded-full animate-pulse" style={{ background: '#dc2626', border: '2px solid white' }}></div>
                Lake (hazard zone)
              </div>
              <div className="border-t pt-2 mt-1" style={{ borderColor: 'var(--glacier-border)' }}>
                <div className="text-[11px] mb-2" style={{ color: 'var(--text-dim)' }}>Downstream Risk</div>
              </div>
              <div className="flex items-center gap-2.5 text-[12px]" style={{ color: 'var(--text-muted)' }}>
                <div className="w-3.5 h-3.5 rounded" style={{ background: '#dc2626', border: '2px solid white' }}></div>
                High
              </div>
              <div className="flex items-center gap-2.5 text-[12px]" style={{ color: 'var(--text-muted)' }}>
                <div className="w-3.5 h-3.5 rounded" style={{ background: '#f59e0b', border: '2px solid white' }}></div>
                Medium
              </div>
              <div className="flex items-center gap-2.5 text-[12px]" style={{ color: 'var(--text-muted)' }}>
                <div className="w-3.5 h-3.5 rounded" style={{ background: '#10b981', border: '2px solid white' }}></div>
                Low
              </div>
            </div>
          </div>

          {/* Overlay labels */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 text-[12px] font-mono px-3 py-2 rounded border backdrop-blur-sm z-[1000] pointer-events-none"
            style={{
              background: 'rgba(255,255,255,0.95)',
              borderColor: 'var(--glacier-border)',
              color: 'var(--text-muted)'
            }}>
            South Lhonak Lake GLOF Risk Assessment
          </div>

          </div>
          {/* Downstream Infrastructure for Map View */}
          <div className="p-[18px] pt-4">
            <DropdownSection title="Downstream Infrastructure">
              <InfrastructureDropdown />
            </DropdownSection>
          </div>
        </>
      ) : (
        <div className="relative h-[480px] mt-3.5">
          {viewMode === 'outburst' ? (
          <>
            {!imagesLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
                    style={{ borderColor: 'var(--glacier-blue)', borderTopColor: 'transparent' }}>
                  </div>
                  <div className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                    Loading timelapse imagery...
                  </div>
                </div>
              </div>
            )}
            {/* Side by side GIFs */}
            <div className="grid grid-cols-2 gap-1 h-full p-2">
              <div className="relative rounded-lg overflow-hidden border"
                style={{ borderColor: 'var(--glacier-border)' }}>
                <img
                  src="/src/imports/Dam_before_after_event_Timelapse_TrueColour_Sentinel-2_L2A.gif"
                  alt="True Colour Timelapse"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 text-[11px] font-mono px-2.5 py-1.5 rounded backdrop-blur-sm border"
                  style={{
                    background: 'rgba(255,255,255,0.9)',
                    borderColor: 'var(--glacier-border)',
                    color: 'var(--text-muted)'
                  }}>
                  True Colour Timelapse
                </div>
              </div>
              <div className="relative rounded-lg overflow-hidden border"
                style={{ borderColor: 'var(--glacier-border)' }}>
                <img
                  src="/src/imports/Dam_before_after_event_Timelapse_SWIR_Sentinel-2_L2A.gif"
                  alt="SWIR Timelapse"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 text-[11px] font-mono px-2.5 py-1.5 rounded backdrop-blur-sm border"
                  style={{
                    background: 'rgba(255,255,255,0.9)',
                    borderColor: 'var(--glacier-border)',
                    color: 'var(--text-muted)'
                  }}>
                  SWIR Timelapse
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {!imagesLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
                    style={{ borderColor: 'var(--glacier-blue)', borderTopColor: 'transparent' }}>
                  </div>
                  <div className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                    Loading satellite imagery...
                  </div>
                </div>
              </div>
            )}
            {/* 2x2 Grid of Maps */}
            <div className="grid grid-cols-2 grid-rows-2 gap-1 h-full p-2">
              {/* Top Left - HeatMap */}
              {currentMonth.view1Image ? (
                <div className="relative rounded-lg overflow-hidden border"
                  style={{ borderColor: 'var(--glacier-border)' }}>
                  <img
                    src={currentMonth.view1Image}
                    alt={`${currentMonth.month} HeatMap`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 text-[11px] font-mono px-2.5 py-1.5 rounded backdrop-blur-sm border"
                    style={{
                      background: 'rgba(255,255,255,0.9)',
                      borderColor: 'var(--glacier-border)',
                      color: 'var(--text-muted)'
                    }}>
                    HeatMap
                  </div>
                </div>
              ) : (
                <div className="relative rounded-lg overflow-hidden border flex items-center justify-center"
                  style={{
                    borderColor: 'var(--glacier-border)',
                    background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)'
                  }}>
                  <div className="text-center">
                    <div className="text-[12px] font-mono mb-1" style={{ color: 'var(--text-muted)' }}>
                      HeatMap
                    </div>
                    <div className="text-[10px]" style={{ color: 'var(--text-dim)' }}>
                      {currentMonth.month} 2023
                    </div>
                  </div>
                </div>
              )}

              {/* Top Right - View 2 (RGB Mask) */}
              {currentMonth.view2Image ? (
                <div className="relative rounded-lg overflow-hidden border"
                  style={{ borderColor: 'var(--glacier-border)' }}>
                  <img
                    src={currentMonth.view2Image}
                    alt={`${currentMonth.month} RGB Mask`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 text-[11px] font-mono px-2.5 py-1.5 rounded backdrop-blur-sm border"
                    style={{
                      background: 'rgba(255,255,255,0.9)',
                      borderColor: 'var(--glacier-border)',
                      color: 'var(--text-muted)'
                    }}>
                    RGB Mask
                  </div>
                </div>
              ) : (
                <div className="relative rounded-lg overflow-hidden border flex items-center justify-center"
                  style={{
                    borderColor: 'var(--glacier-border)',
                    background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)'
                  }}>
                  <div className="text-center">
                    <div className="text-[12px] font-mono mb-1" style={{ color: 'var(--text-muted)' }}>
                      View 2
                    </div>
                    <div className="text-[10px]" style={{ color: 'var(--text-dim)' }}>
                      {currentMonth.month} 2023
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Left - View 3 (DEM Lake) */}
              {currentMonth.view3Image ? (
                <div className="relative rounded-lg overflow-hidden border"
                  style={{ borderColor: 'var(--glacier-border)' }}>
                  <img
                    src={currentMonth.view3Image}
                    alt={`${currentMonth.month} DEM Lake`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 text-[11px] font-mono px-2.5 py-1.5 rounded backdrop-blur-sm border"
                    style={{
                      background: 'rgba(255,255,255,0.9)',
                      borderColor: 'var(--glacier-border)',
                      color: 'var(--text-muted)'
                    }}>
                    DEM Lake
                  </div>
                </div>
              ) : (
                <div className="relative rounded-lg overflow-hidden border flex items-center justify-center"
                  style={{
                    borderColor: 'var(--glacier-border)',
                    background: 'linear-gradient(135deg, #fef3c7 0%, #fef9e7 100%)'
                  }}>
                  <div className="text-center">
                    <div className="text-[12px] font-mono mb-1" style={{ color: 'var(--text-muted)' }}>
                      View 3
                    </div>
                    <div className="text-[10px]" style={{ color: 'var(--text-dim)' }}>
                      {currentMonth.month} 2023
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Right - View 4 (SAR) */}
              {currentMonth.view4Image ? (
                <div className="relative rounded-lg overflow-hidden border"
                  style={{ borderColor: 'var(--glacier-border)' }}>
                  <img
                    src={currentMonth.view4Image}
                    alt={`${currentMonth.month} SAR`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 text-[11px] font-mono px-2.5 py-1.5 rounded backdrop-blur-sm border"
                    style={{
                      background: 'rgba(255,255,255,0.9)',
                      borderColor: 'var(--glacier-border)',
                      color: 'var(--text-muted)'
                    }}>
                    SAR
                  </div>
                </div>
              ) : (
                <div className="relative rounded-lg overflow-hidden border flex items-center justify-center"
                  style={{
                    borderColor: 'var(--glacier-border)',
                    background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)'
                  }}>
                  <div className="text-center">
                    <div className="text-[12px] font-mono mb-1" style={{ color: 'var(--text-muted)' }}>
                      View 4
                    </div>
                    <div className="text-[10px]" style={{ color: 'var(--text-dim)' }}>
                      {currentMonth.month} 2023
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
        </div>
      )}

      {/* Monthly slider for satellite view */}

      {viewMode === 'satellite' && (
        <div className="flex items-center gap-3 px-[18px] py-3 border-t"
          style={{
            borderColor: 'var(--glacier-border)',
            background: 'rgba(0,0,0,0.02)'
          }}>
          <div className="text-[11px] font-mono whitespace-nowrap" style={{ color: 'var(--text-dim)' }}>
            {monthlyData[0].month}
          </div>
          <input
            type="range"
            min="0"
            max={monthlyData.length - 1}
            value={selectedMonthIndex}
            onChange={(e) => setSelectedMonthIndex(parseInt(e.target.value))}
            className="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, var(--glacier-blue) 0%, var(--glacier-blue) ${(selectedMonthIndex / (monthlyData.length - 1)) * 100}%, var(--glacier-border) ${(selectedMonthIndex / (monthlyData.length - 1)) * 100}%, var(--glacier-border) 100%)`
            }}
          />
          <div className="text-[11px] font-mono whitespace-nowrap" style={{ color: 'var(--text-dim)' }}>
            {monthlyData[monthlyData.length - 1].month}
          </div>
          <div className="px-3 py-1.5 rounded-lg text-[12px] font-mono"
            style={{
              background: 'var(--blue-dim)',
              color: 'var(--glacier-blue)',
              border: '0.5px solid var(--glacier-blue)'
            }}>
            {currentMonth.month}
          </div>
        </div>
      )}
    </div>
  );
}