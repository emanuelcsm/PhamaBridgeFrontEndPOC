import React, { useState } from 'react';
import { useAuth } from '../../AuthContext';
import { 
  UserAvatar, 
  LogoImage,
  UserNameDisplay,
  TabContainer,
  Tab,
  Typography
} from '../../components/common';
import { 
  PageContainer, 
  Header, 
  HeaderContent, 
  UserInfo, 
  Content,
  Logo
} from '../../components/styled';
import PendingQuotesTable from '../../components/pharmacy/PendingQuotesTable';

const MainPagePharmacy = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  
  // A função de logout foi movida para o componente UserAvatar
  
  // Função para obter as iniciais da farmácia
  const getPharmacyInitial = () => {
    if (!user?.username) return '?';
    return user.username.charAt(0).toUpperCase();
  };

  // Verificar se o usuário tem uma das funções especificadas
  const hasRole = (requiredRoles) => {
    if (!user || !user.roles) return false;
    return user.roles.some(role => requiredRoles.includes(role));
  };

  // Roles para acesso às abas
  const managerAdminRoles = ["PharmacyManager", "SuperAdmin", "PharmacyAdmin"];
  const productionRoles = [...managerAdminRoles, "PharmacyProduction"];
  const deliveryRoles = [...managerAdminRoles, "PharmacyDelivery"];

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
        <TabContainer activeTab={activeTab} onChange={setActiveTab}>
          {hasRole(managerAdminRoles) && (
            <Tab label="Novas Cotações">
              <Typography variant="h5" style={{ marginBottom: '16px' }}>Novas Cotações Pendentes</Typography>
              <PendingQuotesTable key="pending-quotes" />
            </Tab>
          )}
          
          {hasRole(managerAdminRoles) && (
            <Tab label="Cotações Respondidas">
              {/* Conteúdo para Cotações Respondidas ficará aqui */}
            </Tab>
          )}
          
          {hasRole(productionRoles) && (
            <Tab label="Pedidos">
              {/* Conteúdo para Pedidos ficará aqui */}
            </Tab>
          )}
          
          {hasRole(deliveryRoles) && (
            <Tab label="Entregas Pendentes">
              {/* Conteúdo para Entregas Pendentes ficará aqui */}
            </Tab>
          )}
        </TabContainer>
      </Content>
    </PageContainer>
  );
};

export default MainPagePharmacy;