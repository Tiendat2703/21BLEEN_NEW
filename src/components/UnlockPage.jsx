import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { apiCall } from '../utils/api';
import 'react-toastify/dist/ReactToastify.css';

function UnlockPage() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { login } = useAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  useEffect(() => {
    // Check if password has been entered (4 digits)
    if (password.length === 4) {
      verifyPasscode();
    }
  }, [password]);

  const verifyPasscode = useCallback(async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      // Input validation
      if (!userId) {
        throw new Error('Thiếu thông tin người dùng');
      }
      
      if (password.length !== 4) {
        throw new Error('Mã PIN phải có đủ 4 chữ số');
      }
      
      // Call verification API
      const { response, data } = await apiCall('/api/auth/verify-passcode', {
        method: 'POST',
        body: JSON.stringify({
          userId: userId.trim(),
          passcode: password
        })
      });
      
      if (!response.ok) {
        throw new Error(data.message || 'Lỗi xác thực');
      }
      
      if (data.success) {
        // Set temporary authentication without storing in localStorage
        login(userId, data.data.accessToken);
        toast.success('Xác thực thành công!');
        // Stay on unlock page instead of redirecting to home
        navigate(`/${userId}/unlock`);
      } else {
        const attemptsLeft = MAX_RETRIES - retryCount - 1;
        const errorMessage = attemptsLeft > 0 
          ? `Mã PIN không đúng. Còn ${attemptsLeft} lần thử.`
          : 'Đã vượt quá số lần thử. Vui lòng thử lại sau.';
        
        setError(errorMessage);
        setPassword('');
        setRetryCount(prev => prev + 1);
        
        if (attemptsLeft <= 0) {
          // Reset after delay if max retries reached
          setTimeout(() => {
            setRetryCount(0);
            setError('');
          }, 30000); // 30 seconds cooldown
        }
      }
    } catch (err) {
      console.error('Lỗi xác thực:', err);
      setError(err.message || 'Có lỗi xảy ra, vui lòng thử lại');
      setPassword('');
    } finally {
      setIsLoading(false);
    }
  }, [password, userId, isLoading, retryCount, login, navigate]);

  const handleNumberClick = (num) => {
    if (password.length < 4 && !isLoading) {
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
      <div className="flex gap-2 md:gap-3 mb-8 justify-center">
        {[0, 1, 2, 3].map((index) => (
          <div
            key={index}
            className={`w-5 h-5 md:w-6 md:h-6 rounded-full border-[1px] border-primary-teal transition-all ${
              password.length > index ? 'bg-primary-teal' : 'bg-transparent'
            }`}
          />
        ))}
      </div>

      {/* Status Message */}
      <div className="min-h-6 mb-4 text-center">
        {isLoading ? (
          <div className="text-primary-teal">Đang xác thực...</div>
        ) : error ? (
          <div className="text-red-500 font-body text-sm md:text-base">
            {error}
          </div>
        ) : (
          <div className="text-primary-teal opacity-70 text-sm">
            {retryCount > 0 && `Thử lại lần ${retryCount + 1}/${MAX_RETRIES}`}
          </div>
        )}
      </div>

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


