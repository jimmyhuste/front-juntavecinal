import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

// Función para validar el token y el rol
const validateTokenAndRole = (allowedRoles, navigate) => {
    const token = localStorage.getItem('token');

    if (!token) {
        Swal.fire('Acceso Denegado', 'No hay token', 'warning');
        navigate('/login');
        return { valid: false, message: 'No hay token' }; // Mensaje adicional para la advertencia
    }

    let decodedToken;
    try {
        decodedToken = jwtDecode(token);
    } catch (error) {
        Swal.fire('Acceso Denegado', 'Token no válido', 'warning');
        navigate('/login');
        return { valid: false, message: 'Token no válido' }; // Mensaje adicional para la advertencia
    }

    const { exp, rol } = decodedToken;

    if (exp * 1000 < Date.now()) {
        localStorage.removeItem('token');
        Swal.fire('Acceso Denegado', 'Token ha expirado', 'warning');
        navigate('/login');
        return { valid: false, message: 'Token ha expirado' }; // Mensaje adicional para la advertencia
    }

    if (!allowedRoles.includes(rol)) {
        Swal.fire('Acceso Denegado', 'No tienes permiso para acceder a esta página.', 'warning');
        navigate('/login');
        return { valid: false, message: 'No tienes permiso' }; // Mensaje adicional para la advertencia
    }

    return { valid: true };
};

// Custom hook para validar el rol y el token
export const useValidateRoleAndAccessToken = (allowedRoles, redirectPath) => {
    const navigate = useNavigate();

    useEffect(() => {
        const { valid, message } = validateTokenAndRole(allowedRoles, navigate); // Usa navigate en lugar de useNavigate

        if (!valid) {
            Swal.fire('Acceso Denegado', message, 'warning');
            navigate(redirectPath);
        }
    }, [allowedRoles, navigate, redirectPath]);
};
