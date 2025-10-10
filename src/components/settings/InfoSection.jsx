import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { apiCall } from '../../utils/api';
import editIcon from '../../images/Setting Page/Untitled_icon/solar_pen-outline.svg';

function InfoSection() {
  const { userId } = useParams();
  const { token } = useAuth();
  const [person1Name, setPerson1Name] = useState('');
  const [person1Image, setPerson1Image] = useState(null);
  const [person1File, setPerson1File] = useState(null);
  const [person2Name, setPerson2Name] = useState('');
  const [person2Image, setPerson2Image] = useState(null);
  const [person2File, setPerson2File] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    // Load existing data from backend
    loadBeneficiaries();
  }, [userId, token]);

  const loadBeneficiaries = async () => {
    if (!userId || !token) return;

    try {
      const { response, data } = await apiCall(`/api/beneficiaries/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        if (data.success && data.data) {
          let dataExists = false;
          
          // Load primary beneficiary
          if (data.data.primary) {
            setPerson1Name(data.data.primary.name || '');
            setPerson1Image(data.data.primary.avatar_url || null);
            if (data.data.primary.name) dataExists = true;
          }
          // Load secondary beneficiary
          if (data.data.secondary) {
            setPerson2Name(data.data.secondary.name || '');
            setPerson2Image(data.data.secondary.avatar_url || null);
            if (data.data.secondary.name) dataExists = true;
          }
          
          // Nếu có data thì không cho edit, phải click "Sửa thông tin"
          setHasData(dataExists);
          setIsEditing(!dataExists); // Nếu chưa có data thì cho edit luôn
        }
      }
    } catch (err) {
      console.error('Error loading beneficiaries:', err);
    }
  };

  const validateName = (name) => {
    // No numbers, no special characters
    const regex = /^[a-zA-ZÀ-ỹ\s]+$/;
    return regex.test(name);
  };

  const handleImageUpload = (personNumber, e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Ảnh quá lớn (> 5MB)');
        return;
      }

      // Validate file type
      if (!['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
        setError('Định dạng ảnh không hợp lệ');
        return;
      }

      // Store file for upload
      if (personNumber === 1) {
        setPerson1File(file);
      } else {
        setPerson2File(file);
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        if (personNumber === 1) {
          setPerson1Image(reader.result);
        } else {
          setPerson2Image(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');

    // Validate names
    if (person1Name && !validateName(person1Name)) {
      setError('Tên không được chứa số hoặc ký tự đặc biệt');
      return;
    }
    if (person2Name && !validateName(person2Name)) {
      setError('Tên không được chứa số hoặc ký tự đặc biệt');
      return;
    }

    // Check uniqueness
    if (person1Name && person2Name && person1Name.trim().toLowerCase() === person2Name.trim().toLowerCase()) {
      setError('Tên hai người không được trùng nhau');
      return;
    }

    setIsLoading(true);

    try {
      let uploadCount = 0;
      let totalTasks = 0;

      // Count tasks
      if (person1Name || person1File) totalTasks++;
      if (person2Name || person2File) totalTasks++;

      // Save person 1 (primary)
      if (person1Name || person1Image || person1File) {
        // Upload avatar first if there's a new file
        let avatarUrl = person1Image;
        
        if (person1File) {
          const formData = new FormData();
          formData.append('avatar', person1File);
          formData.append('userId', userId);
          formData.append('type', 'primary');

          const { response: avatarResponse, data: avatarData } = await apiCall('/api/beneficiaries/avatar', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            },
            body: formData
          });

          if (avatarResponse.ok) {
            avatarUrl = avatarData.data.avatarUrl;
          }
        }

        // Save beneficiary info
        const { response, data } = await apiCall('/api/beneficiaries', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            userId: userId,
            type: 'primary',
            name: person1Name || null,
            avatarUrl: avatarUrl
          })
        });

        if (response.ok) {
          uploadCount++;
        } else {
          const data = await response.json();
          throw new Error(data.message || 'Lỗi khi lưu thông tin người thứ nhất');
        }
      }

      // Save person 2 (secondary)
      if (person2Name || person2Image || person2File) {
        // Upload avatar first if there's a new file
        let avatarUrl = person2Image;
        
        if (person2File) {
          const formData = new FormData();
          formData.append('avatar', person2File);
          formData.append('userId', userId);
          formData.append('type', 'secondary');

          const { response: avatarResponse, data: avatarData } = await apiCall('/api/beneficiaries/avatar', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            },
            body: formData
          });

          if (avatarResponse.ok) {
            avatarUrl = avatarData.data.avatarUrl;
          }
        }

        // Save beneficiary info
        const { response, data } = await apiCall('/api/beneficiaries', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            userId: userId,
            type: 'secondary',
            name: person2Name || null,
            avatarUrl: avatarUrl
          })
        });

        if (response.ok) {
          uploadCount++;
        } else {
          const data = await response.json();
          throw new Error(data.message || 'Lỗi khi lưu thông tin người thứ hai');
        }
      }

      // Clear file states after successful upload
      setPerson1File(null);
      setPerson2File(null);

      // Reload data
      await loadBeneficiaries();

      toast.success(`Lưu thành công ${uploadCount}/${totalTasks} thông tin`);
      setSuccess('Lưu thành công! Avatar đã được cập nhật.');
      setTimeout(() => setSuccess(''), 3000);
      
      // Set hasData to true và disable editing
      setHasData(true);
      setIsEditing(false);
      
      // Trigger a custom event to notify other components
      window.dispatchEvent(new CustomEvent('personDataUpdated'));

    } catch (err) {
      console.error('Save error:', err);
      setError(err.message || 'Lỗi khi lưu thông tin');
      toast.error('Lưu thất bại: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError('');
    setSuccess('');
  };

  return (
    <div className="bg-light-mint rounded-3xl p-6 border-2 border-primary-teal">
      <h2 className="text-primary-teal font-heading text-xl md:text-2xl mb-6">
        Điền thông tin
      </h2>

      {/* Person 1 */}
      <div className="mb-6">
        <h3 className="text-primary-teal font-body font-semibold text-lg mb-3">
          {person1Name ? person1Name : 'Thông tin người thứ nhất'}
        </h3>
        <div className="flex items-center gap-4 mb-4">
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(1, e)}
              className="hidden"
            />
            <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center overflow-hidden border-2 border-primary-teal hover:border-accent-green transition-colors">
              {person1Image ? (
                <img src={person1Image} alt="Person 1" className="w-full h-full object-cover" />
              ) : (
                <span className="text-primary-teal text-3xl">+</span>
              )}
            </div>
          </label>
          <div className="flex-1 relative">
            <input
              type="text"
              value={person1Name}
              onChange={(e) => setPerson1Name(e.target.value)}
              placeholder="Nhập tên..."
              disabled={!isEditing}
              className="w-full bg-white rounded-lg px-4 py-2 pr-10 text-primary-teal font-body focus:outline-none focus:ring-2 focus:ring-primary-teal disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <img src={editIcon} alt="Edit" className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 opacity-50" />
          </div>
        </div>
      </div>

      {/* Person 2 */}
      <div className="mb-6">
        <h3 className="text-primary-teal font-body font-semibold text-lg mb-3">
          {person2Name ? person2Name : 'Thông tin người thứ hai'}
        </h3>
        <div className="flex items-center gap-4 mb-4">
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(2, e)}
              className="hidden"
            />
            <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center overflow-hidden border-2 border-primary-teal hover:border-accent-green transition-colors">
              {person2Image ? (
                <img src={person2Image} alt="Person 2" className="w-full h-full object-cover" />
              ) : (
                <span className="text-primary-teal text-3xl">+</span>
              )}
            </div>
          </label>
          <div className="flex-1 relative">
            <input
              type="text"
              value={person2Name}
              onChange={(e) => setPerson2Name(e.target.value)}
              placeholder="Nhập tên..."
              disabled={!isEditing}
              className="w-full bg-white rounded-lg px-4 py-2 pr-10 text-primary-teal font-body focus:outline-none focus:ring-2 focus:ring-primary-teal disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <img src={editIcon} alt="Edit" className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 opacity-50" />
          </div>
        </div>
      </div>

      {error && (
        <p className="text-red-500 text-sm mb-4">{error}</p>
      )}
      {success && (
        <p className="text-green-600 text-sm mb-4">{success}</p>
      )}

      {/* Hiển thị button theo trạng thái */}
      {!hasData || isEditing ? (
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="w-full bg-primary-teal text-white font-body text-lg py-3 rounded-lg hover:bg-accent-green transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Đang lưu...' : 'Lưu thông tin'}
        </button>
      ) : (
        <button
          onClick={handleEdit}
          className="w-full bg-accent-green text-white font-body text-lg py-3 rounded-lg hover:bg-primary-teal transition-colors flex items-center justify-center gap-2"
        >
          <img src={editIcon} alt="Edit" className="w-5 h-5" />
          Sửa thông tin
        </button>
      )}
    </div>
  );
}

export default InfoSection;









