import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/Home';
import AdminPage from './pages/Admin';
import LoginPage from './pages/Login';
import ProjectDetail from './pages/ProjectDetail';
import { ProjectProvider } from './context/ProjectContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { UIProvider } from './context/UIContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ProjectProvider>
        <UIProvider>
          <HashRouter>
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/project/:id" element={<ProjectDetail />} />
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute>
                      <AdminPage />
                    </ProtectedRoute>
                  } 
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          </HashRouter>
        </UIProvider>
      </ProjectProvider>
    </AuthProvider>
  );
};

export default App;