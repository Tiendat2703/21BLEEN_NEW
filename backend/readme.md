# 📘 API Documentation - Hướng Dẫn Sử Dụng Cho Frontend

## 🎯 Tổng Quan Hệ Thống

API này quản lý **ảnh** và **bài viết** của user với hệ thống xác thực 2 cấp:
- **Admin**: Tạo tài khoản user
- **User**: Quản lý ảnh và bài viết của chính mình

---

## 🔐 Luồng Hoạt Động

```
1. Admin login → Nhận adminToken
2. Admin tạo user → Nhận userId + passcode (gửi cho user)
3. User login bằng userId + passcode → Nhận userToken
4. User dùng userToken để upload ảnh, tạo post, xem thống kê
```

---

## 🔑 Authentication APIs

### 1️⃣ Admin Login
**Mục đích:** Admin đăng nhập để tạo tài khoản cho user

```javascript
POST /api/admin/login/simple

Body: {
  username: "admin",
  password: "admin_password"
}

→ Nhận adminToken để tạo user
```

### 2️⃣ Tạo User (Chỉ Admin)
**Mục đích:** Admin tạo tài khoản mới cho user, user sẽ nhận userId và passcode

```javascript
POST /api/auth/register
Headers: Authorization: Bearer {adminToken}

Body: {
  email: "user@example.com",
  full_name: "Nguyen Van A",
  passcode: "1234",    // 4-6 ký tự
  phone: "0912345678"  // optional
}

→ Nhận userId (vd: user_1234567890_123)
→ Admin gửi userId + passcode cho user
```

### 3️⃣ User Login
**Mục đích:** User xác thực bằng userId và passcode để lấy token

```javascript
POST /api/auth/verify-passcode

Body: {
  userId: "user_1234567890_123",  // hoặc "123"
  passcode: "1234"
}

→ Nhận userToken để sử dụng các API khác
```

### 4️⃣ Xem Tất Cả Users (Admin)
**Mục đích:** Admin xem danh sách tất cả user trong hệ thống

```javascript
GET /api/users/all
Headers: Authorization: Bearer {adminToken}

→ Nhận danh sách user_id và email
```

---

## 🖼️ Image APIs (Cần userToken)

### 1️⃣ Upload 1 Ảnh
**Mục đích:** User upload 1 ảnh với vị trí (position) trong khung ảnh

```javascript
POST /api/upload
Headers: Authorization: Bearer {userToken}

FormData: {
  image: File,           // JPEG/PNG/GIF/WebP, max 5MB
  userId: "user_123",
  position: 1            // Số từ 1-20, optional (vị trí trong khung 20 ô)
}

→ Nhận URL ảnh và thông tin
```

**Use case:** Upload avatar, ảnh đại diện vào vị trí cụ thể trong grid 20 ô

### 2️⃣ Upload Nhiều Ảnh
**Mục đích:** User upload nhiều ảnh cùng lúc, mỗi ảnh có position riêng

```javascript
POST /api/upload/multiple
Headers: Authorization: Bearer {userToken}

FormData: {
  images: File[],              // Max 10 files
  userId: "user_123",
  positions: "[1,2,3,null,5]"  // JSON string, null = không gán position
}

→ Nhận kết quả từng ảnh (thành công/thất bại)
```

**Use case:** Upload album ảnh, gallery với nhiều ảnh cùng lúc

### 3️⃣ Xem Ảnh Của User
**Mục đích:** Lấy tất cả ảnh của 1 user, sắp xếp theo position

```javascript
GET /api/images/:userId?limit=50&offset=0&sortBy=position
Headers: Authorization: Bearer {userToken}

→ Nhận danh sách ảnh (sorted by position hoặc created_at)
```

**Use case:** Hiển thị gallery, danh sách ảnh trong profile

### 4️⃣ Xem Chi Tiết 1 Ảnh
**Mục đích:** Lấy thông tin chi tiết của 1 ảnh

```javascript
GET /api/image/:imageId

→ Nhận URL, size, type, position của ảnh
```

**Use case:** Xem chi tiết ảnh, download ảnh

### 5️⃣ Xóa Ảnh
**Mục đích:** User xóa ảnh của chính mình

```javascript
DELETE /api/images/:imageId
Headers: Authorization: Bearer {userToken}

→ Xóa ảnh khỏi storage và database
```

