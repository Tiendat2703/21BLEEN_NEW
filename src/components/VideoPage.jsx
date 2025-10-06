import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import MenuSidebar from './MenuSidebar';
import NavigationArrows from './NavigationArrows';
import logoImage from '../images/Video Page/source_2.png';

function VideoPage() {
  const { userId } = useParams();
  const { token } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [video, setVideo] = useState(null);
  const [showPlayButton, setShowPlayButton] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    // Load video from backend API
    loadVideoFromBackend();
  }, [userId, token]);

  const loadVideoFromBackend = async () => {
    if (!userId || !token) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`/api/video/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setVideo({
            id: data.data.id,
            data: data.data.file_url,
            name: data.data.file_name,
            size: data.data.file_size,
            type: data.data.file_type,
            duration: data.data.duration,
            date: data.data.created_at
          });
        } else {
          setVideo(null);
        }
      } else if (response.status === 403 || response.status === 401) {
        // Token hết hạn
        console.error('Token hết hạn hoặc không có quyền truy cập');
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        setTimeout(() => {
          localStorage.clear();
          window.location.href = `/${userId}/unlock`;
        }, 2000);
      } else {
        console.error('Failed to load video:', response.statusText);
        setVideo(null);
      }
    } catch (err) {
      console.error('Error loading video:', err);
      toast.error('Lỗi khi tải video: ' + err.message);
      setVideo(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayClick = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setShowPlayButton(false);
    }
  };

  const handleVideoPause = () => {
    setShowPlayButton(true);
  };

  const handleVideoPlay = () => {
    setShowPlayButton(false);
  };

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ backgroundColor: '#F4FFF8' }}>
      <MenuSidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* Header with Logo and Menu Button */}
      <div className="relative z-20 flex justify-between items-center px-6 pt-1 pb-4">
        {/* Logo */}
        <div className="flex items-center">
          <img 
            src={logoImage} 
            alt="21 Bleen Studio" 
            className="w-auto object-contain"
            style={{ 
              height: '150px',
              filter: 'none',
              imageRendering: 'high-quality'
            }}
          />
        </div>
        
        {/* Menu Button */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-primary-teal hover:opacity-70 transition-opacity"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Main content container */}
      <div className="relative z-10 px-4 pb-8">
        <div className="max-w-sm mx-auto">

          {/* Main rounded container */}
          <div className="relative bg-light-mint rounded-t-[196px] w-full h-[732px] mt-8">
            {/* Video player container */}
            <div className="absolute top-[62px] left-1/2 transform -translate-x-1/2 w-[320px] h-[608px] rounded-t-[160px] overflow-hidden">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center text-center p-8 h-full bg-gray-100">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-teal mb-4"></div>
                  <p className="text-primary-teal font-body text-lg">
                    Đang tải video...
                  </p>
                </div>
              ) : video ? (
                <div className="relative w-full h-full">
                  <video
                    ref={videoRef}
                    src={video.data}
                    controls
                    onPlay={handleVideoPlay}
                    onPause={handleVideoPause}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Custom Play Button Overlay */}
                  {showPlayButton && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                      <button
                        onClick={handlePlayClick}
                        className="w-16 h-16 bg-primary-teal rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
                      >
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </button>
                    </div>
                  )}

                  {/* Video Info Badge */}
                  {video.duration && (
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                      {Math.floor(video.duration / 60)}:{String(Math.floor(video.duration % 60)).padStart(2, '0')}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-8 h-full bg-gray-100">
                  <p className="text-primary-teal font-body text-lg mb-4">
                    Chưa có video nào
                  </p>
                  <button
                    onClick={() => window.location.href = `/${userId}/settings`}
                    class