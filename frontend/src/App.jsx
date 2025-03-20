import './App.css';
import React, { useState } from 'react';
import Navbar from './components/Navbar/Navbar';
import { Route, Routes } from 'react-router-dom';
import Homepage from './pages/Homepage/Homepage';
import LoginPage from './components/AuthUi/Login';
import Register from './components/AuthUi/Register';

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleUserIconClick = () => {
    setShowLogin(true);
    setShowRegister(false);
  };

  const handleCloseLogin = () => {
    setShowLogin(false);
  };

  const handleSwitchToRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
  };

  const handleCloseRegister = () => {
    setShowRegister(false);
  };

  const handleSwitchToLogin = () => {
    setShowRegister(false);
    setShowLogin(true);
  };

  return (
    <>
      <Navbar onUserIconClick={handleUserIconClick} />
      {showLogin && (
        <LoginPage onClose={handleCloseLogin} onSwitchToRegister={handleSwitchToRegister} />
      )}
      {showRegister && (
        <Register onClose={handleCloseRegister} onSwitchToLogin={handleSwitchToLogin} />
      )}
      <Routes>
        <Route path="/" element={<Homepage />} />
      </Routes>
    </>
  );
}

export default App;