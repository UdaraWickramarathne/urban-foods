import React, { useState } from "react";
import "./NotificationTable.css";

const NotificationTable = () => {
  // Sample notification data
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      sender: "John Doe",
      senderRole: "Junior Admin",
      type: "Database Access",
      message: "Request for access to customers database",
      status: "Pending",
      date: "2023-10-15",
      details: "Need access to query customer information for sales report analysis"
    },
    {
      id: 2,
      sender: "Jane Smith",
      senderRole: "Data Analyst",
      type: "Permission Elevation",
      message: "Request for elevated permissions to run stored procedures",
      status: "Pending",
      date: "2023-10-14",
      details: "Require execution permissions on reporting stored procedures for quarterly analysis"
    },
    {
      id: 3,
      sender: "Robert Johnson",
      senderRole: "IT Support",
      type: "Server Access",
      message: "Request for temporary access to production server",
      status: "Accepted",
      date: "2023-10-10",
      details: "Need to perform scheduled maintenance and updates on the database server"
    },
    {
      id: 4,
      sender: "Emily Williams",
      senderRole: "System Analyst",
      type: "Schema Modification",
      message: "Request permission to modify inventory schema",
      status: "Rejected",
      date: "2023-10-08",
      details: "Need to add two new columns to track additional inventory metrics"
    },
    {
      id: 5,
      sender: "Michael Brown",
      senderRole: "Data Manager",
      type: "Data Export",
      message: "Request for permission to export user data",
      status: "Pending",
      date: "2023-10-12",
      details: "Need to create data backup for the monthly archiving process"
    },
    {
      id: 6,
      sender: "Sarah Miller",
      senderRole: "Junior Developer",
      type: "Deployment Access",
      message: "Request access to deployment pipeline",
      status: "Pending",
      date: "2023-10-13",
      details: "Need to deploy bug fixes to the reporting module"
    },
    {
      id: 7,
      sender: "David Wilson",
      senderRole: "Database Admin",
      type: "Index Creation",
      message: "Request to create new indexes on sales table",
      status: "Accepted",
      date: "2023-10-09",
      details: "Planning to optimize query performance by adding composite indexes"
    },
    {
      id: 8,
      sender: "Lisa Taylor",
      senderRole: "Security Officer",
      type: "Security Audit",
      message: "Request for temporary elevated access for security audit",
      status: "Rejected",
      date: "2023-10-07",
      details: "Need to perform quarterly security compliance check on all database objects"
    },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Pagination logic
  const itemsPerPage = 5;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Filter notifications based on search and status filter
  const filteredNotifications = notifications.filter(
    (notification) =>
      (notification.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterStatus === "All" || notification.status === filterStatus)
  );

  const currentNotifications = filteredNotifications.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);

  // Event handlers
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
    setCurrentPage(1);
  };

  const handleViewNotification = (notification) => {
    setSelectedNotification(notification);
    setIsViewModalOpen(true);
  };

  const handleAcceptRequest = (notificationId) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, status: "Accepted" }
          : notification
      )
    );
  };

  const handleRejectRequest = (notificationId) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, status: "Rejected" }
          : notification
      )
    );
  };

  const closeModal = () => {
    setIsViewModalOpen(false);
    setSelectedNotification(null);
  };

  // Icons
  const ViewIcon = () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  );

  const CloseIcon = () => (
    <svg
      width="18"
      height="18"
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

  const StatusBadge = ({ status }) => {
    const className = `status-badge status-${status.toLowerCase()}`;
    return <span className={className}>{status}</span>;
  };

  return (
    <div className="notification-table-container">
      <div className="table-header">
        <h2>Notifications & Requests</h2>
        <div className="toolbar">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>
          <div className="filter-container">
            <select
              value={filterStatus}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      <div className="table-container">
        <table className="notification-table">
          <thead>
            <tr>
              <th>Sender</th>
              <th>Type</th>
              <th>Message</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentNotifications.map((notification) => (
              <tr key={notification.id}>
                <td>{notification.sender}</td>
                <td>{notification.type}</td>
                <td className="message-cell">
                  {notification.message.length > 30
                    ? `${notification.message.substring(0, 30)}...`
                    : notification.message}
                </td>
                <td>
                  <StatusBadge status={notification.status} />
                </td>
                <td>{notification.date}</td>
                <td className="actions-cell">
                  <button
                    className="btn-icon"
                    onClick={() => handleViewNotification(notification)}
                    title="View Details"
                  >
                    <ViewIcon />
                  </button>
                  {notification.status === "Pending" && (
                    <>
                      <button
                        className="btn-accept"
                        onClick={() => handleAcceptRequest(notification.id)}
                        title="Accept Request"
                      >
                        Accept
                      </button>
                      <button
                        className="btn-reject"
                        onClick={() => handleRejectRequest(notification.id)}
                        title="Reject Request"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {currentNotifications.length === 0 && (
              <tr>
                <td colSpan="6" className="no-data">
                  No notifications found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button
          className="pagination-button"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            className={`pagination-button ${
              currentPage === page ? "active" : ""
            }`}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        ))}
        <button
          className="pagination-button"
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>

      {/* View Modal */}
      {isViewModalOpen && selectedNotification && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>Request Details</h3>
              <button className="close-button" onClick={closeModal}>
                <CloseIcon />
              </button>
            </div>
            <div className="modal-body">
              <div className="notification-details">
                <div className="detail-row">
                  <span className="detail-label">Sender:</span>
                  <span className="detail-value">{selectedNotification.sender} ({selectedNotification.senderRole})</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Request Type:</span>
                  <span className="detail-value">{selectedNotification.type}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Message:</span>
                  <span className="detail-value">
                    {selectedNotification.message}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Details:</span>
                  <span className="detail-value">
                    {selectedNotification.details}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Status:</span>
                  <StatusBadge status={selectedNotification.status} />
                </div>
                <div className="detail-row">
                  <span className="detail-label">Date Requested:</span>
                  <span className="detail-value">
                    {selectedNotification.date}
                  </span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              {selectedNotification.status === "Pending" ? (
                <>
                  <button 
                    className="btn-reject" 
                    onClick={() => {
                      handleRejectRequest(selectedNotification.id);
                      closeModal();
                    }}
                  >
                    Reject
                  </button>
                  <button 
                    className="btn-accept" 
                    onClick={() => {
                      handleAcceptRequest(selectedNotification.id);
                      closeModal();
                    }}
                  >
                    Accept
                  </button>
                </>
              ) : (
                <button className="btn-secondary" onClick={closeModal}>
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationTable;
