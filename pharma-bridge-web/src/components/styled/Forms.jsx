import styled from 'styled-components';

// Standard form group with bottom margin
export const FormGroup = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};
`;

// Form container with standard styling
export const Form = styled.form`
  width: 100%;
`;

// Form actions container for buttons
export const FormActions = styled.div`
  display: flex;
  justify-content: ${props => props.justify || 'flex-start'};
  gap: ${props => props.theme.spacing.md};
  margin-top: ${props => props.theme.spacing.lg};
`;