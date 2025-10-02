import logoPhu from '../images/Home Page (After Unlock)/Untitled_img/Logo phụ.png';

function Header({ onMenuToggle }) {
  return (
    <header className="fixed top-0 left-0 right-0 bg-off-white shadow-md z-30 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <img 
          src={logoPhu} 
          alt="21 Bleen Studio" 
          className="h-10 md:h-12 object-contain"
        />

        {/* Hamburger Menu */}
        <button
          onClick={onMenuToggle}
          className="p-2 focus:outline-none focus:ring-2 focus:ring-primary-teal rounded"
          aria-label="Toggle menu"
        >
          <div className="space-y-1.5">
            <div className="w-6 h-0.5 bg-primary-teal"></div>
            <div className="w-6 h-0.5 bg-primary-teal"></div>
            <div className="w-6 h-0.5 bg-primary-teal"></div>
          </div>
        </button>
      </div>
    </header>
  );
}

export default Header;


