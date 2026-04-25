# Backend Integration Guide

This dashboard currently uses mock data. Here's how to connect it to a real backend.

## Option 1: Connect to Supabase (Easiest)

Supabase provides a hosted database with a simple API. Perfect for prototyping.

### Steps:
1. Click the Supabase connection card I showed earlier
2. Create a Supabase project at https://supabase.com
3. Create these tables in Supabase:

```sql
-- Lakes table
CREATE TABLE lakes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  risk_score INTEGER,
  lake_area DECIMAL,
  glof_probability INTEGER,
  downstream_population INTEGER,
  lat DECIMAL,
  lon DECIMAL,
  elevation INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Time series data
CREATE TABLE lake_time_series (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lake_id UUID REFERENCES lakes(id),
  year INTEGER,
  area DECIMAL,
  is_projected BOOLEAN DEFAULT false
);

-- Infrastructure at risk
CREATE TABLE infrastructure (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lake_id UUID REFERENCES lakes(id),
  name TEXT,
  type TEXT, -- 'village', 'road', 'hydropower', etc.
  distance_km DECIMAL,
  risk_level TEXT, -- 'high', 'medium', 'low'
  details TEXT
);
```

4. Uncomment the Supabase code in `src/app/services/lakeDataService.ts`
5. Update your components to fetch from Supabase instead of using mock data

## Option 2: Build Your Own Backend

### Simple Node.js/Express Example:

```javascript
// backend/server.js
const express = require('express');
const app = express();

app.get('/api/lakes/:name', async (req, res) => {
  // Fetch from your database
  const lake = await db.lakes.findOne({ name: req.params.name });
  res.json(lake);
});

app.listen(3001, () => console.log('API running on port 3001'));
```

### Python/Flask Example:

```python
# backend/app.py
from flask import Flask, jsonify
app = Flask(__name__)

@app.route('/api/lakes/<name>')
def get_lake(name):
    # Fetch from your database
    lake = db.query('SELECT * FROM lakes WHERE name = ?', [name])
    return jsonify(lake)

if __name__ == '__main__':
    app.run(port=3001)
```

## Option 3: Use Mock API for Development

While building your backend, you can use a mock API:

1. Install json-server: `npm install -g json-server`
2. Create `db.json`:

```json
{
  "lakes": [{
    "name": "Gepatschferner lake drainage",
    "riskScore": 74,
    "lakeArea": 2.41,
    "glofProbability": 12
  }]
}
```

3. Run: `json-server --watch db.json --port 3001`
4. Your API is now at `http://localhost:3001/lakes`

## Updating Components to Use Backend

Example of updating the KPI cards:

```typescript
// In App.tsx
import { useEffect, useState } from 'react';
import { fetchLakeData } from './services/lakeDataService';

export default function App() {
  const [lakeData, setLakeData] = useState(null);

  useEffect(() => {
    fetchLakeData('gepatschferner')
      .then(data => setLakeData(data))
      .catch(err => console.error(err));
  }, []);

  if (!lakeData) return <div>Loading...</div>;

  return (
    // Use lakeData.riskScore, lakeData.lakeArea, etc.
    <KPICard value={lakeData.riskScore} ... />
  );
}
```

## Database Schema Recommendation

Your backend should store:
- **Lakes**: Basic info (name, coordinates, risk score)
- **Time Series**: Historical area measurements by year
- **Infrastructure**: Downstream facilities at risk
- **Satellite Data**: Raw satellite imagery metadata
- **Risk Factors**: Contributing factors to risk calculation

## Next Steps

Which backend option would you like to implement? I can help you:
1. Set up Supabase tables and queries
2. Create a simple Express/Flask API
3. Convert components to use real data instead of mocks
