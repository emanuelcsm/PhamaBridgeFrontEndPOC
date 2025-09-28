// ThemeProvider.jsx
import React from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import theme from './theme';
import GlobalStyle from './GlobalStyle';

const ThemeProvider = ({ children }) => {
  return (
    <StyledThemeProvider theme={theme}>
      <GlobalStyle />
      {children}
    </StyledThemeProvider>
  );
};

export default ThemeProvider;