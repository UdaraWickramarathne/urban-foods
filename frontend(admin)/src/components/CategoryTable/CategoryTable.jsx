import React, { useState, useEffect } from "react";
import "./CategoryTable.css";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { adminContext } from "../../context/adminContext.js";

const CategoryTable = ({ currentPage, setCurrentPage }) => {
  // State for modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editedCategory, setEditedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    productCount: 0,
  });

  // Add loading states
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success", // 'success', 'error', 'warning', 'info'
  });

  // Pagination settings
  const categoriesPerPage = 10;
  const [paginatedCategories, setPaginatedCategories] = useState([]);
  const totalPages = Math.ceil(categories.length / categoriesPerPage);

  const { addCategory, getAllCategories, deleteCategory, updateCategory } = adminContext();

  // Show notification function
  const showNotification = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  // Handle snackbar close
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  // Extract getCategories function outside useEffect so it can be reused
  const getCategories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedCategories = await getAllCategories();
      // Ensure categories is always an array
      setCategories(fetchedCategories.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to load categories. Please try again later.");
      setCategories([]); // Reset to empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch categories when component mounts
  useEffect(() => {
    getCategories();
  }, [getAllCategories]);

  // Update paginated categories when currentPage or categories change
  useEffect(() => {
    if (!Array.isArray(categories)) {
      setPaginatedCategories([]);
      return;
    }

    const startIndex = (currentPage - 1) * categoriesPerPage;
    const endIndex = startIndex + categoriesPerPage;
    setPaginatedCategories(categories.slice(startIndex, endIndex));
  }, [currentPage, categories]);

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

  // Loading spinner component
  const LoadingSpinner = () => (
    <div className="spinner">
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-spin"
      >
        <circle cx="12" cy="12" r="10" strokeOpacity="0.25"></circle>
        <path d="M12 2a10 10 0 0 1 10 10" strokeOpacity="0.75"></path>
      </svg>
    </div>
  );

  // Add a new EmptyBoxIcon for the empty state
  const EmptyBoxIcon = () => (
    <svg
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#adb5bd"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
      <polyline points="3.29 7 12 12 20.71 7"></polyline>
      <line x1="12" y1="22" x2="12" y2="12"></line>
    </svg>
  );

  // Handle opening the modal with category details
  const handleDetailsClick = (category) => {
    setSelectedCategory(category);
    setEditedCategory({ ...category });
    setIsModalOpen(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    if (!editedCategory) return;

    const { name, value } = e.target;

    setEditedCategory({
      ...editedCategory,
      [name]: value,
    });
  };

  // Handle save changes
  const handleSaveChanges = async () => {
    if (!editedCategory) return;

    const result = await updateCategory(selectedCategory.id, editedCategory);
    if (result) {
      setIsModalOpen(false);
      setSelectedCategory(null);
      setEditedCategory(null);
      showNotification(`Category "${editedCategory.name}" updated successfully`);
      await getCategories();
    }else{
      showNotification(`Error deleting category: ${error.message || "Unknown error"}`, "error");
    }
  };

  // Handle delete category
  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;

    // Confirm before deleting
    if (
      window.confirm(
        `Are you sure you want to delete ${selectedCategory.name}?`
      )
    ) {
      try {
        const result = await deleteCategory(selectedCategory.id);
        if (result.success) {
          await getCategories();
          setIsModalOpen(false);
          setSelectedCategory(null);
          setEditedCategory(null);
          showNotification(`Category "${selectedCategory.name}" deleted successfully`);
        } else {
          showNotification(`Failed to delete category: ${result.message || "Unknown error"}`, "error");
        }
      } catch (error) {
        showNotification(`Error deleting category: ${error.message || "Unknown error"}`, "error");
      }
    }
  };

  // Handle opening the add category modal
  const handleAddCategoryClick = () => {
    setNewCategory({
      name: "",
      description: "",
      productCount: 0,
    });
    setIsAddModalOpen(true);
  };

  // Handle new category input changes
  const handleNewCategoryChange = (e) => {
    const { name, value } = e.target;
    setNewCategory({
      ...newCategory,
      [name]: value,
    });
  };

  // Handle add new category
  const handleAddCategory = async () => {
    setIsAddingCategory(true);

    try {
      const response = await addCategory(newCategory);
      console.log(response);
      // Refresh categories list after successful addition
      await getCategories();
      showNotification(`Category "${newCategory.name}" added successfully`);
    } catch (error) {
      console.log("Failed to add category:", error);
      showNotification(`Failed to add category: ${error.message || "Unknown error"}`, "error");
    } finally {
      // Reset loading state and close modal
      setIsAddingCategory(false);
      setIsAddModalOpen(false);
    }
  };

  return (
    <div className="products-card">
      <div className="card-header">
        <div className="card-title-section">
          <h2 className="card-title">Categories list</h2>
          <span className="category-count">{categories.length} categories</span>
        </div>

        <div className="card-actions">
          <button className="btn btn-secondary btn-with-icon">
            <FilterIcon />
            Filter
          </button>

          <button className="btn btn-secondary">See all</button>

          <button
            className="btn btn-primary btn-with-icon"
            onClick={handleAddCategoryClick}
          >
            <PlusIcon />
            Add category
          </button>
        </div>
      </div>

      {/* Categories table */}
      <div className="table-container">
        {isLoading ? (
          <div className="loading-container">
            <div className="spinner-container">
              <LoadingSpinner />
              <p>Loading categories...</p>
            </div>
          </div>
        ) : error ? (
          <div className="error-container">
            <p className="error-message">{error}</p>
            <button
              className="btn btn-primary"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        ) : (
          <table className="products-table">
            <thead>
              <tr>
                <th className="name-cell">
                  <div className="th-content">
                    Category name
                    <ChevronDownIcon />
                  </div>
                </th>
                <th>
                  <div className="th-content">
                    Description
                    <ChevronDownIcon />
                  </div>
                </th>
                <th>
                  <div className="th-content">
                    Product count
                    <ChevronDownIcon />
                  </div>
                </th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {paginatedCategories.length > 0 ? (
                paginatedCategories.map((category) => (
                  <tr key={category.id}>
                    <td className="name-cell">
                      <div className="category-name">{category.name}</div>
                    </td>
                    <td className="description-cell">
                      {category.description || "No description"}
                    </td>
                    <td className="product-count-cell">
                      {category.productCount || 0}
                    </td>
                    <td>
                      <button
                        className="details-button"
                        onClick={() => handleDetailsClick(category)}
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="empty-table-row">
                  <td colSpan="4" className="empty-table-cell">
                    <div className="empty-state">
                      <EmptyBoxIcon />
                      <p>No categories found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination - only show if we have data and not loading */}
      {!isLoading && !error && categories.length > 0 && (
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

      {/* Category Details Modal */}
      {isModalOpen && editedCategory && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>Category details</h3>
              <button
                className="modal-close-btn"
                onClick={() => setIsModalOpen(false)}
              >
                <CloseIcon />
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="category-name">Category name</label>
                <input
                  type="text"
                  id="category-name"
                  name="name"
                  value={editedCategory.name}
                  onChange={handleInputChange}
                  placeholder="Enter category name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="category-description">Description</label>
                <textarea
                  id="category-description"
                  name="description"
                  value={editedCategory.description}
                  onChange={handleInputChange}
                  placeholder="Enter category description"
                  rows="4"
                  required
                />
              </div>
            </div>

            <div className="modal-footer">
              <div className="modal-actions">
                <button
                  className="btn btn-danger btn-with-icon"
                  onClick={handleDeleteCategory}
                >
                  <TrashIcon />
                  Delete Category
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

      {/* Add Category Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>Add New Category</h3>
              <button
                className="modal-close-btn"
                onClick={() => setIsAddModalOpen(false)}
              >
                <CloseIcon />
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="new-category-name">Category Name</label>
                <input
                  type="text"
                  id="new-category-name"
                  name="name"
                  value={newCategory.name}
                  onChange={handleNewCategoryChange}
                  placeholder="Enter category name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="new-category-description">Description</label>
                <textarea
                  id="new-category-description"
                  name="description"
                  value={newCategory.description}
                  onChange={handleNewCategoryChange}
                  placeholder="Enter category description"
                  rows="4"
                />
              </div>
            </div>

            <div className="modal-footer">
              <div className="modal-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => setIsAddModalOpen(false)}
                  disabled={isAddingCategory}
                >
                  Cancel
                </button>
                <Button
                  onClick={handleAddCategory}
                  loading={isAddingCategory}
                  variant="contained"
                  sx={{
                    backgroundColor: "#5F2EEA",
                    color: "white",
                    padding: "8px 16px",
                    borderRadius: "6px",
                    fontSize: "14px",
                    fontFamily: "inherit",
                    textTransform: "none",
                    fontWeight: "500",
                    border: "none",
                    cursor: "pointer",
                    transition: "background-color 0.2s, transform 0.1s",
                    "&:hover": {
                      backgroundColor: "#4a25b7",
                      opacity: 0.9,
                    },
                    "&:active": {
                      transform: "scale(0.98)",
                    },
                  }}
                >
                  Add Category
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          variant="filled" 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default CategoryTable;
