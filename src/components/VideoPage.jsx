import { useState, useEffect, useRef } from 'react';
import MenuSidebar from './MenuSidebar';
import NavigationArrows from './NavigationArrows';
import { getVideo } from '../utils/localStorage';
import logoImage from '../images/Video Page/source_2.png';

function VideoPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [video, setVideo] = useState(null);
  const [showPlayButton, setShowPlayButton] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    // Load video from localStorage
    const savedVideo = getVideo();
    setVideo(savedVideo);
  }, []);

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
              {video ? (
                <div className="relative w-full h-full">
                  <video
                    ref={videoRef}
                    src={video.data}
                    controls
                    onPlay={handleVideoPlay}
                    onPause={handleVideoPause}
                    className="w-full h-full object-cover"
                    poster={video.thumbnail}
                  />
                  
                  {/* Custom Play Button Overlay */}
                  {showPlayButton && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                      <button
                        onClick={handlePlayClick}
                        className="w-16 h-16 bg-primary-teal rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
                      >
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-8 h-full bg-gray-100">
                  <p className="text-primary-teal font-body text-lg mb-4">
                    Chưa có video nào
                  </p>
                  <button
                    onClick={() => window.location.href = '/settings'}
                    className="bg-primary-teal text-white font-body px-6 py-2 rounded-full hover:bg-accent-green transition-colors"
                  >
                    Tải video lên
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <NavigationArrows />
    </div>
  );
}

export default VideoPage;





