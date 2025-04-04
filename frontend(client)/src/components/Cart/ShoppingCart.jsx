import React, { useContext, useState } from "react";
import './ShoppingCart.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { CartContext } from "../../context/CartContext";
import { PRODUCT_IMAGES } from "../../context/constants";
import { useNavigate } from "react-router-dom";
import storeContext from "../../context/storeContext";
import { useNotification } from "../../context/notificationContext";

export default function ShoppingCart() {

  const {cartItems, updateQuantity, removeFromCart} =  useContext(CartContext)
  const navigate = useNavigate();
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discount = 0;
  const total = subtotal - discount;

  const {showNotification} = useNotification();

  // Add state for payment method and address);
  const [paymentMethod, setPaymentMethod] = useState("creditCard");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");

  const {handleCheckout, userId} = storeContext();

  const handleQuantityChange =  async (product, change) => {
    if(change === 'increase') {
      await updateQuantity(product.productId, product.quantity + 1);
    }else if(change === 'decrease') {
      if(product.quantity > 1) {
        await updateQuantity(product.productId, product.quantity - 1);
      }else {
        await removeFromCart(product.productId);
      }
    }
  };

  const handleRemoveItem = async (productId) => {
    await removeFromCart(productId);
  };

  const handlePayment = async () => {
    // Validate inputs
    if (!address || !city || !zipCode) {
      showNotification("Please fill in all shipping details", "error");
      return;
    }
    // Prepare order data
    const orderData = {
      userId: userId,
      totalAmount: total,
      paymentMethod: paymentMethod === "creditCard" ? "CARD" : "COD",
      address: address + ", " + city + ", " + zipCode,
    };

    // Process checkout
    try {
      const result = await handleCheckout(orderData);
      
      if (result.success) {
        if (paymentMethod === "creditCard" && result.sessionUrl) {
          // Redirect to Stripe checkout
          window.location.href = result.sessionUrl;
        } else {
          // For COD, redirect to success page
          navigate(`/payment-success?success=true&orderId=${result.orderId}`);
        }
      } else {
        showNotification("Checkout failed: " + result.message, "error");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      showNotification("Checkout error: " + error.message, "error");
    }
  };

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1><i className="fas fa-shopping-cart"></i> Your Shopping Cart</h1>
        <p>{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart</p>
      </div>

      <div className="cart-content">
        <div className="shopping-cart-items">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <i className="fas fa-shopping-basket"></i>
              <p>Your cart is empty</p>
              <button className="continue-shopping" onClick={()=>navigate('/shop')}>Continue Shopping</button>
            </div>
          ) : (
            <>
              {cartItems.map((item, index) => (
                <div className="cart-item-card" key={item.productId}>
                  <div className="item-image">
                    <img
                      src={`${PRODUCT_IMAGES}/${item.imageUrl}`}
                      alt={item.name}
                    />
                  </div>
                  <div className="item-details">
                    <h3>{item.name}</h3>
                    <p>Category: <span>{item.category}</span></p>
                    <div className="item-price">Rs.{item.price.toFixed(2)}</div>
                  </div>
                  <div className="item-controls">
                    <div className="quantity-control">
                      <button 
                        onClick={() => handleQuantityChange(item, 'decrease')}
                        className="quantity-btn minus"
                      >
                        <i className="fas fa-minus"></i>
                      </button>
                      <span className="quantity">{item.quantity}</span>
                      <button 
                        onClick={() => handleQuantityChange(item, 'increase')}
                        className="quantity-btn plus"
                      >
                        <i className="fas fa-plus"></i>
                      </button>
                    </div>
                    <div className="item-total">
                      Rs.{(item.price * item.quantity).toFixed(2)}
                    </div>
                    <button 
                      className="remove-item" 
                      onClick={() => handleRemoveItem(item.productId)}
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        <div className="cart-summary">
          <div className="summary-header">
            <h2>Order Summary</h2>
          </div>
          
          <div className="coupon-section">
            <input type="text" placeholder="Enter Coupon Code" className="input-field" />
            <button className="apply-button">Apply</button>
          </div>
          
          <div className="shopping-cart-total">
            <div className="total-row">
              <span>Subtotal</span>
              <span>Rs.{subtotal.toFixed(2)}</span>
            </div>
            <div className="total-row">
              <span>Discount</span>
              <span>-Rs.{discount.toFixed(2)}</span>
            </div>
            <div className="total-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="total-row grand-total">
              <span>Total</span>
              <span>Rs.{total.toFixed(2)}</span>
            </div>
          </div>

          <div className="shipping-info">
            <h3>Shipping Information</h3>
            <div className="form-group">
              <input 
                type="text" 
                placeholder="Address" 
                className="input-field" 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
            <div className="form-row">
              <input 
                type="text" 
                placeholder="City" 
                className="input-field" 
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
              <input 
                type="text" 
                placeholder="ZIP Code" 
                className="input-field" 
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="payment-method">
            <h3>Payment Method</h3>
            <div className="payment-options">
              <div className="payment-option">
                <input
                  type="radio"
                  id="creditCard"
                  name="paymentMethod"
                  value="creditCard"
                  checked={paymentMethod === "creditCard"}
                  onChange={() => setPaymentMethod("creditCard")}
                />
                <label htmlFor="creditCard">
                  <i className="far fa-credit-card"></i> Credit Card
                </label>
              </div>
              <div className="payment-option">
                <input
                  type="radio"
                  id="cashOnDelivery"
                  name="paymentMethod"
                  value="cashOnDelivery"
                  checked={paymentMethod === "cashOnDelivery"}
                  onChange={() => setPaymentMethod("cashOnDelivery")}
                />
                <label htmlFor="cashOnDelivery">
                  <i className="fas fa-money-bill-wave"></i> Cash on Delivery
                </label>
              </div>
            </div>
          </div>
          
          <button className="checkout-button" onClick={handlePayment}>
            <i className="fas fa-lock"></i> Secure Checkout
          </button>
        </div>
      </div>

      <div className="cart-footer">
        <div className="footer-item">
          <i className="fas fa-shipping-fast"></i>
          <div>
            <span className="footer-title">Free Shipping</span>
            <p>On orders over Rs.5000</p>
          </div>
        </div>
        <div className="footer-item">
          <i className="fas fa-phone-alt"></i>
          <div>
            <span className="footer-title">Call Us Anytime</span>
            <p>+94 555 55555</p>
          </div>
        </div>
        <div className="footer-item">
          <i className="fas fa-comments"></i>
          <div>
            <span className="footer-title">Chat With Us</span>
            <p>24/7 Support</p>
          </div>
        </div>
        <div className="footer-item">
          <i className="fas fa-gift"></i>
          <div>
            <span className="footer-title">Gift Cards</span>
            <p>For your loved ones</p>
          </div>
        </div>
      </div>
    </div>
  );
}