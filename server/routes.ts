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
      
      // Mock geocoding for demonstration
      // In production, integrate with a real geocoding service
      const coordinates = await mockGeocode(address);
      
      if (!coordinates) {
        return res.json({ 
          precinct: null, 
          address, 
          coordinates: null,
          error: "Address not found" 
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

      // Mock suggestions - in production, integrate with address API
      const suggestions = getMockSuggestions(query);
      res.json(suggestions);
    } catch (error) {
      res.status(500).json({ error: "Failed to get suggestions" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Mock geocoding function
async function mockGeocode(address: string): Promise<{lat: number, lng: number} | null> {
  const geocodeMap: Record<string, {lat: number, lng: number}> = {
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

  const key = address.toLowerCase().trim();
  return geocodeMap[key] || null;
}

// Mock address suggestions
function getMockSuggestions(query: string): string[] {
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
