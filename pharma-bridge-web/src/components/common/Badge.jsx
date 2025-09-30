// Badge.jsx
import React from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';

const getVariantStyles = (theme, variant) => {
  const variants = {
    primary: css`
      background-color: ${theme.colors.primary};
      color: white;
    `,
    secondary: css`
      background-color: ${theme.colors.secondary};
      color: white;
    `,
    success: css`
      background-color: ${theme.colors.success};
      color: white;
    `,
    error: css`
      background-color: ${theme.colors.error};
      color: white;
    `,
    warning: css`
      background-color: ${theme.colors.warning};
      color: white;
    `,
    info: css`
      background-color: ${theme.colors.info};
      color: white;
    `,
    default: css`
      background-color: ${theme.colors.text.disabled};
      color: white;
    `,
  };
  return variants[variant] || variants.default;
};

const StyledBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.$pill ? `${props.theme.spacing.xs} ${props.theme.spacing.md}` : props.theme.spacing.xs};
  font-size: ${props => props.theme.typography.fontSizes.xs};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  line-height: 1;
  border-radius: ${props => props.$pill ? props.theme.borders.radius.pill : props.theme.borders.radius.sm};
  white-space: nowrap;
  
  ${props => getVariantStyles(props.theme, props.$variant)}
  
  ${props => props.$outlined && css`
    background-color: transparent;
    border: ${props.theme.borders.width.thin} solid ${props.theme.colors[props.$variant] || props.theme.colors.text.disabled};
    color: ${props.theme.colors[props.$variant] || props.theme.colors.text.disabled};
  `}
`;

const Badge = ({
  children,
  variant = 'default',
  outlined = false,
  pill = false,
  ...rest
}) => {
  return (
    <StyledBadge
      $variant={variant}
      $outlined={outlined}
      $pill={pill}
      {...rest}
    >
      {children}
    </StyledBadge>
  );
};

Badge.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'error', 'warning', 'info', 'default']),
  outlined: PropTypes.bool,
  pill: PropTypes.bool,
};

export default Badge;