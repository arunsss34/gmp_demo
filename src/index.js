import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import store from '../src/store/store';
import { PrimeReactProvider } from 'primereact/api';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import 'primereact/resources/themes/saga-blue/theme.css';  
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { ThemeProvider } from   './Component/ThemeContext';
 


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(

    <ThemeProvider >
        <Provider store={store}>
          <App />
        </Provider>,
    </ThemeProvider>

    
);

    