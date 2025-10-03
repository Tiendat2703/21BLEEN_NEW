# Interactive Love Website - Project Documentation

## 🎉 Project Overview

This is a fully responsive React web application built with Vite, React Router, and Tailwind CSS. The application features a password-protected experience with image gallery, video player, audio messages, and customizable settings.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation & Running

```bash
# Navigate to project directory
cd love-website

# Install dependencies (if not already done)
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

## 🔑 Default Settings

- **Default Password**: `0000` (if no custom password is set)
- You can change the password in the Settings page after unlocking

## 📱 Application Flow

### 1. Initial Landing Page (`/`)
- Displays the main logo
- Click the fingerprint icon to proceed to unlock page

### 2. Unlock Page (`/unlock`)
- Enter 4-digit PIN to unlock
- Default PIN: `0000`
- Incorrect attempts show "Sai mật khẩu" error

### 3. Home After Unlock (`/home`)
- Main content page with image gallery preview
- Click "Cùng xem nhé!" button to go to Messages
- Hamburger menu opens navigation sidebar

### 4. Menu Sidebar
- **TRANG CHỦ**: Return to home
- **HÌNH ẢNH**: View image gallery
- **VIDEO**: Watch uploaded video
- **THÔNG ĐIỆP**: Read message and play audio
- **CÀI ĐẶT**: Configure application settings

### 5. Settings Page (`/settings`)

#### 5.1 Password Section
- Create/update 4-digit PIN
- Toggle show/hide password
- Must be exactly 4 digits

#### 5.2 Information Section
- Add profile images for two people
- Enter names (no numbers or special characters allowed)
- Names must be unique
- Images display in Messages page

#### 5.3 Image Upload Section
- Upload up to 8 images
- Max size: 1MB per image
- Supported formats: JPG, PNG, GIF, WEBP
- Images appear in gallery with polaroid style

#### 5.4 Message Section
- Write text message (up to 1000 characters)
- Record audio message (up to 3 minutes)
- Play recorded audio before saving
- Clear with "Hoàn tác" button

#### 5.5 Video Upload Section
- Upload one video file
- Max size: 20MB
- Format: MP4 only
- Preview before saving

### 6. Images Page (`/images`)
- Polaroid-style photo gallery
- Vertical scrollable layout
- Click to view fullscreen
- Shows uploaded images from Settings

### 7. Video Page (`/video`)
- Video player with controls
- Click play button to start
- Fullscreen support
- Shows uploaded video from Settings

### 8. Messages Page (`/messages`)
- Display saved text message
- Audio waveform visualization
- Play/pause audio with control button
- Shows profile avatars from Settings

## 🎨 Design Specifications

### Color Palette
- **Primary Teal**: `#17B3C1` - Main brand color
- **Light Mint**: `#D9FFE8` - Light backgrounds
- **Accent Green**: `#58D0B5` - Accent elements
- **Off White**: `#F4FFF8` - Main background

### Typography
- **Headings**: Coiny (display font)
- **Body Text**: Quicksand (sans-serif)

### Responsive Design
- Mobile: Optimized for touch interactions
- Tablet: Adaptive layouts
- Desktop: Fixed sidebar widths

## 💾 Data Storage

All data is stored in browser's localStorage:
- Password (4-digit PIN)
- Person 1 & 2 information (names + images)
- Uploaded images (up to 8)
- Text message
- Audio recording
- Video file

**Note**: Large files (especially video) may exceed localStorage limits in some browsers. Consider file size carefully.

## 🔒 Validation Rules

### Password
- ✅ Exactly 4 digits
- ❌ Cannot be empty
- ❌ No letters or special characters

### Names
- ✅ Letters and spaces only
- ❌ No numbers
- ❌ No special characters
- ❌ Must be unique between Person 1 & 2

### Images
- ✅ Max 1MB per image
- ✅ Max 8 images total
- ✅ JPG, PNG, GIF, WEBP formats

### Video
- ✅ Max 20MB
- ✅ MP4 format only

### Audio
- ✅ Max 3 minutes recording
- ✅ WebM/WAV format

## 🛠️ Technology Stack

- **Framework**: React 19
- **Build Tool**: Vite
- **Routing**: React Router DOM v7
- **Styling**: Tailwind CSS v3
- **Audio**: MediaRecorder API
- **Storage**: localStorage API

## 📂 Project Structure

```
love-website/
├── src/
│   ├── components/
│   │   ├── HomePage.jsx           # Initial landing page
│   │   ├── UnlockPage.jsx         # Password entry
│   │   ├── HomeAfterUnlock.jsx    # Main content page
│   │   ├── MenuSidebar.jsx        # Navigation menu
│   │   ├── Header.jsx             # Shared header
│   │   ├── SettingsPage.jsx       # Settings container
│   │   ├── ImagesPage.jsx         # Image gallery
│   │   ├── VideoPage.jsx          # Video player
│   │   ├── MessagesPage.jsx       # Messages display
│   │   └── settings/
│   │       ├── PasswordSection.jsx
│   │       ├── InfoSection.jsx
│   │       ├── ImageUploadSection.jsx
│   │       ├── MessageSection.jsx
│   │       └── VideoUploadSection.jsx
│   ├── utils/
│   │   └── localStorage.js        # Storage utilities
│   ├── images/                    # All image assets
│   ├── App.jsx                    # Main app with routing
│   ├── main.jsx                   # Entry point
│   └── index.css                  # Global styles
├── tailwind.config.js
├── vite.config.js
└── package.json
```

## 🐛 Troubleshooting

### Development Server Won't Start
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Images Not Loading
- Check that images are in `src/images/` folder
- Verify file paths in import statements
- Ensure image file names match exactly

### Audio Recording Not Working
- Browser must support MediaRecorder API
- Grant microphone permissions when prompted
- Use HTTPS in production for security

### Video Won't Play
- Verify video is MP4 format
- Check file size is under 20MB
- Some browsers have codec limitations

### localStorage Full
- Clear browser data for the site
- Reduce image/video sizes
- Use smaller resolution media files

## 📱 Browser Support

- ✅ Chrome/Edge (Chromium) - Recommended
- ✅ Firefox
- ✅ Safari (iOS 14.5+)
- ⚠️ Internet Explorer - Not supported

## 🎯 Key Features

- ✨ Pixel-perfect responsive design
- 🔐 Password protection with custom PIN
- 📸 Image gallery with lightbox
- 🎥 Video player with controls
- 🎙️ Audio recording and playback
- 💾 Persistent data storage
- 🎨 Beautiful custom UI components
- 📱 Mobile-first design approach
- ⚡ Fast Vite build system
- 🌈 Custom color scheme

## 📄 License

This project is private and intended for personal use.

## 👥 Support

For issues or questions, refer to the documentation in the `Huong dan/` folder.

---

**Built with ❤️ using React + Vite + Tailwind CSS**











