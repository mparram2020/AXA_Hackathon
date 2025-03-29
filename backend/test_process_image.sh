#!/bin/bash

# Path to the test image
TEST_IMAGE="testimage.png"

# Check if the test image exists
if [ ! -f "$TEST_IMAGE" ]; then
    echo "Error: Test image '$TEST_IMAGE' not found."
    exit 1
fi

# Test the /process_image endpoint
echo "Testing /process_image endpoint with $TEST_IMAGE..."
curl -s -X POST "http://127.0.0.1:8001/process_image" \
    -H "Content-Type: multipart/form-data" \
    -F "file=@$TEST_IMAGE" | jq .
