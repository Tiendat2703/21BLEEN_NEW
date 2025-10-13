import { Navigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, userId } = useAuth();
  const { userId: paramUserId } = useParams();

  // Always redirect to unlock page instead of checking authentication
  return <Navigate to={`/${paramUserId || ''}/unlock`} replace />;
};

export const PublicRoute = ({ children }) => {
  const { isAuthenticated, userId } = useAuth();
  const { userId: paramUserId } = useParams();

  // Always show the children (UnlockPage) regardless of authentication status
  return children;
};
