import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import axios from 'axios';
import { Typography } from './Typography';
import { Card } from './Card';
import { Grid } from './Grid';
import { Badge } from './Badge';
import { formatDate } from '../../utils/dateUtils';

const Container = styled.div`
  padding: 20px;
  width: 100%;
`;

const ItemsContainer = styled.div`
  margin-top: 20px;
  margin-bottom: 20px;
`;

const Item = styled.div`
  padding: 12px;
  margin-bottom: 12px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
`;

const AddressContainer = styled.div`
  margin-top: 16px;
  padding: 16px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: 8px;
`;

const PrescriptionImageContainer = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PrescriptionImage = styled.img`
  max-width: 100%;
  border-radius: 8px;
  margin-top: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const StatusBadge = styled(Badge)`
  margin-left: 16px;
`;

const QuoteDetails = ({ quoteId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quote, setQuote] = useState(null);
  const [prescriptionImage, setPrescriptionImage] = useState(null);

  // Fetch quote details
  useEffect(() => {
    const fetchQuoteDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get(`/api/quote/${quoteId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setQuote(response.data);
        
        // Now fetch the prescription image
        if (response.data.prescriptionImageId) {
          await fetchPrescriptionImage(response.data.prescriptionImageId, token);
        }
        
        setLoading(false);
      } catch (err) {
        setError('Erro ao carregar detalhes da receita');
        setLoading(false);
        console.error('Error fetching quote details:', err);
      }
    };

    if (quoteId) {
      fetchQuoteDetails();
    }
  }, [quoteId]);

  const fetchPrescriptionImage = async (prescriptionId, token) => {
    try {
      const response = await axios.get(
        `/api/prescription/${prescriptionId}/image`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: 'blob' // Importante para receber dados binários
        }
      );

      // Criar uma URL para o blob
      const imageUrl = URL.createObjectURL(response.data);
      setPrescriptionImage(imageUrl);
    } catch (err) {
      console.error('Error fetching prescription image:', err);
    }
  };

  // Helper function to get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pendente':
        return 'warning';
      case 'aprovado':
      case 'concluído':
        return 'success';
      case 'recusado':
        return 'error';
      default:
        return 'info';
    }
  };

  if (loading) {
    return (
      <Container>
        <Typography variant="h3">Carregando detalhes da receita...</Typography>
      </Container>
    );
  }

  if (error || !quote) {
    return (
      <Container>
        <Typography variant="h3" color="error">
          {error || 'Não foi possível carregar os detalhes da receita'}
        </Typography>
      </Container>
    );
  }

  const { id, deliveryAddress, items, createDate, status } = quote;

  return (
    <Container>
      <Card>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h3">
              Detalhes da Receita #{id}
              <StatusBadge color={getStatusColor(status)}>{status}</StatusBadge>
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              Criada em: {formatDate(createDate)}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h4">Medicamentos</Typography>
            <ItemsContainer>
              {items.map((item) => (
                <Item key={item.id}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {item.formula}
                  </Typography>
                  {item.observation && (
                    <Typography variant="body2">Observação: {item.observation}</Typography>
                  )}
                </Item>
              ))}
            </ItemsContainer>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h4">Endereço de Entrega</Typography>
            <AddressContainer>
              <Typography variant="body1">
                {deliveryAddress.street}, {deliveryAddress.number}
                {deliveryAddress.complement && ` - ${deliveryAddress.complement}`}
              </Typography>
              <Typography variant="body1">
                {deliveryAddress.neighborhood}
              </Typography>
              <Typography variant="body1">
                {deliveryAddress.city} - {deliveryAddress.state}
              </Typography>
              <Typography variant="body1">
                CEP: {deliveryAddress.zipCode}
              </Typography>
            </AddressContainer>
          </Grid>

          {prescriptionImage && (
            <Grid item xs={12}>
              <PrescriptionImageContainer>
                <Typography variant="h4">Imagem da Receita</Typography>
                <PrescriptionImage src={prescriptionImage} alt="Imagem da Receita" />
              </PrescriptionImageContainer>
            </Grid>
          )}
        </Grid>
      </Card>
    </Container>
  );
};

QuoteDetails.propTypes = {
  quoteId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
};

export default QuoteDetails;