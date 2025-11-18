import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axiosInstance from '../services/axiosInstance.js';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('ecotrack_token');
  const [isValid, setIsValid] = useState(!!token);
  const [checking, setChecking] = useState(!!token);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setIsValid(false);
        setChecking(false);
        return;
      }
      try {
        await axiosInstance.get('/auth/me');
        setIsValid(true);
      } catch (error) {
        localStorage.removeItem('ecotrack_token');
        setIsValid(false);
      } finally {
        setChecking(false);
      }
    };

    verifyToken();
  }, [token]);

  if (!token || (!isValid && !checking)) {
    return <Navigate to="/login" replace />;
  }

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-500">
        Validating session...
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
