import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
// use auth
// Custom hook to access authentication context and provide auth-related data and functions
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
