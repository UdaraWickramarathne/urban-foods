import React, { useState, useEffect } from "react";
import "./OrderTable.css";
import { apiContext } from "../../context/apiContext";
import { useNotification } from "../../context/notificationContext";
import { useAuth } from "../../context/authContext";
import { hasPermission, PERMISSIONS } from "../../utils/permissions";

const OrderTable = ({ currentPage, setCurrentPage }) => {
  const [orders, setOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const { userPermissions, handlePermissionCheck } = useAuth();

  // Pagination settings
  const ordersPerPage = 10;
  const [paginatedOrders, setPaginatedOrders] = useState([]);
  const totalPages = Math.ceil(orders?.length / ordersPerPage);

  const { getOrders, updateOrderStatus } = apiContext();
  const { showNotification } = useNotification();

  // Icons
  const ChevronDownIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  );

  const FilterIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
    </svg>
  );

  const PrevIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
  );

  const NextIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  );

  const CloseIcon = () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );

  // Update paginated orders when currentPage or orders change
  useEffect(() => {
    if (orders && orders.length > 0) {
      const startIndex = (currentPage - 1) * ordersPerPage;
      const endIndex = startIndex + ordersPerPage;
      setPaginatedOrders(orders.slice(startIndex, endIndex));
    } else {
      setPaginatedOrders([]);
    }
  }, [currentPage, orders, ordersPerPage]);

  // Handle page change
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const fetchOrders = async () => {
    try {
      const response = await getOrders();
      if (response && response.orders && Array.isArray(response.orders)) {
        setOrders(response.orders);
      } else {
        showNotification("Received invalid orders data format", "error");
      }
    } catch (error) {
      showNotification("Failed to retrieve orders", "error");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Generate page numbers array
  const getPageNumbers = () => {
    const pageNumbers = [];

    if (totalPages <= 7) {
      // Show all page numbers if 7 or less
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);

      if (currentPage > 3) {
        pageNumbers.push("...");
      }

      // Calculate start and end of middle section
      const startMiddle = Math.max(2, currentPage - 1);
      const endMiddle = Math.min(totalPages - 1, currentPage + 1);

      // Add middle section
      for (let i = startMiddle; i <= endMiddle; i++) {
        pageNumbers.push(i);
      }

      if (currentPage < totalPages - 2) {
        pageNumbers.push("...");
      }

      // Always show last page
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  // Handle opening the modal with order details
  const handleDetailsClick = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  // Handle status change
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const result = await updateOrderStatus(orderId, { status: newStatus });
      if (result.success) {
        showNotification("Order status updated successfully", "success");
        await fetchOrders();
      } else {
        showNotification(result.message || "Failed to update order status", "error");
      }
    } catch (error) {
      console.error("Failed to update order status:", error);
      showNotification("Failed to update order status", "error");
    }
  };

  // Format date from ISO string to readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="products-card">
      <div className="card-header">
        <div className="card-title-section">
          <h2 className="card-title">Orders List</h2>
          <span className="order-count">{orders.length} orders</span>
        </div>

        <div className="card-actions">
          <button className="btn btn-secondary btn-with-icon">
            <FilterIcon />
            Filter
          </button>

          <button className="btn btn-secondary">See All</button>
        </div>
      </div>

      <div className="table-container">
        <table className="products-table">
          <thead>
            <tr>
              <th>
                <div className="th-content">
                  Order ID
                  <ChevronDownIcon />
                </div>
              </th>
              <th>
                <div className="th-content">
                  Customer
                  <ChevronDownIcon />
                </div>
              </th>
              <th>
                <div className="th-content">
                  Date
                  <ChevronDownIcon />
                </div>
              </th>
              <th>
                <div className="th-content">
                  Total
                  <ChevronDownIcon />
                </div>
              </th>
              <th>
                <div className="th-content">
                  Items
                  <ChevronDownIcon />
                </div>
              </th>
              <th>
                <div className="th-content">
                  Status
                  <ChevronDownIcon />
                </div>
              </th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {paginatedOrders.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-orders">No orders found</td>
              </tr>
            ) : (
              paginatedOrders.map((order) => (
                <tr key={order.orderId}>
                  <td>#{order.orderId}</td>
                  <td>{order.customerName}</td>
                  <td>{formatDate(order.orderDate)}</td>
                  <td>${order.totalAmount.toFixed(2)}</td>
                  <td>{order.itemCount} items</td>
                  <td>
                    <div className="status-dropdown-container">
                      <select
                        className={`status-dropdown status-${order.status.toLowerCase()}`}
                        value={order.status}
                        onChange={(e) => {
                          handlePermissionCheck(
                            PERMISSIONS.EDIT_ORDERS,
                            () => handleStatusChange(order.orderId, e.target.value),
                            "You don't have permission to update order status."
                          );
                        }}
                        disabled={!hasPermission(userPermissions, PERMISSIONS.EDIT_ORDERS)}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="CANCELED">CANCELED</option>
                      </select>
                    </div>
                  </td>
                  <td>
                    <button
                      className="details-button"
                      onClick={() => handleDetailsClick(order)}
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination-container">
        <button
          className="btn btn-pagination"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <PrevIcon />
          Previous
        </button>

        <div className="pagination-numbers">
          {getPageNumbers().map((page, index) =>
            page === "..." ? (
              <span key={`ellipsis-${index}`} className="pagination-dots">
                ...
              </span>
            ) : (
              <button
                key={`page-${page}`}
                className={`page-number ${
                  currentPage === page ? "active" : ""
                }`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            )
          )}
        </div>

        <button
          className="btn btn-pagination"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
          <NextIcon />
        </button>
      </div>

      {isModalOpen && selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-container modern-modal">
            <div className="modal-header">
              <div className="modal-title-section">
                <h3>Order #{selectedOrder.orderId}</h3>
                <span className={`status-badge status-${selectedOrder.status.toLowerCase()}`}>
                  {selectedOrder.status}
                </span>
              </div>
              <button
                className="modal-close-btn"
                onClick={() => setIsModalOpen(false)}
              >
                <CloseIcon />
              </button>
            </div>

            <div className="modal-body">
              <div className="order-summary-card">
                <div className="card-section">
                  <div className="section-header">
                    <div className="section-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                    </div>
                    <h4>Order Information</h4>
                  </div>
                  
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-label">Date</span>
                      <span className="info-value">{formatDate(selectedOrder.orderDate)}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Customer</span>
                      <span className="info-value">{selectedOrder.customerName}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Total Amount</span>
                      <span className="info-value highlight">${selectedOrder.totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Items</span>
                      <span className="info-value">{selectedOrder.itemCount} items</span>
                    </div>
                  </div>
                </div>

                <div className="card-section">
                  <div className="section-header">
                    <div className="section-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                    </div>
                    <h4>Shipping Address</h4>
                  </div>
                  <p className="address-text">{selectedOrder.address}</p>
                </div>

                <div className="card-section">
                  <div className="section-header">
                    <div className="section-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline>
                        <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
                      </svg>
                    </div>
                    <h4>Order Status</h4>
                  </div>
                  <div className="status-update-container">
                    <span className="status-label">Current Status:</span>
                    <select
                      className={`status-dropdown status-${selectedOrder.status.toLowerCase()}`}
                      value={selectedOrder.status}
                      onChange={(e) => {
                        handlePermissionCheck(
                          PERMISSIONS.EDIT_ORDERS,
                          () => handleStatusChange(selectedOrder.orderId, e.target.value),
                          "You don't have permission to update order status."
                        );
                        setSelectedOrder({...selectedOrder, status: e.target.value});
                      }}
                      disabled={!hasPermission(userPermissions, PERMISSIONS.EDIT_ORDERS)}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="COMPLETE">COMPLETE</option>
                      <option value="CANCELED">CANCELED</option>
                    </select>
                    <div className="status-hint">
                      {!hasPermission(userPermissions, PERMISSIONS.EDIT_ORDERS) ? 
                        <span className="permission-hint">You don't have permission to change the order status</span> :
                        <span className="update-hint">Change the status to update this order</span>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-primary"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTable;
