import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../../AuthContext';
import { Typography, Button, Card, Grid, UserAvatar, LogoImage } from '../../components/common';

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

// Removido e substituído pelo componente LogoImage

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
`;

// Removido e substituído pelo componente UserAvatar

const Content = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.xl};
`;

const DashboardSection = styled.section`
  margin-bottom: ${props => props.theme.spacing.xxl};
`;

const CardGrid = styled(Grid.Row)`
  margin-top: ${props => props.theme.spacing.lg};
`;

const StyledCard = styled(Card)`
  height: 100%;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const CardIcon = styled.div`
  font-size: 48px;
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.md};
  text-align: center;
`;

const MainPageUser = () => {
  const { user } = useAuth();
  
  // A função de logout foi movida para o componente UserAvatar
  
  // Função para obter as iniciais do nome do usuário
  const getUserInitials = () => {
    if (!user?.firstName || !user?.lastName) return '?';
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
  };

  return (
    <PageContainer>
      <Header>
        <HeaderContent>
          <LogoImage clickable size="40px" />
          <UserInfo>
            <Typography variant="body1">
              Olá, {user?.firstName || 'Usuário'}
            </Typography>
            <UserAvatar variant="user" initials={getUserInitials()} />
          </UserInfo>
        </HeaderContent>
      </Header>

      <Content>
        <DashboardSection>
          <Typography variant="h2">Bem-vindo à sua área do paciente</Typography>
          <Typography variant="subtitle1">
            Gerencie suas receitas médicas, consulte histórico de medicamentos e encontre farmácias próximas.
          </Typography>

          <CardGrid>
            <Grid.Col xs={12} md={4}>
              <StyledCard clickable>
                <Card.Content>
                  <CardIcon>💊</CardIcon>
                  <Typography variant="h4" align="center">Minhas Receitas</Typography>
                  <Typography variant="body1">
                    Visualize e gerencie suas receitas médicas digitais, verifique validade e disponibilidade.
                  </Typography>
                </Card.Content>
              </StyledCard>
            </Grid.Col>

            <Grid.Col xs={12} md={4}>
              <StyledCard clickable>
                <Card.Content>
                  <CardIcon>🔍</CardIcon>
                  <Typography variant="h4" align="center">Buscar Medicamentos</Typography>
                  <Typography variant="body1">
                    Pesquise medicamentos, compare preços e verifique disponibilidade nas farmácias parceiras.
                  </Typography>
                </Card.Content>
              </StyledCard>
            </Grid.Col>

            <Grid.Col xs={12} md={4}>
              <StyledCard clickable>
                <Card.Content>
                  <CardIcon>📍</CardIcon>
                  <Typography variant="h4" align="center">Farmácias Próximas</Typography>
                  <Typography variant="body1">
                    Encontre farmácias parceiras próximas à sua localização atual ou endereço cadastrado.
                  </Typography>
                </Card.Content>
              </StyledCard>
            </Grid.Col>
          </CardGrid>
        </DashboardSection>

        <DashboardSection>
          <Typography variant="h3">Seus Medicamentos Recentes</Typography>
          
          <Card outlined>
            <Card.Content>
              <Typography variant="body1">
                Seus medicamentos recentes aparecerão aqui após serem dispensados. Ainda não há medicamentos registrados.
              </Typography>
              <Button variant="primary" style={{ marginTop: '16px' }}>
                Buscar Medicamentos
              </Button>
            </Card.Content>
          </Card>
        </DashboardSection>

        <DashboardSection>
          <Typography variant="h3">Agendamentos e Lembretes</Typography>
          
          <Card outlined>
            <Card.Content>
              <Typography variant="body1">
                Você não possui lembretes ou agendamentos ativos. Crie lembretes para tomar seus medicamentos na hora certa.
              </Typography>
              <Button variant="primary" style={{ marginTop: '16px' }}>
                Configurar Lembretes
              </Button>
            </Card.Content>
          </Card>
        </DashboardSection>
      </Content>
    </PageContainer>
  );
};

export default MainPageUser;