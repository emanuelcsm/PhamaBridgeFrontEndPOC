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

      </Content>
    </PageContainer>
  );
};

export default MainPageUser;