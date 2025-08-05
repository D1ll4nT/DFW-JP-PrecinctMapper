#!/usr/bin/env python3
"""
JP Precinct Finder - Find which Justice of the Peace precinct an address belongs to.

This tool performs reverse geocoding to determine which JP precinct contains
a given address across the 4 North Texas counties (Collin, Dallas, Denton, Tarrant).
"""

import json
import requests
import time
import sys
from typing import Dict, List, Optional, Tuple
from shapely.geometry import shape, Point
from dataclasses import dataclass

@dataclass
class PrecinctInfo:
    """Information about a JP precinct."""
    id: str
    name: str
    county: str
    precinct_number: str
    population: float
    rental_households: float
    median_household_income: float
    poverty_rate: float

class JPPrecinctFinder:
    """Find JP precincts for addresses in North Texas."""
    
    def __init__(self, geojson_file: str = '/home/ubuntu/jp_precincts_clean.geojson'):
        """Initialize the precinct finder with GeoJSON data."""
        self.precincts = []
        self.geometries = []
        self.load_precinct_data(geojson_file)
    
    def load_precinct_data(self, geojson_file: str):
        """Load precinct data from GeoJSON file."""
        print(f"Loading precinct data from {geojson_file}...")
        
        with open(geojson_file, 'r') as f:
            data = json.load(f)
        
        for feature in data['features']:
            props = feature['properties']
            
            # Create precinct info
            precinct = PrecinctInfo(
                id=props['id'],
                name=props['name'],
                county=props['county'],
                precinct_number=props['precinct_number'],
                population=props.get('population', 0),
                rental_households=props.get('rental_households', 0),
                median_household_income=props.get('median_household_income', 0),
                poverty_rate=props.get('poverty_rate', 0)
            )
            
            # Create geometry
            geometry = shape(feature['geometry'])
            
            self.precincts.append(precinct)
            self.geometries.append(geometry)
        
        print(f"Loaded {len(self.precincts)} precincts")
    
    def geocode_address(self, address: str) -> Optional[Tuple[float, float]]:
        """
        Geocode an address to latitude/longitude coordinates.
        Uses OpenStreetMap Nominatim API (free, no API key required).
        """
        # Clean and format the address
        address = address.strip()
        if not address:
            return None
        
        # Add North Texas context if not specified
        if not any(county in address.lower() for county in ['collin', 'dallas', 'denton', 'tarrant']):
            if 'texas' not in address.lower() and 'tx' not in address.lower():
                address += ', Texas'
        
        # Use Nominatim API
        url = "https://nominatim.openstreetmap.org/search"
        params = {
            'q': address,
            'format': 'json',
            'limit': 1,
            'countrycodes': 'us',
            'bounded': 1,
            'viewbox': '-97.8,32.3,-96.0,33.5'  # Rough bounding box for North Texas
        }
        
        headers = {
            'User-Agent': 'JP-Precinct-Finder/1.0'
        }
        
        try:
            print(f"Geocoding address: {address}")
            response = requests.get(url, params=params, headers=headers, timeout=10)
            response.raise_for_status()
            
            results = response.json()
            if results:
                lat = float(results[0]['lat'])
                lon = float(results[0]['lon'])
                print(f"Geocoded to: {lat}, {lon}")
                return lat, lon
            else:
                print("No geocoding results found")
                return None
                
        except Exception as e:
            print(f"Geocoding error: {e}")
            return None
    
    def find_precinct_by_coordinates(self, lat: float, lon: float) -> Optional[PrecinctInfo]:
        """Find which precinct contains the given coordinates."""
        point = Point(lon, lat)  # Note: Shapely uses (x, y) = (lon, lat)
        
        for i, geometry in enumerate(self.geometries):
            if geometry.contains(point):
                return self.precincts[i]
        
        return None
    
    def find_precinct_by_address(self, address: str) -> Optional[PrecinctInfo]:
        """Find which precinct contains the given address."""
        # Geocode the address
        coords = self.geocode_address(address)
        if not coords:
            return None
        
        lat, lon = coords
        
        # Find the precinct
        return self.find_precinct_by_coordinates(lat, lon)
    
    def get_all_precincts(self) -> List[PrecinctInfo]:
        """Get a list of all available precincts."""
        return self.precincts.copy()
    
    def get_precincts_by_county(self, county: str) -> List[PrecinctInfo]:
        """Get all precincts for a specific county."""
        county = county.lower().replace(' county', '').strip()
        return [p for p in self.precincts if county in p.county.lower()]
    
    def search_precincts(self, query: str) -> List[PrecinctInfo]:
        """Search precincts by name or county."""
        query = query.lower()
        results = []
        
        for precinct in self.precincts:
            if (query in precinct.name.lower() or 
                query in precinct.county.lower() or
                query in precinct.id.lower()):
                results.append(precinct)
        
        return results

def main():
    """Main function for command-line usage."""
    
    if len(sys.argv) < 2:
        print("Usage: python3 jp_precinct_finder.py <address>")
        print("Example: python3 jp_precinct_finder.py '123 Main St, Dallas, TX'")
        return
    
    address = ' '.join(sys.argv[1:])
    
    # Initialize the finder
    finder = JPPrecinctFinder()
    
    # Find the precinct
    print(f"\nSearching for precinct containing: {address}")
    print("-" * 50)
    
    precinct = finder.find_precinct_by_address(address)
    
    if precinct:
        print(f"✓ Found precinct!")
        print(f"  Name: {precinct.name}")
        print(f"  County: {precinct.county}")
        print(f"  Precinct Number: {precinct.precinct_number}")
        print(f"  ID: {precinct.id}")
        print(f"  Population: {precinct.population:,.0f}")
        print(f"  Rental Households: {precinct.rental_households:,.0f}")
        print(f"  Median Household Income: ${precinct.median_household_income:,.0f}")
        print(f"  Poverty Rate: {precinct.poverty_rate:.1%}")
    else:
        print("✗ No precinct found for this address.")
        print("This address may be:")
        print("  - Outside the 4-county North Texas area")
        print("  - Not geocodable (invalid address)")
        print("  - In an area not covered by JP precincts")

def demo():
    """Demonstration of the JP Precinct Finder."""
    print("=== JP Precinct Finder Demo ===\n")
    
    finder = JPPrecinctFinder()
    
    # Test addresses
    test_addresses = [
        "Dallas City Hall, Dallas, TX",
        "Fort Worth City Hall, Fort Worth, TX", 
        "Plano City Hall, Plano, TX",
        "Denton City Hall, Denton, TX",
        "1600 Pennsylvania Avenue"  # Should not be found
    ]
    
    for address in test_addresses:
        print(f"Testing: {address}")
        precinct = finder.find_precinct_by_address(address)
        
        if precinct:
            print(f"  ✓ {precinct.name}")
        else:
            print(f"  ✗ Not found")
        print()
        
        # Rate limiting for API
        time.sleep(1)
    
    # Show summary
    print("=== Precinct Summary ===")
    all_precincts = finder.get_all_precincts()
    
    counties = {}
    for precinct in all_precincts:
        if precinct.county not in counties:
            counties[precinct.county] = []
        counties[precinct.county].append(precinct)
    
    for county, precincts in sorted(counties.items()):
        print(f"{county}: {len(precincts)} precincts")
        for precinct in sorted(precincts, key=lambda p: int(p.precinct_number)):
            print(f"  - Precinct {precinct.precinct_number}")

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--demo":
        demo()
    else:
        main()

