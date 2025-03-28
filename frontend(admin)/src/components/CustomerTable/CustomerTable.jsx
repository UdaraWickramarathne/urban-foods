import React, { useState, useEffect } from "react";
import "./CustomerTable.css";
import { apiContext } from "../../context/apiContext";
import { useNotification } from "../../context/notificationContext";

const CustomerTable = ({ currentPage, setCurrentPage }) => {
  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [editedCustomer, setEditedCustomer] = useState(null);

  // Add Customer Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    address: '',
    customerImage: null
  });
  const [emailVerified, setEmailVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  const [customers, setCustomers] = useState([]);

  // Pagination settings
  const customersPerPage = 10;
  const [paginatedCustomers, setPaginatedCustomers] = useState([]);
  const totalPages = Math.ceil(customers.length / customersPerPage);

  const { getCustomers, addCustomer, requestOtp, verifyOtp, deleteCustomer } = apiContext();

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

  const PlusIcon = () => (
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
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
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

  const TrashIcon = () => (
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
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1-2-2h4a2 2 0 0 1-2 2v2"></path>
    </svg>
  );

  // Update paginated customers when currentPage or customers change
  useEffect(() => {
    const startIndex = (currentPage - 1) * customersPerPage;
    const endIndex = startIndex + customersPerPage;
    setPaginatedCustomers(customers.slice(startIndex, endIndex));
  }, [currentPage, customers]);

  // Handle page change
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const fetchCustomers = async () => {
    try {
      const customers = await getCustomers();
      setCustomers(customers.data);
    } catch (error) {
      console.log("Failed to retrieve customers:", error);
    }
  };

  useEffect(() => {
    fetchCustomers();
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

  // Handle opening the modal with customer details
  const handleDetailsClick = (customer) => {
    setSelectedCustomer(customer);
    setEditedCustomer({ ...customer });
    setIsModalOpen(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    if (!editedCustomer) return;

    const { name, value } = e.target;

    setEditedCustomer({
      ...editedCustomer,
      [name]: name === "totalSpends" ? parseFloat(value) : value,
    });
  };

  // Handle save changes
  const handleSaveChanges = () => {
    if (!editedCustomer) return;

    // Here you would typically make an API call to update the customer
    // For now, we'll just update the local state
    const updatedCustomers = customers.map((customer) =>
      customer.customerId === editedCustomer.customerId ? editedCustomer : customer
    );

    console.log("Updated customers:", updatedCustomers);

    setIsModalOpen(false);
    setSelectedCustomer(null);
    setEditedCustomer(null);

    alert("Customer updated successfully!");
  };

  // Handle delete customer
  const handleDeleteCustomer = async () => {
    if (!selectedCustomer) return;

    if (
      window.confirm(
        `Are you sure you want to delete ${selectedCustomer.firstName} ${selectedCustomer.lastName}?`
      )
    ) {
      const deleteResult = await deleteCustomer(selectedCustomer.customerId);
      if (deleteResult.success) {
        setIsModalOpen(false);
        setSelectedCustomer(null);
        setEditedCustomer(null);
        showNotification("Customer deleted successfully", "success");
        await fetchCustomers();
      }else{
        showNotification("Failed to delete customer", "error");
      }
    }
  };

  // Handle opening the add customer modal
  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  // Handle form input changes for new customer
  const handleNewCustomerInputChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer({
      ...newCustomer,
      [name]: value,
    });
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewCustomer({
        ...newCustomer,
        customerImage: file
      });
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle request OTP
  const handleRequestOTP = async () => {
    if (newCustomer.email && /\S+@\S+\.\S+/.test(newCustomer.email)) {
      const otpResult = await requestOtp(newCustomer.email);
      if (otpResult.success) {
        setOtpSent(true);
        showNotification("OTP sent to your email", "success");
      }
    } else {
      alert("Please enter a valid email address");
      showNotification("Please enter a valid email address", "error");
    }
  };

  // Handle verify OTP
  const handleVerifyOTP = async () => {
    const otpResult = await verifyOtp(newCustomer.email, otp);
    if (otpResult.success) {
      setEmailVerified(true);
      showNotification("Email verified successfully", "success");
    } else {
      showNotification("Invalid OTP. Please try again.", "error");
    }
  };

  // Handle add new customer
  const handleAddCustomer = async () => {
    if (!newCustomer.firstName || !newCustomer.lastName || !newCustomer.email || 
        !newCustomer.username || !newCustomer.password || !emailVerified) {
      alert("Please fill all required fields and verify your email");
      return;
    }
    //create a formdata object to send the image and other data
    const formData = new FormData();
    formData.append('firstName', newCustomer.firstName);
    formData.append('lastName', newCustomer.lastName);
    formData.append('email', newCustomer.email);
    formData.append('username', newCustomer.username);
    formData.append('password', newCustomer.password);
    formData.append('address', newCustomer.address);
    formData.append('image', newCustomer.customerImage);
    formData.append('role', 'customer');
    
    const result = await addCustomer(formData);
    if (result.success) {
      console.log("Customer added successfully", result.message);
      showNotification("Customer added successfully", "success");
      await fetchCustomers();
    }else{
      console.log("Failed to add customer", result.message);
      showNotification("Failed to add customer", "error");
      return;
    }
    setNewCustomer({
      firstName: '',
      lastName: '',
      email: '',
      username: '',
      password: '',
      address: '',
      customerImage: null
    });
    setEmailVerified(false);
    setOtpSent(false);
    setOtp('');
    setImagePreview(null);
    setIsAddModalOpen(false);
  };

  return (
    <div className="products-card">
      <div className="card-header">
        <div className="card-title-section">
          <h2 className="card-title">Customers list</h2>
          <span className="customer-count">{customers.length} customers</span>
        </div>

        <div className="card-actions">
          <button className="btn btn-secondary btn-with-icon">
            <FilterIcon />
            Filter
          </button>

          <button className="btn btn-secondary">See All</button>

          <button className="btn btn-primary btn-with-icon" onClick={handleOpenAddModal}>
            <PlusIcon />
            Add Customer
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="products-table">
          <thead>
            <tr>
              <th className="name-cell">
                <div className="th-content">
                  Full Name
                  <ChevronDownIcon />
                </div>
              </th>
              <th>
                <div className="th-content">
                  Email
                  <ChevronDownIcon />
                </div>
              </th>
              <th>
                <div className="th-content">
                  Address
                  <ChevronDownIcon />
                </div>
              </th>
              <th>
                <div className="th-content">
                  Total Spends
                  <ChevronDownIcon />
                </div>
              </th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {paginatedCustomers.map((customer) => (
              <tr key={customer.customerId}>
                <td className="name-cell">
                  <div className="customer-name">
                    {`${customer.firstName} ${customer.lastName}`}
                  </div>
                </td>
                <td className="email-cell">{customer.email}</td>
                <td className="address-cell">
                  {customer.address || "No address provided"}
                </td>
                <td className="total-spends-cell">
                  $
                  {customer.totalSpends
                    ? customer.totalSpends.toFixed(2)
                    : "0.00"}
                </td>
                <td>
                  <button
                    className="details-button"
                    onClick={() => handleDetailsClick(customer)}
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
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

      {isModalOpen && editedCustomer && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>Customer Details</h3>
              <button
                className="modal-close-btn"
                onClick={() => setIsModalOpen(false)}
              >
                <CloseIcon />
              </button>
            </div>

            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="customer-firstName">First Name</label>
                  <input
                    type="text"
                    id="customer-firstName"
                    name="firstName"
                    value={editedCustomer.firstName || ''}
                    onChange={handleInputChange}
                    placeholder="Enter first name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="customer-lastName">Last Name</label>
                  <input
                    type="text"
                    id="customer-lastName"
                    name="lastName"
                    value={editedCustomer.lastName || ''}
                    onChange={handleInputChange}
                    placeholder="Enter last name"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="customer-email">Email</label>
                <input
                  type="email"
                  id="customer-email"
                  name="email"
                  value={editedCustomer.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="customer-address">Address</label>
                <textarea
                  id="customer-address"
                  name="address"
                  value={editedCustomer.address || ""}
                  onChange={handleInputChange}
                  placeholder="Enter customer address"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label htmlFor="customer-totalSpends">Total Spends ($)</label>
                <input
                  type="number"
                  id="customer-totalSpends"
                  name="totalSpends"
                  value={editedCustomer.totalSpends || 0}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  readOnly
                />
                <small className="form-text text-muted">
                  This value is calculated automatically from orders
                </small>
              </div>
            </div>

            <div className="modal-footer">
              <div className="modal-actions">
                <button
                  className="btn btn-danger btn-with-icon"
                  onClick={handleDeleteCustomer}
                >
                  <TrashIcon />
                  Delete Customer
                </button>

                <button
                  className="btn btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleSaveChanges}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>Add New Customer</h3>
              <button
                className="modal-close-btn"
                onClick={() => setIsAddModalOpen(false)}
              >
                <CloseIcon />
              </button>
            </div>

            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="new-customer-firstName">First Name*</label>
                  <input
                    type="text"
                    id="new-customer-firstName"
                    name="firstName"
                    value={newCustomer.firstName}
                    onChange={handleNewCustomerInputChange}
                    placeholder="Enter first name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="new-customer-lastName">Last Name*</label>
                  <input
                    type="text"
                    id="new-customer-lastName"
                    name="lastName"
                    value={newCustomer.lastName}
                    onChange={handleNewCustomerInputChange}
                    placeholder="Enter last name"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="new-customer-email">Email*</label>
                <div className="email-verification-container">
                  <input
                    type="email"
                    id="new-customer-email"
                    name="email"
                    value={newCustomer.email}
                    onChange={handleNewCustomerInputChange}
                    placeholder="Enter email address"
                    required
                    disabled={emailVerified}
                    className={emailVerified ? "verified-input" : ""}
                  />
                  <button 
                    className="btn btn-secondary" 
                    onClick={handleRequestOTP}
                    disabled={emailVerified || !newCustomer.email}
                  >
                    {emailVerified ? "Verified" : "Request OTP"}
                  </button>
                </div>
              </div>

              {otpSent && !emailVerified && (
                <div className="form-group">
                  <label htmlFor="new-customer-otp">Verification Code*</label>
                  <div className="email-verification-container">
                    <input
                      type="text"
                      id="new-customer-otp"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter OTP from email"
                      required
                    />
                    <button 
                      className="btn btn-secondary" 
                      onClick={handleVerifyOTP}
                    >
                      Verify
                    </button>
                  </div>
                </div>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="new-customer-username">Username*</label>
                  <input
                    type="text"
                    id="new-customer-username"
                    name="username"
                    value={newCustomer.username}
                    onChange={handleNewCustomerInputChange}
                    placeholder="Enter username"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="new-customer-password">Password*</label>
                  <input
                    type="password"
                    id="new-customer-password"
                    name="password"
                    value={newCustomer.password}
                    onChange={handleNewCustomerInputChange}
                    placeholder="Enter password"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="new-customer-address">Address</label>
                <textarea
                  id="new-customer-address"
                  name="address"
                  value={newCustomer.address}
                  onChange={handleNewCustomerInputChange}
                  placeholder="Enter customer address"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label htmlFor="new-customer-image">Customer Image</label>
                <div className="image-upload-container">
                  <input
                    type="file"
                    id="new-customer-image"
                    name="customerImage"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  {imagePreview && (
                    <div className="image-preview">
                      <img src={imagePreview} alt="Customer preview" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <div className="modal-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-primary" 
                  onClick={handleAddCustomer}
                  disabled={!emailVerified}
                >
                  Add Customer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerTable;
