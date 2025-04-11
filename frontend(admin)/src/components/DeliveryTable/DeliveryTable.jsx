import React, { useState, useEffect } from "react";
import "./DeliveryTable.css";
import { apiContext } from "../../context/apiContext";
import { useNotification } from "../../context/notificationContext";
import { useAuth } from "../../context/authContext";
import { hasPermission, PERMISSIONS } from "../../utils/permissions";

const DeliveryTable = ({ currentPage, setCurrentPage }) => {
  const [deliveries, setDeliveries] = useState([]);
  const [deliveryAgents, setDeliveryAgents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);

  const { userPermissions, handlePermissionCheck } = useAuth();

  // Pagination settings
  const deliveriesPerPage = 10;
  const [paginatedDeliveries, setPaginatedDeliveries] = useState([]);
  const totalPages = Math.ceil(deliveries?.length / deliveriesPerPage);

  const { getAllDeliveries, getDeliveryAgents, assignDeliveryAgent, updateDeliveryStatus } = apiContext();
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

  const TruckIcon = () => (
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
      <rect x="1" y="3" width="15" height="13"></rect>
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
      <circle cx="5.5" cy="18.5" r="2.5"></circle>
      <circle cx="18.5" cy="18.5" r="2.5"></circle>
    </svg>
  );

  // Update paginated deliveries when currentPage or deliveries change
  useEffect(() => {
    if (deliveries && deliveries.length > 0) {
      const startIndex = (currentPage - 1) * deliveriesPerPage;
      const endIndex = startIndex + deliveriesPerPage;
      setPaginatedDeliveries(deliveries.slice(startIndex, endIndex));
      console.log('Paginated Deliveries:', deliveries.slice(startIndex, endIndex));
    } else {
      setPaginatedDeliveries([]);
      console.log('Not Paginated');

    }
  }, [currentPage, deliveries, deliveriesPerPage]);

  // Handle page change
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const fetchDeliveries = async () => {
    try {
      const response = await getAllDeliveries();
      if (response && response.deliveries && Array.isArray(response.deliveries)) {
        setDeliveries(response.deliveries);
        console.log("Deliveries:", response.deliveries);
      } else {
        showNotification("Received invalid deliveries data format", "error");
      }
    } catch (error) {
      showNotification("Failed to retrieve deliveries", "error");
    }
  };

  const fetchDeliveryAgents = async () => {
    try {
      const response = await getDeliveryAgents();
      if (response && response.agents && Array.isArray(response.agents)) {
        setDeliveryAgents(response.agents);
        console.log("Delivery Agents:", response.agents);
        
      } else {
        showNotification("Received invalid delivery agents data format", "error");
      }
    } catch (error) {
      showNotification("Failed to retrieve delivery agents", "error");
    }
  };

  useEffect(() => {
    fetchDeliveries();
    fetchDeliveryAgents();
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

  // Handle opening the modal with delivery details
  const handleDetailsClick = (delivery) => {
    setSelectedDelivery(delivery);
    setIsModalOpen(true);
  };

  // Remove the handleStatusChange function

  // Handle agent assignment
  const handleAgentAssignment = async (deliveryId, agentId) => {
    try {
      const result = await assignDeliveryAgent(deliveryId, agentId);
      if (result.success) {
        showNotification("Delivery agent assigned successfully", "success");
        await fetchDeliveries();
      } else {
        showNotification(result.message || "Failed to assign delivery agent", "error");
      }
    } catch (error) {
      console.error("Failed to assign delivery agent:", error);
      showNotification("Failed to assign delivery agent", "error");
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
          <h2 className="card-title">Deliveries List</h2>
          <span className="delivery-count">{deliveries.length} deliveries</span>
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
                  Delivery ID
                  <ChevronDownIcon />
                </div>
              </th>
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
                  Scheduled Date
                  <ChevronDownIcon />
                </div>
              </th>
              <th>
                <div className="th-content">
                  Delivered Date
                  <ChevronDownIcon />
                </div>
              </th>
              <th>
                <div className="th-content">
                  Delivery Agent
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
            {paginatedDeliveries.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-deliveries">No deliveries found</td>
              </tr>
            ) : (
              paginatedDeliveries.map((delivery) => (
                <tr key={delivery.deliveryId}>
                  <td>#{delivery.deliveryId}</td>
                  <td>#{delivery.orderId}</td>
                  <td>{delivery.customerName}</td>
                  <td className={!delivery.estimatedDate ? 'date-not-available' : ''}>
                    {delivery.estimatedDate ? formatDate(delivery.estimatedDate) : 
                    <span className="not-available-label">NOT-SCHEDULED</span>}
                  </td>
                  <td className={!delivery.deliveredDate ? 'date-not-available' : ''}>
                    {delivery.deliveredDate ? formatDate(delivery.deliveredDate) : 
                    <span className="not-available-label">NOT-DELIVERED</span>}
                  </td>
                  <td>
                    <div className="agent-dropdown-container">
                      <select
                        className="agent-dropdown"
                        value={delivery.assignedAgentId || ""}
                        onChange={(e) => {
                          handlePermissionCheck(
                            PERMISSIONS.EDIT_DELIVERIES,
                            () => handleAgentAssignment(delivery.deliveryId, e.target.value),
                            "You don't have permission to assign delivery agents."
                          );
                        }}
                        disabled={!hasPermission(userPermissions, PERMISSIONS.EDIT_DELIVERIES)}
                      >
                        <option value="">Select Delivery Agent</option>
                        {deliveryAgents.map(agent => (
                          <option key={agent.agentId} value={agent.agentId}>
                            {agent.agentId} - {agent.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td>
                    <div className="status-dropdown-container">
                      <span className={`status-badge status-${delivery.status.toLowerCase().replace(/\s+/g, '-')}`}>
                        {delivery.status}
                      </span>
                    </div>
                  </td>
                  <td>
                    <button
                      className="details-button"
                      onClick={() => handleDetailsClick(delivery)}
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

      {isModalOpen && selectedDelivery && (
        <div className="modal-overlay">
          <div className="modal-container modern-modal">
            <div className="modal-header">
              <div className="modal-title-section">
                <h3>Delivery #{selectedDelivery.deliveryId}</h3>
                <span className={`status-badge status-${selectedDelivery.status.toLowerCase()}`}>
                  {selectedDelivery.status}
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
              <div className="delivery-summary-card">
                <div className="card-section">
                  <div className="section-header">
                    <div className="section-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                    </div>
                    <h4>Delivery Information</h4>
                  </div>
                  
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-label">Order ID</span>
                      <span className="info-value">#{selectedDelivery.orderId}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Scheduled Date</span>
                      <span className="info-value">{formatDate(selectedDelivery.scheduledDate)}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Customer</span>
                      <span className="info-value">{selectedDelivery.customerName}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Phone</span>
                      <span className="info-value">{selectedDelivery.customerPhone}</span>
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
                    <h4>Delivery Address</h4>
                  </div>
                  <p className="address-text">{selectedDelivery.address}</p>
                </div>

                <div className="card-section">
                  <div className="section-header">
                    <div className="section-icon">
                      <TruckIcon />
                    </div>
                    <h4>Delivery Agent</h4>
                  </div>
                  <div className="agent-assign-container">
                    <select
                      className="agent-dropdown-modal"
                      value={selectedDelivery.assignedAgentId || ""}
                      onChange={(e) => {
                        handlePermissionCheck(
                          PERMISSIONS.EDIT_DELIVERIES,
                          () => {
                            handleAgentAssignment(selectedDelivery.deliveryId, e.target.value);
                            setSelectedDelivery({...selectedDelivery, agentId: e.target.value});
                          },
                          "You don't have permission to assign delivery agents."
                        );
                      }}
                      disabled={!hasPermission(userPermissions, PERMISSIONS.EDIT_DELIVERIES)}
                    >
                      <option value="">Select Delivery Agent</option>
                      {deliveryAgents.map(agent => (
                        <option key={agent.agentId} value={agent.agentId}>
                          {agent.agentId} - {agent.name}
                        </option>
                      ))}
                    </select>
                    <div className="agent-hint">
                      {!hasPermission(userPermissions, PERMISSIONS.EDIT_DELIVERIES) ? 
                        <span className="permission-hint">You don't have permission to assign delivery agents</span> :
                        <span className="update-hint">Select an agent to assign to this delivery</span>
                      }
                    </div>
                  </div>
                </div>

                <div className="card-section">
                  <div className="section-header">
                    <div className="section-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline>
                        <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
                      </svg>
                    </div>
                    <h4>Delivery Status</h4>
                  </div>
                  <div className="status-update-container">
                    <span className="status-label">Current Status:</span>
                    <span className={`status-badge status-${selectedDelivery.status.toLowerCase()}`}>
                      {selectedDelivery.status}
                    </span>
                  </div>
                </div>

                {selectedDelivery.notes && (
                  <div className="card-section">
                    <div className="section-header">
                      <div className="section-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                          <line x1="16" y1="13" x2="8" y2="13"></line>
                          <line x1="16" y1="17" x2="8" y2="17"></line>
                          <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                      </div>
                      <h4>Delivery Notes</h4>
                    </div>
                    <p className="notes-text">{selectedDelivery.notes}</p>
                  </div>
                )}
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

export default DeliveryTable;
