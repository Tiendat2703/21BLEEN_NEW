import { useState, useEffect } from 'react';
import MenuSidebar from './MenuSidebar';
import NavigationArrows from './NavigationArrows';
import { getImages } from '../utils/localStorage';
import hoaTiet from '../images/Images Page/Untitled_img/Hoạ tiết.png';
import logoImage from '../images/Video Page/source_2.png';
import polaroidFrame from '../images/Images Page/Polaroid frame.png';
import image14 from '../images/Images Page/Untitled_img/image 14.png';

function ImagesPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    // Load images from localStorage
    const savedImages = getImages();
    setImages(savedImages);
  }, []);

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
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
          <div className="relative bg-light-mint rounded-t-[196px] w-full h-[850px] mt-8" style={{ transform: 'translateY(-72px)' }}>
            
            {/* Star/Sparkle Icon at Top */}
            <div className="absolute top-12 left-1/2 transform -translate-x-1/2">
              <img 
                src={hoaTiet} 
                alt="" 
                className="w-16 h-16 object-contain opacity-40 animate-pulse"
              />
            </div>

            {/* Image 14 in the empty space */}
            <div className="absolute top-32 left-1/2 transform -translate-x-1/2" style={{ transform: 'translateX(-50%) scale(1.5)' }}>
              <img 
                src={image14} 
                alt="Decorative Image" 
                className="w-auto h-auto object-contain"
                style={{ maxWidth: '300px', maxHeight: '150px' }}
              />
            </div>

            {/* Fixed Polaroid Container */}
            <div className="h-[810px] pb-8 px-6" style={{ paddingTop: '80px' }}>
              {images.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <p className="text-primary-teal font-heading text-xl mb-6">
                    Chưa có hình ảnh nào
                  </p>
                  <button
                    onClick={() => window.location.href = '/settings'}
                    className="bg-primary-teal text-white font-body font-semibold px-8 py-3 rounded-full hover:bg-accent-green transition-all shadow-lg hover:shadow-xl"
                  >
                    Tải ảnh lên
                  </button>
                </div>
              ) : (
                <div className="space-y-[-160px] flex flex-col items-center">
                  {images.slice(0, 2).map((image, index) => (
                    <div
                      key={index}
                      className="relative cursor-pointer hover:scale-105 transition-all duration-300"
                      onClick={() => handleImageClick(image)}
                    >
                      {/* Polaroid Container - nhóm cả frame và photo */}
                      <div className="relative w-full" style={{ transform: 'scale(0.67)' }}>
                        {/* Polaroid Frame Background */}
                        <img 
                          src={polaroidFrame} 
                          alt="Polaroid Frame" 
                          className="w-full h-auto object-contain"
                        />
                        
                        {/* Photo Overlay - chỉ che phần màu xanh bên trong */}
                        <div className="absolute inset-0 flex items-center justify-center" style={{ padding: '8% 6% 20% 6%' }}>
                          <div className="w-full h-full flex items-center justify-center">
                            <img
                              src={image.data}
                              alt={`Photo ${index + 1}`}
                              className="w-full h-full object-cover rounded-lg shadow-lg"
                              style={{ 
                                objectFit: 'cover',
                                borderRadius: '8px'
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: '#D9FFE8' }}
          onClick={closeLightbox}
        >
          <div className="relative max-w-md w-full">
            <img
              src={selectedImage.data}
              alt="Full size"
              className="w-full h-auto object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className="absolute -top-12 right-0 text-white text-5xl font-light hover:text-gray-300 transition-colors w-12 h-12 flex items-center justify-center"
              onClick={closeLightbox}
            >
            </button>
          </div>
        </div>
      )}

      {/* Navigation Arrows */}
      <NavigationArrows />
    </div>
  );
}

export default ImagesPage;


