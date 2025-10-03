# Project Requirements: Interactive Love Website

## Overview
Create a fully responsive web application using React, JSX, and Tailwind CSS that works seamlessly on Android, iOS, laptop, and PC. The design must be pixel-perfect according to the Figma designs provided.

## Design Requirements
- Follow the Figma link designs EXACTLY as specified in README.md order
- Match all measurements in pixels precisely
- DO NOT add or remove ANY design elements from the Figma
- Download all images and store them in an `images/` folder
- Use ONLY Tailwind core utility classes (no custom configurations)

### Design Assets to Extract from Figma
**IMPORTANT**: Download ALL assets from Figma and save to `src/images/` folder before starting development.

#### Logos & Icons (From images folder)
**File Structure:**
```
src/
└── images/
    ├── logo-chinh.png (or .svg)     # Logo Chính - Main Logo: "21 Bleen Studio" logo with star
    ├── logo-phu.png (or .svg)       # Logo Phụ - Secondary Logo: "21 Bleen STUDIO" white version
    ├── bieu-tuong.png (or .svg)     # Biểu Tượng - Four-point star icon
    ├── vector.svg                    # Icon for home page click action
    ├── vector-1.svg                  # Icon for menu toggle (vector (1).svg)
    └── [other-icons].svg             # Any other icons used in navigation and UI
```

**Usage in Code:**
```jsx
// Import logos and icons
import logoChinh from '../images/logo-chinh.png';
import logoPhu from '../images/logo-phu.png';
import bieuTuong from '../images/bieu-tuong.png';
import vectorIcon from '../images/vector.svg';
import vectorMenuIcon from '../images/vector-1.svg';

// Use in components
<img src={logoChinh} alt="21 Bleen Studio Logo" />
<img src={logoPhu} alt="21 Bleen Studio Secondary Logo" />
<img src={bieuTuong} alt="Star Icon" />
```

#### Color Palette (Tone Màu)
```css
/* Primary Colors */
--primary-teal: #17B3C1;      /* Main brand color */
--light-mint: #D9FFE8;         /* Light background */
--accent-green: #58D0B5;       /* Accent color */
--white: #F4FFF8;              /* Off-white background */

/* Use these exact hex codes in Tailwind */
```

**Tailwind Configuration** (add to `tailwind.config.js`):
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        'primary-teal': '#17B3C1',
        'light-mint': '#D9FFE8',
        'accent-green': '#58D0B5',
        'off-white': '#F4FFF8',
      },
    },
  },
}
```

#### Typography (Font)
**Font Tiêu Đề** (Heading Font):
- Font Family: **Coiny**
- Usage: Main headings, logo text, titles
- Import: `@import url('https://fonts.googleapis.com/css2?family=Coiny&display=swap');`

**Font Trung Gian** (Body Font):
- Font Family: **Quicksand**
- Usage: Body text, paragraphs, descriptions
- Import: `@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap');`

**Font Configuration** (add to your CSS):
```css
@import url('https://fonts.googleapis.com/css2?family=Coiny&family=Quicksand:wght@300;400;500;600;700&display=swap');

/* Apply fonts */
h1, h2, h3, .heading {
  font-family: 'Coiny', cursive;
}

body, p, span, .body-text {
  font-family: 'Quicksand', sans-serif;
}
```

## Technical Stack
- React (functional components with hooks)
- JSX
- Tailwind CSS (core utilities only)
- Responsive design for all devices (mobile, tablet, desktop)

## Page Structure & Navigation Flow

### 1. Home Page (Initial Landing)
**Functionality:**
- Display the main landing page design from Figma
- Layout: Vertical centered design with logo at top and fingerprint icon at bottom
- **Logo Section (Top Center)**:
  - Display "21 Bleen STUDIO" logo with decorative star background
  - Logo should be centered horizontally and positioned in upper-middle area
  - Use `logo-chinh.png` from `src/images/Home Page (Initial Landing)/`
- **Fingerprint Icon (Bottom Center)**:
  - Display fingerprint/touch icon (`vector.svg`) at bottom of screen
  - Icon should be clickable and centered horizontally
  - Add subtle hover effect to indicate interactivity
