/**
 * Lake Data Service
 *
 * This file shows how to connect your dashboard to a backend.
 * Replace the mock data functions with real API calls to your backend.
 */

// Option 1: Using your own REST API
export async function fetchLakeData(lakeName: string) {
  // Replace with your actual API endpoint
  const response = await fetch(`https://your-api.com/api/lakes/${lakeName}`);
  return response.json();
}

// Option 2: Using Supabase (if you connected it)
// Uncomment this after connecting Supabase:
/*
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function fetchLakeDataFromSupabase(lakeName: string) {
  const { data, error } = await supabase
    .from('lakes')
    .select('*')
    .eq('name', lakeName)
    .single()

  if (error) throw error
  return data
}

export async function fetchInfrastructure(lakeName: string) {
  const { data, error } = await supabase
    .from('infrastructure')
    .select('*')
    .eq('lake_name', lakeName)

  if (error) throw error
  return data
}
*/

// Example data structure your backend should return
export interface LakeData {
  name: string;
  riskScore: number;
  lakeArea: number; // in km²
  glofProbability: number; // percentage
  downstreamPopulation: number;
  coordinates: {
    lat: number;
    lon: number;
    elevation: number;
  };
  timeSeriesData: Array<{
    year: number;
    area: number;
    isProjected?: boolean;
  }>;
}

// Mock data (replace this with real API calls)
export function getMockLakeData(): LakeData {
  return {
    name: 'South Lhonak Lake',
    riskScore: 74,
    lakeArea: 2.41,
    glofProbability: 12,
    downstreamPopulation: 3400,
    coordinates: {
      lat: 27.915,
      lon: 88.196,
      elevation: 5200
    },
    timeSeriesData: [
      { year: 2023, area: 2.23 },
      { year: 2024, area: 2.41 },
      { year: 2025, area: 2.58, isProjected: true }
    ]
  };
}

// Example: How to use in your components
// import { fetchLakeData } from '@/services/lakeDataService'
//
// useEffect(() => {
//   fetchLakeData('gepatschferner')
//     .then(data => setLakeData(data))
//     .catch(error => console.error('Failed to fetch lake data:', error))
// }, [])
