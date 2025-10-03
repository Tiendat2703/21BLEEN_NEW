import { useNavigate } from 'react-router-dom';
import logoChinh from '../images/Home Page (Initial Landing)/Logo chính.png';
import vectorIcon from '../images/Home Page (Initial Landing)/Vector.svg';

function HomePage() {
  const navigate = useNavigate();

  const handleFingerprintClick = () => {
    navigate('/unlock');
  };

  return (
    <div className="min-h-screen bg-off-white flex flex-col items-center justify-between py-12 px-4">
      {/* Logo Section */}
      <div className="flex-1 flex items-center justify-center">
        <img 
          src={logoChinh} 
          alt="21 Bleen Studio Logo" 
          className="w-64 md:w-80 lg:w-96 object-contain"
        />
      </div>

      {/* Fingerprint Icon */}
      <div className="pb-12">
        <button
          onClick={handleFingerprintClick}
          className="transition-transform hover:scale-110 active:scale-95 focus:outline-none"
          aria-label="Unlock"
        >
          <img 
            src={vectorIcon} 
            alt="Fingerprint Icon" 
            className="w-20 h-20 md:w-24 md:h-24 object-contain"
          />
        </button>
      </div>
    </div>
  );
}

export default HomePage;


