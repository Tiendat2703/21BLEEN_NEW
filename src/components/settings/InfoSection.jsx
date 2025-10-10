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

  // Function to get EXIF orientation and fix image rotation
  const getImageOrientation = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const view = new DataView(e.target.result);
        if (view.getUint16(0, false) !== 0xFFD8) {
          resolve(-2); // Not a JPEG
          return;
        }
        const length = view.byteLength;
        let offset = 2;
        while (offset < length) {
          const marker = view.getUint16(offset, false);
          if (marker === 0xFFE1) {
            if (view.getUint32(offset += 2, false) !== 0x45786966) {
              resolve(-1);
              return;
            }
            const little = view.getUint16(offset += 6, false) === 0x4949;
            offset += view.getUint32(offset + 4, little);
            const tags = view.getUint16(offset, little);
            offset += 2;
            for (let i = 0; i < tags; i++) {
              if (view.getUint16(offset + (i * 12), little) === 0x0112) {
                resolve(view.getUint16(offset + (i * 12) + 8, little));
                return;
              }
            }
          } else if ((marker & 0xFF00) !== 0xFF00) {
            break;
          } else {
            offset += view.getUint16(offset, false);
          }
        }
        resolve(-1);
      };
      reader.readAsArrayBuffer(file.slice(0, 64 * 1024));
    });
  };

  // Function to apply orientation correction
  const applyOrientation = (canvas, ctx, orientation) => {
    const { width, height } = canvas;
    
    switch (orientation) {
      case 2:
        ctx.transform(-1, 0, 0, 1, width, 0);
        break;
      case 3:
        ctx.transform(-1, 0, 0, -1, width, height);
        break;
      case 4:
        ctx.transform(1, 0, 0, -1, 0, height);
        break;
      case 5:
        ctx.transform(0, 1, 1, 0, 0, 0);
        break;
      case 6:
        ctx.transform(0, 1, -1, 0, height, 0);
        break;
      case 7:
        ctx.transform(0, -1, -1, 0, height, width);
        break;
      case 8:
        ctx.transform(0, -1, 1, 0, 0, width);
        break;
      default:
        return;
    }
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

      // Create preview with proper orientation
      const reader = new FileReader();
      reader.onloadend = async () => {
        const img = new Image();
        img.onload = async () => {
          try {
            // Get EXIF orientation
            const orientation = await getImageOrientation(file);
            
            // Create canvas to fix orientation
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Set canvas size based on orientation
            if (orientation >= 5 && orientation <= 8) {
              canvas.width = img.height;
              canvas.height = img.width;
            } else {
              canvas.width = img.width;
              canvas.height = img.height;
            }
            
            // Apply orientation correction
            ctx.save();
            applyOrientation(canvas, ctx, orientation);
            
            // Draw image with correct orientation
            ctx.drawImage(img, 0, 0);
            ctx.restore();
            
            // Convert to data URL
            const correctedDataUrl = canvas.toDataURL('image/jpeg', 0.9);
            
            if (personNumber === 1) {
              setPerson1Image(correctedDataUrl);
            } else {
              setPerson2Image(correctedDataUrl);
            }
          } catch (error) {
            console.error('Error processing image orientation:', error);
            // Fallback to original image if orientation processing fails
            if (personNumber === 1) {
              setPerson1Image(reader.result);
            } else {
              setPerson2Image(reader.result);
            }
          }
        };
        img.src = reader.result;
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

      {/* Two People Layout - Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Person 1 - Left Side */}
        <div className="space-y-4">
          <h3 className="text-primary-teal font-body font-semibold text-lg">
            {person1Name ? person1Name : 'Thông tin người thứ nhất'}
          </h3>
          <div className="flex items-center gap-4">
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

        {/* Person 2 - Right Side */}
        <div className="space-y-4">
          <h3 className="text-primary-teal font-body font-semibold text-lg">
            {person2Name ? person2Name : 'Thông tin người thứ hai'}
          </h3>
          <div className="flex items-center gap-4">
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









