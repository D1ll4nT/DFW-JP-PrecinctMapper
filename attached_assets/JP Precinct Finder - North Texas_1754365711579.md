# JP Precinct Finder - North Texas

A comprehensive tool to find Justice of the Peace precincts for addresses across the 4 North Texas counties (Collin, Dallas, Denton, and Tarrant).

## Overview

This tool extracts and uses official JP precinct boundary data from the North Texas Evictions Project to perform accurate address-to-precinct lookups. It provides both command-line and web interfaces for easy use.

## Features

- **Accurate Precinct Lookup**: Uses exact precinct boundaries as provided by counties
- **4-County Coverage**: Supports all JP precincts in Collin, Dallas, Denton, and Tarrant counties
- **Multiple Interfaces**: Command-line tool and web interface
- **Geocoding Integration**: Automatically converts addresses to coordinates
- **Comprehensive Data**: Includes demographic and statistical information for each precinct

## Coverage

- **Collin County**: 4 precincts
- **Dallas County**: 5 precincts  
- **Denton County**: 6 precincts
- **Tarrant County**: 8 precincts
- **Total**: 23 JP precincts

## Installation

### Prerequisites

```bash
pip install shapely geopandas requests flask pandas
```

### Files Included

- `jp_precinct_finder.py` - Main command-line tool
- `web_interface.py` - Flask web application
- `process_precinct_data.py` - Data processing script
- `jp_precincts_clean.geojson` - Processed precinct boundary data
- `templates/index.html` - Web interface template
- `NTEP_demographics_jpcourt.geojson` - Original demographics data
- `NTEP_bubble_jpcourt.geojson` - Original bubble data

## Usage

### Command Line Interface

```bash
# Find precinct for a specific address
python3 jp_precinct_finder.py "123 Main St, Dallas, TX"

# Run demo with test addresses
python3 jp_precinct_finder.py --demo
```

### Web Interface

```bash
# Start the web server
python3 web_interface.py

# Open browser to http://localhost:5000
```

### Python API

```python
from jp_precinct_finder import JPPrecinctFinder

# Initialize the finder
finder = JPPrecinctFinder()

# Find precinct by address
precinct = finder.find_precinct_by_address("Dallas City Hall, Dallas, TX")

if precinct:
    print(f"Found: {precinct.name}")
    print(f"County: {precinct.county}")
    print(f"Precinct Number: {precinct.precinct_number}")

# Find precinct by coordinates
precinct = finder.find_precinct_by_coordinates(32.7762714, -96.7969417)

# Get all precincts
all_precincts = finder.get_all_precincts()

# Get precincts by county
dallas_precincts = finder.get_precincts_by_county("Dallas")
```

## Data Structure

Each precinct includes the following information:

- **id**: Unique precinct identifier (e.g., "48113-1")
- **name**: Full precinct name (e.g., "Dallas County Precinct 1")
- **county**: County name
- **precinct_number**: Precinct number within county
- **population**: Total population
- **rental_households**: Number of rental households
- **median_household_income**: Median household income
- **poverty_rate**: Poverty rate (0-1)

## API Endpoints (Web Interface)

### POST /api/find_precinct
Find precinct for an address.

**Request:**
```json
{
  "address": "123 Main St, Dallas, TX"
}
```

**Response:**
```json
{
  "success": true,
  "precinct": {
    "id": "48113-1",
    "name": "Dallas County Precinct 1",
    "county": "Dallas County",
    "precinct_number": "1",
    "population": 510306,
    "rental_households": 88393,
    "median_household_income": 63253,
    "poverty_rate": 0.219
  }
}
```

### GET /api/precincts
Get all precincts.

### GET /api/precincts/{county}
Get precincts for a specific county.

## Data Sources

The precinct boundary data is sourced from the North Texas Evictions Project:

- **Demographics Data**: `https://raw.githubusercontent.com/childpovertyactionlab/cpal-evictions/production/demo/NTEP_demographics_jpcourt.geojson`
- **Bubble Data**: `https://raw.githubusercontent.com/childpovertyactionlab/cpal-evictions/production/bubble/NTEP_bubble_jpcourt.geojson`

This data represents exact precinct boundaries as provided by each county, ensuring accuracy for legal and administrative purposes.

## Geocoding

The tool uses OpenStreetMap's Nominatim API for geocoding addresses to coordinates. This is a free service that doesn't require an API key, but has rate limiting.

For best results:
- Include city and state in addresses
- Use complete street addresses when possible
- Be aware that some addresses may not geocode successfully

## Technical Details

### Coordinate System
- Uses EPSG:4269 (NAD83) coordinate reference system
- Longitude/latitude coordinates in decimal degrees

### Geometry Processing
- Uses Shapely library for point-in-polygon calculations
- All precinct geometries are validated as valid polygons
- Supports complex polygon shapes with holes

### Performance
- Loads all precinct data into memory for fast lookups
- Point-in-polygon queries are typically sub-millisecond
- Geocoding is the main performance bottleneck (1-2 seconds per address)

## Example Results

```bash
$ python3 jp_precinct_finder.py "Dallas City Hall, Dallas, TX"

Loading precinct data from /home/ubuntu/jp_precincts_clean.geojson...
Loaded 23 precincts

Searching for precinct containing: Dallas City Hall, Dallas, TX
--------------------------------------------------
Geocoding address: Dallas City Hall, Dallas, TX
Geocoded to: 32.7762714, -96.7969417
✓ Found precinct!
  Name: Dallas County Precinct 1
  County: Dallas County
  Precinct Number: 1
  ID: 48113-1
  Population: 510,306
  Rental Households: 88,393
  Median Household Income: $63,253
  Poverty Rate: 21.9%
```

## Limitations

1. **Geocoding Accuracy**: Depends on OpenStreetMap data quality
2. **Rate Limiting**: Free geocoding service has usage limits
3. **Coverage Area**: Only covers the 4 North Texas counties
4. **Address Format**: Works best with complete addresses including city/state

## Security Considerations

- No user data is stored or logged
- Uses HTTPS for external API calls
- Input validation prevents injection attacks
- Rate limiting protects against abuse

## License and Attribution

This tool uses data from the North Texas Evictions Project by the Child Poverty Action Lab. The precinct boundary data represents official county records and should be used in accordance with applicable data use policies.

## Support

For issues or questions about the tool functionality, refer to the source code and documentation. For questions about the underlying precinct data, contact the Child Poverty Action Lab.

## Version History

- **v1.0**: Initial release with command-line and web interfaces
- Supports all 23 JP precincts across 4 North Texas counties
- Includes comprehensive demographic data for each precinct

