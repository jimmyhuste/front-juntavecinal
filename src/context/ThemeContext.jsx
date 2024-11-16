// src/context/ThemeContext.js
import React, { createContext, useState, useContext } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  const themes = {
    light: {
      background: '#f3f4f6', 
      text: '#2d3748',
      primary: '#007bff',
      secondary: '#6c757d',
      navbar: '#ffffff',
      card: '#ffffff',
      border: '#e2e8f0',
      sidebar: '#1f2937'      
    },
    darkBlue: {
      background: '#1e2937',
      text: '#ffffff',
      primary: '#60a5fa',
      secondary: '#94a3b8',
      navbar: '#1a202c',
      card: '#2d3748',
      border: '#4a5568',
      sidebar: '#1f2937'
    }
  };

  const toggleTheme = (selectedTheme) => {
    setTheme(selectedTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, themes: themes[theme], toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);