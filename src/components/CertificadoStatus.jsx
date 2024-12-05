import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useValidateRoleAndAccessToken } from '../middlewares/validateRoleAndAccessToken';
import dayjs from 'dayjs';
import { FaClock, FaCheckCircle, FaTimesCircle, FaDownload, FaExclamationCircle, FaEye } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import {formatRut} from '../middlewares/formatRut';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const BASE_URL = process.env.REACT_APP_BASE_URL;
const CertificadoStatus = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [previewUrl, setPreviewUrl] = useState('');
    const [loadingPdf, setLoadingPdf] = useState(false);
    const [currentCertificateId, setCurrentCertificateId] = useState(null);
    const token = localStorage.getItem('token');
    const { themes } = useTheme();

    const modalStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '60%',
            height: '80%',
            padding: '20px',
            backgroundColor: '#1F2937',
            border: '2px solid #4B5563',
            borderRadius: '0.5rem',
        },
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            zIndex: 1000,
        }
    };

    useValidateRoleAndAccessToken(["1", "2"], '/login');

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

    const actionConfig = {
        download: {
            icon: <FaDownload size={20} className="text-green-500" />,
            label: '',
            textColor: 'text-green-500'
        },
        preview: {
            icon: <FaEye size={20} className="text-blue-500" />,
            label: '',
            textColor: 'text-blue-500'
        },
        rejection: {
            icon: <FaExclamationCircle size={20} className="text-red-500" />,
            label: 'Motivo',
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

    const handlePreview = async (certificateId) => {
        try {
            setLoadingPdf(true);
            setIsModalOpen(true);
            setCurrentCertificateId(certificateId);
            
            const response = await axios({
                url: `${BASE_URL}/get/certificate/?id=${certificateId}`,
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                responseType: 'arraybuffer'
            });

            const blob = new Blob([response.data], { 
                type: 'application/pdf'
            });
            
            const blobUrl = window.URL.createObjectURL(blob);
            setPreviewUrl(blobUrl);
            
        } catch (error) {
            console.error('Error al cargar el preview:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo cargar la vista previa del certificado.',
                timer: 2000,
                timerProgressBar: true
            });
            setIsModalOpen(false);
        } finally {
            setLoadingPdf(false);
        }
    };

    const handleDownload = async (certificateId) => {
        try {
            const response = await axios({
                url: `${BASE_URL}/get/certificate/?id=${certificateId}`,
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                responseType: 'arraybuffer'
            });

            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `certificado-${dayjs(Date.now()).format('DD-MM-YYYY-HH-mm-ss')}.pdf`);
            document.body.appendChild(link);
            link.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(link);

            Swal.fire({
                icon: 'success',
                title: '¡Descarga exitosa!',
                text: 'El certificado se ha descargado correctamente.',
                timer: 2000,
                timerProgressBar: true
            });

        } catch (error) {
            console.error('Error al descargar:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo descargar el certificado. Por favor intente nuevamente.',
                timer: 2000,
                timerProgressBar: true
            });
        }
    };

    const handleModalDownload = () => {
        if (currentCertificateId) {
            handleDownload(currentCertificateId);
        }
    };

    const handleShowRejectionReason = (reason) => {
        Swal.fire({
            title: 'Motivo de Rechazo',
            text: reason || 'No se especificó un motivo',
            icon: 'info',
            iconColor: '#ef4444',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#3b82f6',
            showClass: {
                popup: 'swal2-show',
                backdrop: 'swal2-backdrop-show'
            },
            hideClass: {
                popup: 'swal2-hide',
                backdrop: 'swal2-backdrop-hide'
            }
        });
    };

    const handleCloseModal = () => {
        if (previewUrl) {
            window.URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl('');
        setIsModalOpen(false);
    };

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                setLoading(true);
                const decodedToken = jwtDecode(token);
                const rut = decodedToken.rut;
    
                const response = await axios.get(`${BASE_URL}/certificados/list/user/?rut=${rut}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
    
                const threeMonthsAgo = dayjs().subtract(3, 'month');
                const filteredAndSortedRequests = response.data
                    .filter(request => dayjs(request.dateCreation).isAfter(threeMonthsAgo))
                    .sort((a, b) => b.id - a.id);
    
                setRequests(filteredAndSortedRequests);
            } catch (error) {
                console.error('Error al obtener solicitudes:', error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchRequests();
    }, [token]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-xl font-semibold">Cargando...</div>
            </div>
        );
    }

    return (
        <div className="flex-1 p-6 overflow-y-auto h-screen w-full mt-8" style={{ backgroundColor: themes.background }}>
                <h2 className="mb-8 text-center text-2xl font-bold leading-9 tracking-tight">
                    Estado de Mis Solicitudes
                </h2>
                {requests.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-8 bg-gray-700 rounded-lg border-2 border-gray-600">
                        <FaClock size={50} className="text-gray-400 mb-4" />
                        <p className="text-xl text-gray-300 text-center font-medium">
                            No hay solicitudes de certificados registradas
                        </p>
                        <p className="text-gray-400 text-center mt-2">
                            Las solicitudes que realices aparecerán aquí
                        </p>
                    </div>
                ) : (
                    <div className="rounded-lg shadow-lg border-2 border-gray-600">
                        <table className="min-w-full bg-gray-800 text-white">
                            <thead>
                                <tr className="bg-gray-900 border border-gray-700">
                                    <th className="py-3 px-4 text-left font-semibold text-gray-200">N° Solicitud</th>
                                    <th className="py-3 px-4 text-left font-semibold text-gray-200">Nombres</th>
                                    <th className="py-3 px-4 text-left font-semibold text-gray-200">Rut</th>
                                    <th className="py-3 px-4 text-left font-semibold text-gray-200">Fecha Solicitud</th>
                                    <th className="py-3 px-4 text-left font-semibold text-gray-200">Relación</th>
                                    <th className="py-3 px-4 text-left font-semibold text-gray-200">Tipo Certificado</th>
                                    <th className="py-3 px-4 text-left font-semibold text-gray-200">Estado</th>
                                    <th className="py-3 px-4 text-left font-semibold text-gray-200">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-600">
                                {requests.map((request) => (
                                    <tr key={request.id} className="hover:bg-gray-700 transition-colors">
                                        <td className="py-3 px-4 text-gray-300">{request.id.toString().padStart(4, '0')}</td>
                                        <td className="py-3 px-4 text-gray-300">{request.user}</td>
                                        <td className="py-3 px-4 text-gray-300">{formatRut(request.rut)}</td>
                                        <td className="py-3 px-4 text-gray-300">
                                            {dayjs(request.dateCreation).format('DD/MM/YYYY')}
                                        </td>
                                        <td className="py-3 px-4 text-gray-300">{request.relationship.toUpperCase()}</td>
                                        <td className="py-3 px-4 text-gray-300">{request.typeCertificate}</td>
                                        <td className="py-3 px-4 text-gray-300">
                                            <div className="flex items-center gap-2">
                                                {getStatusConfig(request.status).icon}
                                                <span className={`${getStatusConfig(request.status).textColor} font-medium`}>
                                                    {getStatusConfig(request.status).label}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-gray-300">
                                            <div className="flex items-center gap-4">
                                                {request.status.toUpperCase() === 'APROBADO' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleDownload(request.id)}
                                                            className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity"
                                                        >
                                                            {actionConfig.download.icon}
                                                            <span>{actionConfig.download.label}</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handlePreview(request.id)}
                                                            className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity"
                                                        >
                                                            {actionConfig.preview.icon}
                                                            <span>{actionConfig.preview.label}</span>
                                                        </button>
                                                    </>
                                                )}
                                                {request.status.toUpperCase() === 'RECHAZADO' && (
                                                    <button
                                                        onClick={() => handleShowRejectionReason(request.rejection_reason)}
                                                        className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity"
                                                    >
                                                        {actionConfig.rejection.icon}
                                                        <span>{actionConfig.rejection.label}</span>
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

            <Modal
                isOpen={isModalOpen}
                onRequestClose={handleCloseModal}
                style={modalStyles}
                contentLabel="PDF Preview"
            >
                <div className="flex flex-col h-full">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-white">Vista previa del certificado</h2>
                        <button
                            onClick={handleCloseModal}
                            className="text-gray-300 hover:text-white"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="flex-1 bg-white rounded-lg overflow-hidden">
                        {loadingPdf ? (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-lg font-semibold">Cargando PDF...</p>
                            </div>
                        ) : previewUrl && (
                            <iframe
                                src={previewUrl}
                                type="application/pdf"
                                width="100%"
                                height="100%"
                                className="h-full min-h-[500px]"
                                title="PDF Preview"
                            />
                        )}
                    </div>
                    {previewUrl && !loadingPdf && (
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={handleModalDownload}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                            >
                                <FaDownload size={16} />
                                <span>Descargar PDF</span>
                            </button>
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default CertificadoStatus;