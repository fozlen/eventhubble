#!/bin/bash

echo "🧪 EventHubble Production Test Script"
echo "====================================="

# API URL'leri
API_URL="https://eventhubble-api.onrender.com"
CDN_URL="https://cdn.eventhubble.com"
FRONTEND_URL="https://eventhubble.netlify.app"

echo ""
echo "🔍 Testing Backend API..."
echo "========================="

# Health check
echo "1. Health Check:"
curl -s "${API_URL}/health" | jq '.' 2>/dev/null || curl -s "${API_URL}/health"

echo ""
echo "2. API Status:"
curl -s "${API_URL}/api/status" | jq '.' 2>/dev/null || curl -s "${API_URL}/api/status"

echo ""
echo "3. Events API:"
curl -s "${API_URL}/api/events" | jq '.' 2>/dev/null || curl -s "${API_URL}/api/events"

echo ""
echo "4. Stats API:"
curl -s "${API_URL}/api/stats" | jq '.' 2>/dev/null || curl -s "${API_URL}/api/stats"

echo ""
echo "🔍 Testing CDN..."
echo "================="

# CDN test (eğer kurulmuşsa)
echo "5. CDN Health Check:"
curl -s "${CDN_URL}/health" | jq '.' 2>/dev/null || echo "CDN not configured yet"

echo ""
echo "🔍 Testing Frontend..."
echo "====================="

# Frontend test
echo "6. Frontend Status:"
curl -s -I "${FRONTEND_URL}" | head -1

echo ""
echo "✅ Test completed!"
echo ""
echo "📊 URLs:"
echo "  API: ${API_URL}"
echo "  CDN: ${CDN_URL}"
echo "  Frontend: ${FRONTEND_URL}" 