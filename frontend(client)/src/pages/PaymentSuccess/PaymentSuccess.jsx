import React, { use, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './PaymentSuccess.css';
import storeContext from '../../context/storeContext';
import { CartContext } from '../../context/CartContext';

const PaymentSuccess = () => {
  // Mock data - in production this would come from your order system
  const orderNumber = "#ORD-2023-45789";
  const amount = "$129.99";

  //Need to listen url params success and orderId
  const urlParams = new URLSearchParams(window.location.search);
  const success = urlParams.get('success') === 'true';
  const orderId = urlParams.get('orderId');

  const [isClearCart, setIsClearCart] = useState(false);
  const [isUpdatePaymentStatus, setIsUpdatePaymentStatus] = useState(false);

  const { clearCart, updatePaymentStatus } = storeContext(); // Assuming you have a context to get userId

  const {fetchCartItems} = useContext(CartContext); // Assuming you have a context to get userId

  // If success true, want to delete cart items from the database
  useEffect(() => {
    if (success) {
      const clearCartItems = async () => {
        try {
          const result = await clearCart(); // Call the clearCart function from your context
          if (result.success) {
            console.log("Cart cleared successfully");
            setIsClearCart(true);
            await fetchCartItems(); // Fetch cart items again to update the state
          }else{
            console.error("Error clearing cart items:", result.message);
          }
        } catch (error) {
          console.error("Error clearing cart items:", error);
        }
      };
      if(!isClearCart){
        clearCartItems();
      }
    }
  }, [success]);

  useEffect(() => {
    if(orderId){
      const updateCardPaymentStatus = async () => {
        try {
          const result = await updatePaymentStatus(orderId); // Call the clearCart function from your context
          if (result.success) {
            console.log("Payment status updated successfully");
            setIsUpdatePaymentStatus(true);
          } else {
            console.error("Error updating payment status:", result.message);
          }
        } catch (error) {
          console.error("Error updating payment status:", error);
        }
      };
      if(!isUpdatePaymentStatus){
        updateCardPaymentStatus();
      }
    }
  },[orderId]);

  if (!success) {
    return <div className="payment-failure">Payment failed. Please try again.</div>;
  }

  return (
    <div className="payment-success-container">
      <div className="payment-success-card">
        <div className="success-icon">
          <svg viewBox="0 0 24 24" className="checkmark">
            <path fill="none" d="M4.1,12.7 9,17.6 20.3,6.3" />
          </svg>
        </div>
        
        <h1>Payment Successful!</h1>
        <p className="success-message">Thank you for your purchase</p>
        
        <div className="order-details">
          <div className="detail-item">
            <span>Order Number:</span>
            <span>{orderNumber}</span>
          </div>
          <div className="detail-item">
            <span>Amount Paid:</span>
            <span>{amount}</span>
          </div>
          <div className="detail-item">
            <span>Date:</span>
            <span>{new Date().toLocaleDateString()}</span>
          </div>
        </div>
        
        <p className="confirmation-text">
          A confirmation email has been sent to your registered email address.
        </p>
        
        <div className="payment-success-action-buttons">
          <Link to="/orders" className="view-order-btn">View Orders</Link>
          <Link to="/shop" className="continue-btn">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
