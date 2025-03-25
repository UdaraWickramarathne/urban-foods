import React, { useState } from "react";
import "./SQLFunctionTable.css";

const SQLFunctionTable = () => {
  // Sample SQL functions data
  const [functions, setFunctions] = useState([
    {
      id: 1,
      name: "fn_CalculateTotalSales",
      returnType: "DECIMAL(18,2)",
      description: "Calculates total sales for a given date range",
      parameters: "(@StartDate DATE, @EndDate DATE)",
      category: "Sales",
      createdDate: "2023-09-05",
      status: "Active"
    },
    {
      id: 2,
      name: "fn_GetProductInventory",
      returnType: "INT",
      description: "Returns current inventory level for a specific product",
      parameters: "(@ProductID INT)",
      category: "Inventory",
      createdDate: "2023-08-12",
      status: "Active"
    },
    {
      id: 3,
      name: "fn_CustomerLifetimeValue",
      returnType: "DECIMAL(18,2)",
      description: "Calculates lifetime value of a customer based on purchase history",
      parameters: "(@CustomerID INT)",
      category: "Customers",
      createdDate: "2023-07-23",
      status: "Active"
    },
    {
      id: 4,
      name: "fn_GetDiscountAmount",
      returnType: "DECIMAL(10,2)",
      description: "Computes discount amount based on purchase total and customer tier",
      parameters: "(@PurchaseTotal DECIMAL(18,2), @CustomerTier VARCHAR(20))",
      category: "Pricing",
      createdDate: "2023-10-02",
      status: "Testing"
    },
    {
      id: 5,
      name: "fn_ValidateEmailFormat",
      returnType: "BIT",
      description: "Validates if a provided email address has correct format",
      parameters: "(@Email VARCHAR(255))",
      category: "Validation",
      createdDate: "2023-09-18",
      status: "Active"
    },
    {
      id: 6,
      name: "fn_GenerateOrderNumber",
      returnType: "VARCHAR(20)",
      description: "Generates unique order number based on date and sequence",
      parameters: "()",
      category: "Orders",
      createdDate: "2023-08-30",
      status: "Active"
    },
    {
      id: 7,
      name: "fn_CalculateAverageRating",
      returnType: "DECIMAL(3,2)",
      description: "Computes average product rating from review data",
      parameters: "(@ProductID INT)",
      category: "Products",
      createdDate: "2023-09-25",
      status: "Disabled"
    },
    {
      id: 8,
      name: "fn_GetTaxRate",
      returnType: "DECIMAL(5,2)",
      description: "Returns applicable tax rate based on location and product category",
      parameters: "(@LocationID INT, @CategoryID INT)",
      category: "Pricing",
      createdDate: "2023-07-15",
      status: "Active"
    }
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedFunction, setSelectedFunction] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newFunction, setNewFunction] = useState({
    name: "",
    returnType: "",
    description: "",
    parameters: "",
    category: "Sales",
    createdDate: new Date().toISOString().split('T')[0],
    status: "Active"
  });
  const [editedFunction, setEditedFunction] = useState(null);

  // Extract unique categories for filter
  const categories = ["All", ...new Set(functions.map(fn => fn.category))];

  // Pagination logic
  const itemsPerPage = 5;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Filter functions based on search and filters
  const filteredFunctions = functions.filter(
    (fn) =>
      (fn.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fn.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterCategory === "All" || fn.category === filterCategory) &&
      (filterStatus === "All" || fn.status === filterStatus)
  );

  const currentFunctions = filteredFunctions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredFunctions.length / itemsPerPage);

  // Event handlers
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryFilterChange = (e) => {
    setFilterCategory(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (e) => {
    setFilterStatus(e.target.value);
    setCurrentPage(1);
  };

  const handleViewFunction = (fn) => {
    setSelectedFunction(fn);
    setIsViewModalOpen(true);
  };

  const handleEditFunction = (fn) => {
    setSelectedFunction(fn);
    setEditedFunction({...fn});
    setIsEditModalOpen(true);
  };

  const handleAddFunction = () => {
    setIsAddModalOpen(true);
  };

  const handleDeleteFunction = (fn) => {
    setSelectedFunction(fn);
    setIsDeleteModalOpen(true);
  };

  const handleStatusToggle = (functionId) => {
    setFunctions(
      functions.map((fn) =>
        fn.id === functionId
          ? {
              ...fn,
              status: fn.status === "Active" ? "Disabled" : "Active",
            }
          : fn
      )
    );
  };

  const closeModal = () => {
    setIsViewModalOpen(false);
    setIsEditModalOpen(false);
    setIsAddModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedFunction(null);
    setEditedFunction(null);
  };

  const handleInputChange = (e, formType) => {
    const { name, value } = e.target;
    if (formType === 'add') {
      setNewFunction({ ...newFunction, [name]: value });
    } else if (formType === 'edit') {
      setEditedFunction({ ...editedFunction, [name]: value });
    }
  };

  const submitNewFunction = () => {
    // Validate form data
    if (!newFunction.name || !newFunction.returnType || !newFunction.description) {
      alert("Please fill all required fields");
      return;
    }

    // Create new function with unique ID
    const newId = Math.max(...functions.map(fn => fn.id)) + 1;
    const functionToAdd = {
      ...newFunction,
      id: newId
    };

    // Add to functions list
    setFunctions([...functions, functionToAdd]);
    closeModal();
    
    // Reset form
    setNewFunction({
      name: "",
      returnType: "",
      description: "",
      parameters: "",
      category: "Sales",
      createdDate: new Date().toISOString().split('T')[0],
      status: "Active"
    });
  };

  const submitEditFunction = () => {
    // Validate form data
    if (!editedFunction.name || !editedFunction.returnType || !editedFunction.description) {
      alert("Please fill all required fields");
      return;
    }

    // Update function in the list
    setFunctions(
      functions.map(fn => 
        fn.id === editedFunction.id ? editedFunction : fn
      )
    );
    closeModal();
  };

  const confirmDeleteFunction = () => {
    // Remove function from list
    if (selectedFunction) {
      setFunctions(functions.filter(fn => fn.id !== selectedFunction.id));
      closeModal();
    }
  };

  // Generate sample SQL code for functions
  const generateSQLCode = (fn) => {
    return `CREATE OR ALTER FUNCTION dbo.${fn.name}${fn.parameters}
RETURNS ${fn.returnType}
AS
BEGIN
    DECLARE @Result ${fn.returnType};
    
    -- Function logic based on description
    ${generateFunctionLogic(fn)}
    
    RETURN @Result;
END`;
  };

  const generateFunctionLogic = (fn) => {
    if (fn.name.includes("CalculateTotalSales")) {
      return `-- Calculate total sales for the given date range
    SELECT @Result = SUM(OrderTotal)
    FROM dbo.Orders
    WHERE OrderDate BETWEEN @StartDate AND @EndDate;`;
    } else if (fn.name.includes("GetProductInventory")) {
      return `-- Get current inventory for the product
    SELECT @Result = CurrentStock
    FROM dbo.Inventory
    WHERE ProductID = @ProductID;`;
    } else if (fn.name.includes("CustomerLifetimeValue")) {
      return `-- Calculate customer's lifetime value
    SELECT @Result = SUM(OrderTotal) 
    FROM dbo.Orders
    WHERE CustomerID = @CustomerID;`;
    } else if (fn.name.includes("Discount")) {
      return `-- Calculate discount based on total and tier
    IF @CustomerTier = 'Gold'
        SET @Result = @PurchaseTotal * 0.15;
    ELSE IF @CustomerTier = 'Silver'
        SET @Result = @PurchaseTotal * 0.10;
    ELSE
        SET @Result = @PurchaseTotal * 0.05;`;
    } else if (fn.name.includes("Email")) {
      return `-- Validate email format using regex
    IF @Email LIKE '%_@_%._%' AND PATINDEX('% %', @Email) = 0
        SET @Result = 1;
    ELSE
        SET @Result = 0;`;
    } else if (fn.name.includes("Rating")) {
      return `-- Calculate average rating
    SELECT @Result = AVG(Rating)
    FROM dbo.ProductReviews
    WHERE ProductID = @ProductID;`;
    } else {
      return `-- Custom function logic for ${fn.name}
    -- Implementation would be specific to function purpose
    SET @Result = 0; -- Default return value`;
    }
  };

  // Icons
  const EditIcon = () => (
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
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
  );

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

  const DeleteIcon = () => (
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
    let className = "status-badge ";
    
    switch(status) {
      case "Active":
        className += "status-active";
        break;
      case "Disabled":
        className += "status-disabled";
        break;
      case "Testing":
        className += "status-testing";
        break;
      default:
        className += "status-draft";
    }
    
    return <span className={className}>{status}</span>;
  };

  return (
    <div className="sql-function-table-container">
      <div className="table-header">
        <h2>SQL Functions</h2>
        <div className="toolbar">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search functions..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>
          <div className="filter-container">
            <select
              value={filterCategory}
              onChange={handleCategoryFilterChange}
              className="filter-select"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={handleStatusFilterChange}
              className="filter-select"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Disabled">Disabled</option>
              <option value="Testing">Testing</option>
            </select>
          </div>
          <button className="btn-add" onClick={handleAddFunction}>
            + New Function
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="function-table">
          <thead>
            <tr>
              <th>Function Name</th>
              <th>Return Type</th>
              <th>Parameters</th>
              <th>Category</th>
              <th>Description</th>
              <th>Status</th>
              <th>Created Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentFunctions.map((fn) => (
              <tr key={fn.id}>
                <td>{fn.name}</td>
                <td>{fn.returnType}</td>
                <td className="parameters-cell">{fn.parameters}</td>
                <td>{fn.category}</td>
                <td className="description-cell">
                  {fn.description.length > 30
                    ? `${fn.description.substring(0, 30)}...`
                    : fn.description}
                </td>
                <td>
                  <StatusBadge status={fn.status} />
                </td>
                <td>{fn.createdDate}</td>
                <td className="actions-cell">
                  <button
                    className="btn-icon"
                    onClick={() => handleViewFunction(fn)}
                    title="View"
                  >
                    <ViewIcon />
                  </button>
                  <button
                    className="btn-icon"
                    onClick={() => handleEditFunction(fn)}
                    title="Edit"
                  >
                    <EditIcon />
                  </button>
                  <button
                    className="btn-icon"
                    onClick={() => handleStatusToggle(fn.id)}
                    title={fn.status === "Active" ? "Disable" : "Enable"}
                  >
                    {fn.status === "Active" ? "Disable" : "Enable"}
                  </button>
                  <button
                    className="btn-icon btn-delete"
                    onClick={() => handleDeleteFunction(fn)}
                    title="Delete"
                  >
                    <DeleteIcon />
                  </button>
                </td>
              </tr>
            ))}
            {currentFunctions.length === 0 && (
              <tr>
                <td colSpan="8" className="no-data">
                  No functions found
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
      {isViewModalOpen && selectedFunction && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>View Function Details</h3>
              <button className="close-button" onClick={closeModal}>
                <CloseIcon />
              </button>
            </div>
            <div className="modal-body">
              <div className="function-details">
                <div className="detail-row">
                  <span className="detail-label">Function Name:</span>
                  <span className="detail-value">{selectedFunction.name}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Return Type:</span>
                  <span className="detail-value">{selectedFunction.returnType}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Parameters:</span>
                  <span className="detail-value">{selectedFunction.parameters}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Category:</span>
                  <span className="detail-value">{selectedFunction.category}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Description:</span>
                  <span className="detail-value">
                    {selectedFunction.description}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Status:</span>
                  <StatusBadge status={selectedFunction.status} />
                </div>
                <div className="detail-row">
                  <span className="detail-label">Created Date:</span>
                  <span className="detail-value">
                    {selectedFunction.createdDate}
                  </span>
                </div>
              </div>

              <div className="function-code">
                <h4>Function SQL Code</h4>
                <pre className="code-block">
                  {generateSQLCode(selectedFunction)}
                </pre>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Function Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>Add New Function</h3>
              <button className="close-button" onClick={closeModal}>
                <CloseIcon />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="name">Function Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newFunction.name}
                    onChange={(e) => handleInputChange(e, 'add')}
                    placeholder="fn_FunctionName"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="returnType">Return Type</label>
                  <input
                    type="text"
                    id="returnType"
                    name="returnType"
                    value={newFunction.returnType}
                    onChange={(e) => handleInputChange(e, 'add')}
                    placeholder="INT, VARCHAR(50), etc."
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="parameters">Parameters</label>
                  <input
                    type="text"
                    id="parameters"
                    name="parameters"
                    value={newFunction.parameters}
                    onChange={(e) => handleInputChange(e, 'add')}
                    placeholder="(@Param1 INT, @Param2 VARCHAR(50))"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    name="category"
                    value={newFunction.category}
                    onChange={(e) => handleInputChange(e, 'add')}
                  >
                    {categories.filter(cat => cat !== "All").map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="status">Status</label>
                  <select
                    id="status"
                    name="status"
                    value={newFunction.status}
                    onChange={(e) => handleInputChange(e, 'add')}
                  >
                    <option value="Active">Active</option>
                    <option value="Disabled">Disabled</option>
                    <option value="Testing">Testing</option>
                  </select>
                </div>
                <div className="form-group full-width">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={newFunction.description}
                    onChange={(e) => handleInputChange(e, 'add')}
                    placeholder="Describe what this function does..."
                    required
                    rows="3"
                  ></textarea>
                </div>
              </div>

              <div className="function-code">
                <h4>Preview SQL Code</h4>
                <pre className="code-block">
                  {generateSQLCode(newFunction)}
                </pre>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button className="btn-primary" onClick={submitNewFunction}>
                Create Function
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Function Modal */}
      {isEditModalOpen && editedFunction && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>Edit Function</h3>
              <button className="close-button" onClick={closeModal}>
                <CloseIcon />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="edit-name">Function Name</label>
                  <input
                    type="text"
                    id="edit-name"
                    name="name"
                    value={editedFunction.name}
                    onChange={(e) => handleInputChange(e, 'edit')}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="edit-returnType">Return Type</label>
                  <input
                    type="text"
                    id="edit-returnType"
                    name="returnType"
                    value={editedFunction.returnType}
                    onChange={(e) => handleInputChange(e, 'edit')}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="edit-parameters">Parameters</label>
                  <input
                    type="text"
                    id="edit-parameters"
                    name="parameters"
                    value={editedFunction.parameters}
                    onChange={(e) => handleInputChange(e, 'edit')}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="edit-category">Category</label>
                  <select
                    id="edit-category"
                    name="category"
                    value={editedFunction.category}
                    onChange={(e) => handleInputChange(e, 'edit')}
                  >
                    {categories.filter(cat => cat !== "All").map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="edit-status">Status</label>
                  <select
                    id="edit-status"
                    name="status"
                    value={editedFunction.status}
                    onChange={(e) => handleInputChange(e, 'edit')}
                  >
                    <option value="Active">Active</option>
                    <option value="Disabled">Disabled</option>
                    <option value="Testing">Testing</option>
                  </select>
                </div>
                <div className="form-group full-width">
                  <label htmlFor="edit-description">Description</label>
                  <textarea
                    id="edit-description"
                    name="description"
                    value={editedFunction.description}
                    onChange={(e) => handleInputChange(e, 'edit')}
                    required
                    rows="3"
                  ></textarea>
                </div>
              </div>

              <div className="function-code">
                <h4>Preview SQL Code</h4>
                <pre className="code-block">
                  {generateSQLCode(editedFunction)}
                </pre>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button className="btn-primary" onClick={submitEditFunction}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedFunction && (
        <div className="modal-overlay">
          <div className="modal-container delete-modal">
            <div className="modal-header">
              <h3>Confirm Delete</h3>
              <button className="close-button" onClick={closeModal}>
                <CloseIcon />
              </button>
            </div>
            <div className="modal-body">
              <div className="delete-message">
                <p>Are you sure you want to delete the function <strong>{selectedFunction.name}</strong>?</p>
                <p className="warning">This action cannot be undone. The function will be permanently removed from the system.</p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button className="btn-danger" onClick={confirmDeleteFunction}>
                Delete Function
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SQLFunctionTable;
