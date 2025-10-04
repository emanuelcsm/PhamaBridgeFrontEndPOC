import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Typography, Card, Button } from '../common';
import { formatDate } from '../../utils/dateUtils';
import quoteService from '../../services/quoteService';
import { useNavigate } from 'react-router-dom';

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
  
  tbody &:hover {
    background-color: ${props => props.theme.colors.border};
  }
`;

const TableHeaderCell = styled.th`
  padding: ${props => props.theme.spacing.md};
`;

const TableCell = styled.td`
  padding: ${props => props.theme.spacing.md};
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

const PendingQuotesTable = ({ refreshTrigger = 0 }) => {
  const [quotes, setQuotes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const dataFetchedRef = useRef(false);
  const navigate = useNavigate();

  // Função para formatar o endereço completo
  const formatAddress = (address) => {
    if (!address) return '-';
    
    const {
      street,
      number,
      complement,
      neighborhood,
      city,
      state,
      zipCode
    } = address;
    
    let formattedAddress = `${street}, ${number}`;
    if (complement) formattedAddress += `, ${complement}`;
    formattedAddress += ` - ${neighborhood}, ${city}/${state}, ${zipCode}`;
    
    return formattedAddress;
  };

  // Função para buscar cotações
  const fetchQuotes = async () => {
    // Se já existe uma requisição em andamento, retorna ela
    if (pendingFetch) {
      return pendingFetch;
    }
    
    setIsLoading(true);
    setError(null);
    
    // Cria uma nova Promise e armazena para possível reuso
    pendingFetch = quoteService.getPharmacyQuotes()
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
  }, [refreshTrigger]);

  return (
    <div>
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
              <TableRow>
                <TableHeaderCell>ID</TableHeaderCell>
                <TableHeaderCell>Data de Criação</TableHeaderCell>
                <TableHeaderCell>Endereço de Entrega</TableHeaderCell>
                <TableHeaderCell>Ações</TableHeaderCell>
              </TableRow>
            </TableHead>
            <tbody>
              {quotes.map((quote) => (
                <TableRow key={quote.id}>
                  <TableCell>{quote.id}</TableCell>
                  <TableCell>{formatDate(quote.createDate)}</TableCell>
                  <TableCell>{formatAddress(quote.deliveryAddress)}</TableCell>
                  <TableCell>
                    <Button
                      variant="primary"
                      size="small"
                      onClick={() => navigate(`/pharmacy/orders/create/${quote.id}`)}
                    >
                      Criar ordem
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        ) : (
          <NoDataContainer>
            <Typography variant="body1">
              Nenhuma cotação encontrada
            </Typography>
          </NoDataContainer>
        )}
      </TableContainer>
    </div>
  );
};

export default PendingQuotesTable;