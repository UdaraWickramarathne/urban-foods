import React, { useState, useEffect } from "react";
import "./SupplierTable.css";
import { apiContext } from "../../context/apiContext";
import { useNotification } from "../../context/notificationContext";
import { DEFAULT_IMAGE, SUPPLIER_IMAGES } from "../../context/constants";

const SupplierTable = ({ currentPage, setCurrentPage }) => {
  // State for modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [editedSupplier, setEditedSupplier] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [newSupplier, setNewSupplier] = useState({
    businessName: '',
    email: '',
    address: '',
    image: null,
    username: '',
    password: ''
  });
  const [imagePreview, setImagePreview] = useState(null);
  // Add state for edited supplier image
  const [editedImagePreview, setEditedImagePreview] = useState(null);
  const [editedImage, setEditedImage] = useState(null);
  // Add states for OTP functionality
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  // Pagination settings
  const suppliersPerPage = 10;
  const [paginatedSuppliers, setPaginatedSuppliers] = useState([]);
  const totalPages = Math.ceil(suppliers.length / suppliersPerPage);
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

  const ImageIcon = () => (
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
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <circle cx="8.5" cy="8.5" r="1.5"></circle>
      <polyline points="21 15 16 10 5 21"></polyline>
    </svg>
  );

  // Update paginated suppliers when currentPage or suppliers change
  useEffect(() => {
    if (suppliers.length > 0) {
      const startIndex = (currentPage - 1) * suppliersPerPage;
      const endIndex = startIndex + suppliersPerPage;
      const paginatedData = suppliers.slice(startIndex, endIndex);
      setPaginatedSuppliers(paginatedData);
    }
  }, [currentPage, suppliers, suppliersPerPage]);

  // Handle page change
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

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

  const { getAllSuppliersWithDetails, updateSupplier, deleteUser, addSupplier, requestOtp,
    verifyOtp, } =
    apiContext();

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await getAllSuppliersWithDetails();
      if (response && response.data) {
        setSuppliers(response.data);

        // Make sure currentPage is set to 1 when data is first loaded
        if (currentPage !== 1) {
          setCurrentPage(1);
        }
      } else {
        console.log("API response is missing data property:", response);
      }
    } catch (error) {
      console.log("Failed to retrieve suppliers:", error);
    }
  };

  // Handle opening the modal with supplier details
  const handleDetailsClick = (supplier) => {
    console.log("Supplier details clicked:", supplier);
  
    setSelectedSupplier(supplier);
    setEditedSupplier({ ...supplier });
    setIsModalOpen(true);
    if(supplier.imageUrl){
      setEditedImagePreview(`${SUPPLIER_IMAGES}/${supplier.imageUrl}`);
    }else{
      setEditedImagePreview('');
    }
    setEditedImage(null);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    if (!editedSupplier) return;

    const { name, value } = e.target;

    setEditedSupplier({
      ...editedSupplier,
      [name]: ["totalSales", "productCount", "successOrderCount"].includes(name)
        ? parseFloat(value)
        : value,
    });
  };

  // Handle image change for existing supplier
  const handleEditedImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditedImage(file);

      // Create a preview URL for the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle save changes
  const handleSaveChanges = async () => {
    if (!editedSupplier) return;

    try {
      // Create form data to handle file upload
      const formData = new FormData();
      formData.append('businessName', editedSupplier.businessName);
      formData.append('email', editedSupplier.email);
      formData.append('address', editedSupplier.address || '');
      

      if (editedImage) {
        formData.append('image', editedImage);
      }
      
      const result = await updateSupplier(editedSupplier.supplierId, formData);
      
      if (result.success) {
        await fetchSuppliers();
        setIsModalOpen(false);
        setSelectedSupplier(null);
        setEditedSupplier(null);
        setEditedImage(null);
        setEditedImagePreview(null);
        showNotification(
          `Supplier ${selectedSupplier.businessName} updated successfully!`
        );
      } else {
        showNotification(
          `Failed to update supplier ${selectedSupplier.businessName}: ${result.message || ''}`,
          "error"
        );
      }
    } catch (error) {
      showNotification(
        `Error updating supplier: ${error.message}`,
        "error"
      );
    }
  };

  // Handle delete supplier
  const handleDeleteSupplier = async () => {
    if (!selectedSupplier) return;

    // Confirm before deleting
    if (
      window.confirm(
        `Are you sure you want to delete ${selectedSupplier.businessName}?`
      )
    ) {
      const result = await deleteUser(selectedSupplier.supplierId);
      if (result.success) {
        const updatedSuppliers = suppliers.filter(
          (supplier) => supplier.supplierId !== selectedSupplier.supplierId
        );
        showNotification(
          `Supplier ${selectedSupplier.businessName} deleted successfully!`
        );
        setSuppliers(updatedSuppliers);
        setIsModalOpen(false);
        setSelectedSupplier(null);
        setEditedSupplier(null);
      } else {
        showNotification(
          `Failed to delete supplier ${selectedSupplier.businessName}`,
          "error"
        );
      }
    }
  };

  // Handle opening the add supplier modal
  const handleAddSupplierClick = () => {
    setNewSupplier({
      businessName: '',
      email: '',
      address: '',
      image: null,
      username: '',
      password: '',
      role: 'supplier'
    });
    setImagePreview(null);
    setIsAddModalOpen(true);
    setOtpSent(false);
    setOtpVerified(false);
    setOtp('');
  };

  // Handle form input changes for new supplier
  const handleNewSupplierChange = (e) => {
    const { name, value } = e.target;
    setNewSupplier({
      ...newSupplier,
      [name]: value,
    });
    
    // If email changes, reset OTP status
    if (name === 'email') {
      setOtpSent(false);
      setOtpVerified(false);
      setOtp('');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewSupplier({
        ...newSupplier,
        image: file
      });

      // Create a preview URL for the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle OTP input change
  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  // Handle send OTP
  const handleSendOtp = async () => {
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newSupplier.email)) {
      showNotification('Please enter a valid email address', 'error');
      return;
    }
    setIsSendingOtp(true);
    try {
      const response = await requestOtp(newSupplier.email);
      if (response.success) {
        setOtpSent(true);
        setIsSendingOtp(false);
        showNotification('OTP sent to your email');
      }else{
        showNotification('Failed to send OTP: ' + response.message, 'error');
        setIsSendingOtp(false);
      }
    } catch (error) {
      showNotification('Error sending OTP: ' + error.message, 'error');
      setIsSendingOtp(false);
    }
  };

  // Handle verify OTP
  const handleVerifyOtp = async () => {
    if (!otp) {
      showNotification('Please enter the OTP', 'error');
      return;
    }

    setIsVerifying(true);
    try {
      const response = await verifyOtp(newSupplier.email, otp);
      if (response.success) {
        setOtpVerified(true);
        showNotification('Email verified successfully');
      } else{
        showNotification('Invalid OTP. Please try again.', 'error');
      }
      setIsVerifying(false);
    } catch (error) {
      showNotification('Error verifying OTP: ' + error.message, 'error');
      setIsVerifying(false);
    }
  };

  // Handle save new supplier
  const handleSaveNewSupplier = async () => {
    // Basic validation
    if (!newSupplier.businessName || !newSupplier.email || !newSupplier.username || !newSupplier.password) {
      showNotification('Business name, email, username and password are required', 'error');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newSupplier.email)) {
      showNotification('Please enter a valid email address', 'error');
      return;
    }

    // Check if OTP is verified
    if (!otpVerified) {
      showNotification('Please verify your email with OTP before adding supplier', 'error');
      return;
    }

    // Password validation - at least 6 characters
    if (newSupplier.password.length < 6) {
      showNotification('Password must be at least 6 characters long', 'error');
      return;
    }

    try {
      // Create form data to handle file upload
      const formData = new FormData();
      formData.append('businessName', newSupplier.businessName);
      formData.append('email', newSupplier.email);
      formData.append('address', newSupplier.address || '');
      formData.append('username', newSupplier.username);
      formData.append('password', newSupplier.password);
      if (newSupplier.image) {
        formData.append('image', newSupplier.image);
      }

      const result = await addSupplier(formData);
      
      if (result.success) {
        setIsAddModalOpen(false);
        showNotification(`Supplier ${newSupplier.businessName} added successfully!`);
        fetchSuppliers();
      } else {
        showNotification(`Failed to add supplier: ${result.message}`, 'error');
      }
    } catch (error) {
      showNotification(`Error adding supplier: ${error.message}`, 'error');
    }
  };

  return (
    <div className="products-card">
      <div className="card-header">
        <div className="card-title-section">
          <h2 className="card-title">Suppliers list</h2>
          <span className="supplier-count">{suppliers.length} suppliers</span>
        </div>

        <div className="card-actions">
          <button className="btn btn-secondary btn-with-icon">
            <FilterIcon />
            Filter
          </button>

          <button className="btn btn-secondary">See All</button>

          <button 
            className="btn btn-primary btn-with-icon"
            onClick={handleAddSupplierClick}
          >
            <PlusIcon />
            Add Supplier
          </button>
        </div>
      </div>

      {/* Suppliers table */}
      <div className="table-container">
        {suppliers.length === 0 ? (
          <div className="no-data-message">Loading suppliers data...</div>
        ) : paginatedSuppliers.length === 0 ? (
          <div className="no-data-message">No suppliers found.</div>
        ) : (
          <table className="products-table">
            <thead>
              <tr>
                <th className="name-cell">
                  <div className="th-content">
                    Supplier Name
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
                    Product Count
                    <ChevronDownIcon />
                  </div>
                </th>
                <th>
                  <div className="th-content">
                    Total Sales
                    <ChevronDownIcon />
                  </div>
                </th>
                <th>
                  <div className="th-content">
                    Success Orders
                    <ChevronDownIcon />
                  </div>
                </th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {paginatedSuppliers.map((supplier) => (
                <tr key={supplier.supplierId}>
                  <td className="name-cell">
                    <div className="supplier-name">{supplier.businessName}</div>
                  </td>
                  <td className="email-cell">{supplier.email}</td>
                  <td className="address-cell">
                    {supplier.address || "No address provided"}
                  </td>
                  <td className="product-count-cell">
                    {supplier.productCount || 0}
                  </td>
                  <td className="total-sales-cell">
                    ${supplier.totalSales?.toFixed(2) || "0.00"}
                  </td>
                  <td className="success-orders-cell">
                    {supplier.successOrderCount || 0}
                  </td>
                  <td>
                    <button
                      className="details-button"
                      onClick={() => handleDetailsClick(supplier)}
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination - Only show if there are suppliers */}
      {suppliers.length > 0 && (
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
      )}

      {/* Supplier Details Modal */}
      {isModalOpen && editedSupplier && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>Supplier Details</h3>
              <button
                className="modal-close-btn"
                onClick={() => setIsModalOpen(false)}
              >
                <CloseIcon />
              </button>
            </div>

            <div className="modal-body">
              {/* Add Image section first */}
              <div className="form-group">
                <label htmlFor="supplier-image">Supplier Image</label>
                <div className="image-upload-container">
                  <div 
                    className="image-upload-area"
                    onClick={() => document.getElementById('supplier-image').click()}
                  >
                    {editedImagePreview ? (
                      <div className="image-preview-container">
                        <img 
                          src={editedImagePreview} 
                          alt="Supplier" 
                          className="image-preview" 
                        />
                      </div>
                    ) : (
                      <div className="upload-placeholder">
                        <ImageIcon />
                        <p>Click to upload image</p>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    id="supplier-image"
                    name="image"
                    onChange={handleEditedImageChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                </div>
                {editedImagePreview && editedImage && (
                  <button 
                    className="btn btn-text"
                    onClick={() => {
                      setEditedImage(null);
                      setEditedImagePreview(selectedSupplier.image || null);
                    }}
                  >
                    Revert to original
                  </button>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="supplier-businessName">Company Name</label>
                <input
                  type="text"
                  id="supplier-businessName"
                  name="businessName"
                  value={editedSupplier.businessName}
                  onChange={handleInputChange}
                  placeholder="Enter company name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="supplier-email">Email</label>
                <input
                  type="email"
                  id="supplier-email"
                  name="email"
                  value={editedSupplier.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="supplier-address">Address</label>
                <textarea
                  id="supplier-address"
                  name="address"
                  value={editedSupplier.address || ""}
                  onChange={handleInputChange}
                  placeholder="Enter supplier address"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label htmlFor="supplier-productCount">Product Count</label>
                <input
                  type="number"
                  id="supplier-productCount"
                  name="productCount"
                  value={editedSupplier.productCount || 0}
                  onChange={handleInputChange}
                  min="0"
                  readOnly
                />
                <small className="form-text text-muted">
                  Number of products supplied
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="supplier-totalSales">Total Sales</label>
                <div className="input-with-prefix">
                  <span className="input-prefix">$</span>
                  <input
                    type="number"
                    id="supplier-totalSales"
                    name="totalSales"
                    value={editedSupplier.totalSales || 0}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    readOnly
                  />
                </div>
                <small className="form-text text-muted">
                  Total value of sales from this supplier
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="supplier-successOrderCount">
                  Success Orders
                </label>
                <input
                  type="number"
                  id="supplier-successOrderCount"
                  name="successOrderCount"
                  value={editedSupplier.successOrderCount || 0}
                  onChange={handleInputChange}
                  min="0"
                  readOnly
                />
                <small className="form-text text-muted">
                  Number of successfully completed orders
                </small>
              </div>
            </div>

            <div className="modal-footer">
              <div className="modal-actions">
                <button
                  className="btn btn-danger btn-with-icon"
                  onClick={handleDeleteSupplier}
                >
                  <TrashIcon />
                  Delete Supplier
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

      {/* Add Supplier Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>Add New Supplier</h3>
              <button
                className="modal-close-btn"
                onClick={() => setIsAddModalOpen(false)}
              >
                <CloseIcon />
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="new-supplier-businessName">Company Name <span className="required">*</span></label>
                <input
                  type="text"
                  id="new-supplier-businessName"
                  name="businessName"
                  value={newSupplier.businessName}
                  onChange={handleNewSupplierChange}
                  placeholder="Enter company name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="new-supplier-username">Username <span className="required">*</span></label>
                <input
                  type="text"
                  id="new-supplier-username"
                  name="username"
                  value={newSupplier.username}
                  onChange={handleNewSupplierChange}
                  placeholder="Enter username"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="new-supplier-password">Password <span className="required">*</span></label>
                <input
                  type="password"
                  id="new-supplier-password"
                  name="password"
                  value={newSupplier.password}
                  onChange={handleNewSupplierChange}
                  placeholder="Enter password"
                  required
                />
                <small className="form-text text-muted">
                  Password must be at least 6 characters long
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="new-supplier-email">Email <span className="required">*</span></label>
                <div className="email-with-verification">
                  <input
                    type="email"
                    id="new-supplier-email"
                    name="email"
                    value={newSupplier.email}
                    onChange={handleNewSupplierChange}
                    placeholder="Enter email address"
                    required
                    disabled={otpSent}
                  />
                  {!otpSent ? (
                    <button 
                      className="btn btn-secondary" 
                      onClick={handleSendOtp}
                      disabled={!newSupplier.email || isSendingOtp}
                    >
                      {isSendingOtp ? 'Sending...' : 'Send OTP'}
                    </button>
                  ) : (
                    <div className="verification-status">
                      {otpVerified ? (
                        <span className="verified-tag">Verified ✓</span>
                      ) : (
                        <button 
                          className="btn btn-text" 
                          onClick={() => {
                            setOtpSent(false);
                            setOtpVerified(false);
                          }}
                        >
                          Change
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {otpSent && !otpVerified && (
                <div className="form-group otp-group">
                  <label htmlFor="email-otp">Verification Code</label>
                  <div className="otp-verification">
                    <input
                      type="text"
                      id="email-otp"
                      value={otp}
                      onChange={handleOtpChange}
                      placeholder="Enter 6-digit OTP"
                      maxLength={6}
                    />
                    <button 
                      className="btn btn-primary" 
                      onClick={handleVerifyOtp}
                      disabled={!otp || isVerifying}
                    >
                      {isVerifying ? 'Verifying...' : 'Verify'}
                    </button>
                  </div>
                  <small className="form-text text-muted">
                    Enter the 6-digit code sent to your email
                  </small>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="new-supplier-address">Address</label>
                <textarea
                  id="new-supplier-address"
                  name="address"
                  value={newSupplier.address || ""}
                  onChange={handleNewSupplierChange}
                  placeholder="Enter supplier address"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label htmlFor="new-supplier-image">Supplier Image</label>
                <div className="image-upload-container">
                  <div 
                    className="image-upload-area"
                    onClick={() => document.getElementById('new-supplier-image').click()}
                  >
                    {imagePreview ? (
                      <div className="image-preview-container">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="image-preview" 
                        />
                      </div>
                    ) : (
                      <div className="upload-placeholder">
                        <ImageIcon />
                        <p>Click to upload image</p>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    id="new-supplier-image"
                    name="image"
                    onChange={handleImageChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                </div>
                {imagePreview && (
                  <button 
                    className="btn btn-text"
                    onClick={() => {
                      setNewSupplier({...newSupplier, image: null});
                      setImagePreview(null);
                    }}
                  >
                    Remove image
                  </button>
                )}
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
                  onClick={handleSaveNewSupplier}
                >
                  Add Supplier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierTable;
