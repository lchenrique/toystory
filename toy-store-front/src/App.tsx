import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { useAuth } from './contexts/AuthContext';

// Lazy load pages for better performance
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ClientList = lazy(() => import('./pages/ClientList'));
const ClientForm = lazy(() => import('./pages/ClientForm'));
const Statistics = lazy(() => import('./pages/Statistics'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Show loading while checking authentication
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Import MainLayout
import MainLayout from './components/layout/MainLayout';

function App() {
  return (
    <Router>
      <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/clients"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <ClientList />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/clients/new"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <ClientForm />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/statistics"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Statistics />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;