# 🚀 Hướng dẫn Deploy Love Website

## Deploy lên Vercel (Khuyến nghị)

### Bước 1: Tạo tài khoản Vercel
1. Truy cập [vercel.com](https://vercel.com)
2. Đăng ký/Đăng nhập bằng GitHub

### Bước 2: Deploy từ GitHub
```bash
# Push code lên GitHub
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### Bước 3: Import Project vào Vercel
1. Vào Vercel Dashboard
2. Click "Add New" → "Project"
3. Import GitHub repository
4. Framework Preset: Vite
5. Click "Deploy"

### Bước 4: Cấu hình (nếu cần)
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

---

## Deploy lên Netlify

### Option 1: Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build project
npm run build

# Deploy
netlify deploy --prod
```

### Option 2: Netlify Dashboard
1. Build project: `npm run build`
2. Drag & drop thư mục `dist` vào [netlify.com/drop](https://app.netlify.com/drop)

---

## Deploy lên GitHub Pages

### Bước 1: Cài đặt gh-pages
```bash
npm install --save-dev gh-pages
```

### Bước 2: Cập nhật vite.config.js
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/love-website/', // Thay bằng tên repo của bạn
})
```

### Bước 3: Thêm scripts vào package.json
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

### Bước 4: Deploy
```bash
npm run deploy
```

### Bước 5: Cấu hình GitHub Pages
1. Vào Settings → Pages
2. Source: gh-pages branch
3. Save

---

## Deploy lên Firebase Hosting

### Bước 1: Install Firebase CLI
```bash
npm install -g firebase-tools
firebase login
```

### Bước 2: Khởi tạo Firebase
```bash
firebase init hosting
```

Chọn:
- Hosting: Configure files for Firebase Hosting
- Public directory: `dist`
- Single-page app: `Yes`
- Automatic builds: `No`

### Bước 3: Build và Deploy
```bash
npm run build
firebase deploy
```

---

## Self-hosting với Node.js

### Bước 1: Build project
```bash
npm run build
```

### Bước 2: Serve với serve
```bash
npm install -g serve
serve -s dist -p 3000
```

### Bước 3: Setup PM2 (Production)
```bash
npm install -g pm2
pm2 serve dist 3000 --name love-website --spa
pm2 save
pm2 startup
```

---

## Environment Variables (Nếu cần)

Tạo file `.env` (không cần cho project này):
```
VITE_API_URL=https://your-api.com
```

Truy cập trong code:
```javascript
const apiUrl = import.meta.env.VITE_API_URL
```

---

## Checklist trước khi Deploy

- [ ] Test trên localhost (`npm run dev`)
- [ ] Build thành công (`npm run build`)
- [ ] Test production build (`npm run preview`)
- [ ] Kiểm tra responsive trên mobile
- [ ] Test tất cả chức năng
- [ ] Kiểm tra localStorage hoạt động
- [ ] Test audio recording (chỉ hoạt động trên HTTPS)
- [ ] Tối ưu hình ảnh nếu cần
- [ ] Update Figma links trong README
- [ ] Cập nhật repository URL

---

## Domain Custom (Optional)

### Vercel
1. Vào Project Settings → Domains
2. Thêm domain của bạn
3. Cập nhật DNS records

### Netlify
1. Site Settings → Domain Management
2. Add custom domain
3. Configure DNS

---

## SSL Certificate

Tất cả các platform trên đều cung cấp SSL certificate miễn phí:
- ✅ Vercel: Tự động
- ✅ Netlify: Tự động
- ✅ GitHub Pages: Tự động
- ✅ Firebase: Tự động

---

## Performance Tips

1. **Optimize Images**
   - Resize trước khi upload
   - Sử dụng WebP format
   - Lazy loading

2. **Code Splitting**
   - React.lazy() cho routes
   - Dynamic imports

3. **Caching**
   - Service Workers
   - Browser caching headers

4. **Compression**
   - Enable Gzip/Brotli
   - Minify assets

---

## Monitoring & Analytics (Optional)

### Google Analytics
```bash
npm install react-ga4
```

### Vercel Analytics
```bash
npm install @vercel/analytics
```

---

## Troubleshooting

### Issue: Blank page sau deploy
- Kiểm tra `base` trong vite.config.js
- Kiểm tra console errors
- Verify build output

### Issue: Routing không hoạt động
- Configure server cho SPA
- Add `_redirects` (Netlify) hoặc `vercel.json`

### Issue: Audio recording không hoạt động
- Chỉ hoạt động trên HTTPS
- Yêu cầu microphone permission

---

**Happy Deploying! 🚀**

