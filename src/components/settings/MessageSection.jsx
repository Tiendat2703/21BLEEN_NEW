import { useState, useEffect, useRef } from 'react';
import { saveMessage, saveAudio, getMessage, getAudio } from '../../utils/localStorage';
import micIcon from '../../images/Setting Page/Untitled_icon/Group.svg';
import undoIcon from '../../images/Setting Page/Untitled_icon/subway_redo-icon.svg';

function MessageSection() {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);
  
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => {
    // Load existing data
    const savedMessage = getMessage();
    const savedAudio = getAudio();
    setMessage(savedMessage);
    if (savedAudio) {
      setAudioUrl(savedAudio);
    }
  }, []);

  useEffect(() => {
    return () => {
      // Cleanup
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);

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
      setError('Không thể truy cập microphone. Vui lòng cho phép quyền truy cập.');
      console.error(err);
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

  const handleUndo = () => {
    if (window.confirm('Bạn có chắc muốn xóa?')) {
      setMessage('');
      setAudioBlob(null);
      setAudioUrl(null);
      setRecordingTime(0);
    }
  };

  const handleSave = async () => {
    setError('');

    // Validate: must have either text or audio
    if (!message && !audioBlob && !audioUrl) {
      setError('Vui lòng nhập tin nhắn hoặc ghi âm');
      return;
    }

    // Save message
    saveMessage(message);

    // Save audio if exists
    if (audioBlob) {
      const reader = new FileReader();
      reader.onloadend = () => {
        saveAudio(reader.result);
        setSuccess('Lưu thành công');
        setTimeout(() => setSuccess(''), 2000);
      };
      reader.readAsDataURL(audioBlob);
    } else if (audioUrl) {
      setSuccess('Lưu thành công');
      setTimeout(() => setSuccess(''), 2000);
    } else {
      setSuccess('Lưu thành công');
      setTimeout(() => setSuccess(''), 2000);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-light-mint rounded-3xl p-6 border-2 border-primary-teal">
      <h2 className="text-primary-teal font-heading text-xl md:text-2xl mb-4">
        Thông điệp được gửi gắm
      </h2>

      {/* Message Text Area */}
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Viết thông điệp bạn muốn gửi đi nhé..."
        maxLength={1000}
        className="w-full bg-white rounded-lg px-4 py-3 text-primary-teal font-body focus:outline-none focus:ring-2 focus:ring-primary-teal mb-2 min-h-[120px] resize-none"
      />
      <p className="text-primary-teal text-sm mb-4 text-right">
        {message.length}/1000 ký tự
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
        disabled={isRecording}
        className="w-full bg-primary-teal text-white font-body text-lg py-3 rounded-lg hover:bg-accent-green transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Lưu thông điệp
      </button>
    </div>
  );
}

export default MessageSection;

















