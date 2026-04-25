import { useState, useMemo, useEffect, createElement } from 'react';
import Map, { Source, Layer } from 'react-map-gl/maplibre';
import type { LayerProps } from 'react-map-gl/maplibre';
import type { FeatureCollection, Polygon } from 'geojson';
import 'maplibre-gl/dist/maplibre-gl.css';
import { ImageComparisonSlider } from './ImageComparisonSlider';

// Import satellite images for all years (October)
const timeViews = [
  { 
    label: 'October 2019', 
    year: 2019, 
    date: '2019-10-15',
    lakeSize: 85,
    trueColorImage: '/src/imports/2019-10-15-00_00_2019-10-15-23_59_Sentinel-2_L2A_True_color.jpg',
    falseColorImage: '/src/imports/2019-10-15-00_00_2019-10-15-23_59_Sentinel-2_L2A_False_color.jpg'
  },
  { 
    label: 'October 2021', 
    year: 2021, 
    date: '2021-10-14',
    lakeSize: 92,
    trueColorImage: '/src/imports/2021-10-14-00_00_2021-10-14-23_59_Sentinel-2_L2A_True_color.jpg',
    falseColorImage: '/src/imports/2021-10-14-00_00_2021-10-14-23_59_Sentinel-2_L2A_False_color.jpg'
  },
  { 
    label: 'October 2023', 
    year: 2023, 
    date: '2023-10-09',
    lakeSize: 100,
    trueColorImage: '/src/imports/2023-10-09-00_00_2023-10-09-23_59_Sentinel-2_L2A_True_color.jpg',
    falseColorImage: '/src/imports/2023-10-09-00_00_2023-10-09-23_59_Sentinel-2_L2A_False_color.jpg'
  },
  { 
    label: 'October 2025', 
    year: 2025, 
    date: '2025-10-15',
    lakeSize: 110,
    trueColorImage: '/src/imports/2025-10-15-00_00_2025-10-15-23_59_Sentinel-2_L2A_True_color.jpg',
    falseColorImage: '/src/imports/2025-10-15-00_00_2025-10-15-23_59_Sentinel-2_L2A_False_color.jpg'
  },
];

// Gepatschferner lake coordinates (approximate)
const baseLakeCoordinates = [
  [
    [10.7555, 46.9555],
    [10.7580, 46.9565],
    [10.7590, 46.9550],
    [10.7565, 46.9540],
    [10.7555, 46.9555]
  ]
];

const historicalExtent = [
  [
    [10.7560, 46.9557],
    [10.7575, 46.9563],
    [10.7580, 46.9552],
    [10.7568, 46.9545],
    [10.7560, 46.9557]
  ]
];

// Calculate centroid
function calculateCentroid(coordinates: number[][][]): [number, number] {
  const ring = coordinates[0];
  let lng = 0;
  let lat = 0;

  ring.forEach(([x, y]) => {
    lng += x;
    lat += y;
  });

  return [lng / ring.length, lat / ring.length];
}

// Scale polygon from center
function scalePolygonFromCenter(coordinates: number[][][], scale: number): number[][][] {
  const [centerLng, centerLat] = calculateCentroid(coordinates);

  return coordinates.map(ring =>
    ring.map(([lng, lat]) => {
      const deltaLng = lng - centerLng;
      const deltaLat = lat - centerLat;

      return [
        centerLng + deltaLng * scale,
        centerLat + deltaLat * scale
      ];
    })
  );
}

