import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useValidateRoleAndAccessToken } from '../middlewares/validateRoleAndAccessToken';
import { useTheme } from '../context/ThemeContext';
import { jwtDecode } from 'jwt-decode';
import {formatRut} from '../middlewares/formatRut'


const BASE_URL = process.env.REACT_APP_BASE_URL;

const FamilyMemberDetails = () => {
    const [user, setUser] = useState(null);
    const [familyMembers, setFamilyMembers] = useState([]);
    const [rut, setRut] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useValidateRoleAndAccessToken(['1', '2']);
    const { themes } = useTheme();

    useEffect(() => {
        try {
            if (token) {
                const decodedToken = jwtDecode(token);
                setRut(decodedToken.rut);
            }
        } catch (error) {
            console.error('Error al decodificar el token:', error);
            navigate('/login');
        }
    }, []);

    useEffect(() => {
        if (rut) {
            fetchUserDetails();
            fetchFamilyMembers();
        }
    }, [rut]);

    const getRoleName = (role) => {
        switch (role) {
            case 1:
                return 'Admin';
            case 2:
                return 'Miembro';
            default:
                return role;
        }
    };

    const fetchUserDetails = async () => {
        try {
            const response = await fetch(`${BASE_URL}/user/list/one/?rut=${rut}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            if (!response.ok) {
                throw new Error('Error en la solicitud');
            }

            const data = await response.json();
            setUser(data);
        } catch (error) {
            console.error('Error:', error);
            Swal.fire('Error', 'No se pudieron obtener los detalles del usuario.', 'error');
            navigate('/panel');
        }
    };

    const fetchFamilyMembers = async () => {
        try {
            const response = await fetch(`${BASE_URL}/miembros/familia/?rut=${rut}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            if (!response.ok) {
                throw new Error('Error en la solicitud de miembros de familia');
            }

            const data = await response.json();
            setFamilyMembers(data);
        } catch (error) {
            console.error('Error:', error);
            //Swal.fire('Error', 'No se pudieron obtener los miembros de la familia.', 'error');
        }
    };

    return (
        <div className="w-full h-screen bg-gray-100" style={{ backgroundColor: themes.background, color: themes.text }}>
            <div className="w-4/5 mx-auto px-4 py-8">
                <div className="w-full text-center">
                    <h1 className="text-4xl font-bold mb-6" style={{ color: themes.text }}>Detalles del Usuario</h1>
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
                                value={getRoleName(user.role)}
                                disabled
                                className="bg-gray-700 text-white p-2 rounded-lg border border-gray-600 focus:outline-none"
                            />
                        </div>
                    </form>
                ) : (
                    <p className="text-gray-400">Cargando detalles del usuario...</p>
                )}

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

export default FamilyMemberDetails;