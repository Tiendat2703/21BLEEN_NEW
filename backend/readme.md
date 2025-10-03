API Documentation for Server.js
This document provides an overview of the API endpoints available in the server.js file, designed to help frontend developers integrate with the backend. The server uses Express.js, Supabase for storage and database, and JWT for authentication. Below is a detailed guide on when and how to use each endpoint.
Base URL
The base URL for all API requests is http://localhost:3001 (or the configured PORT).
Authentication

Most endpoints require a JWT token in the Authorization header (format: Bearer <token>).
Admin-only endpoints require an admin token.
User-specific endpoints require a user token and verify ownership to ensure users can only access their own resources.

Rate Limiting

Authentication endpoints (/api/admin/login/simple, /api/auth/verify-passcode, /api/auth/change-passcode, /api/auth/reset-passcode) are limited to 5 requests per 15 minutes.
Upload endpoints (/api/upload, /api/upload/multiple, /api/upload/video) are limited to 30 requests per 15 minutes.
General endpoints are limited to 100 requests per 15 minutes.

Endpoints
Admin Endpoints
These endpoints are restricted to admin users and require an admin JWT token.
POST /api/admin/login/simple

Purpose: Authenticate an admin user to obtain an admin JWT token.
When to Use: Call this endpoint when an admin needs to log in to manage users or perform admin-specific actions.
Request Body:{
  "username": "admin_username",
  "password": "admin_password"
}


Response:
Success: { success: true, message: "Đăng nhập admin thành công", data: { token } }
Failure: { success: false, message: "Thông tin đăng nhập không đúng" } (401)


Example:curl -X POST -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"your_password"}' \
  http://localhost:3001/api/admin/login/simple



GET /api/users/all

Purpose: Retrieve a list of all users (user_id and email).
When to Use: Use when an admin needs to view all registered users, typically for management or monitoring purposes.
Requires: Admin JWT token.
Response:
Success: { success: true, data: [{ user_id, email }, ...], total }
Failure: { success: false, message: "Chỉ admin mới có quyền truy cập" } (403)


Example:curl -X GET -H "Authorization: Bearer <admin_token>" \
  http://localhost:3001/api/users/all



Authentication Endpoints
These endpoints handle user registration and authentication.
POST /api/auth/register

Purpose: Create a new user account.
When to Use: Call this endpoint when an admin wants to register a new user. Requires admin privileges.
Request Body:{
  "email": "user@example.com",
  "full_name": "User Name",
  "passcode": "1234",
  "phone": "optional_phone_number"
}


Requires: Admin JWT token.
Response:
Success: { success: true, message: "Tạo tài khoản thành công", data: { userId, user_id, email, full_name, phone, created_at } }
Failure: { success: false, message: "Email đã được sử dụng" } (400)


Example:curl -X POST -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_token>" \
  -d '{"email":"user@example.com","full_name":"User","passcode":"1234"}' \
  http://localhost:3001/api/auth/register



POST /api/auth/verify-passcode

Purpose: Verify a user's passcode to obtain a JWT token for subsequent requests.
When to Use: Call this when a user logs in to authenticate and receive a token for accessing protected endpoints.
Request Body:{
  "userId": "user_123456789_123",
  "passcode": "1234"
}


Response:
Success: { success: true, message: "Xác thực thành công", data: { user: { userId, email }, accessToken } }
Failure: { success: false, message: "Passcode không đúng" } (401)


Example:curl -X POST -H "Content-Type: application/json" \
  -d '{"userId":"user_123456789_123","passcode":"1234"}' \
  http://localhost:3001/api/auth/verify-passcode



POST /api/auth/change-passcode

Purpose: Allow a user to change their passcode.
When to Use: Use when a user wants to update their passcode for security reasons.
Request Body:{
  "oldPasscode": "1234",
  "newPasscode": "5678"
}


Requires: User JWT token.
Response:
Success: { success: true, message: "Đổi passcode thành công" }
Failure: { success: false, message: "Passcode cũ không đúng" } (401)


Example:curl -X POST -H "Content-Type: application/json" \
  -H "Authorization: Bearer <user_token>" \
  -d '{"oldPasscode":"1234","newPasscode":"5678"}' \
  http://localhost:3001/api/auth/change-passcode



POST /api/auth/reset-passcode

Purpose: Allow an admin to reset a user's passcode.
When to Use: Use when an admin needs to reset a user's passcode (e.g., if the user forgets it).
Request Body:{
  "userId": "user_123456789_123",
  "newPasscode": "5678"
}


