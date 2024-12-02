import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import InicioSesion from './Pantallas/iniciodesesion';
import SignupPage from './Pantallas/register';
import Tareas from './Pantallas/tareas';
import ProfilePage from './Pantallas/perfil';
import Eliminados from './Pantallas/eliminados';
import './App.css';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';

<<<<<<< HEAD
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

=======
>>>>>>> 4f81068 (aplicacion completa)
// Componente de protección de rutas
const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = React.useState(null);

    React.useEffect(() => {
        const verifyAuth = async () => {
            try {
                const token = localStorage.getItem('token');
                console.log('Token a enviar:', token);

                if (!token) {
                    setIsAuthenticated(false);
                    return;
                }

<<<<<<< HEAD
                const response = await axios.get(`${API_URL}/session`, {
=======
                const response = await axios.get('http://localhost:5000/session', {
>>>>>>> 4f81068 (aplicacion completa)
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                console.log('Respuesta de /session:', response.data);
                setIsAuthenticated(response.data.loggedin);
            } catch (error) {
                console.error('Error en verificación:', error.response?.data);
                setIsAuthenticated(false);
            }
        };

        verifyAuth();
    }, []);

    if (isAuthenticated === null) {
        console.log('Estado de autenticación: cargando');
        return <div>Cargando...</div>;
    }

    if (!isAuthenticated) {
        console.log('No autenticado, redirigiendo a login');
        return <Navigate to="/iniciodesesion" replace />;
    }

    console.log('Usuario autenticado, mostrando contenido');
    return children;
};

function App() {
  return (
<<<<<<< HEAD
    <Router basename="/Schedeo">
=======
    <Router>
>>>>>>> 4f81068 (aplicacion completa)
      <div className="App">
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Navigate to="/iniciodesesion" />} />
          <Route path="/iniciodesesion" element={<InicioSesion />} />
          <Route path="/register" element={<SignupPage />} />
          <Route 
            path="/tareas" 
            element={
              <ProtectedRoute>
                <Tareas />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/perfil" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          <Route
            path="/eliminados"
            element={
              <ProtectedRoute>
                <Eliminados />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;