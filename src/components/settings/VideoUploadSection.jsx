import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { apiCall } from '../../utils/api';
import videoIcon from '../../images/Setting Page/Untitled_icon/fluent_video-28-regular.svg';

function VideoUploadSection() {
  const { userId } = useParams();
  const { token } = useAuth();
  const [video, setVideo] = useState(null);
  const [videoFile, setVideoFile] = useState(null); // Store File object
  const [videoPreview, setVideoPreview] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    // Load existing video from backend
    loadExistingVideo();
  }, [userId, token]);

  const loadExistingVideo = async () => {
    if (!userId || !token) return;

    try {
      const response = await fetch(`/api/video/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setVideo({
            id: data.data.id,
            data: data.data.file_url,
            name: data.data.file_name,
            size: data.data.file_size,
            type: data.data.file_type,
            duration: data.data.duration
          });
          setVideoPreview(data.data.file_url);
        }
      }
    } catch (err) {
      console.error('Error loading video:', err);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    setError('');

    if (!file) return;

    // Check file size (100MB max for backend)
    if (file.size > 100 * 1024 * 1024) {
      setError('Video quá lớn (> 100MB)');
      return;
    }

    // Check file type
    const allowedTypes = ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/webm'];
    if (!allowedTypes.includes(file.type)) {
      setError('Định dạng không hỗ trợ. Vui lòng chọn file MP4, MPEG, MOV hoặc WebM');
      return;
    }

    // Store file object for upload
    setVideoFile(file);

    // Create preview URL
    const url = URL.createObjectURL(file);
    setVideoPreview(url);

    // Set video info
    setVideo({
      name: file.name,
      size: file.size,
      type: file.type,
      date: new Date().toISOString(),
      isNew: true
    });
  };

  const handleDelete = async () => {
    // If video has ID, delete from backend
    if (video && video.id) {
      try {
        const response = await fetch(`/api/video/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          toast.success('Xóa video thành công');
        }
      } catch (err) {
        console.error('Error deleting video:', err);
        toast.error('Lỗi khi xóa video');
        return;
      }
    }

    // Clear local state
    setVideo(null);
    setVideoFile(null);
    setVideoPreview(null);
  };

  const handleSave = async () => {
    if (!videoFile) {
      setError('Vui lòng chọn video để upload');
      return;
    }

    setIsUploading(true);
    setError('');
    setSuccess('');

    try {
      // Create FormData
      const formData = new FormData();
      formData.append('video', videoFile);
      formData.append('userId', userId);

      // Get video duration if available
      const videoElement = document.createElement('video');
      videoElement.src = videoPreview;
      videoElement.onloadedmetadata = async () => {
        formData.append('duration', videoElement.duration.toString());
      };

      const { response, data } = await apiCall('/api/upload/video', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok && data.success) {
        toast.success('Upload video thành công');
        setSuccess('Đã lưu video thành công');
        
        // Clear local state
        setVideoFile(null);
        
        // Reload video from backend
        await loadExistingVideo();
        
        setTimeout(() => setSuccess(''), 3000);
      } else {
        throw new Error(data.message || 'Upload thất bại');
      }
    } catch (err) {
      console.error('Upload error:', err);
      
      // Check if token expired
      if (err.message && (err.message.includes('Token') || err.message.includes('hết hạn') || err.message.includes('403'))) {
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        setError('Phiên đăng nhập đã hết hạn');
        // Auto logout after 2 seconds
        setTimeout(() => {
          localStorage.clear();
          window.location.href = `/${userId}/unlock`;
        }, 2000);
        return;
      }
      
      setError(err.message || 'Lỗi khi upload video');
      toast.error('Upload thất bại: ' + err.message);
    } finally {
      setIsUploading(false);
    }
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
            accept="video/mp4,video/mpeg,video/quicktime,video/webm"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isUploading}
          />
          <div className="border-3 border-dashed border-primary-teal rounded-2xl p-8 flex flex-col items-center justify-center hover:bg-white transition-colors">
            <img src={videoIcon} alt="Upload Video" className="w-16 h-16 mb-4" />
            <p className="text-primary-teal font-body text-sm text-center">
              Tải video dưới 100MB (MP4, MPEG, MOV, WebM)
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
            {video && video.isNew && (
              <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
                Mới
              </div>
            )}
            <button
              onClick={handleDelete}
              disabled={isUploading}
              className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
            >
              ×
            </button>
          </div>
          {video && (
            <div className="mt-2 text-primary-teal font-body text-sm">
              <p>Tên file: {video.name}</p>
              <p>Kích thước: {(video.size / 1048576).toFixed(2)} MB</p>
              {video.duration && <p>Thời lượng: {Math.floor(video.duration)}s</p>}
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
        disabled={isUploading || !videoFile}
        className="w-full bg-primary-teal text-white font-body text-lg py-3 rounded-lg hover:bg-accent-green transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isUploading ? 'Đang upload...' : videoFile ? 'Upload video lên server' : 'Lưu video'}
      </button>
    </div>
  );
}

export default VideoUploadSection;

















