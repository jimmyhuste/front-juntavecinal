import React, { useCallback, useState, useEffect } from 'react';
import { GoogleMap, useLoadScript, MarkerF } from '@react-google-maps/api';
import Modal from 'react-modal';
import { FaTimes } from 'react-icons/fa';
import { useValidateRoleAndAccessToken } from '../middlewares/validateRoleAndAccessToken';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import {formatRut} from '../middlewares/formatRut'


const mapContainerStyle = {
  height: "75vh",
  width: "100%",
};

// Centrado en Pudahuel, Chile
// const center = {
//   lat: -33.4423,
//   lng: -70.7583,
// };

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

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BASE_URL}/users/list/map/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        // Transform and validate coordinates
        const transformedData = response.data.housing
          .filter(house => {
            // Validar que las coordenadas sean números válidos
            const lat = parseFloat(house.latitude);
            const lng = parseFloat(house.longitude);
            return !isNaN(lat) && !isNaN(lng) && 
                   lat >= -90 && lat <= 90 && 
                   lng >= -180 && lng <= 180;
          })
          .flatMap(house => 
            house.families.map((family, index) => ({
              id: `${house.address}-${index}`,
              name: family.family_name,
              address: house.address,
              lat: parseFloat(house.latitude),
              lng: parseFloat(house.longitude),
              info: `Familia residente en ${house.address}`,
              rut: family.user.rut,
              phone: family.user.phone_number,
              email: family.user.email,
              familyMembers: family.family_members
            }))
          );
        
        // console.log('Transformed Map Data:', transformedData); // Para debugging
        setMapData(transformedData);
      } catch (error) {
        console.error('Error fetching map data:', error);
      }
    };

    fetchData();
  }, []);

  const [selectedUser, setSelectedUser] = useState(null);
  const [map, setMap] = useState(null);

  const onMarkerClick = useCallback((user) => {
    setSelectedUser(user);
  }, []);

  const onCloseClick = () => {
    setSelectedUser(null);
  };

  const handleMapLoad = useCallback((map) => {
    setMap(map);
  }, []);

  // Error handling
  if (loadError) {
    return (
      <div className="p-4 mt-2" style={{ backgroundColor: themes.background }}>
        <div className="rounded-lg p-4 bg-gray-800">
          <h3 className="font-bold mb-2 text-white">Error al cargar el mapa</h3>
          <p className="mb-4 text-gray-300">No se pudo cargar el mapa. Por favor, recarga la página.</p>
        </div>
      </div>
    );
  }

  // Loading spinner
  if (!isLoaded) {
    return (
      <div className="p-4 mt-2 flex justify-center items-center h-[75vh]" style={{ backgroundColor: themes.background }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 mt-2" style={{ backgroundColor: themes.background }}>
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
          }}
        >
          {mapData && mapData.length > 0 && mapData.map(location => (
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
        className="max-w-10xl mx-auto p-8 bg-white bg-opacity-70 rounded-lg shadow-2xl relative mt-16 outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center"
        style={{
          overlay: { zIndex: 1000 },
          content: { maxHeight: '85vh', overflowY: 'auto' }
        }}
      >
        <button
          onClick={onCloseClick}
          className="absolute top-4 right-4 text-gray-600 hover:text-red-500 transition duration-300"
        >
          <FaTimes size={24} />
        </button>
        {selectedUser && (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-blue-800">{selectedUser.name}</h3>
            <p className="text-gray-800 text-lg">{selectedUser.address}</p>
            <p className="text-gray-800">{selectedUser.info}</p>
            <hr className="h-px bg-gray-400 border-0 my-8 shadow-xl" />
            <p className="text-gray-800 text-lg"><strong className="text-gray-700 text-lg">Rut:</strong> {formatRut(selectedUser.rut)}</p>
            <p className="text-gray-800 text-lg"> <strong className="text-gray-700 text-lg">Teléfono:</strong> {selectedUser.phone}</p>
            <p className="text-gray-800 text-lg"><strong className="text-gray-700 text-lg">Correo:</strong> {selectedUser.email}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MapaInteractive;