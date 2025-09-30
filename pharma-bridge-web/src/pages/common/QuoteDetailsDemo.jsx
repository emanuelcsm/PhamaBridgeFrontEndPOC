import React, { useState } from 'react';
import styled from 'styled-components';
import { QuoteDetails, Typography, Button, Card } from '../components/common';

const DemoContainer = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const StyledCard = styled(Card)`
  margin-bottom: 20px;
  padding: 20px;
`;

const InputContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
`;

const Input = styled.input`
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  flex: 1;
`;

const QuoteDetailsDemo = () => {
  const [quoteId, setQuoteId] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [activeQuoteId, setActiveQuoteId] = useState(null);

  const handleViewDetails = () => {
    if (quoteId) {
      setActiveQuoteId(quoteId);
      setShowDetails(true);
    }
  };

  return (
    <DemoContainer>
      <StyledCard>
        <Typography variant="h2">Visualização de Detalhes da Receita</Typography>
        <Typography variant="body1">
          Digite o ID da receita para visualizar seus detalhes:
        </Typography>
        
        <InputContainer>
          <Input
            type="text"
            value={quoteId}
            onChange={(e) => setQuoteId(e.target.value)}
            placeholder="Digite o ID da receita"
          />
          <Button onClick={handleViewDetails}>Visualizar Detalhes</Button>
        </InputContainer>
      </StyledCard>

      {showDetails && activeQuoteId && (
        <QuoteDetails quoteId={activeQuoteId} />
      )}
    </DemoContainer>
  );
};

export default QuoteDetailsDemo;