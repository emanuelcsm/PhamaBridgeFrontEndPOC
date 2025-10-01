import React, { useState } from 'react';
import { useAuth } from '../../AuthContext';
import { useAlert } from '../../contexts/AlertContext';
import styled from 'styled-components';
import api from '../../api/api';
import { 
  Typography, 
  Button, 
  Card, 
  Grid, 
  UserAvatar, 
  LogoImage,
  UserNameDisplay,
  Modal,
  Input,
  PhoneInput,
  ZipCodeInput,
  DecimalInput,
  TabContainer,
  Tab
} from '../../components/common';
import { 
  PageContainer, 
  Header, 
  HeaderContent, 
  UserInfo, 
  Content,
  Section,
  FormGroup
} from '../../components/styled';
import QuotesTable from '../../components/customer/QuotesTable';

// Componentes estilizados adicionais
const QuoteButton = styled(Button)`
  margin-top: ${props => props.theme.spacing.lg};
`;

const ItemsList = styled.div`
  margin-top: ${props => props.theme.spacing.lg};
  max-height: 300px;
  overflow-y: auto;
`;

const ItemCard = styled(Card)`
  margin-bottom: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.md};
  position: relative;

  /* Override any props being passed down to the DOM */
  &&& {
    $outlined: none;
    $fullWidth: none;
    $padding: none;
    $clickable: none;
  }
`;

const ItemActions = styled.div`
  position: absolute;
  top: ${props => props.theme.spacing.md};
  right: ${props => props.theme.spacing.md};
  display: flex;
  gap: ${props => props.theme.spacing.xs};
`;

const FileInputLabel = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing.lg};
  border: 2px dashed ${props => props.theme.colors.primary};
  border-radius: ${props => props.theme.borders.radius.md};
  cursor: pointer;
  margin-top: ${props => props.theme.spacing.md};
  transition: all ${props => props.theme.transitions.normal};
  
  &:hover {
    background-color: rgba(21, 101, 192, 0.05);
  }
`;

const FileInput = styled.input`
  display: none;
`;

const FileName = styled(Typography)`
  margin-top: ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.primary};
  word-break: break-all;
