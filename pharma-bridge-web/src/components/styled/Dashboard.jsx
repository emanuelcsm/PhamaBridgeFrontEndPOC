import styled from 'styled-components';
import { Card, Grid } from '../common';

// Dashboard section component
export const DashboardSection = styled.section`
  margin-bottom: ${props => props.theme.spacing.xxl};
`;

// General section component with standard margin
export const Section = styled.section`
  margin-bottom: ${props => props.theme.spacing.xl};
`;

// Card grid component
export const CardGrid = styled(Grid.Row)`
  margin-top: ${props => props.theme.spacing.lg};
`;

// Styled card component with hover effect
export const StyledCard = styled(Card)`
  height: 100%;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }

  /* Override any props being passed down to the DOM */
  &&& {
    $outlined: none;
    $fullWidth: none;
    $padding: none;
    $clickable: none;
  }
`;

// Card icon component
export const CardIcon = styled.div`
  font-size: 48px;
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.md};
  text-align: center;
`;

// Stat card for displaying statistics
export const StatCard = styled(Card)`
  text-align: center;
  padding: ${props => props.theme.spacing.md};

  /* Override any props being passed down to the DOM */
  &&& {
    $outlined: none;
    $fullWidth: none;
    $padding: none;
    $clickable: none;
  }
  margin-bottom: ${props => props.theme.spacing.md};
`;

// Value text for statistics
export const StatValue = styled.div`
  font-size: ${props => props.theme.typography.fontSizes.xxl};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  margin: ${props => props.theme.spacing.sm} 0;
  color: ${props => props.theme.colors.primary};
`;