// MaskedInputs.jsx - Componentes de input especializados com máscaras
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Input from './Input';

// Styled component para feedback visual do estado de validação
const ValidationStatusIcon = styled.span`
  position: absolute;
  right: ${props => props.theme.spacing.md};
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.isValid ? props.theme.colors.success : props.theme.colors.error};
  font-size: ${props => props.theme.typography.fontSizes.lg};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

// ========================
// Phone Input Component
// ========================

const PhoneInput = ({ value, onChange, label = "Telefone", error, helperText, required, ...props }) => {
  const [inputValue, setInputValue] = useState(value || '');
  const [isTouched, setIsTouched] = useState(false);
  const [isValid, setIsValid] = useState(false);
  
  // Effect to handle initial value from props
  useEffect(() => {
    if (value && value !== inputValue) {
      setInputValue(value);
      validatePhoneNumber(value);
    }
  }, [value, inputValue]);

  const validatePhoneNumber = (phoneNumber) => {
    const phoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
    const isValidFormat = phoneRegex.test(phoneNumber);
    setIsValid(isValidFormat);
    return isValidFormat;
  };

  const formatPhoneNumber = (numbersOnly) => {
    let formattedValue = '';
    
    if (numbersOnly.length <= 2) {
      formattedValue = numbersOnly;
    } else if (numbersOnly.length <= 6) {
      formattedValue = `(${numbersOnly.slice(0, 2)}) ${numbersOnly.slice(2)}`;
    } else if (numbersOnly.length <= 10) {
      formattedValue = `(${numbersOnly.slice(0, 2)}) ${numbersOnly.slice(2, 6)}-${numbersOnly.slice(6)}`;
    } else {
      formattedValue = `(${numbersOnly.slice(0, 2)}) ${numbersOnly.slice(2, 7)}-${numbersOnly.slice(7, 11)}`;
    }
    
    return formattedValue;
  };
  
  const handleChange = (e) => {
    const val = e.target.value;
    
    // Remove tudo que não for dígito
    const numbersOnly = val.replace(/\D/g, '').slice(0, 11); // Máximo 11 dígitos (DDD + 9 dígitos)
    
    // Formata o valor
    const formattedValue = formatPhoneNumber(numbersOnly);
    
    setInputValue(formattedValue);
    setIsTouched(true);
    
    // Valida o formato
    validatePhoneNumber(formattedValue);
    
    if (onChange) {
      // Cria um evento sintético similar ao que o onChange espera
      const syntheticEvent = {
        target: {
          name: e.target.name,
          value: formattedValue
        }
      };
      onChange(syntheticEvent);
    }
  };
  
  const handleBlur = () => {
    setIsTouched(true);
  };

  // Determina se devemos mostrar o erro
  const shouldShowError = (error || (isTouched && !isValid && inputValue));
  const errorMessage = shouldShowError && !error ? 
    "Telefone inválido. Use o formato: (XX) XXXXX-XXXX" : helperText;

  return (
    <InputWrapper>
      <Input
        label={label}
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="(XX) XXXXX-XXXX"
        error={shouldShowError}
        helperText={errorMessage}
        required={required}
        {...props}
      />
      {inputValue && isTouched && (
        <ValidationStatusIcon isValid={isValid}>
          {isValid ? '✓' : '✗'}
        </ValidationStatusIcon>
      )}
    </InputWrapper>
  );
};

PhoneInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  required: PropTypes.bool
};

// ========================
// ZipCode Input Component
// ========================

const ZipCodeInput = ({ value, onChange, label = "CEP", error, helperText, required, ...props }) => {
  const [inputValue, setInputValue] = useState(value || '');
  const [isTouched, setIsTouched] = useState(false);
  const [isValid, setIsValid] = useState(false);
  
  // Effect to handle initial value from props
  useEffect(() => {
    if (value && value !== inputValue) {
      setInputValue(value);
      validateZipCode(value);
    }
  }, [value, inputValue]);

  const validateZipCode = (zipCode) => {
    const zipCodeRegex = /^\d{5}-\d{3}$/;
    const isValidFormat = zipCodeRegex.test(zipCode);
    setIsValid(isValidFormat);
    return isValidFormat;
  };

  const formatZipCode = (numbersOnly) => {
    let formattedValue = '';
    
    if (numbersOnly.length <= 5) {
      formattedValue = numbersOnly;
    } else {
      formattedValue = `${numbersOnly.slice(0, 5)}-${numbersOnly.slice(5, 8)}`;
    }
    
    return formattedValue;
  };
  
  const handleChange = (e) => {
    const val = e.target.value;
    
    // Remove tudo que não for dígito
    const numbersOnly = val.replace(/\D/g, '').slice(0, 8); // CEP tem 8 dígitos
    
    // Formata o valor
    const formattedValue = formatZipCode(numbersOnly);
    
    setInputValue(formattedValue);
    setIsTouched(true);
    
    // Valida o formato
    validateZipCode(formattedValue);
    
    if (onChange) {
      // Cria um evento sintético similar ao que o onChange espera
      const syntheticEvent = {
        target: {
          name: e.target.name,
          value: formattedValue
        }
      };
      onChange(syntheticEvent);
    }
  };
  
  const handleBlur = () => {
    setIsTouched(true);
  };

  // Determina se devemos mostrar o erro
  const shouldShowError = (error || (isTouched && !isValid && inputValue));
  const errorMessage = shouldShowError && !error ? 
    "CEP inválido. Use o formato: XXXXX-XXX" : helperText;

  return (
    <InputWrapper>
      <Input
        label={label}
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="XXXXX-XXX"
        error={shouldShowError}
        helperText={errorMessage}
        required={required}
        {...props}
      />
      {inputValue && isTouched && (
        <ValidationStatusIcon isValid={isValid}>
          {isValid ? '✓' : '✗'}
        </ValidationStatusIcon>
      )}
    </InputWrapper>
  );
};

ZipCodeInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  required: PropTypes.bool
};

export { PhoneInput, ZipCodeInput };