Requires: Admin JWT token.
Response:
Success: { success: true, message: "Reset passcode thành công", data: { userId, newPasscode } }
Failure: { success: false, message: "User không tồn tại" } (404)


Example:curl -X POST -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_token>" \
  -d '{"userId":"user_123456789_123","newPasscode":"5678"}' \
  http://localhost:3001/api/auth/reset-passcode



Image Endpoints
These endpoints handle image uploads, retrieval, and deletion. All require user authentication and ownership verification.
POST /api/upload

Purpose: Upload a single image with an optional position (1-20).
When to Use: Use when a user wants to upload one image, optionally specifying its position for display order (e.g., in a gallery).
Request:
Form-data: image (file, max 5MB, JPEG/PNG/GIF/WebP), userId, position (optional, 1-20).


Requires: User JWT token.
Response:
Success: { success: true, message: "Upload thành công", data: { id, userId, url, path, size, type, position, originalName } }
Failure: { success: false, message: "Position đã được sử dụng" } (409)


Example:curl -X POST -H "Authorization: Bearer <user_token>" \
  -F "image=@photo.jpg" -F "userId=user_123456789_123" -F "position=1" \
  http://localhost:3001/api/upload



POST /api/upload/multiple

Purpose: Upload multiple images (up to 10) with optional positions.
When to Use: Use when a user wants to upload multiple images at once, optionally assigning positions to each.
Request:
Form-data: images (array of files, max 5MB each), userId, positions (JSON array or comma-separated string, e.g., [1,2,3] or 1,2,3).


Requires: User JWT token.
Response:
Success: { success: true, message: "Upload hoàn tất", data: { userId, successful: [...], failed: [...], total } }
Failure: { success: false, message: "Có position trùng lặp trong request" } (400)


Example:curl -X POST -H "Authorization: Bearer <user_token>" \
  -F "images=@photo1.jpg" -F "images=@photo2.jpg" \
  -F "userId=user_123456789_123" -F "positions=[1,2]" \
  http://localhost:3001/api/upload/multiple



GET /api/images/:userId

Purpose: Retrieve all images for a specific user, sorted by position or creation date.
When to Use: Use to display a user's image gallery, with optional sorting and pagination.
Query Parameters:
limit (default: 50)
offset (default: 0)
sortBy (default: position, alternative: created_at)


Requires: User JWT token.
Response:
Success: { success: true, data: [{ id, user_id, file_url, position, ... }], total, userId, sortedBy }
Failure: { success: false, message: "Không thể lấy danh sách ảnh" } (500)


Example:curl -X GET -H "Authorization: Bearer <user_token>" \
  http://localhost:3001/api/images/user_123456789_123?sortBy=position



GET /api/image/:imageId

Purpose: Retrieve details of a single image by its ID.
When to Use: Use to fetch metadata for a specific image (e.g., for a detailed view).
Response:
Success: { success: true, data: { id, user_id, file_url, position, ... } }
Failure: { success: false, message: "Ảnh không tìm thấy" } (404)


Example:curl -X GET http://localhost:3001/api/image/<image_id>



DELETE /api/images/:imageId

Purpose: Delete a specific image by its ID.
When to Use: Use when a user wants to remove an image from their gallery.
Requires: User JWT token.
Response:
Success: { success: true, message: "Đã xóa ảnh thành công", deletedImage: { id, userId, fileName, position } }
Failure: { success: false, message: "Không có quyền xóa ảnh này" } (403)


Example:curl -X DELETE -H "Authorization: Bearer <user_token>" \
  http://localhost:3001/api/images/<image_id>



Video Endpoints
These endpoints handle video uploads, retrieval, and deletion. Each user can have only one video, and uploading a new video replaces the existing one.
POST /api/upload/video

Purpose: Upload a single video (max 100MB, MP4/MPEG/MOV/AVI/WebM).
When to Use: Use when a user wants to upload or update their video content.
Request:
Form-data: video (file), userId, duration (optional, in seconds).


Requires: User JWT token.
Response:
Success: { success: true, message: "Upload video thành công", data: { id, userId, url, path, size, type, duration, originalName } }
Failure: { success: false, message: "Chỉ chấp nhận file video" } (400)


Example:curl -X POST -H "Authorization: Bearer <user_token>" \
  -F "video=@video.mp4" -F "userId=user_123456789_123" -F "duration=120" \
  http://localhost:3001/api/upload/video



GET /api/video/:userId

Purpose: Retrieve the video for a specific user.
When to Use: Use to display a user's video content.
Requires: User JWT token.
Response:
Success: { success: true, data: { id, user_id, file_url, ... }, userId }
Failure: { success: false, message: "Không thể lấy video" } (500)


