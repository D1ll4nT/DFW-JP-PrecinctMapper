#!/usr/bin/env python3
"""
Process JP Precinct GeoJSON data for address lookup functionality.
"""

import json
import pandas as pd
from shapely.geometry import shape, Point
from shapely.ops import unary_union
import geopandas as gpd

def load_and_analyze_data():
    """Load and analyze the precinct GeoJSON files."""
    
    print("Loading GeoJSON files...")
    
    # Load demographics file (contains polygon boundaries)
    with open('/home/ubuntu/NTEP_demographics_jpcourt.geojson', 'r') as f:
        demographics_data = json.load(f)
    
    # Load bubble file (contains centroids and metadata)
    with open('/home/ubuntu/NTEP_bubble_jpcourt.geojson', 'r') as f:
        bubble_data = json.load(f)
    
    print(f"Demographics file: {len(demographics_data['features'])} features")
    print(f"Bubble file: {len(bubble_data['features'])} features")
    
    # Analyze the structure
    print("\n=== DEMOGRAPHICS DATA STRUCTURE ===")
    if demographics_data['features']:
        sample_feature = demographics_data['features'][0]
        print("Sample feature properties:")
        for key, value in sample_feature['properties'].items():
            print(f"  {key}: {value} ({type(value).__name__})")
        
        print(f"Geometry type: {sample_feature['geometry']['type']}")
        if sample_feature['geometry']['type'] == 'Polygon':
            coords = sample_feature['geometry']['coordinates'][0]
            print(f"Polygon has {len(coords)} coordinate points")
    
    print("\n=== BUBBLE DATA STRUCTURE ===")
    if bubble_data['features']:
        sample_feature = bubble_data['features'][0]
        print("Sample feature properties:")
        for key, value in sample_feature['properties'].items():
            print(f"  {key}: {value} ({type(value).__name__})")
        
        print(f"Geometry type: {sample_feature['geometry']['type']}")
        if sample_feature['geometry']['type'] == 'Point':
            coords = sample_feature['geometry']['coordinates']
            print(f"Point coordinates: {coords}")
    
    # Extract precinct information
    print("\n=== PRECINCT SUMMARY ===")
    precincts = []
    
    for feature in demographics_data['features']:
        props = feature['properties']
        precinct_info = {
            'id': props['id'],
            'name': props['name'],
            'county': props['name'].split(' Precinct ')[0],
            'precinct_number': props['name'].split(' Precinct ')[1],
            'geometry_type': feature['geometry']['type']
        }
        precincts.append(precinct_info)
    
    # Group by county
    df = pd.DataFrame(precincts)
    county_summary = df.groupby('county').size().reset_index(name='count')
    
    print("Precincts by county:")
    for _, row in county_summary.iterrows():
        county = row['county']
        count = row['count']
        precinct_numbers = sorted(df[df['county'] == county]['precinct_number'].tolist())
        print(f"  {county}: {count} precincts ({', '.join(precinct_numbers)})")
    
    print(f"\nTotal precincts: {len(precincts)}")
    
    return demographics_data, bubble_data, df

def create_clean_dataset(demographics_data, bubble_data):
    """Create a clean, structured dataset for the lookup functionality."""
    
    print("\n=== CREATING CLEAN DATASET ===")
    
    # Create a structured dataset
    clean_data = {
        'type': 'FeatureCollection',
        'crs': demographics_data['crs'],
        'features': []
    }
    
    # Create lookup for bubble data
    bubble_lookup = {}
    for feature in bubble_data['features']:
        bubble_lookup[feature['properties']['id']] = feature['properties']
    
    # Process each precinct
    for feature in demographics_data['features']:
        precinct_id = feature['properties']['id']
        
        # Get additional data from bubble file
        bubble_props = bubble_lookup.get(precinct_id, {})
        
        # Create clean feature
        clean_feature = {
            'type': 'Feature',
            'properties': {
                'id': precinct_id,
                'name': feature['properties']['name'],
                'county': feature['properties']['name'].split(' Precinct ')[0],
                'precinct_number': feature['properties']['name'].split(' Precinct ')[1],
                'population': bubble_props.get('pop', 0),
                'rental_households': bubble_props.get('rhh', 0),
                # Keep original demographic data
                'median_household_income': feature['properties'].get('mhi', 0),
                'poverty_rate': feature['properties'].get('pvr', 0),
                'child_poverty_rate': feature['properties'].get('cpr', 0)
            },
            'geometry': feature['geometry']
        }
        
        clean_data['features'].append(clean_feature)
    
    # Save clean dataset
    with open('/home/ubuntu/jp_precincts_clean.geojson', 'w') as f:
        json.dump(clean_data, f, indent=2)
    
    print(f"Clean dataset saved with {len(clean_data['features'])} precincts")
    
    return clean_data

def validate_geometries(clean_data):
    """Validate that all geometries are valid polygons."""
    
    print("\n=== VALIDATING GEOMETRIES ===")
    
    valid_count = 0
    invalid_count = 0
    
    for feature in clean_data['features']:
        try:
            geom = shape(feature['geometry'])
            if geom.is_valid:
                valid_count += 1
            else:
                invalid_count += 1
                print(f"Invalid geometry for {feature['properties']['name']}")
        except Exception as e:
            invalid_count += 1
            print(f"Error processing geometry for {feature['properties']['name']}: {e}")
    
    print(f"Valid geometries: {valid_count}")
    print(f"Invalid geometries: {invalid_count}")
    
    return valid_count, invalid_count

if __name__ == "__main__":
    # Load and analyze the data
    demographics_data, bubble_data, df = load_and_analyze_data()
    
    # Create clean dataset
    clean_data = create_clean_dataset(demographics_data, bubble_data)
    
    # Validate geometries
    valid_count, invalid_count = validate_geometries(clean_data)
    
    print("\n=== PROCESSING COMPLETE ===")
    print("Files created:")
    print("  - jp_precincts_clean.geojson: Clean dataset for lookup functionality")
    
    if invalid_count == 0:
        print("✓ All geometries are valid and ready for address lookup")
    else:
        print(f"⚠ {invalid_count} invalid geometries found - may need fixing")

