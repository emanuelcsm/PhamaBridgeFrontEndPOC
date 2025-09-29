import React from 'react';
import { useAuth } from '../../AuthContext';
import { 
  Typography, 
  Button, 
  Card, 
  Grid, 
  UserAvatar, 
  LogoImage,
  UserNameDisplay 
} from '../../components/common';
import { 
  PageContainer, 
  Header, 
  HeaderContent, 
  UserInfo, 
  Content,
  DashboardSection,
  CardGrid,
  StyledCard,
  CardIcon
} from '../../components/styled';

const MainPageUser = () => {
  const { user } = useAuth();
  
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
            <UserNameDisplay user={user} greeting="Olá" />
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