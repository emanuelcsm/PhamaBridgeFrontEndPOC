import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import { Typography, Button, Card, Input, Alert, UserAvatar, LogoImage } from '../../components/common';
import { authService } from '../../services/authService';

// Styled Components
const PageContainer = styled.div`
  min-height: 100vh;
  background-color: ${props => props.theme.colors.surface};
`;

const Header = styled.header`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  padding: ${props => props.theme.spacing.md};
  box-shadow: ${props => props.theme.shadows.md};
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
`;

const Logo = styled.div`
  font-size: ${props => props.theme.typography.fontSizes.xl};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  cursor: pointer;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
`;

const Content = styled.main`
  max-width: 800px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.xl};
`;

const Section = styled.section`
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const FormGroup = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const SecurityPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Função para determinar a rota de volta com base na role do usuário
  const goBackToHome = () => {
    if (user?.roles?.includes('Customer')) {
      navigate('/user/home');
    } else if (user?.roles?.includes('PharmacyUser')) {
      navigate('/pharmacy/home');
    } else {
      navigate('/');
    }
  };
  
  // Função para obter iniciais baseadas na role
  const getUserInitials = () => {
    if (user?.roles?.includes('Customer')) {
      if (!user?.firstName || !user?.lastName) return '?';
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
    } else {
      if (!user?.username) return '?';
      return user.username.charAt(0).toUpperCase();
    }
  };
  
  // Determinar a variante do avatar com base na role
  const getAvatarVariant = () => {
    return user?.roles?.includes('Customer') ? 'user' : 'pharmacy';
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validações básicas
    if (!currentPassword || !newPassword || !confirmPassword) {
      setErrorMessage('Todos os campos são obrigatórios.');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setErrorMessage('A nova senha e a confirmação não correspondem.');
      return;
    }
    
    if (newPassword.length < 6) {
      setErrorMessage('A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }
    
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    try {
      await authService.changePassword(currentPassword, newPassword);
      navigate('/');
    } catch (err) {
      console.error('Erro ao alterar a senha:', err);
    } finally {
      setLoading(false);
    }

    // try {
    //   // Aqui você chamaria seu serviço de autenticação
      
    //   // Simulação de sucesso (remover isso quando implementar a chamada real)
    //   // setTimeout(() => {
    //   //   setSuccessMessage('Senha alterada com sucesso!');
    //   //   setCurrentPassword('');
    //   //   setNewPassword('');
    //   //   setConfirmPassword('');
    //   //   setLoading(false);
    //   // }, 1000);
      
    // } catch (error) {
    //   console.error('Erro ao alterar senha:', error);
    //   setErrorMessage('Ocorreu um erro ao alterar sua senha. Verifique se a senha atual está correta.');
    //   setLoading(false);
    // }
  };
  
  return (
    <PageContainer>
      <Header>
        <HeaderContent>
          <Logo>
            <LogoImage size="40px" clickable onClick={goBackToHome} />
          </Logo>
          <UserInfo>
            <Typography variant="body1">
              {user?.roles?.includes('Customer') 
                ? `${user?.firstName || 'Usuário'} ${user?.lastName || ''}`
                : `Farmácia ${user?.username || 'Parceira'}`}
            </Typography>
            <UserAvatar 
              variant={getAvatarVariant()} 
              initials={getUserInitials()} 
            />
          </UserInfo>
        </HeaderContent>
      </Header>

      <Content>
        <Section>
          <Typography variant="h2">Segurança da Conta</Typography>
          <Typography variant="subtitle1">
            Gerencie suas informações de segurança e altere sua senha.
          </Typography>
        </Section>

        <Card>
          <Card.Content>
            <Typography variant="h3" gutterBottom>
              Alterar Senha
            </Typography>
            
            {errorMessage && (
              <Alert 
                variant="error" 
                onClose={() => setErrorMessage('')}
                style={{ marginBottom: '1rem' }}
              >
                {errorMessage}
              </Alert>
            )}
            
            {successMessage && (
              <Alert 
                variant="success" 
                onClose={() => setSuccessMessage('')}
                style={{ marginBottom: '1rem' }}
              >
                {successMessage}
              </Alert>
            )}
            
            <form onSubmit={handleSubmit}>
              <FormGroup>
                <Input 
                  type="password"
                  label="Senha Atual"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  fullWidth
                />
              </FormGroup>
              
              <FormGroup>
                <Input 
                  type="password"
                  label="Nova Senha"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  helperText="A senha deve ter pelo menos 6 caracteres."
                  fullWidth
                />
              </FormGroup>
              
              <FormGroup>
                <Input 
                  type="password"
                  label="Confirmar Nova Senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={confirmPassword && newPassword !== confirmPassword}
                  helperText={confirmPassword && newPassword !== confirmPassword ? "As senhas não correspondem." : ""}
                  fullWidth
                />
              </FormGroup>
              
              <Button 
                type="submit" 
                variant="primary"
                disabled={loading}
              >
                {loading ? 'Processando...' : 'Alterar Senha'}
              </Button>
              
              <Button 
                type="button"
                variant="outline"
                onClick={goBackToHome}
                style={{ marginLeft: '1rem' }}
              >
                Cancelar
              </Button>
            </form>
          </Card.Content>
        </Card>
        
        <Section style={{ marginTop: '2rem' }}>
          <Card outlined>
            <Card.Content>
              <Typography variant="h4" gutterBottom>
                Dicas de Segurança
              </Typography>
              <Typography variant="body1">
                • Use senhas fortes com letras, números e caracteres especiais.<br />
                • Não use a mesma senha em múltiplos sites.<br />
                • Altere suas senhas regularmente.<br />
                • Nunca compartilhe suas credenciais de acesso.<br />
                • Verifique regularmente a atividade de sua conta.
              </Typography>
            </Card.Content>
          </Card>
        </Section>
      </Content>
    </PageContainer>
  );
};

export default SecurityPage;