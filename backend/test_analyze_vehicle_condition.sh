#!/bin/bash

# Test input for the /analyze_vehicle_condition endpoint
DESCRIPTION="The vehicle has a broken windshield and minor scratches on the doors."

# Test the /analyze_vehicle_condition endpoint
echo "Testing /analyze_vehicle_condition endpoint with description..."
curl -s -X POST "http://127.0.0.1:8001/analyze_vehicle_condition" \
    -H "Content-Type: application/json" \
    -d "{\"description\": \"$DESCRIPTION\"}" | jq .
