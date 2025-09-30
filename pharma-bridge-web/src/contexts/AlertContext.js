import React, { createContext, useState, useContext } from 'react';
import AlertDialog from '../components/common/AlertDialog';

const AlertContext = createContext({});

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);
  
  // Função para adicionar um novo alerta
  const addAlert = (message, variant = 'info', autoHideDuration = 5000) => {
    const id = Date.now().toString();
    const newAlert = { id, message, variant, autoHideDuration };
    
    setAlerts((prevAlerts) => [...prevAlerts, newAlert]);
    
    // Remover o alerta automaticamente após o tempo definido
    if (autoHideDuration > 0) {
      setTimeout(() => {
        removeAlert(id);
      }, autoHideDuration);
    }
    
    return id;
  };
  
  // Funções auxiliares para diferentes tipos de alertas
  const success = (message, autoHideDuration) => 
    addAlert(message, 'success', autoHideDuration);
    
  const error = (message, autoHideDuration) => 
    addAlert(message, 'error', autoHideDuration);
    
  const warning = (message, autoHideDuration) => 
    addAlert(message, 'warning', autoHideDuration);
    
  const info = (message, autoHideDuration) => 
    addAlert(message, 'info', autoHideDuration);
  
  // Função para remover um alerta específico
  const removeAlert = (id) => {
    setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
  };

  return (
    <AlertContext.Provider 
      value={{ alerts, addAlert, success, error, warning, info, removeAlert }}
    >
      {children}
      <AlertDialog alerts={alerts} removeAlert={removeAlert} />
    </AlertContext.Provider>
  );
};

// Hook personalizado para usar o contexto de alerta
export const useAlert = () => {
  const context = useContext(AlertContext);
  
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  
  return context;
};