import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Card, Button, Input, Typography, Alert, LogoImage } from '../../components/common';
import { forgotPassword } from '../../services/authService';

// Styled Components
const ForgotPasswordContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: ${props => props.theme.spacing.md};
  background-color: ${props => props.theme.colors.surface};
`;

const ForgotPasswordCard = styled(Card)`
  width: 100%;
  max-width: 450px;

  /* Override any props being passed down to the DOM */
  &&& {
    $outlined: none;
    $fullWidth: none;
    $padding: none;
    $clickable: none;
  }
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
  justify-content: space-between;
  margin-top: ${props => props.theme.spacing.md};
`;

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Por favor, informe seu e-mail');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await forgotPassword(email);
      setSuccess('Um link de recuperação de senha foi enviado para o seu e-mail');
      setEmail(''); // Limpar campo após sucesso
    } catch (err) {
      console.error('Erro ao solicitar recuperação de senha:', err);
      setError('Não foi possível processar sua solicitação. Verifique o e-mail e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ForgotPasswordContainer>
      <ForgotPasswordCard>
        <LogoContainer>
          <LogoImage size="large" />
        </LogoContainer>
        
        <Typography variant="h1" align="center">Recuperação de Senha</Typography>
        <Typography variant="body" align="center" color="textSecondary" marginBottom="lg">
          Informe seu e-mail cadastrado para receber um link de recuperação de senha.
        </Typography>
        
        {error && <Alert type="error" message={error} />}
        {success && <Alert type="success" message={success} />}
        
        <FormContainer onSubmit={handleSubmit}>
          <Input
            type="email"
            label="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Informe seu e-mail"
            fullWidth
            required
          />
          
          <Button 
            type="submit" 
            variant="primary" 
            fullWidth 
            size="large" 
            loading={loading}
            disabled={loading}
          >
            Enviar link de recuperação
          </Button>
          
          <ActionLinks>
            <Link to="/signin">
              <Button variant="text">Voltar para login</Button>
            </Link>
          </ActionLinks>
        </FormContainer>
      </ForgotPasswordCard>
    </ForgotPasswordContainer>
  );
};

export default ForgotPasswordPage;