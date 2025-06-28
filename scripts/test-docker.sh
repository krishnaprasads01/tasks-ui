#!/bin/bash

# Test script to verify the Docker container works locally
# This helps debug issues before deploying to Cloud Run

echo "🧪 Testing Docker container locally..."

# Build the container
echo "📦 Building container..."
docker build -t tasks-ui-test .

if [ $? -ne 0 ]; then
    echo "❌ Docker build failed"
    exit 1
fi

echo "✅ Build successful"

# Test with default port
echo "🚀 Testing with default PORT=8080..."
docker run --rm -d -p 3001:8080 --name tasks-ui-test-default tasks-ui-test

sleep 5

# Check if the container is running
if docker ps | grep -q tasks-ui-test-default; then
    echo "✅ Container started successfully with default port"
    
    # Test health endpoint
    if curl -f http://localhost:3001/health > /dev/null 2>&1; then
        echo "✅ Health check endpoint working"
    else
        echo "❌ Health check endpoint failed"
    fi
    
    # Test main page
    if curl -f http://localhost:3001/ > /dev/null 2>&1; then
        echo "✅ Main page accessible"
    else
        echo "❌ Main page failed"
    fi
else
    echo "❌ Container failed to start with default port"
    docker logs tasks-ui-test-default
fi

# Cleanup
docker stop tasks-ui-test-default > /dev/null 2>&1

# Test with custom port (simulating Cloud Run)
echo "🚀 Testing with custom PORT=9090..."
docker run --rm -d -p 3002:9090 -e PORT=9090 --name tasks-ui-test-custom tasks-ui-test

sleep 5

# Check if the container is running
if docker ps | grep -q tasks-ui-test-custom; then
    echo "✅ Container started successfully with custom port"
    
    # Test health endpoint
    if curl -f http://localhost:3002/health > /dev/null 2>&1; then
        echo "✅ Health check endpoint working with custom port"
    else
        echo "❌ Health check endpoint failed with custom port"
    fi
    
    # Test main page
    if curl -f http://localhost:3002/ > /dev/null 2>&1; then
        echo "✅ Main page accessible with custom port"
    else
        echo "❌ Main page failed with custom port"
    fi
else
    echo "❌ Container failed to start with custom port"
    docker logs tasks-ui-test-custom
fi

# Cleanup
docker stop tasks-ui-test-custom > /dev/null 2>&1

echo "🏁 Test complete"
