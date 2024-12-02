import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Verificar si hay un token en localStorage o sessionStorage
  const isAuthenticated = localStorage.getItem('token') || sessionStorage.getItem('token');

  if (!isAuthenticated) {
    // Redirigir a la página de inicio de sesión si no está autenticado
    return <Navigate to="/iniciodesesion" replace />;
  }

  return children;
};

export default ProtectedRoute; 