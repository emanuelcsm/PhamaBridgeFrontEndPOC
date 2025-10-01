import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Button, Typography, Card } from '../common';
import { Modal } from '../common/Modal';
import useConfirm from '../../hooks/useConfirm';
import { useAlert } from '../../contexts/AlertContext';
import { formatDate } from '../../utils/dateUtils';
import quoteService from '../../services/quoteService';
import QuoteDetails from './QuoteDetails';

// Cache para evitar chamadas duplicadas à API
let pendingFetch = null;

const TableContainer = styled(Card)`
  width: 100%;
  overflow-x: auto;
  margin-top: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borders.radius};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  /* Override any props being passed down to the DOM */
  &&& {
    $outlined: none;
    $fullWidth: none;
    $padding: none;
    $clickable: none;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
`;

const TableHead = styled.thead`
  background-color: ${props => props.theme.colors.primary};
  color: #FFFFFF;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: ${props => props.theme.colors.surface};
  }
  
  &:hover {
    background-color: ${props => props.theme.colors.border};
  }
`;

const TableHeaderCell = styled.th`
  padding: ${props => props.theme.spacing.md};
`;

const TableCell = styled.td`
  padding: ${props => props.theme.spacing.md};
`;

const FilterContainer = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.md};
  flex-wrap: wrap;
`;

const FilterButton = styled(Button)`
  min-width: 100px;
`;

const ActionButtonsContainer = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
`;

const LoadingContainer = styled.div`
  padding: ${props => props.theme.spacing.xl};
  text-align: center;
`;

const NoDataContainer = styled.div`
  padding: ${props => props.theme.spacing.xl};
  text-align: center;
  color: ${props => props.theme.colors.text.disabled};
`;

