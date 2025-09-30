import React from 'react';
import styled, { keyframes } from 'styled-components';
import PropTypes from 'prop-types';
import Alert from './Alert';

// Animação para entrada e saída dos alertas
const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

// Container para posicionar todos os alertas
const AlertsContainer = styled.div`
  position: fixed;
  top: ${props => props.theme.spacing.lg};
  right: ${props => props.theme.spacing.lg};
  z-index: 9999;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

// Container individual para cada alerta com animação
const AlertItem = styled.div`
  animation: ${slideIn} 0.3s ease forwards;
  width: 100%;
  margin-bottom: ${props => props.theme.spacing.md};
`;

// Ícones para cada tipo de alerta
const getAlertIcon = (variant) => {
  const icons = {
    success: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/>
      </svg>
    ),
    error: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11 15h2v2h-2v-2zm0-8h2v6h-2V7zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" fill="currentColor"/>
      </svg>
    ),
    warning: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" fill="currentColor"/>
      </svg>
    ),
    info: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" fill="currentColor"/>
      </svg>
    ),
  };
  
  return icons[variant] || icons.info;
};

// Títulos para cada tipo de alerta
const getAlertTitle = (variant) => {
  const titles = {
    success: 'Sucesso',
    error: 'Erro',
    warning: 'Atenção',
    info: 'Informação',
  };
  
  return titles[variant] || titles.info;
};

const AlertDialog = ({ alerts, removeAlert }) => {
  if (alerts.length === 0) return null;
  
  return (
    <AlertsContainer>
      {alerts.map((alert) => (
        <AlertItem key={alert.id}>
          <Alert
            variant={alert.variant}
            icon={getAlertIcon(alert.variant)}
            title={getAlertTitle(alert.variant)}
            onClose={() => removeAlert(alert.id)}
          >
            {alert.message}
          </Alert>
        </AlertItem>
      ))}
    </AlertsContainer>
  );
};

AlertDialog.propTypes = {
  alerts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
      variant: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
      autoHideDuration: PropTypes.number,
    })
  ).isRequired,
  removeAlert: PropTypes.func.isRequired,
};

export default AlertDialog;