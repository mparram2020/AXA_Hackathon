#!/bin/bash

# Test the /save_insurance endpoint
echo "Testing /save_insurance endpoint..."
curl -s -X POST "http://127.0.0.1:8001/save_insurance" \
    -H "Content-Type: application/json" \
    -d '{
        "modelo_tractor": "John Deere 5075E",
        "condicion": "Buen estado",
        "color": "Verde",
        "año": 2020,
        "descripcion_adicional": "Tractor usado para actividades agrícolas.",
        "coordinates": [40.4168, -3.7038],
        "garaje": true
    }' | jq .
