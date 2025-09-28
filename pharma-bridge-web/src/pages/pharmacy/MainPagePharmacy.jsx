import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../../AuthContext';
import { Typography, Button, Card, Grid, Badge, UserAvatar } from '../../components/common';

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
`;

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

const StatCard = styled(Card)`
  text-align: center;
  padding: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const StatValue = styled.div`
  font-size: ${props => props.theme.typography.fontSizes.xxl};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  color: ${props => props.theme.colors.primary};
  margin: ${props => props.theme.spacing.md} 0;
`;

const PrescriptionItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.spacing.md};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  
  &:last-child {
    border-bottom: none;
  }
`;

const PrescriptionInfo = styled.div`
  flex: 1;
`;

const MainPagePharmacy = () => {
  const { user } = useAuth();
  
  // A função de logout foi movida para o componente UserAvatar
  
  // Dados fictícios para a demonstração
  const pendingPrescriptions = [
    { id: 'RX001', patientName: 'Ana Silva', medicationName: 'Losartana 50mg', date: '28/09/2025' },
    { id: 'RX002', patientName: 'João Oliveira', medicationName: 'Metformina 850mg', date: '28/09/2025' },
    { id: 'RX003', patientName: 'Maria Santos', medicationName: 'Sinvastatina 20mg', date: '27/09/2025' },
  ];

  // Função para obter as iniciais da farmácia
  const getPharmacyInitial = () => {
    if (!user?.username) return '?';
    return user.username.charAt(0).toUpperCase();
  };

  return (
    <PageContainer>
      <Header>
        <HeaderContent>
          <Logo>PharmaBridge</Logo>
          <UserInfo>
            <Typography variant="body1">
              Farmácia {user?.username || 'Parceira'}
            </Typography>
            <UserAvatar variant="pharmacy" initials={getPharmacyInitial()} />
          </UserInfo>
        </HeaderContent>
      </Header>

      <Content>
        <DashboardSection>
          <Typography variant="h2">Dashboard da Farmácia</Typography>
          <Typography variant="subtitle1">
            Gerencie suas receitas digitais, estoque de medicamentos e atendimentos.
          </Typography>

          <CardGrid>
            <Grid.Col xs={12} md={3}>
              <StatCard>
                <Typography variant="h6">Receitas Pendentes</Typography>
                <StatValue>3</StatValue>
                <Badge variant="warning" pill>Necessita Atenção</Badge>
              </StatCard>
            </Grid.Col>

            <Grid.Col xs={12} md={3}>
              <StatCard>
                <Typography variant="h6">Atendimentos Hoje</Typography>
                <StatValue>12</StatValue>
                <Badge variant="success" pill>Atualizado</Badge>
              </StatCard>
            </Grid.Col>

            <Grid.Col xs={12} md={3}>
              <StatCard>
                <Typography variant="h6">Itens com Baixo Estoque</Typography>
                <StatValue>5</StatValue>
                <Badge variant="error" pill>Atenção</Badge>
              </StatCard>
            </Grid.Col>

            <Grid.Col xs={12} md={3}>
              <StatCard>
                <Typography variant="h6">Receitas Dispensadas</Typography>
                <StatValue>142</StatValue>
                <Badge variant="info" pill>Este Mês</Badge>
              </StatCard>
            </Grid.Col>
          </CardGrid>
        </DashboardSection>

        <CardGrid>
          <Grid.Col xs={12} md={4}>
            <StyledCard clickable>
              <Card.Content>
                <CardIcon>📋</CardIcon>
                <Typography variant="h4" align="center">Gerenciar Receitas</Typography>
                <Typography variant="body1">
                  Visualize e processe receitas digitais enviadas pelos médicos e pacientes.
                </Typography>
              </Card.Content>
            </StyledCard>
          </Grid.Col>

          <Grid.Col xs={12} md={4}>
            <StyledCard clickable>
              <Card.Content>
                <CardIcon>📦</CardIcon>
                <Typography variant="h4" align="center">Controle de Estoque</Typography>
                <Typography variant="body1">
                  Gerencie seu inventário, receba alertas de baixo estoque e faça pedidos.
                </Typography>
              </Card.Content>
            </StyledCard>
          </Grid.Col>

          <Grid.Col xs={12} md={4}>
            <StyledCard clickable>
              <Card.Content>
                <CardIcon>📊</CardIcon>
                <Typography variant="h4" align="center">Relatórios</Typography>
                <Typography variant="body1">
                  Acesse relatórios de vendas, medicamentos mais dispensados e análises.
                </Typography>
              </Card.Content>
            </StyledCard>
          </Grid.Col>
        </CardGrid>

        <DashboardSection>
          <Typography variant="h3">Receitas Pendentes</Typography>
          
          <Card>
            <Card.Content>
              {pendingPrescriptions.map(prescription => (
                <PrescriptionItem key={prescription.id}>
                  <PrescriptionInfo>
                    <Typography variant="subtitle2">
                      <strong>#{prescription.id}</strong> - {prescription.patientName}
                    </Typography>
                    <Typography variant="body2">
                      {prescription.medicationName} • {prescription.date}
                    </Typography>
                  </PrescriptionInfo>
                  <Button variant="primary" size="small">
                    Processar
                  </Button>
                </PrescriptionItem>
              ))}
            </Card.Content>
            <Card.Actions>
              <Button variant="outline">Ver Todas as Receitas</Button>
            </Card.Actions>
          </Card>
        </DashboardSection>

        <DashboardSection>
          <Typography variant="h3">Alertas de Estoque</Typography>
          
          <Card outlined>
            <Card.Content>
              <Typography variant="body1">
                5 medicamentos estão com estoque abaixo do nível mínimo.
              </Typography>
              <Button variant="primary" style={{ marginTop: '16px' }}>
                Verificar Itens
              </Button>
            </Card.Content>
          </Card>
        </DashboardSection>
      </Content>
    </PageContainer>
  );
};

export default MainPagePharmacy;