// Example.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import {
  Button,
  Input,
  Card,
  Alert,
  Badge,
  Grid,
  Typography,
  Modal
} from '../common';

const ExampleContainer = styled.div`
  padding: ${props => props.theme.spacing.xl};
`;

const Section = styled.section`
  margin-bottom: ${props => props.theme.spacing.xl};
  padding-bottom: ${props => props.theme.spacing.xl};
  border-bottom: ${props => props.theme.borders.width.thin} solid ${props => props.theme.colors.border};
`;

const ComponentRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.md};
  margin: ${props => props.theme.spacing.md} 0;
  align-items: center;
`;

const StyledComponentsExample = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <ExampleContainer>
      <Typography variant="h1">PharmaBridge UI Components</Typography>
      <Typography variant="subtitle1">
        Esta é uma demonstração dos componentes estilizados disponíveis para uso na aplicação PharmaBridge.
      </Typography>

      {/* Typography Examples */}
      <Section>
        <Typography variant="h2">Typography</Typography>
        <Typography variant="body1">
          Componentes tipográficos com diferentes variantes, cores e alinhamentos.
        </Typography>

        <Typography variant="h1">Heading 1</Typography>
        <Typography variant="h2">Heading 2</Typography>
        <Typography variant="h3">Heading 3</Typography>
        <Typography variant="h4">Heading 4</Typography>
        <Typography variant="h5">Heading 5</Typography>
        <Typography variant="h6">Heading 6</Typography>
        
        <Typography variant="subtitle1">Subtítulo 1: Um pouco menor que os headings, mas ainda destacado.</Typography>
        <Typography variant="subtitle2">Subtítulo 2: Texto secundário para informações adicionais.</Typography>
        
        <Typography variant="body1">
          Body 1: Este é o estilo padrão para textos no corpo da aplicação. Usado para a maioria dos conteúdos de texto.
        </Typography>
        
        <Typography variant="body2">
          Body 2: Uma variante um pouco menor para textos no corpo da aplicação, útil para áreas com espaço limitado.
        </Typography>
        
        <Typography variant="caption">Caption: Textos muito pequenos usados para legendas ou notas.</Typography>
        
        <Typography variant="overline">OVERLINE: TEXTOS EM MAIÚSCULAS PARA SEÇÕES</Typography>
      </Section>

      {/* Button Examples */}
      <Section>
        <Typography variant="h2">Buttons</Typography>
        <Typography variant="body1">
          Botões com diferentes variantes, tamanhos e estados.
        </Typography>

        <ComponentRow>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="text">Text</Button>
          <Button variant="error">Error</Button>
        </ComponentRow>

        <ComponentRow>
          <Button variant="primary" size="small">Small</Button>
          <Button variant="primary">Medium</Button>
          <Button variant="primary" size="large">Large</Button>
        </ComponentRow>

        <ComponentRow>
          <Button variant="primary" disabled>Disabled</Button>
          <Button variant="outline" disabled>Disabled Outline</Button>
        </ComponentRow>

        <ComponentRow>
          <Button variant="primary" fullWidth>Full Width Button</Button>
        </ComponentRow>

        <ComponentRow>
          <Button variant="primary" round>Rounded</Button>
        </ComponentRow>
      </Section>

      {/* Input Examples */}
      <Section>
        <Typography variant="h2">Inputs</Typography>
        <Typography variant="body1">
          Campos de entrada com diferentes variantes, estados e mensagens de ajuda.
        </Typography>

        <ComponentRow>
          <Input label="Nome" placeholder="Digite seu nome" variant="outlined" />
          <Input label="Email" placeholder="Digite seu email" variant="filled" />
          <Input label="Senha" placeholder="Digite sua senha" variant="underlined" type="password" />
        </ComponentRow>

        <ComponentRow>
          <Input
            label="Com erro"
            placeholder="Informação incorreta"
            error={true}
            helperText="Este campo está com erro"
          />
          <Input
            label="Com mensagem de ajuda"
            placeholder="Digite aqui"
            helperText="Texto de ajuda para o usuário"
          />
        </ComponentRow>

        <ComponentRow>
          <Input label="Desabilitado" placeholder="Não editável" disabled />
        </ComponentRow>

        <ComponentRow>
          <Input label="Full Width" placeholder="Este input ocupa toda a largura disponível" fullWidth />
        </ComponentRow>
      </Section>

      {/* Card Examples */}
      <Section>
        <Typography variant="h2">Cards</Typography>
        <Typography variant="body1">
          Cards para exibir conteúdo em seções distintas.
        </Typography>

        <Grid.Row>
          <Grid.Col md={4}>
            <Card>
              <Card.Header>
                <Card.Title>Card Básico</Card.Title>
              </Card.Header>
              <Card.Content>
                <Typography variant="body1">
                  Este é um card básico com título e conteúdo.
                </Typography>
              </Card.Content>
            </Card>
          </Grid.Col>

          <Grid.Col md={4}>
            <Card elevation={3}>
              <Card.Header divider={true}>
                <Card.Title>Card com Elevação</Card.Title>
                <Card.Subtitle>Subtítulo do card</Card.Subtitle>
              </Card.Header>
              <Card.Content>
                <Typography variant="body1">
                  Este card tem uma elevação maior e um divisor no cabeçalho.
                </Typography>
              </Card.Content>
              <Card.Actions divider={true}>
                <Button variant="text">Cancelar</Button>
                <Button variant="primary">Confirmar</Button>
              </Card.Actions>
            </Card>
          </Grid.Col>

          <Grid.Col md={4}>
            <Card outlined>
              <Card.Header>
                <Card.Title>Card com Borda</Card.Title>
              </Card.Header>
              <Card.Content>
                <Typography variant="body1">
                  Este card usa uma borda em vez de sombra.
                </Typography>
              </Card.Content>
              <Card.Actions align="center">
                <Button variant="outline">Ação</Button>
              </Card.Actions>
            </Card>
          </Grid.Col>
        </Grid.Row>

        <ComponentRow>
          <Card fullWidth clickable>
            <Card.Media>
              <img src="/logo512.png" alt="PharmaBridge Logo" />
            </Card.Media>
            <Card.Content>
              <Typography variant="h3">Card com Mídia</Typography>
              <Typography variant="body1">
                Este card tem uma imagem e é clicável.
              </Typography>
            </Card.Content>
          </Card>
        </ComponentRow>
      </Section>

      {/* Alert Examples */}
      <Section>
        <Typography variant="h2">Alerts</Typography>
        <Typography variant="body1">
          Alertas para exibir mensagens importantes.
        </Typography>

        <ComponentRow>
          <Grid.Container>
            <Alert variant="success" title="Sucesso!">
              Operação realizada com sucesso.
            </Alert>
            
            <Alert variant="error" title="Erro!">
              Ocorreu um erro ao processar sua solicitação.
            </Alert>
            
            <Alert variant="warning" title="Atenção!">
              Verifique os dados antes de prosseguir.
            </Alert>
            
            <Alert variant="info" title="Informação">
              Esta é uma mensagem informativa.
            </Alert>
          </Grid.Container>
        </ComponentRow>

        <ComponentRow>
          <Grid.Container>
            <Alert variant="success" outlined>
              Alerta com estilo outlined.
            </Alert>
            
            <Alert variant="error" filled>
              Alerta com estilo filled.
            </Alert>
          </Grid.Container>
        </ComponentRow>

        <ComponentRow>
          <Grid.Container>
            <Alert
              variant="info"
              title="Alerta Fechável"
              onClose={() => alert('Alerta fechado!')}
            >
              Este alerta pode ser fechado pelo usuário.
            </Alert>
          </Grid.Container>
        </ComponentRow>
      </Section>

      {/* Badge Examples */}
      <Section>
        <Typography variant="h2">Badges</Typography>
        <Typography variant="body1">
          Badges para destacar status, contadores ou tags.
        </Typography>

        <ComponentRow>
          <Badge variant="primary">Primário</Badge>
          <Badge variant="secondary">Secundário</Badge>
          <Badge variant="success">Sucesso</Badge>
          <Badge variant="error">Erro</Badge>
          <Badge variant="warning">Aviso</Badge>
          <Badge variant="info">Info</Badge>
          <Badge variant="default">Padrão</Badge>
        </ComponentRow>

        <ComponentRow>
          <Badge variant="primary" outlined>Outlined</Badge>
          <Badge variant="success" outlined>Outlined</Badge>
          <Badge variant="error" outlined>Outlined</Badge>
        </ComponentRow>

        <ComponentRow>
          <Badge variant="primary" pill>Pill Badge</Badge>
          <Badge variant="success" pill>Pill Badge</Badge>
        </ComponentRow>
      </Section>

      {/* Grid System Examples */}
      <Section>
        <Typography variant="h2">Grid System</Typography>
        <Typography variant="body1">
          Sistema de grid responsivo baseado em 12 colunas.
        </Typography>

        <Grid.Container>
          <Grid.Row>
            <Grid.Col md={6}>
              <Card outlined fullWidth>
                <Typography>Coluna 1 (md=6)</Typography>
              </Card>
            </Grid.Col>
            <Grid.Col md={6}>
              <Card outlined fullWidth>
                <Typography>Coluna 2 (md=6)</Typography>
              </Card>
            </Grid.Col>
          </Grid.Row>

          <Grid.Row>
            <Grid.Col md={4}>
              <Card outlined fullWidth>
                <Typography>Coluna 1 (md=4)</Typography>
              </Card>
            </Grid.Col>
            <Grid.Col md={4}>
              <Card outlined fullWidth>
                <Typography>Coluna 2 (md=4)</Typography>
              </Card>
            </Grid.Col>
            <Grid.Col md={4}>
              <Card outlined fullWidth>
                <Typography>Coluna 3 (md=4)</Typography>
              </Card>
            </Grid.Col>
          </Grid.Row>

          <Grid.Row>
            <Grid.Col md={3}>
              <Card outlined fullWidth>
                <Typography>Coluna 1 (md=3)</Typography>
              </Card>
            </Grid.Col>
            <Grid.Col md={3}>
              <Card outlined fullWidth>
                <Typography>Coluna 2 (md=3)</Typography>
              </Card>
            </Grid.Col>
            <Grid.Col md={3}>
              <Card outlined fullWidth>
                <Typography>Coluna 3 (md=3)</Typography>
              </Card>
            </Grid.Col>
            <Grid.Col md={3}>
              <Card outlined fullWidth>
                <Typography>Coluna 4 (md=3)</Typography>
              </Card>
            </Grid.Col>
          </Grid.Row>

          <Grid.Row>
            <Grid.Col xs={12} md={8}>
              <Card outlined fullWidth>
                <Typography>Coluna 1 (xs=12, md=8)</Typography>
              </Card>
            </Grid.Col>
            <Grid.Col xs={12} md={4}>
              <Card outlined fullWidth>
                <Typography>Coluna 2 (xs=12, md=4)</Typography>
              </Card>
            </Grid.Col>
          </Grid.Row>
        </Grid.Container>
      </Section>

      {/* Modal Example */}
      <Section>
        <Typography variant="h2">Modal</Typography>
        <Typography variant="body1">
          Componentes de diálogo modal para interações focadas.
        </Typography>

        <ComponentRow>
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            Abrir Modal
          </Button>

          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Exemplo de Modal"
            actions={
              <>
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
                <Button variant="primary" onClick={() => setIsModalOpen(false)}>
                  Confirmar
                </Button>
              </>
            }
          >
            <Typography variant="body1">
              Este é o conteúdo do modal. Você pode incluir qualquer elemento React aqui.
            </Typography>
            <Input
              label="Exemplo de campo"
              placeholder="Digite algo"
              fullWidth
            />
          </Modal>
        </ComponentRow>
      </Section>
    </ExampleContainer>
  );
};

export default StyledComponentsExample;