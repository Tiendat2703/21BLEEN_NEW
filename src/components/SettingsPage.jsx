import { useState } from 'react';
import MenuSidebar from './MenuSidebar';
import NavigationArrows from './NavigationArrows';
import PasswordSection from './settings/PasswordSection';
import InfoSection from './settings/InfoSection';
import ImageUploadSection from './settings/ImageUploadSection';
import MessageSection from './settings/MessageSection';
import VideoUploadSection from './settings/VideoUploadSection';
import logoImage from '../images/Video Page/source_2.png';

function SettingsPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

      <div className="px-4 pb-8">
        <div className="max-w-2xl mx-auto">
          {/* Page Title */}
          <h1 className="text-primary-teal font-heading text-3xl md:text-4xl mb-6 px-2">
            CÀI ĐẶT
          </h1>

          {/* Settings Sections */}
          <div className="space-y-6">
            <PasswordSection />
            <InfoSection />
            <ImageUploadSection />
            <MessageSection />
            <VideoUploadSection />
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <NavigationArrows />
    </div>
  );
}

export default SettingsPage;







