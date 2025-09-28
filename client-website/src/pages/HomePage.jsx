import React from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="home-container">
      <h1>Welcome to PharmaBridge</h1>
      
      {user && (
        <div className="user-info">
          <h2>Hello, {user.firstName} {user.lastName}</h2>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
          <div className="roles">
            <p>Roles:</p>
            <ul>
              {user.roles.map(role => (
                <li key={role}>{role}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
      
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default HomePage;
