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
          <img src={logo} alt="Logo PharmaBridge" className="logo" />
          <h1 className="header-title">PharmaBridge</h1>
        </div>
        
        <div className="user-avatar-container">
          <button 
            ref={avatarRef}
            className="user-avatar-button" 
            onClick={toggleUserMenu} 
            aria-label="Menu do usuário"
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
                    Meu Perfil
                  </button>
                </li>
                <li className="user-menu-item">
                  <button onClick={() => navigate('/security')}>
                    <i className="menu-icon security-icon"></i>
                    Segurança
                  </button>
                </li>
                <li className="user-menu-divider"></li>
                <li className="user-menu-item">
                  <button onClick={handleLogout}>
                    <i className="menu-icon logout-icon"></i>
                    Sair
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </header>

      <section className="welcome-section">
        <h2>Bem-vindo ao PharmaBridge</h2>
        <p>Seu sistema completo de gestão farmacêutica</p>
      </section>
      
      <div className="user-info-card">
        <h3 className="user-greeting">Olá, {user?.firstName} {user?.lastName}</h3>
        
        <div className="user-detail">
          <span className="user-detail-label">Usuário:</span>
          <span className="user-detail-value">{user?.username}</span>
        </div>
        
        <div className="user-detail">
          <span className="user-detail-label">Email:</span>
          <span className="user-detail-value">{user?.email}</span>
        </div>
        
        <div className="roles-container">
          <div className="roles-title">Suas Funções:</div>
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
