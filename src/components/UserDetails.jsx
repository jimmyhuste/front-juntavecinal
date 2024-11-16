import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useValidateRoleAndAccessToken } from '../middlewares/validateRoleAndAccessToken';
import { useTheme } from '../context/ThemeContext';
import {formatRut} from '../middlewares/formatRut'


const BASE_URL = process.env.REACT_APP_BASE_URL;

export const UserDetails = () => {
    const { rut } = useParams();
    const [user, setUser] = useState(null);
    const [familyMembers, setFamilyMembers] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    // Middleware para validar el rol y el token
    useValidateRoleAndAccessToken(["1"]);

    const { themes } = useTheme();
    useEffect(() => {
        fetchUserDetails();
        fetchFamilyMembers();
    }, [rut]);

    const fetchUserDetails = () => {
        fetch(`${BASE_URL}/user/list/one/?rut=${rut}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la solicitud');
                }
                return response.json();
            })
            .then(data => {
                setUser(data);
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire('Error', 'No se pudieron obtener los detalles del usuario.', 'error');
                navigate('/panel');
            });
    };

    const fetchFamilyMembers = () => {
        fetch(`${BASE_URL}/miembros/familia/?rut=${rut}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la solicitud de miembros de familia');
                }
                return response.json();
            })
            .then(data => {
                setFamilyMembers(data);
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire('Error', 'No se pudieron obtener los miembros de la familia.', 'error');
            });
    };

    return (
        <div className="w-full h-screen bg-gray-100" style={{ backgroundColor: themes.background, color: themes.text }}>
            <div className="w-4/5 mx-auto px-4 py-8">
                <div className="flex items-center mb-6">
                    <NavLink
                        to="/panel"
                        className="inline-flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                        Volver
                    </NavLink>
                    <div className="w-full text-center">
                        <h1 className="text-4xl font-bold mb-6" style={{ color: themes.text }}>Detalles del Usuario</h1>
                    </div>
                </div>
                {user ? (
                    <form className="bg-gray-800 text-white rounded-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col">
                            <label className="mb-1 text-gray-400 font-semibold">Nombre</label>
                            <input
                                type="text"
                                value={user.firstName}
                                disabled
                                className="bg-gray-700 text-white p-2 rounded-lg border border-gray-600 focus:outline-none"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="mb-1 text-gray-400 font-semibold">Rut</label>
                            <input
                                type="text"
                                value={formatRut(user.rut)}
                                disabled
                                className="bg-gray-700 text-white p-2 rounded-lg border border-gray-600 focus:outline-none"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="mb-1 text-gray-400 font-semibold">Email</label>
                            <input
                                type="email"
                                value={user.email}
                                disabled
                                className="bg-gray-700 text-white p-2 rounded-lg border border-gray-600 focus:outline-none"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="mb-1 text-gray-400 font-semibold">Teléfono</label>
                            <input
                                type="text"
                                value={user.phone}
                                disabled
                                className="bg-gray-700 text-white p-2 rounded-lg border border-gray-600 focus:outline-none"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="mb-1 text-gray-400 font-semibold">Dirección</label>
                            <input
                                type="text"
                                value={user.address}
                                disabled
                                className="bg-gray-700 text-white p-2 rounded-lg border border-gray-600 focus:outline-none"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="mb-1 text-gray-400 font-semibold">Rol</label>
                            <input
                                type="text"
                                value={user.role}
                                disabled
                                className="bg-gray-700 text-white p-2 rounded-lg border border-gray-600 focus:outline-none"
                            />
                        </div>
                    </form>
                ) : (
                    <p className="text-gray-400">Cargando detalles del usuario...</p>
                )}

                {/* Tabla para los miembros de familia */}
                <div className="w-full text-center">
                    <h2 className="text-2xl font-bold mb-6 mt-8" style={{ color: themes.text }}>Integrantes de la Familia</h2>
                </div>
                <hr className="border-t-2 border-gray-400 my-6" />

                {familyMembers.length > 0 ? (
                    <div className="overflow-x-auto rounded-lg shadow-lg">
                        <table className="min-w-full bg-gray-800 text-white">
                            <thead>
                                <tr className="bg-gray-900">
                                    <th className="py-3 px-4 text-left font-semibold border border-gray-700 text-gray-200">Rut</th>
                                    <th className="py-3 px-4 text-left font-semibold border border-gray-700 text-gray-200">Nombre</th>
                                    <th className="py-3 px-4 text-left font-semibold border border-gray-700 text-gray-200">Apellido</th>
                                    <th className="py-3 px-4 text-left font-semibold border border-gray-700 text-gray-200">Relación</th>
                                    <th className="py-3 px-4 text-left font-semibold border border-gray-700 text-gray-200">N° Familia</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {familyMembers.map((member, index) => (
                                    <tr key={index} className="hover:bg-gray-700 transition-colors">
                                        <td className="py-3 px-4 border border-gray-700 text-gray-300">{formatRut(member.rut)}</td>
                                        <td className="py-3 px-4 border border-gray-700 text-gray-300">{member.firstName}</td>
                                        <td className="py-3 px-4 border border-gray-700 text-gray-300">{member.lastName}</td>
                                        <td className="py-3 px-4 border border-gray-700 text-gray-300">{member.relationship}</td>
                                        <td className="py-3 px-4 border border-gray-700 text-gray-300">{member.family.toString().padStart(4, '0')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-800">No se encontraron miembros de la familia.</p>
                )}
            </div>
        </div>

    );
};
