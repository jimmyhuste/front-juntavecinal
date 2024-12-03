import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { FaEye, FaEdit, FaTrashAlt, FaChevronLeft, FaChevronRight, FaFileExcel } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { useValidateRoleAndAccessToken } from '../middlewares/validateRoleAndAccessToken';
import { useTheme } from '../context/ThemeContext';
import { formatRut } from '../middlewares/formatRut';
import * as XLSX from 'xlsx';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const ViewUser = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 10;
    const token = localStorage.getItem('token');
    const { themes } = useTheme();

    useValidateRoleAndAccessToken(["1"], '/panel');

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${BASE_URL}/users/list/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Error en la respuesta de la API');
            }

            const data = await response.json();
            if (Array.isArray(data)) {
                setUsers(data);
                setTotalPages(Math.ceil(data.length / itemsPerPage));
            } else {
                console.error('La respuesta no es un array:', data);
            }
            setLoading(false);
        } catch (error) {
            console.error("Error al cargar la data de los usuarios:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const getCurrentPageData = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return users.slice(startIndex, endIndex);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
    };

    const handleDelete = (rut) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Una vez eliminado, no podrás recuperar este usuario.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`${BASE_URL}/user/delete/`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({ rut }),
                })
                    .then((response) => {
                        if (response.ok) {
                            const updatedUsers = users.filter(user => user.rut !== rut);
                            setUsers(updatedUsers);
                            setTotalPages(Math.ceil(updatedUsers.length / itemsPerPage));
                            Swal.fire('Eliminado!', 'El usuario ha sido eliminado.', 'success');
                        } else {
                            Swal.fire('Error', 'No se pudo eliminar el usuario.', 'error');
                        }
                    })
                    .catch(() => {
                        Swal.fire('Error', 'Hubo un problema con la solicitud.', 'error');
                    });
            }
        });
    };

    const exportToExcel = () => {
        // Preparar los datos para Excel
        const dataToExport = users.map(user => ({
            'Nombre Completo': `${user.firstName} ${user.lastName} ${user.motherLastName}`,
            'RUT': formatRut(user.rut),
            'Correo': user.email,
            'Rol': user.role === 1 ? 'Admin' : 'Miembro'
        }));

        // Crear el libro de trabajo y la hoja
        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Usuarios");

        // Generar el archivo y descargarlo
        XLSX.writeFile(wb, "Usuarios.xlsx");
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-xl font-semibold">Cargando...</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4" style={{ backgroundColor: themes.background, color: themes.text }}>
            <div className="flex justify-between items-center mb-2">
                <h1 className="text-2xl font-bold" style={{ color: themes.text }}>Listado de Usuarios</h1>
                <div className="flex gap-4">
                    <button
                        onClick={exportToExcel}
                        className="bg-green-800 text-white font-bold py-2 px-4 rounded mt-4 hover:bg-green-700 flex items-center gap-2"
                    >
                        <FaFileExcel />
                        Exportar a Excel
                    </button>
                    <NavLink
                        to="/register"
                        className="bg-gray-800 text-white font-bold py-2 px-4 rounded mt-4 text-center hover:bg-gray-700"
                    >
                        Agregar Usuario
                    </NavLink>
                </div>
            </div>

    

            <div className="overflow-x-auto rounded-lg shadow-lg border-2 border-gray-600">
                <table className="min-w-full bg-gray-800 text-white">
                    <thead>
                        <tr className="bg-gray-900 border border-gray-700">
                            <th className="py-3 px-4 text-left font-semibold text-gray-200">Nombre Completo</th>
                            <th className="py-3 px-4 text-left font-semibold text-gray-200">Rut</th>
                            <th className="py-3 px-4 text-left font-semibold text-gray-200">Correo</th>
                            <th className="py-3 px-4 text-left font-semibold text-gray-200">Rol</th>
                            <th className="py-3 px-4 text-left font-semibold text-gray-200">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-600">
                        {getCurrentPageData().map((user, index) => (
                            <tr key={index} className="hover:bg-gray-700 transition-colors">
                                <td className="py-3 px-4 text-gray-300">{`${user.firstName} ${user.lastName}`} </td>
                                <td className="py-3 px-4 text-gray-300">{formatRut(user.rut)}</td>
                                <td className="py-3 px-4 text-gray-300">{user.email}</td>
                                <td className="py-3 px-4 text-gray-300">{user.role === 1 ? 'Admin' : 'Miembro'}</td>
                                <td className="py-3 px-4 text-gray-300">
                                    <div className="flex justify-around">
                                        <NavLink to={`/user/${user.rut}/details`} title="View Details" className="text-blue-400 hover:text-blue-300 mx-0.5">
                                            <FaEye className="h-5 w-5" />
                                        </NavLink>
                                        <NavLink to={`/user/${user.rut}/edit`} title="Edit" className="text-green-500 hover:text-green-400 mx-0.5">
                                            <FaEdit className="h-5 w-5" />
                                        </NavLink>

                                        <button
                                            title={user.role === 1 ? "No puedes eliminar a un administrador" : "Delete"}
                                            className={`mx-0.5 ${user.role === 1
                                                    ? 'text-gray-400 cursor-not-allowed'
                                                    : 'text-red-600 hover:text-red-500'
                                                }`}
                                            onClick={() => user.role !== 1 && handleDelete(user.rut)}
                                            disabled={user.role === 1}
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

            <div className="flex justify-center items-center space-x-2 mt-4">
                <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className={`px-3 py-2 rounded-md ${currentPage === 1
                        ? 'bg-gray-600 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                        } text-white flex items-center`}
                >
                    <FaChevronLeft className="mr-1" />
                    Anterior
                </button>

                <div className="flex space-x-1">
                    {getPageNumbers().map(page => (
                        <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-4 py-2 rounded-md ${currentPage === page
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                        >
                            {page}
                        </button>
                    ))}
                </div>

                <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-2 rounded-md ${currentPage === totalPages
                        ? 'bg-gray-600 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                        } text-white flex items-center`}
                >
                    Siguiente
                    <FaChevronRight className="ml-1" />
                </button>
            </div>

            <div className="text-center mt-2 text-gray-400">
                Página {currentPage} de {totalPages} | Total de usuarios: {users.length}
            </div>
        </div>
    );
};

export default ViewUser;