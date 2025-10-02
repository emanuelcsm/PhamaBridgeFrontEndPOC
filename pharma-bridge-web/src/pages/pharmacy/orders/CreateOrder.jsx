import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { 
  Typography, 
  Button,
  Modal,
  Input,
  Grid,
  Card
} from '../../../components/common';
import { 
  PageContainer, 
  Header, 
  HeaderContent, 
  UserInfo, 
  Content,
  Logo,
  FormGroup
} from '../../../components/styled';
import { useAuth } from '../../../AuthContext';
import { LogoImage, UserAvatar, UserNameDisplay, DecimalInput } from '../../../components/common';
import quoteService from '../../../services/quoteService';
import orderService from '../../../services/orderService';

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const SectionCard = styled(Card)`
  margin-bottom: ${props => props.theme.spacing.lg};
  padding: ${props => props.theme.spacing.md};
`;

const ItemsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: ${props => props.theme.spacing.md};
  
  th, td {
    border: 1px solid ${props => props.theme.colors.border};
    padding: ${props => props.theme.spacing.sm};
    text-align: left;
  }
  
  th {
    background-color: ${props => props.theme.colors.surface};
    font-weight: ${props => props.theme.typography.fontWeights.medium};
  }
  
  tr:nth-child(even) {
    background-color: ${props => props.theme.colors.backgroundAlt};
  }
`;

const ItemActions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
`;

const PrescriptionImage = styled.div`
  margin-top: ${props => props.theme.spacing.md};
  
  img {
    max-width: 200px;
    max-height: 200px;
    cursor: pointer;
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: ${props => props.theme.borders.radius.sm};
    transition: all ${props => props.theme.transitions.normal};
    
    &:hover {
      transform: scale(1.05);
    }
  }
`;

const AddressSection = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.md};
  
  p {
    margin: ${props => props.theme.spacing.xxs} 0;
  }
`;

const AddressBlock = styled.div`
  padding: ${props => props.theme.spacing.md};
  background-color: ${props => props.theme.colors.backgroundAlt};
  border-radius: ${props => props.theme.borders.radius.md};