`;

const MainPageUser = () => {
  const { user } = useAuth();
  const { success, error } = useAlert();
  
  // Estados para controle dos modais e formulários
  const [isFileModalOpen, setFileModalOpen] = useState(false);
  const [isItemsModalOpen, setItemsModalOpen] = useState(false);
  const [isAddressModalOpen, setAddressModalOpen] = useState(false);
  const [isComponentModalOpen, setComponentModalOpen] = useState(false);
  const [prescriptionFile, setPrescriptionFile] = useState(null);
  const [items, setItems] = useState([]);
  const [currentItem, setCurrentItem] = useState({ 
    Formula: '', 
    PharmaceuticalForm: 'Cápsula',
    ConcentrationValue: 1,
    ConcentrationUnit: 'mg',
    TotalQuantity: 30,
    QuantityUnit: 'unidades',
    Observation: '',
    additionalComponents: []
  });
  const [currentComponent, setCurrentComponent] = useState({
    ActiveIngredientName: '',
    ConcentrationValue: 0.5,
    ConcentrationUnit: 'mg'
  });
  const [editingIndex, setEditingIndex] = useState(-1);
  const [editingComponentIndex, setEditingComponentIndex] = useState(-1);
  const [refreshQuotes, setRefreshQuotes] = useState(0);
  const [address, setAddress] = useState({
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
    phoneNumber: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  
  // Função para obter as iniciais do nome do usuário
  const getUserInitials = () => {
    if (!user?.firstName || !user?.lastName) return '?';
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
  };

  // Handlers para o arquivo da receita
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPrescriptionFile(file);
    }
  };

  const handleFileUploadContinue = () => {
    setFileModalOpen(false);
    setItemsModalOpen(true);
  };

  // Handlers para os itens da receita
  const handleItemChange = (field, value) => {
    setCurrentItem(prev => ({ ...prev, [field]: value }));
  };

  const handleAddItem = () => {
    if (currentItem.Formula.trim()) {
      if (editingIndex >= 0) {
        // Modo de edição
        const updatedItems = [...items];
        updatedItems[editingIndex] = currentItem;
        setItems(updatedItems);
        setEditingIndex(-1);
      } else {
        // Modo de adição
        setItems([...items, currentItem]);
      }
      setCurrentItem({ 
        Formula: '', 
        PharmaceuticalForm: 'Cápsula',
        ConcentrationValue: 1,
        ConcentrationUnit: 'mg',
        TotalQuantity: 30,
        QuantityUnit: 'unidades',
        Observation: '',
        additionalComponents: [] 
      });
    }
  };

  const handleEditItem = (index) => {
    setCurrentItem(items[index]);
    setEditingIndex(index);
  };

  const handleRemoveItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  // Gerenciamento de componentes adicionais
  const handleComponentChange = (field, value) => {
    setCurrentComponent(prev => ({ ...prev, [field]: value }));
  };

  const handleOpenComponentModal = (itemIndex) => {
    setEditingIndex(itemIndex);
    setComponentModalOpen(true);
  };

  const handleAddComponent = () => {
    if (currentComponent.ActiveIngredientName.trim()) {
      if (editingComponentIndex >= 0) {
        // Edição de um componente existente
        const updatedItems = [...items];
        const itemComponents = [...updatedItems[editingIndex].additionalComponents];
        itemComponents[editingComponentIndex] = { ...currentComponent };
        updatedItems[editingIndex] = {
          ...updatedItems[editingIndex],
          additionalComponents: itemComponents
        };
        setItems(updatedItems);
        setEditingComponentIndex(-1);
      } else {
        // Adição de novo componente
        const updatedItems = [...items];
        const itemComponents = updatedItems[editingIndex].additionalComponents || [];
        updatedItems[editingIndex] = {
          ...updatedItems[editingIndex],
          additionalComponents: [...itemComponents, { ...currentComponent }]
        };
        setItems(updatedItems);
      }
      
      // Resetar o componente atual
      setCurrentComponent({
        ActiveIngredientName: '',
        ConcentrationValue: 0.5,
        ConcentrationUnit: 'mg'
      });
    }
  };

  const handleEditComponent = (componentIndex) => {
    if (items[editingIndex] && items[editingIndex].additionalComponents) {
      const component = items[editingIndex].additionalComponents[componentIndex];
      setCurrentComponent({ ...component });
      setEditingComponentIndex(componentIndex);
    }
  };

  const handleRemoveComponent = (componentIndex) => {
    if (items[editingIndex] && items[editingIndex].additionalComponents) {
      const updatedItems = [...items];
      const updatedComponents = updatedItems[editingIndex].additionalComponents.filter(
        (_, i) => i !== componentIndex
      );
      updatedItems[editingIndex] = {
        ...updatedItems[editingIndex],
        additionalComponents: updatedComponents
      };
      setItems(updatedItems);
    }
  };

  const handleComponentsModalClose = () => {
    setComponentModalOpen(false);
    setCurrentComponent({
      ActiveIngredientName: '',
      ConcentrationValue: 0.5,
      ConcentrationUnit: 'mg'
    });
    setEditingComponentIndex(-1);
  };

  const handleItemsContinue = () => {
    setItemsModalOpen(false);
    setAddressModalOpen(true);
  };

  // Handlers para o endereço
  const handleAddressChange = (field, value) => {
    setAddress(prev => ({ ...prev, [field]: value }));
  };

  // Handler para envio da cotação
  const handleSubmitQuote = async () => {
    setIsLoading(true);
    
    try {
      const formData = new FormData();
      
      // Adiciona os itens da receita conforme novo esquema
      items.forEach((item, index) => {
        formData.append(`Items[${index}].MainCompoundName`, item.Formula);
        formData.append(`Items[${index}].PharmaceuticalForm`, item.PharmaceuticalForm || 'Cápsula');
        formData.append(`Items[${index}].ConcentrationValue`, item.ConcentrationValue || 1);
        formData.append(`Items[${index}].ConcentrationUnit`, item.ConcentrationUnit || 'mg');
        formData.append(`Items[${index}].TotalQuantity`, item.TotalQuantity || 30);
        formData.append(`Items[${index}].QuantityUnit`, item.QuantityUnit || 'unidades');
        formData.append(`Items[${index}].Observation`, item.Observation || '');
        
        // Se houver componentes adicionais
        if (item.additionalComponents && item.additionalComponents.length > 0) {
          item.additionalComponents.forEach((comp, compIndex) => {
            formData.append(`Items[${index}].additionalComponents[${compIndex}].activeIngredientName`, comp.ActiveIngredientName);
            formData.append(`Items[${index}].additionalComponents[${compIndex}].concentrationValue`, comp.ConcentrationValue);
            formData.append(`Items[${index}].additionalComponents[${compIndex}].concentrationUnit`, comp.ConcentrationUnit);
          });
        }
      });
      
      // Adiciona a imagem da receita
      formData.append('PrescriptionImage', prescriptionFile);
      
      // Adiciona os dados do endereço
      formData.append('Street', address.street);
      formData.append('Number', address.number);
      formData.append('Complement', address.complement);
      formData.append('Neighborhood', address.neighborhood);
      formData.append('City', address.city);
      formData.append('State', address.state);
      formData.append('ZipCode', address.zipCode);
      formData.append('PhoneNumber', address.phoneNumber);
      
      // Dados do médico/emissor (usando valores padrão)
      formData.append('DoctorName', 'Dr. Exemplo');
      formData.append('RegistrationNumber', '123456');
      formData.append('RegistrationState', 'SP');
      
      // Envia a requisição
      await api.post('/quote/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Reset dos estados após sucesso
      setAddressModalOpen(false);
      setPrescriptionFile(null);
      setItems([]);
      setAddress({
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        zipCode: '',
        phoneNumber: ''
      });
      
      // Atualiza a tabela de cotações
      setRefreshQuotes(prev => prev + 1);
      
      // Exibe uma mensagem de sucesso usando o componente de alerta
      success('Cotação enviada com sucesso!');
    } catch (err) {
      console.error('Erro ao enviar cotação:', err);
      error('Erro ao enviar cotação. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Adicione esta função dentro do componente MainPageUser
  const handleOpenFileModal = async () => {
    try {
      const response = await api.get('/users/get-last-address');
      if (response.data) {
        setAddress({
          street: response.data.street || '',
          number: response.data.number || '',
          complement: response.data.complement || '',
          neighborhood: response.data.neighborhood || '',
          city: response.data.city || '',
          state: response.data.state || '',
          zipCode: response.data.zipCode || '',
          phoneNumber: response.data.phoneNumber || ''
        });
      }
    } catch (error) {
      // Se der erro, apenas abre o modal normalmente (endereço vazio)
      setAddress({
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        zipCode: '',
        phoneNumber: ''
      });
    }
    setFileModalOpen(true);
  };

  return (
    <PageContainer>
      <Header>
        <HeaderContent>
          <LogoImage clickable size="40px" />
          <UserInfo>
            <UserNameDisplay user={user} greeting="Olá" />
            <UserAvatar variant="user" initials={getUserInitials()} />
          </UserInfo>
        </HeaderContent>
      </Header>

      <Content>
        <Section>
          <Typography variant="h1">Painel do Cliente</Typography>
          <Typography variant="body1">
            Bem-vindo ao seu painel de controle. Aqui você pode gerenciar suas cotações e pedidos.
          </Typography>
          
          <QuoteButton 
            variant="primary" 
            size="large"
            onClick={handleOpenFileModal}
          >
            Solicitar Nova Cotação
          </QuoteButton>

          <TabContainer>
            <Tab label="Cotações">
              <QuotesTable refreshTrigger={refreshQuotes} />
            </Tab>
            <Tab label="Pedidos">
              <Typography variant="body1" style={{ padding: '20px 0' }}>
                Aqui serão exibidos seus pedidos em andamento.
              </Typography>
            </Tab>
          </TabContainer>
        </Section>
        
        {/* Modal para upload da receita */}
        <Modal
          isOpen={isFileModalOpen}
          title="Upload da Receita Médica"
          onClose={() => setFileModalOpen(false)}
          size="md"
        >
          <Typography variant="body1">
            Por favor, faça o upload da imagem da sua receita médica. Aceitamos formatos JPG, PNG e PDF.
          </Typography>
          
          <FileInputLabel>
            <Typography variant="body1">
              {prescriptionFile ? 'Alterar arquivo' : 'Clique ou arraste um arquivo aqui'}
            </Typography>
            <FileInput 
              type="file" 
              accept="image/jpeg,image/png,application/pdf" 
              onChange={handleFileChange}
            />
          </FileInputLabel>
          
          {prescriptionFile && (
            <FileName variant="body2">
              Arquivo selecionado: {prescriptionFile.name}
            </FileName>
          )}
          
          <Modal.Actions position="flex-end">
            <Button variant="text" onClick={() => setFileModalOpen(false)}>
              Cancelar
            </Button>
            <Button 
              variant="primary" 
              onClick={handleFileUploadContinue} 
              disabled={!prescriptionFile}
            >
              Continuar
            </Button>
          </Modal.Actions>
        </Modal>
        
        {/* Modal para adicionar itens da receita */}
        <Modal
          isOpen={isItemsModalOpen}
          title="Itens da Receita"
          onClose={() => setItemsModalOpen(false)}
          size="md"
        >
          <Typography variant="body1" style={{ marginBottom: '16px' }}>
            Adicione os itens da sua receita médica.
          </Typography>
          
          <FormGroup>
            <Input
              label="Nome do Composto Principal"
              placeholder="Ex: Metformina"
              value={currentItem.Formula}
              onChange={(e) => handleItemChange('Formula', e.target.value)}
              fullWidth
            />
          </FormGroup>
          
          <Grid.Row>
            <Grid.Col size={6}>
              <FormGroup>
                <Input
                  label="Forma Farmacêutica"
                  placeholder="Ex: Cápsula"
                  value={currentItem.PharmaceuticalForm}
                  onChange={(e) => handleItemChange('PharmaceuticalForm', e.target.value)}
                  fullWidth
                />
              </FormGroup>
            </Grid.Col>
            <Grid.Col size={3}>
              <FormGroup>
                <DecimalInput
                  label="Concentração"
                  placeholder="Ex: 500,00"
                  value={currentItem.ConcentrationValue}
                  onChange={(e) => handleItemChange('ConcentrationValue', e.target.value)}
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
                  value={currentItem.ConcentrationUnit}
                  onChange={(e) => handleItemChange('ConcentrationUnit', e.target.value)}
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
                  value={currentItem.TotalQuantity}
                  onChange={(e) => handleItemChange('TotalQuantity', parseInt(e.target.value) || 0)}
                  fullWidth
                />
              </FormGroup>
            </Grid.Col>
            <Grid.Col size={6}>
              <FormGroup>
                <Input
                  label="Unidade de Quantidade"
                  placeholder="Ex: unidades"
                  value={currentItem.QuantityUnit}
                  onChange={(e) => handleItemChange('QuantityUnit', e.target.value)}
                  fullWidth
                />
              </FormGroup>
            </Grid.Col>
          </Grid.Row>
          
          <FormGroup>
            <Input
              label="Observação"
              placeholder="Observações adicionais sobre este item"
              value={currentItem.Observation}
              onChange={(e) => handleItemChange('Observation', e.target.value)}
              fullWidth
            />
          </FormGroup>
          
          <Grid.Row>
            <Grid.Col size={6}>
              <Button 
                variant="secondary"
                onClick={handleAddItem}
                fullWidth
              >
                {editingIndex >= 0 ? 'Atualizar Item' : 'Adicionar Item'}
              </Button>
            </Grid.Col>
            {editingIndex >= 0 && (
              <Grid.Col size={6}>
                <Button 
                  variant="primary"
                  onClick={() => setComponentModalOpen(true)}
                  fullWidth
                >
                  Gerenciar Componentes Adicionais
                </Button>
              </Grid.Col>
            )}
          </Grid.Row>
          
          {items.length > 0 && (
            <ItemsList>
              <Typography variant="h3" style={{ marginTop: '24px', marginBottom: '16px' }}>
                Itens Adicionados:
              </Typography>
              
              {items.map((item, index) => (
                <ItemCard key={index}>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    {item.Formula} - {item.ConcentrationValue}{item.ConcentrationUnit}
                  </Typography>
                  <Typography variant="body2">
                    Forma: {item.PharmaceuticalForm} | Quantidade: {item.TotalQuantity} {item.QuantityUnit}
                  </Typography>
                  {item.Observation && (
                    <Typography variant="body2">
                      Observação: {item.Observation}
                    </Typography>
                  )}
                  
                  {item.additionalComponents && item.additionalComponents.length > 0 && (
                    <div style={{ marginTop: '8px' }}>
                      <Typography variant="body2" style={{ fontWeight: 'bold' }}>
                        Componentes Adicionais:
                      </Typography>
                      {item.additionalComponents.map((comp, idx) => (
                        <Typography key={idx} variant="body2">
                          • {comp.ActiveIngredientName} - {comp.ConcentrationValue} {comp.ConcentrationUnit}
                        </Typography>
                      ))}
                    </div>
                  )}
                  
                  <ItemActions>
                    <Button 
                      variant="text" 
                      size="small" 
                      onClick={() => handleEditItem(index)}
                    >
                      Editar
                    </Button>
                    {item.additionalComponents && (
                      <Button 
                        variant="secondary" 
                        size="small" 
                        onClick={() => handleOpenComponentModal(index)}
                      >
                        Componentes
                      </Button>
                    )}
                    <Button 
                      variant="error" 
                      size="small" 
                      onClick={() => handleRemoveItem(index)}
                    >
                      Remover
                    </Button>
                  </ItemActions>
                </ItemCard>
              ))}
            </ItemsList>
          )}
          
          <Modal.Actions position="flex-end">
            <Button variant="text" onClick={() => setItemsModalOpen(false)}>
              Cancelar
            </Button>
            <Button 
              variant="primary" 
              onClick={handleItemsContinue}
              disabled={items.length === 0}
            >
              Continuar
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
              value={currentComponent.ActiveIngredientName}
              onChange={(e) => handleComponentChange('ActiveIngredientName', e.target.value)}
              fullWidth
            />
          </FormGroup>
          
          <Grid.Row>
            <Grid.Col size={6}>
              <FormGroup>
                <DecimalInput
                  label="Concentração"
                  placeholder="Ex: 0,50"
                  value={currentComponent.ConcentrationValue}
                  onChange={(e) => handleComponentChange('ConcentrationValue', e.target.value)}
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
                  value={currentComponent.ConcentrationUnit}
                  onChange={(e) => handleComponentChange('ConcentrationUnit', e.target.value)}
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
          
          {editingIndex >= 0 && items[editingIndex].additionalComponents && items[editingIndex].additionalComponents.length > 0 ? (
            <div>
              <Typography variant="h3" style={{ marginTop: '24px', marginBottom: '16px' }}>
                Componentes Adicionados:
              </Typography>
              
              {items[editingIndex].additionalComponents.map((comp, idx) => (
                <ItemCard key={idx}>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    {comp.ActiveIngredientName}
                  </Typography>
                  <Typography variant="body2">
                    Concentração: {comp.ConcentrationValue} {comp.ConcentrationUnit}
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
                </ItemCard>
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
        
        {/* Modal para informar endereço de entrega */}
        <Modal
          isOpen={isAddressModalOpen}
          title="Endereço de Entrega"
          onClose={() => setAddressModalOpen(false)}
          size="md"
        >
          <Typography variant="body1" style={{ marginBottom: '16px' }}>
            Informe o endereço onde deseja receber os medicamentos.
          </Typography>
          
          <Grid.Row>
            <Grid.Col size={8}>
              <FormGroup>
                <Input
                  label="Rua"
                  placeholder="Nome da rua"
                  value={address.street}
                  onChange={(e) => handleAddressChange('street', e.target.value)}
                  fullWidth
                />
              </FormGroup>
            </Grid.Col>
            <Grid.Col size={4}>
              <FormGroup>
                <Input
                  label="Número"
                  placeholder="Número"
                  value={address.number}
                  onChange={(e) => handleAddressChange('number', e.target.value)}
                  fullWidth
                />
              </FormGroup>
            </Grid.Col>
          </Grid.Row>
          
          <FormGroup>
            <Input
              label="Complemento"
              placeholder="Apto, bloco, etc."
              value={address.complement}
              onChange={(e) => handleAddressChange('complement', e.target.value)}
              fullWidth
            />
          </FormGroup>
          
          <Grid.Row>
            <Grid.Col size={6}>
              <FormGroup>
                <Input
                  label="Bairro"
                  placeholder="Nome do bairro"
                  value={address.neighborhood}
                  onChange={(e) => handleAddressChange('neighborhood', e.target.value)}
                  fullWidth
                />
              </FormGroup>
            </Grid.Col>
            <Grid.Col size={6}>
              <FormGroup>
                <Input
                  label="Cidade"
                  placeholder="Nome da cidade"
                  value={address.city}
                  onChange={(e) => handleAddressChange('city', e.target.value)}
                  fullWidth
                />
              </FormGroup>
            </Grid.Col>
          </Grid.Row>
          
          <Grid.Row>
            <Grid.Col size={4}>
              <FormGroup>
                <Input
                  label="Estado"
                  placeholder="UF"
                  value={address.state}
                  onChange={(e) => handleAddressChange('state', e.target.value)}
                  fullWidth
                />
              </FormGroup>
            </Grid.Col>
            <Grid.Col size={8}>
              <FormGroup>
                <ZipCodeInput
                  label="CEP"
                  value={address.zipCode}
                  onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                  fullWidth
                />
              </FormGroup>
            </Grid.Col>
          </Grid.Row>
          
          <FormGroup>
            <PhoneInput
              label="Telefone"
              value={address.phoneNumber}
              onChange={(e) => handleAddressChange('phoneNumber', e.target.value)}
              fullWidth
            />
          </FormGroup>
          
          <Modal.Actions position="flex-end">
            <Button variant="text" onClick={() => setAddressModalOpen(false)}>
              Cancelar
            </Button>
            <Button 
              variant="primary" 
              onClick={handleSubmitQuote}
              disabled={isLoading || !address.street || !address.number || !address.city || !address.state}
            >
              {isLoading ? 'Enviando...' : 'Enviar Cotação'}
            </Button>
          </Modal.Actions>
        </Modal>
      </Content>
    </PageContainer>
  );
};

export default MainPageUser;