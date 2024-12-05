import React, { useState, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { formatRut } from '../middlewares/formatRut'
import { useValidateRoleAndAccessToken } from '../middlewares/validateRoleAndAccessToken';
import dayjs from 'dayjs';
import { FaClock, FaCheckCircle, FaTimesCircle, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const CertificadoMoveStatus = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedStatus, setSelectedStatus] = useState({});
    const [rejectionReasons, setRejectionReasons] = useState({});
    const [showRejectionReason, setShowRejectionReason] = useState({});
    const itemsPerPage = 10;
    const token = localStorage.getItem('token');
    const { themes } = useTheme();

    // Lista de motivos de rechazo
    const reasonOptions = [
        "No cumple con los requisitos mínimos",
        "Documentación incompleta",
        "Información incorrecta",
        "Fuera del plazo establecido",
        "Otros motivos"
    ];

    const statusConfig = {
        SOLICITADO: {
            icon: <FaClock size={20} className="text-yellow-500" />,
            label: 'Solicitado',
            textColor: 'text-yellow-500'
        },
        APROBADO: {
            icon: <FaCheckCircle size={20} className="text-green-500" />,
            label: 'Aprobado',
            textColor: 'text-green-500'
        },
        RECHAZADO: {
            icon: <FaTimesCircle size={20} className="text-red-500" />,
            label: 'Rechazado',
            textColor: 'text-red-500'
        }
    };

    const getStatusConfig = (status) => {
        const normalizedStatus = status?.toUpperCase();
        return statusConfig[normalizedStatus] || {
            icon: <FaClock size={20} className="text-gray-500" />,
            label: status || 'Desconocido',
            textColor: 'text-gray-500'
        };
    };

    useValidateRoleAndAccessToken(["1"], '/panel');

    const fetchRequests = useCallback(async () => {
        try {
            const response = await axios.get(`${BASE_URL}/certificados/list/admin/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const sortedRequests = response.data.sort((a, b) => b.id - a.id);
            return sortedRequests;
        } catch (error) {
            // Swal.fire({
            //     icon: 'error',
            //     title: 'Error',
            //     text: 'No se pudo cargar la lista de solicitudes.',
            //     confirmButtonColor: '#3085d6'
            // });
            throw error;
        }
    }, [token]);

    const handleStatusChange = async (requestId, rut, newStatus, currentStatus) => {
        if (!newStatus) return;

        // Actualizar el estado seleccionado
        setSelectedStatus(prev => ({
            ...prev,
            [requestId]: newStatus
        }));

        if (newStatus === 'RECHAZADO') {
            setShowRejectionReason(prev => ({ ...prev, [requestId]: true }));
            return;
        }

        try {
            const backendStatusMapping = {
                'APROBADO': 'APPROVED',
                'RECHAZADO': 'REJECTED'
            };

            const response = await axios.post(
                `${BASE_URL}/certificados/change/status/`,
                {
                    id: requestId,
                    rut: rut,
                    status: backendStatusMapping[newStatus]
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                setRequests(prev => prev.map(request =>
                    request.id === requestId ? { ...request, status: newStatus } : request
                ));

                await Swal.fire({
                    icon: 'success',
                    title: '¡Estado actualizado!',
                    text: 'El estado de la solicitud se ha actualizado correctamente.',
                    timer: 2000,
                    timerProgressBar: true
                });
            }
        } catch (error) {
            console.error('Error:', error);
            setSelectedStatus(prev => ({
                ...prev,
                [requestId]: currentStatus // Revertir al estado anterior en caso de error
            }));

            let errorMessage = 'No se pudo actualizar el estado de la solicitud.';
            if (error.response?.data?.error === 'Invalid status') {
                errorMessage = 'Estado inválido. Por favor, seleccione un estado válido.';
            } else if (error.response?.status === 404) {
                errorMessage = 'La solicitud no fue encontrada o no puede ser actualizada.';
            }

            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: errorMessage,
                timer: 2000,
                timerProgressBar: true
            });
        }
    };

    const handleRejectionReasonSubmit = async (requestId, rut) => {
        if (!rejectionReasons[requestId]) {
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Por favor, seleccione un motivo de rechazo.',
                confirmButtonColor: '#3085d6'
            });
            return;
        }

        try {
            const response = await axios.post(
                `${BASE_URL}/certificados/change/status/`,
                {
                    id: requestId,
                    rut: rut,
                    status: 'REJECTED',
                    rejection_reason: rejectionReasons[requestId]
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                setRequests(prev => prev.map(request =>
                    request.id === requestId ? { ...request, status: 'RECHAZADO' } : request
                ));
                setShowRejectionReason(prev => ({ ...prev, [requestId]: false }));

                await Swal.fire({
                    icon: 'success',
                    title: '¡Estado actualizado!',
                    text: 'El estado de la solicitud se ha actualizado correctamente.',
                    timer: 2000,
                    timerProgressBar: true
                });
            }
        } catch (error) {
            console.error('Error:', error);
            
        }
    };

    const getCurrentPageData = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return requests.slice(startIndex, endIndex);
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

    useEffect(() => {
        fetchRequests()
            .then(data => {
                if (Array.isArray(data)) {
                    setRequests(data);
                    setTotalPages(Math.ceil(data.length / itemsPerPage));
                } else {
                    throw new Error('Datos no son un array');
                }
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, [fetchRequests, itemsPerPage]); // Agregado itemsPerPage al dependency array

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-xl font-semibold">Cargando...</div>
            </div>
        );
    }

    return (
        <div className="flex-1 p-2 overflow-y-auto h-screen w-full mt-8" style={{ backgroundColor: themes.background }}>
                <h2 className="mb-8 text-center text-2xl font-bold leading-9 tracking-tight">
                    Gestionar Solicitudes de Certificado
                </h2>

                {requests.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-8 bg-gray-700 rounded-lg border-2 border-gray-600">
                        <FaCheckCircle size={50} className="text-gray-400 mb-4" />
                        <p className="text-xl text-gray-300 text-center font-medium">
                            No hay solicitudes pendientes de gestión
                        </p>
                        <p className="text-gray-400 text-center mt-2">
                            Cuando los usuarios realicen solicitudes, aparecerán aquí para su revisión
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="rounded-lg shadow-lg border-2 border-gray-600 mb-4">
                            <table className="min-w-full bg-gray-800 text-white">
                                <thead>
                                    <tr className="bg-gray-900 border border-gray-700">
                                        <th className="py-3 px-4 text-left font-semibold text-gray-200">N° Solicitud</th>
                                        <th className="py-3 px-4 text-left font-semibold text-gray-200">Nombres</th>
                                        <th className="py-3 px-4 text-left font-semibold text-gray-200">Rut</th>
                                        <th className="py-3 px-4 text-left font-semibold text-gray-200">Fecha Solicitud</th>
                                        <th className="py-3 px-4 text-left font-semibold text-gray-200">Relación</th>
                                        <th className="py-3 px-4 text-left font-semibold text-gray-200">Estado</th>
                                        <th className="py-3 px-4 text-left font-semibold text-gray-200">Acción</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-600">
                                    {getCurrentPageData().map((request) => (
                                        <tr key={request.id} className="hover:bg-gray-700 transition-colors">
                                            <td className="py-3 px-4 text-gray-300">{request.id.toString().padStart(4, '0')}</td>
                                            <td className="py-3 px-4 text-gray-300">{request.user}</td>
                                            <td className="py-3 px-4 text-gray-300">{formatRut(request.rut)}</td>
                                            <td className="py-3 px-4 text-gray-300">
                                                {dayjs(request.dateCreation).format('DD/MM/YYYY')}
                                            </td>
                                            <td className="py-3 px-4 text-gray-300">{request.relationship.toUpperCase()}</td>
                                            <td className="py-3 px-4 text-gray-300">
                                                <div className="flex items-center gap-2">
                                                    {getStatusConfig(request.status).icon}
                                                    <span className={`${getStatusConfig(request.status).textColor} font-medium`}>
                                                        {getStatusConfig(request.status).label}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="space-y-2">
                                                    <select
                                                        className="w-full px-3 py-2 border rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        value={selectedStatus[request.id] || ''}
                                                        onChange={(e) => handleStatusChange(request.id, request.rut, e.target.value, request.status)}
                                                    >
                                                        <option value="">Cambiar Estado</option>
                                                        <option value="APROBADO">Aprobado</option>
                                                        <option value="RECHAZADO">Rechazado</option>
                                                    </select>

                                                    {showRejectionReason[request.id] && (
                                                        <div className="space-y-2">
                                                            <select
                                                                className="w-full px-3 py-2 border rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                                                                value={rejectionReasons[request.id] || ''}
                                                                onChange={(e) => {
                                                                    setRejectionReasons(prev => ({
                                                                        ...prev,
                                                                        [request.id]: e.target.value
                                                                    }));
                                                                }}
                                                            >
                                                                <option value="">Seleccione motivo de rechazo</option>
                                                                {reasonOptions.map((reason, index) => (
                                                                    <option key={index} value={reason}>
                                                                        {reason}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                            <button
                                                                onClick={() => handleRejectionReasonSubmit(request.id, request.rut)}
                                                                className="w-full px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                                                            >
                                                                Confirmar Rechazo
                                                            </button>
                                                        </div>
                                                    )}
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
                            Página {currentPage} de {totalPages} | Total de solicitudes: {requests.length}
                        </div>
                    </>
                )}
            </div>
    );
};

export default CertificadoMoveStatus;