export function MapPanel() {
  const [viewMode, setViewMode] = useState<'map' | 'satellite'>('map');
  const [selectedView, setSelectedView] = useState(2); // Start with Current
  const [currentScale, setCurrentScale] = useState(1.0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const currentView = timeViews[selectedView];

  // Preload all satellite images
  useEffect(() => {
    const imagesToPreload = timeViews.flatMap(view => [
      view.trueColorImage,
      view.falseColorImage
    ]);

    let loadedCount = 0;
    const totalImages = imagesToPreload.length;

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

  // Smooth animation for scale changes
  useEffect(() => {
    const targetScale = currentView.lakeSize / 100;
    const animationDuration = 700;
    const startTime = Date.now();
    const startScale = currentScale;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const newScale = startScale + (targetScale - startScale) * easeProgress;

      setCurrentScale(newScale);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [currentView.lakeSize]);

  // Scale coordinates
  const scaledCoordinates = useMemo(
    () => scalePolygonFromCenter(baseLakeCoordinates, currentScale),
    [currentScale]
  );

  // GeoJSON for current lake boundary
  const lakeGeoJSON: FeatureCollection<Polygon> = useMemo(() => ({
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: { name: 'Lake Boundary' },
        geometry: {
          type: 'Polygon',
          coordinates: scaledCoordinates
        }
      }
    ]
  }), [scaledCoordinates]);

  // GeoJSON for historical extent
  const historicalGeoJSON: FeatureCollection<Polygon> = useMemo(() => ({
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: { name: 'Historical Extent' },
        geometry: {
          type: 'Polygon',
          coordinates: historicalExtent
        }
      }
    ]
  }), []);

  // Layer styles
  const historicalLayer: LayerProps = {
    id: 'historical-line',
    type: 'line',
    paint: {
      'line-color': '#059669',
      'line-width': 2,
      'line-dasharray': [4, 2],
      'line-opacity': 0.8
    }
  };

  const lakeFillLayer: LayerProps = {
    id: 'lake-fill',
    type: 'fill',
    paint: {
      'fill-color': '#2563eb',
      'fill-opacity': 0.4
    }
  };

  const lakeStrokeLayer: LayerProps = {
    id: 'lake-stroke',
    type: 'line',
    paint: {
      'line-color': '#2563eb',
      'line-width': 2.5,
      'line-opacity': 0.9
    }
  };

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
      <div className="flex items-center justify-between px-[18px] pt-3.5">
        <div className="flex items-center gap-3">
          <div className="text-[11px] uppercase tracking-wider"
            style={{ color: 'var(--text-dim)' }}>
            {viewMode === 'map' ? 'Lake polygon map' : 'Satellite imagery comparison'}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('map')}
            className="px-3 py-1 rounded-lg text-[10px] font-mono transition-all"
            style={{
              background: viewMode === 'map' ? 'var(--blue-dim)' : 'transparent',
              color: viewMode === 'map' ? 'var(--glacier-blue)' : 'var(--text-dim)',
              border: `0.5px solid ${viewMode === 'map' ? 'var(--glacier-blue)' : 'var(--glacier-border)'}`
            }}>
            Map View
          </button>
          <button
            onClick={() => setViewMode('satellite')}
            className="px-3 py-1 rounded-lg text-[10px] font-mono transition-all"
            style={{
              background: viewMode === 'satellite' ? 'var(--blue-dim)' : 'transparent',
              color: viewMode === 'satellite' ? 'var(--glacier-blue)' : 'var(--text-dim)',
              border: `0.5px solid ${viewMode === 'satellite' ? 'var(--glacier-blue)' : 'var(--glacier-border)'}`
            }}>
            Satellite Compare
          </button>
          <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] border"
            style={{
              background: 'var(--teal-dim)',
              color: 'var(--glacier-teal)',
              borderColor: 'rgba(5,150,105,0.25)'
            }}>
            Sentinel-2 {currentView.year}
          </div>
        </div>
      </div>

      <div className="relative h-[480px] mt-3.5">
        {viewMode === 'map' ? (
        <>
          <Map
            initialViewState={{
              longitude: 10.7572,
              latitude: 46.9553,
              zoom: 14
            }}
            style={{ width: '100%', height: '100%' }}
            mapStyle={mapStyle}
            maxZoom={20}
            minZoom={10}
            attributionControl={false}
            reuseMaps
          >
            {createElement(
              Source,
              { id: 'historical-extent', type: 'geojson', data: historicalGeoJSON },
              createElement(Layer, historicalLayer)
            )}

            {createElement(
              Source,
              { id: 'lake-boundary', type: 'geojson', data: lakeGeoJSON },
              createElement(Layer, lakeFillLayer),
              createElement(Layer, lakeStrokeLayer)
            )}
          </Map>

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
                <div className="w-2 h-2 rounded-full" style={{ background: '#2563eb' }}></div>
                Current boundary
              </div>
              <div className="flex items-center gap-1.5 text-[10px]" style={{ color: 'var(--text-muted)' }}>
                <div className="w-3 h-0.5" style={{ background: '#059669' }}></div>
                Historical extent
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
            <ImageComparisonSlider
              key={`${selectedView}-${currentView.year}`}
              beforeImage={currentView.trueColorImage}
              afterImage={currentView.falseColorImage}
              beforeLabel={`${currentView.year} - True Color`}
              afterLabel={`${currentView.year} - False Color`}
            />
          </>
        )}
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