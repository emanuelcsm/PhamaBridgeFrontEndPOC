// Card.jsx
import React from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';

const getShadowStyles = (theme, elevation) => {
  const shadows = {
    0: 'none',
    1: theme.shadows.sm,
    2: theme.shadows.md,
    3: theme.shadows.lg,
    4: theme.shadows.xl
  };
  return shadows[elevation] || shadows[1];
};

const StyledCard = styled.div`
  background-color: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borders.radius.md};
  padding: ${props => props.padding ? props.theme.spacing[props.padding] || props.theme.spacing.md : props.theme.spacing.md};
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  border: ${props => props.outlined ? `${props.theme.borders.width.thin} solid ${props.theme.colors.border}` : 'none'};
  box-shadow: ${props => !props.outlined && getShadowStyles(props.theme, props.elevation)};
  overflow: hidden;
  
  ${props => props.clickable && css`
    cursor: pointer;
    transition: transform ${props.theme.transitions.normal}, box-shadow ${props.theme.transitions.normal};
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: ${getShadowStyles(props.theme, props.elevation + 1)};
    }
  `}
`;

const CardHeader = styled.div`
  padding: ${props => props.noPadding ? '0' : `0 0 ${props.theme.spacing.md}`};
  margin-bottom: ${props => props.noPadding ? '0' : props.theme.spacing.md};
  border-bottom: ${props => props.divider ? `${props.theme.borders.width.thin} solid ${props.theme.colors.border}` : 'none'};
  display: flex;
  align-items: center;
  justify-content: ${props => props.align || 'flex-start'};
`;

const CardTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSizes.xl};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  margin: 0;
`;

const CardSubtitle = styled.h4`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.text.secondary};
  margin: ${props => props.theme.spacing.xs} 0 0;
  font-weight: ${props => props.theme.typography.fontWeights.regular};
`;

const CardContent = styled.div`
  padding: ${props => props.noPadding ? '0' : `${props.theme.spacing.md} 0`};
`;

const CardActions = styled.div`
  padding: ${props => props.noPadding ? '0' : `${props.theme.spacing.md} 0 0`};
  margin-top: ${props => props.noPadding ? '0' : props.theme.spacing.md};
  border-top: ${props => props.divider ? `${props.theme.borders.width.thin} solid ${props.theme.colors.border}` : 'none'};
  display: flex;
  align-items: center;
  justify-content: ${props => props.align || 'flex-end'};
  gap: ${props => props.theme.spacing.sm};
`;

const CardMedia = styled.div`
  width: 100%;
  position: relative;
  height: ${props => props.height || '200px'};
  margin: ${props => props.noPadding ? '0' : `-${props.theme.spacing.md}`};
  margin-bottom: ${props => props.noPadding ? '0' : props.theme.spacing.md};
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: ${props => props.objectFit || 'cover'};
    display: block;
  }
`;

const Card = ({
  children,
  elevation = 1,
  outlined = false,
  fullWidth = false,
  padding = 'md',
  clickable = false,
  onClick,
  className,
  ...rest
}) => {
  return (
    <StyledCard
      elevation={elevation}
      outlined={outlined}
      fullWidth={fullWidth}
      padding={padding}
      clickable={clickable}
      onClick={onClick}
      className={className}
      {...rest}
    >
      {children}
    </StyledCard>
  );
};

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Subtitle = CardSubtitle;
Card.Content = CardContent;
Card.Actions = CardActions;
Card.Media = CardMedia;

Card.propTypes = {
  children: PropTypes.node,
  elevation: PropTypes.oneOf([0, 1, 2, 3, 4]),
  outlined: PropTypes.bool,
  fullWidth: PropTypes.bool,
  padding: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', 'xxl']),
  clickable: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

export default Card;