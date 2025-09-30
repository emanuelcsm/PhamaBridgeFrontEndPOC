// Input.jsx
import React, { forwardRef } from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: ${props => props.theme.spacing.md};
  width: ${props => props.$fullWidth ? '100%' : 'auto'};
`;

const Label = styled.label`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  margin-bottom: ${props => props.theme.spacing.xs};
  color: ${props => props.theme.colors.text.secondary};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
`;

const InputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const IconWrapper = styled.span`
  position: absolute;
  left: ${props => props.theme.spacing.sm};
  display: flex;
  align-items: center;
  color: ${props => props.theme.colors.text.secondary};
`;

const getInputVariantStyles = (theme, variant, error) => {
  if (error) {
    return css`
      border: ${theme.borders.width.normal} solid ${theme.colors.error};
      &:focus {
        border-color: ${theme.colors.error};
        box-shadow: 0 0 0 3px rgba(211, 47, 47, 0.2);
      }
    `;
  }

  const variants = {
    outlined: css`
      border: ${theme.borders.width.normal} solid ${theme.colors.border};
      &:focus {
        border-color: ${theme.colors.primary};
        box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.2);
      }
    `,
    filled: css`
      border: none;
      background-color: ${theme.colors.surface};
      &:focus {
        box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.2);
      }
    `,
    underlined: css`
      border: none;
      border-bottom: ${theme.borders.width.normal} solid ${theme.colors.border};
      border-radius: 0;
      background-color: transparent;
      &:focus {
        border-bottom-color: ${theme.colors.primary};
        box-shadow: none;
      }
    `,
  };

  return variants[variant] || variants.outlined;
};

const StyledInput = styled.input`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  font-size: ${props => props.theme.typography.fontSizes.md};
  border-radius: ${props => props.$variant === 'underlined' ? '0' : props.theme.borders.radius.md};
  width: 100%;
  transition: all ${props => props.theme.transitions.normal};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  color: ${props => props.theme.colors.text.primary};
  
  ${props => props.$startIcon && `
    padding-left: ${props.theme.spacing.xl};
  `}
  
  ${props => getInputVariantStyles(props.theme, props.$variant, props.$error)}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: ${props => props.theme.colors.surface};
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.text.disabled};
  }
`;

const HelperText = styled.span`
  font-size: ${props => props.theme.typography.fontSizes.xs};
  margin-top: ${props => props.theme.spacing.xs};
  color: ${props => props.$error ? props.theme.colors.error : props.theme.colors.text.secondary};
`;

const Input = forwardRef(({
  label,
  helperText,
  error = false,
  variant = 'outlined',
  fullWidth = false,
  startIcon,
  ...rest
}, ref) => {
  return (
    <InputWrapper $fullWidth={fullWidth}>
      {label && <Label>{label}</Label>}
      <InputContainer>
        {startIcon && <IconWrapper>{startIcon}</IconWrapper>}
        <StyledInput
          ref={ref}
          $variant={variant}
          $error={error}
          $startIcon={startIcon}
          {...rest}
        />
      </InputContainer>
      {helperText && <HelperText $error={error}>{helperText}</HelperText>}
    </InputWrapper>
  );
});

Input.displayName = 'Input';

Input.propTypes = {
  label: PropTypes.string,
  helperText: PropTypes.string,
  error: PropTypes.bool,
  variant: PropTypes.oneOf(['outlined', 'filled', 'underlined']),
  fullWidth: PropTypes.bool,
  startIcon: PropTypes.node,
};

export default Input;