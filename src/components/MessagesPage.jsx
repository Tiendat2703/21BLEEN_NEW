import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiCall } from '../utils/api';
import MenuSidebar from './MenuSidebar';
import NavigationArrows from './NavigationArrows';
import hoaTiet from '../images/Images Page/Untitled_img/Hoạ tiết.png';
import vectorIcon from '../images/Messages Page/Untitled_icon/Vector.svg';
import defaultAvatar1 from '../images/Messages Page/Untitled_img/1.png';
import defaultAvatar2 from '../images/Messages Page/Untitled_img/2.png';
import logoImage from '../images/Video Page/source_2.png';
import ellipseIcon from '../images/Messages Page/Untitled_icon/Ellipse 19.svg';
import stopIcon from '../images/Messages Page/Untitled_icon/lets-icons_stop-fill.svg';
import recordingVideo from '../images/Messages Page/GHI ÂM.mp4';

function MessagesPage() {
  const { userId } = useParams();
  const { token } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [audioData, setAudioData] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [person1, setPerson1] = useState(null);
  const [person2, setPerson2] = useState(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const audioRef = useRef(null);

  useEffect(() => {
    // Load data from backend API
    loadDataFromBackend();
  }, [userId, token]);

  const loadDataFromBackend = async () => {
    if (!userId || !token) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      // Load message from posts API
      const { response: postResponse, data: postData } = await apiCall(`/api/posts/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (postResponse.ok) {
        if (postData.success && postData.data) {
          setMessage(postData.data.content || '');
        }
      }

      // Load beneficiaries (person 1 and person 2)
      const { response: benefResponse, data: benefData } = await apiCall(`/api/beneficiaries/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (benefResponse.ok) {
        if (benefData.success && benefData.data) {
          if (benefData.data.primary) {
            setPerson1({
              name: benefData.data.primary.name,
              image: benefData.data.primary.avatar_url
            });
          }
          if (benefData.data.secondary) {
            setPerson2({
              name: benefData.data.secondary.name,
              image: benefData.data.secondary.avatar_url
            });
          }
        }
      }

      // Load voice from voice API
      const { response: voiceResponse, data: voiceData } = await apiCall(`/api/voice/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (voiceResponse.ok) {
        if (voiceData.success && voiceData.data) {
          setAudioData(voiceData.data.file_url);
        }
      }
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Listen for custom event when person data is updated
  useEffect(() => {
    const handlePersonDataUpdate = () => {
      // Reload data from backend when personDataUpdated event fires
      loadDataFromBackend();
    };

    // Listen for custom event when person data is updated
    window.addEventListener('personDataUpdated', handlePersonDataUpdate);

    return () => {
      window.removeEventListener('personDataUpdated', handlePersonDataUpdate);
    };
  }, [userId, token]);

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
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-primary-teal hover:opacity-70 transition-opacity p-2"
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
      <div className="absolute bg-[#d9ffe8] h-[732px] right-1/2 translate-x-1/2 rounded-tl-[196.5px] rounded-tr-[196.5px] top-[90px] w-[400px]" data-node-id="0:1223" />
      
      {/* Message Text */}
      <div className="absolute flex flex-col font-body font-bold justify-center leading-[normal] right-1/2 translate-x-1/2 text-[#17b3c1] text-[14px] top-[371px] translate-y-[-50%] w-[280px]" data-node-id="0:1224">
        {isLoading ? (
          <p className="mb-0 text-center">Đang tải thông điệp...</p>
        ) : message ? (
          <p className="mb-0 whitespace-pre-wrap text-justify">{message}</p>
        ) : (
          <>
            <p className="mb-0 text-justify">Gửi đến người nhận được chiếc thẻ này!</p>
            <p className="mb-0 text-justify">Mình muốn bạn biết rằng bạn thật đặc biệt trong cuộc đời mình. Mỗi khi chạm vào thẻ, hãy nhớ rằng ở đâu đó có một người luôn trân trọng, luôn nghĩ về bạn, và mong bạn bình an, hạnh phúc.</p>
            <p className="mb-0">&nbsp;</p>
            <p className="text-justify">Dù cuộc sống có bận rộn đến đâu, hãy dành một chút thời gian yêu thương chính mình và tin rằng bạn chưa bao giờ một mình.</p>
          </>
        )}
      </div>
      
      {/* Play Button with Ellipse Background */}
      <button 
        onClick={handlePlayPause}
        className="absolute size-[60px] top-[642px] translate-x-[-50%] left-1/2 cursor-pointer hover:scale-105 transition-transform" 
        data-node-id="0:1225"
      >
        <img alt="" className="block max-w-none size-full" src={ellipseIcon} />
      </button>
      
      {/* Play/Pause Icon - Clickable */}
      <button 
        onClick={handlePlayPause}
        disabled={!audioData}
        className="absolute right-1/2 translate-x-1/2 size-[24px] top-[660px] cursor-pointer hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed" 
        data-name="lets-icons:stop-fill" 
        data-node-id="0:1226"
      >
        {isPlaying ? (
          // Pause icon (2 bars)
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 5H7C6.44772 5 6 5.44772 6 6V18C6 18.5523 6.44772 19 7 19H9C9.55228 19 10 18.5523 10 18V6C10 5.44772 9.55228 5 9 5Z" fill="#17B3C1"/>
            <path d="M17 5H15C14.4477 5 14 5.44772 14 6V18C14 18.5523 14.4477 19 15 19H17C17.5523 19 18 18.5523 18 18V6C18 5.44772 17.5523 5 17 5Z" fill="#17B3C1"/>
          </svg>
        ) : (
          // Play icon (triangle)
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 6L18 12L8 18V6Z" fill="#17B3C1"/>
          </svg>
        )}
      </button>
      
      {/* Hidden Audio Element */}
      {audioData && (
        <audio 
          ref={audioRef} 
          src={audioData}
          onEnded={handleAudioEnded}
          className="hidden"
        />
      )}
      
      {/* Person 1 Avatar - Left of Stop Icon */}
      <div className="absolute right-1/2 translate-x-[150px] rounded-[14px] size-[85px] top-[637px]" data-node-id="0:1229">
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
      <div className="absolute left-1/2 translate-x-[-150px] flex items-center justify-center size-[85px] top-[637px]">
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
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover opacity-40 pointer-events-none size-full" src={hoaTiet} />
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

      {/* Navigation Arrows */}
      <NavigationArrows />
    </div>
  );
}

export default MessagesPage;


