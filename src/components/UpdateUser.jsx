import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { useValidateRoleAndAccessToken } from '../middlewares/validateRoleAndAccessToken';
import { FaArrowLeft, FaUser } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const UpdateUser = () => {
    const { themes } = useTheme();
    const { rut } = useParams();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        motherLastName: "",
        address: "",
        phoneNumber: "",
        email: "",
        password: "",
        housingType: "",
        photo: null,
        photoUrl: "",
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useValidateRoleAndAccessToken(['1', '2'], '/login');

    const isValidCharacter = (value) => /^[A-Za-zÀ-ÿ\s]+$/.test(value);
    const isValidChileanPhoneNumber = (phone) => /^9\d{8}$/.test(phone);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios({
                    method: 'get',
                    url: `${BASE_URL}/user/list/one/`,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    params: { rut }
                });

                const user = response.data;
                setFormData({
                    ...user,
                    password: "",
                    photoUrl: user.photo || ""
                });
            } catch (error) {
                console.error("Error al cargar los datos del usuario:", error);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "No se pudieron cargar los datos del usuario",
                    timer: 3000,
                    timerProgressBar: true
                });
            }
        };

        fetchUserData();
    }, [rut, token]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            if (!validTypes.includes(file.type)) {
                setErrors(prev => ({
                    ...prev,
                    photo: "Solo se permiten archivos JPG, JPEG o PNG"
                }));
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                setErrors(prev => ({
                    ...prev,
                    photo: "La imagen no debe superar los 5MB"
                }));
                return;
            }

            setFormData(prev => ({
                ...prev,
                photo: file,
                photoUrl: URL.createObjectURL(file)
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.firstName) {
            newErrors.firstName = "El nombre es obligatorio";
        } else if (!isValidCharacter(formData.firstName)) {
            newErrors.firstName = "El nombre solo puede contener letras";
        } else if (formData.firstName.length < 3) {
            newErrors.firstName = "El nombre debe tener al menos 3 caracteres";
        } else if (formData.firstName.length > 30) {
            newErrors.firstName = "El nombre no puede tener más de 30 caracteres";
        }

        if (!formData.lastName) {
            newErrors.lastName = "El apellido paterno es obligatorio";
        } else if (!isValidCharacter(formData.lastName)) {
            newErrors.lastName = "El apellido solo puede contener letras";
        } else if (formData.lastName.length < 3) {
            newErrors.lastName = "El apellido debe tener al menos 3 caracteres";
        } else if (formData.lastName.length > 30) {
            newErrors.lastName = "El apellido no puede tener más de 30 caracteres";
        }

        if (formData.motherLastName !== undefined && formData.motherLastName !== null) {
            if (formData.motherLastName.trim().length > 0) {
                if (!isValidCharacter(formData.motherLastName)) {
                    newErrors.motherLastName = "El apellido materno solo puede contener letras";
                } else if (formData.motherLastName.length < 3) {
                    newErrors.motherLastName = "El apellido materno debe tener al menos 3 caracteres";
                } else if (formData.motherLastName.length > 30) {
                    newErrors.motherLastName = "El apellido materno no puede tener más de 30 caracteres";
                }
            }
        }

        if (!formData.address) {
            newErrors.address = "La dirección es obligatoria";
        } else if (formData.address.length < 3) {
            newErrors.address = "La dirección debe tener al menos 3 caracteres";
        } else if (formData.address.length > 100) {
            newErrors.address = "La dirección no puede tener más de 100 caracteres";
        }

        if (!formData.phoneNumber) {
            newErrors.phoneNumber = "El número de teléfono es obligatorio";
        } else if (!isValidChileanPhoneNumber(formData.phoneNumber)) {
            newErrors.phoneNumber = "Debe ser un número chileno válido (9 dígitos comenzando con 9)";
        }

        if (!formData.email) {
            newErrors.email = "El correo electrónico es obligatorio";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "El correo electrónico no es válido";
        }

        if (formData.password) {
            if (formData.password.length < 6) {
                newErrors.password = "La contraseña debe tener al menos 6 caracteres";
            } else if (formData.password.length > 30) {
                newErrors.password = "La contraseña no puede tener más de 30 caracteres";
            }
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            const firstError = Object.values(validationErrors)[0];
            console.log(firstError);
            return;
        }

        setLoading(true);
        try {
            const formDataToSend = new FormData();

            Object.keys(formData).forEach(key => {
              if (key === 'photo') {
                if (formData.photo instanceof File) {
                  formDataToSend.append('photo', formData.photo);
                }
              } else if (key !== 'photoUrl') {
                formDataToSend.append(key, formData[key]);
              }
            });

            // Para debugging
            console.log('Datos a enviar:', Object.fromEntries(formDataToSend));

            const response = await axios.put(`${BASE_URL}/user/edit/`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('Respuesta:', response.data);

            await Swal.fire({
                title: "¡Actualización exitosa!",
                text: "Los datos se han actualizado correctamente",
                icon: "success",
                timer: 2000,
                timerProgressBar: true
            });

            navigate('/panel');
        } catch (error) {
            console.error("Error al actualizar:", error.response || error);
            Swal.fire({
                title: "Error",
                text: error.response?.data?.message || "Error al actualizar los datos",
                icon: "error",
                timer: 3000,
                timerProgressBar: true
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8" style={{ backgroundColor: themes.background }}>
            <div className="sm:mx-auto sm:w-full sm:max-w-3xl">
                <div className="bg-gray-800 px-8 py-10 rounded-lg">
                    <div className="mb-6 flex justify-between items-center">
                        <NavLink
                            to="/panel"
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                        >
                            <FaArrowLeft className="mr-2" />
                            Volver
                        </NavLink>

                        <div className="flex flex-col items-center">
                            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-blue-500 mb-2">
                                {formData.photoUrl ? (
                                    <img
                                        src={formData.photoUrl}
                                        alt="Foto de perfil"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                                        <FaUser className="text-gray-400 text-3xl" />
                                    </div>
                                )}
                            </div>
                            <span className="text-sm text-gray-400">Foto de perfil</span>
                        </div>
                    </div>

                    <h2 className="mb-8 text-center text-2xl font-bold leading-9 text-white">
                        Actualiza tu cuenta
                    </h2>

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
                                    placeholder="Mínimo 3 caracteres"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                    className={`block w-full rounded-md bg-gray-700 py-2 px-3 text-white placeholder:text-gray-400 border-0 
                                        focus:ring-2 focus:ring-inset ${errors.firstName ? 'ring-2 ring-red-500' : 'focus:ring-blue-600'}
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
                                    placeholder="Mínimo 3 caracteres"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                    className={`block w-full rounded-md bg-gray-700 py-2 px-3 text-white placeholder:text-gray-400 border-0 
                                        focus:ring-2 focus:ring-inset ${errors.lastName ? 'ring-2 ring-red-500' : 'focus:ring-blue-600'}
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
                                    placeholder="Opcional (mínimo 3 caracteres)"
                                    value={formData.motherLastName}
                                    onChange={handleChange}
                                    className={`block w-full rounded-md bg-gray-700 py-2 px-3 text-white placeholder:text-gray-400 border-0 
                                        focus:ring-2 focus:ring-inset ${errors.motherLastName ? 'ring-2 ring-red-500' : 'focus:ring-blue-600'}
                                        sm:text-sm sm:leading-6`}
                                />
                                {errors.motherLastName && <p className="text-red-500 text-xs mt-1">{errors.motherLastName}</p>}
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
                                    placeholder="12345678-9"
                                    value={formData.rut}
                                    onChange={handleChange}
                                    required
                                    disabled
                                    className="block w-full rounded-md bg-gray-600 py-2 px-3 text-gray-400 placeholder:text-gray-500 border-0 
                                        cursor-not-allowed sm:text-sm sm:leading-6"
                                />
                                {errors.rut && <p className="text-red-500 text-xs mt-1">{errors.rut}</p>}
                            </div>
                        </div>

                        {/* Dirección */}
                        <div>
                            <label htmlFor="address" className="block text-sm font-medium leading-6 text-white">
                                Dirección
                            </label>
                            <div className="mt-2">
                                <input
                                    id="address"
                                    name="address"
                                    type="text"
                                    placeholder="Mínimo 3 caracteres"
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                    className={`block w-full rounded-md bg-gray-700 py-2 px-3 text-white placeholder:text-gray-400 border-0 
                focus:ring-2 focus:ring-inset ${errors.address ? 'ring-2 ring-red-500' : 'focus:ring-blue-600'}
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
                                    placeholder="987654321"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    required
                                    className={`block w-full rounded-md bg-gray-700 py-2 px-3 text-white placeholder:text-gray-400 border-0 
                                        focus:ring-2 focus:ring-inset ${errors.phoneNumber ? 'ring-2 ring-red-500' : 'focus:ring-blue-600'}
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
                                    placeholder="ejemplo@correo.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className={`block w-full rounded-md bg-gray-700 py-2 px-3 text-white placeholder:text-gray-400 border-0 
                                        focus:ring-2 focus:ring-inset ${errors.email ? 'ring-2 ring-red-500' : 'focus:ring-blue-600'}
                                        sm:text-sm sm:leading-6`}
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>
                        </div>

                        {/* Contraseña */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-white">
                                Nueva Contraseña (opcional)
                            </label>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Mínimo 6 caracteres"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`block w-full rounded-md bg-gray-700 py-2 px-3 text-white placeholder:text-gray-400 border-0 
                                        focus:ring-2 focus:ring-inset ${errors.password ? 'ring-2 ring-red-500' : 'focus:ring-blue-600'}
                                        sm:text-sm sm:leading-6`}
                                />
                                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                            </div>
                        </div>

                        {/* Foto */}
                        <div>
                            <label htmlFor="photo" className="block text-sm font-medium leading-6 text-white">
                                Actualizar foto
                            </label>
                            <div className="mt-2">
                                <input
                                    id="photo"
                                    name="photo"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="block w-full rounded-md bg-gray-700 py-2 px-3 text-white
                                            file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0
                                            file:text-sm file:font-semibold file:bg-blue-600 
                                            file:text-white hover:file:bg-blue-700"
                                />
                                {errors.photo && <p className="text-red-500 text-xs mt-1">{errors.photo}</p>}
                            </div>
                        </div>

                        {/* Botón de submit */}
                        <div className="sm:col-span-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm
                                    ${loading ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
                                    focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600`}
                            >
                                {loading ? (
                                    <div className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Actualizando...
                                    </div>
                                ) : (
                                    'Actualizar cuenta'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpdateUser;