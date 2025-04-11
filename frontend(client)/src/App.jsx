import './App.css';
import React, { useState } from 'react';
import Navbar from './components/Navbar/Navbar';
import { Route, Routes } from 'react-router-dom';
import Homepage from './pages/Homepage/Homepage';
import LoginPage from './components/AuthUi/Login';
import Register from './components/AuthUi/Register';
import ShoppingCart from "./components/Cart/ShoppingCart.jsx";
import PaymentSuccess from "./pages/PaymentSuccess/PaymentSuccess";
import Profile from './components/ProfileUi/Profile.jsx';
import About from './components/About/About.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import { ContextWrapper } from './context/contextWrapper';
import ProductDisplay from './pages/ProductDisplay/ProductDisplay.jsx';
import ProductDetailPage from './pages/ProductDetails/ProductDetailPage.jsx';
import MyOrders from './pages/MyOrders/MyOrders.jsx';
import Contact from './pages/Contact/Contact.jsx';
import OurServices from './pages/OurServices/OurServices.jsx';
import Feedback from "./pages/Feedback/Feedback.jsx";


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
    <ContextWrapper>
      <Navbar onUserIconClick={handleUserIconClick} />
      {showLogin && (
        <LoginPage onClose={handleCloseLogin} onSwitchToRegister={handleSwitchToRegister} />
      )}
      {showRegister && (
        <Register onClose={handleCloseRegister} onSwitchToLogin={handleSwitchToLogin} />
      )}
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/shop" element={<ProductDisplay />} />
        <Route path="/cart" element={<ShoppingCart />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/profile"  element={<Profile />} />
        <Route path="/about"  element={<About />} />
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path="/orders" element={<MyOrders />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/services' element={<OurServices/>}/>
        <Route path="/feedback" element={<Feedback />} />
      </Routes>
    </ContextWrapper>
  );
}

export default App;