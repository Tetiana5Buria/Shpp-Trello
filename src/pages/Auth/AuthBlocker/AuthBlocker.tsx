// src/components/AuthBlocker/AuthBlocker.tsx
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const useAuth = () => {
  return Boolean(localStorage.getItem('authToken')); // ← Зміна тут!
};

export const AuthBlocker = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuth = useAuth();

  useEffect(() => {
    if (isAuth) return; // Якщо авторизований — нічого не робимо

    const currentPath = location.pathname;
    const isOnBoard = currentPath.startsWith('/board') || currentPath.startsWith('/b/');

    if (isOnBoard) {
      navigate('/login', { replace: true });
      return;
    }

    const handlePopState = () => {
      const hashPath = window.location.hash.replace('#', '') || '/';
      const isBoardPath = hashPath.startsWith('/board') || hashPath.startsWith('/b/');

      if (!isAuth && isBoardPath) {
        navigate('/login', { replace: true });
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isAuth, location, navigate]);

  return null;
};
