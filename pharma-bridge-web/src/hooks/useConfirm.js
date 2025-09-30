import { useState, useCallback } from 'react';

/**
 * Hook personalizado para gerenciar diálogos de confirmação
 * 
 * @returns {Object} Um objeto contendo funções e estados para gerenciar diálogos de confirmação
 * @example
 * const { confirm, confirmDialog } = useConfirm();
 * 
 * // Em um evento:
 * const handleDelete = async () => {
 *   const confirmed = await confirm('Tem certeza que deseja excluir?');
 *   if (confirmed) {
 *     // Executa a ação após confirmação
 *   }
 * };
 * 
 * // No JSX:
 * return (
 *   <div>
 *     <button onClick={handleDelete}>Excluir</button>
 *     {confirmDialog} // Inclua isso no seu componente para renderizar o diálogo quando necessário
 *   </div>
 * );
 */
const useConfirm = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogConfig, setDialogConfig] = useState({
    title: 'Confirmação',
    message: '',
    confirmButtonText: 'Confirmar',
    cancelButtonText: 'Cancelar',
    confirmButtonVariant: 'primary',
    cancelButtonVariant: 'text',
    showIcon: true,
    onConfirm: () => {},
    onCancel: () => {},
  });

  // Função para resolver a promessa de confirmação
  const [promiseResolve, setPromiseResolve] = useState(null);

  // Função que retorna uma promessa que é resolvida quando o usuário faz uma escolha
  const confirm = useCallback((
    message,
    {
      title = 'Confirmação',
      confirmButtonText = 'Confirmar',
      cancelButtonText = 'Cancelar',
      confirmButtonVariant = 'primary',
      cancelButtonVariant = 'text',
      showIcon = true,
    } = {}
  ) => {
    return new Promise((resolve) => {
      setPromiseResolve(() => resolve);
      
      setDialogConfig({
        title,
        message,
        confirmButtonText,
        cancelButtonText,
        confirmButtonVariant,
        cancelButtonVariant,
        showIcon,
      });
      
      setDialogOpen(true);
    });
  }, []);

  // Manipuladores de eventos para os botões
  const handleConfirm = useCallback(() => {
    setDialogOpen(false);
    if (promiseResolve) promiseResolve(true);
  }, [promiseResolve]);

  const handleCancel = useCallback(() => {
    setDialogOpen(false);
    if (promiseResolve) promiseResolve(false);
  }, [promiseResolve]);

  // Componente JSX pronto para uso
  const confirmDialog = useCallback(() => {
    const { ConfirmDialog } = require('../components/common');
    
    return (
      <ConfirmDialog
        isOpen={dialogOpen}
        title={dialogConfig.title}
        message={dialogConfig.message}
        confirmButtonText={dialogConfig.confirmButtonText}
        cancelButtonText={dialogConfig.cancelButtonText}
        confirmButtonVariant={dialogConfig.confirmButtonVariant}
        cancelButtonVariant={dialogConfig.cancelButtonVariant}
        showIcon={dialogConfig.showIcon}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    );
  }, [dialogOpen, dialogConfig, handleConfirm, handleCancel]);

  return {
    confirm,
    confirmDialog: confirmDialog(),
  };
};

export default useConfirm;