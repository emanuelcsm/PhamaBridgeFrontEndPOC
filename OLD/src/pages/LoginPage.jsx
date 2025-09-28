import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import logo from "../logoPharmaBridge.jpg";
import "./LoginPage.css";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(username, password);
      navigate("/"); // Redirect to home page after successful login
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Falha no login. Por favor, verifique suas credenciais."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-wrapper">
        <img src={logo} alt="Logo PharmaBridge" className="login-logo" />
        <h2>Bem-vindo de Volta</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Usuário</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Digite seu nome de usuário"
              required
              autoComplete="username"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              required
              autoComplete="current-password"
            />
          </div>
          
          <button
            type="submit"
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </button>
        </form>
        
        <div className="forgot-password-link">
          <Link to="/forgot-password">Esqueci minha senha</Link>
        </div>
        
        <div className="register-options">
          <p>Não possui uma conta?</p>
          <div className="register-buttons">
            <Link to="/register-user" className="register-button user-button">
              Cadastrar como Usuário
            </Link>
            <Link to="/register-pharmacy" className="register-button pharmacy-button">
              Cadastrar como Farmácia
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;