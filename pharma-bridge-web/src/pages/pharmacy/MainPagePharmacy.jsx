import React from 'react';
import { useAuth } from '../../AuthContext';
import { 
  Typography, 
  Button, 
  Card, 
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
  Logo,
  DashboardSection,
  CardGrid,
  StyledCard,
  CardIcon,
  StatCard,
  Grid,
  StatValue,
  PrescriptionItem,
  PrescriptionInfo
} from '../../components/styled';

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