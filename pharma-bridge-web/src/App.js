import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import ThemeProvider from './theme/ThemeProvider';
import ProtectedRoute from './components/ProtectedRoute';

// Páginas
import SignIn from './pages/common/SignIn';
import MainPageUser from './pages/customer/MainPageUser';
import MainPagePharmacy from './pages/customer/MainPagePharmacy';

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
            <Route path="/user/home" element={<ProtectedRoute requiresAuth={true} requiredRole="ROLE_CUSTOMER" />}>
              <Route index element={<MainPageUser />} />
            </Route>

            {/* Rotas protegidas para farmácias */}
            <Route path="/pharmacy/home" element={<ProtectedRoute requiresAuth={true} requiredRole="ROLE_PHARMACY" />}>
              <Route index element={<MainPagePharmacy />} />
            </Route>

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
