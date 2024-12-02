import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

<<<<<<< HEAD
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

=======
>>>>>>> 4f81068 (aplicacion completa)
const InicioSesion = () => {
  const [formData, setFormData] = useState({ usuario: '', contrasena: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
<<<<<<< HEAD
      const response = await axios.post(`${API_URL}/login`, {
=======
      const response = await axios.post('http://localhost:5000/login', {
>>>>>>> 4f81068 (aplicacion completa)
        usuario: formData.usuario,
        contrasena: formData.contrasena
      }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Respuesta de login:', response.data);

      if (response.status === 200 && response.data.token) {
        localStorage.setItem('token', response.data.token);
        console.log('Token guardado:', response.data.token);

        if (response.data.usuario) {
          localStorage.setItem('userData', JSON.stringify(response.data.usuario));
        }
        
        toast.success('Inicio de sesión exitoso');
        
        setTimeout(() => {
          navigate('/tareas', { replace: true });
        }, 100);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al iniciar sesión';
      console.error('Error en login:', errorMessage);
      toast.error(errorMessage);
      setError(errorMessage);
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-100 flex items-center justify-center p-4"
      style={{ fontFamily: "'Work Sans', 'Noto Sans', sans-serif" }}
    >
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
        <header className="bg-black text-white py-4 text-center">
          <div className="flex items-center justify-center gap-3">
            <h2 className="text-lg font-bold">Schedeo</h2>
          </div>
        </header>

        <div className="px-6 py-8 bg-white">
          <h3 className="text-center text-2xl font-bold text-gray-800 mb-6">
            Log in to Schedeo
          </h3>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2" htmlFor="usuario">
                Username
              </label>
              <input
                type="text"
                id="usuario"
                value={formData.usuario}
                onChange={handleChange}
                placeholder="Enter username"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-black"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2" htmlFor="contrasena">
                Password
              </label>
              <input
                type="password"
                id="contrasena"
                value={formData.contrasena}
                onChange={handleChange}
                placeholder="Enter password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-black"
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm text-center mb-4">
                {error}
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition"
            >
              Log in
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Don&apos;t have an account?{' '}
            <button
              onClick={() => navigate('/register')}
              className="text-black underline"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default InicioSesion;
