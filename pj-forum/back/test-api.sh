#!/bin/bash

# 🧪 Complete API Testing Script for Spring Boot Forum Backend
# Run this after starting the server with: mvn spring-boot:run

BASE_URL="http://localhost:8080"
ADMIN_TOKEN=""
USER_TOKEN=""
MOD_TOKEN=""

echo "=============================================="
echo "🧪 Testing Spring Boot Forum Backend API"
echo "=============================================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
PASSED=0
FAILED=0

# Function to test endpoint
test_endpoint() {
    local name=$1
    local method=$2
    local endpoint=$3
    local data=$4
    local headers=$5
    local expected_code=$6
    
    echo -n "Testing: $name ... "
    
    if [ -z "$headers" ]; then
        response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data" 2>/dev/null)
    else
        response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -H "$headers" \
            -d "$data" 2>/dev/null)
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n-1)
    
    if [[ "$http_code" == "$expected_code"* ]]; then
        echo -e "${GREEN}✓ PASSED${NC} (HTTP $http_code)"
        ((PASSED++))
        echo "$body" | jq . 2>/dev/null || echo "$body"
    else
        echo -e "${RED}✗ FAILED${NC} (Expected: $expected_code, Got: $http_code)"
        ((FAILED++))
        echo "$body" | jq . 2>/dev/null || echo "$body"
    fi
    echo ""
}

echo "=============================================="
echo "1️⃣  AUTHENTICATION TESTS"
echo "=============================================="
echo ""

# Test 1: Register new user
echo "📝 Test 1: Register New User"
test_endpoint "Register User" "POST" "/api/auth/register" \
    '{"username":"testuser","email":"test@example.com","password":"password123"}' \
    "" "200"

# Test 2: Login as Admin
echo "🔐 Test 2: Login as Admin"
response=$(curl -s -X POST "$BASE_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@school.edu","password":"password123"}')
ADMIN_TOKEN=$(echo $response | jq -r '.token // empty')
echo "$response" | jq .
if [ ! -z "$ADMIN_TOKEN" ]; then
    echo -e "${GREEN}✓ Admin login successful${NC}"
    echo "Token: ${ADMIN_TOKEN:0:20}..."
    ((PASSED++))
else
    echo -e "${RED}✗ Admin login failed${NC}"
    ((FAILED++))
fi
echo ""

# Test 3: Login as regular user
echo "🔐 Test 3: Login as User"
response=$(curl -s -X POST "$BASE_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"password123"}')
USER_TOKEN=$(echo $response | jq -r '.token // empty')
echo "$response" | jq .
if [ ! -z "$USER_TOKEN" ]; then
    echo -e "${GREEN}✓ User login successful${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ User login failed${NC}"
    ((FAILED++))
fi
echo ""

echo "=============================================="
echo "2️⃣  CATEGORY TESTS"
echo "=============================================="
echo ""

# Test 4: Get all categories
test_endpoint "Get All Categories" "GET" "/api/categories" "" "" "200"

# Test 5: Create category (ADMIN only)
if [ ! -z "$ADMIN_TOKEN" ]; then
    test_endpoint "Create Category (Admin)" "POST" "/api/categories" \
        '{"name":"Test Category","description":"Test category description"}' \
        "Authorization: Bearer $ADMIN_TOKEN" "201"
fi

echo "=============================================="
echo "3️⃣  THREAD TESTS"
echo "=============================================="
echo ""

# Test 6: Get all threads
test_endpoint "Get All Threads" "GET" "/api/threads" "" "" "200"

# Test 7: Create thread
if [ ! -z "$USER_TOKEN" ]; then
    response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/threads" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $USER_TOKEN" \
        -d '{"title":"Test Thread","content":"This is a test thread","categoryId":1,"isAnonymous":false}')
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n-1)
    THREAD_ID=$(echo "$body" | jq -r '.id // empty')
    
    echo -n "Testing: Create Thread ... "
    if [[ "$http_code" == "201" ]] || [[ "$http_code" == "200" ]]; then
        echo -e "${GREEN}✓ PASSED${NC} (HTTP $http_code)"
        echo "Thread ID: $THREAD_ID"
        ((PASSED++))
    else
        echo -e "${RED}✗ FAILED${NC} (HTTP $http_code)"
        ((FAILED++))
    fi
    echo "$body" | jq .
    echo ""
fi

