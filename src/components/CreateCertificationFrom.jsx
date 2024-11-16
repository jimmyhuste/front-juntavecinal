import React, { useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { useValidateRoleAndAccessToken } from '../middlewares/validateRoleAndAccessToken';
import { useTheme } from '../context/ThemeContext';
import validarRut from '../middlewares/validarRut';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const CreateCertificationForm = () => {
    const [formData, setFormData] = useState({
        rutRequest: '',
    });
    const [errors, setErrors] = useState({});
    const [infoVisible, setInfoVisible] = useState({
        rutRequest: false,
    });
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    const rutUser = decodedToken.rut;
    const { themes } = useTheme();

    useValidateRoleAndAccessToken(["1", "2"], '/login');

    const validateForm = () => {
        const newErrors = {};
        
        // Validación del RUT
        if (!formData.rutRequest) {
            newErrors.rutRequest = 'El RUT es requerido';
        } else if (!validarRut(formData.rutRequest)) {
            newErrors.rutRequest = 'El RUT ingresado no es válido';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        // Limpiar error cuando el usuario empieza a escribir
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validar antes de enviar
        if (!validateForm()) {
            return;
        }

        try {
            await axios.post(`${BASE_URL}/create/solicitud/`, {
                rutUser: rutUser,
                rutRequest: formData.rutRequest,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            Swal.fire({
                icon: 'success',
                title: 'Solicitud creada',
                text: 'La solicitud se ha creado exitosamente.',
                timer: 2000,
                timerProgressBar: true
            });

            setFormData({
                rutRequest: '',
            });
        } catch (error) {
            if (error.response && error.response.data) {
                setErrors(error.response.data);
            }

            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un problema al crear la solicitud. Por favor, intenta nuevamente.',
                timer: 5000,
                timerProgressBar: true
            });
        }
    };

    const toggleInfo = (field) => {
        setInfoVisible((prevState) => ({
            ...prevState,
            [field]: !prevState[field],
        }));
    };

    return (
        <div className="flex-1 p-6 bg-gray-100 overflow-y-auto h-screen w-full mt-8" style={{ backgroundColor: themes.background, color: themes.text }}>
            <div className="max-w-3xl rounded-lg p-8 mx-auto bg-gray-800">
                <h2 className="mb-8 text-center text-2xl font-bold leading-9 text-white">
                    Crear una nueva solicitud
                </h2>

                <form className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="rutRequest" className="block text-sm font-medium text-white">
                            Rut del Solicitante
                        </label>
                        <div className="mt-2 flex items-center">
                            <input
                                id="rutRequest"
                                name="rutRequest"
                                type="text"
                                placeholder='Ingrese el Rut del solicitante'
                                value={formData.rutRequest}
                                onChange={handleChange}
                                required
                                className={`block w-full rounded-md bg-gray-700 py-2 px-3 text-white shadow-sm ring-1 ring-inset 
                                    ${errors.rutRequest ? 'ring-red-500' : 'ring-gray-300'} 
                                    placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm`}
                            />
                            <button
                                type="button"
                                className="ml-2 flex items-center justify-center h-8 w-8 rounded-full bg-gray-600 text-white focus:outline-none"
                                onClick={() => toggleInfo('rutRequest')}
                            >
                                ?
                            </button>
                        </div>
                        {infoVisible.rutRequest && (
                            <p className="text-gray-500 text-xs mt-1">
                                El rut del solicitante corresponde al integrante del núcleo familiar que realiza la solicitud. Este puede ser el mismo jefe de hogar o cualquier otro miembro que actúe en representación del hogar. Ingresar correctamente este RUT es crucial para asegurar que la solicitud sea procesada adecuadamente y que los beneficios se asignen de manera justa y eficiente, considerando la situación específica del hogar.
                            </p>
                        )}
                        {errors.rutRequest && (
                            <p className="text-red-500 text-xs mt-1">{errors.rutRequest}</p>
                        )}
                    </div>

                    <div className="sm:col-span-2">
                        <button
                            type="submit"
                            className="block w-full rounded-md bg-indigo-600 py-2 px-4 text-white font-semibold shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Enviar Solicitud
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCertificationForm;