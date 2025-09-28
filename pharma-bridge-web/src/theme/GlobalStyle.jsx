// GlobalStyle.jsx
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body {
    font-family: ${props => props.theme.typography.fontFamily.primary};
    font-size: 16px;
    color: ${props => props.theme.colors.text.primary};
    background-color: ${props => props.theme.colors.background};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  a {
    text-decoration: none;
    color: ${props => props.theme.colors.primary};
    transition: color ${props => props.theme.transitions.normal} ease;

    &:hover {
      color: ${props => props.theme.colors.hover.primary};
    }
  }

  h1, h2, h3, h4, h5, h6 {
    margin-bottom: ${props => props.theme.spacing.md};
    font-weight: ${props => props.theme.typography.fontWeights.medium};
    line-height: ${props => props.theme.typography.lineHeights.tight};
  }

  p {
    margin-bottom: ${props => props.theme.spacing.md};
    line-height: ${props => props.theme.typography.lineHeights.normal};
  }

  img {
    max-width: 100%;
    height: auto;
  }
  
  button {
    font-family: ${props => props.theme.typography.fontFamily.primary};
  }

  input, select, textarea {
    font-family: ${props => props.theme.typography.fontFamily.primary};
  }
`;

export default GlobalStyle;