import { useNavigate, useParams } from 'react-router-dom';
import logoChinh from '../images/Menu Sidebar/Logo chính.png';
import line1 from '../images/Menu Sidebar/Line 1.svg';

export default function MenuSidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { userId } = useParams();

  const handleNavigation = (pathSuffix) => {
    if (!userId) return;
    const normalized = pathSuffix.startsWith('/') ? pathSuffix.slice(1) : pathSuffix;
    navigate(`/${userId}/${normalized}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed top-0 right-0 h-full w-[280px] sm:w-[300px] md:w-[320px] bg-[#f4fff8] z-50 shadow-2xl transform transition-transform duration-300 ease-in-out" data-name="Thanh menu" data-node-id="67:62">
        {/* Background */}
        <div className="absolute bg-[#f4fff8] h-full left-0 top-0 w-full" data-name="Nền menu" data-node-id="0:1271" />
        
        {/* Logo */}
        <div className="absolute size-[120px] sm:size-[140px] md:size-[163px] top-[32px] sm:top-[40px] md:top-[48px] translate-x-[-50%] left-1/2" data-name="Logo chính" data-node-id="0:1282">
          <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={logoChinh} />
        </div>

        {/* Menu Items */}
        <div className="relative pt-[180px] sm:pt-[200px] md:pt-[220px] px-3 sm:px-4 md:px-6">
          {/* TRANG CHỦ */}
          <div className="mb-4 sm:mb-6 md:mb-8">
            <button 
              onClick={() => handleNavigation('home')}
              className="w-full flex flex-col h-[24px] sm:h-[26px] md:h-[28px] justify-center hover:opacity-70 transition-opacity cursor-pointer" 
              data-node-id="0:1272"
              style={{
                color: '#17B3C1',
                fontFamily: 'Coiny',
                fontSize: '16px',
                fontStyle: 'normal',
                fontWeight: '400',
                lineHeight: 'normal'
              }}
            >
              <p className="text-center">TRANG CHỦ</p>
            </button>
            <div className="mt-2 h-0 w-full" data-node-id="0:1273">
              <div className="w-full h-full">
                <img alt="" className="block w-full h-full object-contain" src={line1} />
              </div>
            </div>
          </div>

          {/* HÌNH ẢNH */}
          <div className="mb-4 sm:mb-6 md:mb-8">
            <button 
              onClick={() => handleNavigation('images')}
              className="w-full flex flex-col h-[24px] sm:h-[26px] md:h-[28px] justify-center hover:opacity-70 transition-opacity cursor-pointer" 
              data-node-id="0:1274"
              style={{
                color: '#17B3C1',
                fontFamily: 'Coiny',
                fontSize: '16px',
                fontStyle: 'normal',
                fontWeight: '400',
                lineHeight: 'normal'
              }}
            >
              <p className="text-center">HÌNH ẢNH</p>
            </button>
            <div className="mt-2 h-0 w-full" data-node-id="0:1275">
              <div className="w-full h-full">
                <img alt="" className="block w-full h-full object-contain" src={line1} />
              </div>
            </div>
          </div>

          {/* VIDEO */}
          <div className="mb-4 sm:mb-6 md:mb-8">
            <button 
              onClick={() => handleNavigation('video')}
              className="w-full flex flex-col h-[24px] sm:h-[26px] md:h-[28px] justify-center hover:opacity-70 transition-opacity cursor-pointer" 
              data-node-id="0:1276"
              style={{
                color: '#17B3C1',
                fontFamily: 'Coiny',
                fontSize: '16px',
                fontStyle: 'normal',
                fontWeight: '400',
                lineHeight: 'normal'
              }}
            >
              <p className="text-center">VIDEO</p>
            </button>
            <div className="mt-2 h-0 w-full" data-node-id="0:1277">
              <div className="w-full h-full">
                <img alt="" className="block w-full h-full object-contain" src={line1} />
              </div>
            </div>
          </div>

          {/* THÔNG ĐIỆP */}
          <div className="mb-4 sm:mb-6 md:mb-8">
            <button 
              onClick={() => handleNavigation('messages')}
              className="w-full flex flex-col h-[24px] sm:h-[26px] md:h-[28px] justify-center hover:opacity-70 transition-opacity cursor-pointer" 
              data-node-id="0:1278"
              style={{
                color: '#17B3C1',
                fontFamily: 'Coiny',
                fontSize: '16px',
                fontStyle: 'normal',
                fontWeight: '400',
                lineHeight: 'normal'
              }}
            >
              <p className="text-center">THÔNG ĐIỆP</p>
            </button>
            <div className="mt-2 h-0 w-full" data-node-id="0:1279">
              <div className="w-full h-full">
                <img alt="" className="block w-full h-full object-contain" src={line1} />
              </div>
            </div>
          </div>

          {/* CÀI ĐẶT */}
          <div className="mb-4 sm:mb-6 md:mb-8">
            <button 
              onClick={() => handleNavigation('settings')}
              className="w-full flex flex-col h-[24px] sm:h-[26px] md:h-[28px] justify-center hover:opacity-70 transition-opacity cursor-pointer" 
              data-node-id="0:1280"
              style={{
                color: '#17B3C1',
                fontFamily: 'Coiny',
                fontSize: '16px',
                fontStyle: 'normal',
                fontWeight: '400',
                lineHeight: 'normal'
              }}
            >
              <p className="text-center">CÀI ĐẶT</p>
            </button>
            <div className="mt-2 h-0 w-full" data-node-id="0:1281">
              <div className="w-full h-full">
                <img alt="" className="block w-full h-full object-contain" src={line1} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
