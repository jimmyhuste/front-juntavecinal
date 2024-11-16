// src/components/ThemeSelector.js
import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { FaSun, FaMoon } from 'react-icons/fa';

const ThemeSelector = () => {
  const { theme, toggleTheme } = useTheme();

  const handleToggle = () => {
    toggleTheme(theme === 'light' ? 'darkBlue' : 'light');
  };

  return (
    <div className="theme-selector absolute top-4 right-4">
      <button
        onClick={handleToggle}
        className={`theme-btn p-2 rounded-full ${
          theme === 'light' ? 'bg-gray-200 text-gray-600' : 'bg-blue-800 text-white'
        }`}
        title={theme === 'light' ? 'Cambiar a modo Azul Oscuro' : 'Cambiar a modo Claro'}
      >
        {theme === 'light' ? <FaMoon size={20} /> : <FaSun size={20} />}
      </button>
    </div>
  );
};

export default ThemeSelector;