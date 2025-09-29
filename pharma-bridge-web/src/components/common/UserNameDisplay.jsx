import React from 'react';
import styled from 'styled-components';

// Styled div for user name display with vertical centering
const NameContainer = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
  font-size: ${props => props.theme.typography.fontSizes.md};
  font-weight: ${props => props.theme.typography.fontWeights.regular};
  color: ${props => props.theme.colors.text.primary};
`;

/**
 * Component for displaying user's name in the header
 * 
 * @param {Object} user - The user object from AuthContext
 * @param {String} [greeting] - Optional greeting text to display before name
 * @returns {React.Component} - Rendered component with user name
 */
const UserNameDisplay = ({ user, greeting }) => {
  let displayText = '';
  
  if (user?.roles?.includes('Customer')) {
    displayText = `${greeting ? `${greeting}, ` : ''}${user?.firstName || 'Usuário'} ${user?.lastName || ''}`;
  } else if (user?.roles?.includes('PharmacyUser')) {
    displayText = `${greeting ? `${greeting}, ` : ''}Farmácia ${user?.username || 'Parceira'}`;
  } else {
    displayText = `${greeting || ''} ${user?.username || 'Usuário'}`;
  }

  // Trim any extra spaces
  displayText = displayText.trim();

  return (
    <NameContainer>
      {displayText}
    </NameContainer>
  );
};

export default UserNameDisplay;