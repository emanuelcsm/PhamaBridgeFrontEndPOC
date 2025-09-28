import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SecurityPage from "./pages/SecurityPage";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import UserRegisterPage from './pages/UserRegisterPage';
import PharmacyRegisterPage from './pages/PharmacyRegisterPage';
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Rotas públicas */}
            <Route path="/login" element={<ProtectedRoute requiresAuth={false} />}>
              <Route index element={<LoginPage />} />
            </Route>
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/register-user" element={<UserRegisterPage />} />
            <Route path="/register-pharmacy" element={<PharmacyRegisterPage />} />

            {/* Rotas protegidas */}
            <Route path="/" element={<ProtectedRoute requiresAuth={true} />}>
              <Route index element={<HomePage />} />
              <Route path="/security" element={<SecurityPage />} />
            </Route>

            {/* Redireciona rotas desconhecidas para home ou login baseado no estado de autenticação */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