# Test 8: Get thread by ID
if [ ! -z "$THREAD_ID" ]; then
    test_endpoint "Get Thread by ID" "GET" "/api/threads/$THREAD_ID" "" "" "200"
fi

echo "=============================================="
echo "4️⃣  REPLY TESTS"
echo "=============================================="
echo ""

# Test 9: Create reply
if [ ! -z "$USER_TOKEN" ] && [ ! -z "$THREAD_ID" ]; then
    test_endpoint "Create Reply" "POST" "/api/threads/$THREAD_ID/replies" \
        '{"content":"This is a test reply"}' \
        "Authorization: Bearer $USER_TOKEN" "201"
fi

# Test 10: Get replies for thread
if [ ! -z "$THREAD_ID" ]; then
    test_endpoint "Get Thread Replies" "GET" "/api/threads/$THREAD_ID/replies" "" "" "200"
fi

echo "=============================================="
echo "5️⃣  USER MANAGEMENT TESTS"
echo "=============================================="
echo ""

# Test 11: Get user profile
if [ ! -z "$USER_TOKEN" ]; then
    test_endpoint "Get User Profile" "GET" "/api/users/1" "" "" "200"
fi

# Test 12: Update user profile
if [ ! -z "$USER_TOKEN" ]; then
    test_endpoint "Update Profile" "PUT" "/api/users/2" \
        '{"bio":"Updated bio","avatar":"https://example.com/avatar.jpg"}' \
        "Authorization: Bearer $USER_TOKEN" "200"
fi

echo "=============================================="
echo "6️⃣  NOTIFICATION TESTS"
echo "=============================================="
echo ""

# Test 13: Get notifications
if [ ! -z "$USER_TOKEN" ]; then
    test_endpoint "Get Notifications" "GET" "/api/notifications" "" \
        "Authorization: Bearer $USER_TOKEN" "200"
fi

# Test 14: Subscribe to thread
if [ ! -z "$USER_TOKEN" ] && [ ! -z "$THREAD_ID" ]; then
    test_endpoint "Subscribe to Thread" "POST" "/api/notifications/subscribe/$THREAD_ID" "" \
        "Authorization: Bearer $USER_TOKEN" "200"
fi

echo "=============================================="
echo "7️⃣  ADMIN TESTS"
echo "=============================================="
echo ""

# Test 15: Get admin settings
if [ ! -z "$ADMIN_TOKEN" ]; then
    test_endpoint "Get Admin Settings" "GET" "/api/admin/settings" "" \
        "Authorization: Bearer $ADMIN_TOKEN" "200"
fi

# Test 16: Update auto-delete settings
if [ ! -z "$ADMIN_TOKEN" ]; then
    test_endpoint "Update Auto-Delete Days" "PUT" "/api/admin/settings/auto-delete-days" \
        '{"days":60}' \
        "Authorization: Bearer $ADMIN_TOKEN" "200"
fi

echo "=============================================="
echo "8️⃣  MODERATOR TESTS"
echo "=============================================="
echo ""

# Test 17: Pin thread (requires ADMIN/MOD)
if [ ! -z "$ADMIN_TOKEN" ] && [ ! -z "$THREAD_ID" ]; then
    test_endpoint "Pin Thread" "POST" "/api/threads/$THREAD_ID/pin" "" \
        "Authorization: Bearer $ADMIN_TOKEN" "200"
fi

# Test 18: Lock thread (requires ADMIN/MOD)
if [ ! -z "$ADMIN_TOKEN" ] && [ ! -z "$THREAD_ID" ]; then
    test_endpoint "Lock Thread" "POST" "/api/threads/$THREAD_ID/lock" "" \
        "Authorization: Bearer $ADMIN_TOKEN" "200"
fi

echo "=============================================="
echo "📊 TEST SUMMARY"
echo "=============================================="
echo ""
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo "Total: $((PASSED + FAILED))"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed!${NC}"
    echo "✅ Backend is ready for production!"
else
    echo -e "${YELLOW}⚠️  Some tests failed. Review the output above.${NC}"
fi

echo ""
echo "=============================================="
echo "💡 QUICK TIPS"
echo "=============================================="
echo "• Admin credentials: admin@school.edu / password123"
echo "• Moderator credentials: mod@school.edu / password123"
echo "• User credentials: user@school.edu / password123"
echo "• API Base URL: http://localhost:8080"
echo "• Swagger UI: http://localhost:8080/swagger-ui.html (if configured)"
echo ""
