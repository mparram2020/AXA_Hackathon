#!/bin/bash

# Test the root endpoint
echo "Testing root endpoint..."
ROOT_RESPONSE=$(curl -s http://127.0.0.1:8001/)
if echo "$ROOT_RESPONSE" | jq . > /dev/null 2>&1; then
    echo "$ROOT_RESPONSE" | jq .
else
    echo "Invalid JSON response from root endpoint: $ROOT_RESPONSE"
fi

# Test the /predict endpoint with sample coordinates
echo "Testing /predict endpoint with sample coordinates..."
PREDICT_RESPONSE=$(curl -s "http://127.0.0.1:8001/predict?lat=40.4168&lon=-3.7038")
if echo "$PREDICT_RESPONSE" | jq . > /dev/null 2>&1; then
    echo "$PREDICT_RESPONSE" | jq .
else
    echo "Invalid JSON response from /predict endpoint: $PREDICT_RESPONSE"
fi


