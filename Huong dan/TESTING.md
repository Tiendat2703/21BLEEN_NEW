# 🧪 Testing Guide - Love Website

## Testing Checklist

### ✅ Navigation Flow Testing

#### 1. HomePage → UnlockPage
- [ ] Click vào vector icon ở HomePage
- [ ] Được redirect đến `/unlock`
- [ ] UnlockPage hiển thị đúng

#### 2. UnlockPage → HomeAfterUnlock
- [ ] Nhập password đúng (1234)
- [ ] Được redirect đến `/home`
- [ ] HomeAfterUnlock hiển thị đúng

#### 3. UnlockPage - Wrong Password
- [ ] Nhập password sai
- [ ] Hiển thị error "Sai mật khẩu"
- [ ] Input được clear
- [ ] Vẫn ở trang unlock

#### 4. Menu Sidebar Toggle
- [ ] Click menu icon → Sidebar mở
- [ ] Click lại menu icon → Sidebar đóng
- [ ] Click overlay → Sidebar đóng
- [ ] Click close button → Sidebar đóng

#### 5. Menu Navigation
- [ ] "Trang chủ" → Navigate to /home
- [ ] "Hình ảnh" → Navigate to /images
- [ ] "Video" → Navigate to /video
- [ ] "Thông điệp" → Navigate to /messages
- [ ] "Cài đặt" → Navigate to /settings

---

### ✅ Settings Page Testing

#### 5.1 Create Password Section
- [ ] Chỉ chấp nhận số (0-9)
- [ ] Tối đa 4 ký tự
- [ ] Không cho phép nhập chữ
- [ ] Click "Lưu mật khẩu" → Hiển thị "Lưu thành công"
- [ ] Password được lưu vào localStorage
- [ ] Test unlock với password mới

#### 5.2 Fill Information Section
- [ ] Nhập tên có số → Hiển thị error
- [ ] Nhập tên có ký tự đặc biệt → Hiển thị error
- [ ] Nhập 2 tên giống nhau → Hiển thị error
- [ ] Để trống field → Hiển thị error
- [ ] Nhập tên hợp lệ → "Lưu thành công"
- [ ] Data được lưu vào localStorage

#### 5.3 Upload Images Section
**File Size Testing:**
- [ ] Upload hình < 1MB → Success
- [ ] Upload hình > 1MB → Hiển thị error
- [ ] Upload nhiều hình cùng lúc

**Quantity Testing:**
- [ ] Upload 1-7 hình → Success
- [ ] Upload hình thứ 8 → Success
- [ ] Upload hình thứ 9 → Hiển thị error "Tối đa 8 hình ảnh"
- [ ] Button "Chọn hình ảnh" disabled khi đã có 8 hình

**UI Testing:**
- [ ] Preview hình sau upload
- [ ] Click X để xóa hình
- [ ] Click "Lưu hình ảnh" → "Lưu thành công"
- [ ] Images được lưu vào localStorage

#### 5.4 Message Section
**Text Input:**
- [ ] Nhập text vào textarea
- [ ] Text hiển thị đúng
- [ ] Xuống dòng hoạt động

**Audio Recording:**
- [ ] Click "Bắt đầu ghi âm"
- [ ] Browser request microphone permission
- [ ] Button chuyển sang "Dừng ghi âm" với animation
- [ ] Click "Dừng ghi âm"
- [ ] Audio player hiển thị
- [ ] Playback audio hoạt động

**Reset Function:**
- [ ] Nhập text + ghi âm
- [ ] Click "Hoàn tác"
- [ ] Text được clear
- [ ] Audio được xóa
- [ ] Form về trạng thái ban đầu

**Save Function:**
- [ ] Click "Lưu thông điệp" → "Lưu thành công"
- [ ] Text được lưu vào localStorage
- [ ] Audio được lưu vào localStorage

#### 5.5 Upload Video Section
**File Type Testing:**
- [ ] Upload file MP4 → Success
- [ ] Upload file MOV → Hiển thị error
- [ ] Upload file AVI → Hiển thị error
- [ ] Upload file không phải video → Error

**File Size Testing:**
- [ ] Upload video < 20MB → Success
- [ ] Upload video > 20MB → Hiển thị "Không thể tải video"

**UI Testing:**
- [ ] Video preview hiển thị
- [ ] Video controls hoạt động
- [ ] Click "Lưu video" → "Lưu thành công"
- [ ] Video được lưu vào localStorage

---

### ✅ Images Page Testing

#### Empty State
- [ ] Chưa có hình → Hiển thị empty state
- [ ] Message "Chưa có hình ảnh nào"
- [ ] Button "Đi đến Cài đặt" hoạt động

#### With Images
- [ ] Gallery hiển thị đúng layout
- [ ] Grid responsive
- [ ] Hover effect trên mỗi hình
- [ ] Click hình → Modal full size mở
- [ ] Modal:
  - [ ] Hình hiển thị full size
  - [ ] Click overlay → Đóng modal
  - [ ] Click X → Đóng modal
  - [ ] Click hình → Không đóng modal

#### Back Button
- [ ] Click "Quay lại" → Navigate to /home

---

### ✅ Video Page Testing

#### Empty State
- [ ] Chưa có video → Hiển thị empty state
- [ ] Message "Chưa có video nào"
- [ ] Button "Đi đến Cài đặt" hoạt động

