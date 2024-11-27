import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import LoginForm from "./login/Login";
import SuperAdminDashboard from "./superAdmin/Dashboard.js";
import Cookies from "js-cookie";
import SignUp from './login/SignUp.js';

const App = () => {
  const Islogin = Cookies.get('Islogin');

  useEffect(() => {
    const handleContextMenu = (event) => {
      event.preventDefault(); 
    };

    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        {Islogin ? (<Route path="/SuperAdmin" element={<SuperAdminDashboard />} />) : (<Route path="/SuperAdmin" element={<Navigate to="/"/>}/>)}
        <Route path="/" element={<Navigate to="/" />} />
        <Route path="/register" element={<SignUp />} />
      </Routes>
    </Router>
  );
};

export default App;
