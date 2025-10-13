import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { apiCall } from '../utils/api';
import MenuSidebar from './MenuSidebar';
import NavigationArrows from './NavigationArrows';
import hoaTiet from '../images/Home Page (After Unlock)/Untitled_img/Hoạ tiết.png';
import mainImage from '../images/Home Page (After Unlock)/Untitled_img/Rectangle 6.png';
import thumb1 from '../images/Home Page (After Unlock)/Untitled_img/Rectangle 7.png';
import thumb2 from '../images/Home Page (After Unlock)/Untitled_img/Rectangle 7.png';
import thumb3 from '../images/Home Page (After Unlock)/Untitled_img/Rectangle 7.png';
import ellipseIcon from '../images/Home Page (After Unlock)/Untitled_icon/Ellipse 17.svg';
import polygonIcon from '../images/Home Page (After Unlock)/Untitled_icon/Polygon 1.svg';
import buttonFrame from '../images/Home Page (After Unlock)/Untitled_icon/Ellipse 18.svg';
import logoImage from '../images/Video Page/source_2.png';

export default function HomeAfterUnlock() {
  const { userId } = useParams();
  const { token } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [videoData, setVideoData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [videoError, setVideoError] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const [thumbnailImages, setThumbnailImages] = useState({
    position1: null,
    position5: null,
    position3: null
  });
  const navigate = useNavigate();

  // Load data from backend
  useEffect(() => {
    loadVideoFromBackend();
    loadThumbnailImages();
  }, [userId, token]);

  const loadVideoFromBackend = async () => {
    if (!userId || !token) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setVideoError('');
      
      const { response, data } = await apiCall(`/api/video/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        if (data.success && data.data) {
          setVideoData(data.data);
        } else {
          setVideoData(null);
        }
      } else if (response.status === 403 || response.status === 401) {
        console.error('Token hết hạn hoặc không có quyền truy cập');
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        setTimeout(() => {
          localStorage.clear();
          window.location.href = `/${userId}/unlock`;
        }, 2000);
      } else {
        setVideoError('Không thể tải video');
      }
    } catch (err) {
      console.error('Error loading video:', err);
      setVideoError('Lỗi khi tải video: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const loadThumbnailImages = async () => {
    if (!userId || !token) return;

    try {
      console.log('Loading thumbnail images for userId:', userId);
      const { response, data } = await apiCall(`/api/images/${userId}?sortBy=position`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Thumbnail images API response:', { response, data });

      if (response.ok) {
        if (data.success && data.data) {
          // Tìm ảnh theo position 1, 5, 3
          const images = data.data;
          const position1 = images.find(img => img.position === 1);
          const position5 = images.find(img => img.position === 5);
          const position3 = images.find(img => img.position === 3);

          const thumbnails = {
            position1: position1?.file_url || null,
            position5: position5?.file_url || null,
            position3: position3?.file_url || null
          };
          
          console.log('Thumbnail images found:', thumbnails);
          setThumbnailImages(thumbnails);
        }
      }
    } catch (err) {
      console.error('Error loading thumbnail images:', err);
      console.log('Setting fallback empty thumbnails due to API error');
      setThumbnailImages({
        position1: null,
        position5: null,
        position3: null
      });
    }
  };

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleCtaClick = () => {
    navigate(`/${userId}/messages`);
  };

  const handlePlayPauseClick = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().catch(err => {
          console.error('Error playing video:', err);
        });
        setIsPlaying(true);
      }
    }
  };

  return (
    <div className="min-h-screen overflow-hidden" style={{ backgroundColor: '#F4FFF8' }}>
      <MenuSidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* Header with Logo and Menu Button */}
      <div className="relative z-20 flex justify-between items-center px-4 sm:px-6 pt-2 pb-4">
        {/* Logo */}
        <div className="flex items-center">
          <img 
            src={logoImage} 
            alt="21 Bleen Studio" 
            className="w-auto object-contain"
            style={{ 
              height: '120px',
              filter: 'none',
              imageRendering: 'high-quality'
            }}
          />
        </div>
        
        {/* Menu Button */}
        <button 
          onClick={handleMenuToggle}
          className="text-primary-teal hover:opacity-70 transition-opacity p-2"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <div className="px-4 pb-8">
        {/* Decorative elements */}
        <div className="absolute top-24 left-4 w-12 h-12 opacity-30">
          <img src={hoaTiet} alt="" className="w-full h-full object-contain" />
        </div>
        <div className="absolute top-24 right-4 w-12 h-12 opacity-30">
          <img src={hoaTiet} alt="" className="w-full h-full object-contain" />
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-6 flex flex-col items-center">
          {/* Curved Text - Responsive với SVG */}
          <div className="relative w-full max-w-md mx-auto bg-white/5 rounded-3xl overflow-visible p-2 sm:p-4 md:p-6">
            <div className="relative w-full mt-4 sm:mt-6 md:mt-8 mb-8 sm:mb-10 md:mb-12" style={{ transform: 'translateY(-110px)' }}>
              <svg viewBox="0 0 320 140" className="w-full h-auto" style={{ overflow: 'visible' }}>
                <defs>
                  <path id="curve" d="M 10,120 Q 160,10 310,120" fill="transparent" />
                </defs>
                <text className="group-hover:scale-110 transition-transform duration-300" style={{ fontSize: '20px', fontFamily: 'Coiny', fontWeight: '400', fill: '#17B3C1' }}>
                  <textPath href="#curve" startOffset="50%" textAnchor="middle">
                    Những khoảnh khắc hạnh phúc
                  </textPath>
                </text>
              </svg>
            </div>
          </div>

          {/* Video/Image Container với Play Button (khung cố định) */}
          <div className="relative mb-1" style={{ transform: 'translateY(-190px)' }}>
            <div className="relative w-full max-w-sm mx-auto">
              {/* Khung cố định luôn giữ nguyên kích thước/bo tròn */}
              <div 
                className="relative overflow-hidden bg-light-mint ring-8 ring-white shadow-xl"
                style={{ 
                  borderRadius: '250px',
                  width: 'min(90vw, 280px)',
                  aspectRatio: '2.5 / 4'
                }}
              >
                {isLoading ? (
                  // Loading state
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-teal mb-4"></div>
                      <p className="text-primary-teal font-body text-lg">Đang tải video...</p>
                    </div>
                  </div>
                ) : videoData ? (
                  <video
                    ref={videoRef}
                    src={videoData.file_url}
                    className="absolute inset-0 w-full h-full object-cover"
                    onEnded={() => setIsPlaying(false)}
                    onClick={handlePlayPauseClick}
                    playsInline
                    onContextMenu={(e) => e.preventDefault()}
                    onDoubleClick={(e) => e.preventDefault()}
                    disablePictureInPicture={true}
                  />
                ) : (
                  <img
                    src={mainImage}
                    alt="Birthday celebration"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}

                {/* Overlays */}
                {videoData && !isLoading ? (
                  <>
                    {!isPlaying && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <button 
                          onClick={handlePlayPauseClick}
                          className="relative w-16 h-16 md:w-20 md:h-20 hover:scale-110 transition-transform pointer-events-auto"
                        >
                          <img src={ellipseIcon} alt="Play button background" className="absolute inset-0 w-full h-full" />
                          <img src={polygonIcon} alt="Play" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 object-contain" />
                        </button>
                      </div>
                    )}
                    {isPlaying && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <button 
                          onClick={handlePlayPauseClick}
                          className="relative w-16 h-16 md:w-20 md:h-20 hover:scale-110 transition-transform pointer-events-auto opacity-0 hover:opacity-100"
                        >
                          <img src={ellipseIcon} alt="Pause button background" className="absolute inset-0 w-full h-full" />
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex gap-1.5">
                            <div className="w-2 h-7 bg-white rounded"></div>
                            <div className="w-2 h-7 bg-white rounded"></div>
                          </div>
                        </button>
                      </div>
                    )}
                  </>
                ) : !videoData && !isLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button 
                      onClick={() => navigate(`/${userId}/video`)}
                      className="relative w-16 h-16 md:w-20 md:h-20 hover:scale-110 transition-transform"
                    >
                      <img src={ellipseIcon} alt="Play button background" className="absolute inset-0 w-full h-full" />
                      <img src={polygonIcon} alt="Play" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 object-contain" />
                    </button>
                  </div>
                ) : null}

                {videoError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <p className="text-white font-body text-lg text-center px-4">{videoError}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <ThumbnailGallery userId={userId} thumbnailImages={thumbnailImages} />

          <button
            onClick={handleCtaClick}
            className="relative hover:scale-110 transition-transform"
            style={{ transform: 'translateY(-190px)' }}
          >
            <img 
              src={buttonFrame} 
              alt="Button frame" 
              className="w-auto h-auto object-contain" 
              style={{ width: '250px', height: '80px' }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white font-heading text-lg md:text-xl">
                Cùng xem nhé!
              </span>
            </div>
          </button>
        </div>
      </div>
      <NavigationArrows />
    </div>
  );
}

function ThumbnailGallery({ userId, thumbnailImages }) {

  return (
    <div className="flex justify-center items-center gap-6 mb-10 px-8" style={{ transform: 'translateY(-140px)' }}>
      {/* Left Thumbnail - Position 1 */}
      <div 
        className="relative"
        style={{ transform: 'rotate(-20deg) translateX(-10px)', transformOrigin: 'center' }}
      >
        {thumbnailImages.position1 ? (
          <img 
            src={thumbnailImages.position1} 
            alt="Thumbnail Position 1" 
            className="w-20 h-20 md:w-24 md:h-24 object-cover shadow-lg rounded-lg"
          />
        ) : (
          <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-200 shadow-lg rounded-lg flex items-center justify-center">
            <span className="text-gray-400 text-xs">+</span>
          </div>
        )}
      </div>

      {/* Center Thumbnail - Position 5 */}
      <div 
        className="relative"
        style={{ transform: 'translateY(-30px) translateX(1px)', transformOrigin: 'center' }}
      >
        {thumbnailImages.position5 ? (
          <img 
            src={thumbnailImages.position5} 
            alt="Thumbnail Position 5" 
            className="w-20 h-20 md:w-24 md:h-24 object-cover shadow-lg rounded-lg"
          />
        ) : (
          <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-200 shadow-lg rounded-lg flex items-center justify-center">
            <span className="text-gray-400 text-xs">+</span>
          </div>
        )}
      </div>

      {/* Right Thumbnail - Position 3 */}
      <div 
        className="relative"
        style={{ transform: 'rotate(20deg) translateX(10px)', transformOrigin: 'center' }}
      >
        {thumbnailImages.position3 ? (
          <img 
            src={thumbnailImages.position3} 
            alt="Thumbnail Position 3" 
            className="w-20 h-20 md:w-24 md:h-24 object-cover shadow-lg rounded-lg"
          />
        ) : (
          <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-200 shadow-lg rounded-lg flex items-center justify-center">
            <span className="text-gray-400 text-xs">+</span>
          </div>
        )}
      </div>
    </div>
  );
}
