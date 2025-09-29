import React, { useState } from 'react';
import { useAuth } from '../../AuthContext';
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
  
  // Estados para controle dos modais e formulários
  const [isFileModalOpen, setFileModalOpen] = useState(false);
  const [isItemsModalOpen, setItemsModalOpen] = useState(false);
  const [isAddressModalOpen, setAddressModalOpen] = useState(false);
  const [prescriptionFile, setPrescriptionFile] = useState(null);
  const [items, setItems] = useState([{ Formula: '', Observation: '' }]);
  const [currentItem, setCurrentItem] = useState({ Formula: '', Observation: '' });
  const [editingIndex, setEditingIndex] = useState(-1);
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
      setCurrentItem({ Formula: '', Observation: '' });
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
      
      // Adiciona os itens da receita
      items.forEach((item, index) => {
        formData.append(`Items[${index}].Formula`, item.Formula);
        formData.append(`Items[${index}].Observation`, item.Observation);
      });
      
      // Adiciona a imagem da receita
      formData.append('PrescriptionImage', prescriptionFile);
      
      // Adiciona os dados do endereço
      formData.append('street', address.street);
      formData.append('number', address.number);
      formData.append('complement', address.complement);
      formData.append('neighborhood', address.neighborhood);
      formData.append('city', address.city);
      formData.append('state', address.state);
      formData.append('zipCode', address.zipCode);
      formData.append('phoneNumber', address.phoneNumber);
      
      // Envia a requisição
      await api.post('/quote/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Reset dos estados após sucesso
      setAddressModalOpen(false);
      setPrescriptionFile(null);
      setItems([{ Formula: '', Observation: '' }]);
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
      
      // Exibe uma mensagem de sucesso (você pode implementar um componente de alerta)
      alert('Cotação enviada com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar cotação:', error);
      alert('Erro ao enviar cotação. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
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
            onClick={() => setFileModalOpen(true)}
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
              label="Fórmula"
              placeholder="Ex: 5Kg Dipirona + 30Kg Phormol"
              value={currentItem.Formula}
              onChange={(e) => handleItemChange('Formula', e.target.value)}
              fullWidth
            />
          </FormGroup>
          
          <FormGroup>
            <Input
              label="Observação"
              placeholder="Observações adicionais sobre este item"
              value={currentItem.Observation}
              onChange={(e) => handleItemChange('Observation', e.target.value)}
              fullWidth
            />
          </FormGroup>
          
          <Button 
            variant="secondary"
            onClick={handleAddItem}
          >
            {editingIndex >= 0 ? 'Atualizar Item' : 'Adicionar Item'}
          </Button>
          
          {items.length > 0 && (
            <ItemsList>
              <Typography variant="h3" style={{ marginTop: '24px', marginBottom: '16px' }}>
                Itens Adicionados:
              </Typography>
              
              {items.map((item, index) => (
                <ItemCard key={index}>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Fórmula: {item.Formula}
                  </Typography>
                  <Typography variant="body2">
                    Observação: {item.Observation || 'Nenhuma observação'}
                  </Typography>
                  <ItemActions>
                    <Button 
                      variant="text" 
                      size="small" 
                      onClick={() => handleEditItem(index)}
                    >
                      Editar
                    </Button>
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