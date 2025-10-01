import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Typography, Card } from '../common';
import { formatDate } from '../../utils/dateUtils';

const DetailSection = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const SectionTitle = styled(Typography)`
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme.spacing.md};
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const DetailItem = styled.div`
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const DetailLabel = styled(Typography)`
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const ItemCard = styled(Card)`
  padding: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.md};
  box-shadow: ${props => props.theme.shadows.sm};
`;

const PrescriptionImage = styled.img`
  max-width: 100%;
  height: auto;
  margin-top: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borders.radius.md};
  box-shadow: ${props => props.theme.shadows.md};
`;

const QuoteDetails = ({ quote }) => {
  if (!quote) {
    return <Typography>Nenhuma cotação selecionada</Typography>;
  }

  const { id, userId, deliveryAddress, items, prescriptionImageId, image, createDate, status } = quote;

  const statusTranslation = {
    'Pending': 'Pendente',
    'Accepted': 'Aceita',
    'Canceled': 'Cancelada'
  };

  return (
    <div>
      <DetailSection>
        <SectionTitle variant="h5">Informações da Cotação</SectionTitle>
        <DetailGrid>
          <DetailItem>
            <DetailLabel variant="body2">Número da Cotação</DetailLabel>
            <Typography>{id}</Typography>
          </DetailItem>
          <DetailItem>
            <DetailLabel variant="body2">Data de Criação</DetailLabel>
            <Typography>{formatDate(createDate)}</Typography>
          </DetailItem>
          <DetailItem>
            <DetailLabel variant="body2">ID do Usuário</DetailLabel>
            <Typography>{userId}</Typography>
          </DetailItem>
          <DetailItem>
            <DetailLabel variant="body2">Status</DetailLabel>
            <Typography>{statusTranslation[status] || status}</Typography>
          </DetailItem>
        </DetailGrid>
      </DetailSection>

      <DetailSection>
        <SectionTitle variant="h5">Endereço de Entrega</SectionTitle>
        <DetailGrid>
          <DetailItem>
            <DetailLabel variant="body2">Rua</DetailLabel>
            <Typography>{deliveryAddress.street}</Typography>
          </DetailItem>
          <DetailItem>
            <DetailLabel variant="body2">Número</DetailLabel>
            <Typography>{deliveryAddress.number}</Typography>
          </DetailItem>
          <DetailItem>
            <DetailLabel variant="body2">Complemento</DetailLabel>
            <Typography>{deliveryAddress.complement || '-'}</Typography>
          </DetailItem>
          <DetailItem>
            <DetailLabel variant="body2">Bairro</DetailLabel>
            <Typography>{deliveryAddress.neighborhood}</Typography>
          </DetailItem>
          <DetailItem>
            <DetailLabel variant="body2">Cidade</DetailLabel>
            <Typography>{deliveryAddress.city}</Typography>
          </DetailItem>
          <DetailItem>
            <DetailLabel variant="body2">Estado</DetailLabel>
            <Typography>{deliveryAddress.state}</Typography>
          </DetailItem>
          <DetailItem>
            <DetailLabel variant="body2">CEP</DetailLabel>
            <Typography>{deliveryAddress.zipCode}</Typography>
          </DetailItem>
        </DetailGrid>
      </DetailSection>

      <DetailSection>
        <SectionTitle variant="h5">Itens da Cotação</SectionTitle>
        {items && items.map(item => (
          <ItemCard key={item.id}>
            <DetailItem>
              <DetailLabel variant="body2">Fórmula</DetailLabel>
              <Typography>{item.formula}</Typography>
            </DetailItem>
            <DetailItem>
              <DetailLabel variant="body2">Observação</DetailLabel>
              <Typography>{item.observation}</Typography>
            </DetailItem>
          </ItemCard>
        ))}
      </DetailSection>

      {prescriptionImageId && (
        <DetailSection>
          <SectionTitle variant="h5">Receita Médica</SectionTitle>
          {image ? (
            <PrescriptionImage 
              src={image} 
              alt="Receita médica" 
              loading="lazy" 
            />
          ) : (
            <Typography>Imagem da receita não disponível</Typography>
          )}
        </DetailSection>
      )}
    </div>
  );
};

QuoteDetails.propTypes = {
  quote: PropTypes.shape({
    id: PropTypes.number.isRequired,
    userId: PropTypes.number.isRequired,
    deliveryAddress: PropTypes.shape({
      street: PropTypes.string.isRequired,
      number: PropTypes.string.isRequired,
      complement: PropTypes.string,
      neighborhood: PropTypes.string.isRequired,
      city: PropTypes.string.isRequired,
      state: PropTypes.string.isRequired,
      zipCode: PropTypes.string.isRequired,
    }).isRequired,
    items: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      formula: PropTypes.string.isRequired,
      observation: PropTypes.string,
    })).isRequired,
    prescriptionImageId: PropTypes.number,
    image: PropTypes.string, // URL para a imagem
    createDate: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }),
};

export default QuoteDetails;