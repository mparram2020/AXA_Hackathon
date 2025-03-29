#!/bin/bash

# Test the /process_accident endpoint with different accident descriptions
# echo "Testing /process_accident endpoint with accident description 1..."
# curl -s -X POST "http://127.0.0.1:8001/process_accident" \
#     -H "Content-Type: application/json" \
#     -d '{"accident_description": "El conductor perdió el control del tractor debido a lluvias intensas y chocó contra un árbol."}' | jq .

# echo "Testing /process_accident endpoint with accident description 2..."
# curl -s -X POST "http://127.0.0.1:8001/process_accident" \
#     -H "Content-Type: application/json" \
#     -d '{"accident_description": "El vehículo fue robado mientras estaba estacionado en una zona rural."}' | jq .

# echo "Testing /process_accident endpoint with accident description 3..."
# curl -s -X POST "http://127.0.0.1:8001/process_accident" \
#     -H "Content-Type: application/json" \
#     -d '{"accident_description": "El remolque agrícola sufrió daños por incendio mientras estaba en uso."}' | jq .

echo "Testing /process_accident endpoint with all required information provided..."
curl -s -X POST "http://127.0.0.1:8001/process_accident" \
    -H "Content-Type: application/json" \
    -d '{
        "accident_description": "El 15 de marzo de 2023 a las 14:30, un tractor chocó contra un árbol en una carretera rural debido a lluvias intensas. El vehículo sufrió daños en el capó y el parabrisas. No hubo daños a terceros. El vehículo estaba siendo usado para actividades agrícolas profesionales."
    }' | jq .
