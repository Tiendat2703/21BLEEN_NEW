import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPassword } from '../utils/localStorage';

function UnlockPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if password has been entered (4 digits)
    if (password.length === 4) {
      const savedPassword = getPassword();
      
      // Default password if not set: "0000"
      const correctPassword = savedPassword || '0000';
      
      if (password === correctPassword) {
        // Correct password - navigate to home after unlock
        navigate('/home');
      } else {
        // Incorrect password
        setError('Sai mật khẩu');
        setPassword('');
        // Clear error after 2 seconds
        setTimeout(() => setError(''), 2000);
      }
    }
  }, [password, navigate]);

  const handleNumberClick = (num) => {
    if (password.length < 4) {
      setPassword(prev => prev + num);
      setError('');
    }
  };

  const handleDelete = () => {
    setPassword(prev => prev.slice(0, -1));
    setError('');
  };

  return (
    <div className="min-h-screen bg-off-white flex flex-col items-center justify-center px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-primary-teal font-heading text-2xl md:text-3xl mb-2">
          Nhập mật khẩu để mở khóa
        </h1>
        <p className="text-primary-teal font-body text-lg md:text-xl font-bold opacity-90">
          Khoá này mở ra điều kỳ diệu!
        </p>
      </div>

      {/* Password Indicators */}
      <div className="flex gap-4 md:gap-5 mb-8">
        {[0, 1, 2, 3].map((index) => (
          <div
            key={index}
            className={`w-10 h-10 md:w-12 md:h-12 rounded-full border-[2px] border-primary-teal transition-all ${
              password.length > index ? 'bg-primary-teal' : 'bg-transparent'
            }`}
          />
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 text-red-500 font-body text-sm md:text-base">
          {error}
        </div>
      )}

      {/* Number Keypad */}
      <div className="grid grid-cols-3 gap-4 max-w-xs w-full">
        {/* Numbers 1-9 */}
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            key={num}
            onClick={() => handleNumberClick(num.toString())}
            className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-light-mint text-primary-teal text-2xl md:text-3xl font-body font-semibold hover:bg-accent-green hover:text-white transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary-teal"
          >
            {num}
          </button>
        ))}

        {/* Empty space */}
        <div />

        {/* Number 0 */}
        <button
          onClick={() => handleNumberClick('0')}
          className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-light-mint text-primary-teal text-2xl md:text-3xl font-body font-semibold hover:bg-accent-green hover:text-white transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary-teal"
        >
          0
        </button>

        {/* Delete button */}
        <button
          onClick={handleDelete}
          className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-light-mint text-primary-teal text-2xl md:text-3xl font-body font-semibold hover:bg-red-400 hover:text-white transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary-teal"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default UnlockPage;


