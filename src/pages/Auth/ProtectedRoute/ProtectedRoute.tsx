import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const useAuth = () => {
  return Boolean(localStorage.getItem('authToken'));
};

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuth = useAuth();
  const location = useLocation();

  if (!isAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
