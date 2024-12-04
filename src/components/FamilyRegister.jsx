import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import validarRut from '../middlewares/validarRut';
import { useValidateRoleAndAccessToken } from '../middlewares/validateRoleAndAccessToken';
import { jwtDecode } from 'jwt-decode';
import { useTheme } from '../context/ThemeContext';

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const FamilyRegister = () => {
  const initialFormState = {
    rut: '',
    rutMember: '',
    firstName: '',
    lastName: '',
    relationship: '',
    date_of_birth: '',
    email: '',
    phoneNumber: '',
  };
  const { themes } = useTheme();
  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [rut, setRut] = useState('');
  const token = localStorage.getItem('token');

  useValidateRoleAndAccessToken(['1', '2'], '/login');

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      setRut(decodedToken.rut);
      setFormData(prev => ({
        ...prev,
        rut: decodedToken.rut
      }));
    }
  }, [token]);

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^(\+?56|0056)?(\s?)((9\d{8})|(2\d{7}))$/;
    return phoneRegex.test(phone);
  };

  const formatRut = (rut) => {
    if (!rut) return '';

    const cleanRut = rut.replace(/[^0-9kK]/g, '').toUpperCase();
    if (cleanRut.length < 2) return cleanRut;

    const dv = cleanRut.slice(-1);
    const rutBody = cleanRut.slice(0, -1);
    return rutBody.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '-' + dv;
  };

  const validateForm = () => {
    const newErrors = {};
    const today = new Date();
    const birthDate = new Date(formData.date_of_birth);

    if (!formData.rutMember) {
      newErrors.rutMember = 'RUT del miembro es requerido';
    } else if (!validarRut(formData.rutMember)) {
      newErrors.rutMember = 'RUT inválido';
    }

    if (!formData.firstName?.trim()) {
      newErrors.firstName = 'Nombre es requerido';
    } else if (formData.firstName.length < 3) {
      newErrors.firstName = 'Nombre debe tener al menos 3 caracteres';
    }

    if (!formData.lastName?.trim()) {
      newErrors.lastName = 'Apellido es requerido';
    } else if (formData.lastName.length < 3) {
      newErrors.lastName = 'Apellido debe tener al menos 3 caracteres';
    }

    if (!formData.relationship?.trim()) {
      newErrors.relationship = 'Relación es requerida';
    }

    if (!formData.date_of_birth) {
      newErrors.date_of_birth = 'Fecha de nacimiento es requerida';
    } else if (birthDate > today) {
      newErrors.date_of_birth = 'La fecha de nacimiento no puede ser futura';
    }

    if (!formData.email) {
      newErrors.email = 'Email es requerido';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Teléfono es requerido';
    } else if (!validatePhone(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Formato de teléfono inválido (+569XXXXXXXX)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'rutMember') {
      formattedValue = formatRut(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      ...initialFormState,
      rut: rut // Mantener el rut del usuario actual
    });
    setErrors({});
    setIsSubmitting(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      const errorMessages = Object.values(errors).join('\n');
      console.log(errorMessages)
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(`${BASE_URL}/register/family/member/`, formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        await Swal.fire({
          title: '¡Éxito!',
          text: 'Miembro de la familia registrado correctamente',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          timer: 2000,
          timerProgressBar: true
        });
        
        resetForm();
      }
    } catch (error) {
      console.error('Error:', error);
    
      let errorMessage = 'Error al registrar el miembro';
      if (error.response?.status === 400 && error.response?.data?.error === 'Family member with this rut already exists') {
        errorMessage = 'El integrante ya existe en tu grupo familiar';
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
    
      await Swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'Aceptar',
        timer: 5000,
        timerProgressBar: true
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto h-screen w-full mt-8" style={{ backgroundColor: themes.background }}>
      <div className="max-w-3xl rounded-lg p-8 mx-auto bg-gray-800">
        <h2 className="mb-8 text-center text-2xl font-bold leading-9 text-white">
          Registra un integrante de la familia
        </h2>

        <form className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="rutMember" className="block text-sm font-medium leading-6 text-white">
              Rut del integrante
            </label>
            <div className="mt-2">
              <input
                id="rutMember"
                name="rutMember"
                type="text"
                placeholder="Ej: 12.345.678-9"
                value={formData.rutMember}
                onChange={handleChange}
                disabled={isSubmitting}
                className="block w-full rounded-md bg-gray-700 py-2 px-3 text-white placeholder:text-gray-400 border-0 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
              {errors.rutMember && <p className="text-red-500 text-xs mt-1">{errors.rutMember}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="firstName" className="block text-sm font-medium leading-6 text-white">
              Nombre
            </label>
            <div className="mt-2">
              <input
                id="firstName"
                name="firstName"
                type="text"
                placeholder="Ingrese el nombre"
                value={formData.firstName}
                onChange={handleChange}
                disabled={isSubmitting}
                className="block w-full rounded-md bg-gray-700 py-2 px-3 text-white placeholder:text-gray-400 border-0 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
              {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium leading-6 text-white">
              Apellido
            </label>
            <div className="mt-2">
              <input
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Ingrese el apellido"
                value={formData.lastName}
                onChange={handleChange}
                disabled={isSubmitting}
                className="block w-full rounded-md bg-gray-700 py-2 px-3 text-white placeholder:text-gray-400 border-0 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
              {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="relationship" className="block text-sm font-medium leading-6 text-white">
              Relación
            </label>
            <div className="mt-2">
              <select
                id="relationship"
                name="relationship"
                value={formData.relationship}
                onChange={handleChange}
                disabled={isSubmitting}
                className="block w-full rounded-md bg-gray-700 py-2 px-3 text-white placeholder:text-gray-400 border-0 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              >
                <option value="" disabled>Seleccione la relación</option>
                <option value="padre">Padre</option>
                <option value="madre">Madre</option>
                <option value="hermano/a">Hermano/a</option>
                <option value="esposo/a">Esposo/a</option>
                <option value="hijo/a">Hijo/a</option>
                <option value="conyuge">Cónyuge</option>
                <option value="pareja">Pareja</option>
                <option value="tio/a">Tío/a</option>
                <option value="primo/a">Primo/a</option>
                <option value="abuelo/a">Abuelo/a</option>
                <option value="otro">Otro</option>
              </select>
              {errors.relationship && <p className="text-red-500 text-xs mt-1">{errors.relationship}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="date_of_birth" className="block text-sm font-medium leading-6 text-white">
              Fecha de Nacimiento
            </label>
            <div className="mt-2">
              <input
                id="date_of_birth"
                name="date_of_birth"
                type="date"
                value={formData.date_of_birth}
                onChange={handleChange}
                disabled={isSubmitting}
                className="block w-full rounded-md bg-gray-700 py-2 px-3 text-white border-0 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
              {errors.date_of_birth && <p className="text-red-500 text-xs mt-1">{errors.date_of_birth}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-white">
              Email
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Ingrese el email"
                value={formData.email}
                onChange={handleChange}
                disabled={isSubmitting}
                className="block w-full rounded-md bg-gray-700 py-2 px-3 text-white placeholder:text-gray-400 border-0 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium leading-6 text-white">
              Teléfono
            </label>
            <div className="mt-2">
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                placeholder="Ej: +569XXXXXXXX"
                value={formData.phoneNumber}
                onChange={handleChange}
                disabled={isSubmitting}
                className="block w-full rounded-md bg-gray-700 py-2 px-3 text-white placeholder:text-gray-400 border-0 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
              {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
            </div>
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Registrando...
                </div>
              ) : (
                'Registrar Miembro'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};