import React, { useCallback, useState, useEffect } from 'react';
import { GoogleMap, useLoadScript, MarkerF } from '@react-google-maps/api';
import Modal from 'react-modal';
import { FaTimes } from 'react-icons/fa';
import { useValidateRoleAndAccessToken } from '../middlewares/validateRoleAndAccessToken';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import { formatRut } from '../middlewares/formatRut';

const mapContainerStyle = {
  height: "75vh",
  width: "100%",
};

const center = {
  lat: -33.4489,
  lng: -70.6693,
};

const libraries = ['places'];

const BASE_URL = process.env.REACT_APP_BASE_URL;

const MapaInteractive = () => {
  useValidateRoleAndAccessToken(['1'], '/login');
  const { themes } = useTheme();
  const [mapData, setMapData] = useState([]);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [map, setMap] = useState(null);
  const [loading, setLoading] = useState(true);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No se encontró token de autenticación');
        }

        const response = await axios.get(`${BASE_URL}/users/list/map/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.data || !response.data.housing) {
          throw new Error('La respuesta de la API no tiene el formato esperado');
        }

        const transformedData = response.data.housing
          .filter(house => {
            if (!house || !house.latitude || !house.longitude) return false;
            const lat = parseFloat(house.latitude);
            const lng = parseFloat(house.longitude);
            return !isNaN(lat) && !isNaN(lng) && 
                   lat >= -90 && lat <= 90 && 
                   lng >= -180 && lng <= 180;
          })
          .flatMap(house => {
            if (!house.families || !Array.isArray(house.families)) {
              console.warn(`Casa en ${house.address}: datos de familia inválidos`);
              return [];
            }

            return house.families.map((family, index) => {
              const userData = family.user || {};
              // Formatear el nombre de la familia correctamente
              const familyName = family.family_name ? 
                family.family_name.replace(' None', '') : 
                `Familia ${userData.last_name || 'Sin Apellido'}`;

              return {
                id: `${house.address}-${index}`,
                name: familyName,
                address: house.address,
                lat: parseFloat(house.latitude),
                lng: parseFloat(house.longitude),
                info: `Familia residente en ${house.address}`,
                first_name: userData.first_name || 'No registrado',
                last_name: userData.last_name || 'No registrado',
                rut: userData.rut || 'No registrado',
                phone: userData.phone_number || 'No registrado',
                email: userData.email || 'No registrado',
                relationship: userData.relationship || 'No especificado',
                familyMembers: family.family_members || []
              };
            });
          });

        setMapData(transformedData);
      } catch (error) {
        console.error('Error al obtener datos del mapa:', error);
        setError(error.message || 'Error al cargar los datos del mapa');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const onMarkerClick = useCallback((user) => {
    setSelectedUser(user);
  }, []);

  const onCloseClick = useCallback(() => {
    setSelectedUser(null);
  }, []);

  const handleMapLoad = useCallback((map) => {
    setMap(map);
  }, []);

  if (loadError) {
    return (
      <div className="p-4 mt-2" style={{ backgroundColor: themes.background }}>
        <div className="rounded-lg p-4 bg-red-100 border border-red-400">
          <h3 className="font-bold mb-2 text-red-700">Error al cargar el mapa</h3>
          <p className="text-red-600">No se pudo cargar el mapa de Google. Por favor, verifique su conexión e intente nuevamente.</p>
        </div>
      </div>
    );
  }

  if (!isLoaded || loading) {
    return (
      <div className="p-4 mt-2 flex justify-center items-center h-[75vh]" style={{ backgroundColor: themes.background }}>
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Cargando mapa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 mt-2" style={{ backgroundColor: themes.background }}>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <h2 className="text-2xl font-bold mb-4" style={{ color: themes.text }}>
        Mapa Distribución de Familias
      </h2>

      <div className="rounded-lg overflow-hidden shadow-xl">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={13}
          onLoad={handleMapLoad}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: true,
            zoomControl: true,
            styles: [
              {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }]
              }
            ]
          }}
        >
          {mapData.map(location => (
            <MarkerF
              key={location.id}
              position={{
                lat: location.lat,
                lng: location.lng
              }}
              onClick={() => onMarkerClick(location)}
            />
          ))}
        </GoogleMap>
      </div>

      <Modal
        isOpen={!!selectedUser}
        onRequestClose={onCloseClick}
        ariaHideApp={false}
        className="max-w-10xl mx-auto p-8 bg-white rounded-lg shadow-2xl relative mt-16 outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center"
        style={{
          overlay: { zIndex: 1000 },
          content: { maxHeight: '85vh', overflowY: 'auto', width: '90%', maxWidth: '600px' }
        }}
      >
        <button
          onClick={onCloseClick}
          className="absolute top-4 right-4 text-gray-600 hover:text-red-500 transition duration-300"
          aria-label="Cerrar"
        >
          <FaTimes size={24} />
        </button>
        
        {selectedUser && (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-blue-800">
              {selectedUser.name}
            </h3>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-800 text-lg font-medium">
                {selectedUser.address}
              </p>
              <p className="text-gray-600 mt-2">
                {selectedUser.info}
              </p>
            </div>

            <hr className="h-px bg-gray-300 border-0 my-6" />

            <div className="grid gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2">Información del Jefe de Hogar</h4>
                <p className="text-gray-800">
                  <strong className="text-gray-700">Nombre:</strong>{' '}
                  {selectedUser.first_name} {selectedUser.last_name}
                </p>
                <p className="text-gray-800">
                  <strong className="text-gray-700">Relación:</strong>{' '}
                  {selectedUser.relationship}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2">Información de Contacto</h4>
                <p className="text-gray-800">
                  <strong className="text-gray-700">RUT:</strong>{' '}
                  {selectedUser.rut !== 'No registrado' ? formatRut(selectedUser.rut) : 'No registrado'}
                </p>
                <p className="text-gray-800">
                  <strong className="text-gray-700">Teléfono:</strong>{' '}
                  {selectedUser.phone}
                </p>
                <p className="text-gray-800">
                  <strong className="text-gray-700">Correo:</strong>{' '}
                  {selectedUser.email}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MapaInteractive;