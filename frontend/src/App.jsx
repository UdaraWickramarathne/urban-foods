import './App.css'
import React, { useState } from 'react';
import Navbar from './components/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import Homepage from './pages/Homepage/Homepage'
import LoginPage from './components/AuthUi/Login'

function App() {

  const [showLogin, setShowLogin] = useState(false);

  const handleUserIconClick = () => {
    setShowLogin(!showLogin);
  };
  const handleCloseLogin = () => {
    setShowLogin(false);
  };


  return (
    <>  
      <Navbar onUserIconClick={handleUserIconClick}/>
      {showLogin && <LoginPage  onClose={handleCloseLogin} />}
      <Routes>
        <Route path="/" element={<Homepage/>}/>
      </Routes>
    </>
  )
}

export default App
