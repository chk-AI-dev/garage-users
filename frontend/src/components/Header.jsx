import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Header.css';
// Header component for navigation and user actions
const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('theme') === 'dark');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
// Effect to apply the dark mode class to the HTML element based on the isDarkMode state
  useEffect(() => {
    const html = document.documentElement;
    if (isDarkMode) {
      html.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <div className="logo">
            <Link to="/" className="logo-link">
              <svg className="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21l-7-5m0 0l-7 5m7-5v-9a2 2 0 012-2h2a2 2 0 012 2v9m-7-9h7m0 0l2.757 1.643A1 1 0 0021 7.243V15a2 2 0 01-2 2h-2a2 2 0 01-2-2V7.243a1 1 0 00-.757-1.243L12 5m0 0l-2.757 1.643A1 1 0 008 7.243V15a2 2 0 002 2h2a2 2 0 002-2V7.243z" />
              </svg>
              <h1>Mining Operations</h1>
            </Link>
          </div>
        </div>

        <button 
          className="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`header-nav ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          {user ? (
            <>
              <div className="user-section">
                <div className="user-info">
                  <span className="user-name">{user.firstName} {user.lastName}</span>
                  <span className="user-role">{user.role.toUpperCase()}</span>
                </div>
              </div>
              
              <div className="nav-links">
                <Link to="/dashboard" className="nav-link">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 3v9m0 0H3v9h18V3h-9m0 0V3m0 0h9" />
                  </svg>
                  Dashboard
                </Link>
                {(user.role === 'admin' || user.role === 'supervisor') && (
                  <Link to="/admin" className="nav-link admin-link">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="1" />
                      <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m5.08-5.08l4.24-4.24" />
                    </svg>
                    Admin
                  </Link>
                )}
                <Link to="/profile" className="nav-link">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
                  </svg>
                  Profile
                </Link>
              </div>

              <div className="header-actions">
                <button 
                  className="theme-toggle" 
                  onClick={toggleTheme}
                  title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
                >
                  {isDarkMode ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="12" r="5" />
                      <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m5.08-5.08l4.24-4.24" stroke="currentColor" strokeWidth="2" fill="none" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                    </svg>
                  )}
                </button>
                <button onClick={handleLogout} className="btn btn-logout">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3M16 17l5-5m0 0l-5-5m5 5H9" />
                  </svg>
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
