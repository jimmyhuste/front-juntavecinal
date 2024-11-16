import React, { useState } from 'react';
import {
    FaQuestionCircle, FaChevronDown, FaChevronUp, FaBook, FaUserCircle,
    FaFileAlt, FaNewspaper, FaUsers, FaHandshake, FaPhone, FaEnvelope,
    FaMapMarkerAlt, FaClock, FaIdCard, FaHome, FaExclamationCircle,
    FaHourglassHalf, FaBullhorn
} from 'react-icons/fa';

const Help = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const faqs = [
        {
            question: "¿Cuáles son los tiempos de respuesta para las solicitudes?",
            answer: "Acceso al sistema:\n\n" +
                    "• Sistema disponible las 24 horas del día\n" +
                    "• Acceso ininterrumpido a consultas y solicitudes\n" +
                    "• Plataforma web siempre disponible\n\n" +
                    "Tiempos de frocesamiento:\n\n" +
                    "• Ingreso de solicitud: Inmediato y automatizado\n" +
                    "• Primera revisión: Día hábil\n" +
                    "• Tiempo de respuesta máximo: 48 horas hábiles\n\n" +
                    "Horarios de procesamiento:\n\n" +
                    "• Lunes a Viernes: 9:00 - 18:00 hrs\n" +
                    "• Solicitudes después de las 15:00: Siguiente día hábil\n" +
                    "• Fines de semana y festivos no son días hábiles\n\n" +
                    "Importante: Las solicitudes urgentes deben ser notificadas directamente a la directiva durante horario hábil para su priorización.\n\n",
            icon: <FaHourglassHalf className="text-2xl text-blue-500" />
        },
        {
            question: "¿Cuáles son los requisitos para solicitar un certificado de residencia?",
            answer: "Requisitos fundamentales:\n\n" +
                    "• Ser mayor de 18 años\n" +
                    "• Residir en la comuna de la unidad vecinal\n" +
                    "• Estar registrado y validado en el sistema\n" +
                    "• Tener dirección verificada\n\n" +
                    "Documentos necesarios:\n\n" +
                    "• Cédula de identidad vigente\n\n" +
                    "Importante: La directiva verificará toda la información antes de aprobar la solicitud.\n\n",
            icon: <FaIdCard className="text-2xl text-blue-500" />
        },
        {
            question: "¿Qué documentos necesito para registrarme en el sistema?",
            answer: "Documentos obligatorios:\n\n" +
                    "• Cédula de identidad vigente\n\n" +
                    "Requisitos adicionales:\n\n" +
                    "• Ser familiar de un miembro registrado en el sistema\n" +
                    "• Ser residente de la comuna\n" +
                    "• Email válido\n" +
                    "• Teléfono de contacto\n\n",
            icon: <FaUserCircle className="text-2xl text-blue-500" />
        },
        {
            question: "¿Cómo mantengo actualizada mi información personal?",
            answer: "Pasos para actualización:\n\n" +
                    "• Acceder a 'Mi Perfil'\n" +
                    "• Revisar información actual\n" +
                    "• Modificar datos necesarios\n" +
                    "• Guardar cambios\n\n" +
                    "Datos importantes a mantener actualizados:\n\n" +
                    "• Dirección actual\n" +
                    "• Teléfono de contacto\n" +
                    "• Correo electrónico\n" +
                    "• Composición familiar\n\n" +
                    "Importante: Algunos cambios pueden requerir verificación adicional.\n\n",
            icon: <FaUsers className="text-2xl text-blue-500" />
        },
        {
            question: "¿Cómo funciona el sistema de noticias y anuncios?",
            answer: "Tipos de publicaciones:\n\n" +
                    "• Noticias urgentes\n" +
                    "• Información general\n" +
                    "• Eventos comunitarios\n\n",
            icon: <FaNewspaper className="text-2xl text-blue-500" />
        },
        {
            question: "¿Qué hacer si mi solicitud es rechazada?",
            answer: "Pasos a seguir:\n\n" +
                    "• Revisar motivo del rechazo\n" +
                    "• Verificar requisitos\n" +
                    "• Corregir información\n" +
                    "• Realizar nueva solicitud\n\n" +
                    "Causas comunes de rechazo:\n\n" +
                    "• Documentación incompleta\n" +
                    "• Datos desactualizados\n" +
                    "• Dirección fuera del territorio\n\n" +
                    "Importante: Contactar a la directiva para casos especiales.\n\n",
            icon: <FaExclamationCircle className="text-2xl text-blue-500" />
        }
    ];

    const renderAnswer = (content) => {
        return (
            <div className="space-y-4">
                {content.split('\n\n').map((section, idx) => {
                    if (section.startsWith('•')) {
                        return (
                            <div key={idx} className="border-l-4 border-blue-500 pl-4">
                                <ul className="list-disc pl-4 space-y-2">
                                    {section.split('\n').map((item, i) => (
                                        <li key={i} className="text-gray-300">{item.replace('•', '').trim()}</li>
                                    ))}
                                </ul>
                            </div>
                        );
                    }
                    if (section.includes(':') && !section.startsWith('•')) {
                        const [title, ...content] = section.split(':');
                        return (
                            <div key={idx} className="mb-4">
                                <h4 className="text-blue-400 font-semibold mb-2">{title}:</h4>
                                <div className="border-l-4 border-blue-500 pl-4">
                                    <p className="text-gray-300">{content.join(':')}</p>
                                </div>
                            </div>
                        );
                    }
                    if (section.startsWith('Importante:')) {
                        return (
                            <div key={idx} className="border-l-4 border-yellow-500 pl-4 bg-yellow-900/30 p-4 rounded-r">
                                <h4 className="text-yellow-500 font-bold mb-2">Importante:</h4>
                                <p className="text-gray-300">{section.replace('Importante:', '').trim()}</p>
                            </div>
                        );
                    }
                    return (
                        <div key={idx} className="border-l-4 border-blue-500 pl-4">
                            <p className="text-gray-300">{section}</p>
                        </div>
                    );
                })}
            </div>
        );
    };

    const contactInfo = [
        {
            icon: <FaPhone className="text-3xl text-blue-400" />,
            title: "Teléfono",
            info: "+56 2 2345 6789",
            description: "Lunes a Viernes"
        },
        {
            icon: <FaEnvelope className="text-3xl text-blue-400" />,
            title: "Email",
            info: "ayuda@juntavecinos.cl",
            description: "Respuesta en 24hrs"
        },
        {
            icon: <FaMapMarkerAlt className="text-3xl text-blue-400" />,
            title: "Dirección",
            info: "Av. Principal #123",
            description: "Pudahuel, Santiago"
        },
        {
            icon: <FaClock className="text-3xl text-blue-400" />,
            title: "Horario",
            info: "9:00 - 18:00",
            description: "Días hábiles"
        }
    ];

    return (
        <div className="flex-1 p-6 overflow-y-auto h-screen w-full">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg p-8 text-white shadow-xl">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-blue-500/20 rounded-full">
                            <FaBook className="text-4xl text-blue-400" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Centro de Ayuda</h1>
                            <p className="text-gray-300">
                                Encuentra toda la información sobre los servicios de la Junta de Vecinos
                            </p>
                        </div>
                    </div>
                </div>

                {/* Banner de Disponibilidad */}
                <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-4">
                            <div className="bg-green-500 p-3 rounded-full">
                                <FaClock className="text-3xl" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold tracking-wide">
                                    <span className="border-b-2 border-green-400">Sistema Disponible 24/7</span>
                                </h3>
                                <p className="text-green-100 mt-1">Realiza tus solicitudes en cualquier momento</p>
                            </div>
                        </div>
                        <div className="bg-green-800 px-6 py-3 rounded-lg shadow-md">
                            <div className="text-center">
                                <span className="block font-bold text-lg">Procesamiento</span>
                                <span className="block text-green-200">Días hábiles</span>
                                <span className="text-xl font-mono">9:00 - 18:00</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-white">
                        <FaQuestionCircle className="text-blue-500" />
                        <span className="relative">
                            Preguntas Frecuentes
                            <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-500 rounded-full"></span>
                        </span>
                    </h2>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="border border-gray-700 rounded-lg overflow-hidden transition-all duration-200"
                            >
                                <button
                                    className={`w-full px-6 py-4 text-left flex items-center justify-between
                                              transition-colors duration-200
                                              ${activeIndex === index ?
                                            'bg-gray-700 shadow-lg' :
                                            'bg-gray-800 hover:bg-gray-700'}`}
                                    onClick={() => toggleFAQ(index)}
                                >
                                    <div className="flex items-center gap-4">
                                        {faq.icon}
                                        <span className="font-medium text-white">
                                            <span className="border-b-2 border-transparent hover:border-blue-500 transition-colors">
                                                {faq.question}
                                            </span>
                                        </span>
                                    </div>
                                    {activeIndex === index ?
                                        <FaChevronUp className="text-blue-400" /> :
                                        <FaChevronDown className="text-gray-400" />
                                    }
                                </button>

                                {activeIndex === index && (
                                    <div className="px-6 py-4 bg-gray-700/50">
                                        {renderAnswer(faq.answer)}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact Section */}
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg p-8">
                    <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-white">
                        <FaBullhorn className="text-blue-500" />
                        <span className="relative">
                            Información de Contacto
                            <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-500 rounded-full"></span>
                        </span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {contactInfo.map((contact, index) => (
                            <div key={index}
                                className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg p-6 
                                         hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                <div className="bg-blue-500/10 p-4 rounded-full w-fit mb-4">
                                    {contact.icon}
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">{contact.title}</h3>
                                <p className="text-gray-300">{contact.info}</p>
                                <p className="text-sm text-gray-400">{contact.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer Section con información adicional */}
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-white mb-3">Horarios de Atención Presencial</h3>
                            <p className="text-gray-300">Lunes a Viernes: 9:00 - 18:00</p>
                            <p className="text-gray-300">Sábados: 9:00 - 13:00</p>
                            <p className="text-gray-400 text-sm">Cerrado en festivos</p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-white mb-3">Recordatorios Importantes</h3>
                            <ul className="list-disc list-inside text-gray-300 space-y-1">
                                <li>Mantén tus datos actualizados</li>
                                <li>Revisa el estado de tus solicitudes regularmente</li>
                                <li>Guarda los números de seguimiento</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Help;