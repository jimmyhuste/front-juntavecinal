import React, { useState } from 'react';
import axios from 'axios';
import validarRut from '../middlewares/validarRut';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

// Validaciones
const isValidCharacter = (value) => /^[A-Za-zÀ-ÿ\s]+$/.test(value);
const isValidChileanPhoneNumber = (phone) => /^9\d{8}$/.test(phone);
const BASE_URL = process.env.REACT_APP_BASE_URL;

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    motherLastName: '',
    rut: '',
    address: '',
    password: '',
    phoneNumber: '',
    email: '',
    role: 'MEMBER',
    photo: null,
    housingType: '',
    dateOfBirth: '', // Nuevo campo añadido
  });

  const { themes } = useTheme();
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Limpiar error cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Manejo especial para RUT
    if (name === 'rut') {
      const rutClean = value.replace(/[^0-9kK\.-]/g, '');
      setFormData({ ...formData, [name]: rutClean });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, photo: e.target.files[0] });
  };

  const validateForm = () => {
    const newErrors = {};

    // Validación nombre
    if (!formData.firstName) {
      newErrors.firstName = "El nombre es obligatorio";
    } else if (!isValidCharacter(formData.firstName)) {
      newErrors.firstName = "El nombre solo puede contener letras";
    } else if (formData.firstName.length < 3) {
      newErrors.firstName = "El nombre debe tener al menos 3 caracteres";
    } else if (formData.firstName.length > 30) {
      newErrors.firstName = "El nombre no puede tener más de 30 caracteres";
    }

    // Validación apellido paterno
    if (!formData.lastName) {
      newErrors.lastName = "El apellido paterno es obligatorio";
    } else if (!isValidCharacter(formData.lastName)) {
      newErrors.lastName = "El apellido solo puede contener letras";
    } else if (formData.lastName.length < 3) {
      newErrors.lastName = "El apellido debe tener al menos 3 caracteres";
    } else if (formData.lastName.length > 30) {
      newErrors.lastName = "El apellido no puede tener más de 30 caracteres";
    }

    // Validación apellido materno (opcional)
    if (formData.motherLastName) {
      if (!isValidCharacter(formData.motherLastName)) {
        newErrors.motherLastName = "El apellido materno solo puede contener letras";
      } else if (formData.motherLastName.length < 3) {
        newErrors.motherLastName = "El apellido materno debe tener al menos 3 caracteres";
      } else if (formData.motherLastName.length > 30) {
        newErrors.motherLastName = "El apellido materno no puede tener más de 30 caracteres";
      }
    }

    // Validación fecha de nacimiento
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "La fecha de nacimiento es obligatoria";
    } else {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      
      if (age < 18) {
        newErrors.dateOfBirth = "Debes ser mayor de 18 años";
      } else if (age > 120) {
        newErrors.dateOfBirth = "La fecha de nacimiento no es válida";
      }
    }

    // Validación RUT
    if (!formData.rut) {
      newErrors.rut = "El RUT es obligatorio";
    } else if (!validarRut(formData.rut)) {
      newErrors.rut = "El RUT ingresado no es válido";
    }

    // Validación dirección
    if (!formData.address) {
      newErrors.address = "La dirección es obligatoria";
    } else if (formData.address.length < 3) {
      newErrors.address = "La dirección debe tener al menos 3 caracteres";
    } else if (formData.address.length > 100) {
      newErrors.address = "La dirección no puede tener más de 100 caracteres";
    }

    // Validación teléfono
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "El número de teléfono es obligatorio";
    } else if (!isValidChileanPhoneNumber(formData.phoneNumber)) {
      newErrors.phoneNumber = "Debe ser un número de celular chileno válido (9 dígitos comenzando con 9)";
    }

    // Validación email
    if (!formData.email) {
      newErrors.email = "El correo electrónico es obligatorio";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El correo electrónico no es válido";
    } else if (formData.email.length < 3) {
      newErrors.email = "El correo electrónico debe tener al menos 3 caracteres";
    }

    // Validación contraseña
    if (!formData.password) {
      newErrors.password = "La contraseña es obligatoria";
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar formulario
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const firstError = Object.values(validationErrors)[0];
      console.log(firstError);
      return;
    }

    try {
      // Crear FormData y agregar todos los campos
      const formDataToSend = new FormData();

      // Agregar campos de texto
      Object.keys(formData).forEach(key => {
        if (key === 'rut') {
          formDataToSend.append(key, formData[key].replace(/\./g, '').toUpperCase());
        } else if (key === 'photo') {
          // Solo agregar la foto si existe
          if (formData.photo) {
            formDataToSend.append(key, formData.photo);
          }
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await axios.post(`${BASE_URL}/register/`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data', // Importante para archivos
        },
      });

      Swal.fire({
        icon: 'success',
        title: 'Registro exitoso',
        text: 'El usuario ha sido registrado correctamente.',
        timer: 2000,
        timerProgressBar: true
      });

      navigate('/panel');

    } catch (error) {
      console.error('Error al registrarse:', error);

      // Manejo mejorado de errores
      let errorMessage = "Hubo un error al registrar al usuario. Por favor, intente nuevamente.";

      if (error.response) {
        if (error.response.data.rut) {
          errorMessage = error.response.data.rut[0];
        } else if (error.response.data.photo) {
          errorMessage = "Error con la foto: " + error.response.data.photo[0];
        } else if (error.response.data.detail) {
          errorMessage = error.response.data.detail;
        }
      }

      Swal.fire({
        icon: 'error',
        title: 'Error en el registro',
        text: errorMessage,
        timer: 5000,
        timerProgressBar: true
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8" style={{ backgroundColor: themes.background }}>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img className="mx-auto h-10 w-auto" src="/diversity.png" alt="Junta Vecinos" />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight" style={{ color: themes.text }}>
          Regístrate para una nueva cuenta
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-3xl">
        <div className="bg-gray-800 px-8 py-10 rounded-lg">
          <form className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8" onSubmit={handleSubmit}>
            {/* Nombre */}
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium leading-6 text-white">
                Nombre
              </label>
              <div className="mt-2">
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder='Ingrese su nombre (mínimo 3 caracteres)'
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className={`block w-full rounded-md bg-gray-700 py-2 px-3 text-white placeholder:text-gray-400 border-0 
                    focus:ring-2 focus:ring-inset ${errors.firstName ? 'ring-2 ring-red-500 focus:ring-red-500' : 'focus:ring-blue-600'}
                    sm:text-sm sm:leading-6`}
                />
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
              </div>
            </div>

            {/* Apellido Paterno */}
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium leading-6 text-white">
                Apellido Paterno
              </label>
              <div className="mt-2">
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder='Ingrese su apellido paterno (mínimo 3 caracteres)'
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className={`block w-full rounded-md bg-gray-700 py-2 px-3 text-white placeholder:text-gray-400 border-0 
                    focus:ring-2 focus:ring-inset ${errors.lastName ? 'ring-2 ring-red-500 focus:ring-red-500' : 'focus:ring-blue-600'}
                    sm:text-sm sm:leading-6`}
                />
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
              </div>
            </div>

            {/* Apellido Materno */}
            <div>
              <label htmlFor="motherLastName" className="block text-sm font-medium leading-6 text-white">
                Apellido Materno
              </label>
              <div className="mt-2">
                <input
                  id="motherLastName"
                  name="motherLastName"
                  type="text"
                  placeholder='Opcional (mínimo 3 caracteres)'
                  value={formData.motherLastName}
                  onChange={handleChange}
                  className={`block w-full rounded-md bg-gray-700 py-2 px-3 text-white placeholder:text-gray-400 border-0 
                    focus:ring-2 focus:ring-inset ${errors.motherLastName ? 'ring-2 ring-red-500 focus:ring-red-500' : 'focus:ring-blue-600'}
                    sm:text-sm sm:leading-6`}
                />
                {errors.motherLastName && <p className="text-red-500 text-xs mt-1">{errors.motherLastName}</p>}
              </div>
            </div>

            {/* Fecha de Nacimiento */}
            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium leading-6 text-white">
                Fecha de Nacimiento
              </label>
              <div className="mt-2">
                <input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                  className={`block w-full rounded-md bg-gray-700 py-2 px-3 text-white placeholder:text-gray-400 border-0 
                    focus:ring-2 focus:ring-inset ${errors.dateOfBirth ? 'ring-2 ring-red-500 focus:ring-red-500' : 'focus:ring-blue-600'}
                    sm:text-sm sm:leading-6`}
                />
                {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>}
              </div>
            </div>

            {/* RUT */}
            <div>
              <label htmlFor="rut" className="block text-sm font-medium leading-6 text-white">
                RUT
              </label>
              <div className="mt-2">
                <input
                  id="rut"
                  name="rut"
                  type="text"
                  placeholder='Ingrese su RUT (11111111-1)'
                  value={formData.rut}
                  onChange={handleChange}
                  required
                  className={`block w-full rounded-md bg-gray-700 py-2 px-3 text-white placeholder:text-gray-400 border-0 
                    focus:ring-2 focus:ring-inset ${errors.rut ? 'ring-2 ring-red-500 focus:ring-red-500' : 'focus:ring-blue-600'}
                    sm:text-sm sm:leading-6`}
                />
                {errors.rut && <p className="text-red-500 text-xs mt-1">{errors.rut}</p>}
              </div>
            </div>

            {/*{/* Dirección */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium leading-6 text-white">
                Dirección
              </label>
              <div className="mt-2">
                <input
                  id="address"
                  name="address"
                  type="text"
                  placeholder='Ingrese la dirección de domicilio (mínimo 3 caracteres)'
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className={`block w-full rounded-md bg-gray-700 py-2 px-3 text-white placeholder:text-gray-400 border-0 
                    focus:ring-2 focus:ring-inset ${errors.address ? 'ring-2 ring-red-500 focus:ring-red-500' : 'focus:ring-blue-600'}
                    sm:text-sm sm:leading-6`}
                />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
              </div>
            </div>

            {/* Teléfono */}
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium leading-6 text-white">
                Teléfono
              </label>
              <div className="mt-2">
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="text"
                  placeholder='Ingrese su número telefónico (987654321)'
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  className={`block w-full rounded-md bg-gray-700 py-2 px-3 text-white placeholder:text-gray-400 border-0 
                    focus:ring-2 focus:ring-inset ${errors.phoneNumber ? 'ring-2 ring-red-500 focus:ring-red-500' : 'focus:ring-blue-600'}
                    sm:text-sm sm:leading-6`}
                />
                {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-white">
                Correo Electrónico
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder='Ingrese su correo electrónico'
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={`block w-full rounded-md bg-gray-700 py-2 px-3 text-white placeholder:text-gray-400 border-0 
                    focus:ring-2 focus:ring-inset ${errors.email ? 'ring-2 ring-red-500 focus:ring-red-500' : 'focus:ring-blue-600'}
                    sm:text-sm sm:leading-6`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-white">
                Contraseña
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder='Ingrese su contraseña (mínimo 6 caracteres)'
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className={`block w-full rounded-md bg-gray-700 py-2 px-3 text-white placeholder:text-gray-400 border-0 
                    focus:ring-2 focus:ring-inset ${errors.password ? 'ring-2 ring-red-500 focus:ring-red-500' : 'focus:ring-blue-600'}
                    sm:text-sm sm:leading-6`}
                />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>
            </div>

            {/* Foto */}
            <div>
              <label htmlFor="photo" className="block text-sm font-medium leading-6 text-white">
                Foto (opcional)
              </label>
              <div className="mt-2">
                <input
                  id="photo"
                  name="photo"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full rounded-md bg-gray-700 py-2 px-3 text-white file:mr-4 file:py-2 
                    file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold 
                    file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                />
              </div>
            </div>

            {/* Botón de envío */}
            <div className="sm:col-span-2">
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold 
                         leading-6 text-white shadow-sm hover:bg-blue-700 focus-visible:outline 
                         focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Crear cuenta
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;