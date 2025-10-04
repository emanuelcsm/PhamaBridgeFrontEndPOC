import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Typography, Card } from '../common';
import orderService from '../../services/orderService';

// Cache para evitar chamadas duplicadas à API
let pendingFetch = null;

const TableContainer = styled(Card)`
  width: 100%;
  overflow-x: auto;
  margin-top: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borders.radius.md};
  box-shadow: ${props => props.theme.shadows.md};

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

const FilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.md};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xl};
  color: ${props => props.theme.colors.text.secondary};
`;

const LoadingState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xl};
  color: ${props => props.theme.colors.text.secondary};
`;

const OrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    if (pendingFetch) {
      return pendingFetch;
    }
    
    setLoading(true);
    
    try {
      pendingFetch = orderService.getOrdersByUser();
      const fetchedOrders = await pendingFetch;
      setOrders(fetchedOrders || []);
      setError(null);
    } catch (err) {
      console.error('Erro ao buscar pedidos:', err);
      setError('Não foi possível carregar os pedidos. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
      pendingFetch = null;
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Função para calcular o valor total do pedido
  const calculateOrderTotal = (order) => {
    // Soma dos preços dos itens multiplicados pelas quantidades
    const itemsTotal = order.items.reduce((total, item) => {
      return total + (item.price * item.totalQuantity);
    }, 0);
    
    // Adiciona o custo de envio e subtrai o desconto
    return itemsTotal + order.shippingCost - order.discountValue;
  };

  if (loading) {
    return (
      <TableContainer>
        <LoadingState>
          <Typography variant="body1">Carregando pedidos...</Typography>
        </LoadingState>
      </TableContainer>
    );
  }

  if (error) {
    return (
      <TableContainer>
        <EmptyState>
          <Typography variant="body1" color="error">{error}</Typography>
        </EmptyState>
      </TableContainer>
    );
  }

  if (!orders.length) {
    return (
      <TableContainer>
        <EmptyState>
          <Typography variant="body1">Nenhum pedido encontrado.</Typography>
        </EmptyState>
      </TableContainer>
    );
  }

  return (
    <>
      <FilterContainer>
        <Typography variant="h6">Seus Pedidos</Typography>
      </FilterContainer>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>ID do Pedido</TableHeaderCell>
              <TableHeaderCell>ID da Cotação</TableHeaderCell>
              <TableHeaderCell>Nome da Farmácia</TableHeaderCell>
              <TableHeaderCell>Endereço da Farmácia</TableHeaderCell>
              <TableHeaderCell>Valor Total (R$)</TableHeaderCell>
              <TableHeaderCell>Ações</TableHeaderCell>
            </TableRow>
          </TableHead>
          <tbody>
            {orders.map(order => {
              const pharmacy = order.pharmacy;
              const address = `${pharmacy.street}, ${pharmacy.number}${pharmacy.complement ? `, ${pharmacy.complement}` : ''}, ${pharmacy.neighborhood}, ${pharmacy.city} - ${pharmacy.state}, ${pharmacy.zipCode}`;
              const total = calculateOrderTotal(order).toFixed(2);
              
              return (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.quoteId}</TableCell>
                  <TableCell>{pharmacy.name}</TableCell>
                  <TableCell>{address}</TableCell>
                  <TableCell>{total}</TableCell>
                  <TableCell>{/* Ações ficam vazias conforme solicitado */}</TableCell>
                </TableRow>
              );
            })}
          </tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default OrdersTable;