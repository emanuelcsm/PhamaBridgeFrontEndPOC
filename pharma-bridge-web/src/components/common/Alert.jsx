// Alert.jsx
import React from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';

const getVariantStyles = (theme, variant) => {
  const variants = {
    success: css`
      background-color: rgba(56, 142, 60, 0.1);
      color: ${theme.colors.success};
      border-color: ${theme.colors.success};
    `,
    error: css`
      background-color: rgba(211, 47, 47, 0.1);
      color: ${theme.colors.error};
      border-color: ${theme.colors.error};
    `,
    warning: css`
      background-color: rgba(255, 160, 0, 0.1);
      color: ${theme.colors.warning};
      border-color: ${theme.colors.warning};
    `,
    info: css`
      background-color: rgba(25, 118, 210, 0.1);
      color: ${theme.colors.info};
      border-color: ${theme.colors.info};
    `,
  };
  return variants[variant] || variants.info;
};

const StyledAlert = styled.div.attrs(props => ({
  // Filter out custom props so they don't get passed to the DOM
  // This prevents React warnings about non-standard HTML attributes
  variant: undefined,
  outlined: undefined,
  filled: undefined
}))`
  display: flex;
  align-items: flex-start;
  width: 100%;
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borders.radius.md};
  border-left: ${props => props.theme.borders.width.thick} solid;
  margin-bottom: ${props => props.theme.spacing.md};
  
  ${props => getVariantStyles(props.theme, props.variant)}
  
  ${props => props.outlined && css`
    background-color: transparent;
    border: ${props.theme.borders.width.thin} solid;
  `}
  
  ${props => props.filled && css`
    color: white;
    background-color: ${props.theme.colors[props.variant]};
    border-left: none;
  `}
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  margin-right: ${props => props.theme.spacing.sm};
  svg {
    width: 20px;
    height: 20px;
  }
`;

const ContentContainer = styled.div`
  flex: 1;
`;

const AlertTitle = styled.div`
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing.xs};
  margin-left: ${props => props.theme.spacing.sm};
  color: inherit;
  opacity: 0.7;
  transition: opacity ${props => props.theme.transitions.normal};
  
  &:hover {
    opacity: 1;
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const Alert = ({
  children,
  variant = 'info',
  icon,
  title,
  outlined = false,
  filled = false,
  onClose,
  ...rest
}) => {
  return (
    <StyledAlert
      variant={variant}
      outlined={outlined}
      filled={filled}
      {...rest}
    >
      {icon && <IconContainer>{icon}</IconContainer>}
      <ContentContainer>
        {title && <AlertTitle>{title}</AlertTitle>}
        {children}
      </ContentContainer>
      {onClose && (
        <CloseButton onClick={onClose}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" fill="currentColor"/>
          </svg>
        </CloseButton>
      )}
    </StyledAlert>
  );
};

Alert.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
  icon: PropTypes.node,
  title: PropTypes.string,
  outlined: PropTypes.bool,
  filled: PropTypes.bool,
  onClose: PropTypes.func,
};

export default Alert;