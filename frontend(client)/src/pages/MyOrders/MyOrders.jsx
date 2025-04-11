import React, { useState, useEffect } from 'react';
import './MyOrders.css';
import storeContext from '../../context/storeContext';
import { useNotification } from '../../context/notificationContext';
import { PRODUCT_IMAGES } from '../../context/constants';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const { getOrderByUserId, getOrderItems} = storeContext();

  const {showNotification} = useNotification();

  useEffect(() => {
    // Fetch orders - replace with actual API call
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await getOrderByUserId(); // Replace with your API endpoint
        if(response.success){
          setOrders(response.orders);
        }
        else{
          showNotification(response.message, "error");
        }
      } catch (error) {
        showNotification("An error occurred while fetching orders", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const  fetchOrderItems = async (orderId) => {
    try {
      const response = await getOrderItems(orderId); // Replace with your API endpoint
      if(response.success){
        setSelectedOrder(response.data);
      }
      else{
        showNotification(response.message, "error");
      }
    } catch (error) {
      showNotification("An error occurred while fetching order items", "error");
    }
  }

  const handleOrderClick = async (order) => {
    await fetchOrderItems(order.orderId);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  // Format date to readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="my-orders-container">
      <h1>My Orders</h1>
      
      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="no-orders">
          <div className="empty-bag-icon">🛍️</div>
          <h2>No orders yet</h2>
          <p>Looks like you haven't placed any orders yet.</p>
          <button className="shop-now-btn">Shop Now</button>
        </div>
      ) : (
        <div className="orders-grid">
          {orders.map((order) => (
            <div 
              key={order.orderId} 
              className="order-card"
              onClick={() => handleOrderClick(order)}
            >
              <div className="order-header">
                <span className="order-number">Order #{order.orderId}</span>
                <span className={`order-status ${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </div>
              <div className="order-date">
                <span>📅 {formatDate(order.orderDate)}</span>
              </div>
              <div className="order-items">
                <span>{order.itemCount} items</span>
              </div>
              <div className="order-total">
                <span className="total-label">Total:</span>
                <span className="total-amount">${order.totalAmount.toFixed(2)}</span>
              </div>
              <div className="view-details">
                <span>View Details</span>
                <span className="arrow-icon">→</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && selectedOrder && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="order-details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Order Details</h2>
              <button className="close-modal" onClick={closeModal}>✕</button>
            </div>
            
            <div className="order-info">
              <div className="order-info-item">
                <span className="info-label">Order ID:</span>
                <span className="info-value">#{selectedOrder.order.orderId}</span>
              </div>
              <div className="order-info-item">
                <span className="info-label">Date:</span>
                <span className="info-value">{formatDate(selectedOrder.order.orderDate)}</span>
              </div>
              <div className="order-info-item">
                <span className="info-label">Status:</span>
                <span className={`status-badge ${selectedOrder.order.status.toLowerCase()}`}>
                  {selectedOrder.order.status}
                </span>
              </div>
            </div>
            
            <div className="order-items-list">
              <h3>Items</h3>
              {selectedOrder.items.map((item) => (
                <div key={item.orderItemId} className="order-item">
                  <div className="item-image">
                    <img src={`${PRODUCT_IMAGES}/${item.productImage}`} alt={item.productName} />
                  </div>
                  <div className="item-details">
                    <h4>{item.productName}</h4>
                    <div className="item-meta">
                      <span>Qty: {item.quantity}</span>
                      <span>${item.unitPrice.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="item-total">
                    ${(item.quantity * item.unitPrice).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="order-summary">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>${selectedOrder.order.totalAmount.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping:</span>
                <span>$0.00</span>
              </div>
              <div className="summary-row">
                <span>Tax:</span>
                <span>$0.00</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>${selectedOrder.order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="shipping-address">
              <h3>Shipping Address</h3>
              <p>{selectedOrder.order.address}</p>
            </div>
            
            <div className="modal-actions">
              <button className="track-order-btn">Track Order</button>
              <button className="support-btn">Contact Support</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
