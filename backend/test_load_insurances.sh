#!/bin/bash

# Test the /load_insurances endpoint
echo "Testing /load_insurances endpoint..."
curl -s -X GET "http://127.0.0.1:8001/load_insurances" | jq .
