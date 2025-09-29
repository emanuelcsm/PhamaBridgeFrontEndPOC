// Modal.jsx
import React, { useEffect } from 'react';
import styled, { css, keyframes } from 'styled-components';
import PropTypes from 'prop-types';
import Button from './Button';

// Animações
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideIn = keyframes`
  from { transform: translateY(-50px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: ${fadeIn} ${props => props.theme.transitions.normal} ease;
`;

const ModalContainer = styled.div`
  background-color: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borders.radius.md};
  box-shadow: ${props => props.theme.shadows.lg};
  padding: ${props => props.theme.spacing.lg};
  width: 100%;
  max-width: ${props => {
    switch (props.size) {
      case 'xs': return '300px';
      case 'sm': return '400px';
      case 'md': return '600px';
      case 'lg': return '800px';
      case 'xl': return '1000px';
      default: return '600px';
    }
  }};
  max-height: 90vh;
  overflow-y: auto;
  animation: ${slideIn} ${props => props.theme.transitions.normal} ease;
  
  ${props => props.fullWidth && css`
    max-width: 90%;
  `}
  
  &:focus {
    outline: none;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${props => props.theme.spacing.md};
`;

const ModalTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSizes.xl};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${props => props.theme.colors.text.secondary};
  padding: ${props => props.theme.spacing.xs};
  font-size: ${props => props.theme.typography.fontSizes.xl};
  line-height: 0.5;
  transition: color ${props => props.theme.transitions.fast};
  
  &:hover {
    color: ${props => props.theme.colors.text.primary};
  }
`;

const ModalContent = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const ModalActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${props => props.position};
  gap: ${props => props.theme.spacing.sm};
  padding-top: ${props => props.theme.spacing.md};
  border-top: ${props => props.theme.borders.width.thin} solid ${props => props.theme.colors.border};
`;

const Modal = ({
  isOpen,
  onClose,
  title,
  size = 'md',
  fullWidth = false,
  hideCloseButton = false,
  actionsPosition = 'flex-end',
  closeOnEsc = true,
  closeOnOverlayClick = true,
  actions,
  children,
  ...rest
}) => {
  useEffect(() => {
    // Gerenciar pressionamento de ESC para fechar o modal
    const handleEscKey = (event) => {
      if (closeOnEsc && event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden'; // Impedir rolagem do body
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.body.style.overflow = ''; // Restaurar rolagem do body
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose, closeOnEsc]);

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <Overlay onClick={handleOverlayClick}>
      <ModalContainer size={size} fullWidth={fullWidth} tabIndex={-1} {...rest}>
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          {!hideCloseButton && (
            <CloseButton onClick={onClose} aria-label="Close">
              &times;
            </CloseButton>
          )}
        </ModalHeader>
        <ModalContent>{children}</ModalContent>
        {actions && (
          <ModalActions position={actionsPosition}>
            {actions}
          </ModalActions>
        )}
      </ModalContainer>
    </Overlay>
  );
};

// Exemplo de uso com componentes pré-definidos
const Modal2 = ({
  isOpen,
  onClose,
  title,
  size = 'md',
  fullWidth = false,
  children,
  primaryButtonText,
  secondaryButtonText,
  onPrimaryClick,
  onSecondaryClick,
  actionsPosition = 'flex-end',
  ...rest
}) => {
  // Renderizar botões apenas se os textos forem fornecidos
  const actionButtons = (
    <>
      {secondaryButtonText && (
        <Button variant="outline" onClick={onSecondaryClick || onClose}>
          {secondaryButtonText}
        </Button>
      )}
      {primaryButtonText && (
        <Button variant="primary" onClick={onPrimaryClick}>
          {primaryButtonText}
        </Button>
      )}
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size={size}
      fullWidth={fullWidth}
      actions={actionButtons}
      actionsPosition={actionsPosition}
      {...rest}
    >
      {children}
    </Modal>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  fullWidth: PropTypes.bool,
  hideCloseButton: PropTypes.bool,
  actionsPosition: PropTypes.oneOf(['flex-start', 'center', 'flex-end', 'space-between']),
  closeOnEsc: PropTypes.bool,
  closeOnOverlayClick: PropTypes.bool,
  actions: PropTypes.node,
  children: PropTypes.node,
};

Modal2.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  fullWidth: PropTypes.bool,
  primaryButtonText: PropTypes.string,
  secondaryButtonText: PropTypes.string,
  onPrimaryClick: PropTypes.func,
  onSecondaryClick: PropTypes.func,
  actionsPosition: PropTypes.oneOf(['flex-start', 'center', 'flex-end', 'space-between']),
  children: PropTypes.node,
};

// Add Actions as a subcomponent of Modal for easier usage
Modal.Actions = ModalActions;
Modal2.Actions = ModalActions;

export { Modal, Modal2 };