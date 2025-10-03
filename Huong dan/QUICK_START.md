# ⚡ Quick Start Guide

## 🚀 Chạy Project trong 3 bước

### Bước 1: Di chuyển vào thư mục
```bash
cd love-website
```

### Bước 2: Cài đặt dependencies (nếu chưa)
```bash
npm install
```

### Bước 3: Chạy dev server
```bash
npm run dev
```

🎉 **Done!** Mở browser và truy cập: `http://localhost:5173`

---

## 🎮 Hướng dẫn sử dụng nhanh

### Lần đầu sử dụng:

1. **Trang chủ**: Click vào icon để mở khóa
2. **Unlock**: Nhập mật khẩu `1234` (mật khẩu mặc định)
3. **Sau unlock**: Click icon menu ở góc trên để mở menu
4. **Vào Cài đặt** để:
   - Đổi mật khẩu mới (4 số)
   - Nhập tên 2 người
   - Upload hình ảnh (tối đa 8 hình, mỗi hình 1MB)
   - Viết thông điệp + ghi âm
   - Upload video (MP4, tối đa 20MB)
5. **Xem kết quả** ở các trang:
   - Hình ảnh: Gallery các hình đã upload
   - Video: Video player
   - Thông điệp: Hiển thị text + audio

---

## 📱 Test trên Mobile

### Mở trên điện thoại cùng mạng WiFi:

1. Lấy IP máy tính:
   ```bash
   # Windows
   ipconfig
   
   # Mac/Linux
   ifconfig
   ```

2. Trên điện thoại, truy cập:
   ```
   http://[YOUR_IP]:5173
   ```
   
   Ví dụ: `http://192.168.1.10:5173`

---

## 🔧 Các lệnh hữu ích

```bash
# Chạy dev server
npm run dev

# Build production
npm run build

# Preview production build
npm run preview

# Check linter
npm run lint
```

---

## 📝 Mật khẩu và dữ liệu

### Mật khẩu mặc định
- Password: `1234`
- Có thể đổi trong Cài đặt

### Reset tất cả dữ liệu
1. Mở DevTools (F12)
2. Application → Local Storage
3. Clear All
4. Refresh page

---

## 🎨 Tùy chỉnh nhanh

### Đổi màu chính
Tìm và thay trong các file `.jsx`:
- `from-pink-500` → Màu bạn muốn
- `to-purple-500` → Màu bạn muốn

### Thêm hình ảnh trang chủ
1. Đặt hình vào `src/images/`
2. Import trong component:
   ```jsx
   import myImage from '../images/my-image.jpg'
   ```

---

## 🐛 Troubleshooting

### Port đã được sử dụng
```bash
# Đổi port trong vite.config.js
export default defineConfig({
  server: {
    port: 3000
  }
})
```

### Audio recording không hoạt động
- Chỉ hoạt động trên HTTPS hoặc localhost
- Cần allow microphone permission

### LocalStorage đầy
- Xóa bớt hình ảnh/video
- Giảm chất lượng file trước khi upload

---

## 📚 Tài liệu đầy đủ

- 📖 **README.md** - Tài liệu chi tiết
- 🧪 **TESTING.md** - Hướng dẫn test
- 🚀 **DEPLOYMENT.md** - Hướng dẫn deploy
- 📋 **PROJECT_SUMMARY.md** - Tổng quan project

---

## 💡 Tips

1. **Performance**: Resize hình trước khi upload
2. **Audio**: Ghi âm ngắn gọn (< 2 phút)
3. **Video**: Compress video trước khi upload
4. **Backup**: Export localStorage thường xuyên

---

## ❤️ Enjoy!

Chúc bạn có những khoảnh khắc đẹp với Love Website! 💕

---

**Need help?** Check README.md hoặc TESTING.md

