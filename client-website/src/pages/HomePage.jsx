import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import logo from '../logoPharmaBridge.jpg';
import './HomePage.css';

const HomePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);
  const avatarRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && 
          !userMenuRef.current.contains(event.target) && 
          avatarRef.current && 
          !avatarRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return '';
    return `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`;
  };

  return (
    <div className="home-container">
      <header className="header">
        <div className="logo-container">
          <img src={logo} alt="PharmaBridge Logo" className="logo" />
          <h1 className="header-title">PharmaBridge</h1>
        </div>
        
        <div className="user-avatar-container">
          <button 
            ref={avatarRef}
            className="user-avatar-button" 
            onClick={toggleUserMenu} 
            aria-label="User menu"
          >
            {getUserInitials()}
          </button>
          
          {showUserMenu && (
            <div className="user-menu" ref={userMenuRef}>
              <div className="user-menu-header">
                <div className="user-menu-name">{user.firstName} {user.lastName}</div>
                <div className="user-menu-email">{user.email}</div>
              </div>
              
              <ul className="user-menu-items">
                <li className="user-menu-item">
                  <button onClick={() => navigate('/profile')}>
                    <i className="menu-icon profile-icon"></i>
                    My Profile
                  </button>
                </li>
                <li className="user-menu-item">
                  <button onClick={() => navigate('/security')}>
                    <i className="menu-icon security-icon"></i>
                    Security
                  </button>
                </li>
                <li className="user-menu-divider"></li>
                <li className="user-menu-item">
                  <button onClick={handleLogout}>
                    <i className="menu-icon logout-icon"></i>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </header>

      <section className="welcome-section">
        <h2>Welcome to PharmaBridge</h2>
        <p>Your comprehensive pharmaceutical management system</p>
      </section>
      
      <div className="user-info-card">
        <h3 className="user-greeting">Hello, {user?.firstName} {user?.lastName}</h3>
        
        <div className="user-detail">
          <span className="user-detail-label">Username:</span>
          <span className="user-detail-value">{user?.username}</span>
        </div>
        
        <div className="user-detail">
          <span className="user-detail-label">Email:</span>
          <span className="user-detail-value">{user?.email}</span>
        </div>
        
        <div className="roles-container">
          <div className="roles-title">Your Roles:</div>
          <ul className="roles-list">
            {user?.roles && user.roles.map(role => (
              <li key={role} className="role-item">{role}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
