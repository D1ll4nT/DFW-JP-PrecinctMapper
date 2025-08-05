// Mock geocoding service - in production, integrate with real geocoding API
const geocodeCache: Record<string, {lat: number, lng: number}> = {
  "dallas city hall": { lat: 32.7767, lng: -96.7970 },
  "fort worth city hall": { lat: 32.7555, lng: -97.3308 },
  "plano city hall": { lat: 33.0198, lng: -96.6989 },
  "dallas": { lat: 32.7767, lng: -96.7970 },
  "fort worth": { lat: 32.7555, lng: -97.3308 },
  "plano": { lat: 33.0198, lng: -96.6989 },
  "frisco": { lat: 33.1507, lng: -96.8236 },
  "richardson": { lat: 32.9483, lng: -96.7299 },
  "arlington": { lat: 32.7357, lng: -97.1081 },
  "irving": { lat: 32.8140, lng: -96.9489 },
  "garland": { lat: 32.9126, lng: -96.6389 },
  "grand prairie": { lat: 32.7460, lng: -96.9978 }
};

export async function geocodeAddress(address: string): Promise<{lat: number, lng: number} | null> {
  const key = address.toLowerCase().trim();
  return geocodeCache[key] || null;
}

export function getAddressSuggestions(query: string): string[] {
  const allSuggestions = [
    "Dallas City Hall, 1500 Marilla St, Dallas, TX",
    "Fort Worth City Hall, 200 Texas St, Fort Worth, TX", 
    "Plano City Hall, 1520 K Ave, Plano, TX",
    "Frisco City Hall, 6101 Frisco Square Blvd, Frisco, TX",
    "Richardson City Hall, 411 W Arapaho Rd, Richardson, TX",
    "Arlington City Hall, 101 W Abram St, Arlington, TX",
    "Irving City Hall, 825 W Irving Blvd, Irving, TX",
    "Garland City Hall, 200 N 5th St, Garland, TX",
    "Grand Prairie City Hall, 300 W Main St, Grand Prairie, TX"
  ];

  return allSuggestions
    .filter(s => s.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 5);
}
