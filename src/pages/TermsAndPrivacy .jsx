import React, { useState } from 'react';
import { FaShieldAlt, FaUserLock, FaFileContract, FaUsersCog, FaExclamationTriangle, 
         FaCheck, FaHandshake, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const TermsAndPrivacy = () => {
    const [activeSection, setActiveSection] = useState(null);

    const toggleSection = (index) => {
        setActiveSection(activeSection === index ? null : index);
    };

    const sections = [
        {
            title: "Política de Privacidad",
            icon: <FaUserLock className="text-2xl text-blue-500" />,
            content: "Protección de datos personales:\n\n" +
                    "• Cumplimiento con la Ley 19.628 sobre Protección de Datos Personales\n" +
                    "• Tratamiento confidencial de información personal\n" +
                    "• Almacenamiento seguro de datos\n" +
                    "• No compartimos información con terceros\n\n" +
                    "Datos que recopilamos:\n\n" +
                    "• Nombre completo y RUT\n" +
                    "• Dirección de residencia\n" +
                    "• Información de contacto\n" +
                    "• Composición familiar\n\n" +
                    "Uso de la información:\n\n" +
                    "• Verificación de identidad\n" +
                    "• Gestión de solicitudes\n" +
                    "• Comunicación oficial\n" +
                    "• Estadísticas internas\n\n" +
                    "Importante: Tu información solo será utilizada para fines de la Junta de Vecinos."
        },
        {
            title: "Términos de Uso",
            icon: <FaFileContract className="text-2xl text-blue-500" />,
            content: "Condiciones generales:\n\n" +
                    "• Uso exclusivo para residentes de la unidad vecinal\n" +
                    "• Acceso personal e intransferible\n" +
                    "• Responsabilidad del usuario sobre su cuenta\n" +
                    "• Uso apropiado del sistema\n\n" +
                    "Restricciones:\n\n" +
                    "• Prohibido compartir credenciales\n" +
                    "• No usar para fines comerciales\n" +
                    "• No proporcionar información falsa\n" +
                    "• No realizar solicitudes fraudulentas\n\n" +
                    "Importante: El incumplimiento puede resultar en la suspensión del servicio."
        },
        {
            title: "Derechos del Usuario",
            icon: <FaHandshake className="text-2xl text-blue-500" />,
            content: "Derechos fundamentales:\n\n" +
                    "• Acceso a información personal\n" +
                    "• Rectificación de datos incorrectos\n" +
                    "• Cancelación de cuenta\n" +
                    "• Oposición al tratamiento de datos\n" +
                    "• Baneo de cuenta\n\n" +
                    "Solicitudes y reclamos:\n\n" +
                    "• Derecho a presentar reclamos\n" +
                    "• Respuesta en máximo 48 horas hábiles\n" +
                    "• Proceso de apelación disponible\n\n" +
                    "Importante: Todos los derechos están garantizados por ley."
        },
        {
            title: "Uso de Cookies y Tecnologías",
            icon: <FaUsersCog className="text-2xl text-blue-500" />,
            content: "Cookies utilizadas:\n\n" +
                    "• Cookies esenciales de sesión\n" +
                    "• Cookies de rendimiento\n\n" +
                    // "• Cookies de preferencias\n\n" +
                    "Finalidad:\n\n" +
                    "• Mantener la sesión activa\n" +
                    "• Mejorar la experiencia de usuario\n\n" +
                    // "• Recordar preferencias\n" +
                    "Importante: Puedes configurar tu navegador para gestionar las cookies."
        },
        {
            title: "Responsabilidades y Obligaciones",
            icon: <FaExclamationTriangle className="text-2xl text-blue-500" />,
            content: "Responsabilidades del usuario:\n\n" +
                    "• Mantener información actualizada\n" +
                    "• Uso responsable del sistema\n" +
                    "• Reportar irregularidades\n" +
                    "• Proteger credenciales de acceso\n\n" +
                    "Obligaciones de la junta:\n\n" +
                    "• Protección de datos personales\n" +
                    "• Mantener el sistema operativo\n" +
                    "• Brindar soporte técnico\n" +
                    "• Atender solicitudes en tiempo y forma\n\n" +
                    "Importante: El incumplimiento puede resultar en sanciones."
        }
    ];

    const renderContent = (content) => {
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
                    if (section.startsWith('Importante:')) {
                        return (
                            <div key={idx} className="border-l-4 border-yellow-500 pl-4 bg-yellow-900/30 p-4 rounded-r">
                                <h4 className="text-yellow-500 font-bold mb-2">Importante:</h4>
                                <p className="text-gray-300">{section.replace('Importante:', '').trim()}</p>
                            </div>
                        );
                    }
                    if (section.includes(':')) {
                        const [title, ...rest] = section.split(':');
                        return (
                            <div key={idx} className="mb-4">
                                <h4 className="text-blue-400 font-semibold mb-2">{title}:</h4>
                                <div className="border-l-4 border-blue-500 pl-4">
                                    <p className="text-gray-300">{rest.join(':')}</p>
                                </div>
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

    return (
        <div className="flex-1 p-6 overflow-y-auto h-screen w-full">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg p-8 text-white shadow-xl">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-blue-500/20 rounded-full">
                            <FaShieldAlt className="text-4xl text-blue-400" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Términos y Privacidad</h1>
                            <p className="text-gray-300">
                                Información importante sobre el uso del sistema y protección de datos
                            </p>
                        </div>
                    </div>
                </div>

                {/* Última actualización */}
                <div className="bg-gray-800 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-green-500">
                        <FaCheck />
                        <span>Última actualización: Noviembre 2024</span>
                    </div>
                    <span className="text-gray-400 text-sm">Versión 1.0</span>
                </div>

                {/* Secciones */}
                <div className="space-y-4">
                    {sections.map((section, index) => (
                        <div key={index} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                            <button
                                onClick={() => toggleSection(index)}
                                className="w-full px-6 py-4 flex items-center justify-between text-white hover:bg-gray-700 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    {section.icon}
                                    <span className="text-lg font-semibold">{section.title}</span>
                                </div>
                                {activeSection === index ? 
                                    <FaChevronUp className="text-gray-400" /> : 
                                    <FaChevronDown className="text-gray-400" />
                                }
                            </button>
                            {activeSection === index && (
                                <div className="px-6 py-4 bg-gray-700/50">
                                    {renderContent(section.content)}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="bg-gray-800 rounded-lg p-6 text-center">
                    <p className="text-gray-300">
                        Al usar nuestros servicios, aceptas estos términos y condiciones.
                        Para cualquier consulta, contacta a la directiva de la Junta de Vecinos.
                    </p>
                    <p className="text-gray-400 mt-2">
                        © 2024 Junta de Vecinos. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TermsAndPrivacy;