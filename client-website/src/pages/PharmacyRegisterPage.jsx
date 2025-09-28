import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerPharmacy } from '../services/registerService';
import './PharmacyRegisterPage.css';

const PharmacyRegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    adminfirstname: '',
    adminlastname: '',
    cnpj: '',
    email: '',
    password: '',
    confirmPassword: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
    phoneNumber: '',
    username: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return false;
    }
    
    // Validação básica - campos obrigatórios
    const requiredFields = ['name', 'adminfirstname', 'adminlastname', 'cnpj', 'email', 'password', 
                           'street', 'number', 'neighborhood', 'city', 'state', 'zipCode',
                           'phoneNumber', 'username'];
    
    for (const field of requiredFields) {
      if (!formData[field]) {
        setError(`O campo ${field} é obrigatório`);
        return false;
      }
    }
    
    // Validação de e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('E-mail inválido');
      return false;
    }

    // Validação de senha (mínimo 8 caracteres)
    if (formData.password.length < 8) {
      setError('A senha deve ter no mínimo 8 caracteres');
      return false;
    }

    // Validação básica de CNPJ
    const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
    if (!cnpjRegex.test(formData.cnpj) && !formData.cnpj.replace(/\D/g, '').length === 14) {
      setError('CNPJ inválido');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsLoading(true);
      // Removendo o campo confirmPassword antes de enviar para a API
      const { confirmPassword, ...registerData } = formData;
      await registerPharmacy(registerData);
      alert('Cadastro de farmácia realizado com sucesso! Faça login para continuar.');
      navigate('/login');
    } catch (error) {
      setError(error.response?.data?.message || 'Erro ao cadastrar farmácia. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <h2>Cadastro de Farmácia</h2>
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <h3 className="section-title">Informações da Farmácia</h3>
          <div className="form-group">
            <label htmlFor="name">Nome da Farmácia*</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              value={formData.name} 
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="cnpj">CNPJ*</label>
            <input 
              type="text" 
              id="cnpj" 
              name="cnpj" 
              value={formData.cnpj} 
              onChange={handleChange}
              placeholder="00.000.000/0000-00"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="phoneNumber">Telefone*</label>
            <input 
              type="text" 
              id="phoneNumber" 
              name="phoneNumber" 
              value={formData.phoneNumber} 
              onChange={handleChange}
              placeholder="(00) 00000-0000"
              required
            />
          </div>
          
          <h3 className="section-title">Informações do Administrador</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="adminfirstname">Nome do Administrador*</label>
              <input 
                type="text" 
                id="adminfirstname" 
                name="adminfirstname" 
                value={formData.adminfirstname} 
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="adminlastname">Sobrenome do Administrador*</label>
              <input 
                type="text" 
                id="adminlastname" 
                name="adminlastname" 
                value={formData.adminlastname} 
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <h3 className="section-title">Informações de Conta</h3>
          <div className="form-group">
            <label htmlFor="username">Nome de usuário*</label>
            <input 
              type="text" 
              id="username" 
              name="username" 
              value={formData.username} 
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">E-mail*</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Senha*</label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                value={formData.password} 
                onChange={handleChange}
                minLength="8"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar Senha*</label>
              <input 
                type="password" 
                id="confirmPassword" 
                name="confirmPassword" 
                value={formData.confirmPassword} 
                onChange={handleChange}
                minLength="8"
                required
              />
            </div>
          </div>
          
          <h3 className="section-title">Endereço</h3>
          <div className="form-group">
            <label htmlFor="street">Rua/Avenida*</label>
            <input 
              type="text" 
              id="street" 
              name="street" 
              value={formData.street} 
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="number">Número*</label>
              <input 
                type="text" 
                id="number" 
                name="number" 
                value={formData.number} 
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="complement">Complemento</label>
              <input 
                type="text" 
                id="complement" 
                name="complement" 
                value={formData.complement} 
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="neighborhood">Bairro*</label>
              <input 
                type="text" 
                id="neighborhood" 
                name="neighborhood" 
                value={formData.neighborhood} 
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="city">Cidade*</label>
              <input 
                type="text" 
                id="city" 
                name="city" 
                value={formData.city} 
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="state">Estado*</label>
              <select 
                id="state" 
                name="state" 
                value={formData.state} 
                onChange={handleChange}
                required
              >
                <option value="">Selecione</option>
                <option value="AC">Acre</option>
                <option value="AL">Alagoas</option>
                <option value="AP">Amapá</option>
                <option value="AM">Amazonas</option>
                <option value="BA">Bahia</option>
                <option value="CE">Ceará</option>
                <option value="DF">Distrito Federal</option>
                <option value="ES">Espírito Santo</option>
                <option value="GO">Goiás</option>
                <option value="MA">Maranhão</option>
                <option value="MT">Mato Grosso</option>
                <option value="MS">Mato Grosso do Sul</option>
                <option value="MG">Minas Gerais</option>
                <option value="PA">Pará</option>
                <option value="PB">Paraíba</option>
                <option value="PR">Paraná</option>
                <option value="PE">Pernambuco</option>
                <option value="PI">Piauí</option>
                <option value="RJ">Rio de Janeiro</option>
                <option value="RN">Rio Grande do Norte</option>
                <option value="RS">Rio Grande do Sul</option>
                <option value="RO">Rondônia</option>
                <option value="RR">Roraima</option>
                <option value="SC">Santa Catarina</option>
                <option value="SP">São Paulo</option>
                <option value="SE">Sergipe</option>
                <option value="TO">Tocantins</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="zipCode">CEP*</label>
              <input 
                type="text" 
                id="zipCode" 
                name="zipCode" 
                value={formData.zipCode} 
                onChange={handleChange}
                required
                placeholder="00000-000"
              />
            </div>
          </div>
          
          <div className="form-buttons">
            <button 
              type="submit" 
              className="register-button" 
              disabled={isLoading}
            >
              {isLoading ? 'Cadastrando...' : 'Cadastrar Farmácia'}
            </button>
            <Link to="/login" className="back-button">Voltar</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PharmacyRegisterPage;