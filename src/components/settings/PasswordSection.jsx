import { useState } from 'react';
import { savePassword, getPassword } from '../../utils/localStorage';
import eyeIcon from '../../images/Setting Page/Untitled_icon/flowbite_eye-outline.svg';

function PasswordSection() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    // Only allow 4 digits
    if (value.length <= 4 && /^\d*$/.test(value)) {
      setPassword(value);
      setError('');
    }
  };

  const handleSave = () => {
    // Validate
    if (password.length !== 4) {
      setError('Mật khẩu phải có đúng 4 chữ số');
      return;
    }

    // Save to localStorage
    savePassword(password);
    setSuccess('Lưu thành công');
    setPassword('');
    
    // Clear success message after 2 seconds
    setTimeout(() => setSuccess(''), 2000);
  };

  return (
    <div className="bg-light-mint rounded-3xl p-6 border-2 border-primary-teal">
      <h2 className="text-primary-teal font-heading text-xl md:text-2xl mb-4">
        Tạo mật khẩu
      </h2>

      <div className="mb-4">
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={handlePasswordChange}
            placeholder="••••"
            maxLength={4}
            className="w-full bg-white rounded-lg px-4 py-3 pr-12 text-primary-teal font-body text-lg focus:outline-none focus:ring-2 focus:ring-primary-teal"
          />
          <button
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            <img src={eyeIcon} alt="Toggle visibility" className="w-6 h-6" />
          </button>
        </div>
        {error && (
          <p className="text-red-500 text-sm mt-2">{error}</p>
        )}
        {success && (
          <p className="text-green-600 text-sm mt-2">{success}</p>
        )}
      </div>

      <button
        onClick={handleSave}
        className="w-full bg-primary-teal text-white font-body text-lg py-3 rounded-lg hover:bg-accent-green transition-colors"
      >
        Lưu mật khẩu
      </button>
    </div>
  );
}

export default PasswordSection;











