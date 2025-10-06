import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Menu, X, Upload } from 'lucide-react';
import logoImage from '../images/Video Page/source_2.png';
import MenuSidebar from './MenuSidebar';
import NavigationArrows from './NavigationArrows';
import hoaTiet from '../images/Images Page/Untitled_img/Hoạ tiết.png';

const ImagesPage = () => {
  const { userId } = useParams();
  const { token } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [images, setImages] = useState({
    frame1: '',
    frame2: '',
    frame3: '',
    frame4: '',
    frame5: '',
    frame6: '',
    frame7: ''
  });

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    // Load images from backend API
    loadImagesFromBackend();
  }, [userId, token]);

  const loadImagesFromBackend = async () => {
    if (!userId || !token) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`/api/images/${userId}?sortBy=position`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          // Sort by position (1-9) to display in correct frame order
          const sortedImages = data.data
            .filter(img => img.position !== null) // Only show images with position
            .sort((a, b) => a.position - b.position);
          
          // Map backend images to frame format
          const frameImages = {
            frame1: sortedImages[0]?.file_url || '',
            frame2: sortedImages[1]?.file_url || '',
            frame3: sortedImages[2]?.file_url || '',
            frame4: sortedImages[3]?.file_url || '',
            frame5: sortedImages[4]?.file_url || '',
            frame6: sortedImages[5]?.file_url || '',
            frame7: sortedImages[6]?.file_url || ''
          };
          
          setImages(frameImages);
        } else {
          setImages({
            frame1: '',
            frame2: '',
            frame3: '',
            frame4: '',
            frame5: '',
            frame6: '',
            frame7: ''
          });
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
        console.error('Failed to load images:', response.statusText);
        toast.error('Không thể tải ảnh');
        setImages({
          frame1: '',
          frame2: '',
          frame3: '',
          frame4: '',
          frame5: '',
          frame6: '',
          frame7: ''
        });
      }
    } catch (err) {
      console.error('Error loading images:', err);
      toast.error('Lỗi khi tải ảnh: ' + err.message);
      setImages({
        frame1: '',
        frame2: '',
        frame3: '',
        frame4: '',
        frame5: '',
        frame6: '',
        frame7: ''
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle frame click
  const handleFrameClick = (frameKey) => {
    localStorage.setItem('selectedFrame', frameKey);
    window.location.href = `/${userId}/settings`;
  };

  return (
    <div className="min-h-screen overflow-hidden" style={{ backgroundColor: '#F4FFF8' }}>
      <MenuSidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* Header with Logo and Menu Button */}
      <div className="relative z-20 flex justify-between items-center px-6 pt-1 pb-4">
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
        
        <button 
          onClick={handleMenuToggle}
          className="text-primary-teal hover:opacity-70 transition-opacity"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <div className="absolute bg-[#d9ffe8] h-[810px] right-1/2 translate-x-1/2 rounded-tl-[196.5px] rounded-tr-[196.5px] top-[120px] w-[450px]" data-node-id="0:1223" />
      
      <div className="absolute size-[76px] top-[155px] translate-x-[-50%] left-1/2" data-name="Hoạ tiết" data-node-id="0:1232">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover opacity-20 pointer-events-none size-full" src={hoaTiet} />
      </div>

      <main className="relative z-10 pt-40 pb-10 px-4">
        <div className="mx-auto" style={{ width: '322px' }}>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-96 text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-teal mb-4"></div>
              <p className="text-primary-teal font-heading text-xl">
                Đang tải ảnh...
              </p>
            </div>
          ) : (
            <>
              <div className="flex gap-2 mb-2">
                <ImageCard 
                  src={images.frame1} 
                  alt="Frame 1"
                  frameKey="frame1"
                  onFrameClick={handleFrameClick}
                  width={157}
                  height={157}
                />
                <ImageCard 
                  src={images.frame2} 
                  alt="Frame 2"
                  frameKey="frame2"
                  onFrameClick={handleFrameClick}
                  width={157}
                  height={157}
                />
              </div>

              <div className="flex gap-2 mb-2">
                <ImageCard 
                  src={images.frame3} 
                  alt="Frame 3"
                  frameKey="frame3"
                  onFrameClick={handleFrameClick}
                  width={211}
                  height={157}
                />
                <ImageCard 
                  src={images.frame4} 
                  alt="Frame 4"
                  frameKey="frame4"
                  onFrameClick={handleFrameClick}
                  width={104}
                  height={157}
                />
              </div>

              <div className="flex gap-2">
                <ImageCard 
                  src={images.frame5} 
                  alt="Frame 5"
                  frameKey="frame5"
                  onFrameClick={handleFrameClick}
                  width={101}
                  height={157}
                />
                <ImageCard 
                  src={images.frame6} 
                  alt="Frame 6"
                  frameKey="frame6"
                  onFrameClick={handleFrameClick}
                  width={101}
                  height={157}
                />
                <ImageCard 
                  src={images.frame7} 
                  alt="Frame 7"
                  frameKey="frame7"
                  onFrameClick={handleFrameClick}
                  width={101}
                  height={157}
                />
              </div>
            </>
          )}
        </div>
      </main>

      {/* Navigation Arrows */}
      <NavigationArrows />
    </div>
  );
};

const ImageCard = ({ src, alt, frameKey, onFrameClick, width, height }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative overflow-hidden shadow-md group cursor-pointer"
      style={{ 
        width: `${width}px`, 
        height: `${height}px`,
        borderRadius: '10px',
        background: '#D9D9D9'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onFrameClick(frameKey)}
    >
      {src ? (
        <>
          <img 
            src={src} 
            alt={alt}
            className="w-full h-full object-cover"
            style={{ borderRadius: '10px' }}
          />
          {isHovered && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-all">
              <Upload className="text-white" size={24} />
            </div>
          )}
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center hover:bg-gray-300 transition-colors">
          <U