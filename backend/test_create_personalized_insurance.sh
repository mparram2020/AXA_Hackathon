#!/bin/bash

# Test input for the /create_personalized_insurance endpoint
USER_INPUT="I need coverage for my tractor in case of theft, fire, and accidents."

# Test the /create_personalized_insurance endpoint
echo "Testing /create_personalized_insurance endpoint with user input..."
curl -s -X POST "http://127.0.0.1:8001/create_personalized_insurance" \
    -H "Content-Type: application/json" \
    -d "{\"user_input\": \"$USER_INPUT\"}" | jq .
