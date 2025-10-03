import { useState, useEffect } from 'react';
import { savePerson, getPerson } from '../../utils/localStorage';
import editIcon from '../../images/Setting Page/Untitled_icon/solar_pen-outline.svg';

function InfoSection() {
  const [person1Name, setPerson1Name] = useState('');
  const [person1Image, setPerson1Image] = useState(null);
  const [person2Name, setPerson2Name] = useState('');
  const [person2Image, setPerson2Image] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Load existing data
    const p1 = getPerson(1);
    const p2 = getPerson(2);
    if (p1) {
      setPerson1Name(p1.name || '');
      setPerson1Image(p1.image || null);
    }
    if (p2) {
      setPerson2Name(p2.name || '');
      setPerson2Image(p2.image || null);
    }
  }, []);

  const validateName = (name) => {
    // No numbers, no special characters
    const regex = /^[a-zA-ZÀ-ỹ\s]+$/;
    return regex.test(name);
  };

  const handleImageUpload = (personNumber, e) => {
    const file = e.target.files[0];
    if (file) {
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

  const handleSave = () => {
    setError('');

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

    // Save to localStorage
    if (person1Name || person1Image) {
      savePerson(1, { name: person1Name, image: person1Image });
    }
    if (person2Name || person2Image) {
      savePerson(2, { name: person2Name, image: person2Image });
    }

    setSuccess('Lưu thành công! Avatar đã được cập nhật trên trang Messages.');
    setTimeout(() => setSuccess(''), 3000);
    
    // Trigger a custom event to notify other components
    window.dispatchEvent(new CustomEvent('personDataUpdated'));
  };

  return (
    <div className="bg-light-mint rounded-3xl p-6 border-2 border-primary-teal">
      <h2 className="text-primary-teal font-heading text-xl md:text-2xl mb-6">
        Điền thông tin
      </h2>

      {/* Person 1 */}
      <div className="mb-6">
        <h3 className="text-primary-teal font-body font-semibold text-lg mb-3">
          Thông tin người thứ nhất
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
              className="w-full bg-white rounded-lg px-4 py-2 pr-10 text-primary-teal font-body focus:outline-none focus:ring-2 focus:ring-primary-teal"
            />
            <img src={editIcon} alt="Edit" className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Person 2 */}
      <div className="mb-6">
        <h3 className="text-primary-teal font-body font-semibold text-lg mb-3">
          Thông tin người thứ hai
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
              className="w-full bg-white rounded-lg px-4 py-2 pr-10 text-primary-teal font-body focus:outline-none focus:ring-2 focus:ring-primary-teal"
            />
            <img src={editIcon} alt="Edit" className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
          </div>
        </div>
      </div>

      {error && (
        <p className="text-red-500 text-sm mb-4">{error}</p>
      )}
      {success && (
        <p className="text-green-600 text-sm mb-4">{success}</p>
      )}

      <button
        onClick={handleSave}
        className="w-full bg-primary-teal text-white font-body text-lg py-3 rounded-lg hover:bg-accent-green transition-colors"
      >
        Lưu thông tin
      </button>
    </div>
  );
}

export default InfoSection;









