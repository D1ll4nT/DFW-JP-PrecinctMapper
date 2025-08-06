import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { addressSearchSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get all precincts
  app.get("/api/precincts", async (req, res) => {
    try {
      const precincts = await storage.getPrecincts();
      res.json(precincts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch precincts" });
    }
  });

  // Get precincts by county
  app.get("/api/precincts/county/:county", async (req, res) => {
    try {
      const county = req.params.county;
      const precincts = await storage.getPrecinctsByCounty(county);
      res.json(precincts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch precincts by county" });
    }
  });

  // Search for precinct by address
  app.post("/api/search/address", async (req, res) => {
    try {
      const result = addressSearchSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid address format" });
      }

      const { address } = result.data;
      
      // Use Google Maps Geocoding API for real address lookup
      const coordinates = await geocodeAddress(address);
      
      if (!coordinates) {
        return res.json({ 
          precinct: null, 
          address, 
          coordinates: null,
          error: "Unable to locate address. Please verify the Google Maps API key is valid and has Geocoding API enabled, or try a more specific address in North Texas." 
        });
      }

      const precinct = await storage.findPrecinctByPoint(
        coordinates.lat, 
        coordinates.lng
      );

      res.json({
        precinct,
        address,
        coordinates,
        error: precinct ? null : "No precinct found for this location"
      });
      
    } catch (error) {
      res.status(500).json({ error: "Search failed" });
    }
  });

  // Get address suggestions
  app.get("/api/search/suggestions", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query || query.length < 3) {
        return res.json([]);
      }

      // Use Google Places API for real address suggestions
      const suggestions = await getAddressSuggestions(query);
      res.json(suggestions);
    } catch (error) {
      res.status(500).json({ error: "Failed to get suggestions" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Google Maps Geocoding API integration with fallback
async function geocodeAddress(address: string): Promise<{lat: number, lng: number} | null> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  console.log(`Geocoding address: ${address}`);
  
  // Try Google Maps API first if available
  if (apiKey) {
    try {
      const result = await geocodeWithGoogleMaps(address, apiKey);
      if (result) return result;
    } catch (error) {
      console.error("Google Maps API error:", error);
    }
  }
  
  // Fallback to local geocoding for development/testing
  return geocodeWithFallback(address);
}

// Google Maps API geocoding
async function geocodeWithGoogleMaps(address: string, apiKey: string): Promise<{lat: number, lng: number} | null> {

  // Bias results to North Texas area
  const bounds = "32.5,-97.5|33.2,-96.0"; // Rough bounds for DFW metroplex
  const encodedAddress = encodeURIComponent(address);
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&bounds=${bounds}&region=us&key=${apiKey}`;
  
  const response = await fetch(url);
  const data = await response.json();
  
  if (data.status === "OK" && data.results.length > 0) {
    const location = data.results[0].geometry.location;
    
    // Verify the location is within our North Texas service area
    const lat = location.lat;
    const lng = location.lng;
    
    // Rough bounds check for North Texas counties
    if (lat >= 32.5 && lat <= 33.5 && lng >= -97.8 && lng <= -95.8) {
      console.log(`Successfully geocoded: ${address} -> ${lat}, ${lng}`);
      return { lat, lng };
    } else {
      console.log(`Address outside service area: ${lat}, ${lng}`);
      return null;
    }
  }
  
  console.log(`Google Maps geocoding failed for address: ${address}, status: ${data.status}`);
  if (data.error_message) {
    console.log(`Error message: ${data.error_message}`);
  }
  return null;
}

// Fallback geocoding for development and common addresses
function geocodeWithFallback(address: string): {lat: number, lng: number} | null {
  console.log("Using fallback geocoding for:", address);
  
  const normalizedAddress = address.toLowerCase().trim();
  
  // Extended list of known North Texas locations for development/testing
  const geocodeMap: Record<string, {lat: number, lng: number}> = {
    // City halls and landmarks
    "1500 marilla st, dallas, tx": { lat: 32.7767, lng: -96.7970 },
    "1500 marilla street, dallas, tx": { lat: 32.7767, lng: -96.7970 },
    "dallas city hall": { lat: 32.7767, lng: -96.7970 },
    "200 texas st, fort worth, tx": { lat: 32.7555, lng: -97.3308 },
    "200 texas street, fort worth, tx": { lat: 32.7555, lng: -97.3308 },
    "fort worth city hall": { lat: 32.7555, lng: -97.3308 },
    "1520 k ave, plano, tx": { lat: 33.0198, lng: -96.6989 },
    "plano city hall": { lat: 33.0198, lng: -96.6989 },
    
    // City centers
    "dallas, tx": { lat: 32.7767, lng: -96.7970 },
    "fort worth, tx": { lat: 32.7555, lng: -97.3308 },
    "plano, tx": { lat: 33.0198, lng: -96.6989 },
    "frisco, tx": { lat: 33.1507, lng: -96.8236 },
    "richardson, tx": { lat: 32.9483, lng: -96.7299 },
    "arlington, tx": { lat: 32.7357, lng: -97.1081 },
    "irving, tx": { lat: 32.8140, lng: -96.9489 },
    "garland, tx": { lat: 32.9126, lng: -96.6389 },
    "grand prairie, tx": { lat: 32.7460, lng: -96.9978 },
    "mckinney, tx": { lat: 33.1972, lng: -96.6397 },
    "carrollton, tx": { lat: 32.9537, lng: -96.8903 },
    "lewisville, tx": { lat: 33.0462, lng: -97.0195 },
    "denton, tx": { lat: 33.2148, lng: -97.1331 },
    
    // Just city names
    "dallas": { lat: 32.7767, lng: -96.7970 },
    "fort worth": { lat: 32.7555, lng: -97.3308 },
    "plano": { lat: 33.0198, lng: -96.6989 },
    "frisco": { lat: 33.1507, lng: -96.8236 },
    "richardson": { lat: 32.9483, lng: -96.7299 },
    "arlington": { lat: 32.7357, lng: -97.1081 },
    "irving": { lat: 32.8140, lng: -96.9489 },
    "garland": { lat: 32.9126, lng: -96.6389 },
    "mckinney": { lat: 33.1972, lng: -96.6397 },
    "carrollton": { lat: 32.9537, lng: -96.8903 },
    "lewisville": { lat: 33.0462, lng: -97.0195 },
    "denton": { lat: 33.2148, lng: -97.1331 }
  };

  // Try exact match first
  if (geocodeMap[normalizedAddress]) {
    console.log(`Fallback geocoded: ${address} -> ${geocodeMap[normalizedAddress].lat}, ${geocodeMap[normalizedAddress].lng}`);
    return geocodeMap[normalizedAddress];
  }
  
  // Try partial matches for addresses that might have slightly different formatting
  for (const [key, coords] of Object.entries(geocodeMap)) {
    if (normalizedAddress.includes(key) || key.includes(normalizedAddress)) {
      console.log(`Partial match geocoded: ${address} -> ${coords.lat}, ${coords.lng}`);
      return coords;
    }
  }
  
  console.log(`No geocoding match found for: ${address}`);
  return null;
}

// Google Places Autocomplete for address suggestions
async function getAddressSuggestions(query: string): Promise<string[]> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    // Return some example North Texas addresses to help users
    return getExampleSuggestions(query);
  }

  try {
    // Focus on North Texas area
    const location = "32.8,-96.9"; // Center of DFW
    const radius = 50000; // 50km radius
    const encodedQuery = encodeURIComponent(query);
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodedQuery}&location=${location}&radius=${radius}&types=address&components=country:us&key=${apiKey}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === "OK") {
      return data.predictions
        .filter((prediction: any) => {
          // Filter for Texas addresses only
          return prediction.description.includes("TX") || prediction.description.includes("Texas");
        })
        .slice(0, 5)
        .map((prediction: any) => prediction.description);
    }
    
    return getExampleSuggestions(query);
  } catch (error) {
    console.error("Address suggestions error:", error);
    return getExampleSuggestions(query);
  }
}

// Fallback suggestions for when Google Places API is not available
function getExampleSuggestions(query: string): string[] {
  const examples = [
    "1500 Marilla St, Dallas, TX 75201",
    "200 Texas St, Fort Worth, TX 76102", 
    "1520 K Ave, Plano, TX 75074",
    "6101 Frisco Square Blvd, Frisco, TX 75034",
    "411 W Arapaho Rd, Richardson, TX 75080",
    "101 W Abram St, Arlington, TX 76010",
    "825 W Irving Blvd, Irving, TX 75060",
    "200 N 5th St, Garland, TX 75040",
    "300 W Main St, Grand Prairie, TX 75050"
  ];

  return examples
    .filter(addr => addr.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 5);
}
