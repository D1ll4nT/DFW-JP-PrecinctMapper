#!/usr/bin/env python3
"""
Web interface for the JP Precinct Finder.
"""

from flask import Flask, render_template, request, jsonify
from jp_precinct_finder import JPPrecinctFinder
import json

app = Flask(__name__)

# Initialize the precinct finder
finder = JPPrecinctFinder()

@app.route('/')
def index():
    """Main page."""
    return render_template('index.html')

@app.route('/api/find_precinct', methods=['POST'])
def find_precinct():
    """API endpoint to find precinct for an address."""
    data = request.get_json()
    address = data.get('address', '').strip()
    
    if not address:
        return jsonify({'error': 'Address is required'}), 400
    
    try:
        precinct = finder.find_precinct_by_address(address)
        
        if precinct:
            return jsonify({
                'success': True,
                'precinct': {
                    'id': precinct.id,
                    'name': precinct.name,
                    'county': precinct.county,
                    'precinct_number': precinct.precinct_number,
                    'population': precinct.population,
                    'rental_households': precinct.rental_households,
                    'median_household_income': precinct.median_household_income,
                    'poverty_rate': precinct.poverty_rate
                }
            })
        else:
            return jsonify({
                'success': False,
                'error': 'No precinct found for this address'
            })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/precincts')
def get_precincts():
    """Get all precincts."""
    precincts = finder.get_all_precincts()
    
    result = []
    for precinct in precincts:
        result.append({
            'id': precinct.id,
            'name': precinct.name,
            'county': precinct.county,
            'precinct_number': precinct.precinct_number,
            'population': precinct.population,
            'rental_households': precinct.rental_households,
            'median_household_income': precinct.median_household_income,
            'poverty_rate': precinct.poverty_rate
        })
    
    return jsonify(result)

@app.route('/api/precincts/<county>')
def get_precincts_by_county(county):
    """Get precincts for a specific county."""
    precincts = finder.get_precincts_by_county(county)
    
    result = []
    for precinct in precincts:
        result.append({
            'id': precinct.id,
            'name': precinct.name,
            'county': precinct.county,
            'precinct_number': precinct.precinct_number,
            'population': precinct.population,
            'rental_households': precinct.rental_households,
            'median_household_income': precinct.median_household_income,
            'poverty_rate': precinct.poverty_rate
        })
    
    return jsonify(result)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

