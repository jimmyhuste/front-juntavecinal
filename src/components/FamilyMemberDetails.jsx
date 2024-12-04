import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useValidateRoleAndAccessToken } from '../middlewares/validateRoleAndAccessToken';
import { useTheme } from '../context/ThemeContext';
import { jwtDecode } from 'jwt-decode';
import { formatRut } from '../middlewares/formatRut';
import { FaTrashAlt } from 'react-icons/fa';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const Loader = () => {
    return (
        <div className="flex justify-center items-center h-screen">
            <svg width="38" height="38" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" stroke="blue">
                <g fill="none" fillRule="evenodd">
                    <g transform="translate(1 1)" strokeWidth="2">
                        <circle strokeOpacity=".5" cx="18" cy="18" r="18"/>
                        <path d="M36 18c0-9.94-8.06-18-18-18">
                            <animateTransform
                                attributeName="transform"
                                type="rotate"
                                from="0 18 18"
                                to="360 18 18"
                                dur="1s"
                                repeatCount="indefinite"/>
                        </path>
                    </g>
                </g>
            </svg>
        </div>
    );
};

const FamilyMemberDetails = () => {
    const [user, setUser] = useState(null);
    const [familyMembers, setFamilyMembers] = useState([]);
    const [rut, setRut] = useState(null);
    const [loading, setLoading] = useState(true);
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

    const handleDeleteMember = (rutMember) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Una vez eliminado, no podrás recuperar este miembro de familia.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`${BASE_URL}/family/member/delete/`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        rut: rut,
                        rutMember: rutMember
                    }),
                })
                .then((response) => {
                    if (response.ok) {
                        setFamilyMembers(prevMembers => 
                            prevMembers.filter(member => member.rut !== rutMember)
                        );
                        Swal.fire('¡Eliminado!', 'El miembro ha sido eliminado con éxito.', 'success');
                    } else {
                        Swal.fire('Error', 'No se pudo eliminar el miembro.', 'error');
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                    Swal.fire('Error', 'Hubo un problema al eliminar el miembro.', 'error');
                });
            }
        });
    };

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
            setLoading(true);
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
        } finally {
            setLoading(false);
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
        }
    };

    if (loading) {
        return <Loader />;
    }

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
                                value={user.phoneNumber}
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
                    <Loader />
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
                                    <th className="py-3 px-4 text-left font-semibold border border-gray-700 text-gray-200">Acciones</th>
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
                                        <td className="py-3 px-4 border border-gray-700 text-gray-300 text-center">
                                            <div className="flex justify-center">
                                                <button
                                                    title={member.relationship.toUpperCase() === 'JEFE HOGAR' ? "No puedes eliminar al jefe de hogar" : "Delete"}
                                                    className={`${member.relationship.toUpperCase() === 'JEFE HOGAR'
                                                            ? 'text-gray-500'
                                                            : 'text-red-600 hover:text-red-500'
                                                        }`}
                                                    onClick={() => member.relationship.toUpperCase() !== 'JEFE HOGAR' && handleDeleteMember(member.rut)}
                                                    disabled={member.relationship.toUpperCase() === 'JEFE HOGAR'}
                                                >
                                                    <FaTrashAlt className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </td>
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