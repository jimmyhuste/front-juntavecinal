import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function Login() {
  const [rut, setRut] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loginMessage, setLoginMessage] = useState('');
  const navigate = useNavigate(); 
  const { themes } = useTheme();
  const handleRutChange = (e) => {
    setRut(e.target.value);
  };
  

  function limpiarRut(rut) {
      // Elimina los puntos y el guion del RUT
      return rut.replace(/[.-]/g, '');
  } 
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    setLoginMessage('');
    setErrors({});

    let rutFormated = limpiarRut(rut);
    if (!rutFormated) {
      newErrors.rut = 'El RUT es requerido';
    }

    if (!password) {
      newErrors.password = 'La contraseña es requerida';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await axios.post(`${BASE_URL}/login/`, {
          rut: rutFormated,
          password
        });

        console.log('Respuesta del servidor:', response.data);

        if (response.data && response.data.token) {
          // Almacenar el token en el localStorage
          localStorage.setItem('token', response.data.token);
          setLoginMessage('Inicio de sesión exitoso');
          navigate('/panel'); // Redirigir al panel u otra página después de iniciar sesión
        } else {
          setLoginMessage('Error: No se recibió un token válido del servidor.');
        }
        
      } catch (error) {
        console.error('Error al iniciar sesión:', error);
        if (error.response) {
          if (error.response.status === 401) {
            setLoginMessage('RUT o contraseña incorrectos. Por favor, verifica tus credenciales.');
          } else {
            setLoginMessage('Error en el servidor. Por favor, intenta más tarde.');
          }
        } else if (error.request) {
          setLoginMessage('No se pudo conectar con el servidor. Verifica tu conexión a internet.');
        } else {
          setLoginMessage('Ocurrió un error al procesar tu solicitud. Por favor, intenta de nuevo.');
        }
      }
    }
  };

  const handleCreateAccount = () => {
    console.log('Redirigiendo a la página de creación de cuenta...');
    navigate('/register');
  };

  return (
    <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8" style={{ backgroundColor: themes.background }}>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img className="mx-auto h-10 w-auto" src="/diversity.png" alt="Junta Vecinos" />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight" style={{ color: themes.text }}>
          Inicia sesión en tu cuenta
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-800 px-8 py-10 rounded-lg">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="rut" className="block text-sm font-medium leading-6 text-white">
                RUT
              </label>
              <div className="mt-2">
                <input
                  id="rut"
                  name="rut"
                  type="text"
                  autoComplete="rut"
                  placeholder='Ingrese su Usuario (11111111-1)'
                  value={rut}
                  onChange={handleRutChange}
                  required
                  className="block w-full rounded-md bg-gray-700 py-2 px-3 text-white placeholder:text-gray-400 border-0 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                />
                {errors.rut && <p className="mt-2 text-sm text-red-500">{errors.rut}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-white">
                Contraseña
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder='Ingrese su Contraseña'
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="block w-full rounded-md bg-gray-700 py-2 px-3 text-white placeholder:text-gray-400 border-0 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                />
                {errors.password && <p className="mt-2 text-sm text-red-500">{errors.password}</p>}
              </div>
            </div>

            {loginMessage && (
              <div className={`p-4 rounded-md ${loginMessage.includes('exitoso') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {loginMessage}
              </div>
            )}

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Iniciar sesión
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <span className="text-white">¿No tienes una cuenta? </span>
            <span onClick={handleCreateAccount} className="cursor-pointer text-blue-500 hover:text-blue-400 hover:underline">
              Créala aquí
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}