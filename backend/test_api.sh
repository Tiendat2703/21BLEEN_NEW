#!/bin/bash

# =============================================================================
# API TEST SCRIPT - FIXED WITH PASSCODE ENDPOINTS
# Base URL: http://localhost:3001
# Tests all endpoints including /api/auth/change-passcode and /api/auth/reset-passcode
# Fixed HTTP status and token extraction issues
# =============================================================================

BASE_URL="http://localhost:3001"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="Admin@2024"
USER_EMAIL="testuser$(date +%s)@example.com"
USER_FULL_NAME="Test User"
USER_PASSCODE="1234"
USER_PHONE="+84901234567"
USER_ID=""
ADMIN_TOKEN=""
USER_TOKEN=""
IMAGE_ID=""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Kiểm tra jq
if ! command -v jq &> /dev/null; then
    echo -e "${RED}ERROR: jq is not installed. Install it with 'brew install jq'${NC}"
    exit 1
fi

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  API TESTING SCRIPT${NC}"
echo -e "${BLUE}========================================${NC}\n"

# =============================================================================
# 1. HEALTH CHECK
# =============================================================================
echo -e "${GREEN}1. Health Check${NC}"
HEALTH_RESPONSE=$(curl -s -X GET "${BASE_URL}/health" \
    -H "Content-Type: application/json" \
    -w "\n%{http_code}")
HTTP_STATUS=$(echo "$HEALTH_RESPONSE" | tail -n 1)
echo "$HEALTH_RESPONSE" | head -n -1 | jq 2>/dev/null || echo "No JSON response"
if [ "$HTTP_STATUS" -eq 200 ]; then
    echo -e "${GREEN}Success${NC}"
else
    echo -e "${RED}Failed (Status: $HTTP_STATUS)${NC}"
fi

echo -e "\n${YELLOW}Press Enter to continue...${NC}" && read

# =============================================================================
# 2. ADMIN LOGIN
# =============================================================================
echo -e "\n${GREEN}2. Admin Login${NC}"
echo "Using username: $ADMIN_USERNAME, password: $ADMIN_PASSWORD"
ADMIN_RESPONSE=$(curl -s -X POST "${BASE_URL}/api/admin/login/simple" \
    -H "Content-Type: application/json" \
    -d "{\"username\":\"$ADMIN_USERNAME\",\"password\":\"$ADMIN_PASSWORD\"}" \
    -w "\n%{http_code}")
HTTP_STATUS=$(echo "$ADMIN_RESPONSE" | tail -n 1)
echo "$ADMIN_RESPONSE" | head -n -1 | jq
ADMIN_TOKEN=$(echo "$ADMIN_RESPONSE" | head -n -1 | jq -r '.data.token' 2>/dev/null)
echo -e "${YELLOW}Admin Token: $ADMIN_TOKEN${NC}"
if [ "$HTTP_STATUS" -ne 200 ] || [ -z "$ADMIN_TOKEN" ] || [ "$ADMIN_TOKEN" = "null" ]; then
    echo -e "${RED}Failed (Status: $HTTP_STATUS)${NC}"
    exit 1
fi

echo -e "\n${YELLOW}Press Enter to continue...${NC}" && read