**Use case:** Xóa ảnh không muốn giữ

---

## 📄 Post APIs (Cần userToken)

### 1️⃣ Xem Bài Viết
**Mục đích:** Lấy bài viết (1 user chỉ có 1 bài viết duy nhất)

```javascript
GET /api/posts/:userId
Headers: Authorization: Bearer {userToken}

→ Nhận nội dung bài viết hoặc null nếu chưa có
```

**Use case:** Hiển thị bio, giới thiệu bản thân trong profile

### 2️⃣ Tạo/Cập Nhật Bài Viết
**Mục đích:** Tạo mới hoặc cập nhật bài viết (tự động update nếu đã có)

```javascript
POST /api/posts/:userId
Headers: Authorization: Bearer {userToken}

Body: {
  content: "Xin chào, đây là bài viết của tôi...",  // Max 5000 ký tự
  type: "text"  // optional
}

→ Tạo mới nếu chưa có, update nếu đã có
```

**Use case:** Viết bio, mô tả bản thân, giới thiệu

### 3️⃣ Xóa Bài Viết
**Mục đích:** Xóa bài viết của user

```javascript
DELETE /api/posts/:userId
Headers: Authorization: Bearer {userToken}

→ Xóa bài viết
```

**Use case:** Xóa bio/giới thiệu

---

## 📊 Utility APIs

### 1️⃣ Thống Kê User
**Mục đích:** Xem thống kê ảnh và bài viết của user

```javascript
GET /api/stats/:userId
Headers: Authorization: Bearer {userToken}

→ Nhận:
  - Tổng số ảnh, dung lượng ảnh
  - Số ảnh có position, không có position
  - Tổng số bài viết, độ dài content
  - Thời gian hoạt động gần nhất
```

**Use case:** Dashboard, profile overview, quản lý storage

### 2️⃣ Health Check
**Mục đích:** Kiểm tra server hoạt động, xem danh sách API

```javascript
GET /health

→ Nhận status server + danh sách endpoints
```

**Use case:** Debug, kiểm tra kết nối

---

## ⚡ Rate Limits

- **Admin login**: 5 requests / 15 phút
- **User login**: 5 requests / 15 phút
- **Upload**: 30 requests / 15 phút
- **General**: 100 requests / 15 phút

---

## 🎨 Use Cases Thực Tế

### 1. Trang Profile Cá Nhân
```
- GET /api/images/:userId → Hiển thị gallery ảnh
- GET /api/posts/:userId → Hiển thị bio
- GET /api/stats/:userId → Hiển thị số lượng ảnh
```

### 2. Upload Ảnh Đại Diện
```
- POST /api/upload với position=1 → Upload avatar vào vị trí 1
```

### 3. Upload Album Ảnh
```
- POST /api/upload/multiple với positions=[1,2,3,4,5] → Upload 5 ảnh vào grid
```

### 4. Quản Lý Ảnh
```
- GET /api/images/:userId → Xem tất cả ảnh
- DELETE /api/images/:imageId → Xóa ảnh không cần
```

### 5. Admin Dashboard
```
- GET /api/users/all → Xem danh sách user
- POST /api/auth/register → Tạo user mới
```

---

## 🔒 Bảo Mật

- ✅ JWT authentication (token hết hạn sau 2h)
- ✅ Rate limiting
- ✅ Input validation & sanitization
- ✅ XSS protection
- ✅ Ownership check (user chỉ xem/sửa/xóa của mình)
- ✅ Admin chỉ tạo user, user tự quản lý ảnh và post

---

## 📝 Lưu Ý Quan Trọng

1. **Position**: Số từ 1-20 để đặt ảnh vào grid/khung cố định
2. **userId format**: Hỗ trợ `"123"` hoặc `"user_1234567890_123"`
3. **1 user = 1 post**: Mỗi user chỉ có 1 bài viết, POST sẽ tự động update
4. **Token**: Admin token ≠ User token, không dùng nhầm
5. **Ownership**: User chỉ truy cập data của chính mình
6. **File size**: Max 5MB/ảnh, max 10 ảnh/lần

---

## 🚀 Base URL
```
http://localhost:3001
```

## 🔗 CORS
Cho phép từ:
- `http://127.0.0.1:5500`
- `http://localhost:5500`
- `http://127.0.0.1:5501`