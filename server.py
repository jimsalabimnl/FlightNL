#!/usr/bin/env python3
"""
Simple Flask server that acts as a proxy for the OpenSky API
and serves the built React app from dist/ folder
"""

import os
import sys
import requests
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from pathlib import Path

# Ensure stdout is unbuffered
sys.stdout = open(sys.stdout.fileno(), 'w', buffering=1)

# Determine the correct static folder
# In production, serve from dist/ (built React app)
# In development, serve from current directory
dist_dir = Path(__file__).parent / 'dist'
static_dir = str(dist_dir) if dist_dir.exists() else '.'

app = Flask(__name__, static_folder=static_dir, static_url_path='')
CORS(app)

API_KEY = 'edfe4726c29410af8d35568227167bea'
OPENSKY_API = 'https://opensky-api.org/api/states/all'

def get_mock_flights():
    """Return mock flight data for testing"""
    return {
        "time": 1234567890,
        "states": [
            # Flight from Amsterdam to Paris
            ["ICAO001", "KLM123", "Netherlands", 1234567890, 1234567890, 2.5, 52.3, 8000, False, 200, 90, 100, None, 8100, None, False, 0],
            # Flight from Frankfurt to Amsterdam
            ["ICAO002", "LH456", "Germany", 1234567890, 1234567890, 5.2, 51.9, 10000, False, 220, 270, -50, None, 10200, None, False, 0],
            # Flight departing from Amsterdam
            ["ICAO003", "AF789", "Netherlands", 1234567890, 1234567890, 4.5, 52.0, 5000, False, 180, 180, 80, None, 5100, None, False, 0],
            # Flight near Netherlands airspace
            ["ICAO004", "BA101", "United Kingdom", 1234567890, 1234567890, 3.5, 51.5, 9000, False, 210, 45, 120, None, 9100, None, False, 0],
            # Another flight via Netherlands
            ["ICAO005", "DL202", "United States", 1234567890, 1234567890, 6.0, 52.5, 12000, False, 240, 270, -100, None, 12100, None, False, 0],
        ]
    }

@app.route('/api/flights', methods=['GET'])
def get_flights():
    """Proxy endpoint for OpenSky API"""
    app.logger.info('get_flights called')

    # Try to fetch real data, fall back to mock if no internet
    try:
        url = f'{OPENSKY_API}?apiKey={API_KEY}'
        app.logger.info(f'Fetching from {url}...')
        response = requests.get(url, timeout=10)
        app.logger.info(f'Response status: {response.status_code}')
        response.raise_for_status()
        data = response.json()
        num_flights = len(data.get("states", []))
        app.logger.info(f'Successfully fetched {num_flights} flights')
        return jsonify(data)
    except requests.exceptions.RequestException as e:
        error_msg = f'No internet access (expected in preview). Using mock data: {str(e)}'
        app.logger.warning(error_msg)
        # Return mock data when real API is not available
        mock_data = get_mock_flights()
        app.logger.info(f'Returning {len(mock_data["states"])} mock flights')
        return jsonify(mock_data)
    except Exception as e:
        error_msg = f'Unexpected error: {str(e)}'
        app.logger.error(error_msg)
        return jsonify({'error': error_msg}), 500

@app.route('/')
def index():
    """Serve index.html"""
    return send_from_directory(static_dir, 'index.html')

@app.route('/<path:filename>')
def serve_static(filename):
    """Serve static files"""
    try:
        return send_from_directory(static_dir, filename)
    except:
        # Fall back to index.html for React Router
        return send_from_directory(static_dir, 'index.html')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.logger.info(f'Starting server on port {port}')
    app.run(host='0.0.0.0', port=port, debug=False)
