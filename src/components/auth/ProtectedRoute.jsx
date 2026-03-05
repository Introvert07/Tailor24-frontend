import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ProtectedRoute({ children }) {
  const { token, user } = useSelector(s => s.auth);
  const location        = useLocation();

  // Debug — remove these console logs once working
  console.log('🔐 ProtectedRoute check:', {
    hasToken:    !!token,
    hasUser:     !!user,
    tokenValue:  token?.slice(0, 20) + '...',
    goingTo:     location.pathname,
    localStorageToken: !!localStorage.getItem('tailor24_token'),
  });

  if (!token) {
    console.warn('❌ No token found — redirecting to /login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}