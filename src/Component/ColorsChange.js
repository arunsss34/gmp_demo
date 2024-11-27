import React, { useContext } from 'react';
import ThemeContext from './ThemeContext';
import 'primeicons/primeicons.css'; 

const ThemeToggleButton = () => {
  const { toggleTheme, isDarkTheme, currentTheme } = useContext(ThemeContext);

  if (!toggleTheme) {
    console.error("ThemeContext not properly provided");
    return null;
  }

  return (
    <button
      onClick={toggleTheme}
      style={{
        margin: '20px',
        background: 'transparent', 
        color: currentTheme.buttonText,
        border: 'none',
        borderRadius: '50%', 
        transition: 'background-color 0.3s, color 0.3s',
        fontSize: '24px', 
        padding: '10px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {isDarkTheme ? (
        <i className="pi pi-moon"></i> 
      ) : (
        <i className="pi pi-sun"></i> 
      )}
    </button>
  );
};

export default ThemeToggleButton;
