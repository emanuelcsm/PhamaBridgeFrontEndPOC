// Button.jsx
import React from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';

// Estilos variantes baseados nas props
const getVariantStyles = (theme, variant) => {
  const variants = {
    primary: css`
      background-color: ${theme.colors.primary};
      color: white;
      border: none;
      &:hover:not(:disabled) {
        background-color: ${theme.colors.hover.primary};
      }
    `,
    secondary: css`
      background-color: ${theme.colors.secondary};
      color: white;
      border: none;
      &:hover:not(:disabled) {
        background-color: ${theme.colors.hover.secondary};
      }
    `,
    outline: css`
      background-color: transparent;
      color: ${theme.colors.primary};
      border: ${theme.borders.width.normal} solid ${theme.colors.primary};
      &:hover:not(:disabled) {
        background-color: rgba(46, 125, 50, 0.1);
      }
    `,
    text: css`
      background-color: transparent;
      color: ${theme.colors.primary};
      border: none;
      padding: ${theme.spacing.xs} ${theme.spacing.sm};
      &:hover:not(:disabled) {
        background-color: rgba(46, 125, 50, 0.1);
      }
    `,
    error: css`
      background-color: ${theme.colors.error};
      color: white;
      border: none;
      &:hover:not(:disabled) {
        background-color: #B71C1C;
      }
    `,
  };
  return variants[variant] || variants.primary;
};

// Estilos de tamanho
const getSizeStyles = (theme, size) => {
  const sizes = {
    small: css`
      padding: ${theme.spacing.xs} ${theme.spacing.md};
      font-size: ${theme.typography.fontSizes.sm};
    `,
    medium: css`
      padding: ${theme.spacing.sm} ${theme.spacing.lg};
      font-size: ${theme.typography.fontSizes.md};
    `,
    large: css`
      padding: ${theme.spacing.md} ${theme.spacing.xl};
      font-size: ${theme.typography.fontSizes.lg};
    `,
  };
  return sizes[size] || sizes.medium;
};

const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  border-radius: ${props => props.round ? props.theme.borders.radius.pill : props.theme.borders.radius.md};
  transition: all ${props => props.theme.transitions.normal};
  cursor: pointer;
  
  ${props => getVariantStyles(props.theme, props.variant)}
  ${props => getSizeStyles(props.theme, props.size)}
  
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  svg {
    margin-right: ${props => props.iconOnly ? '0' : props.theme.spacing.xs};
    width: ${props => props.size === 'small' ? '16px' : props.size === 'large' ? '24px' : '20px'};
    height: ${props => props.size === 'small' ? '16px' : props.size === 'large' ? '24px' : '20px'};
  }
`;

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  type = 'button',
  disabled = false,
  fullWidth = false,
  round = false,
  iconOnly = false,
  startIcon,
  onClick,
  ...rest 
}) => {
  return (
    <StyledButton
      type={type}
      variant={variant}
      size={size}
      disabled={disabled}
      fullWidth={fullWidth}
      round={round}
      $iconOnly={iconOnly}
      onClick={onClick}
      {...rest}
    >
      {startIcon && startIcon}
      {children}
    </StyledButton>
  );
};

Button.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'text', 'error']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  round: PropTypes.bool,
  iconOnly: PropTypes.bool,
  startIcon: PropTypes.node,
  onClick: PropTypes.func,
};

export default Button;