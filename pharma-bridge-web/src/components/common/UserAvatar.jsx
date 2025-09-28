import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';

const AvatarContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const StyledAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${props => props.variant === 'pharmacy' 
    ? props.theme.colors.secondary 
    : props.theme.colors.accent};
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.sm};
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 45px;
  right: 0;
  background-color: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borders.radius.md};
  box-shadow: ${props => props.theme.shadows.lg};
  width: 180px;
  z-index: 1000;
  overflow: hidden;
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transform: ${props => props.isOpen ? 'translateY(0)' : 'translateY(-10px)'};
  transition: opacity 0.2s, visibility 0.2s, transform 0.2s;
`;

const MenuItem = styled.div`
  padding: ${props => props.theme.spacing.md};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${props => props.theme.colors.surface};
  }
  
  svg {
    width: 18px;
    height: 18px;
    color: ${props => props.theme.colors.text.secondary};
  }
`;

const MenuDivider = styled.div`
  height: 1px;
  background-color: ${props => props.theme.colors.border};
  margin: 0;
`;

const UserAvatar = ({ variant = 'user', initials }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const avatarRef = useRef(null);
  
  // Fechar o menu quando clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target) && 
        avatarRef.current && 
        !avatarRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const handleSecurityClick = () => {
    navigate('/security');
    setIsMenuOpen(false);
  };
  
  const handleSignOut = () => {
    logout();
    // O redirecionamento para o signin será feito pelo ProtectedRoute após o logout
  };
  
  return (
    <AvatarContainer>
      <StyledAvatar 
        variant={variant} 
        onClick={toggleMenu} 
        ref={avatarRef}
      >
        {initials}
      </StyledAvatar>
      
      <DropdownMenu isOpen={isMenuOpen} ref={menuRef}>
        <MenuItem onClick={handleSecurityClick}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Segurança
        </MenuItem>
        <MenuDivider />
        <MenuItem onClick={handleSignOut}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sair
        </MenuItem>
      </DropdownMenu>
    </AvatarContainer>
  );
};

export default UserAvatar;