import { useNavigate } from 'react-router-dom';
import logoChinh from '../images/Menu Sidebar/Logo chính.png';
import line1 from '../images/Menu Sidebar/Line 1.svg';

function MenuSidebar({ isOpen, onClose }) {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
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
      <div className="fixed top-0 right-0 h-full w-[288px] bg-[#f4fff8] z-50 shadow-2xl transform transition-transform duration-300 ease-in-out" data-name="Thanh menu" data-node-id="67:62">
        {/* Background */}
        <div className="absolute bg-[#f4fff8] h-[852px] left-0 top-0 w-[288px]" data-name="Nền menu" data-node-id="0:1271" />
        
        {/* Logo */}
        <div className="absolute size-[163px] top-[48px] translate-x-[-50%] left-1/2" data-name="Logo chính" data-node-id="0:1282">
          <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={logoChinh} />
        </div>

        {/* Menu Items */}
        <div className="relative">
          {/* TRANG CHỦ */}
          <button 
            onClick={() => handleNavigation('/home')}
            className="absolute flex flex-col h-[28px] justify-center top-[271px] translate-y-[-50%] w-[162px] left-1/2 translate-x-[-80px] hover:opacity-70 transition-opacity cursor-pointer" 
            data-node-id="0:1272"
            style={{
              color: '#17B3C1',
              fontFamily: 'Coiny',
              fontSize: '20px',
              fontStyle: 'normal',
              fontWeight: '400',
              lineHeight: 'normal'
            }}
          >
            <p>TRANG CHỦ</p>
          </button>
          <div className="absolute h-0 left-[44px] top-[306px] w-[200px]" data-node-id="0:1273">
            <div className="absolute inset-[-1px_-0.5%]">
              <img alt="" className="block max-w-none size-full" src={line1} />
            </div>
          </div>

          {/* HÌNH ẢNH */}
          <button 
            onClick={() => handleNavigation('/images')}
            className="absolute flex flex-col h-[28px] justify-center top-[378px] translate-y-[-50%] w-[173px] left-1/2 translate-x-[-85px] hover:opacity-70 transition-opacity cursor-pointer" 
            data-node-id="0:1274"
            style={{
              color: '#17B3C1',
              fontFamily: 'Coiny',
              fontSize: '20px',
              fontStyle: 'normal',
              fontWeight: '400',
              lineHeight: 'normal'
            }}
          >
            <p>HÌNH ẢNH</p>
          </button>
          <div className="absolute h-0 left-[44px] top-[412px] w-[200px]" data-node-id="0:1275">
            <div className="absolute inset-[-1px_-0.5%]">
              <img alt="" className="block max-w-none size-full" src={line1} />
            </div>
          </div>

          {/* VIDEO */}
          <button 
            onClick={() => handleNavigation('/video')}
            className="absolute flex flex-col h-[28px] justify-center top-[483px] translate-y-[-50%] w-[183px] left-1/2 translate-x-[-92px] hover:opacity-70 transition-opacity cursor-pointer" 
            data-node-id="0:1276"
            style={{
              color: '#17B3C1',
              fontFamily: 'Coiny',
              fontSize: '20px',
              fontStyle: 'normal',
              fontWeight: '400',
              lineHeight: 'normal'
            }}
          >
            <p>VIDEO</p>
          </button>
          <div className="absolute h-0 left-[44px] top-[517px] w-[200px]" data-node-id="0:1277">
            <div className="absolute inset-[-1px_-0.5%]">
              <img alt="" className="block max-w-none size-full" src={line1} />
            </div>
          </div>

          {/* THÔNG ĐIỆP */}
          <button 
            onClick={() => handleNavigation('/messages')}
            className="absolute flex flex-col h-[28px] justify-center top-[588px] translate-y-[-50%] w-[162px] left-1/2 translate-x-[-80px] hover:opacity-70 transition-opacity cursor-pointer" 
            data-node-id="0:1278"
            style={{
              color: '#17B3C1',
              fontFamily: 'Coiny',
              fontSize: '20px',
              fontStyle: 'normal',
              fontWeight: '400',
              lineHeight: 'normal'
            }}
          >
            <p>THÔNG ĐIỆP</p>
          </button>
          <div className="absolute h-0 left-[44px] top-[622px] w-[200px]" data-node-id="0:1279">
            <div className="absolute inset-[-1px_-0.5%]">
              <img alt="" className="block max-w-none size-full" src={line1} />
            </div>
          </div>

          {/* CÀI ĐẶT */}
          <button 
            onClick={() => handleNavigation('/settings')}
            className="absolute flex flex-col h-[29px] justify-center top-[694.5px] translate-y-[-50%] w-[183px] left-1/2 translate-x-[-90px] hover:opacity-70 transition-opacity cursor-pointer" 
            data-node-id="0:1280"
            style={{
              color: '#17B3C1',
              fontFamily: 'Coiny',
              fontSize: '20px',
              fontStyle: 'normal',
              fontWeight: '400',
              lineHeight: 'normal'
            }}
          >
            <p>CÀI ĐẶT</p>
          </button>
          <div className="absolute h-0 left-[44px] top-[729px] w-[200px]" data-node-id="0:1281">
            <div className="absolute inset-[-1px_-0.5%]">
              <img alt="" className="block max-w-none size-full" src={line1} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MenuSidebar;