`;

const CreateOrder = () => {
  const { quoteId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [quoteDetails, setQuoteDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados para o formulário de ordem
  const [orderItems, setOrderItems] = useState([]);
  const [shippingCost, setShippingCost] = useState(0);
  const [discountValue, setDiscountValue] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  
  // Função para calcular o total da ordem
  const calculateOrderTotal = () => {
    // Soma dos preços dos itens (quantidade * preço unitário) para itens não ignorados
    const itemsTotal = orderItems.reduce((total, item) => {
      if (!item.ignore) {
        return total + (item.price || 0) * (item.totalQuantity || 0);
      }
      return total;
    }, 0);
    
    // Adicionar frete e subtrair desconto
    const shipping = parseFloat(shippingCost) || 0;
    const discount = parseFloat(discountValue) || 0;
    
    return itemsTotal + shipping - discount;
  };
  
  // Estados para o modal de edição de item
  const [isItemModalOpen, setItemModalOpen] = useState(false);
  const [isComponentModalOpen, setComponentModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState({
    quoteItemId: null,
    mainCompoundName: '',
    pharmaceuticalForm: '',
    concentrationValue: 0,
    concentrationUnit: '',
    totalQuantity: 0,
    quantityUnit: '',
    price: 0,
    observation: '',
    ignore: false,
    additionalComponents: []
  });
  const [currentComponent, setCurrentComponent] = useState({
    activeIngredientName: '',
    concentrationValue: 0,
    concentrationUnit: ''
  });
  const [editingIndex, setEditingIndex] = useState(-1);
  const [editingComponentIndex, setEditingComponentIndex] = useState(-1);
  
  // Estados para visualização da imagem
  const [isImageModalOpen, setImageModalOpen] = useState(false);
  
  // Função para obter as iniciais da farmácia
  const getPharmacyInitial = () => {
    if (!user?.username) return '?';
    return user.username.charAt(0).toUpperCase();
  };

  useEffect(() => {
    let isMounted = true;
    
    const fetchQuoteDetails = async () => {
      try {
        setIsLoading(true);
        const details = await quoteService.getQuoteDetails(quoteId);
        
        // Só atualiza o estado se o componente ainda estiver montado
        if (isMounted) {
          // Use the details exactly as returned by the API
          setQuoteDetails(details);
          
          // Log detalhado dos dados da cotação para debug
          console.log('Detalhes completos da cotação recebida:', JSON.stringify(details, null, 2));
          console.log('URL da imagem da receita (do serviço):', details.image);
          
          // Transformar itens da cotação para o formato necessário para a ordem
          if (details && details.items) {
            const mappedItems = details.items.map(item => ({
              quoteItemId: item.id,
              mainCompoundName: item.mainCompoundName,
              pharmaceuticalForm: item.pharmaceuticalForm,
              concentrationValue: item.concentrationValue,
              concentrationUnit: item.concentrationUnit,
              totalQuantity: item.totalQuantity,
              quantityUnit: item.quantityUnit,
              price: item.price || 0,
              observation: item.observation || '',
              ignore: false,
              additionalComponents: item.additionalComponents?.map(comp => ({
                activeIngredientName: comp.activeIngredientName,
                concentrationValue: comp.concentrationValue,
                concentrationUnit: comp.concentrationUnit
              })) || []
            }));
            
            setOrderItems(mappedItems);
          }
        }
      } catch (err) {
        if (isMounted) {
          setError('Erro ao carregar detalhes da cotação');
          console.error('Erro ao carregar detalhes da cotação:', err);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (quoteId) {
      fetchQuoteDetails();
    }
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [quoteId]);

  const handleCancel = () => {
    navigate(-1); // Volta para a página anterior
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Calcular valor total antes de enviar
      const totalOrderValue = calculateOrderTotal();
      
      // Preparar dados para envio - nomes de campos conforme esperado pela API
      const orderData = {
        quoteId: parseInt(quoteId),
        ShippingCost: parseFloat(shippingCost), // Campo atualizado para o formato esperado pela API
        DiscountValue: parseFloat(discountValue), // Campo atualizado para o formato esperado pela API
        totalValue: totalOrderValue,
        items: orderItems.map(item => ({
          ...item,
          price: parseFloat(item.price || 0), // Adicionado campo Price para cada item
          totalPrice: (item.price || 0) * (item.totalQuantity || 0)
        }))
      };
      
      console.log('Enviando ordem:', orderData);
      
      // Enviar dados para a API
      await orderService.createOrder(orderData);
      
      // Em caso de sucesso, retornar à página anterior
      navigate(-1);
    } catch (err) {
      console.error('Erro ao salvar ordem:', err);
      // Aqui poderia mostrar uma mensagem de erro para o usuário
    } finally {
      setIsSaving(false);
    }
  };
  
  // Funções para edição de itens
  const handleEditItem = (index) => {
    setCurrentItem({...orderItems[index]});
    setEditingIndex(index);
    setItemModalOpen(true);
  };
  
  const handleItemChange = (field, value) => {
    setCurrentItem(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSaveItem = () => {
    const updatedItems = [...orderItems];
    updatedItems[editingIndex] = currentItem;
    setOrderItems(updatedItems);
    setItemModalOpen(false);
  };
  
  const handleOpenComponentModal = () => {
    setComponentModalOpen(true);
  };
  
  const handleComponentChange = (field, value) => {
    setCurrentComponent(prev => ({ ...prev, [field]: value }));
  };
  
  const handleAddComponent = () => {
    if (currentComponent.activeIngredientName && currentComponent.activeIngredientName.trim()) {
      if (editingComponentIndex >= 0) {
        // Editar componente existente
        const updatedItem = {...currentItem};
        updatedItem.additionalComponents[editingComponentIndex] = {...currentComponent};
        setCurrentItem(updatedItem);
        setEditingComponentIndex(-1);
      } else {
        // Adicionar novo componente
        const updatedItem = {...currentItem};
        updatedItem.additionalComponents = [
          ...(updatedItem.additionalComponents || []),
          {...currentComponent}
        ];
        setCurrentItem(updatedItem);
      }
      
      // Limpar o formulário de componente
      setCurrentComponent({
        activeIngredientName: '',
        concentrationValue: 0,
        concentrationUnit: ''
      });
    }
  };
  
  const handleEditComponent = (index) => {
    setCurrentComponent({...currentItem.additionalComponents[index]});
    setEditingComponentIndex(index);
  };
  
  const handleRemoveComponent = (index) => {
    const updatedItem = {...currentItem};
    updatedItem.additionalComponents = updatedItem.additionalComponents.filter((_, i) => i !== index);
    setCurrentItem(updatedItem);
  };
  
  const handleComponentsModalClose = () => {
    setComponentModalOpen(false);
    setEditingComponentIndex(-1);
    setCurrentComponent({
      activeIngredientName: '',
      concentrationValue: 0,
      concentrationUnit: ''
    });
  };
  
  const handleToggleIgnore = (index) => {
    const updatedItems = [...orderItems];
    updatedItems[index] = {
      ...updatedItems[index],
      ignore: !updatedItems[index].ignore
    };
    setOrderItems(updatedItems);
  };
  
  const openPrescriptionImage = () => {
    setImageModalOpen(true);
  };
  
  const openImageInNewTab = () => {
    if (quoteDetails?.image) {
      window.open(quoteDetails.image, '_blank');
    }
  };

  return (
    <PageContainer>
      <Header>
        <HeaderContent>
          <Logo>
            <LogoImage size="40px" clickable />
          </Logo>
          <UserInfo>
            <UserNameDisplay user={user} greeting="Olá" />
            <UserAvatar variant="pharmacy" initials={getPharmacyInitial()} />
          </UserInfo>
        </HeaderContent>
      </Header>

      <Content>
        <Typography variant="h5" style={{ marginBottom: '16px' }}>
          Criar Nova Ordem - Cotação #{quoteId}
        </Typography>

        <ButtonsContainer>
          <Button 
            variant="outline" 
            onClick={handleCancel}
          >
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? 'Salvando...' : 'Salvar'}
          </Button>
        </ButtonsContainer>

        {isLoading ? (
          <Typography variant="body1">Carregando detalhes da cotação...</Typography>
        ) : error ? (
          <Typography variant="body1" color="error">
            {error}
          </Typography>
        ) : quoteDetails ? (
          <>
            {/* Seção de Endereço de Entrega */}
            <SectionCard>
              <Typography variant="h6" style={{ marginBottom: '16px' }}>
                Endereço de Entrega
              </Typography>
              
              <AddressSection>
                <AddressBlock>
                  <Typography variant="body2" color="textSecondary">Endereço:</Typography>
                  <Typography variant="body1">
                    {quoteDetails.deliveryAddress?.street || quoteDetails.street}, {quoteDetails.deliveryAddress?.number || quoteDetails.number}
                    {(quoteDetails.deliveryAddress?.complement || quoteDetails.complement) && ` - ${quoteDetails.deliveryAddress?.complement || quoteDetails.complement}`}
                  </Typography>
                  
                  <Typography variant="body1">
                    {quoteDetails.deliveryAddress?.neighborhood || quoteDetails.neighborhood} - {quoteDetails.deliveryAddress?.city || quoteDetails.city}, {quoteDetails.deliveryAddress?.state || quoteDetails.state}
                  </Typography>
                  
                  <Typography variant="body1">
                    CEP: {quoteDetails.deliveryAddress?.zipCode || quoteDetails.zipCode}
                  </Typography>
                  
                  <Typography variant="body2" color="textSecondary" style={{ marginTop: '8px' }}>
                    Telefone:
                  </Typography>
                  <Typography variant="body1">
                    {quoteDetails.deliveryAddress?.phoneNumber || quoteDetails.phoneNumber}
                  </Typography>
                </AddressBlock>
                
                {/* Imagem da Receita */}
                <PrescriptionImage>
                  <Typography variant="body2" color="textSecondary" style={{ marginBottom: '8px' }}>
                    Receita Médica:
                  </Typography>
                  
                  {quoteDetails.image ? (
                    <>
                      <img 
                        src={quoteDetails.image}
                        alt="Receita Médica" 
                        onClick={openPrescriptionImage}
                        style={{ cursor: 'pointer' }}
                      />
                      <div style={{ marginTop: '8px' }}>
                        <Button 
                          variant="outline" 
                          size="small"
                          onClick={openImageInNewTab}
                        >
                          Abrir em nova janela
                        </Button>
                      </div>
                    </>
                  ) : (
                    <Typography variant="body2" style={{ fontStyle: 'italic' }}>
                      Imagem da receita não disponível
                    </Typography>
                  )}
                </PrescriptionImage>
              </AddressSection>
            </SectionCard>
            
            {/* Valores e Custos */}
            <SectionCard>
              <Typography variant="h6" style={{ marginBottom: '16px' }}>
                Valores e Custos
              </Typography>
              
              <Grid.Row>
                <Grid.Col size={6}>
                  <FormGroup>
                    <DecimalInput
                      label="Valor do Frete (R$)"
                      value={shippingCost}
                      onChange={(e) => setShippingCost(e.target.value)}
                      decimalPlaces={2}
                      min={0}
                      fullWidth
                    />
                  </FormGroup>
                </Grid.Col>
                <Grid.Col size={6}>
                  <FormGroup>
                    <DecimalInput
                      label="Valor de Desconto (R$)"
                      value={discountValue}
                      onChange={(e) => setDiscountValue(e.target.value)}
                      decimalPlaces={2}
                      min={0}
                      fullWidth
                    />
                  </FormGroup>
                </Grid.Col>
              </Grid.Row>
              
              {/* Mostrar o valor total da ordem */}
              <div style={{ 
                marginTop: '20px', 
                padding: '15px', 
                backgroundColor: '#f0f8ff', 
                borderRadius: '8px',
                border: '1px solid #a8d4ff'
              }}>
                <Grid.Row>
                  <Grid.Col size={8}>
                    <Typography variant="h5" style={{ fontWeight: 'bold', color: '#0059b3' }}>
                      Valor Total da Ordem:
                    </Typography>
                  </Grid.Col>
                  <Grid.Col size={4} style={{ textAlign: 'right' }}>
                    <Typography variant="h4" style={{ fontWeight: 'bold', color: '#0059b3' }}>
                      R$ {calculateOrderTotal().toFixed(2)}
                    </Typography>
                  </Grid.Col>
                </Grid.Row>
                
                <Grid.Row style={{ marginTop: '10px', fontSize: '0.9em', color: '#555' }}>
                  <Grid.Col size={8}>
                    <Typography variant="body2">
                      Total de itens ({orderItems.filter(item => !item.ignore).length}):
                    </Typography>
                  </Grid.Col>
                  <Grid.Col size={4} style={{ textAlign: 'right' }}>
                    <Typography variant="body2">
                      R$ {orderItems.reduce((total, item) => !item.ignore ? total + (item.price || 0) * (item.totalQuantity || 0) : total, 0).toFixed(2)}
                    </Typography>
                  </Grid.Col>
                </Grid.Row>
                
                <Grid.Row style={{ fontSize: '0.9em', color: '#555' }}>
                  <Grid.Col size={8}>
                    <Typography variant="body2">
                      Frete:
                    </Typography>
                  </Grid.Col>
                  <Grid.Col size={4} style={{ textAlign: 'right' }}>
                    <Typography variant="body2">
                      + R$ {parseFloat(shippingCost || 0).toFixed(2)}
                    </Typography>
                  </Grid.Col>
                </Grid.Row>
                
                <Grid.Row style={{ fontSize: '0.9em', color: '#555' }}>
                  <Grid.Col size={8}>
                    <Typography variant="body2">
                      Desconto:
                    </Typography>
                  </Grid.Col>
                  <Grid.Col size={4} style={{ textAlign: 'right' }}>
                    <Typography variant="body2">
                      - R$ {parseFloat(discountValue || 0).toFixed(2)}
                    </Typography>
                  </Grid.Col>
                </Grid.Row>
              </div>
            </SectionCard>
            
            {/* Itens da Ordem */}
            <SectionCard>
              <Typography variant="h6" style={{ marginBottom: '16px' }}>
                Itens da Ordem
              </Typography>
              
              {orderItems.length > 0 ? (
                <ItemsTable>
                  <thead>
                    <tr>
                      <th>Composto Principal</th>
                      <th>Forma Farmacêutica</th>
                      <th>Concentração</th>
                      <th>Quantidade</th>
                      <th>Preço Unitário (R$)</th>
                      <th>Preço Total (R$)</th>
                      <th>Componentes</th>
                      <th>Ignorar</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderItems.map((item, index) => (
                      <tr key={index} style={item.ignore ? { opacity: 0.5 } : {}}>
                        <td>{item.mainCompoundName}</td>
                        <td>{item.pharmaceuticalForm}</td>
                        <td>{item.concentrationValue} {item.concentrationUnit}</td>
                        <td>{item.totalQuantity} {item.quantityUnit}</td>
                        <td>
                          <DecimalInput
                            value={item.price}
                            onChange={(e) => {
                              const updatedItems = [...orderItems];
                              updatedItems[index].price = parseFloat(e.target.value) || 0;
                              setOrderItems(updatedItems);
                            }}
                            decimalPlaces={2}
                            min={0}
                            size="small"
                            style={{ width: '80px' }}
                          />
                        </td>
                        <td style={{ fontWeight: 'bold' }}>
                          {((item.price || 0) * (item.totalQuantity || 0)).toFixed(2)}
                        </td>
                        <td>{item.additionalComponents?.length || 0}</td>
                        <td>
                          <input 
                            type="checkbox" 
                            checked={item.ignore} 
                            onChange={() => handleToggleIgnore(index)}
                          />
                        </td>
                        <td>
                          <ItemActions>
                            <Button 
                              variant="text" 
                              size="small"
                              onClick={() => handleEditItem(index)}
                            >
                              Editar
                            </Button>
                          </ItemActions>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </ItemsTable>
              ) : (
                <Typography variant="body2" style={{ fontStyle: 'italic' }}>
                  Nenhum item encontrado na cotação.
                </Typography>
              )}
            </SectionCard>
          </>
        ) : (
          <Typography variant="body1" color="error">
            Cotação não encontrada.
          </Typography>
        )}
        
        {/* Modal para editar item */}
        <Modal
          isOpen={isItemModalOpen}
          title="Editar Item"
          onClose={() => setItemModalOpen(false)}
          size="md"
        >
          <FormGroup>
            <Input
              label="Nome do Composto Principal"
              placeholder="Ex: Metformina"
              value={currentItem.mainCompoundName}
              onChange={(e) => handleItemChange('mainCompoundName', e.target.value)}
              fullWidth
            />
          </FormGroup>
          
          <Grid.Row>
            <Grid.Col size={6}>
              <FormGroup>
                <Input
                  label="Forma Farmacêutica"
                  placeholder="Ex: Cápsula"
                  value={currentItem.pharmaceuticalForm}
                  onChange={(e) => handleItemChange('pharmaceuticalForm', e.target.value)}
                  fullWidth
                />
              </FormGroup>
            </Grid.Col>
            <Grid.Col size={3}>
              <FormGroup>
                <DecimalInput
                  label="Concentração"
                  placeholder="Ex: 500,00"
                  value={currentItem.concentrationValue}
                  onChange={(e) => handleItemChange('concentrationValue', e.target.value)}
                  decimalPlaces={2}
                  min={0.01}
                  fullWidth
                />
              </FormGroup>
            </Grid.Col>
            <Grid.Col size={3}>
              <FormGroup>
                <Input
                  label="Unidade"
                  placeholder="Ex: mg"
                  value={currentItem.concentrationUnit}
                  onChange={(e) => handleItemChange('concentrationUnit', e.target.value)}
                  fullWidth
                />
              </FormGroup>
            </Grid.Col>
          </Grid.Row>
          
          <Grid.Row>
            <Grid.Col size={6}>
              <FormGroup>
                <Input
                  label="Quantidade Total"
                  type="number"
                  placeholder="Ex: 30"
                  value={currentItem.totalQuantity}
                  onChange={(e) => handleItemChange('totalQuantity', parseInt(e.target.value) || 0)}
                  fullWidth
                />
              </FormGroup>
            </Grid.Col>
            <Grid.Col size={6}>
              <FormGroup>
                <Input
                  label="Unidade de Quantidade"
                  placeholder="Ex: unidades"
                  value={currentItem.quantityUnit}
                  onChange={(e) => handleItemChange('quantityUnit', e.target.value)}
                  fullWidth
                />
              </FormGroup>
            </Grid.Col>
          </Grid.Row>
          
          <Grid.Row>
            <Grid.Col size={6}>
              <FormGroup>
                <DecimalInput
                  label="Preço Unitário (R$)"
                  placeholder="Ex: 10,50"
                  value={currentItem.price}
                  onChange={(e) => handleItemChange('price', e.target.value)}
                  decimalPlaces={2}
                  min={0}
                  fullWidth
                />
              </FormGroup>
            </Grid.Col>
            <Grid.Col size={6}>
              <FormGroup>
                <div style={{ padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px', marginTop: '20px' }}>
                  <Typography variant="body2" color="textSecondary">
                    Preço Total do Item:
                  </Typography>
                  <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                    R$ {((currentItem.price || 0) * (currentItem.totalQuantity || 0)).toFixed(2)}
                  </Typography>
                </div>
              </FormGroup>
            </Grid.Col>
          </Grid.Row>
          
          <FormGroup>
            <Input
              label="Observação"
              placeholder="Observações adicionais sobre este item"
              value={currentItem.observation}
              onChange={(e) => handleItemChange('observation', e.target.value)}
              fullWidth
            />
          </FormGroup>
          
          <Grid.Row>
            <Grid.Col size={12}>
              <Button 
                variant="primary"
                onClick={handleOpenComponentModal}
                fullWidth
              >
                Gerenciar Componentes Adicionais ({currentItem.additionalComponents?.length || 0})
              </Button>
            </Grid.Col>
          </Grid.Row>
          
          <Modal.Actions position="flex-end">
            <Button variant="text" onClick={() => setItemModalOpen(false)}>
              Cancelar
            </Button>
            <Button 
              variant="primary" 
              onClick={handleSaveItem}
            >
              Salvar Alterações
            </Button>
          </Modal.Actions>
        </Modal>
        
        {/* Modal para gerenciar componentes adicionais */}
        <Modal
          isOpen={isComponentModalOpen}
          title="Componentes Adicionais"
          onClose={handleComponentsModalClose}
          size="md"
        >
          <Typography variant="body1" style={{ marginBottom: '16px' }}>
            Adicione componentes ativos adicionais a este item.
          </Typography>
          
          <FormGroup>
            <Input
              label="Nome do Ingrediente Ativo"
              placeholder="Ex: Vitamina C"
              value={currentComponent.activeIngredientName}
              onChange={(e) => handleComponentChange('activeIngredientName', e.target.value)}
              fullWidth
            />
          </FormGroup>
          
          <Grid.Row>
            <Grid.Col size={6}>
              <FormGroup>
                <DecimalInput
                  label="Concentração"
                  placeholder="Ex: 0,50"
                  value={currentComponent.concentrationValue}
                  onChange={(e) => handleComponentChange('concentrationValue', e.target.value)}
                  decimalPlaces={2}
                  min={0.01}
                  fullWidth
                />
              </FormGroup>
            </Grid.Col>
            <Grid.Col size={6}>
              <FormGroup>
                <Input
                  label="Unidade"
                  placeholder="Ex: mg"
                  value={currentComponent.concentrationUnit}
                  onChange={(e) => handleComponentChange('concentrationUnit', e.target.value)}
                  fullWidth
                />
              </FormGroup>
            </Grid.Col>
          </Grid.Row>
          
          <Button 
            variant="secondary"
            onClick={handleAddComponent}
            style={{ marginBottom: '20px' }}
          >
            {editingComponentIndex >= 0 ? 'Atualizar Componente' : 'Adicionar Componente'}
          </Button>
          
          {currentItem.additionalComponents?.length > 0 ? (
            <div>
              <Typography variant="h3" style={{ marginTop: '24px', marginBottom: '16px' }}>
                Componentes Adicionados:
              </Typography>
              
              {currentItem.additionalComponents.map((comp, idx) => (
                <Card key={idx} style={{ marginBottom: '8px', padding: '12px' }}>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    {comp.activeIngredientName}
                  </Typography>
                  <Typography variant="body2">
                    Concentração: {comp.concentrationValue} {comp.concentrationUnit}
                  </Typography>
                  <ItemActions>
                    <Button 
                      variant="text" 
                      size="small" 
                      onClick={() => handleEditComponent(idx)}
                    >
                      Editar
                    </Button>
                    <Button 
                      variant="error" 
                      size="small" 
                      onClick={() => handleRemoveComponent(idx)}
                    >
                      Remover
                    </Button>
                  </ItemActions>
                </Card>
              ))}
            </div>
          ) : (
            <Typography variant="body2" style={{ fontStyle: 'italic' }}>
              Nenhum componente adicional foi adicionado.
            </Typography>
          )}
          
          <Modal.Actions position="flex-end">
            <Button variant="primary" onClick={handleComponentsModalClose}>
              Concluído
            </Button>
          </Modal.Actions>
        </Modal>
        
        {/* Modal para visualizar imagem da receita em tamanho maior */}
        <Modal
          isOpen={isImageModalOpen}
          title="Receita Médica"
          onClose={() => setImageModalOpen(false)}
          size="lg"
        >
          {quoteDetails?.image && (
            <div style={{ textAlign: 'center' }}>
              <img 
                src={quoteDetails.image}
                alt="Receita Médica" 
                style={{ maxWidth: '100%', maxHeight: '70vh' }} 
              />
              <div style={{ marginTop: '16px' }}>
                <Button 
                  variant="outline" 
                  onClick={openImageInNewTab}
                >
                  Abrir em nova janela
                </Button>
              </div>
            </div>
          )}
          
          <Modal.Actions position="flex-end">
            <Button variant="primary" onClick={() => setImageModalOpen(false)}>
              Fechar
            </Button>
          </Modal.Actions>
        </Modal>
      </Content>
    </PageContainer>
  );
};

export default CreateOrder;