#### With Video
- [ ] Video player hiển thị
- [ ] Video controls hoạt động:
  - [ ] Play/Pause
  - [ ] Volume
  - [ ] Fullscreen
  - [ ] Timeline scrubbing
- [ ] Video responsive

#### Back Button
- [ ] Click "Quay lại" → Navigate to /home

---

### ✅ Messages Page Testing

#### Empty State
- [ ] Chưa có message → Hiển thị empty state
- [ ] Message "Chưa có thông điệp nào"
- [ ] Button "Đi đến Cài đặt" hoạt động

#### With Message
**Text Message:**
- [ ] Text hiển thị đúng
- [ ] Xuống dòng preserved
- [ ] Styling đẹp

**Audio Message:**
- [ ] Audio player hiển thị
- [ ] Play/Pause hoạt động
- [ ] Volume control hoạt động

**Person Names:**
- [ ] Nếu đã set tên → Hiển thị "Name1 ❤️ Name2"
- [ ] Nếu chưa set → Hiển thị "Thông điệp yêu thương"

#### Back Button
- [ ] Click "Quay lại" → Navigate to /home

---

### ✅ LocalStorage Testing

#### Data Persistence
- [ ] Set password → Refresh → Password vẫn còn
- [ ] Save person names → Refresh → Names vẫn còn
- [ ] Upload images → Refresh → Images vẫn còn
- [ ] Save message → Refresh → Message vẫn còn
- [ ] Upload video → Refresh → Video vẫn còn

#### Clear Data
- [ ] Open DevTools → Application → LocalStorage
- [ ] Clear các key
- [ ] Refresh page
- [ ] Test lại từ đầu

---

### ✅ Responsive Design Testing

#### Mobile (< 640px)
- [ ] HomePage layout đúng
- [ ] UnlockPage input responsive
- [ ] Menu sidebar full width
- [ ] Settings form stacked vertically
- [ ] Images grid 1-2 columns
- [ ] Video player full width
- [ ] Messages card full width

#### Tablet (640px - 1024px)
- [ ] Layout điều chỉnh đúng
- [ ] Images grid 2-3 columns
- [ ] Text sizes phù hợp
- [ ] Spacing hợp lý

#### Desktop (> 1024px)
- [ ] Max-width containers centered
- [ ] Images grid 4 columns
- [ ] Typography scale up
- [ ] Hover effects hoạt động

#### Device Testing
- [ ] iPhone SE (375px)
- [ ] iPhone 12/13 (390px)
- [ ] iPad (768px)
- [ ] Desktop (1920px)

#### Orientation
- [ ] Portrait mode
- [ ] Landscape mode

---

### ✅ Browser Compatibility Testing

#### Desktop Browsers
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

#### Mobile Browsers
- [ ] Chrome Mobile
- [ ] Safari iOS
- [ ] Firefox Mobile
- [ ] Samsung Internet

---

### ✅ Performance Testing

#### Load Time
- [ ] Initial load < 3s
- [ ] Page transitions smooth
- [ ] No layout shifts

#### File Upload
- [ ] Image upload < 2s
- [ ] Video upload progress indicator
- [ ] No freezing during upload

#### LocalStorage
- [ ] Data save instant
- [ ] Data load instant
- [ ] No memory leaks

---

### ✅ Accessibility Testing

#### Keyboard Navigation
- [ ] Tab through inputs
- [ ] Enter to submit forms
- [ ] Esc to close modal/sidebar

#### Screen Reader
- [ ] Alt text on images
- [ ] Labels on inputs
- [ ] Semantic HTML

#### Color Contrast
- [ ] Text readable
- [ ] Buttons clear
- [ ] Error messages visible

---

### ✅ Error Handling Testing

#### Network Errors
- [ ] Offline mode
- [ ] Slow connection
- [ ] Failed requests

#### User Errors
- [ ] Invalid inputs
- [ ] Missing required fields
- [ ] File size/type errors

#### Edge Cases
- [ ] Extremely long text
- [ ] Special characters in names
- [ ] Multiple rapid clicks
- [ ] Browser back/forward

---

### ✅ Security Testing

#### LocalStorage
- [ ] No sensitive data exposed
- [ ] XSS protection
- [ ] Data sanitization

#### File Upload
- [ ] File type validation
- [ ] File size limits
- [ ] No executable files

---

## 🐛 Bug Report Template

Khi phát hiện bug, ghi lại:

```
**Bug Description:**
[Mô tả bug]

**Steps to Reproduce:**
1. 
2. 
3. 

**Expected Behavior:**
[Hành vi mong đợi]

**Actual Behavior:**
[Hành vi thực tế]

**Screenshots:**
[Nếu có]

**Environment:**
- Browser: 
- Device: 
- OS: 

**Console Errors:**
[Copy từ DevTools]
```

---

## ✅ Pre-deployment Checklist

- [ ] All features tested
- [ ] No console errors
- [ ] No linter warnings
- [ ] Responsive on all devices
- [ ] Cross-browser tested
- [ ] Performance optimized
- [ ] README updated
- [ ] Code commented
- [ ] Git committed
- [ ] Ready to deploy! 🚀

---

**Happy Testing! 🧪**

