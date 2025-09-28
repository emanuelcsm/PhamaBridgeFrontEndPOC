import React from 'react';
import styled from 'styled-components';
import logoImage from '../../logoPharmaBridge.jpg';

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  cursor: ${props => props.clickable ? 'pointer' : 'default'};
  transition: transform 0.2s ease-in-out;
  
  &:hover {
    transform: ${props => props.clickable ? 'scale(1.05)' : 'none'};
  }
`;

const LogoImg = styled.img`
  height: ${props => props.size || '60px'};
  width: auto;
`;

const LogoImage = ({ 
  size = '60px', 
  clickable = false, 
  onClick = () => {} 
}) => {
  return (
    <LogoWrapper clickable={clickable} onClick={clickable ? onClick : undefined}>
      <LogoImg 
        src={logoImage} 
        alt="PharmaBridge Logo" 
        size={size} 
      />
    </LogoWrapper>
  );
};

export default LogoImage;