# =============================================================================
# 3. GET ALL USERS (Admin only)
# =============================================================================
echo -e "\n${GREEN}3. Get All Users (Admin)${NC}"
USERS_RESPONSE=$(curl -s -X GET "${BASE_URL}/api/users/all" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $ADMIN_TOKEN" \
    -w "\n%{http_code}")
HTTP_STATUS=$(echo "$USERS_RESPONSE" | tail -n 1)
echo "$USERS_RESPONSE" | head -n -1 | jq
if [ "$HTTP_STATUS" -ne 200 ]; then
    echo -e "${RED}Failed (Status: $HTTP_STATUS)${NC}"
    exit 1
fi

echo -e "\n${YELLOW}Press Enter to continue...${NC}" && read

# =============================================================================
# 4. REGISTER NEW USER (Admin only)
# =============================================================================
echo -e "\n${GREEN}4. Register New User (Admin)${NC}"
echo -e "${YELLOW}Using email: $USER_EMAIL${NC}"
REGISTER_RESPONSE=$(curl -s -X POST "${BASE_URL}/api/auth/register" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $ADMIN_TOKEN" \
    -d "{\"email\":\"$USER_EMAIL\",\"full_name\":\"$USER_FULL_NAME\",\"passcode\":\"$USER_PASSCODE\",\"phone\":\"$USER_PHONE\"}" \
    -w "\n%{http_code}")
HTTP_STATUS=$(echo "$REGISTER_RESPONSE" | tail -n 1)
echo "$REGISTER_RESPONSE" | head -n -1 | jq
USER_ID=$(echo "$REGISTER_RESPONSE" | head -n -1 | jq -r '.data.userId' 2>/dev/null)
echo -e "${YELLOW}User ID: $USER_ID${NC}"
if [ "$HTTP_STATUS" -ne 200 ] || [ -z "$USER_ID" ] || [ "$USER_ID" = "null" ]; then
    echo -e "${RED}Failed (Status: $HTTP_STATUS)${NC}"
    exit 1
fi

echo -e "\n${YELLOW}Press Enter to continue...${NC}" && read

# =============================================================================
# 5. VERIFY PASSCODE (Get User Token)
# =============================================================================
echo -e "\n${GREEN}5. Verify Passcode${NC}"
AUTH_RESPONSE=$(curl -s -X POST "${BASE_URL}/api/auth/verify-passcode" \
    -H "Content-Type: application/json" \
    -d "{\"userId\":\"$USER_ID\",\"passcode\":\"$USER_PASSCODE\"}" \
    -w "\n%{http_code}")
HTTP_STATUS=$(echo "$AUTH_RESPONSE" | tail -n 1)
echo "$AUTH_RESPONSE" | head -n -1 | jq
USER_TOKEN=$(echo "$AUTH_RESPONSE" | head -n -1 | jq -r '.data.accessToken' 2>/dev/null)
echo -e "${YELLOW}User Token: $USER_TOKEN${NC}"
if [ "$HTTP_STATUS" -ne 200 ] || [ -z "$USER_TOKEN" ] || [ "$USER_TOKEN" = "null" ]; then
    echo -e "${RED}Failed (Status: $HTTP_STATUS)${NC}"
    exit 1
fi

echo -e "\n${YELLOW}Press Enter to continue...${NC}" && read

# =============================================================================
# 6. UPLOAD SINGLE IMAGE
# =============================================================================
echo -e "\n${GREEN}6. Upload Single Image${NC}"
echo "Creating test image..."
convert -size 100x100 xc:blue test_image.jpg 2>/dev/null || {
    echo -e "${YELLOW}ImageMagick not found. Creating dummy file...${NC}"
    echo "fake image data" > test_image.jpg
}
UPLOAD_RESPONSE=$(curl -s -X POST "${BASE_URL}/api/upload" \
    -H "Authorization: Bearer $USER_TOKEN" \
    -F "image=@test_image.jpg" \
    -F "userId=$USER_ID" \
    -F "position=1" \
    -w "\n%{http_code}")
HTTP_STATUS=$(echo "$UPLOAD_RESPONSE" | tail -n 1)
echo "$UPLOAD_RESPONSE" | head -n -1 | jq
IMAGE_ID=$(echo "$UPLOAD_RESPONSE" | head -n -1 | jq -r '.data.id' 2>/dev/null)
echo -e "${YELLOW}Image ID: $IMAGE_ID${NC}"
if [ "$HTTP_STATUS" -ne 200 ]; then
    echo -e "${RED}Failed (Status: $HTTP_STATUS)${NC}"
fi

echo -e "\n${YELLOW}Press Enter to continue...${NC}" && read

# =============================================================================
# 7. UPLOAD MULTIPLE IMAGES
# =============================================================================
echo -e "\n${GREEN}7. Upload Multiple Images${NC}"
echo "Creating test images..."
for i in {2..4}; do
    convert -size 100x100 xc:red test_image_$i.jpg 2>/dev/null || {
        echo -e "${YELLOW}fake image data $i${NC}" > test_image_$i.jpg
    }
done
MULTI_UPLOAD_RESPONSE=$(curl -s -X POST "${BASE_URL}/api/upload/multiple" \
    -H "Authorization: Bearer $USER_TOKEN" \
    -F "images=@test_image_2.jpg" \
    -F "images=@test_image_3.jpg" \
    -F "images=@test_image_4.jpg" \
    -F "userId=$USER_ID" \
    -F "positions=[2,3,4]" \
    -w "\n%{http_code}")
HTTP_STATUS=$(echo "$MULTI_UPLOAD_RESPONSE" | tail -n 1)
echo "$MULTI_UPLOAD_RESPONSE" | head -n -1 | jq
if [ "$HTTP_STATUS" -ne 200 ]; then
    echo -e "${RED}Failed (Status: $HTTP_STATUS)${NC}"
fi

echo -e "\n${YELLOW}Press Enter to continue...${NC}" && read

# =============================================================================
# 8. GET ALL IMAGES OF USER
# =============================================================================
echo -e "\n${GREEN}8. Get All Images${NC}"
IMAGES_RESPONSE=$(curl -s -X GET "${BASE_URL}/api/images/$USER_ID" \
    -H "Authorization: Bearer $USER_TOKEN" \
    -w "\n%{http_code}")
HTTP_STATUS=$(echo "$IMAGES_RESPONSE" | tail -n 1)
echo "$IMAGES_RESPONSE" | head -n -1 | jq
if [ "$HTTP_STATUS" -ne 200 ]; then
    echo -e "${RED}Failed (Status: $HTTP_STATUS)${NC}"
fi

echo -e "\n${YELLOW}Press Enter to continue...${NC}" && read

# =============================================================================
# 9. GET ALL IMAGES (with pagination)
# =============================================================================
echo -e "\n${GREEN}9. Get Images with Pagination${NC}"
PAGINATE_RESPONSE=$(curl -s -X GET "${BASE_URL}/api/images/$USER_ID?limit=2&offset=0&sortBy=position" \
    -H "Authorization: Bearer $USER_TOKEN" \
    -w "\n%{http_code}")
HTTP_STATUS=$(echo "$PAGINATE_RESPONSE" | tail -n 1)
echo "$PAGINATE_RESPONSE" | head -n -1 | jq
if [ "$HTTP_STATUS" -ne 200 ]; then
    echo -e "${RED}Failed (Status: $HTTP_STATUS)${NC}"
fi

echo -e "\n${YELLOW}Press Enter to continue...${NC}" && read

# =============================================================================
# 10. GET SINGLE IMAGE BY ID
# =============================================================================
echo -e "\n${GREEN}10. Get Single Image by ID${NC}"
if [ ! -z "$IMAGE_ID" ] && [ "$IMAGE_ID" != "null" ]; then
    SINGLE_IMAGE_RESPONSE=$(curl -s -X GET "${BASE_URL}/api/image/$IMAGE_ID" \
        -H "Authorization: Bearer $USER_TOKEN" \
        -w "\n%{http_code}")
    HTTP_STATUS=$(echo "$SINGLE_IMAGE_RESPONSE" | tail -n 1)
    echo "$SINGLE_IMAGE_RESPONSE" | head -n -1 | jq
    if [ "$HTTP_STATUS" -ne 200 ]; then
        echo -e "${RED}Failed (Status: $HTTP_STATUS)${NC}"
    fi
else
    echo -e "${YELLOW}No image ID available${NC}"
fi

echo -e "\n${YELLOW}Press Enter to continue...${NC}" && read

# =============================================================================
# 11. CREATE/UPDATE POST
# =============================================================================
echo -e "\n${GREEN}11. Create/Update Post${NC}"
POST_CREATE_RESPONSE=$(curl -s -X POST "${BASE_URL}/api/posts/$USER_ID" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $USER_TOKEN" \
    -d '{"content":"This is my test post content. Hello world!","type":"text"}' \
    -w "\n%{http_code}")
HTTP_STATUS=$(echo "$POST_CREATE_RESPONSE" | tail -n 1)
echo "$POST_CREATE_RESPONSE" | head -n -1 | jq
if [ "$HTTP_STATUS" -ne 200 ] && [ "$HTTP_STATUS" -ne 201 ]; then
    echo -e "${RED}Failed (Status: $HTTP_STATUS)${NC}"
fi

echo -e "\n${YELLOW}Press Enter to continue...${NC}" && read

# =============================================================================
# 12. GET POST
# =============================================================================
echo -e "\n${GREEN}12. Get Post${NC}"
POST_GET_RESPONSE=$(curl -s -X GET "${BASE_URL}/api/posts/$USER_ID" \
    -H "Authorization: Bearer $USER_TOKEN" \
    -w "\n%{http_code}")
HTTP_STATUS=$(echo "$POST_GET_RESPONSE" | tail -n 1)
echo "$POST_GET_RESPONSE" | head -n -1 | jq
if [ "$HTTP_STATUS" -ne 200 ]; then
    echo -e "${RED}Failed (Status: $HTTP_STATUS)${NC}"
fi

echo -e "\n${YELLOW}Press Enter to continue...${NC}" && read

# =============================================================================
# 13. UPDATE POST
# =============================================================================
echo -e "\n${GREEN}13. Update Post${NC}"
POST_UPDATE_RESPONSE=$(curl -s -X POST "${BASE_URL}/api/posts/$USER_ID" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $USER_TOKEN" \
    -d '{"content":"This is my UPDATED post content!","type":"text"}' \
    -w "\n%{http_code}")
HTTP_STATUS=$(echo "$POST_UPDATE_RESPONSE" | tail -n 1)
echo "$POST_UPDATE_RESPONSE" | head -n -1 | jq
if [ "$HTTP_STATUS" -ne 200 ]; then
    echo -e "${RED}Failed (Status: $HTTP_STATUS)${NC}"
fi

echo -e "\n${YELLOW}Press Enter to continue...${NC}" && read

# =============================================================================
# 14. GET USER STATS
# =============================================================================
echo -e "\n${GREEN}14. Get User Stats${NC}"
STATS_RESPONSE=$(curl -s -X GET "${BASE_URL}/api/stats/$USER_ID" \
    -H "Authorization: Bearer $USER_TOKEN" \
    -w "\n%{http_code}")
HTTP_STATUS=$(echo "$STATS_RESPONSE" | tail -n 1)
echo "$STATS_RESPONSE" | head -n -1 | jq
if [ "$HTTP_STATUS" -ne 200 ]; then
    echo -e "${RED}Failed (Status: $HTTP_STATUS)${NC}"
fi

echo -e "\n${YELLOW}Press Enter to continue...${NC}" && read

# =============================================================================
# 15. CHANGE PASSCODE
# =============================================================================
echo -e "\n${GREEN}15. Change Passcode${NC}"
CHANGE_PASSCODE_RESPONSE=$(curl -s -X POST "${BASE_URL}/api/auth/change-passcode" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $USER_TOKEN" \
    -d '{"oldPasscode":"1234","newPasscode":"5678"}' \
    -w "\n%{http_code}")
HTTP_STATUS=$(echo "$CHANGE_PASSCODE_RESPONSE" | tail -n 1)
echo "$CHANGE_PASSCODE_RESPONSE" | head -n -1 | jq
if [ "$HTTP_STATUS" -ne 200 ]; then
    echo -e "${RED}Failed (Status: $HTTP_STATUS)${NC}"
fi

echo -e "\n${YELLOW}Press Enter to continue...${NC}" && read

# =============================================================================
# 16. RESET PASSCODE (Admin)
# =============================================================================
echo -e "\n${GREEN}16. Reset Passcode (Admin)${NC}"
RESET_PASSCODE_RESPONSE=$(curl -s -X POST "${BASE_URL}/api/auth/reset-passcode" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $ADMIN_TOKEN" \
    -d "{\"userId\":\"$USER_ID\",\"newPasscode\":\"1234\"}" \
    -w "\n%{http_code}")
HTTP_STATUS=$(echo "$RESET_PASSCODE_RESPONSE" | tail -n 1)
echo "$RESET_PASSCODE_RESPONSE" | head -n -1 | jq
if [ "$HTTP_STATUS" -ne 200 ]; then
    echo -e "${RED}Failed (Status: $HTTP_STATUS)${NC}"
fi

echo -e "\n${YELLOW}Press Enter to continue...${NC}" && read

# =============================================================================
# 17. DELETE IMAGE
# =============================================================================
echo -e "\n${GREEN}17. Delete Image${NC}"
if [ ! -z "$IMAGE_ID" ] && [ "$IMAGE_ID" != "null" ]; then
    DELETE_IMAGE_RESPONSE=$(curl -s -X DELETE "${BASE_URL}/api/images/$IMAGE_ID" \
        -H "Authorization: Bearer $USER_TOKEN" \
        -w "\n%{http_code}")
    HTTP_STATUS=$(echo "$DELETE_IMAGE_RESPONSE" | tail -n 1)
    echo "$DELETE_IMAGE_RESPONSE" | head -n -1 | jq
    if [ "$HTTP_STATUS" -ne 200 ]; then
        echo -e "${RED}Failed (Status: $HTTP_STATUS)${NC}"
    fi
else
    echo -e "${YELLOW}No image ID available${NC}"
fi

echo -e "\n${YELLOW}Press Enter to continue...${NC}" && read

# =============================================================================
# 18. DELETE POST
# =============================================================================
echo -e "\n${GREEN}18. Delete Post${NC}"
DELETE_POST_RESPONSE=$(curl -s -X DELETE "${BASE_URL}/api/posts/$USER_ID" \
    -H "Authorization: Bearer $USER_TOKEN" \
    -w "\n%{http_code}")
HTTP_STATUS=$(echo "$DELETE_POST_RESPONSE" | tail -n 1)
echo "$DELETE_POST_RESPONSE" | head -n -1 | jq
if [ "$HTTP_STATUS" -ne 200 ]; then
    echo -e "${RED}Failed (Status: $HTTP_STATUS)${NC}"
fi

echo -e "\n${YELLOW}Press Enter to continue...${NC}" && read

# =============================================================================
# CLEANUP
# =============================================================================
echo -e "\n${GREEN}Cleaning up test files...${NC}"
rm -f test_image*.jpg

echo -e "\n${BLUE}========================================${NC}"
echo -e "${BLUE}  TESTING COMPLETE${NC}"
echo -e "${BLUE}========================================${NC}\n"

echo -e "${YELLOW}Tokens for manual testing:${NC}"
echo -e "Admin Token: $ADMIN_TOKEN"
echo -e "User Token: $USER_TOKEN"
echo -e "User ID: $USER_ID"
echo -e "Image ID: $IMAGE_ID"