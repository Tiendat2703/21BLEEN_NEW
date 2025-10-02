import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MenuSidebar from './MenuSidebar';
import hoaTiet from '../images/Home Page (After Unlock)/Untitled_img/Hoạ tiết.png';
import mainImage from '../images/Home Page (After Unlock)/Untitled_img/Rectangle 6.png';
import thumb1 from '../images/Home Page (After Unlock)/Untitled_img/Rectangle 7.png';
import thumb2 from '../images/Home Page (After Unlock)/Untitled_img/Rectangle 8.png';
import thumb3 from '../images/Home Page (After Unlock)/Untitled_img/Rectangle 9.png';
import vectorIcon from '../images/Home Page (After Unlock)/Untitled_icon/Vector.svg';
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
        <div className="relative w-full max-w-md mt-8 mb-12">
          
          <div className="relative">
            <svg viewBox="0 0 400 200" className="w-full" style={{ height: '140px' }}>
              <defs>
                <path
                  id="curve"
                  d="M 50,150 Q 200,30 350,150"
                  fill="transparent"
                />
                <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: 'hsl(187, 100%, 42%)', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: 'hsl(186, 100%, 60%)', stopOpacity: 1 }} />
                </linearGradient>
              </defs>
              <text className="text-2xl font-bold" fill="url(#textGradient)">
                <textPath href="#curve" startOffset="50%" textAnchor="middle">
                  Những khoảnh khắc tuyệt vời
                </textPath>
              </text>
            </svg>
          </div>
        </div>

           {/* Main Image with Play Button */}
          <div className="relative mb-6">
            <img 
              src={mainImage}
              alt="Birthday celebration"
              className="w-full h-auto object-cover"
            />
            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="w-16 h-16 md:w-20 md:h-20 bg-primary-teal rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
                <img src={vectorIcon} alt="Play" className="w-8 h-8 md:w-10 md:h-10" />
              </button>
            </div>
          </div>

          {/* Thumbnail Gallery - Overlapping Layout with Center Focus */}
          <div className="flex justify-center items-end mb-10 relative px-8">
            {/* Left Thumbnail - Smaller, Lower, Behind */}
            <div 
              className="relative cursor-pointer hover:scale-110 transition-all duration-300 z-10"
              style={{ marginRight: '-20px' }}
            >
              <img 
                src={thumb1} 
                alt="Thumbnail 1" 
                className="w-20 h-20 md:w-24 md:h-24 rounded-[1.25rem] object-cover shadow-lg"
              />
            </div>

            {/* Center Thumbnail - Larger, Higher, On Top */}
            <div 
              className="relative cursor-pointer hover:scale-110 transition-all duration-300 z-20"
              style={{ transform: 'translateY(-10px)' }}
            >
              <img 
                src={thumb2} 
                alt="Thumbnail 2" 
                className="w-28 h-28 md:w-32 md:h-32 rounded-[1.5rem] object-cover shadow-xl"
              />
            </div>

            {/* Right Thumbnail - Smaller, Lower, Behind */}
            <div 
              className="relative cursor-pointer hover:scale-110 transition-all duration-300 z-10"
              style={{ marginLeft: '-20px' }}
            >
              <img 
                src={thumb3} 
                alt="Thumbnail 3" 
                className="w-20 h-20 md:w-24 md:h-24 rounded-[1.25rem] object-cover shadow-lg"
              />
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={handleCtaClick}
            className="bg-primary-teal text-white font-heading text-lg md:text-xl px-12 py-4 rounded-full hover:bg-accent-green transition-colors shadow-lg"
          >
            Cùng xem nhé!
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomeAfterUnlock;


