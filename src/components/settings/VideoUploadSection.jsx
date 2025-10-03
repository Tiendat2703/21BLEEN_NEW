import { useState, useEffect } from 'react';
import { saveVideo, getVideo } from '../../utils/localStorage';
import videoIcon from '../../images/Setting Page/Untitled_icon/fluent_video-28-regular.svg';

function VideoUploadSection() {
  const [video, setVideo] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Load existing video
    const savedVideo = getVideo();
    if (savedVideo) {
      setVideo(savedVideo);
      setVideoPreview(savedVideo.data);
    }
  }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    setError('');

    if (!file) return;

    // Check file size (20MB = 20971520 bytes)
    if (file.size > 20971520) {
      setError('Video quá lớn (> 20MB)');
      return;
    }

    // Check file type
    if (file.type !== 'video/mp4') {
      setError('Định dạng không hỗ trợ. Vui lòng chọn file MP4');
      return;
    }

    // Create preview URL
    const url = URL.createObjectURL(file);
    setVideoPreview(url);

    // Convert to base64 for localStorage
    const reader = new FileReader();
    reader.onloadend = () => {
      setVideo({
        data: reader.result,
        name: file.name,
        size: file.size,
        type: file.type,
        date: new Date().toISOString(),
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = () => {
    setVideo(null);
    setVideoPreview(null);
  };

  const handleSave = () => {
    if (!video) {
      setError('Vui lòng chọn video');
      return;
    }

    saveVideo(video);
    setSuccess('Lưu thành công');
    setTimeout(() => setSuccess(''), 2000);
  };

  return (
    <div className="bg-light-mint rounded-3xl p-6 border-2 border-primary-teal">
      <h2 className="text-primary-teal font-heading text-xl md:text-2xl mb-4">
        Tải video của bạn
      </h2>

      {/* Upload Area */}
      {!videoPreview ? (
        <label className="block mb-4 cursor-pointer">
          <input
            type="file"
            accept="video/mp4"
            onChange={handleFileSelect}
            className="hidden"
          />
          <div className="border-3 border-dashed border-primary-teal rounded-2xl p-8 flex flex-col items-center justify-center hover:bg-white transition-colors">
            <img src={videoIcon} alt="Upload Video" className="w-16 h-16 mb-4" />
            <p className="text-primary-teal font-body text-sm text-center">
              Vui lòng tải video dung lượng dưới 20MB (định dạng MP4), nếu sai sẽ báo lỗi không thể tải video lên
            </p>
          </div>
        </label>
      ) : (
        <div className="mb-4">
          {/* Video Preview */}
          <div className="relative group">
            <video
              src={videoPreview}
              controls
              className="w-full rounded-lg max-h-96"
            />
            <button
              onClick={handleDelete}
              className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ×
            </button>
          </div>
          {video && (
            <div className="mt-2 text-primary-teal font-body text-sm">
              <p>Tên file: {video.name}</p>
              <p>Kích thước: {(video.size / 1048576).toFixed(2)} MB</p>
            </div>
          )}
        </div>
      )}

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
        Lưu video
      </button>
    </div>
  );
}

export default VideoUploadSection;











