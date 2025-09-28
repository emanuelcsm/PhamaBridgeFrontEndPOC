import React from 'react';
import ThemeProvider from './theme/ThemeProvider';
import StyledComponentsExample from './components/styled/Example';

function App() {
  return (
    <ThemeProvider>
      <StyledComponentsExample />
    </ThemeProvider>
  );
}

export default App;
