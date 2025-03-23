import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import './ShoppingCart.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const stripePromise = loadStripe(process.env.STRIPE_PUB_KEY);

export default function ShoppingCart() {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Floral Print Wrap Dress", color: "Blue", size: 42, price: 20.5, quantity: 2 },
    { id: 2, name: "Floral Print Wrap Dress", color: "Blue", size: 42, price: 30.5, quantity: 1 },
    { id: 3, name: "Striped T-Shirt", color: "Red", size: "M", price: 15.0, quantity: 3 },
  ]);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discount = 4;
  const total = subtotal - discount;

  const handleQuantityChange = (index, change) => {
    setCartItems((prevItems) => {
      const updatedItems = [...prevItems];
      const newQuantity = updatedItems[index].quantity + change;
      if (newQuantity > 0) {
        updatedItems[index].quantity = newQuantity;
      }
      return updatedItems;
    });
  };

  const handleCreditCardPayment = async () => {
    const stripe = await stripePromise;

    const items = cartItems.map((item) => ({
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    }));

    try {
      const response = await fetch("http://localhost:5000/api/payment/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url; // Redirect to Stripe Checkout
      }
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  return (
    <div className="cartcontainer">
      <div className="cart-content">
        <div className="cart-items">
          <table className="cart-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Unit Price</th>
                <th>Quantity</th>
                <th>Total Price</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item, index) => (
                <tr key={item.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <img
                        src={`src/assets/bread.png`}
                        alt={item.name}
                        style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "5px" }}
                      />
                      <div>
                        <p>{item.name}</p>
                        <p className="item-details">Color: {item.color} | Size: {item.size}</p>
                      </div>
                    </div>
                  </td>
                  <td>Rs.{item.price.toFixed(2)}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                      <button
                        onClick={() => handleQuantityChange(index, -1)}
                        style={{
                          border: "none",
                          background: "none",
                          cursor: "pointer",
                          fontSize: "16px",
                        }}
                      >
                        <i className="fas fa-minus-circle" style={{ color: "red" }}></i>
                      </button>
                      {item.quantity}
                      <button
                        onClick={() => handleQuantityChange(index, 1)}
                        style={{
                          border: "none",
                          background: "none",
                          cursor: "pointer",
                          fontSize: "16px",
                        }}
                      >
                        <i className="fas fa-plus-circle" style={{ color: "green" }}></i>
                      </button>
                    </div>
                  </td>
                  <td>Rs.{(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="cart-summary">
          <form className="checkout-form">
            <input type="text" placeholder="State / City" className="input-field" />
            <input type="text" placeholder="ZIP Code" className="input-field" />
            <button className="update-button">Update</button>
            <input type="text" placeholder="Enter Coupon Code" className="input-field" />
            <button className="apply-button">Apply</button>
          </form>
          <div className="cart-total">
            <h1>Cart Total</h1>
            <p>Subtotal: Rs.{subtotal.toFixed(2)}</p>
            <p>Discount: -Rs.{discount.toFixed(2)}</p>
            <p className="total-amount">Total: Rs.{total.toFixed(2)}</p>
          </div>

          {/* Payment Method Section */}
          <div className="payment-method">
            <h2>Payment Method</h2>
            <div>
              <label>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="creditCard"
                  onChange={handleCreditCardPayment} // Trigger payment on selection
                />
                Credit Card
              </label>
            </div>
            <div>
              <label>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cashOnDelivery"
                />
                Cash on Delivery
              </label>
            </div>
          </div>
          <button className="checkout-button">Checkout</button>
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