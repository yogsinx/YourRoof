import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

function formatApiErrorDetail(detail) {
  if (detail == null) return 'Something went wrong. Please try again.';
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail))
    return detail
      .map((e) => (e && typeof e.msg === 'string' ? e.msg : JSON.stringify(e)))
      .filter(Boolean)
      .join(' ');
  if (detail && typeof detail.msg === 'string') return detail.msg;
  return String(detail);
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAuth = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/auth/me`, {
        withCredentials: true,
      });
      setUser(data);
    } catch (error) {
      setUser(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const { data } = await axios.post(
        `${API_URL}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      setUser(data);
      return { success: true };
    } catch (error) {
      const message = formatApiErrorDetail(error.response?.data?.detail) || error.message;
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    try {
      const { data } = await axios.post(
        `${API_URL}/api/auth/register`,
        userData,
        { withCredentials: true }
      );
      setUser(data);
      return { success: true };
    } catch (error) {
      const message = formatApiErrorDetail(error.response?.data?.detail) || error.message;
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${API_URL}/api/auth/logout`, {}, { withCredentials: true });
      setUser(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
