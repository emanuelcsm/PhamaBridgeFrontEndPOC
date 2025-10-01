import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Typography } from '../common';
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

const QuoteTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-top: ${props => props.theme.spacing.md};
  box-shadow: ${props => props.theme.shadows.sm};
  border-radius: ${props => props.theme.borders.radius.md};
  overflow: hidden;
`;

const TableHead = styled.thead`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  
  th {
    padding: ${props => props.theme.spacing.md};
    text-align: left;
    font-weight: ${props => props.theme.typography.fontWeights.medium};
    
    &:first-child {
      border-top-left-radius: ${props => props.theme.borders.radius.sm};
    }
    
    &:last-child {
      border-top-right-radius: ${props => props.theme.borders.radius.sm};
    }
  }
`;

const TableRow = styled.tr`
  border-bottom: 1px solid ${props => props.theme.colors.border};
  
  &.main-item {
    background-color: ${props => props.theme.colors.surface};
    font-weight: ${props => props.theme.typography.fontWeights.medium};
  }
  
  &.additional-item {
    background-color: white;
  }
  
  td {
    padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  }
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
        
        <div style={{ overflowX: 'auto' }}>
          <QuoteTable>
            <TableHead>
              <tr>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Composto</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Forma</th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>Concentração</th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>Quantidade</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Componentes Adicionais</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Observação</th>
              </tr>
            </TableHead>
            <tbody>
              {items && items.map(item => (
                <React.Fragment key={item.id}>
                  {/* Item Principal */}
                  <TableRow className="main-item">
                    <td style={{ fontWeight: 'bold' }}>{item.mainCompoundName}</td>
                    <td>{item.pharmaceuticalForm}</td>
                    <td style={{ textAlign: 'center' }}>
                      {item.concentrationValue} {item.concentrationUnit}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {item.totalQuantity} {item.quantityUnit}
                    </td>
                    <td style={{ whiteSpace: 'pre-line' }}>
                      {item.additionalComponents && item.additionalComponents.length > 0 
                        ? item.additionalComponents.map(comp => 
                            `${comp.concentrationValue} ${comp.concentrationUnit} x ${comp.activeIngredientName}`
                          ).join('\r\n')
                        : '-'
                      }
                    </td>
                    <td>{item.observation || '-'}</td>
                  </TableRow>
                </React.Fragment>
              ))}
            </tbody>
          </QuoteTable>
        </div>
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
      mainCompoundName: PropTypes.string.isRequired,
      pharmaceuticalForm: PropTypes.string.isRequired,
      concentrationValue: PropTypes.number.isRequired,
      concentrationUnit: PropTypes.string.isRequired,
      totalQuantity: PropTypes.number.isRequired,
      quantityUnit: PropTypes.string.isRequired,
      observation: PropTypes.string,
      additionalComponents: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        activeIngredientName: PropTypes.string.isRequired,
        concentrationValue: PropTypes.number.isRequired,
        concentrationUnit: PropTypes.string.isRequired,
      })),
    })).isRequired,
    prescriptionImageId: PropTypes.number,
    image: PropTypes.string, // URL para a imagem
    createDate: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }),
};

export default QuoteDetails;