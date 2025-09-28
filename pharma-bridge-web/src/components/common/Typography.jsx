// Typography.jsx
import React from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';

const getVariantStyles = (theme, variant) => {
  const variants = {
    h1: css`
      font-size: ${theme.typography.fontSizes.display};
      font-weight: ${theme.typography.fontWeights.bold};
      line-height: ${theme.typography.lineHeights.tight};
      margin-bottom: ${theme.spacing.lg};
    `,
    h2: css`
      font-size: ${theme.typography.fontSizes.xxxl};
      font-weight: ${theme.typography.fontWeights.bold};
      line-height: ${theme.typography.lineHeights.tight};
      margin-bottom: ${theme.spacing.md};
    `,
    h3: css`
      font-size: ${theme.typography.fontSizes.xxl};
      font-weight: ${theme.typography.fontWeights.medium};
      line-height: ${theme.typography.lineHeights.tight};
      margin-bottom: ${theme.spacing.md};
    `,
    h4: css`
      font-size: ${theme.typography.fontSizes.xl};
      font-weight: ${theme.typography.fontWeights.medium};
      line-height: ${theme.typography.lineHeights.tight};
      margin-bottom: ${theme.spacing.sm};
    `,
    h5: css`
      font-size: ${theme.typography.fontSizes.lg};
      font-weight: ${theme.typography.fontWeights.medium};
      line-height: ${theme.typography.lineHeights.tight};
      margin-bottom: ${theme.spacing.sm};
    `,
    h6: css`
      font-size: ${theme.typography.fontSizes.md};
      font-weight: ${theme.typography.fontWeights.medium};
      line-height: ${theme.typography.lineHeights.tight};
      margin-bottom: ${theme.spacing.sm};
    `,
    subtitle1: css`
      font-size: ${theme.typography.fontSizes.lg};
      font-weight: ${theme.typography.fontWeights.regular};
      line-height: ${theme.typography.lineHeights.normal};
      margin-bottom: ${theme.spacing.md};
      color: ${theme.colors.text.secondary};
    `,
    subtitle2: css`
      font-size: ${theme.typography.fontSizes.md};
      font-weight: ${theme.typography.fontWeights.medium};
      line-height: ${theme.typography.lineHeights.normal};
      margin-bottom: ${theme.spacing.md};
      color: ${theme.colors.text.secondary};
    `,
    body1: css`
      font-size: ${theme.typography.fontSizes.md};
      font-weight: ${theme.typography.fontWeights.regular};
      line-height: ${theme.typography.lineHeights.normal};
      margin-bottom: ${theme.spacing.md};
    `,
    body2: css`
      font-size: ${theme.typography.fontSizes.sm};
      font-weight: ${theme.typography.fontWeights.regular};
      line-height: ${theme.typography.lineHeights.normal};
      margin-bottom: ${theme.spacing.md};
    `,
    caption: css`
      font-size: ${theme.typography.fontSizes.xs};
      font-weight: ${theme.typography.fontWeights.regular};
      line-height: ${theme.typography.lineHeights.normal};
      color: ${theme.colors.text.secondary};
    `,
    overline: css`
      font-size: ${theme.typography.fontSizes.xs};
      font-weight: ${theme.typography.fontWeights.medium};
      text-transform: uppercase;
      letter-spacing: 1.5px;
      line-height: ${theme.typography.lineHeights.normal};
      color: ${theme.colors.text.secondary};
    `,
  };
  return variants[variant] || variants.body1;
};

const getColorStyles = (theme, color) => {
  const colors = {
    primary: theme.colors.text.primary,
    secondary: theme.colors.text.secondary,
    disabled: theme.colors.text.disabled,
    error: theme.colors.error,
    success: theme.colors.success,
    warning: theme.colors.warning,
    info: theme.colors.info,
    inherit: 'inherit',
  };
  return colors[color] || colors.primary;
};

const StyledTypography = styled.div`
  margin: 0;
  ${props => getVariantStyles(props.theme, props.variant)}
  color: ${props => getColorStyles(props.theme, props.color)};
  text-align: ${props => props.align};
  font-weight: ${props => props.fontWeight && props.theme.typography.fontWeights[props.fontWeight]};
  ${props => props.noWrap && css`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `}
  ${props => props.gutterBottom && css`
    margin-bottom: ${props.theme.spacing.md};
  `}
`;

const Typography = ({
  variant = 'body1',
  component,
  color = 'primary',
  align = 'inherit',
  fontWeight,
  noWrap = false,
  gutterBottom = false,
  children,
  ...rest
}) => {
  // Mapear variante para elemento HTML apropriado se não for especificado
  const getComponent = () => {
    if (component) return component;
    
    const variantToComponent = {
      h1: 'h1',
      h2: 'h2',
      h3: 'h3',
      h4: 'h4',
      h5: 'h5',
      h6: 'h6',
      subtitle1: 'h6',
      subtitle2: 'h6',
      body1: 'p',
      body2: 'p',
      caption: 'span',
      overline: 'span',
    };
    
    return variantToComponent[variant] || 'p';
  };

  return (
    <StyledTypography
      as={getComponent()}
      variant={variant}
      color={color}
      align={align}
      fontWeight={fontWeight}
      noWrap={noWrap}
      gutterBottom={gutterBottom}
      {...rest}
    >
      {children}
    </StyledTypography>
  );
};

Typography.propTypes = {
  variant: PropTypes.oneOf([
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 
    'subtitle1', 'subtitle2', 'body1', 'body2', 
    'caption', 'overline'
  ]),
  component: PropTypes.oneOfType([PropTypes.string, PropTypes.elementType]),
  color: PropTypes.oneOf([
    'primary', 'secondary', 'disabled', 'error', 
    'success', 'warning', 'info', 'inherit'
  ]),
  align: PropTypes.oneOf(['inherit', 'left', 'center', 'right', 'justify']),
  fontWeight: PropTypes.oneOf(['light', 'regular', 'medium', 'bold']),
  noWrap: PropTypes.bool,
  gutterBottom: PropTypes.bool,
  children: PropTypes.node,
};

export default Typography;