import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Typography, Card } from '../common';
import { formatDate } from '../../utils/dateUtils';
import orderService from '../../services/orderService';

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

const StatusBadge = styled.span`
  padding: 4px 8px;
  border-radius: ${props => props.theme.borders.radius.sm};
  font-size: 0.875rem;
  font-weight: 500;
  
  ${({ status, theme }) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return `
          background-color: ${theme.colors.info}20;
          color: ${theme.colors.info};
        `;
      case 'approved':
        return `
          background-color: ${theme.colors.success}20;
          color: ${theme.colors.success};
        `;
      case 'ready':
        return `
          background-color: ${theme.colors.warning}20;
          color: ${theme.colors.warning};
        `;
      default:
        return `
          background-color: ${theme.colors.text.disabled}20;
          color: ${theme.colors.text.disabled};
        `;
    }
  }}
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

const OrdersTable = ({ status }) => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (pendingFetch) {
        return pendingFetch;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        pendingFetch = orderService.listOrders(status);
        const result = await pendingFetch;
        setOrders(result);
        pendingFetch = null;
      } catch (error) {
        console.error(`Erro ao buscar ordens com status ${status}:`, error);
        setError('Falha ao carregar as ordens. Por favor, tente novamente.');
        pendingFetch = null;
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [status]);

  if (isLoading) {
    return (
      <LoadingContainer>
        <Typography>Carregando ordens...</Typography>
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <LoadingContainer>
        <Typography color="error">{error}</Typography>
      </LoadingContainer>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <NoDataContainer>
        <Typography>Nenhuma ordem encontrada com este status.</Typography>
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
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell>Ações</TableHeaderCell>
          </TableRow>
        </TableHead>
        <tbody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell>{formatDate(order.createDate)}</TableCell>
              <TableCell>
                <StatusBadge status={status}>{status}</StatusBadge>
              </TableCell>
              <TableCell>
                {/* Coluna de ações vazia conforme solicitado */}
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </TableContainer>
  );
};

export default OrdersTable;