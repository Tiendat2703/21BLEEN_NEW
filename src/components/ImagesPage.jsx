import { useState, useEffect } from 'react';
import MenuSidebar from './MenuSidebar';
import { getImages } from '../utils/localStorage';
import hoaTiet from '../images/Images Page/Untitled_img/Hoạ tiết.png';
import logoImage from '../images/Video Page/source_2.png';
import polaroidFrame from '../images/Images Page/Polaroid frame.png';

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
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-primary-teal hover:opacity-70 transition-opacity"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Main Container */}
      <div className="px-4 pb-12 flex items-center justify-center min-h-screen">
        <div className="relative w-full max-w-[420px]">
          {/* Large Circle Background */}
          <div style={{width: '100%', height: '100%', background: '#D9FFE8', borderTopLeftRadius: 196.50, borderTopRightRadius: 196.50}} >
            
            {/* Star/Sparkle Icon at Top */}
            <div className="absolute top-12 left-1/2 transform -translate-x-1/2">
              <img 
                src={hoaTiet} 
                alt="" 
                className="w-16 h-16 object-contain opacity-40 animate-pulse"
              />
            </div>

            {/* Scrollable Photo Container */}
            <div className="h-full overflow-y-auto pt-24 pb-8 px-6 scrollbar-hide">
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
                <div className="space-y-8">
                  {images.map((image, index) => (
                    <div
                      key={index}
                      className="relative cursor-pointer hover:scale-105 transition-all duration-300"
                      onClick={() => handleImageClick(image)}
                    >
                      {/* Polaroid Frame Background */}
                      <img 
                        src={polaroidFrame} 
                        alt="Polaroid Frame" 
                        className="w-full h-auto object-contain"
                      />
                      
                      {/* Photo Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center p-4">
                        <div className="w-full h-full flex items-center justify-center">
                          <img
                            src={image.data}
                            alt={`Photo ${index + 1}`}
                            className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                            style={{ 
                              maxHeight: 'calc(100% - 2rem)',
                              maxWidth: 'calc(100% - 2rem)'
                            }}
                          />
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
          className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <div className="relative max-w-4xl w-full">
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
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ImagesPage;


