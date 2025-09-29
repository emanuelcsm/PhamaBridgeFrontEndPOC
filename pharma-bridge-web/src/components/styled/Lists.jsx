import styled from 'styled-components';

// Item container for prescription lists
export const PrescriptionItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.spacing.sm} 0;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  
  &:last-child {
    border-bottom: none;
  }
`;

// Information section for prescription items
export const PrescriptionInfo = styled.div`
  flex-grow: 1;
`;

// Container for a list of items with standard spacing
export const ItemList = styled.div`
  > * + * {
    margin-top: ${props => props.theme.spacing.sm};
  }
`;

// Container for any kind of action buttons
export const ActionContainer = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  align-items: center;
`;