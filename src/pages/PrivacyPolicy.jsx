import React, { useState } from 'react';
import { FaShieldAlt, FaUserLock, FaDatabase, FaUsersCog, FaExclamationTriangle, 
         FaCheck, FaHandshake, FaChevronDown, FaChevronUp, FaLock, FaServer,
         FaUserShield, FaCookieBite } from 'react-icons/fa';

const PrivacyPolicy = () => {
    const [activeSection, setActiveSection] = useState(null);

    const toggleSection = (index) => {
        setActiveSection(activeSection === index ? null : index);
    };

    const sections = [
        {
            title: "Recopilación de Datos Personales",
            icon: <FaUserLock className="text-2xl text-blue-500" />,
            content: "Datos que recopilamos:\n\n" +
                    "• Nombre completo y RUT\n" +
                    "• Dirección de residencia\n" +
                    "• Número telefónico\n" +
                    "• Correo electrónico\n" +
                    "• Composición familiar\n" +
                    "• Registro Social de Hogares\n\n" +
                    "Propósito de la recopilación:\n\n" +
                    "• Identificación de residentes\n" +
                    "• Emisión de certificados\n" +
                    "• Comunicaciones oficiales\n" +
                    "• Gestión de solicitudes\n\n" +
                    "Importante: No recopilamos información sensible más allá de lo estrictamente necesario."
        },
        {
            title: "Uso y Tratamiento de Datos",
            icon: <FaDatabase className="text-2xl text-blue-500" />,
            content: "Usos principales:\n\n" +
                    "• Validación de identidad\n" +
                    "• Gestión de certificados\n" +
                    "• Envío de notificaciones\n" +
                    "• Estadísticas internas\n\n" +
                    "Procesamiento de datos:\n\n" +
                    "• Almacenamiento seguro\n" +
                    "• Acceso restringido\n" +
                    "• Encriptación de información\n" +
                    "• Respaldos periódicos\n\n" +
                    "Importante: Tus datos son procesados siguiendo estrictos protocolos de seguridad."
        },
        {
            title: "Protección de la Información",
            icon: <FaLock className="text-2xl text-blue-500" />,
            content: "Medidas de seguridad:\n\n" +
                    "• Encriptación de datos sensibles\n" +
                    "• Firewalls de seguridad\n" +
                    "• Monitoreo constante\n" +
                    "• Actualizaciones periódicas\n\n" +
                    "Acceso a la información:\n\n" +
                    "• Solo personal autorizado\n" +
                    "• Registros de acceso\n" +
                    // "• Autenticación multifactor\n" +
                    "• Políticas de contraseñas seguras\n\n" +
                    "Importante: Implementamos las mejores prácticas de seguridad digital."
        },
        {
            title: "Derechos ARCO",
            icon: <FaUserShield className="text-2xl text-blue-500" />,
            content: "Tus derechos:\n\n" +
                    "• Acceso a tus datos personales\n" +
                    "• Rectificación de información incorrecta\n" +
                    "• Cancelación de datos\n" +
                    "• Oposición al tratamiento\n\n" +
                    "Cómo ejercer tus derechos:\n\n" +
                    "• Solicitud por escrito\n" +
                    "• Identificación válida\n" +
                    "• Respuesta en 10 días hábiles\n" +
                    "• Sin costo asociado\n\n" +
                    "Importante: Garantizamos el ejercicio de tus derechos según la Ley 19.628."
        },
        {
            title: "Almacenamiento de Datos",
            icon: <FaServer className="text-2xl text-blue-500" />,
            content: "Período de retención:\n\n" +
                    "• Datos activos: Durante membresía\n" +
                    "• Históricos: 5 años\n" +
                    "• Certificados: 2 años\n" +
                    "• Respaldos: 1 año\n\n" +
                    "Ubicación de datos:\n\n" +
                    "• Servidores en Chile\n" +
                    "• Copias de seguridad encriptadas\n" +
                    "• Centros de datos certificados\n\n" +
                    "Importante: Cumplimos con todas las normativas de almacenamiento de datos personales."
        },
        {
            title: "Cookies y Tecnologías",
            icon: <FaCookieBite className="text-2xl text-blue-500" />,
            content: "Uso de cookies:\n\n" +
                    "• Cookies esenciales\n" +
                    "• Cookies de sesión\n\n" +
                    // "• Cookies de preferencias\n\n" +
                    "Propósito:\n\n" +
                    "• Mantener sesión activa\n" +
                    "• Mejorar experiencia de usuario\n\n" +
                    // "• Recordar preferencias\n\n" +
                    // "• Análisis de uso\n\n" +
                    
                    "Importante: Puedes controlar el uso de cookies desde tu navegador."
        },
        {
            title: "Compartir Información",
            icon: <FaHandshake className="text-2xl text-blue-500" />,
            content: "Política de no divulgación:\n\n" +
                    "• No venta de datos\n" +
                    "• No compartir con terceros\n" +
                    "• Solo uso interno\n\n" +
                    "Excepciones legales:\n\n" +
                    "• Orden judicial\n" +
                    "• Requerimiento legal\n" +
                    "• Protección de derechos\n\n" +
                    "Importante: Tu privacidad es nuestra prioridad."
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
                            <h1 className="text-3xl font-bold mb-2">Política de Privacidad</h1>
                            <p className="text-gray-300">
                                Protección y tratamiento de datos personales
                            </p>
                        </div>
                    </div>
                </div>

                {/* Banner de compromiso */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-4">
                            <div className="bg-blue-500/20 p-3 rounded-full">
                                <FaUserLock className="text-3xl" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold tracking-wide">
                                    Compromiso con tu Privacidad
                                </h3>
                                <p className="text-blue-100 mt-1">
                                    Protegemos tus datos siguiendo los más altos estándares de seguridad
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Fecha de actualización */}
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

                {/* Footer con información adicional */}
                <div className="bg-gray-800 rounded-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-white mb-3">Contacto para Privacidad</h3>
                            <p className="text-gray-300">Email: privacidad@juntavecinos.cl</p>
                            <p className="text-gray-300">Teléfono: +56 2 2345 6789</p>
                            <p className="text-gray-300">Horario: Lunes a Viernes, 9:00 - 18:00</p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-white mb-3">Recursos Adicionales</h3>
                            <p className="text-gray-300">• Ley 19.628 sobre Protección de Datos</p>
                            <p className="text-gray-300">• Guía de Derechos ARCO</p>
                            <p className="text-gray-300">• Manual de Seguridad de Datos</p>
                        </div>
                    </div>
                    <div className="mt-6 pt-6 border-t border-gray-700 text-center">
                        <p className="text-gray-400">
                            © 2024 Junta de Vecinos . Todos los derechos reservados.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;