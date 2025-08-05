import { type Precinct } from "@shared/schema";

export interface IStorage {
  getPrecincts(): Promise<Precinct[]>;
  getPrecinctsByCounty(county: string): Promise<Precinct[]>;
  findPrecinctByPoint(lat: number, lng: number): Promise<Precinct | null>;
}

export class MemStorage implements IStorage {
  private precincts: Precinct[] = [];

  constructor() {
    this.loadPrecinctData();
  }

  private async loadPrecinctData() {
    try {
      // Load the actual GeoJSON file with complete precinct boundary data
      const fs = await import('fs');
      const path = await import('path');
      const geojsonPath = path.join(process.cwd(), 'public', 'jp_precincts_clean.geojson');
      const geoJsonData = JSON.parse(fs.readFileSync(geojsonPath, 'utf8'));
      
      this.precincts = geoJsonData.features.map((feature: any) => ({
        id: feature.properties.id,
        name: feature.properties.name,
        county: feature.properties.county,
        precinct_number: feature.properties.precinct_number,
        geometry: feature.geometry
      }));
      
      console.log(`Loaded ${this.precincts.length} JP precincts from GeoJSON data`);
    } catch (error) {
      console.error('Failed to load precinct data from GeoJSON:', error);
      // Fallback with some essential precincts for development
      this.precincts = [
        {
          id: "48085-1",
          name: "Collin County Precinct 1",
          county: "Collin County",
          precinct_number: "1",
          geometry: {
            type: "Polygon",
            coordinates: [[
              [-96.7680671721744, 33.114746866274174],
              [-96.76805017362885, 33.11561447290065],
              [-96.7680634994156, 33.11578263343128],
              [-96.76811791889686, 33.11595719734425],
              [-96.7680671721744, 33.114746866274174]
            ]]
          }
        },
        {
          id: "48113-1",
          name: "Dallas County Precinct 1",
          county: "Dallas County",
          precinct_number: "1",
          geometry: {
            type: "Polygon",
            coordinates: [[
              [-96.90729899950158, 32.59759399969208],
              [-96.90729899949912, 32.59759399967769],
              [-96.90729699946436, 32.59759999970701],
              [-96.90729499966012, 32.59760599973634],
              [-96.90729899950158, 32.59759399969208]
            ]]
          }
        },
        {
          id: "48121-1",
          name: "Denton County Precinct 1",
          county: "Denton County",
          precinct_number: "1",
          geometry: {
            type: "Polygon",
            coordinates: [[
              [-97.13589999778644, 33.16124499974983],
              [-97.13589999778644, 33.16124499974983],
              [-97.13589999778644, 33.16124499974983],
              [-97.13589999778644, 33.16124499974983],
              [-97.13589999778644, 33.16124499974983]
            ]]
          }
        },
        {
          id: "48439-1",
          name: "Tarrant County Precinct 1",
          county: "Tarrant County",
          precinct_number: "1",
          geometry: {
            type: "Polygon",
            coordinates: [[
              [-97.35062999758627, 32.81179999918863],
              [-97.35062999758627, 32.81179999918863],
              [-97.35062999758627, 32.81179999918863],
              [-97.35062999758627, 32.81179999918863],
              [-97.35062999758627, 32.81179999918863]
            ]]
          }
        }
      ];
    }
  }

  async getPrecincts(): Promise<Precinct[]> {
    return [...this.precincts];
  }

  async getPrecinctsByCounty(county: string): Promise<Precinct[]> {
    return this.precincts.filter(p => p.county === county);
  }

  async findPrecinctByPoint(lat: number, lng: number): Promise<Precinct | null> {
    // Simple point-in-polygon check for precinct boundaries
    for (const precinct of this.precincts) {
      if (this.isPointInPolygon(lat, lng, precinct.geometry.coordinates[0])) {
        return precinct;
      }
    }
    return null;
  }

  private isPointInPolygon(lat: number, lng: number, polygon: number[][]): boolean {
    let inside = false;
    const x = lng, y = lat;
    
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i][0], yi = polygon[i][1];
      const xj = polygon[j][0], yj = polygon[j][1];
      
      if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
        inside = !inside;
      }
    }
    
    return inside;
  }
}

export const storage = new MemStorage();