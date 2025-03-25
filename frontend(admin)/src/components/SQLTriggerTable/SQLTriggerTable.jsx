import React, { useState } from "react";
import "./SQLTriggerTable.css";

const SQLTriggerTable = () => {
  // Sample trigger data
  const [triggers, setTriggers] = useState([
    {
      id: 1,
      name: "tr_ProductUpdate",
      table: "Products",
      event: "UPDATE",
      timing: "AFTER",
      description: "Updates product modification date when a product is updated",
      status: "Active",
      createdDate: "2023-09-15",
    },
    {
      id: 2,
      name: "tr_OrderInsert",
      table: "Orders",
      event: "INSERT",
      timing: "AFTER",
      description: "Updates inventory when a new order is placed",
      status: "Active",
      createdDate: "2023-09-10",
    },
    {
      id: 3,
      name: "tr_CustomerDelete",
      table: "Customers",
      event: "DELETE",
      timing: "BEFORE",
      description: "Archives customer data before deletion",
      status: "Disabled",
      createdDate: "2023-08-22",
    },
    {
      id: 4,
      name: "tr_InventoryCheck",
      table: "Inventory",
      event: "UPDATE",
      timing: "BEFORE",
      description: "Validates inventory changes before applying updates",
      status: "Active",
      createdDate: "2023-10-05",
    },
    {
      id: 5,
      name: "tr_SalesReport",
      table: "Sales",
      event: "INSERT",
      timing: "AFTER",
      description: "Updates sales analytics after new sales record",
      status: "Active",
      createdDate: "2023-09-30",
    },
    {
      id: 6,
      name: "tr_UserAudit",
      table: "Users",
      event: "INSERT,UPDATE,DELETE",
      timing: "AFTER",
      description: "Records all changes to user accounts in audit log",
      status: "Active",
      createdDate: "2023-08-15",
    },
    {
      id: 7,
      name: "tr_CategoryValidate",
      table: "Categories",
      event: "INSERT,UPDATE",
      timing: "BEFORE",
      description: "Validates category data before saving",
      status: "Disabled",
      createdDate: "2023-10-12",
    },
    {
      id: 8,
      name: "tr_PaymentProcess",
      table: "Payments",
      event: "INSERT",
      timing: "AFTER",
      description: "Processes payment confirmations and updates order status",
      status: "Active",
      createdDate: "2023-09-18",
    },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedTrigger, setSelectedTrigger] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newTrigger, setNewTrigger] = useState({
    name: "",
    table: "",
    event: "INSERT",
    timing: "AFTER",
    description: "",
    status: "Active",
    createdDate: new Date().toISOString().split('T')[0]
  });
  const [editedTrigger, setEditedTrigger] = useState(null);

  // Pagination logic
  const itemsPerPage = 5;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Filter triggers based on search and status filter
  const filteredTriggers = triggers.filter(
    (trigger) =>
      (trigger.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trigger.table.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trigger.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterStatus === "All" || trigger.status === filterStatus)
  );

  const currentTriggers = filteredTriggers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTriggers.length / itemsPerPage);

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

  const handleViewTrigger = (trigger) => {
    setSelectedTrigger(trigger);
    setIsViewModalOpen(true);
  };

  const handleEditTrigger = (trigger) => {
    setSelectedTrigger(trigger);
    setEditedTrigger({...trigger});
    setIsEditModalOpen(true);
  };

  const handleAddTrigger = () => {
    setIsAddModalOpen(true);
  };

  const handleDeleteTrigger = (trigger) => {
    setSelectedTrigger(trigger);
    setIsDeleteModalOpen(true);
  };

  const handleStatusToggle = (triggerId) => {
    setTriggers(
      triggers.map((trigger) =>
        trigger.id === triggerId
          ? {
              ...trigger,
              status: trigger.status === "Active" ? "Disabled" : "Active",
            }
          : trigger
      )
    );
  };

  const closeModal = () => {
    setIsViewModalOpen(false);
    setIsEditModalOpen(false);
    setIsAddModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedTrigger(null);
    setEditedTrigger(null);
  };

  const handleInputChange = (e, formType) => {
    const { name, value } = e.target;
    if (formType === 'add') {
      setNewTrigger({ ...newTrigger, [name]: value });
    } else if (formType === 'edit') {
      setEditedTrigger({ ...editedTrigger, [name]: value });
    }
  };

  const submitNewTrigger = () => {
    // Validate form data
    if (!newTrigger.name || !newTrigger.table || !newTrigger.description) {
      alert("Please fill all required fields");
      return;
    }

    // Create new trigger with unique ID
    const newId = Math.max(...triggers.map(trigger => trigger.id)) + 1;
    const triggerToAdd = {
      ...newTrigger,
      id: newId
    };

    // Add to triggers list
    setTriggers([...triggers, triggerToAdd]);
    closeModal();
    
    // Reset form
    setNewTrigger({
      name: "",
      table: "",
      event: "INSERT",
      timing: "AFTER",
      description: "",
      status: "Active",
      createdDate: new Date().toISOString().split('T')[0]
    });
  };

  const submitEditTrigger = () => {
    // Validate form data
    if (!editedTrigger.name || !editedTrigger.table || !editedTrigger.description) {
      alert("Please fill all required fields");
      return;
    }

    // Update trigger in the list
    setTriggers(
      triggers.map(trigger => 
        trigger.id === editedTrigger.id ? editedTrigger : trigger
      )
    );
    closeModal();
  };

  const confirmDeleteTrigger = () => {
    // Remove trigger from list
    if (selectedTrigger) {
      setTriggers(triggers.filter(trigger => trigger.id !== selectedTrigger.id));
      closeModal();
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
    const className = `status-badge status-${status.toLowerCase()}`;
    return <span className={className}>{status}</span>;
  };

  // New function to generate sample SQL code
  const generateSQLCode = (trigger) => {
    let code = `CREATE TRIGGER [${trigger.name}]\nON [dbo].[${trigger.table}]\n${trigger.timing} ${trigger.event}\nAS\nBEGIN\n    SET NOCOUNT ON;\n    \n    -- `;
    
    if (trigger.description.includes("modification date")) {
      code += "Update last modified date\n    UPDATE dbo.Products SET LastModified = GETDATE() WHERE ID IN (SELECT ID FROM inserted);";
    } else if (trigger.description.includes("inventory")) {
      code += "Update inventory stock\n    UPDATE dbo.Inventory SET Stock = Stock - i.Quantity FROM inserted i JOIN dbo.Inventory inv ON i.ProductID = inv.ProductID;";
    } else if (trigger.event.includes("DELETE")) {
      code += "Archive data before deletion\n    INSERT INTO dbo.Archived_Data (ID, TableName, Data, DeletedOn)\n    SELECT d.ID, '${trigger.table}', (SELECT * FROM deleted FOR XML AUTO), GETDATE()\n    FROM deleted d;";
    } else {
      code += "Custom trigger logic would be here";
    }
    
    code += "\nEND";
    return code;
  };

  return (
    <div className="sql-trigger-table-container">
      <div className="table-header">
        <h2>SQL Triggers</h2>
        <div className="toolbar">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search triggers..."
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
              <option value="Active">Active</option>
              <option value="Disabled">Disabled</option>
            </select>
          </div>
          <button className="btn-add" onClick={handleAddTrigger}>+ New Trigger</button>
        </div>
      </div>

      <div className="table-container">
        <table className="trigger-table">
          <thead>
            <tr>
              <th>Trigger Name</th>
              <th>Table</th>
              <th>Event</th>
              <th>Timing</th>
              <th>Description</th>
              <th>Status</th>
              <th>Created Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentTriggers.map((trigger) => (
              <tr key={trigger.id}>
                <td>{trigger.name}</td>
                <td>{trigger.table}</td>
                <td>{trigger.event}</td>
                <td>{trigger.timing}</td>
                <td className="description-cell">
                  {trigger.description.length > 30
                    ? `${trigger.description.substring(0, 30)}...`
                    : trigger.description}
                </td>
                <td>
                  <StatusBadge status={trigger.status} />
                </td>
                <td>{trigger.createdDate}</td>
                <td className="actions-cell">
                  <button
                    className="btn-icon"
                    onClick={() => handleViewTrigger(trigger)}
                    title="View"
                  >
                    <ViewIcon />
                  </button>
                  <button
                    className="btn-icon"
                    onClick={() => handleEditTrigger(trigger)}
                    title="Edit"
                  >
                    <EditIcon />
                  </button>
                  <button
                    className="btn-icon"
                    onClick={() => handleStatusToggle(trigger.id)}
                    title={trigger.status === "Active" ? "Disable" : "Enable"}
                  >
                    {trigger.status === "Active" ? "Disable" : "Enable"}
                  </button>
                  <button 
                    className="btn-icon btn-delete" 
                    onClick={() => handleDeleteTrigger(trigger)}
                    title="Delete"
                  >
                    <DeleteIcon />
                  </button>
                </td>
              </tr>
            ))}
            {currentTriggers.length === 0 && (
              <tr>
                <td colSpan="8" className="no-data">
                  No triggers found
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
      {isViewModalOpen && selectedTrigger && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>View Trigger Details</h3>
              <button className="close-button" onClick={closeModal}>
                <CloseIcon />
              </button>
            </div>
            <div className="modal-body">
              <div className="trigger-details">
                <div className="detail-row">
                  <span className="detail-label">Trigger Name:</span>
                  <span className="detail-value">{selectedTrigger.name}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Table:</span>
                  <span className="detail-value">{selectedTrigger.table}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Event:</span>
                  <span className="detail-value">{selectedTrigger.event}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Timing:</span>
                  <span className="detail-value">{selectedTrigger.timing}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Description:</span>
                  <span className="detail-value">
                    {selectedTrigger.description}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Status:</span>
                  <StatusBadge status={selectedTrigger.status} />
                </div>
                <div className="detail-row">
                  <span className="detail-label">Created Date:</span>
                  <span className="detail-value">
                    {selectedTrigger.createdDate}
                  </span>
                </div>
              </div>

              <div className="trigger-code">
                <h4>Trigger Code</h4>
                <pre className="code-block">
                  {generateSQLCode(selectedTrigger)}
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

      {/* Add Trigger Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>Add New Trigger</h3>
              <button className="close-button" onClick={closeModal}>
                <CloseIcon />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="name">Trigger Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newTrigger.name}
                    onChange={(e) => handleInputChange(e, 'add')}
                    placeholder="tr_TriggerName"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="table">Table Name</label>
                  <input
                    type="text"
                    id="table"
                    name="table"
                    value={newTrigger.table}
                    onChange={(e) => handleInputChange(e, 'add')}
                    placeholder="TableName"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="event">Event</label>
                  <select
                    id="event"
                    name="event"
                    value={newTrigger.event}
                    onChange={(e) => handleInputChange(e, 'add')}
                  >
                    <option value="INSERT">INSERT</option>
                    <option value="UPDATE">UPDATE</option>
                    <option value="DELETE">DELETE</option>
                    <option value="INSERT,UPDATE">INSERT,UPDATE</option>
                    <option value="INSERT,DELETE">INSERT,DELETE</option>
                    <option value="UPDATE,DELETE">UPDATE,DELETE</option>
                    <option value="INSERT,UPDATE,DELETE">INSERT,UPDATE,DELETE</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="timing">Timing</label>
                  <select
                    id="timing"
                    name="timing"
                    value={newTrigger.timing}
                    onChange={(e) => handleInputChange(e, 'add')}
                  >
                    <option value="AFTER">AFTER</option>
                    <option value="BEFORE">BEFORE</option>
                    <option value="INSTEAD OF">INSTEAD OF</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="status">Status</label>
                  <select
                    id="status"
                    name="status"
                    value={newTrigger.status}
                    onChange={(e) => handleInputChange(e, 'add')}
                  >
                    <option value="Active">Active</option>
                    <option value="Disabled">Disabled</option>
                  </select>
                </div>
                <div className="form-group full-width">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={newTrigger.description}
                    onChange={(e) => handleInputChange(e, 'add')}
                    placeholder="Describe what this trigger does..."
                    required
                    rows="3"
                  ></textarea>
                </div>
              </div>

              <div className="trigger-code">
                <h4>Preview SQL Code</h4>
                <pre className="code-block">
                  {generateSQLCode(newTrigger)}
                </pre>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button className="btn-primary" onClick={submitNewTrigger}>
                Create Trigger
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Trigger Modal */}
      {isEditModalOpen && editedTrigger && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>Edit Trigger</h3>
              <button className="close-button" onClick={closeModal}>
                <CloseIcon />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="edit-name">Trigger Name</label>
                  <input
                    type="text"
                    id="edit-name"
                    name="name"
                    value={editedTrigger.name}
                    onChange={(e) => handleInputChange(e, 'edit')}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="edit-table">Table Name</label>
                  <input
                    type="text"
                    id="edit-table"
                    name="table"
                    value={editedTrigger.table}
                    onChange={(e) => handleInputChange(e, 'edit')}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="edit-event">Event</label>
                  <select
                    id="edit-event"
                    name="event"
                    value={editedTrigger.event}
                    onChange={(e) => handleInputChange(e, 'edit')}
                  >
                    <option value="INSERT">INSERT</option>
                    <option value="UPDATE">UPDATE</option>
                    <option value="DELETE">DELETE</option>
                    <option value="INSERT,UPDATE">INSERT,UPDATE</option>
                    <option value="INSERT,DELETE">INSERT,DELETE</option>
                    <option value="UPDATE,DELETE">UPDATE,DELETE</option>
                    <option value="INSERT,UPDATE,DELETE">INSERT,UPDATE,DELETE</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="edit-timing">Timing</label>
                  <select
                    id="edit-timing"
                    name="timing"
                    value={editedTrigger.timing}
                    onChange={(e) => handleInputChange(e, 'edit')}
                  >
                    <option value="AFTER">AFTER</option>
                    <option value="BEFORE">BEFORE</option>
                    <option value="INSTEAD OF">INSTEAD OF</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="edit-status">Status</label>
                  <select
                    id="edit-status"
                    name="status"
                    value={editedTrigger.status}
                    onChange={(e) => handleInputChange(e, 'edit')}
                  >
                    <option value="Active">Active</option>
                    <option value="Disabled">Disabled</option>
                  </select>
                </div>
                <div className="form-group full-width">
                  <label htmlFor="edit-description">Description</label>
                  <textarea
                    id="edit-description"
                    name="description"
                    value={editedTrigger.description}
                    onChange={(e) => handleInputChange(e, 'edit')}
                    required
                    rows="3"
                  ></textarea>
                </div>
              </div>

              <div className="trigger-code">
                <h4>Preview SQL Code</h4>
                <pre className="code-block">
                  {generateSQLCode(editedTrigger)}
                </pre>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button className="btn-primary" onClick={submitEditTrigger}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedTrigger && (
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
                <p>Are you sure you want to delete the trigger <strong>{selectedTrigger.name}</strong>?</p>
                <p className="warning">This action cannot be undone. The trigger will be permanently removed from the system.</p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button className="btn-danger" onClick={confirmDeleteTrigger}>
                Delete Trigger
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SQLTriggerTable;
