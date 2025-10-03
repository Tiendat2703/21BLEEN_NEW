import { useState, useEffect } from 'react';
import { saveImages, getImages } from '../../utils/localStorage';
import uploadIcon from '../../images/Setting Page/Untitled_icon/icon-park_upload-picture.svg';

function ImageUploadSection() {
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Load existing images
    const savedImages = getImages();
    setImages(savedImages);
  }, []);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setError('');

    // Check total count
    if (images.length + files.length > 8) {
      setError('Đã đạt giới hạn 8 ảnh');
      return;
    }

    // Process each file
    files.forEach((file) => {
      // Check file size (5MB = 5242880 bytes)
      if (file.size > 5242880) {
        setError(`Ảnh ${file.name} quá lớn (> 5MB)`);
        return;
      }

      // Check file type
      if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
        setError(`Ảnh ${file.name} không đúng định dạng`);
        return;
      }

      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prev) => [
          ...prev,
          {
            data: reader.result,
            name: file.name,
            size: file.size,
            date: new Date().toISOString(),
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDelete = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    saveImages(images);
    setSuccess('Lưu thành công');
    setTimeout(() => setSuccess(''), 2000);
  };

  return (
    <div className="bg-light-mint rounded-3xl p-6 border-2 border-primary-teal">
      <h2 className="text-primary-teal font-heading text-xl md:text-2xl mb-4">
        Tải hình ảnh của bạn
      </h2>

      {/* Upload Area */}
      <label className="block mb-4 cursor-pointer">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        <div className="border-3 border-dashed border-primary-teal rounded-2xl p-8 flex flex-col items-center justify-center hover:bg-white transition-colors">
          <img src={uploadIcon} alt="Upload" className="w-16 h-16 mb-4" />
          <p className="text-primary-teal font-body text-sm text-center">
            Chỉ chọn ảnh có kích thước nhỏ hơn 5MB, tối đa 8 ảnh
          </p>
        </div>
      </label>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image.data}
                alt={image.name}
                className="w-full h-32 object-cover rounded-lg"
              />
              <button
                onClick={() => handleDelete(index)}
                className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <p className="text-primary-teal font-body text-sm mb-4">
        Đã chọn: {images.length}/8 ảnh
      </p>

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
        Lưu hình ảnh
      </button>
    </div>
  );
}

export default ImageUploadSection;

















