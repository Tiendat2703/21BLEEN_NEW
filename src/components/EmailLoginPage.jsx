import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import logoImage from '../images/Video Page/source_2.png';

function EmailLoginPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Vui lòng nhập email');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email.trim() })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(`Xin chào ${data.data.fullName}!`);
        // Redirect đến trang unlock với userId
        navigate(`/${data.data.userId}/unlock`);
      } else {
        setError(data.message || 'Email không tồn tại');
        toast.error(data.message || 'Email không tồn tại');
      }
    } catch (err) {
      console.error('Email verify error:', err);
      setError('Lỗi kết nối. Vui lòng thử lại.');
      toast.error('Lỗi kết nối. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: '#F4FFF8' }}>
      {/* Logo */}
      <div className="mb-8">
        <img 
          src={logoImage} 
          alt="21 Bleen Studio" 
          className="w-auto object-contain"
          style={{ 
            height: '200px',
            filter: 'none',
            imageRendering: 'high-quality'
          }}
        />
      </div>

      {/* Login Form */}
      <div className="w-full max-w-md px-6">
        <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-primary-teal">
          <h1 className="text-primary-teal font-heading text-2xl md:text-3xl text-center mb-6">
            Đăng nhập
          </h1>
          
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label className="block text-primary-teal font-body text-sm font-semibold mb-2">
                Email của bạn
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email..."
                disabled={isLoading}
                className="w-full bg-gray-50 rounded-lg px-4 py-3 text-primary-teal font-body text-lg focus:outline-none focus:ring-2 focus:ring-primary-teal focus:bg-white disabled:opacity-50"
                autoComplete="email"
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !email.trim()}
              className="w-full bg-primary-teal text-white font-body text-lg py-3 rounded-lg hover:bg-accent-green transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Đang kiểm tra...' : 'Tiếp tục'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-primary-teal text-sm opacity-70">
              Nhập email để truy cập vào tài khoản của bạn
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmailLoginPage;
