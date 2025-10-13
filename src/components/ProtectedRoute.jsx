import { Navigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, userId } = useAuth();
  const { userId: paramUserId } = useParams();

  // Always redirect to unlock page if not authenticated
  // Since we don't persist authentication, users must always enter passcode
  if (!isAuthenticated || userId !== paramUserId) {
    return <Navigate to={`/${paramUserId || ''}`} replace />;
  }

  return children;
};

export const PublicRoute = ({ children }) => {
  const { isAuthenticated, userId } = useAuth();
  const { userId: paramUserId } = useParams();

  // Since we don't persist authentication, users will always see the unlock page
  // Only redirect if currently authenticated in memory (after successful passcode entry)
  if (isAuthenticated && userId === paramUserId) {
    return <Navigate to={`/${userId}/home`} replace />;
  }

  return children;
};