const QuotesTable = ({ refreshTrigger = 0 }) => {
  const [quotes, setQuotes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const { confirm, confirmDialog } = useConfirm();
  const { info } = useAlert();
  const dataFetchedRef = useRef(false);

  // Função para buscar cotações
  const fetchQuotes = async () => {
    // Se já existe uma requisição em andamento, retorna ela
    if (pendingFetch) {
      return pendingFetch;
    }
    
    setIsLoading(true);
    setError(null);
    
    console.log('Buscando cotações com status:', statusFilter);
    // Cria uma nova Promise e armazena para possível reuso
    pendingFetch = quoteService.getQuotes(statusFilter)
      .then(data => {
        setQuotes(data);
        dataFetchedRef.current = true;
        return data;
      })
      .catch(err => {
        setError('Erro ao carregar cotações');
        console.error('Erro ao carregar cotações:', err);
        throw err;
      })
      .finally(() => {
        setIsLoading(false);
        // Limpa a referência após a conclusão
        pendingFetch = null;
      });
    
    return pendingFetch;
  };

  useEffect(() => {
    // Se já buscamos dados e não há refresh, não faça nada
    if (dataFetchedRef.current && refreshTrigger === 0) {
      return;
    }
    
    fetchQuotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, refreshTrigger]);

  const handleShowDetails = async (quoteId) => {
    setLoadingDetails(true);
    
    try {
      const quoteDetails = await quoteService.getQuoteDetails(quoteId);
      setSelectedQuote(quoteDetails);
      setDetailsModalOpen(true);
    } catch (err) {
      setError('Erro ao carregar detalhes da cotação');
      info('Não foi possível carregar os detalhes da cotação. Por favor, tente novamente.');
      console.error('Erro ao carregar detalhes da cotação:', err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleCancelQuote = async (quoteId) => {
    const confirmed = await confirm(
      'Tem certeza que deseja cancelar esta cotação?', 
      { 
        title: 'Cancelar Cotação', 
        confirmButtonText: 'Sim, cancelar', 
        confirmButtonVariant: 'error' 
      }
    );
    
    if (confirmed) {
      setIsLoading(true);
      try {
        console.log('START: Cancelando cotação com ID:', quoteId);
        // Esperar pela conclusão da requisição de cancelamento
        await quoteService.cancelQuote(quoteId);
        console.log('DONE: Cancelando cotação com ID:', quoteId);
        
        // Agora que temos certeza de que o cancelamento foi bem-sucedido,
        // podemos atualizar a interface
        console.log('Enviando trigger para atualização da lista:', quoteId);
        
        // Resetar o cache para forçar nova busca
        dataFetchedRef.current = false;
        pendingFetch = null;
        
        // Forçar uma nova busca de dados
        await fetchQuotes();
        
        console.log('DONE: Enviando trigger para atualização da lista:', quoteId);
      } catch (err) {
        setError('Erro ao cancelar cotação');
        console.error('Erro ao cancelar cotação:', err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const closeDetailsModal = () => {
    setDetailsModalOpen(false);
    // Limpar a URL da imagem quando o modal for fechado para liberar memória
    if (selectedQuote && selectedQuote.image) {
      URL.revokeObjectURL(selectedQuote.image);
    }
    setSelectedQuote(null);
  };

  const handleFilterClick = (filterValue) => {
    dataFetchedRef.current = false;
    pendingFetch = null;
    setStatusFilter(filterValue);
  };

  return (
    <div>
      <FilterContainer>
        <FilterButton 
          variant={statusFilter === "" ? "primary" : "secondary"} 
          onClick={() => handleFilterClick("")}
        >
          Todos
        </FilterButton>
        <FilterButton 
          variant={statusFilter === "Pending" ? "primary" : "secondary"} 
          onClick={() => handleFilterClick("Pending")}
        >
          Pendentes
        </FilterButton>
        <FilterButton 
          variant={statusFilter === "Accepted" ? "primary" : "secondary"} 
          onClick={() => handleFilterClick("Accepted")}
        >
          Aceitas
        </FilterButton>
        <FilterButton 
          variant={statusFilter === "Canceled" ? "primary" : "secondary"} 
          onClick={() => handleFilterClick("Canceled")}
        >
          Canceladas
        </FilterButton>
      </FilterContainer>

      {error && (
        <Typography variant="body1" color="error">
          {error}
        </Typography>
      )}

      <TableContainer>
        {isLoading ? (
          <LoadingContainer>
            <Typography variant="body1">Carregando cotações...</Typography>
          </LoadingContainer>
        ) : quotes.length > 0 ? (
          <Table>
            <TableHead>
              <tr>
                <TableHeaderCell>ID</TableHeaderCell>
                <TableHeaderCell>Data de Criação</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Ações</TableHeaderCell>
              </tr>
            </TableHead>
            <tbody>
              {quotes.map((quote) => (
                <TableRow key={quote.id}>
                  <TableCell>{quote.id}</TableCell>
                  <TableCell>{formatDate(quote.createDate)}</TableCell>
                  <TableCell>
                    {quote.status === 'Pending' && 'Pendente'}
                    {quote.status === 'Accepted' && 'Aceita'}
                    {quote.status === 'Canceled' && 'Cancelada'}
                    {quote.status && !['Pending', 'Accepted', 'Canceled'].includes(quote.status) && 'Desconhecido'}
                    {!quote.status && 'Indefinido'}
                  </TableCell>
                  <TableCell>
                    <ActionButtonsContainer>
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() => handleShowDetails(quote.id)}
                        disabled={loadingDetails}
                      >
                        {loadingDetails && quote.id === selectedQuote?.id ? 'Carregando...' : 'Detalhes'}
                      </Button>
                      {quote.status === 'Pending' && (
                        <Button
                          variant="error"
                          size="small"
                          onClick={() => handleCancelQuote(quote.id)}
                        >
                          Cancelar
                        </Button>
                      )}
                    </ActionButtonsContainer>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        ) : (
          <NoDataContainer>
            <Typography variant="body1">
              Nenhuma cotação encontrada.
            </Typography>
          </NoDataContainer>
        )}
      </TableContainer>
      
      <Modal
        isOpen={detailsModalOpen}
        onClose={closeDetailsModal}
        title={`Cotação #${selectedQuote?.id || ''}`}
        size="lg"
      >
        {selectedQuote ? (
          <QuoteDetails quote={selectedQuote} />
        ) : (
          <Typography>Carregando detalhes...</Typography>
        )}
      </Modal>

      {confirmDialog}
    </div>
  );
};

export default QuotesTable;
