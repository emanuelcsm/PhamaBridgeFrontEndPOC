import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './PasswordRecoveryPage.css';
import { requestPasswordRecovery } from '../services/authService';

const PasswordRecoveryPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setMessage({ type: 'error', text: 'Por favor, informe seu e-mail.' });
      return;
    }

    try {
      setIsLoading(true);
      await requestPasswordRecovery(email);
      setIsSuccess(true);
      setMessage({ 
        type: 'success', 
        text: 'Enviamos um e-mail com instruções para redefinir sua senha. Por favor, verifique sua caixa de entrada.' 
      });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente mais tarde.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="password-recovery-container">
      <div className="password-recovery-form">
        <h2 className="password-recovery-title">Recuperação de Senha</h2>
        
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
              {isLoading ? 'Processando...' : 'Enviar'}
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

export default PasswordRecoveryPage;