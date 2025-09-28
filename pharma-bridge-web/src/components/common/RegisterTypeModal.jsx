import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Typography, Button, Modal } from '../common';

const OptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
  padding: ${props => props.theme.spacing.md} 0;
`;

const RegisterOption = styled.div`
  padding: ${props => props.theme.spacing.lg};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borders.radius.md};
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme.shadows.md};
    border-color: ${props => props.theme.colors.primary};
  }
`;

const IconContainer = styled.div`
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.colors.primaryLight};
  color: ${props => props.theme.colors.primary};
  font-size: 2rem;
  border-radius: 50%;
  margin-bottom: ${props => props.theme.spacing.md};
`;

const OptionsRow = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.lg};
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: ${props => props.theme.spacing.lg};
`;

const RegisterTypeModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  
  const handleSelectPharmacy = () => {
    navigate('/register/pharmacy');
    onClose();
  };
  
  const handleSelectCustomer = () => {
    navigate('/register/customer');
    onClose();
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Selecione o tipo de conta"
      width="600px"
    >
      <Typography variant="body1" gutterBottom>
        Escolha o tipo de conta que você deseja criar:
      </Typography>
      
      <OptionContainer>
        <OptionsRow>
          <RegisterOption onClick={handleSelectCustomer}>
            <IconContainer>👤</IconContainer>
            <Typography variant="h4" gutterBottom>
              Consumidor
            </Typography>
            <Typography variant="body2">
              Para pacientes que desejam visualizar e gerenciar suas receitas médicas digitais.
            </Typography>
          </RegisterOption>
          
          <RegisterOption onClick={handleSelectPharmacy}>
            <IconContainer>💊</IconContainer>
            <Typography variant="h4" gutterBottom>
              Farmácia
            </Typography>
            <Typography variant="body2">
              Para farmácias que desejam participar da rede PharmaBridge e atender receitas digitais.
            </Typography>
          </RegisterOption>
        </OptionsRow>
      </OptionContainer>
      
      <ModalFooter>
        <Button variant="text" onClick={onClose}>
          Cancelar
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default RegisterTypeModal;