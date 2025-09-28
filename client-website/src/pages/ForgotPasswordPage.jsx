import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../services/authService';
import './ForgotPasswordPage.css';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setMessage({ type: 'error', text: 'Por favor, informe seu e-mail.' });
      return;
    }

    try {
      setIsLoading(true);
      await forgotPassword(email);
      setIsSuccess(true);
      setMessage({ 
        type: 'success', 
        text: 'Enviamos um e-mail com instruções para redefinir sua senha. Por favor, verifique sua caixa de entrada.' 
      });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente mais tarde.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-form">
        <h2 className="forgot-password-title">Esqueci minha senha</h2>
        
        {message && (
          <div className={`alert alert-${message.type}`}>
            {message.text}
          </div>
        )}

        {!isSuccess ? (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Informe seu e-mail cadastrado"
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="submit-button" 
              disabled={isLoading}
            >
              {isLoading ? 'Enviando...' : 'Recuperar senha'}
            </button>
            
            <div className="back-link">
              <Link to="/login">Voltar para o login</Link>
            </div>
          </form>
        ) : (
          <div className="back-link">
            <Link to="/login">Voltar para o login</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;