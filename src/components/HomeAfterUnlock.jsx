import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
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
      
      const response = await fetch(`/api/video/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
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
      const response = await fetch(`/api/images/${userId}?sortBy=position`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          // Tìm ảnh theo position 1, 5, 3
          const images = data.data;
          const position1 = images.find(img => img.position === 1);
          const position5 = images.find(img => img.position === 5);
          const position3 = images.find(img => img.position === 3);

          setThumbnailImages({
            position1: position1?.file_url || null,
            position5: position5?.file_url || null,
            position3: position3?.file_url || null
          });
        }
      }
    } catch (err) {
      console.error('Error loading thumbnail images:', err);
    }
  };

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleCtaClick = () => {
    navigate(`/${userId}/messages`);
  };

  return (
    <div className="min-h-screen overflow-hidden" style={{ backgroundColor: '#F4FFF8' }}>
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
          onClick={handleMenuToggle}
          className="text-primary-teal hover:opacity-70 transition-opacity"
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
        {/* Title with sparkles */}
        <div className="relative w-full max-w-md mt-8 mb-12" style={{ transform: 'translateY(-120px)' }}>
          <div className="relative w-full h-32 flex items-center justify-center">
            {/* Oval curved text */}
            <div className="relative w-full h-full group">
              {/* Text Group - All letters with precise positioning */}
              <div className="group-hover:scale-110 transition-transform duration-300" style={{width: '100%', height: '100%', position: 'relative', left: '105px', top: '30px', transform: 'scale(1.5)'}}>
                <div style={{width: 13.99, height: 18.69, left: 0, top: 106.38, position: 'absolute', transform: 'rotate(-66deg)', transformOrigin: 'top left', color: '#17B3C1', fontSize: 24, fontFamily: 'Coiny', fontWeight: '400', wordWrap: 'break-word'}}>N</div>
                <div style={{width: 11.16, height: 18.60, left: 7.97, top: 89.41, position: 'absolute', transform: 'rotate(-60deg)', transformOrigin: 'top left', color: '#17B3C1', fontSize: 24, fontFamily: 'Coiny', fontWeight: '400', wordWrap: 'break-word'}}>h</div>
                <div style={{width: 14.99, height: 18.40, left: 16.06, top: 75.83, position: 'absolute', transform: 'rotate(-54deg)', transformOrigin: 'top left', color: '#17B3C1', fontSize: 24, fontFamily: 'Coiny', fontWeight: '400', wordWrap: 'break-word'}}>ữ</div>
                <div style={{width: 12.28, height: 17.46, left: 27.81, top: 60.88, position: 'absolute', transform: 'rotate(-48deg)', transformOrigin: 'top left', color: '#17B3C1', fontSize: 24, fontFamily: 'Coiny', fontWeight: '400', wordWrap: 'break-word'}}>n</div>
                <div style={{width: 8.96, height: 20.77, left: 38, top: 47.08, position: 'absolute', transform: 'rotate(-43deg)', transformOrigin: 'top left', color: '#17B3C1', fontSize: 24, fontFamily: 'Coiny', fontWeight: '400', wordWrap: 'break-word'}}>g</div>
                <div style={{width: 4.42, height: 19.51, left: 50.06, top: 37.57, position: 'absolute', transform: 'rotate(-38deg)', transformOrigin: 'top left', color: '#17B3C1', fontSize: 24, fontFamily: 'Coiny', fontWeight: '400', wordWrap: 'break-word'}}> </div>
                <div style={{width: 9.76, height: 19.25, left: 57.66, top: 31.81, position: 'absolute', transform: 'rotate(-34deg)', transformOrigin: 'top left', color: '#17B3C1', fontSize: 24, fontFamily: 'Coiny', fontWeight: '400', wordWrap: 'break-word'}}>k</div>
                <div style={{width: 10.62, height: 19.11, left: 70.14, top: 23.64, position: 'absolute', transform: 'rotate(-29deg)', transformOrigin: 'top left', color: '#17B3C1', fontSize: 24, fontFamily: 'Coiny', fontWeight: '400', wordWrap: 'break-word'}}>h</div>
                <div style={{width: 11.41, height: 19.03, left: 84, top: 16.24, position: 'absolute', transform: 'rotate(-24deg)', transformOrigin: 'top left', color: '#17B3C1', fontSize: 24, fontFamily: 'Coiny', fontWeight: '400', wordWrap: 'break-word'}}>o</div>
                <div style={{width: 10.74, height: 18.99, left: 99.18, top: 9.93, position: 'absolute', transform: 'rotate(-18deg)', transformOrigin: 'top left', color: '#17B3C1', fontSize: 24, fontFamily: 'Coiny', fontWeight: '400', wordWrap: 'break-word'}}>ả</div>
                <div style={{width: 10.77, height: 18.96, left: 114.16, top: 5.30, position: 'absolute', transform: 'rotate(-13deg)', transformOrigin: 'top left', color: '#17B3C1', fontSize: 24, fontFamily: 'Coiny', fontWeight: '400', wordWrap: 'break-word'}}>n</div>
                <div style={{width: 10.80, height: 18.94, left: 129.52, top: 2.09, position: 'absolute', transform: 'rotate(-7deg)', transformOrigin: 'top left', color: '#17B3C1', fontSize: 24, fontFamily: 'Coiny', fontWeight: '400', wordWrap: 'break-word'}}>h</div>
                <div style={{width: 5.04, height: 18.94, left: 144.86, top: 0.42, position: 'absolute', transform: 'rotate(-3deg)', transformOrigin: 'top left', color: '#17B3C1', fontSize: 24, fontFamily: 'Coiny', fontWeight: '400', wordWrap: 'break-word'}}> </div>
                <div style={{width: 10.12, height: 18.94, left: 154.47, top: 0, position: 'absolute', transform: 'rotate(1deg)', transformOrigin: 'top left', color: '#17B3C1', fontSize: 24, fontFamily: 'Coiny', fontWeight: '400', wordWrap: 'break-word'}}>k</div>
                <div style={{width: 10.80, height: 18.94, left: 169.42, top: 0.52, position: 'absolute', transform: 'rotate(6deg)', transformOrigin: 'top left', color: '#17B3C1', fontSize: 24, fontFamily: 'Coiny', fontWeight: '400', wordWrap: 'break-word'}}>h</div>
                <div style={{width: 10.78, height: 18.96, left: 185.01, top: 2.51, position: 'absolute', transform: 'rotate(12deg)', transformOrigin: 'top left', color: '#17B3C1', fontSize: 24, fontFamily: 'Coiny', fontWeight: '400', wordWrap: 'break-word'}}>ắ</div>
                <div style={{width: 10.74, height: 18.98, left: 200.35, top: 5.96, position: 'absolute', transform: 'rotate(17deg)', transformOrigin: 'top left', color: '#17B3C1', fontSize: 24, fontFamily: 'Coiny', fontWeight: '400', wordWrap: 'break-word'}}>c</div>
                <div style={{width: 4.92, height: 19.01, left: 215.04, top: 10.80, position: 'absolute', transform: 'rotate(22deg)', transformOrigin: 'top left', color: '#17B3C1', fontSize: 24, fontFamily: 'Coiny', fontWeight: '400', wordWrap: 'break-word'}}> </div>
                <div style={{width: 10.66, height: 19.06, left: 224.05, top: 14.41, position: 'absolute', transform: 'rotate(26deg)', transformOrigin: 'top left', color: '#17B3C1', fontSize: 24, fontFamily: 'Coiny', fontWeight: '400', wordWrap: 'break-word'}}>h</div>
                <div style={{width: 10.57, height: 19.15, left: 238.16, top: 21.47, position: 'absolute', transform: 'rotate(31deg)', transformOrigin: 'top left', color: '#17B3C1', fontSize: 24, fontFamily: 'Coiny', fontWeight: '400', wordWrap: 'break-word'}}>ạ</div>
                <div style={{width: 10.37, height: 19.36, left: 251.63, top: 29.80, position: 'absolute', transform: 'rotate(37deg)', transformOrigin: 'top left', color: '#17B3C1', fontSize: 24, fontFamily: 'Coiny', fontWeight: '400', wordWrap: 'break-word'}}>n</div>
                <div style={{width: 9.47, height: 20.27, left: 264.77, top: 39.36, position: 'absolute', transform: 'rotate(42deg)', transformOrigin: 'top left', color: '#17B3C1', fontSize: 24, fontFamily: 'Coiny', fontWeight: '400', wordWrap: 'break-word'}}>h</div>
                <div style={{width: 8.63, height: 15.31, left: 272.60, top: 49.92, position: 'absolute', transform: 'rotate(46deg)', transformOrigin: 'top left', color: '#17B3C1', fontSize: 24, fontFamily: 'Coiny', fontWeight: '400', wordWrap: 'break-word'}}> </div>
                <div style={{width: 11.67, height: 18.08, left: 281.22, top: 56.96, position: 'absolute', transform: 'rotate(50deg)', transformOrigin: 'top left', color: '#17B3C1', fontSize: 24, fontFamily: 'Coiny', fontWeight: '400', wordWrap: 'break-word'}}>p</div>
                <div style={{width: 11.28, height: 18.48, left: 291.35, top: 69.26, position: 'absolute', transform: 'rotate(56deg)', transformOrigin: 'top left', color: '#17B3C1', fontSize: 24, fontFamily: 'Coiny', fontWeight: '400', wordWrap: 'break-word'}}>h</div>
                <div style={{width: 11.14, height: 18.62, left: 300.12, top: 82.43, position: 'absolute', transform: 'rotate(61deg)', transformOrigin: 'top left', color: '#17B3C1', fontSize: 24, fontFamily: 'Coiny', fontWeight: '400', wordWrap: 'break-word'}}>ú</div>
                <div style={{width: 11.07, height: 18.69, left: 307.58, top: 96.36, position: 'absolute', transform: 'rotate(66deg)', transformOrigin: 'top left', color: '#17B3C1', fontSize: 24, fontFamily: 'Coiny', fontWeight: '400', wordWrap: 'break-word'}}>c</div>
              </div>
            </div>
          </div>
        </div>

           {/* Main Video Display - Fixed Oval Frame */}
          <div className="relative mb-6">
            {isLoading ? (
              // Loading state
              <div className="flex items-center justify-center w-full h-64 bg-gray-100 rounded-lg" style={{ transform: 'scale(1.5) translateY(-80px)' }}>
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-teal mb-4"></div>
                  <p className="text-primary-teal font-body text-lg">Đang tải video...</p>
                </div>
              </div>
            ) : videoData ? (
              // Video display - Fixed in oval frame only
              <div className="relative w-full max-w-sm mx-auto overflow-hidden rounded-lg" style={{ transform: 'translateY(-80px)' }}>