- **Background**: Light mint/off-white color (#F4FFF8 or #D9FFE8)
- When user clicks on fingerprint icon (`vector.svg`) → Navigate to Unlock Page
- Ensure responsive design: logo and icon maintain proper spacing on all screen sizes

### 2. Unlock Page
**Functionality:**
- Display password input form with custom numeric keypad
- **Header Section (Top)**:
  - Title: "Nhập mật khẩu để mở khóa" (teal color #17B3C1, Coiny font)
  - Subtitle: "Khoá này mở ra điều kỳ diệu!" (smaller text, lighter teal)
- **Password Indicator (Center Top)**:
  - Display 4 circular indicators (empty circles)
  - As user enters each digit, fill the corresponding circle
  - Circles should be arranged horizontally in a row
  - Use teal outline for empty, filled teal for entered digits
- **Number Keypad (Center)**:
  - 3x4 grid layout of circular buttons
  - Numbers 1-9 arranged in 3 rows (1-2-3, 4-5-6, 7-8-9)
  - Bottom row: "0" (center) and "×" delete button (right)
  - Each button: light mint background (#D9FFE8), teal text (#17B3C1)
  - Button size: large circular buttons with numbers centered
  - Add hover and active states for better UX
- **Background**: Light off-white (#F4FFF8)
- **Spacing**: Adequate padding between title, indicators, and keypad

**Password Validation Logic:**
- Password must be EXACTLY 4 digits
- When user enters 4th digit, automatically validate:
  - **If correct password**: Navigate to Home Page (After Unlock)
  - **If incorrect password**: 
    - Clear all 4 indicator circles
    - Display error message "Sai mật khẩu" (red color) below indicators
    - Allow user to re-enter password
    - Keep user on unlock page until correct password is entered
- "×" button clears the last entered digit
- User cannot enter more than 4 digits

**Responsive Design:**
- Maintain proper spacing on mobile devices
- Ensure buttons are large enough for touch interaction
- Stack elements vertically with appropriate margins

### 3. Home Page (After Unlock)
**Functionality:**
- Display main content page after successful unlock
- **Header Section (Top)**:
  - Left: "21 Bleen STUDIO" logo (smaller size)
  - Right: Hamburger menu icon (three horizontal lines) - teal color
  - Background: Light off-white
  - Fixed position header with shadow/border
- **Main Content (Center)**:
  - Decorative star icons in corners (light mint color)
  - Large rounded rectangle frame containing main image
  - Image: Birthday cake with candles (or placeholder image)
  - Play button overlay (teal circle with white play icon) centered on image
  - Curved text above image: "Nương khoảnh khắc hạnh phúc" (teal color, follows arc path)
  - Frame should have subtle shadow and rounded corners
- **Image Gallery Preview (Below Main Image)**:
  - Display 3 small rounded square thumbnails in a horizontal row
  - Each thumbnail: small preview images with rounded corners
  - Equal spacing between thumbnails
  - Thumbnails should be clickable to view full images
- **Call-to-Action Button (Bottom)**:
  - Large oval/pill-shaped button with text "Cùng xem nhé!"
  - Background: Teal color (#17B3C1)
  - Text: White, Coiny font
  - Centered horizontally
  - Add hover effect (slightly darker teal)
  - **When clicked**: Navigate to Messages Page
- **Background**: Light off-white (#F4FFF8) with decorative star elements
- **Menu Toggle Functionality**:
  - When user clicks on hamburger menu icon:
    - **First click**: Show Menu Sidebar (slide in from right or left)
    - **Second click**: Hide Menu Sidebar (slide out)
    - Toggle behavior for smooth UX

**Responsive Design:**
- Header stays fixed at top on scroll
- Main image scales proportionally on different screen sizes
- Thumbnails adjust size but maintain aspect ratio
- Button remains centered and accessible
- Ensure proper touch targets for mobile

### 4. Menu Sidebar
**Design & Layout:**
- **Position**: Slide in from right side of screen (or left, based on design preference)
- **Width**: Approximately 60-70% of screen width on mobile, fixed width (250-300px) on desktop
- **Background**: Light off-white (#F4FFF8)
- **Header Section (Top)**:
  - "21 Bleen" logo with small star icon
  - Centered horizontally
  - Add padding/margin from top
- **Menu Items List**:
  - Vertical list of navigation items
  - Each item has:
    - Text in uppercase (Coiny font)
    - Teal color (#17B3C1)
    - Underline/border separator (thin teal line)
    - Padding above and below for touch targets
  - Menu items in order:
    1. **TRANG CHỦ** (Home)
    2. **HÌNH ẢNH** (Images)
    3. **VIDEO** (Video)
    4. **THÔNG ĐIỆP** (Messages)
    5. **CÀI ĐẶT** (Settings)
- **Hover/Active States**:
  - Slightly darker background on hover
  - Bold text or different shade for active page
  - Smooth transition effects

**Navigation Functionality:**
- Click on menu items to navigate:
  - **"TRANG CHỦ"** → Navigate to Home Page (After Unlock)
  - **"HÌNH ẢNH"** → Navigate to Images Page
  - **"VIDEO"** → Navigate to Video Page
  - **"THÔNG ĐIỆP"** → Navigate to Messages Page
  - **"CÀI ĐẶT"** → Navigate to Settings Page
- Each navigation should close the sidebar automatically after selection
- Clicking outside sidebar or on hamburger icon again should close the sidebar

**Animation:**
- Slide-in animation when opening (from right to left, or left to right)
- Slide-out animation when closing
- Smooth transition duration: 300-400ms
- Add backdrop/overlay (semi-transparent dark) behind sidebar when open
- Clicking on backdrop closes the sidebar

**Responsive Design:**
- Mobile: Full-height sidebar, 60-70% width
- Tablet: Full-height sidebar, fixed width (280px)
- Desktop: Full-height sidebar, fixed width (300px)
- Ensure menu items are easily tappable on touch devices

### 5. Settings Page
**Design & Layout:**
- **Header Section (Top)**:
  - Left: "21 Bleen STUDIO" logo (smaller size)
  - Right: Hamburger menu icon (three horizontal lines) - teal color
  - Fixed position with light background

- **Page Title**:
  - "CÀI ĐẶT" (uppercase, teal color, Coiny font)
  - Left-aligned with padding from left edge
  - Margin below title before first section

- **Section Layout**: 
  - Vertical scrollable page with multiple sections
  - Each section in a rounded rectangle card with teal border
  - Light mint background (#D9FFE8) for each card
  - Adequate spacing between sections

**Sub-sections:**

#### 5.1 Create Password Section (Tạo mật khẩu)
**Design:**
- Section title: "Tạo mật khẩu" (teal color)
- **Password Input Field**:
  - White background with rounded corners
  - Shows 4 dots (●●●●) for password display
  - Eye icon on right side to toggle show/hide password
  - Teal accent color for icons and borders
  - Input type: number (4 digits only)
- **Save Button**: "Lưu mật khẩu"
  - Full-width teal button
  - White text, rounded corners
  - Positioned below input field

**Requirements:**
- Input field for new password
- Password must be EXACTLY 4 digits (numeric only)
- Validation: Only accept 4-digit numbers (0-9)
- Eye icon toggles between showing dots and actual numbers
- "Lưu mật khẩu" button functionality:
  - Validate password is exactly 4 digits
  - Save password to localStorage
  - Display success notification: "Lưu thành công"
  - Show error if validation fails

#### 5.2 Fill Information Section (Thông tin người thứ nhất & Thông tin người thứ hai)
**Design:**
- Single card containing both person sections
- **Person 1 Section**: "Thông tin người thứ nhất" (teal title)
  - Profile image placeholder (rounded square, 80x80px)
  - Name input field with edit icon (pencil) on right
  - Underlined text input style
  - Image can be uploaded by clicking on placeholder
- **Person 2 Section**: "Thông tin người thứ hai" (teal title)
  - Same layout as Person 1
  - Separate profile image and name input
- **Save Button**: "Lưu thông tin"
  - Full-width teal button at bottom of card
  - White text, rounded corners

**Requirements:**
- Two separate input sections (Person 1 and Person 2)
- Each section has:
  - Profile image upload (click to select from device)
  - Name text input field
  - Edit icon to modify name
- **Validation rules**:
  - NO numbers allowed in names
  - NO special characters allowed (only letters and spaces)
  - Person 1 name MUST NOT match Person 2 name
  - Display validation errors in real-time below input
  - Prevent saving if validation fails
- Profile images stored as base64 or file references
- "Lưu thông tin" button functionality:
  - Validate all fields before saving
  - Check name uniqueness between persons
  - Save names and images to localStorage
  - Display success notification: "Lưu thành công"
  - Show specific error messages for validation failures

#### 5.3 Upload Images Section (Tải hình ảnh của bạn)
**Design:**
- Section title: "Tải hình ảnh của bạn" (teal color)
- **Upload Area**:
  - Large square with dashed border (teal)
  - Image icon in center (teal)
  - Text below icon: "Chỉ chọn ảnh có kích thước nhỏ hơn 1MB, tối đa 8 ảnh"
  - Click anywhere in area to trigger file picker
- **Image Preview Grid** (after upload):
  - Show thumbnails of uploaded images
  - Grid layout (2-3 columns on mobile, more on desktop)
  - Each thumbnail has small × delete button
- **Save Button**: "Lưu hình ảnh"
  - Full-width teal button
  - White text, rounded corners

**Requirements:**
- Image upload functionality from device
- Click on upload area to open file picker
- **Validation rules**:
  - Maximum file size: 1MB per image
  - Maximum number of images: 8 total
  - Supported formats: JPG, PNG, GIF, WEBP
  - Display error immediately if validation fails
  - Show specific error message (e.g., "Ảnh quá lớn", "Đã đạt giới hạn 8 ảnh")
- Show image previews after selection
- Allow deleting individual images before saving
- "Lưu hình ảnh" button functionality:
  - Convert images to base64 for localStorage
  - Save image data with metadata (filename, size, date)
  - Display success notification: "Lưu thành công"
  - Update Images Page with uploaded photos
- Show upload progress indicator (optional)

#### 5.4 Message Section (Thông điệp được gửi gắm)
**Design:**
- Section title: "Thông điệp được gửi gắm" (teal color)
- **Message Text Area**:
  - Large multi-line text input box
  - White background with rounded corners
  - Placeholder: "Viết thông điệp bạn muốn gửi đi nhé..."
  - Teal border on focus
  - Scrollable if text exceeds visible area
- **Audio Recording Controls**:
  - Two buttons side by side:
    1. **Record Button**: Microphone icon + "Ghi âm lại/dừng lại" text (teal)
    2. **Undo Button**: "Hoàn tác" text with icon (teal)
  - Waveform visualization during recording (optional)
  - Playback controls after recording completes
- **Save Button**: "Lưu thông điệp"
  - Full-width teal button
  - White text, rounded corners

**Requirements:**
- Text input area for message (follow Figma design frame)
- Character limit: reasonable (e.g., 500-1000 characters) with counter
- **Voice recording functionality**:
  - **Record Button**: Start/stop audio recording
  - Use browser MediaRecorder API
  - Request microphone permission on first use
  - Show recording status (red dot, timer)
  - Display waveform or audio bars during recording (optional)
  - Maximum recording length: 2-3 minutes
  - Save as WAV or WebM format
- **Playback functionality** (after recording):
  - Play button to preview recorded audio
  - Show audio duration
  - Waveform visualization (optional)
  - Volume control
- **"Hoàn tác" button functionality**:
  - Clear all text in message textarea
  - Delete recorded audio file
  - Reset recording UI to initial state
  - Confirm action with dialog (optional): "Bạn có chắc muốn xóa?"
- **"Lưu thông điệp" button functionality**:
  - Validate: must have either text or audio (or both)
  - Save message text to localStorage
  - Save audio file to localStorage (as base64 or blob URL)
  - Display success notification: "Lưu thành công"
  - Update Messages Page with new message and audio
- Handle microphone permission errors gracefully
- Show loading state during audio processing

#### 5.5 Upload Video Section (Tải video của bạn)
**Design:**
- Section title: "Tải video của bạn" (teal color)
- **Upload Area**:
  - Large rectangle with dashed border (teal)
  - Video camera icon in center (teal)
  - Text below icon: "Vui lòng tải video dung lượng dưới 20MB (định dạng MP4), nếu sai sẽ báo lỗi không thể tải video lên"
  - Click anywhere to trigger file picker
- **Video Preview** (after upload):
  - Show video thumbnail/preview
  - Display filename and file size
  - Small × delete button to remove
  - Play icon overlay to preview video
- **Save Button**: "Lưu video"
  - Full-width teal button
  - White text, rounded corners

**Requirements:**
- Video upload functionality from device
- Click on upload area to open file picker
- **Validation rules**:
  - Maximum file size: 20MB
  - Format: MP4 only (video/mp4 MIME type)
  - Validate immediately after file selection
  - Display error notification: "Không thể tải video" if validation fails
  - Show specific error reason (e.g., "Video quá lớn", "Định dạng không hỗ trợ")
- Show video preview with thumbnail after selection
- Allow deleting video before saving
- Preview video playback before saving (optional)
- **"Lưu video" button functionality**:
  - Store video file reference or base64 (if size permits)
  - Save video metadata (filename, size, duration, date)
  - Display success notification: "Lưu thành công"
  - Update Video Page with uploaded video
- Show upload progress bar (optional)
- Handle large file uploads gracefully
- Compress video if possible (optional, advanced)

**General Settings Page Design:**
- **Background**: Light off-white (#F4FFF8)
- **Scrollable**: All sections in single scrollable page
- **Spacing**: Consistent margins and padding between sections
- **Responsive**: Stack sections vertically on all devices
- **Error Messages**: Display below relevant input fields in red
- **Success Notifications**: Modal/toast at top of screen, auto-dismiss after 2-3 seconds
- **Loading States**: Show spinners during save operations
- **Form Validation**: Real-time validation with clear error messages

### 6. Images Page
**Design & Layout:**
- **Header Section (Top)**:
  - Left: "21 Bleen STUDIO" logo (smaller size)
  - Right: Hamburger menu icon (three horizontal lines) - teal color
  - Fixed position with light background
  - Consistent with other pages' header

- **Main Content Area (Center)**:
  - **Decorative Background Circle**:
    - Large light mint circle (#D9FFE8) as background
    - Centered on page, similar to Messages Page
    - Star icon centered at top of circle (light teal, decorative)
  
  - **Photo Gallery/Polaroid Stack** (Inside circle):
    - **Design Style**: Polaroid-style photo frames
    - Each photo has:
      - White polaroid frame border
      - Gray polaroid "roller" bar at top (simulating instant camera output)
      - Photo content in center
      - White space at bottom (classic polaroid style)
    - **Layout**: Vertical scrollable stack
      - Images stacked vertically with spacing between
      - Each image slightly overlaps or has margin
      - Smooth scrolling behavior
    - **Image Display**:
      - Display up to 8 uploaded images from Settings Page
      - If no images uploaded, show placeholder or empty state
      - Images maintain aspect ratio within polaroid frame
      - Responsive sizing for different screen sizes

- **Image Interaction**:
  - Click on any image to view in fullscreen/lightbox (optional)
  - Smooth transitions when opening images
  - Pinch to zoom on mobile (optional)
  - Swipe between images in fullscreen mode (optional)

**Functionality:**
- **Load Images**: Display all images uploaded from Settings Page
- **Image Sources**: 
  - Retrieve images from localStorage/state
  - Support up to 8 images (validation from Settings)
  - Images should be stored as base64 or file references
- **Empty State**: 
  - If no images uploaded yet, show message:
    - "Chưa có hình ảnh nào" or placeholder graphic
    - Button/link to go to Settings to upload images
- **Scrolling**:
  - Vertical scroll within the mint circle area
  - Smooth scroll behavior
  - Snap to image (optional for better UX)

**Background**: Light off-white (#F4FFF8) outside the mint circle

**Responsive Design:**
- Circle and polaroid frames scale proportionally
- Images maintain aspect ratio
- Adequate spacing on mobile devices
- Touch-friendly interactions
- Header stays fixed at top
- Optimized for vertical scrolling on all devices

**Loading States:**
- Show skeleton/loading animation while images load
- Lazy load images for better performance
- Compress/optimize images if needed

### 7. Video Page
**Design & Layout:**
- **Header Section (Top)**:
  - Left: "21 Bleen STUDIO" logo (smaller size)
  - Right: Hamburger menu icon (three horizontal lines) - teal color
  - Fixed position with light background
  - Consistent with other pages' header

- **Main Content Area (Center)**:
  - **Decorative Background Circle**:
    - Large light mint circle (#D9FFE8) as background
    - Centered on page, matching Images and Messages pages
    - Star icon centered at top of circle (light teal, decorative)
  
  - **Video Player Frame** (Inside circle):
    - **Design Style**: Rounded rectangle/tall arch shape
    - Fills most of the mint circle vertically
    - **Video Display**:
      - Full-width video player within the frame
      - Maintains 9:16 or similar vertical aspect ratio
      - Rounded corners matching the frame
      - Video fills the frame completely
    - **Play Button Overlay** (Initial state):
      - Large circular play button in center
      - Teal circle with white play icon (▶)
      - Semi-transparent overlay on video thumbnail
      - Disappears when video starts playing
    - **Video Controls** (During playback):
      - Standard HTML5 video controls at bottom:
        - Play/Pause button
        - Progress bar with seek functionality
        - Current time / Total duration
        - Volume control
        - Fullscreen button
      - Controls appear on hover/tap
      - Auto-hide after 3 seconds of inactivity

**Functionality:**
- **Load Video**: Display video uploaded from Settings Page
  - Retrieve video from localStorage/state
  - Support MP4 format (validated in Settings)
  - Maximum 20MB file size
- **Video Playback**:
  - Click play button to start video
  - Full video player controls (play, pause, seek, volume)
  - Autoplay disabled by default (user must click to play)
  - Loop option (optional)
  - Mobile-friendly controls
- **Empty State**: 
  - If no video uploaded yet, show:
    - Placeholder graphic or message: "Chưa có video nào"
    - Button/link to Settings Page to upload video
    - Maintain same frame design with empty state content
- **Fullscreen Mode**:
  - Allow fullscreen playback
  - Rotate to landscape on mobile for better viewing (optional)
  - Exit fullscreen returns to normal view

**Background**: Light off-white (#F4FFF8) outside the mint circle

**Responsive Design:**
- Circle and video frame scale proportionally
- Video maintains aspect ratio
- Controls remain accessible on all screen sizes
- Touch-friendly play button and controls
- Header stays fixed at top
- Optimize for both portrait and landscape viewing
- Ensure video doesn't exceed screen bounds

**Performance & Loading:**
- Show loading spinner while video buffers
- Display video thumbnail/poster before play
- Progressive loading for smoother playback
- Handle video loading errors gracefully
- Show error message if video fails to load

**Video Format Support:**
- Primary: MP4 (H.264 codec)
- Fallback message if format not supported
- Validate file type from Settings matches supported formats

### 8. Messages Page
**Design & Layout:**
- **Header Section (Top)**:
  - Left: "21 Bleen STUDIO" logo (smaller size)
  - Right: Hamburger menu icon (three horizontal lines) - teal color
  - Fixed position with light background
  
- **Main Content Area (Center)**:
  - **Decorative Background Circle**:
    - Large light mint circle (#D9FFE8) as background
    - Centered on page
    - Star icon centered at top of circle (light teal, decorative)
  
  - **Message Text Section** (Inside circle):
    - Multi-line text message displayed in center
    - Teal color (#17B3C1), Quicksand font
    - Text should be left-aligned or centered based on design
    - Adequate line spacing for readability
    - Example text format:
      ```
      Gửi đến người nhận được chiếc thẻ này,
      Mình muốn bạn biết rằng bạn thật đặc
      biệt. Cảm ơn bạn đã luôn ở bên cạnh và
      vào thế, hãy nhớ rằng ở đâu đó có một
      người luôn trân trọng, luôn nghĩ về bạn,
      và mong bạn bình an, hạnh phúc.
      
      Dù cuộc sống có bận rộn đến đâu, hãy
      dành một chút thời gian yêu thương
      chính mình và tìm rằng bạn chưa bảo
      giờ cô đơn mình.
      ```
  
  - **Audio Waveform Visualization** (Below text):
    - Horizontal audio waveform bars (vertical lines of varying heights)
    - Teal/mint gradient color
    - Represents recorded audio message
    - Should be centered below message text
    - Animated during playback (optional)

- **Audio Player Controls** (Bottom section):
  - **Layout**: Horizontal row with 3 elements:
    1. **Left Avatar**: Rounded square image (person 1)
    2. **Center Play/Pause Button**: Large circular button with teal border
       - Play icon (▶) or Pause icon (⏸) in teal
       - Toggle between play/pause states
    3. **Right Avatar**: Rounded square image (person 2)
  - Equal spacing between elements
  - Positioned at bottom with adequate margin

**Functionality:**
- Display saved message text from Settings Page
- Display audio player for recorded message from Settings Page
- **Play/Pause Button**:
  - Click to play recorded audio message
  - Show pause icon while playing
  - Show play icon when paused or stopped
  - Update waveform visualization during playback (optional animation)
- **Audio Playback**:
  - Play the audio file saved from Settings Page
  - Show playback progress (optional: add progress bar)
  - Auto-stop at end of audio
- **Avatars**: 
  - Display profile images of Person 1 and Person 2 from Settings
  - If no images uploaded, show placeholder avatars

**Background**: Light off-white (#F4FFF8) outside the mint circle

**Responsive Design:**
- Circle scales proportionally on different screen sizes
- Message text remains readable on mobile
- Audio controls remain accessible and properly sized for touch
- Header stays fixed at top
- Adequate padding on all sides

## State Management Requirements
- Use React useState for component state
- Use localStorage for persistent data:
  - Password
  - User information (Person 1 & 2)
  - Uploaded images (as base64 or file references)
  - Message text and audio
  - Uploaded video

## Component Structure Suggestions
```
src/
├── components/
│   ├── HomePage.jsx
│   ├── UnlockPage.jsx
│   ├── HomeAfterUnlock.jsx
│   ├── MenuSidebar.jsx
│   ├── SettingsPage.jsx
│   │   ├── PasswordSection.jsx
│   │   ├── InfoSection.jsx
│   │   ├── ImageUploadSection.jsx
│   │   ├── MessageSection.jsx
│   │   └── VideoUploadSection.jsx
│   ├── ImagesPage.jsx
│   ├── VideoPage.jsx
│   └── MessagesPage.jsx
├── images/
│   └── (all Figma images here)
├── App.jsx
└── README.md (with Figma link)
```

## Implementation Notes
1. **Responsive Design**: Use Tailwind responsive prefixes (sm:, md:, lg:, xl:)
2. **Image Handling**: Convert uploaded images to base64 for localStorage
3. **Audio Recording**: Use MediaRecorder API
4. **File Validation**: Check file size and type before upload
5. **Error Handling**: Display user-friendly error messages
6. **Loading States**: Show loading indicators during file uploads
7. **Success Notifications**: Use toast/modal for success messages

## Validation Rules Summary
- **Password**: Must be exactly 4 digits
- **Names**: No numbers, no special characters, must be unique between Person 1 and Person 2
- **Images**: Max 1MB each, max 8 images total
- **Video**: Max 20MB, MP4 format only

## Figma Design Link
**Main Project**: https://www.figma.com/design/nWo4fhxF0ojBu1SPHYe247/Untitled

## Modal/Page Implementation Order from Figma

**IMPORTANT**: Implement modals/pages in the EXACT order listed below. Each modal corresponds to a specific design frame in Figma.

### Modal Links (Add your Figma frame links below):

1. **Home Page (Initial Landing)**
   - Figma Link: `https://www.figma.com/design/nWo4fhxF0ojBu1SPHYe247/Untitled?node-id=0-1046&m=dev`
   - Description: Trang chủ ban đầu với icon vector.svg

2. **Unlock Page**
   - Figma Link: `https://www.figma.com/design/nWo4fhxF0ojBu1SPHYe247/Untitled?node-id=0-1050&m=dev`
   - Description: Trang nhập mật khẩu để mở khóa

3. **Home Page (After Unlock)**
   - Figma Link: `https://www.figma.com/design/nWo4fhxF0ojBu1SPHYe247/Untitled?node-id=0-1081&m=dev`
   - Description: Trang chủ sau khi mở khóa với icon vector (1).svg và button "Cùng xem nhé"

4. **Menu Sidebar**
   - Figma Link: `https://www.figma.com/design/nWo4fhxF0ojBu1SPHYe247/Untitled?node-id=67-62&m=dev`
   - Description: Thanh menu bên với các mục: Trang chủ, Hình ảnh, Video, Thông điệp, Cài đặt

5. **Settings Page**
   - Figma Link: `https://www.figma.com/design/nWo4fhxF0ojBu1SPHYe247/Untitled?node-id=0-1123&m=dev`
   - Description: Trang cài đặt với các section:
     - 5.1 Tạo mật khẩu
     - 5.2 Điền thông tin (Person 1 & 2)
     - 5.3 Tải hình ảnh
     - 5.4 Thông điệp gửi gắm
     - 5.5 Tải video

6. **Images Page**
   - Figma Link: `https://www.figma.com/design/nWo4fhxF0ojBu1SPHYe247/Untitled?node-id=0-1235&m=dev`
   - Description: Trang hiển thị gallery hình ảnh đã tải lên

7. **Video Page**
   - Figma Link: `https://www.figma.com/design/nWo4fhxF0ojBu1SPHYe247/Untitled?node-id=0-1262&m=dev`
   - Description: Trang hiển thị video đã tải lên

8. **Messages Page**
   - Figma Link: `https://www.figma.com/design/nWo4fhxF0ojBu1SPHYe247/Untitled?node-id=0-1220&m=dev`
   - Description: Trang hiển thị thông điệp văn bản và file ghi âm

## Project Setup Instructions
```bash
# Create new React project
npm create vite@latest love-website -- --template react
cd love-website

# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Install dependencies
npm install

# Start development server
npm run dev
```

### Setup Steps After Project Creation

1. **Configure Tailwind CSS** (`tailwind.config.js`):
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-teal': '#17B3C1',
        'light-mint': '#D9FFE8',
        'accent-green': '#58D0B5',
        'off-white': '#F4FFF8',
      },
      fontFamily: {
        'heading': ['Coiny', 'cursive'],
        'body': ['Quicksand', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

2. **Update main CSS file** (`src/index.css`):
```css
@import url('https://fonts.googleapis.com/css2?family=Coiny&family=Quicksand:wght@300;400;500;600;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  h1, h2, h3, h4, h5, h6 {
    font-family: 'Coiny', cursive;
  }
  
  body {
    font-family: 'Quicksand', sans-serif;
  }
}
```

3. **Download Figma Assets**:
   - Export all images as PNG (2x resolution for retina displays) or SVG
   - Export all icons as SVG for best quality
   - **IMPORTANT**: Organize assets into separate folders by page:
     - `src/images/Home Page (Initial Landing)/` - All assets for initial home page
     - `src/images/Unlock Page/` - All assets for unlock page
     - `src/images/Home Page (After Unlock)/` - All assets for home after unlock
     - `src/images/Menu Sidebar/` - All menu icons and assets
     - `src/images/Setting Page/` - All settings page assets
     - `src/images/Images Page/` - All images page assets
     - `src/images/Video Page/` - All video page assets
     - `src/images/Messages Page/` - All messages page assets
   - Each folder should contain ONLY the assets used on that specific page
   - This organization keeps code clean and assets easy to find

4. **Asset Naming Convention**:
   - Use lowercase with hyphens for Vietnamese names: `logo-chinh`, `logo-phu`, `bieu-tuong`
   - Keep Figma original names for vector icons: `vector.svg`
   - For additional icons use descriptive names: `icon-home.svg`, `icon-images.svg`, `icon-video.svg`, `icon-messages.svg`, `icon-settings.svg`
   - All files organized in page-specific folders under `src/images/`
   - Follow the exact folder structure: `src/images/[Page Name]/[asset-name]`

## Critical Requirements
- ✅ Pixel-perfect design matching Figma
- ✅ Responsive on all devices (mobile, tablet, desktop)
- ✅ All validation rules must be enforced
- ✅ localStorage for data persistence
- ✅ Success/error notifications for all actions
- ✅ NO additional features beyond specifications
- ✅ NO removal of Figma design elements
- ✅ Use exact color palette: #17B3C1, #D9FFE8, #58D0B5, #F4FFF8
- ✅ Use exact fonts: Coiny (headings), Quicksand (body)
- ✅ Follow exact image folder structure by page
- ✅ Implement all 8 pages with complete functionality

## Testing Checklist
- [ ] All navigation flows work correctly
- [ ] Password validation (4 digits only)
- [ ] Information validation (no numbers, no special chars, unique names)
- [ ] Image upload (max 1MB, max 8 images)
- [ ] Video upload (max 20MB, MP4 only)
- [ ] Audio recording and playback
- [ ] Success notifications display correctly
- [ ] Error messages display correctly
- [ ] Data persists after page refresh
- [ ] Responsive on mobile devices
- [ ] Responsive on tablets
- [ ] Responsive on desktop

---

**Please implement this project following these specifications EXACTLY, ensuring pixel-perfect design accuracy and full functionality across all devices.**