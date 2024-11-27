import React, { createContext, useState, useEffect } from 'react';
import colors from './colors';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const storedTheme = localStorage.getItem('theme') || 'light';
  const [isDarkTheme, setIsDarkTheme] = useState(storedTheme === 'dark');
  useEffect(() => {
    localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
  }, [isDarkTheme]);

  const toggleTheme = () => {
    setIsDarkTheme(prevTheme => !prevTheme);
  };
  const currentTheme = isDarkTheme ? colors.dark : colors.light;

  return (
    <ThemeContext.Provider value={{ currentTheme, toggleTheme, isDarkTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
