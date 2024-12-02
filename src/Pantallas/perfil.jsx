import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

<<<<<<< HEAD
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

=======
>>>>>>> 4f81068 (aplicacion completa)
const ProfilePage = () => {
  const [currentSection, setCurrentSection] = useState('Perfil');
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [editForm, setEditForm] = useState({
    nuevo_nombre: '',
    nuevo_usuario: '',
    contrasena_actual: '',
    nueva_contrasena: ''
  });
  const [passwordForm, setPasswordForm] = useState({
    contrasena_actual: '',
    nueva_contrasena: ''
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

<<<<<<< HEAD
        const response = await axios.get(`${API_URL}/obtener-info-usuario`, {
=======
        const response = await axios.get('http://localhost:5000/obtener-info-usuario', {
>>>>>>> 4f81068 (aplicacion completa)
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.data) {
          setUserData(response.data);
          setEditForm({
            nuevo_nombre: response.data.nombre_completo,
            nuevo_usuario: response.data.usuario,
            contrasena_actual: '',
            nueva_contrasena: ''
          });
          setLoading(false);
        }
      } catch (error) {
        console.error('Error:', error);
        setLoading(false);
        if (error.response?.status === 401) {
          navigate('/login');
        }
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleSectionChange = (section) => {
    if (section === 'Hoy' || section === 'Mañana' || section === 'Próximamente') {
      navigate('/tareas');
    }
    setCurrentSection(section);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
<<<<<<< HEAD
      const response = await axios.put(`${API_URL}/editar-usuario`, editForm, {
=======
      const response = await axios.put('http://localhost:5000/editar-usuario', editForm, {
>>>>>>> 4f81068 (aplicacion completa)
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.status === 200) {
        setUserData(response.data.usuario);
        setIsEditing(false);
        alert('Información actualizada exitosamente');
      }
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      alert(error.response?.data?.message || 'Error al actualizar la información');
    }
  };

  const validatePassword = (password) => {
    if (password.length < 8) {
      return 'La contraseña debe tener al menos 8 caracteres';
    }
    return '';
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    const passwordValidation = validatePassword(passwordForm.nueva_contrasena);
    if (passwordValidation) {
      setPasswordError(passwordValidation);
      return;
    }

    try {
      const token = localStorage.getItem('token');
<<<<<<< HEAD
      const response = await axios.put(`${API_URL}/editar-usuario`, {
=======
      const response = await axios.put('http://localhost:5000/editar-usuario', {
>>>>>>> 4f81068 (aplicacion completa)
        ...editForm,
        contrasena_actual: passwordForm.contrasena_actual,
        nueva_contrasena: passwordForm.nueva_contrasena
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        setIsChangingPassword(false);
        setPasswordForm({
          contrasena_actual: '',
          nueva_contrasena: ''
        });
        setPasswordError('');
        alert('Contraseña actualizada exitosamente');
      }
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      alert(error.response?.data?.message || 'Error al cambiar la contraseña');
    }
  };

  const renderProfileContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <div className="text-lg">Cargando...</div>
        </div>
      );
    } else if (userData) {
      return (
        <div className="max-w-xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-[#111418] mb-6 text-center">Perfil de Usuario</h2>

          {isEditing ? (
            <form onSubmit={handleEditSubmit} className="bg-[#f0f2f4] rounded-xl p-6 space-y-5">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nombre Completo</label>
                  <input
                    type="text"
                    value={editForm.nuevo_nombre}
                    onChange={(e) => setEditForm({...editForm, nuevo_nombre: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Usuario</label>
                  <input
                    type="text"
                    value={editForm.nuevo_usuario}
                    onChange={(e) => setEditForm({...editForm, nuevo_usuario: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Contraseña Actual</label>
                  <input
                    type="password"
                    value={editForm.contrasena_actual}
                    onChange={(e) => setEditForm({...editForm, contrasena_actual: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
              </div>
              <div className="flex space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#0066cc] text-white py-2 rounded-lg hover:bg-[#0052a3]"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          ) : isChangingPassword ? (
            <form onSubmit={handlePasswordSubmit} className="bg-[#f0f2f4] rounded-xl p-6 space-y-5">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Contraseña Actual</label>
                  <input
                    type="password"
                    value={passwordForm.contrasena_actual}
                    onChange={(e) => setPasswordForm({...passwordForm, contrasena_actual: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Nueva Contraseña</label>
                  <input
                    type="password"
                    value={passwordForm.nueva_contrasena}
                    onChange={(e) => {
                      setPasswordForm({...passwordForm, nueva_contrasena: e.target.value});
                      setPasswordError(validatePassword(e.target.value));
                    }}
                    className="w-full p-2 border rounded"
                    required
                  />
                  {passwordError && (
                    <p className="text-red-500 text-sm mt-1">{passwordError}</p>
                  )}
                  <ul className="text-sm text-gray-600 mt-2">
                    <li>• Mínimo 8 caracteres</li>
                  </ul>
                </div>
              </div>
              <div className="flex space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsChangingPassword(false);
                    setPasswordError('');
                  }}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#0066cc] text-white py-2 rounded-lg hover:bg-[#0052a3]"
                  disabled={!!passwordError}
                >
                  Cambiar Contraseña
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="bg-[#f0f2f4] rounded-xl p-6 space-y-5">
                <div className="flex justify-between items-center border-b pb-4 border-[#e0e4e8]">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-[#637588]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="font-medium text-[#111418]">Nombre</span>
                  </div>
                  <span className="text-[#637588]">{userData.nombre_completo}</span>
                </div>

                <div className="flex justify-between items-center border-b pb-4 border-[#e0e4e8]">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-[#637588]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="font-medium text-[#111418]">Usuario</span>
                  </div>
                  <span className="text-[#637588]">{userData.usuario}</span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-[#637588]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span className="font-medium text-[#111418]">Contraseña</span>
                  </div>
                  <span className="text-[#637588]">********</span>
                </div>
              </div>
              
              <div className="flex space-x-4 mt-6">
                <button 
                  onClick={() => setIsEditing(true)}
                  className="flex-1 bg-[#f0f2f4] text-[#111418] py-3 rounded-lg hover:bg-[#e4e6e8] transition-colors font-medium"
                >
                  Editar Perfil
                </button>
                <button 
                  onClick={() => setIsChangingPassword(true)}
                  className="flex-1 bg-[#0066cc] text-white py-3 rounded-lg hover:bg-[#0052a3] transition-colors font-medium"
                >
                  Cambiar Contraseña
                </button>
              </div>
            </>
          )}
        </div>
      );
    } else {
      return (
        <div className="flex justify-center items-center h-screen">
          <div className="text-lg">Error al cargar el perfil</div>
        </div>
      );
    }
  };

  return (
    <div className="flex">
      <Sidebar onSectionChange={handleSectionChange} />
      
      <div className="flex-1 p-6">
        {renderProfileContent()}
      </div>
    </div>
  );
};

export default ProfilePage;