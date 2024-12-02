import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    usuario: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/register', {
        name: formData.name,
        usuario: formData.usuario,
        email: formData.email,
        password: formData.password
      });
      
      if (response.status === 201) {
        navigate('/iniciodesesion');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar usuario');
    }
  };

  const handleCancel = () => {
    navigate('/iniciodesesion'); 
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center" style={{ fontFamily: "'Work Sans', 'Noto Sans', sans-serif" }}>
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
        <header className="bg-black text-white py-4 text-center">
          <div className="flex items-center justify-center gap-3">
            <svg className="w-8 h-8 text-white" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z"
                fill="currentColor"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z"
                fill="currentColor"
              />
            </svg>
            <h2 className="text-lg font-bold">Schedeo</h2>
          </div>
        </header>
        <div className="px-6 py-8 bg-white">
          <h3 className="text-center text-2xl font-bold text-gray-800 mb-6">Sign up for Schedeo</h3>
          {error && (
            <div className="text-red-500 text-sm text-center mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2" htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-gray-200"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2" htmlFor="usuario">Username</label>
              <input
                type="text"
                id="usuario"
                value={formData.usuario}
                onChange={handleChange}
                placeholder="Username"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-gray-200"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2" htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@gmail.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-gray-200"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2" htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 8 characters"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-gray-200"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-900 transition mb-3"
            >
              Register
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="w-full bg-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </form>
          <p className="text-center text-sm text-gray-600 mt-6">
            By creating an account, you are agreeing to our{' '}
            <button onClick={() => {}} className="text-black underline">terms of use</button>{' '}
            and <button onClick={() => {}} className="text-black underline">privacy policy</button>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;