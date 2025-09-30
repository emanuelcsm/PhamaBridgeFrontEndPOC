import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Modal } from './Modal';
import { Typography, Button } from '../common';

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${props => props.theme.spacing.md};
  margin-top: ${props => props.theme.spacing.lg};
`;

const IconContainer = styled.div`
  color: ${props => props.theme.colors.warning};
  font-size: 2.5rem;
  margin-bottom: ${props => props.theme.spacing.md};
  display: flex;
  justify-content: center;
`;

const WarningIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 5.99L19.53 19H4.47L12 5.99ZM12 2L1 21h22L12 2ZM13 16h-2v2h2v-2ZM13 10h-2v4h2v-4Z" />
  </svg>
);

/**
 * Componente de diálogo de confirmação
 * 
 * @param {object} props - Propriedades do componente
 * @param {boolean} props.isOpen - Controla a visibilidade do diálogo
 * @param {string} props.title - Título do diálogo
 * @param {string} props.message - Mensagem de confirmação
 * @param {string} props.confirmButtonText - Texto do botão de confirmação (opcional, padrão "Confirmar")
 * @param {string} props.cancelButtonText - Texto do botão de cancelamento (opcional, padrão "Cancelar")
 * @param {function} props.onConfirm - Callback chamado quando o usuário confirma
 * @param {function} props.onCancel - Callback chamado quando o usuário cancela
 */
const ConfirmDialog = ({
  isOpen,
  title = "Confirmação",
  message,
  confirmButtonText = "Confirmar",
  cancelButtonText = "Cancelar",
  confirmButtonVariant = "primary",
  cancelButtonVariant = "text",
  showIcon = true,
  onConfirm,
  onCancel
}) => {
  return (
    <Modal
      isOpen={isOpen}
      title={title}
      onClose={onCancel}
      size="sm"
    >
      {showIcon && (
        <IconContainer>
          <WarningIcon />
        </IconContainer>
      )}
      
      <Typography variant="body1">
        {message}
      </Typography>

      <ButtonContainer>
        <Button 
          variant={cancelButtonVariant} 
          onClick={onCancel}
        >
          {cancelButtonText}
        </Button>
        <Button 
          variant={confirmButtonVariant} 
          onClick={onConfirm}
        >
          {confirmButtonText}
        </Button>
      </ButtonContainer>
    </Modal>
  );
};

ConfirmDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.string,
  message: PropTypes.string.isRequired,
  confirmButtonText: PropTypes.string,
  cancelButtonText: PropTypes.string,
  confirmButtonVariant: PropTypes.string,
  cancelButtonVariant: PropTypes.string,
  showIcon: PropTypes.bool,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ConfirmDialog;