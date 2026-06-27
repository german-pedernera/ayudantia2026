import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProviderWrapper } from './contexts/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/Layout/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Personas from './pages/Personas';
import Instituciones from './pages/Instituciones';
import Calendario from './pages/Calendario';
import Reportes from './pages/Reportes';
import Configuracion from './pages/Configuracion';
const ADMIN_USER = 'Ger25$';

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  if (user?.username !== ADMIN_USER) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <ThemeProviderWrapper>
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        autoHideDuration={3000}
      >
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/personas" element={<Personas />} />
                        <Route path="/instituciones" element={<Instituciones />} />
                        <Route path="/calendario" element={<Calendario />} />
                        <Route path="/reportes" element={<Reportes />} />
                        <Route
                          path="/configuracion"
                          element={
                            <AdminRoute>
                              <Configuracion />
                            </AdminRoute>
                          }
                        />
                        <Route path="*" element={<Navigate to="/" replace />} />
                      </Routes>
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </SnackbarProvider>
    </ThemeProviderWrapper>
  );
}

export default App;