Example:curl -X GET -H "Authorization: Bearer <user_token>" \
  http://localhost:3001/api/video/user_123456789_123



DELETE /api/video/:userId

Purpose: Delete a user's video.
When to Use: Use when a user wants to remove their video.
Requires: User JWT token.
Response:
Success: { success: true, message: "Đã xóa video thành công", deletedVideo: { id, userId, fileName } }
Failure: { success: false, message: "Video không tồn tại" } (404)


Example:curl -X DELETE -H "Authorization: Bearer <user_token>" \
  http://localhost:3001/api/video/user_123456789_123



Post Endpoints
These endpoints manage user posts (text-based content).
GET /api/posts/:userId

Purpose: Retrieve a user's post.
When to Use: Use to display a user's text content (e.g., a bio or description).
Requires: User JWT token.
Response:
Success: { success: true, data: { id, user_id, content, type, ... }, userId }
Failure: { success: false, message: "Không thể lấy post" } (500)


Example:curl -X GET -H "Authorization: Bearer <user_token>" \
  http://localhost:3001/api/posts/user_123456789_123



POST /api/posts/:userId

Purpose: Create or update a user's post.
When to Use: Use when a user wants to add or modify their text content (max 5000 characters).
Request Body:{
  "content": "This is my post content",
  "type": "text"
}


Requires: User JWT token.
Response:
Success: { success: true, message: "Tạo/Cập nhật post thành công", data, isUpdate }
Failure: { success: false, message: "Nội dung không được để trống" } (400)


Example:curl -X POST -H "Content-Type: application/json" \
  -H "Authorization: Bearer <user_token>" \
  -d '{"content":"This is my post content","type":"text"}' \
  http://localhost:3001/api/posts/user_123456789_123



DELETE /api/posts/:userId

Purpose: Delete a user's post.
When to Use: Use when a user wants to remove their text content.
Requires: User JWT token.
Response:
Success: { success: true, message: "Xóa post thành công", userId }
Failure: { success: false, message: "Lỗi khi xóa post" } (500)


Example:curl -X DELETE -H "Authorization: Bearer <user_token>" \
  http://localhost:3001/api/posts/user_123456789_123



Utility Endpoints
GET /api/stats/:userId

Purpose: Retrieve detailed statistics for a user's images and posts.
When to Use: Use to display a dashboard or summary of a user's content (e.g., total images, total size, latest activity).
Requires: User JWT token.
Response:
Success: { success: true, data: { user_id, images: { total, total_size, ... }, posts: { total, ... }, summary } }
Failure: { success: false, message: "Lỗi khi lấy thống kê" } (500)


Example:curl -X GET -H "Authorization: Bearer <user_token>" \
  http://localhost:3001/api/stats/user_123456789_123



GET /health

Purpose: Check the server's health and available features.
When to Use: Use to verify that the server is running and to get an overview of supported features and endpoints.
Response:
Success: { status: "OK", timestamp, supabase, features, endpoints }


Example:curl -X GET http://localhost:3001/health



Notes for Frontend Developers

CORS: The server allows requests from http://127.0.0.1:5500, http://localhost:5500, and http://127.0.0.1:5501. Ensure your frontend is hosted on one of these origins.
File Limits:
Images: Max 5MB, formats: JPEG, PNG, GIF, WebP.
Videos: Max 100MB, formats: MP4, MPEG, MOV, AVI, WebM.
Multiple uploads: Max 10 images at once.


Positions: Images can have positions (1-20) for ordering in galleries. Ensure positions are unique per user.
Error Handling: All responses include a success boolean and a message for error details.
Security: Inputs are sanitized, and XSS protection is enabled. Always use the provided JWT token for authenticated requests.

Example Workflow

Admin Login: Call POST /api/admin/login/simple to get an admin token.
Register User: Use the admin token to call POST /api/auth/register to create a user.
User Login: User calls POST /api/auth/verify-passcode with their userId and passcode to get a user token.
Upload Content: Use the user token to upload images (POST /api/upload or POST /api/upload/multiple), videos (POST /api/upload/video), or posts (POST /api/posts/:userId).
Retrieve Content: Fetch images (GET /api/images/:userId), videos (GET /api/video/:userId), or posts (GET /api/posts/:userId) for display.
Manage Content: Delete images (DELETE /api/images/:imageId), videos (DELETE /api/video/:userId), or posts (DELETE /api/posts/:userId) as needed.
View Stats: Use GET /api/stats/:userId to show user activity summaries.

This API is designed to support a user profile system with image galleries, video content, and text posts, with robust security and validation.