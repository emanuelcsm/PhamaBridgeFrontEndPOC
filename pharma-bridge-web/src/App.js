import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import ThemeProvider from './theme/ThemeProvider';
import ProtectedRoute from './components/ProtectedRoute';

// Páginas
import SignIn from './pages/common/SignIn';
import SecurityPage from './pages/common/SecurityPage';
import MainPageUser from './pages/customer/MainPageUser';
import MainPagePharmacy from './pages/pharmacy/MainPagePharmacy';
import RegisterPharmacyPage from './pages/pharmacy/RegisterPharmacyPage';
import RegisterCustomerPage from './pages/customer/RegisterCustomerPage';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            {/* Rota pública de SignIn */}
            <Route path="/signin" element={<ProtectedRoute requiresAuth={false} />}>
              <Route index element={<SignIn />} />
            </Route>

            {/* Rotas protegidas para usuários (clientes) */}
            <Route path="/user/home" element={<ProtectedRoute requiresAuth={true} requiredRole="Customer" />}>
              <Route index element={<MainPageUser />} />
            </Route>

            {/* Rotas protegidas para farmácias */}
            <Route path="/pharmacy/home" element={<ProtectedRoute requiresAuth={true} requiredRole="PharmacyUser" />}>
              <Route index element={<MainPagePharmacy />} />
            </Route>
            
            {/* Página de segurança (acessível para qualquer usuário autenticado) */}
            <Route path="/security" element={<ProtectedRoute requiresAuth={true} />}>
              <Route index element={<SecurityPage />} />
            </Route>

            {/* Rotas de registro */}
            <Route path="/register/pharmacy" element={<RegisterPharmacyPage />} />
            <Route path="/register/customer" element={<RegisterCustomerPage />} />
            
            {/* Rota padrão - redireciona para signin */}
            <Route path="/" element={<Navigate to="/signin" replace />} />
            
            {/* Rota catch-all para URLs desconhecidas */}
            <Route path="*" element={<Navigate to="/signin" replace />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
