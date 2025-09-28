import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import authService from '../services/authService';
import './SecurityPage.css';

const SecurityPage = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const validateForm = () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setError('Todos os campos são obrigatórios');
      return false;
    }

    if (newPassword !== confirmNewPassword) {
      setError('As novas senhas não coincidem');
      return false;
    }

    if (newPassword.length < 8) {
      setError('A senha deve ter pelo menos 8 caracteres');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await authService.changePassword(currentPassword, newPassword);
      setSuccess('Senha alterada com sucesso');
      
      // Clear the form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Falha ao alterar a senha. Por favor, tente novamente.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="security-container">
      <header className="security-header">
        <button onClick={() => navigate('/')} className="back-button">
          <span className="back-icon"></span>
          Voltar para Início
        </button>
        <h1 className="security-title">Configurações de Segurança</h1>
      </header>

      <div className="security-card">
        <h2 className="security-card-title">
          <span className="security-icon"></span>
          Alterar Senha
        </h2>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="currentPassword">Senha Atual</label>
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">Nova Senha</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <div className="password-requirements">
              A senha deve ter pelo menos 8 caracteres
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmNewPassword">Confirmar Nova Senha</label>
            <input
              type="password"
              id="confirmNewPassword"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="submit-button"
            disabled={isLoading}
          >
            {isLoading ? 'Alterando Senha...' : 'Alterar Senha'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SecurityPage;