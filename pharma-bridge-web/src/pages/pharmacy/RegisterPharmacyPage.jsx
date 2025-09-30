import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Typography, Button, Card, Input, Alert, LogoImage, PhoneInput, ZipCodeInput } from '../../components/common';
import { registerPharmacy } from '../../services/registerService';

// Styled Components
const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing.md};
  background-color: ${props => props.theme.colors.surface};
`;

const RegisterCard = styled(Card)`
  width: 100%;
  max-width: 800px;
  box-shadow: ${props => props.theme.shadows.lg};

  /* Override any props being passed down to the DOM */
  &&& {
    $outlined: none;
    $fullWidth: none;
    $padding: none;
    $clickable: none;
  }
`;

const FormHeader = styled.div`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
`;

const FormRow = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FormActions = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${props => props.theme.spacing.lg};

  @media (max-width: 768px) {
    flex-direction: column;
    gap: ${props => props.theme.spacing.md};
  }
`;

const LoginLink = styled(Link)`
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  
  &:hover {
    text-decoration: underline;
  }
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${props => props.theme.colors.border};
  margin: ${props => props.theme.spacing.md} 0;
`;

const RegisterPharmacyPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    cnpj: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
    phoneNumber: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    adminFirstName: '',
    adminLastName: '',
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    console.log('Submitting form data:', formData);
    e.preventDefault();
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('As senhas não correspondem');
      return;
    }
    
    // Basic validation for required fields
    const requiredFields = [
      'name', 'cnpj', 'street', 'number', 'neighborhood', 
      'city', 'state', 'zipCode', 'phoneNumber', 'email', 
      'username', 'password', 'adminFirstName', 'adminLastName'
    ];
    
    for (const field of requiredFields) {
      if (!formData[field]) {
        setErrorMessage(`O campo ${field} é obrigatório`);
        return;
      }
    }
    
    // Validate CNPJ format
    // This is a simple validation, you may want to use a more robust one
    const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
    if (!cnpjRegex.test(formData.cnpj)) {
      setErrorMessage('CNPJ inválido. Use o formato: XX.XXX.XXX/XXXX-XX');
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMessage('Email inválido');
      return;
    }
    
    // Validate ZipCode and Phone formats - now handled by the specialized input components
    const zipCodeRegex = /^\d{5}-\d{3}$/;
    if (!zipCodeRegex.test(formData.zipCode)) {
      setErrorMessage('CEP inválido. Use o formato: XXXXX-XXX');
      return;
    }
    
    const phoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      setErrorMessage('Telefone inválido. Use o formato: (XX) XXXXX-XXXX');
      return;
    }
    
    setLoading(true);
    setErrorMessage('');
    
    try {
      // Chamada ao serviço de registro de farmácia
      await registerPharmacy(formData);
      
      console.log('Farmácia registrada com sucesso!');
      
      setLoading(false);
      // Redireciona para página de login após registro bem-sucedido
      navigate('/signin', { state: { message: 'Farmácia registrada com sucesso! Faça login para continuar.' } });
      
    } catch (error) {
      console.error('Erro ao registrar farmácia:', error);
      // Usa a mensagem de erro do serviço se disponível
      setErrorMessage(error.message || 'Ocorreu um erro ao registrar a farmácia. Tente novamente.');
      setLoading(false);
    }
  };
  
  return (
    <PageContainer>
      <RegisterCard>
        <Card.Content>
          <FormHeader>
            <LogoImage size="80px" clickable onClick={() => navigate('/')} />
            <Typography variant="h2" gutterBottom>
              Cadastro de Farmácia
            </Typography>
            <Typography variant="subtitle1">
              Preencha os dados abaixo para cadastrar sua farmácia na PharmaBridge
            </Typography>
          </FormHeader>
          
          {errorMessage && (
            <Alert 
              variant="error" 
              onClose={() => setErrorMessage('')} 
              style={{ marginBottom: '1rem' }}
            >
              {errorMessage}
            </Alert>
          )}
          
          <Form onSubmit={handleSubmit}>
            <Typography variant="h4">
              Dados da Farmácia
            </Typography>
            
            <FormRow>
              <FormGroup style={{ flex: 3 }}>
                <Input 
                  label="Nome da Farmácia" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange}
                  placeholder="Nome da Farmácia"
                  required
                />
              </FormGroup>
              
              <FormGroup style={{ flex: 2 }}>
                <Input 
                  label="CNPJ" 
                  name="cnpj" 
                  value={formData.cnpj} 
                  onChange={handleChange}
                  placeholder="XX.XXX.XXX/XXXX-XX"
                  required
                />
              </FormGroup>
            </FormRow>
            
            <Divider />
            <Typography variant="h4">
              Endereço
            </Typography>
            
            <FormRow>
              <FormGroup style={{ flex: 3 }}>
                <Input 
                  label="Rua" 
                  name="street" 
                  value={formData.street} 
                  onChange={handleChange}
                  placeholder="Nome da rua"
                  required
                />
              </FormGroup>
              
              <FormGroup style={{ flex: 1 }}>
                <Input 
                  label="Número" 
                  name="number" 
                  value={formData.number} 
                  onChange={handleChange}
                  placeholder="123"
                  required
                />
              </FormGroup>
            </FormRow>
            
            <FormRow>
              <FormGroup style={{ flex: 1 }}>
                <Input 
                  label="Complemento (opcional)" 
                  name="complement" 
                  value={formData.complement} 
                  onChange={handleChange}
                  placeholder="Apto, sala, etc."
                />
              </FormGroup>
              
              <FormGroup style={{ flex: 1 }}>
                <Input 
                  label="Bairro" 
                  name="neighborhood" 
                  value={formData.neighborhood} 
                  onChange={handleChange}
                  placeholder="Nome do bairro"
                  required
                />
              </FormGroup>
            </FormRow>
            
            <FormRow>
              <FormGroup style={{ flex: 2 }}>
                <Input 
                  label="Cidade" 
                  name="city" 
                  value={formData.city} 
                  onChange={handleChange}
                  placeholder="Nome da cidade"
                  required
                />
              </FormGroup>
              
              <FormGroup style={{ flex: 1 }}>
                <Input 
                  label="Estado" 
                  name="state" 
                  value={formData.state} 
                  onChange={handleChange}
                  placeholder="UF"
                  required
                />
              </FormGroup>
              
              <FormGroup style={{ flex: 1 }}>
                <ZipCodeInput 
                  label="CEP" 
                  name="zipCode" 
                  value={formData.zipCode} 
                  onChange={handleChange}
                  required
                />
              </FormGroup>
            </FormRow>
            
            <Divider />
            <Typography variant="h4">
              Informações de Contato
            </Typography>
            
            <FormRow>
              <FormGroup style={{ flex: 1 }}>
                <PhoneInput 
                  label="Telefone" 
                  name="phoneNumber" 
                  value={formData.phoneNumber} 
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              
              <FormGroup style={{ flex: 2 }}>
                <Input 
                  label="Email" 
                  name="email" 
                  type="email"
                  value={formData.email} 
                  onChange={handleChange}
                  placeholder="email@farmacia.com"
                  required
                />
              </FormGroup>
            </FormRow>
            
            <Divider />
            <Typography variant="h4">
              Dados do Administrador
            </Typography>
            
            <FormRow>
              <FormGroup style={{ flex: 1 }}>
                <Input 
                  label="Nome" 
                  name="adminFirstName" 
                  value={formData.adminFirstName} 
                  onChange={handleChange}
                  placeholder="Nome do administrador"
                  required
                />
              </FormGroup>
              
              <FormGroup style={{ flex: 1 }}>
                <Input 
                  label="Sobrenome" 
                  name="adminLastName" 
                  value={formData.adminLastName} 
                  onChange={handleChange}
                  placeholder="Sobrenome do administrador"
                  required
                />
              </FormGroup>
            </FormRow>
            
            <Divider />
            <Typography variant="h4">
              Dados de Acesso
            </Typography>
            
            <FormGroup>
              <Input 
                label="Nome de usuário" 
                name="username" 
                value={formData.username} 
                onChange={handleChange}
                placeholder="Nome de usuário para acesso"
                required
              />
            </FormGroup>
            
            <FormRow>
              <FormGroup style={{ flex: 1 }}>
                <Input 
                  label="Senha" 
                  name="password" 
                  type="password" 
                  value={formData.password} 
                  onChange={handleChange}
                  placeholder="Senha com mínimo 6 caracteres"
                  required
                />
              </FormGroup>
              
              <FormGroup style={{ flex: 1 }}>
                <Input 
                  label="Confirmar Senha" 
                  name="confirmPassword" 
                  type="password" 
                  value={formData.confirmPassword} 
                  onChange={handleChange}
                  placeholder="Confirme sua senha"
                  required
                />
              </FormGroup>
            </FormRow>
            
            <FormActions>
              <LoginLink to="/signin">
                Já tem uma conta? Faça login
              </LoginLink>
              
              <Button 
                type="submit" 
                variant="primary" 
                size="lg"
                isLoading={loading}
                disabled={loading}
              >
                Cadastrar Farmácia
              </Button>
            </FormActions>
          </Form>
        </Card.Content>
      </RegisterCard>
    </PageContainer>
  );
};

export default RegisterPharmacyPage;