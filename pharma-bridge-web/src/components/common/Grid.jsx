// Grid.jsx
import React from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';

// Utility para gerar media queries
const generateMediaQueries = (breakpoint, theme) => {
  const breakpoints = {
    xs: theme.breakpoints.xs,
    sm: theme.breakpoints.sm,
    md: theme.breakpoints.md,
    lg: theme.breakpoints.lg,
    xl: theme.breakpoints.xl,
  };

  return `@media (min-width: ${breakpoints[breakpoint]})`;
};

// Container principal
const Container = styled.div`
  width: 100%;
  margin-right: auto;
  margin-left: auto;
  padding-right: ${props => props.theme.spacing.md};
  padding-left: ${props => props.theme.spacing.md};
  max-width: 100%;
  
  ${props => !props.fluid && css`
    @media (min-width: ${props.theme.breakpoints.sm}) {
      max-width: 540px;
    }
    
    @media (min-width: ${props.theme.breakpoints.md}) {
      max-width: 720px;
    }
    
    @media (min-width: ${props.theme.breakpoints.lg}) {
      max-width: 960px;
    }
    
    @media (min-width: ${props.theme.breakpoints.xl}) {
      max-width: 1140px;
    }
  `}
`;

// Row para sistema de grid
const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-right: -${props => props.theme.spacing.sm};
  margin-left: -${props => props.theme.spacing.sm};
  
  ${props => props.noGutters && css`
    margin-right: 0;
    margin-left: 0;
    
    > div {
      padding-right: 0;
      padding-left: 0;
    }
  `}
  
  ${props => props.justifyContent && css`
    justify-content: ${props.justifyContent};
  `}
  
  ${props => props.alignItems && css`
    align-items: ${props.alignItems};
  `}
`;

// Função de utilidade para calcular a largura da coluna
const calculateWidth = span => {
  if (!span) return null;
  const width = (span / 12) * 100;
  return `${width}%`;
};

// Col para sistema de grid
const Col = styled.div`
  position: relative;
  width: 100%;
  padding-right: ${props => props.theme.spacing.sm};
  padding-left: ${props => props.theme.spacing.sm};
  flex-basis: 0;
  flex-grow: 1;
  max-width: 100%;
  
  ${props => props.xs && css`
    flex: 0 0 ${calculateWidth(props.xs)};
    max-width: ${calculateWidth(props.xs)};
  `}
  
  ${props => props.sm && css`
    ${generateMediaQueries('sm', props.theme)} {
      flex: 0 0 ${calculateWidth(props.sm)};
      max-width: ${calculateWidth(props.sm)};
    }
  `}
  
  ${props => props.md && css`
    ${generateMediaQueries('md', props.theme)} {
      flex: 0 0 ${calculateWidth(props.md)};
      max-width: ${calculateWidth(props.md)};
    }
  `}
  
  ${props => props.lg && css`
    ${generateMediaQueries('lg', props.theme)} {
      flex: 0 0 ${calculateWidth(props.lg)};
      max-width: ${calculateWidth(props.lg)};
    }
  `}
  
  ${props => props.xl && css`
    ${generateMediaQueries('xl', props.theme)} {
      flex: 0 0 ${calculateWidth(props.xl)};
      max-width: ${calculateWidth(props.xl)};
    }
  `}
  
  ${props => props.order && css`
    order: ${props.order};
  `}
  
  ${props => props.offset && css`
    margin-left: ${calculateWidth(props.offset)};
  `}
`;

// Componente Grid que exporta Container, Row e Col
const Grid = {
  Container: ({ fluid = false, children, ...rest }) => (
    <Container fluid={fluid} {...rest}>{children}</Container>
  ),
  
  Row: ({ 
    noGutters = false, 
    justifyContent = 'flex-start', 
    alignItems = 'flex-start', 
    children, 
    ...rest 
  }) => (
    <Row 
      noGutters={noGutters} 
      justifyContent={justifyContent} 
      alignItems={alignItems} 
      {...rest}
    >
      {children}
    </Row>
  ),
  
  Col: ({ 
    xs, 
    sm, 
    md, 
    lg, 
    xl, 
    order, 
    offset, 
    children, 
    ...rest 
  }) => (
    <Col 
      xs={xs} 
      sm={sm} 
      md={md} 
      lg={lg} 
      xl={xl} 
      order={order} 
      offset={offset} 
      {...rest}
    >
      {children}
    </Col>
  )
};

// PropTypes
Grid.Container.propTypes = {
  fluid: PropTypes.bool,
  children: PropTypes.node,
};

Grid.Row.propTypes = {
  noGutters: PropTypes.bool,
  justifyContent: PropTypes.oneOf([
    'flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly'
  ]),
  alignItems: PropTypes.oneOf([
    'flex-start', 'flex-end', 'center', 'stretch', 'baseline'
  ]),
  children: PropTypes.node,
};

Grid.Col.propTypes = {
  xs: PropTypes.number,
  sm: PropTypes.number,
  md: PropTypes.number,
  lg: PropTypes.number,
  xl: PropTypes.number,
  order: PropTypes.number,
  offset: PropTypes.number,
  children: PropTypes.node,
};

export default Grid;