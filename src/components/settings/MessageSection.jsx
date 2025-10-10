import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { apiCall } from '../../utils/api';
import micIcon from '../../images/Setting Page/Untitled_icon/Group.svg';
import undoIcon from '../../images/Setting Page/Untitled_icon/subway_redo-icon.svg';

function MessageSection() {
  const { userId } = useParams();
  const { token } = useAuth();
  const [message, setMessage] = useState('');
  
  // Function to count words
  const countWords = (text) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };
  
  // Function to validate word limit
  const validateWordLimit = (text) => {
    const wordCount = countWords(text);
    return wordCount <= 100;
  };
  
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showWordLimitWarning, setShowWordLimitWarning] = useState(false);
  const [lastWarningTime, setLastWarningTime] = useState(0);
  
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const audioContextRef = useRef(null);

  useEffect(() => {
    // Load existing data from backend
    loadPostFromBackend();
    loadVoiceFromBackend();
  }, [userId, token]);

  // Auto-hide word limit warning after 3 seconds
  useEffect(() => {
    if (showWordLimitWarning) {
      const timer = setTimeout(() => {
        setShowWordLimitWarning(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showWordLimitWarning]);

  const loadPostFromBackend = async () => {
    if (!userId || !token) return;

    try {
      const { response, data } = await apiCall(`/api/posts/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        if (data.success && data.data) {
          setMessage(data.data.content || '');
        }
      }
    } catch (err) {
      console.error('Error loading post:', err);
    }
  };

  const loadVoiceFromBackend = async () => {
    if (!userId || !token) return;

    try {
      const { response, data } = await apiCall(`/api/voice/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        if (data.success && data.data) {
          setAudioUrl(data.data.file_url);
          setRecordingTime(data.data.duration || 0);
        }
      }
    } catch (err) {
      console.error('Error loading voice:', err);
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Hàm kiểm tra browser và định dạng audio hỗ trợ
  const getAudioMimeType = () => {
    const mimeTypes = [
      'audio/mp4',
      'audio/wav',
      'audio/webm',
      'audio/ogg'
    ];

    for (let mimeType of mimeTypes) {
      if (MediaRecorder.isTypeSupported(mimeType)) {
        return mimeType;
      }
    }

    // Fallback - trả về loại mặc định
    return 'audio/wav';
  };

  const startRecording = async () => {
    try {
      // Yêu cầu quyền truy cập microphone với các option phù hợp
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      const mimeType = getAudioMimeType();
      console.log('Using MIME type:', mimeType);

      // Chỉ set mimeType nếu trình duyệt hỗ trợ (tránh lỗi trên Safari)
      const options = MediaRecorder.isTypeSupported(mimeType) 
        ? { mimeType: mimeType }
        : {};
      
      mediaRecorderRef.current = new MediaRecorder(stream, options);
      
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        // Lấy MIME type thực tế từ mediaRecorder, không phải từ options
        const actualMimeType = mediaRecorderRef.current.mimeType || 'audio/mp4';
        const blob = new Blob(chunksRef.current, { type: actualMimeType });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      setError('');

      // Start timer (max 3 minutes = 180 seconds)
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= 180) {
            stopRecording();
            return 180;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      console.error('Recording error:', err);
      
      if (err.name === 'NotAllowedError') {
        setError('Bạn đã từ chối quyền truy cập microphone. Vui lòng cho phép trong cài đặt.');
      } else if (err.name === 'NotFoundError') {
        setError('Không tìm thấy microphone. Vui lòng kiểm tra thiết bị.');
      } else if (err.name === 'NotSupportedError') {
        setError('Trình duyệt của bạn không hỗ trợ ghi âm. Vui lòng sử dụng Chrome, Firefox hoặc Safari mới hơn.');
      } else {
        setError('Không thể truy cập microphone. Vui lòng cho phép quyền truy cập.');
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const handleRecordClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleUndo = async () => {
    if (window.confirm('Bạn có chắc muốn xóa thông điệp và voice?')) {
      setError('');
      setSuccess('');
      setIsLoading(true);
      
      try {
        // Xóa post (message)
        const { response: postResponse } = await apiCall(`/api/posts/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        // Xóa voice
        const { response: voiceResponse } = await apiCall(`/api/voice/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (postResponse.ok || voiceResponse.ok) {
          toast.success('Xóa thành công');
          setMessage('');
          setAudioBlob(null);
          setAudioUrl(null);
          setRecordingTime(0);
        }
      } catch (err) {
        console.error('Delete error:', err);
        toast.error('Lỗi khi xóa: ' + err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');

    // Validate: must have message text or audio
    if ((!message || message.trim().length === 0) && !audioBlob && !audioUrl) {
      setError('Vui lòng nhập tin nhắn hoặc ghi âm');
      return;
    }

    // Validate word limit for message
    if (message && message.trim().length > 0 && !validateWordLimit(message)) {
      setError('Thông điệp không được vượt quá 100 từ');
      return;
    }

    setIsLoading(true);

    try {
      let successCount = 0;
      let totalTasks = 0;

      // 1. Save message text if exists
      if (message && message.trim().length > 0) {
        totalTasks++;
        const { response, data } = await apiCall(`/api/posts/${userId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            content: message,
            type: 'text'
          })
        });
        if (response.ok && data.success) {
          successCount++;
        } else {
          throw new Error(data.message || 'Lưu message thất bại');
        }
      }

      // 2. Upload voice if recorded
      if (audioBlob) {
        totalTasks++;
        const formData = new FormData();
        
        // Lấy MIME type thực tế từ blob
        const mimeType = audioBlob.type || 'audio/mp4';
        let extension = 'mp4';
        
        if (mimeType.includes('webm')) {
          extension = 'webm';
        } else if (mimeType.includes('ogg')) {
          extension = 'ogg';
        } else if (mimeType.includes('wav')) {
          extension = 'wav';
        } else if (mimeType.includes('mp4') || mimeType.includes('mpeg')) {
          extension = 'mp4';
        }
        
        const audioFile = new File(
          [audioBlob],
          `voice_${Date.now()}.${extension}`,
          { type: mimeType }
        );
        
        formData.append('voice', audioFile);
        formData.append('userId', userId);
        formData.append('duration', recordingTime.toString());

        const { response: voiceResponse, data: voiceData } = await apiCall('/api/upload/voice', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        if (voiceResponse.ok && voiceData.success) {
          successCount++;
          setAudioUrl(voiceData.data.url);
        } else {
          throw new Error(voiceData.message || 'Upload voice thất bại');
        }
      }

      if (successCount > 0) {
        toast.success(`Lưu thành công ${successCount}/${totalTasks} phần`);
        setSuccess('Đã lưu thông điệp thành công');
        
        // Clear local audio blob sau khi upload
        setAudioBlob(null);
        
        // Reload data
        await loadPostFromBackend();
        await loadVoiceFromBackend();
        
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      console.error('Save error:', err);
      setError(err.message || 'Lỗi khi lưu thông điệp');
      toast.error('Lưu thất bại: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-light-mint rounded-3xl p-6 border-2 border-primary-teal">
      <h2 className="text-primary-teal font-heading text-xl md:text-2xl mb-2">
        Thông điệp được gửi gắm
      </h2>
      <p className="text-primary-teal text-sm mb-4 opacity-75">
        Viết thông điệp từ trái tim của bạn (tối đa 100 từ)
      </p>

      {/* Message Text Area with Frame */}
      <div className={`relative bg-white rounded-lg border-2 border-gray-200 mb-2 min-h-[120px] overflow-hidden ${
        !validateWordLimit(message) ? 'border-red-500' : 'border-gray-200'
      }`}>
        <div className="absolute inset-0 p-1">
          <div className="w-full h-full bg-gray-50 rounded-md border border-gray-100">
            <textarea
              value={message}
              onChange={(e) => {
                const newText = e.target.value;
                setMessage(newText);
                
                // Chỉ hiển thị warning một lần mỗi 2 giây để tránh spam
                const now = Date.now();
                if (!validateWordLimit(newText) && !showWordLimitWarning && (now - lastWarningTime) > 2000) {
                  setShowWordLimitWarning(true);
                  setLastWarningTime(now);
                  toast.warning('Thông điệp không được vượt quá 100 từ');
                } else if (validateWordLimit(newText) && showWordLimitWarning) {
                  setShowWordLimitWarning(false);
                }
              }}
              placeholder="Viết thông điệp bạn muốn gửi đi nhé... (tối đa 100 từ)"
              className="w-full h-full bg-transparent rounded-md px-4 py-3 text-primary-teal font-body focus:outline-none resize-none overflow-hidden"
              style={{
                boxShadow: 'none',
                border: 'none'
              }}
            />
          </div>
        </div>
      </div>
      <p className={`text-sm mb-4 text-right ${
        countWords(message) > 100 ? 'text-red-500' : 'text-primary-teal'
      }`}>
        {countWords(message)}/100 từ
      </p>

      {/* Audio Recording Controls */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={handleRecordClick}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition-colors ${
            isRecording
              ? 'bg-red-500 text-white'
              : 'bg-white text-primary-teal hover:bg-primary-teal hover:text-white'
          }`}
        >
          <img src={micIcon} alt="Mic" className="w-6 h-6" />
          <span className="font-body">
            {isRecording ? `Dừng lại (${formatTime(recordingTime)})` : 'Ghi âm lại'}
          </span>
        </button>
        
        <button
          onClick={handleUndo}
          className="px-6 py-3 bg-white text-primary-teal rounded-lg hover:bg-primary-teal hover:text-white transition-colors flex items-center gap-2"
        >
          <img src={undoIcon} alt="Undo" className="w-6 h-6" />
          <span className="font-body">Hoàn tác</span>
        </button>
      </div>

      {/* Audio Playback */}
      {audioUrl && !isRecording && (
        <div className="mb-4">
          <audio src={audioUrl} controls className="w-full" />
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
        disabled={isRecording || isLoading}
        className="w-full bg-primary-teal text-white font-body text-lg py-3 rounded-lg hover:bg-accent-green transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Đang lưu...' : 'Lưu thông điệp'}
      </button>
    </div>
  );
}

export default MessageSection;