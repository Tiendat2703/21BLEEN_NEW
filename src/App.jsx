import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import UnlockPage from './components/UnlockPage';
import HomeAfterUnlock from './components/HomeAfterUnlock';
import SettingsPage from './components/SettingsPage';
import ImagesPage from './components/ImagesPage';
import VideoPage from './components/VideoPage';
import MessagesPage from './components/MessagesPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/unlock" element={<UnlockPage />} />
        <Route path="/home" element={<HomeAfterUnlock />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/images" element={<ImagesPage />} />
        <Route path="/video" element={<VideoPage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
