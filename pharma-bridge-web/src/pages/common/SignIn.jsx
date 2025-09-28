import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import styled from 'styled-components';
import { Card, Button, Input, Typography, Alert } from '../../components/common';

// Styled Components
const SignInContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: ${props => props.theme.spacing.md};
  background-color: ${props => props.theme.colors.surface};
`;

const SignInCard = styled(Card)`
  width: 100%;
  max-width: 450px;
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const Logo = styled.img`
  max-width: 200px;
  height: auto;
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`;

const ActionLinks = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${props => props.theme.spacing.md};
`;

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError('Por favor, preencha todos os campos');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const userData = await login(username, password);
      
      // Redirecionar com base na role do usuário
      if (userData.roles.includes('Customer')) {
        navigate('/user/home');
      } else if (userData.roles.includes('PharmacyUser')) {
        navigate('/pharmacy/home');
      } else {
        // Fallback para usuários com outras roles
        navigate('/');
      }
    } catch (err) {
      console.error('Erro ao fazer login:', err);
      setError('Credenciais inválidas. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SignInContainer>
      <SignInCard elevation={3}>
        <Card.Content>
          <LogoContainer>
            <Logo src="/logoPharmaBridge.jpg" alt="PharmaBridge Logo" />
          </LogoContainer>
          
          <Typography variant="h2" align="center" gutterBottom>
            Entrar na PharmaBridge
          </Typography>
          
          <Typography variant="body1" align="center" color="secondary" gutterBottom>
            Acesse sua conta para gerenciar seus medicamentos e receitas
          </Typography>
          
          {error && (
            <Alert variant="error" title="Erro" onClose={() => setError('')}>
              {error}
            </Alert>
          )}
          
          <FormContainer onSubmit={handleSubmit}>
            <Input
              label="Usuário"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Digite seu nome de usuário"
              fullWidth
            />
            
            <Input
              label="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              fullWidth
            />
            
            <Button 
              type="submit"
              variant="primary" 
              fullWidth 
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </FormContainer>
          
          <ActionLinks>
            <Link to="/forgot-password">
              <Typography variant="body2" color="primary">
                Esqueceu a senha?
              </Typography>
            </Link>
            <Link to="/register-user">
              <Typography variant="body2" color="primary">
                Criar nova conta
              </Typography>
            </Link>
          </ActionLinks>
        </Card.Content>
      </SignInCard>
    </SignInContainer>
  );
};

export default SignIn;