// theme.js
// Define todas as variáveis de tema da aplicação (cores, espaçamentos, tipografia, etc.)

const theme = {
  // Cores principais
  colors: {
    primary: '#2E7D32', // Verde escuro (farmácia)
    secondary: '#4CAF50', // Verde médio
    accent: '#81C784', // Verde claro
    error: '#D32F2F', // Vermelho para erros
    warning: '#FFA000', // Laranja para alertas
    info: '#1976D2', // Azul para informações
    success: '#388E3C', // Verde para sucesso
    
    // Tons neutros
    background: '#FFFFFF',
    surface: '#F5F5F5',
    text: {
      primary: '#212121',
      secondary: '#757575',
      disabled: '#9E9E9E',
    },
    border: '#E0E0E0',
    
    // Estados
    hover: {
      primary: '#1B5E20',
      secondary: '#388E3C',
    }
  },
  
  // Tipografia
  typography: {
    fontFamily: {
      primary: '"Roboto", "Helvetica", "Arial", sans-serif',
      secondary: '"Open Sans", "Helvetica", "Arial", sans-serif',
    },
    fontSizes: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      md: '1rem',       // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      xxl: '1.5rem',    // 24px
      xxxl: '2rem',     // 32px
      display: '2.5rem', // 40px
    },
    fontWeights: {
      light: 300,
      regular: 400,
      medium: 500,
      bold: 700,
    },
    lineHeights: {
      tight: 1.2,
      normal: 1.5,
      loose: 1.8,
    }
  },
  
  // Espaçamentos
  spacing: {
    xs: '0.25rem',  // 4px
    sm: '0.5rem',   // 8px
    md: '1rem',     // 16px
    lg: '1.5rem',   // 24px
    xl: '2rem',     // 32px
    xxl: '3rem',    // 48px
  },
  
  // Bordas e arredondamentos
  borders: {
    radius: {
      sm: '0.25rem',  // 4px
      md: '0.5rem',   // 8px
      lg: '1rem',     // 16px
      pill: '9999px', // Botões em formato de pílula
    },
    width: {
      thin: '1px',
      normal: '2px',
      thick: '4px',
    }
  },
  
  // Sombras
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
  
  // Transições
  transitions: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  
  // Breakpoints para responsividade
  breakpoints: {
    xs: '320px',
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
  }
};

export default theme;