import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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


function HomeAfterUnlock() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleCtaClick = () => {
    navigate('/messages');
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

      {/* Main Content Container - Responsive */}
      <div className="relative px-4 pb-8">
        {/* Decorative elements */}
        <div className="absolute top-6 left-4 w-8 h-8 sm:w-12 sm:h-12 opacity-30">
          <img src={hoaTiet} alt="" className="w-full h-full object-contain" />
        </div>
        <div className="absolute top-6 right-4 w-8 h-8 sm:w-12 sm:h-12 opacity-30">
          <img src={hoaTiet} alt="" className="w-full h-full object-contain" />
        </div>

        {/* Main Content Container */}
        <div className="max-w-md mx-auto px-4 sm:px-6">
          {/* Title with sparkles - Responsive */}
          <div className="relative w-full mb-8 sm:mb-12">
            <div className="relative w-full h-24 sm:h-32 flex items-center justify-center">
              {/* Oval curved text - Responsive */}
              <div className="relative w-full h-full group">
                {/* Text Group - Responsive positioning */}
                <div className="group-hover:scale-105 transition-transform duration-300 absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-primary-teal font-heading text-lg sm:text-xl md:text-2xl font-bold leading-tight">
                      Những khoảnh khắc<br />
                      hạnh phúc
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Image with Play Button - Responsive */}
          <div className="relative mb-6 sm:mb-8">
            <div className="relative w-full max-w-sm mx-auto">
              <img 
                src={mainImage}
                alt="Birthday celebration"
                className="w-full h-auto object-cover rounded-lg shadow-lg"
              />
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="relative w-16 h-16 sm:w-20 sm:h-20 hover:scale-110 transition-transform">
                  {/* Background Ellipse */}
                  <img 
                    src={ellipseIcon} 
                    alt="Play button background" 
                    className="absolute inset-0 w-full h-full" 
                  />
                  {/* Play Triangle */}
                  <img 
                    src={polygonIcon} 
                    alt="Play" 
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 object-contain" 
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Thumbnail Gallery - Responsive Layout */}
          <div className="flex justify-center items-center gap-3 sm:gap-6 mb-8 sm:mb-10 px-4">
            {/* Left Thumbnail */}
            <div className="relative cursor-pointer hover:scale-110 transition-all duration-300 transform -rotate-12 sm:-rotate-20">
              <img 
                src={thumb1} 
                alt="Thumbnail 1" 
                className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-cover shadow-lg rounded-lg"
              />
            </div>

            {/* Center Thumbnail */}
            <div className="relative cursor-pointer hover:scale-110 transition-all duration-300 transform -translate-y-2 sm:-translate-y-4">
              <img 
                src={thumb2} 
                alt="Thumbnail 2" 
                className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-cover shadow-lg rounded-lg"
              />
            </div>

            {/* Right Thumbnail */}
            <div className="relative cursor-pointer hover:scale-110 transition-all duration-300 transform rotate-12 sm:rotate-20">
              <img 
                src={thumb3} 
                alt="Thumbnail 3" 
                className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-cover shadow-lg rounded-lg"
              />
            </div>
          </div>

          {/* CTA Button - Responsive */}
          <div className="flex justify-center">
            <button
              onClick={handleCtaClick}
              className="relative hover:scale-105 transition-transform"
            >
              {/* Button Frame */}
              <img 
                src={buttonFrame} 
                alt="Button frame" 
                className="w-64 h-16 sm:w-80 sm:h-20 md:w-96 md:h-24 object-contain" 
              />
              {/* Button Text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-heading text-sm sm:text-lg md:text-xl font-bold">
                  Cùng xem nhé!
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
      {/* Navigation Arrows */}
      <NavigationArrows />

    </div>
  );
}

export default HomeAfterUnlock;


