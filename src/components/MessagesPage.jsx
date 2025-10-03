import { useState, useEffect, useRef } from 'react';
import MenuSidebar from './MenuSidebar';
<<<<<<< HEAD
import NavigationArrows from './NavigationArrows';
=======
>>>>>>> dd495fbf863887f53482fb6681e0d55631fa7983
import { getAudio, getPerson } from '../utils/localStorage';
import hoaTiet from '../images/Messages Page/Untitled_img/Hoạ tiết.png';
import vectorIcon from '../images/Messages Page/Untitled_icon/Vector.svg';
import defaultAvatar1 from '../images/Messages Page/Untitled_img/1.png';
import defaultAvatar2 from '../images/Messages Page/Untitled_img/2.png';
import logoImage from '../images/Video Page/source_2.png';
import ellipseIcon from '../images/Messages Page/Untitled_icon/Ellipse 19.svg';
import stopIcon from '../images/Messages Page/Untitled_icon/lets-icons_stop-fill.svg';
import recordingVideo from '../images/Messages Page/GHI ÂM.mp4';

function MessagesPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [audioData, setAudioData] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [person1, setPerson1] = useState(null);
  const [person2, setPerson2] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    // Load audio and person data from localStorage
    const savedAudio = getAudio();
    const savedPerson1 = getPerson(1);
    const savedPerson2 = getPerson(2);

    setAudioData(savedAudio);
    setPerson1(savedPerson1);
    setPerson2(savedPerson2);
  }, []);

  // Listen for localStorage changes to update avatars
  useEffect(() => {
    const handleStorageChange = () => {
      const savedPerson1 = getPerson(1);
      const savedPerson2 = getPerson(2);
      setPerson1(savedPerson1);
      setPerson2(savedPerson2);
    };

    const handlePersonDataUpdate = () => {
      const savedPerson1 = getPerson(1);
      const savedPerson2 = getPerson(2);
      setPerson1(savedPerson1);
      setPerson2(savedPerson2);
    };

    // Listen for storage events (when localStorage changes in other tabs/components)
    window.addEventListener('storage', handleStorageChange);
    
    // Listen for custom event when person data is updated
    window.addEventListener('personDataUpdated', handlePersonDataUpdate);
    
    // Also check periodically for changes within the same tab
    const interval = setInterval(() => {
      const savedPerson1 = getPerson(1);
      const savedPerson2 = getPerson(2);
      
      // Only update if data has actually changed
      if (JSON.stringify(savedPerson1) !== JSON.stringify(person1)) {
        setPerson1(savedPerson1);
      }
      if (JSON.stringify(savedPerson2) !== JSON.stringify(person2)) {
        setPerson2(savedPerson2);
      }
    }, 1000); // Check every second

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('personDataUpdated', handlePersonDataUpdate);
      clearInterval(interval);
    };
  }, [person1, person2]);

  const handlePlayPause = () => {
    if (!audioData) return;

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  return (
    <div className="bg-[#f4fff8] relative size-full" data-name="Thông điệp" data-node-id="0:1220">
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
      {/* Vector Element */}
      <div className="absolute inset-[6.69%_9.41%_91.55%_85.5%]" data-name="Vector" data-node-id="0:1222">
        <img alt="" className="block max-w-none size-full" src={vectorIcon} />
      </div>
      
      {/* Main Container */}
      <div className="absolute bg-[#d9ffe8] h-[732px] right-1/2 translate-x-1/2 rounded-tl-[196.5px] rounded-tr-[196.5px] top-[120px] w-[393px]" data-node-id="0:1223" />
      
      {/* Message Text */}
      <div className="absolute flex flex-col font-['Quicksand:Bold',_sans-serif] font-bold justify-center leading-[normal] right-1/2 translate-x-1/2 text-[#17b3c1] text-[14px] top-[371px] translate-y-[-50%] w-[280px]" data-node-id="0:1224">
        <p className="mb-0">Gửi đến người nhận được chiếc thẻ này,</p>
        <p className="mb-0">Mình muốn bạn biết rằng bạn thật đặc biệt trong cuộc đời mình. Mỗi khi chạm vào thẻ, hãy nhớ rằng ở đâu đó có một người luôn trân trọng, luôn nghĩ về bạn, và mong bạn bình an, hạnh phúc.</p>
        <p className="mb-0">&nbsp;</p>
        <p>Dù cuộc sống có bận rộn đến đâu, hãy dành một chút thời gian yêu thương chính mình và tin rằng bạn chưa bao giờ một mình.</p>
      </div>
      
      {/* Play Button with Ellipse Background */}
      <button 
        onClick={handlePlayPause}
        className="absolute size-[60px] top-[662px] translate-x-[-50%] left-1/2 cursor-pointer hover:scale-105 transition-transform" 
        data-node-id="0:1225"
      >
        <img alt="" className="block max-w-none size-full" src={ellipseIcon} />
      </button>
      
      {/* Stop Icon */}
      <div className="absolute right-1/2 translate-x-1/2 size-[24px] top-[680px]" data-name="lets-icons:stop-fill" data-node-id="0:1226">
        <img alt="" className="block max-w-none size-full" src={stopIcon} />
      </div>
      
      {/* Person 1 Avatar - Left of Stop Icon */}
      <div className="absolute right-1/2 translate-x-[150px] rounded-[14px] size-[85px] top-[657px]" data-node-id="0:1229">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[14px]">
          <div className="absolute bg-[#58d0b5] inset-0 rounded-[14px]" />
          <img 
            alt={person1?.name || "Person 1"} 
            className="absolute max-w-none object-cover rounded-[14px] size-full" 
            src={person1?.image || defaultAvatar1}
            onError={(e) => {
              e.target.src = defaultAvatar1;
            }}
          />
        </div>
      </div>
      
      {/* Person 2 Avatar - Right of Stop Icon */}
      <div className="absolute left-1/2 translate-x-[-150px] flex items-center justify-center size-[85px] top-[657px]">
        <div className="flex-none rotate-[180deg] scale-y-[-100%]">
          <div className="relative rounded-[14px] size-[85px]" data-node-id="0:1230">
            <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[14px]">
              <div className="absolute bg-[#58d0b5] inset-0 rounded-[14px]" />
              <img 
                alt={person2?.name || "Person 2"} 
                className="absolute max-w-none object-cover rounded-[14px] size-full" 
                src={person2?.image || defaultAvatar2}
                onError={(e) => {
                  e.target.src = defaultAvatar2;
                }}
              />  
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative Pattern */}
      <div className="absolute size-[76px] top-[155px] translate-x-[-50%] left-1/2" data-name="Hoạ tiết" data-node-id="0:1232">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover opacity-20 pointer-events-none size-full" src={hoaTiet} />
      </div>
      
      {/* Decorative Video Animation */}
      <div className="absolute h-[79px] left-1/2 top-[511px] translate-x-[-50%] w-[393px]" data-name="1" data-node-id="0:1233">
        <video 
          className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
          autoPlay 
          loop 
          muted 
          playsInline
        >
          <source src={recordingVideo} type="video/mp4" />
        </video>
      </div>
      {/* Hidden Audio Element */}
      {audioData && (
        <audio
          ref={audioRef}
          src={audioData}
          onEnded={handleAudioEnded}
          className="hidden"
        />
      )}
<<<<<<< HEAD

      {/* Navigation Arrows */}
      <NavigationArrows />
=======
>>>>>>> dd495fbf863887f53482fb6681e0d55631fa7983
    </div>
  );
}

export default MessagesPage;


