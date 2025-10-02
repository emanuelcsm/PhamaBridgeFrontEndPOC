import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { 
  Typography, 
  Button 
} from '../../../components/common';
import { 
  PageContainer, 
  Header, 
  HeaderContent, 
  UserInfo, 
  Content,
  Logo 
} from '../../../components/styled';
import { useAuth } from '../../../AuthContext';
import { LogoImage, UserAvatar, UserNameDisplay } from '../../../components/common';
import quoteService from '../../../services/quoteService';

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const CreateOrder = () => {
  const { quoteId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [quoteDetails, setQuoteDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Função para obter as iniciais da farmácia
  const getPharmacyInitial = () => {
    if (!user?.username) return '?';
    return user.username.charAt(0).toUpperCase();
  };

  useEffect(() => {
    let isMounted = true;
    
    const fetchQuoteDetails = async () => {
      try {
        setIsLoading(true);
        const details = await quoteService.getQuoteDetails(quoteId);
        
        // Só atualiza o estado se o componente ainda estiver montado
        if (isMounted) {
          setQuoteDetails(details);
          console.log('Detalhes da cotação:', details);
        }
      } catch (err) {
        if (isMounted) {
          setError('Erro ao carregar detalhes da cotação');
          console.error('Erro ao carregar detalhes da cotação:', err);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (quoteId) {
      fetchQuoteDetails();
    }
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [quoteId]);

  const handleCancel = () => {
    navigate(-1); // Volta para a página anterior
  };

  const handleSave = () => {
    // Por enquanto não faz nada, conforme solicitado
    console.log('Botão Salvar clicado. Detalhes da cotação:', quoteDetails);
  };

  return (
    <PageContainer>
      <Header>
        <HeaderContent>
          <Logo>
            <LogoImage size="40px" clickable />
          </Logo>
          <UserInfo>
            <UserNameDisplay user={user} greeting="Olá" />
            <UserAvatar variant="pharmacy" initials={getPharmacyInitial()} />
          </UserInfo>
        </HeaderContent>
      </Header>

      <Content>
        <Typography variant="h5" style={{ marginBottom: '16px' }}>
          Criar Nova Ordem - Cotação #{quoteId}
        </Typography>

        <ButtonsContainer>
          <Button 
            variant="outline" 
            onClick={handleCancel}
          >
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSave}
          >
            Salvar
          </Button>
        </ButtonsContainer>

        {isLoading ? (
          <Typography variant="body1">Carregando detalhes da cotação...</Typography>
        ) : error ? (
          <Typography variant="body1" color="error">
            {error}
          </Typography>
        ) : quoteDetails ? (
          <Typography variant="body1">
            Página pronta para implementação adicional. Verifique o console para detalhes da cotação.
          </Typography>
        ) : (
          <Typography variant="body1" color="error">
            Cotação não encontrada.
          </Typography>
        )}
      </Content>
    </PageContainer>
  );
};

export default CreateOrder;