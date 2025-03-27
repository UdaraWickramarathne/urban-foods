import React, { useState, useEffect } from "react";
import "./SupplierTable.css";
import { apiContext } from "../../context/apiContext";

const SupplierTable = ({ currentPage, setCurrentPage }) => {
  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [editedSupplier, setEditedSupplier] = useState(null);
  const [suppliers, setSuppliers] = useState([]);

  // Pagination settings
  const suppliersPerPage = 10;
  const [paginatedSuppliers, setPaginatedSuppliers] = useState([]);
  const totalPages = Math.ceil(suppliers.length / suppliersPerPage);

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
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
  );

  // Update paginated suppliers when currentPage or suppliers change
  useEffect(() => {
    if (suppliers.length > 0) {
      const startIndex = (currentPage - 1) * suppliersPerPage;
      const endIndex = startIndex + suppliersPerPage;
      const paginatedData = suppliers.slice(startIndex, endIndex);
      setPaginatedSuppliers(paginatedData);
      console.log("Updated paginatedSuppliers:", paginatedData);
    }
  }, [currentPage, suppliers, suppliersPerPage]);

  // Handle page change
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  useEffect(() => {
    console.log("paginatedSuppliers", paginatedSuppliers);
  }, [paginatedSuppliers]);

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

  const { getAllSuppliersWithDetails } = apiContext();

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await getAllSuppliersWithDetails();
      console.log("API Response:", response);

      if (response && response.data) {
        console.log("Suppliers retrieved successfully:", response.data);
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
    setSelectedSupplier(supplier);
    setEditedSupplier({ ...supplier });
    setIsModalOpen(true);
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

  // Handle save changes
  const handleSaveChanges = () => {
    if (!editedSupplier) return;

    // Here you would typically make an API call to update the supplier
    // For now, we'll just update the local state
    const updatedSuppliers = suppliers.map((supplier) =>
      supplier.supplierId === editedSupplier.supplierId
        ? editedSupplier
        : supplier
    );

    setSuppliers(updatedSuppliers);
    setIsModalOpen(false);
    setSelectedSupplier(null);
    setEditedSupplier(null);

    // Display a success message (in a real app, use a proper toast notification)
    alert("Supplier updated successfully!");
  };

  // Handle delete supplier
  const handleDeleteSupplier = () => {
    if (!selectedSupplier) return;

    // Confirm before deleting
    if (
      window.confirm(
        `Are you sure you want to delete ${selectedSupplier.businessName}?`
      )
    ) {
      // Here you would typically make an API call to delete the supplier
      // For now, we'll just update the local state
      const updatedSuppliers = suppliers.filter(
        (supplier) => supplier.supplierId !== selectedSupplier.supplierId
      );

      setSuppliers(updatedSuppliers);
      setIsModalOpen(false);
      setSelectedSupplier(null);
      setEditedSupplier(null);

      // Display a success message (in a real app, use a proper toast notification)
      alert("Supplier deleted successfully!");
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

          <button className="btn btn-primary btn-with-icon">
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
              <button
                className="btn btn-danger btn-with-icon"
                onClick={handleDeleteSupplier}
              >
                <TrashIcon />
                Delete Supplier
              </button>
              <div className="modal-actions">
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
    </div>
  );
};

export default SupplierTable;
