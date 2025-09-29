import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../../api/api';
import { Button, Typography, Card } from '../common';
import { formatDate } from '../../utils/dateUtils';

const TableContainer = styled(Card)`
  width: 100%;
  overflow-x: auto;
  margin-top: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borders.radius};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

  const loadQuotes = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      let url = '/quote/list';
      if (statusFilter) {
        url += `?status=${statusFilter}`;
      }
      
      const response = await api.get(url);
      setQuotes(response.data);
    } catch (err) {
      setError('Erro ao carregar cotações');
      console.error('Erro ao carregar cotações:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadQuotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, refreshTrigger]);

  const handleShowDetails = (quoteId) => {
    // Implementar lógica para exibir detalhes da cotação
    alert(`Detalhes da cotação ${quoteId}`);
  };

  const handleCancelQuote = async (quoteId) => {
    if (window.confirm('Tem certeza que deseja cancelar esta cotação?')) {
      setIsLoading(true);
      try {
        await api.post(`/quote/cancel/${quoteId}`);
        // Atualizar a lista após o cancelamento
        loadQuotes();
      } catch (err) {
        setError('Erro ao cancelar cotação');
        console.error('Erro ao cancelar cotação:', err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div>
      <FilterContainer>
        <FilterButton 
          variant={statusFilter === "" ? "primary" : "secondary"} 
          onClick={() => setStatusFilter("")}
        >
          Todos
        </FilterButton>
        <FilterButton 
          variant={statusFilter === "Pending" ? "primary" : "secondary"} 
          onClick={() => setStatusFilter("Pending")}
        >
          Pendentes
        </FilterButton>
        <FilterButton 
          variant={statusFilter === "Accepted" ? "primary" : "secondary"} 
          onClick={() => setStatusFilter("Accepted")}
        >
          Aceitas
        </FilterButton>
        <FilterButton 
          variant={statusFilter === "Canceled" ? "primary" : "secondary"} 
          onClick={() => setStatusFilter("Canceled")}
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
                  </TableCell>
                  <TableCell>
                    <ActionButtonsContainer>
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() => handleShowDetails(quote.id)}
                      >
                        Detalhes
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
    </div>
  );
};

export default QuotesTable;