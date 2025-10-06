import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute';
import EmailLoginPage from './components/EmailLoginPage';
import HomePage from './components/HomePage';
import UnlockPage from './components/UnlockPage';
import HomeAfterUnlock from './components/HomeAfterUnlock';
import SettingsPage from './components/SettingsPage';
import ImagesPage from './components/ImagesPage';
import VideoPage from './components/VideoPage';
import MessagesPage from './components/MessagesPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NavigateWithUserId = () => {
  const { userId } = useParams();
  return <Navigate to={`/${userId}/unlock`} replace />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Email login page - root route */}
      <Route path="/" element={<EmailLoginPage />} />
      
      {/* Unlock page - public route */}
      <Route path="/:userId/unlock" element={
        <PublicRoute>
          <UnlockPage />
        </PublicRoute>
      } />
      
      {/* Default userId route - redirect to unlock */}
      <Route path="/:userId" element={<NavigateWithUserId />} />
      
      {/* Protected routes */}
      <Route path="/:userId/home" element={
        <ProtectedRoute>
          <HomeAfterUnlock />
        </ProtectedRoute>
      } />
      
      <Route path="/:userId/settings" element={
        <ProtectedRoute>
          <SettingsPage />
        </ProtectedRoute>
      } />
      
      <Route path="/:userId/images" element={
        <ProtectedRoute>
          <ImagesPage />
        </ProtectedRoute>
      } />
      
      <Route path="/:userId/video" element={
        <ProtectedRoute>
          <VideoPage />
        </ProtectedRoute>
      } />
      
      <Route path="/:userId/messages" element={
        <ProtectedRoute>
          <MessagesPage />
        </ProtectedRoute>
      } />
      
      {/* Catch all other routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </AuthProvider>
    </Router>
  );
}

