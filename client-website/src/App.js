import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<ProtectedRoute requiresAuth={false} />}>
              <Route index element={<LoginPage />} />
            </Route>

            {/* Protected routes */}
            <Route path="/" element={<ProtectedRoute requiresAuth={true} />}>
              <Route index element={<HomePage />} />
              {/* Add other protected routes here */}
            </Route>

            {/* Redirect any unknown routes to home or login based on auth status */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
