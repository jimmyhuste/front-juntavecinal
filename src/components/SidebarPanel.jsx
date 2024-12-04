import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import {
    FaUser, FaFolder, FaRegClipboard, FaClipboardCheck, FaEye, FaPaperPlane,
    FaFileAlt, FaTachometerAlt, FaMap, FaClipboardList, FaCog, FaQuestionCircle,
    FaBell, FaNewspaper, FaUserPlus, FaRegEye, FaSignOutAlt, FaUserCircle,
    FaSearch
} from 'react-icons/fa';
import ViewUser from './ViewUser';
import Dashboard from './Dasboard';
import { ViewNews } from './ViewNews';
import { CreateNews } from './CreateNews';
import CreateCertificationFrom from './CreateCertificationFrom';
import CertificadoStatus from './CertificadoStatus';
import { FamilyRegister } from './FamilyRegister';
import MapaInteractive from './MapaInteractive';
import CertificadoMoveStatus from './CertificadoMoveStatus';
import FamilyMemberDetails from './FamilyMemberDetails';
import { useTheme } from '../context/ThemeContext';
import Swal from 'sweetalert2';

const SidebarPanel = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [showCertificados, setShowCertificados] = useState(false);
    const [showReservas, setShowReservas] = useState(false);
    const [showUsuarios, setShowUsuarios] = useState(false);
    const [viewUser, setViewUser] = useState(false);
    const [viewNews, setViewNews] = useState(false);
    const [viewCreateNews, setViewCreateNews] = useState(false);
    const [viewCreateCertification, setViewCreateCertification] = useState(false);
    const [viewCertificadoStatus, setViewCertificadoStatus] = useState(false);
    const [viewFamilyRegister, setViewFamilyRegister] = useState(false);
    const [viewMapa, setViewMapa] = useState(false);
    const [viewCertificadoMoveStatus, setViewCertificadoMoveStatus] = useState(false);
    const [viewFamilyMember, setviewFamilyMember] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [filteredItems, setFilteredItems] = useState([]);
    const navigate = useNavigate();
    const [rut, setRut] = useState(null);
    const [rol, setRole] = useState(null);
    const { themes } = useTheme();
    const [activeSection, setActiveSection] = useState(localStorage.getItem('lastSection') || 'dashboard');
    const [viewDashboard, setViewDashboard] = useState(localStorage.getItem('lastSection') === 'dashboard' || !localStorage.getItem('lastSection'));


    useEffect(() => {
        const accessToken = localStorage.getItem('token');
        if (accessToken) {
            try {
                const decodedToken = jwtDecode(accessToken);
                const { exp, rut, rol } = decodedToken;
                setRut(rut);
                setRole(rol);
    
                // Obtener la última sección visitada
                const lastSection = localStorage.getItem('lastSection');
    
                // Si no hay última sección, entonces establecer la vista por defecto según el rol
                if (!lastSection) {
                    if (rol === "2") {
                        setViewDashboard(false);
                        setViewNews(true);
                        setActiveSection('news');
                        localStorage.setItem('lastSection', 'news');
                    } else if (rol === "1") {
                        setViewDashboard(true);
                        setViewNews(false);
                        setActiveSection('dashboard');
                        localStorage.setItem('lastSection', 'dashboard');
                    }
                }
    
                if (exp * 1000 < Date.now()) {
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            } catch (error) {
                console.error('Error decodificando el token:', error);
                navigate('/login');
            }
        } else {
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        // Recuperar la última sección al cargar
        const lastSection = localStorage.getItem('lastSection');
        if (lastSection) {
            // Simular el clic en la última sección vista
            switch(lastSection) {
                case 'users':
                    handleUserClick();
                    break;
                case 'news':
                    handleNewsClick();
                    break;
                case 'createNews':
                    handleCreateNewsClick();
                    break;
                case 'createCertification':
                    handleCreateCertificationClick();
                    break;
                case 'certificadoStatus':
                    handleCertificadoStatusClick();
                    break;
                case 'familyRegister':
                    handleFamilyRegisterClick();
                    break;
                case 'mapa':
                    handleMapaClick();
                    break;
                case 'certificadoMoveStatus':
                    handleCertificadoMoveStatusClick();
                    break;
                case 'familyMember':
                    handleViewFamiliyMemberClick();
                    break;
                default:
                    setViewDashboard(true);
            }
            setActiveSection(lastSection);
        }
    }, []); // Solo se ejecuta al montar el componente

    const handleLogout = () => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "¿Deseas cerrar la sesión?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, cerrar sesión',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('token');
                localStorage.removeItem('lastSection'); 
                
                Swal.fire({
                    title: '¡Sesión cerrada!',
                    text: 'Has cerrado sesión exitosamente',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    navigate('/login');
                });
            }
        });
    };


    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', keywords: ['dashboard', 'inicio', 'panel'], roles: ['1'], action: () => {
            setViewDashboard(true);
            setViewUser(false);
            setViewNews(false);
            setViewCreateNews(false);
            setViewCreateCertification(false);
            setViewCertificadoStatus(false);
            setViewFamilyRegister(false);
            setViewMapa(false);
            setViewCertificadoMoveStatus(false);
            setviewFamilyMember(false);
            setActiveSection('dashboard');
        }},
        { id: 'users', label: 'Ver Usuarios', keywords: ['usuarios', 'ver usuarios', 'lista usuarios'], roles: ['1'], action: () => handleUserClick() },
        { id: 'familyRegister', label: 'Agregar Miembro', keywords: ['familia', 'agregar', 'miembro', 'registrar'], roles: ['1', '2'], action: () => handleFamilyRegisterClick() },
        { id: 'familyMember', label: 'Ver Miembros', keywords: ['familia', 'miembros', 'ver miembros'], roles: ['1', '2'], action: () => handleViewFamiliyMemberClick() },
        { id: 'certificadoMoveStatus', label: 'Gestionar Solicitudes', keywords: ['certificados', 'gestionar', 'solicitudes'], roles: ['1'], action: () => handleCertificadoMoveStatusClick() },
        { id: 'createCertification', label: 'Solicitar Certificado', keywords: ['certificados', 'solicitar', 'certificado'], roles: ['1', '2'], action: () => handleCreateCertificationClick() },
        { id: 'certificadoStatus', label: 'Consultar Solicitudes', keywords: ['certificados', 'consultar', 'solicitudes'], roles: ['1', '2'], action: () => handleCertificadoStatusClick() },
        { id: 'createNews', label: 'Publicar Noticia', keywords: ['noticias', 'publicar', 'crear'], roles: ['1'], action: () => handleCreateNewsClick() },
        { id: 'news', label: 'Ver Noticias', keywords: ['noticias', 'ver', 'lista'], roles: ['1', '2'], action: () => handleNewsClick() },
        { id: 'mapa', label: 'Mapa', keywords: ['mapas', 'mapa', 'ubicación'], roles: ['1'], action: () => handleMapaClick() }
    ];
    
    const messageRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (messageRef.current && !messageRef.current.contains(event.target)) {
                setSearchTerm('');
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const getMenuIcon = (id) => {
        const icons = {
            dashboard: <FaTachometerAlt />,
            users: <FaUser />,
            familyRegister: <FaUserPlus />,
            familyMember: <FaRegEye />,
            certificadoMoveStatus: <FaClipboardCheck />,
            createCertification: <FaRegClipboard />,
            certificadoStatus: <FaFolder />,
            createNews: <FaPaperPlane />,
            news: <FaEye />,
            mapa: <FaMap />
        };
        return icons[id] || <FaSearch />;
    };

    const handleSearch = () => {
        if (searchTerm.trim() === '') {
            Swal.fire({
                icon: 'warning',
                title: 'Buscador vacío',
                text: 'Por favor ingrese un término de búsqueda',
                timer: 1500,
                showConfirmButton: false
            });
            return;
        }

        setIsSearching(true);
        const searchLower = searchTerm.toLowerCase();
        const filtered = menuItems.filter(item => {
            return item.roles.includes(rol) && (
                item.label.toLowerCase().includes(searchLower) ||
                item.keywords.some(keyword => keyword.toLowerCase().includes(searchLower))
            );
        });

        setFilteredItems(filtered);

        if (filtered.length === 0) {
            Swal.fire({
                icon: 'info',
                title: 'Sin resultados',
                text: 'No se encontraron elementos que coincidan con la búsqueda',
                timer: 2000,
                showConfirmButton: false
            });
        } else if (filtered.length === 1) {
            filtered[0].action();
        } 
        setIsSearching(false);
    };

    useEffect(() => {
        window.handleSearchResult = (index) => {
            if (filteredItems[index]) {
                filteredItems[index].action();
                Swal.close();
            }
        };
        return () => {
            delete window.handleSearchResult;
        };
    }, [filteredItems]);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const toggleCertificados = () => {
        setShowCertificados(!showCertificados);
        setActiveSection('certificados');
    };

    const toggleReservas = () => {
        setShowReservas(!showReservas);
        setActiveSection('reservas');
    };

    const toggleUsuarios = () => {
        setShowUsuarios(!showUsuarios);
        setActiveSection('usuarios');
    };

    const handleUserClick = () => {
        setViewUser(true);
        setViewDashboard(false);
        setViewNews(false);
        setViewCreateNews(false);
        setViewCreateCertification(false);
        setViewCertificadoStatus(false);
        setViewFamilyRegister(false);
        setViewMapa(false);
        setViewCertificadoMoveStatus(false);
        setviewFamilyMember(false);
        setActiveSection('users');
        localStorage.setItem('lastSection', 'users');
    };

    const handleNewsClick = () => {
        setViewNews(true);
        setViewDashboard(false);
        setViewUser(false);
        setViewCreateNews(false);
        setViewCreateCertification(false);
        setViewCertificadoStatus(false);
        setViewFamilyRegister(false);
        setViewMapa(false);
        setViewCertificadoMoveStatus(false);
        setviewFamilyMember(false);
        setActiveSection('news');
        localStorage.setItem('lastSection', 'news');
    };

    const handleCreateNewsClick = () => {
        setViewCreateNews(true);
        setViewDashboard(false);
        setViewUser(false);
        setViewNews(false);
        setViewCreateCertification(false);
        setViewCertificadoStatus(false);
        setViewFamilyRegister(false);
        setViewMapa(false);
        setViewCertificadoMoveStatus(false);
        setviewFamilyMember(false);
        setActiveSection('createNews');
        localStorage.setItem('lastSection', 'createNews');
    };

    const handleCreateCertificationClick = () => {
        setViewCreateCertification(true);
        setViewDashboard(false);
        setViewUser(false);
        setViewNews(false);
        setViewCreateNews(false);
        setViewCertificadoStatus(false);
        setViewFamilyRegister(false);
        setViewMapa(false);
        setViewCertificadoMoveStatus(false);
        setviewFamilyMember(false);
        setActiveSection('createCertification');
        localStorage.setItem('lastSection', 'createCertification');
    };

    const handleCertificadoStatusClick = () => {
        setViewCertificadoStatus(true);
        setViewDashboard(false);
        setViewUser(false);
        setViewNews(false);
        setViewCreateNews(false);
        setViewCreateCertification(false);
        setViewFamilyRegister(false);
        setViewMapa(false);
        setViewCertificadoMoveStatus(false);
        setviewFamilyMember(false);
        setActiveSection('certificadoStatus');
        localStorage.setItem('lastSection', 'certificadoStatus');
    };

    const handleFamilyRegisterClick = () => {
        setViewFamilyRegister(true);
        setViewDashboard(false);
        setViewUser(false);
        setViewNews(false);
        setViewCreateNews(false);
        setViewCreateCertification(false);
        setViewCertificadoStatus(false);
        setViewMapa(false);
        setViewCertificadoMoveStatus(false);
        setviewFamilyMember(false);
        setActiveSection('familyRegister');
        localStorage.setItem('lastSection', 'familyRegister');
    };

    const handleBackClick = () => {
        setViewDashboard(true);
        setViewUser(false);
        setViewNews(false);
        setViewCreateNews(false);
        setViewCreateCertification(false);
        setViewCertificadoStatus(false);
        setViewFamilyRegister(false);
        setViewMapa(false);
        setViewCertificadoMoveStatus(false);
        setviewFamilyMember(false);
        setActiveSection('dashboard');
        localStorage.setItem('lastSection', 'dashboard');
    };

    const handleMapaClick = () => {
        setViewMapa(true);
        setViewUser(false);
        setViewDashboard(false);
        setViewNews(false);
        setViewCreateNews(false);
        setViewCreateCertification(false);
        setViewCertificadoStatus(false);
        setViewFamilyRegister(false);
        setViewCertificadoMoveStatus(false);
        setviewFamilyMember(false);
        setActiveSection('mapa');
        localStorage.setItem('lastSection', 'mapa');
    };

    const handleCertificadoMoveStatusClick = () => {
        setViewCertificadoMoveStatus(true);
        setViewDashboard(false);
        setViewUser(false);
        setViewNews(false);
        setViewCreateNews(false);
        setViewCreateCertification(false);
        setViewCertificadoStatus(false);
        setViewFamilyRegister(false);
        setViewMapa(false);
        setviewFamilyMember(false);
        setActiveSection('certificadoMoveStatus');
        localStorage.setItem('lastSection', 'certificadoMoveStatus');
    };

    const handleViewFamiliyMemberClick = () => {
        setviewFamilyMember(true);
        setViewCertificadoMoveStatus(false);
        setViewDashboard(false);
        setViewUser(false);
        setViewNews(false);
        setViewCreateNews(false);
        setViewCreateCertification(false);
        setViewCertificadoStatus(false);
        setViewFamilyRegister(false);
        setViewMapa(false);
        setActiveSection('familyMember');
        localStorage.setItem('lastSection', 'familyMember');
    };

    

    return (
        <div className="flex flex-col md:flex-row" style={{ backgroundColor: themes.background, color: themes.text }}>
            <div
                className={`transition-width duration-300 ${isOpen ? 'w-64' : 'w-16'} h-screen relative flex flex-col shadow-md border border-gray-700`}
                style={{ backgroundColor: '#2d3748', color: '#f7fafc' }}
            >
                <NavLink
                    to="/"
                    className={`
                        flex items-center justify-start py-4 px-3 cursor-pointer
                        ${isOpen ? 'space-x-2' : 'justify-center'}
                        border-b border-gray-700/50
                        bg-gradient-to-r from-gray-800 to-gray-700
                        shadow-lg`}
                >
                    <img
                        src="/diversity.png"
                        alt="Logo Junta de Vecinos"
                        className={`
                            ${isOpen ? 'w-10 h-10' : 'w-8 h-8'}
                            object-cover
                            transition-all duration-300
                            rounded-lg
                            shadow-md
                            hover:scale-105
                            border-2 border-gray-600/30`}
                    />
                    {isOpen && (
                        <div className="flex flex-col min-w-0">
                            <h2 className="text-sm font-bold text-white truncate">
                                25° Unidad Vecinal
                            </h2>

                            <div className="flex items-center">
                                <span className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse"></span>
                                <span className="text-xs text-gray-400">
                                    Providencia
                                </span>
                            </div>
                        </div>
                    )}
                </NavLink>

                <div className="absolute right-0 top-0 transform translate-x-1/2">
                    <button
                        onClick={toggleSidebar}
                        className="m-8 p-1.5 bg-indigo-800 hover:bg-indigo-700 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 border border-indigo-500"
                    >
                        <span className="text-white text-lg">{isOpen ? '<' : '>'}</span>
                    </button>
                </div>

                <div className="mt-10 flex-grow overflow-y-auto">
                    {isOpen && (
                        <>
                            {rol === "1" && (
                                <div
                                    className={`block py-2 px-4 text-left flex items-center cursor-pointer
                                        ${activeSection === 'dashboard' ? 'bg-gray-600' : 'hover:bg-gray-600'}`}
                                    onClick={() => {
                                        setViewDashboard(true);
                                        setViewUser(false);
                                        setViewNews(false);
                                        setViewCreateNews(false);
                                        setViewCreateCertification(false);
                                        setViewCertificadoStatus(false);
                                        setViewFamilyRegister(false);
                                        setActiveSection('dashboard');
                                    }}
                                >
                                    <FaTachometerAlt className="mr-2" />
                                    <span>Dashboard</span>
                                </div>
                            )}

                            {(rol === "1" || rol === "2") && (
                                <div
                                    className={`block py-2 px-4 text-left flex items-center cursor-pointer
                                        ${activeSection === 'usuarios' ? 'bg-gray-600' : 'hover:bg-gray-600'}`}
                                    onClick={toggleUsuarios}
                                >
                                    <FaUser className="mr-2" />
                                    <span>Usuarios</span>
                                </div>
                            )}

                            <div className="pl-4">
                                {rol === "1" && showUsuarios && (
                                    <div
                                        className={`block py-2 px-4 text-left flex items-center cursor-pointer
                                            ${activeSection === 'users' ? 'bg-gray-600' : 'hover:bg-gray-600'}`}
                                        onClick={handleUserClick}
                                    >
                                        <FaUser className="mr-2" />
                                        <span>Ver Usuarios</span>
                                    </div>
                                )}
                                {(rol === "1" || rol === "2") && showUsuarios && (
                                    <div
                                        className={`block py-2 px-4 text-left flex items-center cursor-pointer
                                            ${activeSection === 'familyRegister' ? 'bg-gray-600' : 'hover:bg-gray-600'}`}
                                        onClick={handleFamilyRegisterClick}
                                    >
                                        <FaUserPlus className="mr-2" />
                                        <span>Agregar Miembro</span>
                                    </div>
                                )}
                                {(rol === "1" || rol === "2") && showUsuarios && (
                                    <div
                                        className={`block py-2 px-4 text-left flex items-center cursor-pointer
                                            ${activeSection === 'familyMember' ? 'bg-gray-600' : 'hover:bg-gray-600'}`}
                                        onClick={handleViewFamiliyMemberClick}
                                    >
                                        <FaRegEye className="mr-2" />
                                        <span>Ver Miembros</span>
                                    </div>
                                )}
                            </div>

                            <div
                                className={`block py-2 px-4 text-left flex items-center cursor-pointer
                                    ${activeSection === 'certificados' ? 'bg-gray-600' : 'hover:bg-gray-600'}`}
                                onClick={toggleCertificados}
                            >
                                <FaFileAlt className="mr-2" />
                                <span>Certificados</span>
                            </div>
                            {showCertificados && (
                                <div className="pl-4">
                                    {rol === "1" && (
                                        <div
                                            className={`block py-2 px-4 text-left flex items-center cursor-pointer
                                                ${activeSection === 'certificadoMoveStatus' ? 'bg-gray-600' : 'hover:bg-gray-600'}`}
                                            onClick={handleCertificadoMoveStatusClick}
                                        >
                                            <FaClipboardCheck className="mr-2" />
                                            <span>Gestionar Solicitudes</span>
                                        </div>
                                    )}
                                    <div
                                        className={`block py-2 px-4 text-left flex items-center cursor-pointer
                                            ${activeSection === 'createCertification' ? 'bg-gray-600' : 'hover:bg-gray-600'}`}
                                        onClick={handleCreateCertificationClick}
                                    >
                                        <FaRegClipboard className="mr-2" />
                                        <span>Solicitar Certificado</span>
                                    </div>
                                    <div
                                        className={`block py-2 px-4 text-left flex items-center cursor-pointer
                                            ${activeSection === 'certificadoStatus' ? 'bg-gray-600' : 'hover:bg-gray-600'}`}
                                        onClick={handleCertificadoStatusClick}>
                                        <FaFolder className="mr-2" />
                                        <span>Consultar Solicitudes</span>
                                    </div>
                                </div>
                            )}

                            <div
                                className={`block py-2 px-4 text-left flex items-center cursor-pointer
                                    ${activeSection === 'reservas' ? 'bg-gray-600' : 'hover:bg-gray-600'}`}
                                onClick={toggleReservas}
                            >
                                <FaNewspaper className="mr-2" />
                                <span>Noticias</span>
                            </div>
                            {showReservas && (
                                <div className="pl-4">
                                    {rol === "1" && (
                                        <div
                                            className={`block py-2 px-4 text-left flex items-center cursor-pointer
                                                ${activeSection === 'createNews' ? 'bg-gray-600' : 'hover:bg-gray-600'}`}
                                            onClick={handleCreateNewsClick}
                                        >
                                            <FaPaperPlane className="mr-2" />
                                            <span>Publicar Noticia</span>
                                        </div>
                                    )}
                                    <div
                                        className={`block py-2 px-4 text-left flex items-center cursor-pointer
                                            ${activeSection === 'news' ? 'bg-gray-600' : 'hover:bg-gray-600'}`}
                                        onClick={handleNewsClick}
                                    >
                                        <FaEye className="mr-2" />
                                        <span>Ver Noticias</span>
                                    </div>
                                </div>
                            )}

                            {rol === "1" && (
                                <div
                                    className={`block py-2 px-4 text-left flex items-center cursor-pointer
                                        ${activeSection === 'mapa' ? 'bg-gray-600' : 'hover:bg-gray-600'}`}
                                    onClick={handleMapaClick}
                                >
                                    <FaMap className="mr-2" />
                                    <span>Mapa</span>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {isOpen && (
                    <div className="mt-auto mb-4 border-t border-gray-700 pt-4">
                        <NavLink
                            to={`/user/${rut}/edit`}
                            className={`block py-2 px-4 text-left flex items-center hover:bg-gray-600
                                ${activeSection === 'profile' ? 'bg-gray-600' : ''}`}
                            onClick={() => setActiveSection('profile')}
                        >
                            <FaUserCircle className="mr-2" />
                            <span>Mi Perfil</span>
                        </NavLink>

                        <button
                            onClick={handleLogout}
                            className="w-full block py-2 px-4 hover:bg-gray-600 text-left flex items-center text-red-400 hover:text-red-300"
                        >
                            <FaSignOutAlt className="mr-2" />
                            <span>Cerrar Sesión</span>
                        </button>

                        <NavLink
                            to="/ayuda"
                            className={`block py-2 px-4 text-left flex items-center hover:bg-gray-600
                                ${activeSection === 'help' ? 'bg-gray-600' : ''}`}
                            onClick={() => setActiveSection('help')}
                        >
                            <FaQuestionCircle className="mr-2" />
                            <span>Ayuda</span>
                        </NavLink>
                    </div>
                )}
            </div>

            <div className="flex-1 p-6 bg-gray-100 overflow-y-auto h-screen" style={{ backgroundColor: themes.background, color: themes.text }}>

                <div className="mt-2 mb-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="relative flex items-center">
                            <input
                                type="text"
                                placeholder="Buscar..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                className="w-full p-3 pl-4 pr-12 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                style={{
                                    backgroundColor: themes.background,
                                    color: themes.text,
                                    borderColor: themes.background === '#ffffff' ? '#e2e8f0' : themes.border,
                                }}
                            />
                            <button
                                onClick={handleSearch}
                                className="absolute right-2 p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                style={{ color: themes.text }}
                            >
                                {isSearching ? (
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500" />
                                ) : (
                                    <FaSearch size={20} />
                                )}
                            </button>
                        </div>

                        {/* Resultados de búsqueda */}
                        {searchTerm && filteredItems.length > 0 && (
                            <div
                                className="absolute mt-2 w-full max-w-4xl bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                                style={{ backgroundColor: themes.background, borderColor: themes.border }}
                            >
                                <div className="p-2">
                                    {filteredItems.map((item, index) => (
                                        <div
                                            key={item.id}
                                            onClick={() => {
                                                item.action();
                                                setSearchTerm('');
                                            }}
                                            className="flex items-center p-3 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors duration-200"
                                            style={{
                                                backgroundColor: themes.background,
                                                ':hover': { backgroundColor: themes.hover }
                                            }}
                                        >
                                            <span className="mr-3 text-gray-400">
                                                {getMenuIcon(item.id)}
                                            </span>
                                            <div>
                                                <div className="font-medium" style={{ color: themes.text }}>
                                                    {item.label}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Mensaje cuando no hay resultados */}
                        {searchTerm && filteredItems.length === 0 && !isSearching && (
                            <div 
                                ref={messageRef}
                                className="absolute mt-2 w-full max-w-4xl p-4 bg-white rounded-lg shadow-lg border border-gray-200 text-center"
                                style={{ backgroundColor: themes.background, borderColor: themes.border }}
                            >
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                                    aria-label="Cerrar"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                                <p className="text-gray-500">No se encontraron resultados para "{searchTerm}"</p>
                            </div>
                        )}
                    </div>
                </div>


                {viewUser && rol === "1" ? (
                    <ViewUser onBackClick={handleBackClick} />
                ) : viewDashboard && rol === "1" ? (
                    <Dashboard />
                ) : viewNews ? (
                    <ViewNews onBackClick={handleBackClick} />
                ) : viewCreateNews && rol === "1" ? (
                    <CreateNews />
                ) : viewCreateCertification ? (
                    <CreateCertificationFrom onBackClick={handleBackClick} />
                ) : viewCertificadoStatus ? (
                    <CertificadoStatus onBackClick={handleBackClick} />
                ) : viewFamilyRegister ? (
                    <FamilyRegister onBackClick={handleBackClick} />
                ) : viewMapa && rol === "1" ? (
                    <MapaInteractive onBackClick={handleBackClick} />
                ) : viewCertificadoMoveStatus && rol === "1" ? (
                    <CertificadoMoveStatus onBackClick={handleBackClick} />
                ) : viewFamilyMember ? (
                    <FamilyMemberDetails onBackClick={handleBackClick} />
                ) : null}
            </div>
        </div>
    );
};

export default SidebarPanel;