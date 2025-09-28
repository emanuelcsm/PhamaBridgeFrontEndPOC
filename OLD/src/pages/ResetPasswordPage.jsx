import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { resetPassword } from '../services/authService';
import './ResetPasswordPage.css';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (!tokenFromUrl) {
      setMessage({ type: 'error', text: 'Token de redefinição de senha não fornecido ou inválido.' });
      return;
    }
    setToken(tokenFromUrl);
  }, [searchParams]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (!formData.newPassword) {
      setMessage({ type: 'error', text: 'Por obséquio, informe a nova senha.' });
      return false;
    }
    
    if (formData.newPassword.length < 8) {
      setMessage({ type: 'error', text: 'A senha deve ter pelo menos 8 caracteres.' });
      return false;
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'As senhas não coincidem.' });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      await resetPassword(token, formData.newPassword);
      setIsSuccess(true);
      setMessage({ 
        type: 'success', 
        text: 'Sua senha foi redefinida com sucesso!' 
      });
      
      // Redirecionar para a página de login após 3 segundos
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Ocorreu um erro ao redefinir sua senha. O link pode ter expirado.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-form">
        <h2 className="reset-password-title">Crie uma nova Senha</h2>
        
        {message && (
          <div className={`alert alert-${message.type}`}>
            {message.text}
          </div>
        )}

        {!token && !isSuccess && (
          <div className="back-link">
            <Link to="/forgot-password">Voltar para recuperação de senha</Link>
          </div>
        )}

        {token && !isSuccess && (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="newPassword">Nova Senha</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Digite sua nova senha"
                required
                minLength="8"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirme a Nova Senha</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirme sua nova senha"
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="submit-button" 
              disabled={isLoading}
            >
              {isLoading ? 'Processando...' : 'Redefinir Senha'}
            </button>
          </form>
        )}
        
        {isSuccess && (
          <div className="back-link">
            <p>Redirecionando para a página de login...</p>
            <Link to="/login">Ir para o login agora</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;