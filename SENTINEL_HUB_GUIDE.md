# Sentinel Hub Satellite Imagery Guide

## Getting Real Satellite Images for the Comparison Slider

Currently using placeholder images. Here's how to get actual Sentinel-2 satellite imagery from Sentinel Hub:

### Option 1: Manual Download from EO Browser

1. **Go to EO Browser**: https://apps.sentinel-hub.com/eo-browser/
2. **Search for Gepatschferner**: 
   - Coordinates: 46.96°N, 10.76°E
   - Or search "Gepatschferner Glacier, Austria"
3. **Select dates**:
   - Before GLOF: e.g., July 2023
   - After GLOF: e.g., July 2024
4. **Choose Sentinel-2**:
   - Data source: Sentinel-2 L2A
   - Visualization: True Color or NDWI (water detection)
5. **Download images**:
   - Click "Download" → "High-res image"
   - Save both images (before and after)
6. **Add to project**:
   - Place in `public/images/sentinel/`
   - Update image paths in MapPanel.tsx

### Option 2: Sentinel Hub API (Programmatic)

```typescript
// Example: Fetch Sentinel-2 imagery via API
const SENTINEL_API_URL = 'https://services.sentinel-hub.com/api/v1/process';

async function getSentinelImage(date: string, bbox: number[]) {
  const response = await fetch(SENTINEL_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${YOUR_SENTINEL_HUB_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      input: {
        bounds: {
          bbox: bbox // [minLon, minLat, maxLon, maxLat]
        },
        data: [{
          type: 'sentinel-2-l2a',
          dataFilter: {
            timeRange: {
              from: `${date}T00:00:00Z`,
              to: `${date}T23:59:59Z`
            }
          }
        }]
      },
      output: {
        width: 1200,
        height: 800,
        responses: [{
          identifier: 'default',
          format: { type: 'image/png' }
        }]
      },
      evalscript: `
        //VERSION=3
        function setup() {
          return {
            input: ["B04", "B03", "B02"],
            output: { bands: 3 }
          };
        }
        function evaluatePixel(sample) {
          return [sample.B04, sample.B03, sample.B02];
        }
      `
    })
  });
  
  return response.blob();
}
```

### Option 3: Use Public Sentinel Data

Google Earth Engine or Copernicus Open Access Hub:
- https://scihub.copernicus.eu/
- Free access to all Sentinel data
- Download GeoTIFF files
- Convert to PNG/JPG for web use

### Recommended Workflow

1. **Download 2 images**:
   - `before-glof-2023.jpg` (earlier date)
   - `after-glof-2024.jpg` (later date)

2. **Place in public folder**:
   ```
   public/
   └── images/
       └── sentinel/
           ├── gepatschferner-2023.jpg
           └── gepatschferner-2024.jpg
   ```

3. **Update MapPanel.tsx**:
   ```typescript
   <ImageComparisonSlider
     beforeImage="/images/sentinel/gepatschferner-2023.jpg"
     afterImage="/images/sentinel/gepatschferner-2024.jpg"
     beforeLabel="July 2023 - Before GLOF"
     afterLabel="July 2024 - After GLOF"
   />
   ```

### Best Practices

- **Image Resolution**: 1200x800 or higher for quality
- **Same Zoom Level**: Ensure both images are at the same scale
- **Same Time of Year**: Compare summer to summer (less snow)
- **Cloud-free Days**: Select images with minimal cloud cover
- **File Format**: JPG for satellite imagery (smaller file size)
- **Optimize**: Compress images for web (80-90% quality)

### Example Sentinel-2 Bands for Water Detection

For highlighting lake changes:
- **NDWI (Water Index)**: `(B03 - B08) / (B03 + B08)`
- **True Color**: Bands B04, B03, B02
- **False Color**: Bands B08, B04, B03 (vegetation in red)

### Free Alternatives

If you don't have Sentinel Hub API access:
1. **Google Earth Engine** - Free for research
2. **Landsat** - Free USGS data
3. **Planet Labs** - Free for education
4. **NASA Earthdata** - Free satellite imagery

## Current Implementation

The slider is now integrated with toggle buttons:
- **Map View**: Interactive MapLibre map with polygon
- **Satellite Compare**: Before/after image comparison slider

Switch between views using the buttons at the top of the map panel.
