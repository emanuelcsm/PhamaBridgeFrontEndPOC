import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Card, Button, Input, Typography, Alert, LogoImage } from '../../components/common';
import { resetPassword } from '../../services/authService';

// Styled Components
const ResetPasswordContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: ${props => props.theme.spacing.md};
  background-color: ${props => props.theme.colors.surface};
`;

const ResetPasswordCard = styled(Card)`
  width: 100%;
  max-width: 450px;
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`;

const ActionLinks = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${props => props.theme.spacing.md};
`;

const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extrair token da URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenFromUrl = params.get('token');
    
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setError('Token de recuperação não encontrado ou inválido');
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newPassword || !confirmPassword) {
      setError('Por favor, preencha todos os campos');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }
    
    if (newPassword.length < 6) {
      setError('A senha deve conter pelo menos 6 caracteres');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Redirecionar para a página de login após 3 segundos
      setTimeout(() => {
        navigate('/login');
      }, 3000);

      await resetPassword(token, newPassword);
      setSuccess('Senha alterada com sucesso!');
      
      // Redirecionar para a página de login após alguns segundos
      setTimeout(() => {
        navigate('/signin', { 
          state: { message: 'Sua senha foi redefinida com sucesso. Você já pode fazer login com sua nova senha.' } 
        });
      }, 3000);
    } catch (err) {
      console.error('Erro ao redefinir senha:', err);
      setError('Não foi possível redefinir sua senha. O token pode ter expirado ou ser inválido.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ResetPasswordContainer>
      <ResetPasswordCard>
        <LogoContainer>
          <LogoImage size="large" />
        </LogoContainer>
        
        <Typography variant="h1" align="center">Redefinir Senha</Typography>
        <Typography variant="body" align="center" color="textSecondary" marginBottom="lg">
          Defina uma nova senha para sua conta
        </Typography>
        
        {error && <Alert type="error" message={error} />}
        {success && <Alert type="success" message={success} />}
        
        <FormContainer onSubmit={handleSubmit}>
          <Input
            type="password"
            label="Nova senha"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Informe sua nova senha"
            fullWidth
            required
            disabled={!token || loading}
          />
          
          <Input
            type="password"
            label="Confirme a nova senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirme sua nova senha"
            fullWidth
            required
            disabled={!token || loading}
          />
          
          <Button 
            type="submit" 
            variant="primary" 
            fullWidth 
            size="large" 
            loading={loading}
            disabled={!token || loading}
          >
            Redefinir senha
          </Button>
          
          <ActionLinks>
            <Link to="/signin">
              <Button variant="text">Voltar para login</Button>
            </Link>
          </ActionLinks>
        </FormContainer>
      </ResetPasswordCard>
    </ResetPasswordContainer>
  );
};

export default ResetPasswordPage;