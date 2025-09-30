import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../../api/api';
import { Typography, Card } from '../common';
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
  const [pendingQuotes, setPendingQuotes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const loadPendingQuotes = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.get('/quote/listpending');
      setPendingQuotes(response.data);
    } catch (err) {
      setError('Erro ao carregar cotações pendentes');
      console.error('Erro ao carregar cotações pendentes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPendingQuotes();
  }, [refreshTrigger]);

  if (isLoading) {
    return (
      <LoadingContainer>
        <Typography variant="body1">Carregando cotações pendentes...</Typography>
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <NoDataContainer>
        <Typography variant="body1" color="error">{error}</Typography>
      </NoDataContainer>
    );
  }

  if (!pendingQuotes || pendingQuotes.length === 0) {
    return (
      <NoDataContainer>
        <Typography variant="body1">Nenhuma cotação pendente encontrada</Typography>
      </NoDataContainer>
    );
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>ID</TableHeaderCell>
            <TableHeaderCell>Data de Criação</TableHeaderCell>
            <TableHeaderCell>Endereço de Entrega</TableHeaderCell>
          </TableRow>
        </TableHead>
        <tbody>
          {pendingQuotes.map((quote) => (
            <TableRow key={quote.id}>
              <TableCell>{quote.id}</TableCell>
              <TableCell>{formatDate(quote.createDate)}</TableCell>
              <TableCell>{formatAddress(quote.deliveryAddress)}</TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </TableContainer>
  );
};

export default PendingQuotesTable;