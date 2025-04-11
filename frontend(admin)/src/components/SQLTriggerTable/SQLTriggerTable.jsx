import React, { use, useEffect, useState } from "react";
import "./SQLTriggerTable.css";
import { apiContext } from "../../context/apiContext";
import { useNotification } from "../../context/notificationContext";

const SQLTriggerTable = () => {
  // Sample trigger data with updated structure
  const [triggers, setTriggers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedTrigger, setSelectedTrigger] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [logData, setLogData] = useState({ columns: [], rows: [] });
  const [newTrigger, setNewTrigger] = useState({
    triggerName: "",
    tableName: "",
    triggeringEvent: "INSERT",
    triggerType: "AFTER",
    status: "Active",
    triggerBody: "",
  });
  const [editedTrigger, setEditedTrigger] = useState(null);

  const { getAllTriggers, getLogDetails, dropTrigger, changeTriggerStatus } =
    apiContext();
  const { showNotification } = useNotification();

  // Pagination logic
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  useEffect(() => {
    fetchTriggers();
  }, []);

  // Filter triggers based on search and status filter
  const filteredTriggers = triggers.filter(
    (trigger) =>
      (trigger.triggerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trigger.tableName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trigger.triggerBody.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterStatus === "All" || trigger.status === filterStatus)
  );

  const currentTriggers = filteredTriggers.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
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
    setEditedTrigger({ ...trigger });
    setIsEditModalOpen(true);
  };

  const handleAddTrigger = () => {
    setIsAddModalOpen(true);
  };

  const handleDeleteTrigger = (trigger) => {
    setSelectedTrigger(trigger);
    setIsDeleteModalOpen(true);
  };

  const fetchTriggers = async () => {
    const result = await getAllTriggers();
    if (result.success) {
      setTriggers(result.data);
    } else {
      alert("Failed to fetch triggers.");
    }
  };

  const handleStatusToggle = async (trigger) => {
    const updatedStatus = trigger.status === "ENABLED" ? "DISABLE" : "ENABLE";
    const result = await changeTriggerStatus(
      trigger.triggerName,
      updatedStatus
    );
    if (result.success) {
      showNotification(result.message, "success");
      await fetchTriggers();
    } else {
      showNotification(result.message, "error");
    }
  };

  const closeModal = () => {
    setIsViewModalOpen(false);
    setIsEditModalOpen(false);
    setIsAddModalOpen(false);
    setIsDeleteModalOpen(false);
    setIsLogModalOpen(false);
    setSelectedTrigger(null);
    setEditedTrigger(null);
  };

  const handleInputChange = (e, formType) => {
    const { name, value } = e.target;
    if (formType === "add") {
      setNewTrigger({ ...newTrigger, [name]: value });
    } else if (formType === "edit") {
      setEditedTrigger({ ...editedTrigger, [name]: value });
    }
  };

  const submitNewTrigger = () => {
    // Validate form data
    if (
      !newTrigger.triggerName ||
      !newTrigger.tableName ||
      !newTrigger.triggerBody
    ) {
      alert("Please fill all required fields");
      return;
    }

    // Create new trigger with unique ID
    const newId =
      triggers.length > 0
        ? Math.max(...triggers.map((trigger) => trigger.id)) + 1
        : 1;
    const triggerToAdd = {
      ...newTrigger,
      id: newId,
    };

    // Add to triggers list
    setTriggers([...triggers, triggerToAdd]);
    closeModal();

    // Reset form
    setNewTrigger({
      triggerName: "",
      tableName: "",
      triggeringEvent: "INSERT",
      triggerType: "AFTER",
      status: "Active",
      triggerBody: "",
    });
  };

  const submitEditTrigger = () => {
    // Validate form data
    if (
      !editedTrigger.triggerName ||
      !editedTrigger.tableName ||
      !editedTrigger.triggerBody
    ) {
      alert("Please fill all required fields");
      return;
    }

    // Update trigger in the list
    setTriggers(
      triggers.map((trigger) =>
        trigger.id === editedTrigger.id ? editedTrigger : trigger
      )
    );
    closeModal();
  };

  const confirmDeleteTrigger = async () => {
    // Remove trigger from list
    if (selectedTrigger) {
      const result = await dropTrigger(selectedTrigger.triggerName);
      if (result.success) {
        showNotification(result.message, "success");
        await fetchTriggers();
        closeModal();
      } else {
        showNotification(result.message, "error");
        closeModal();
      }
    }
  };

  const handleViewLogs = async (trigger) => {
    setSelectedTrigger(trigger);
    setIsLogModalOpen(true);
    await fetchLogData(trigger);
  };

  const fetchLogData = async (trigger) => {
    try {
      // Set default empty data while loading
      setLogData({ columns: [], rows: [] });

      // Call the API to get real log data
      const result = await getLogDetails(trigger);

      if (result.success) {
        setLogData({
          columns: result.columns,
          rows: result.rows,
        });
      } else {
        alert("Failed to fetch log data.");
        setLogData({
          columns: ["No Data Available"],
          rows: [],
        });
      }
    } catch (error) {
      console.error("Error fetching log data:", error);
      setLogData({
        columns: ["Error"],
        rows: [],
      });
    }
  };

  const generateSQLCode = (trigger) => {
    if (trigger.triggerBody && trigger.triggerBody.trim()) {
      return trigger.triggerBody;
    }

    let code = `CREATE TRIGGER [${trigger.triggerName}]\nON [dbo].[${trigger.tableName}]\n${trigger.triggerType} ${trigger.triggeringEvent}\nAS\nBEGIN\n    SET NOCOUNT ON;\n    \n    -- Trigger logic here\n`;

    if (trigger.triggeringEvent.includes("UPDATE")) {
      code +=
        "    -- For example, when data is updated\n    UPDATE dbo.AuditLog SET LastModified = GETDATE() WHERE ID IN (SELECT ID FROM inserted);";
    } else if (trigger.triggeringEvent.includes("INSERT")) {
      code +=
        "    -- For example, when new data is inserted\n    INSERT INTO dbo.AuditLog (TableName, RecordID, Action, ChangedBy)\n    SELECT '${trigger.tableName}', i.ID, 'INSERT', CURRENT_USER\n    FROM inserted i;";
    } else if (trigger.triggeringEvent.includes("DELETE")) {
      code +=
        "    -- For example, when data is deleted\n    INSERT INTO dbo.Archived_Data (ID, TableName, Data, DeletedOn)\n    SELECT d.ID, '${trigger.tableName}', (SELECT * FROM deleted FOR XML AUTO), GETDATE()\n    FROM deleted d;";
    }

    code += "\nEND";
    return code;
  };

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
      stroke="#bd343e"
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

  const LogIcon = () => (
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
      <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
      <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z"></path>
      <line x1="9" y1="9" x2="10" y2="9"></line>
      <line x1="9" y1="13" x2="15" y2="13"></line>
      <line x1="9" y1="17" x2="15" y2="17"></line>
    </svg>
  );

  const StatusBadge = ({ status }) => {
    const effect = status === "ENABLED" ? "active" : "disabled";
    return <span className={`status-badge status-${effect}`}>{status}</span>;
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
          <button className="btn-add" onClick={handleAddTrigger}>
            + New Trigger
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="trigger-table">
          <thead>
            <tr>
              <th>Trigger Name</th>
              <th>Table</th>
              <th>Event</th>
              <th>Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentTriggers.map((trigger) => (
              <tr key={trigger.triggerName}>
                <td>{trigger.triggerName}</td>
                <td>{trigger.tableName}</td>
                <td>{trigger.triggeringEvent}</td>
                <td>{trigger.triggerType}</td>
                <td>
                  <StatusBadge status={trigger.status} />
                </td>
                <td className="actions-cell">
                  <button
                    className="btn-icon"
                    onClick={() => handleViewTrigger(trigger)}
                    title="View"
                  >
                    <ViewIcon />
                  </button>
                  {/* <button
                    className="btn-icon"
                    onClick={() => handleEditTrigger(trigger)}
                    title="Edit"
                  >
                    <EditIcon />
                  </button> */}
                  <button
                    className={`btn-icon ${
                      trigger.status === "ENABLED"
                        ? "btn-toggle-disable"
                        : "btn-toggle-enable"
                    }`}
                    onClick={() => handleStatusToggle(trigger)}
                    title={trigger.status === "ENABLED" ? "Disable" : "Enable"}
                  >
                    {trigger.status === "ENABLED" ? "Disable" : "Enable"}
                  </button>
                  <button
                    className="btn-icon"
                    onClick={() => handleViewLogs(trigger)}
                    title="View Logs"
                  >
                    <LogIcon />
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
                <td colSpan="6" className="no-data">
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
                  <span className="detail-value">
                    {selectedTrigger.triggerName}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Table:</span>
                  <span className="detail-value">
                    {selectedTrigger.tableName}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Event:</span>
                  <span className="detail-value">
                    {selectedTrigger.triggeringEvent}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Type:</span>
                  <span className="detail-value">
                    {selectedTrigger.triggerType}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Status:</span>
                  <StatusBadge status={selectedTrigger.status} />
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
                  <label htmlFor="triggerName">Trigger Name</label>
                  <input
                    type="text"
                    id="triggerName"
                    name="triggerName"
                    value={newTrigger.triggerName}
                    onChange={(e) => handleInputChange(e, "add")}
                    placeholder="tr_TriggerName"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="tableName">Table Name</label>
                  <input
                    type="text"
                    id="tableName"
                    name="tableName"
                    value={newTrigger.tableName}
                    onChange={(e) => handleInputChange(e, "add")}
                    placeholder="TableName"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="triggeringEvent">Event</label>
                  <select
                    id="triggeringEvent"
                    name="triggeringEvent"
                    value={newTrigger.triggeringEvent}
                    onChange={(e) => handleInputChange(e, "add")}
                  >
                    <option value="INSERT">INSERT</option>
                    <option value="UPDATE">UPDATE</option>
                    <option value="DELETE">DELETE</option>
                    <option value="INSERT,UPDATE">INSERT,UPDATE</option>
                    <option value="INSERT,DELETE">INSERT,DELETE</option>
                    <option value="UPDATE,DELETE">UPDATE,DELETE</option>
                    <option value="INSERT,UPDATE,DELETE">
                      INSERT,UPDATE,DELETE
                    </option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="triggerType">Type</label>
                  <select
                    id="triggerType"
                    name="triggerType"
                    value={newTrigger.triggerType}
                    onChange={(e) => handleInputChange(e, "add")}
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
                    onChange={(e) => handleInputChange(e, "add")}
                  >
                    <option value="Active">Active</option>
                    <option value="Disabled">Disabled</option>
                  </select>
                </div>
                <div className="form-group full-width">
                  <label htmlFor="triggerBody">Trigger SQL Body</label>
                  <textarea
                    id="triggerBody"
                    name="triggerBody"
                    value={newTrigger.triggerBody}
                    onChange={(e) => handleInputChange(e, "add")}
                    placeholder="CREATE TRIGGER [triggerName] ON [dbo].[tableName]..."
                    required
                    rows="8"
                    className="code-textarea"
                  ></textarea>
                </div>
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
                  <label htmlFor="edit-triggerName">Trigger Name</label>
                  <input
                    type="text"
                    id="edit-triggerName"
                    name="triggerName"
                    value={editedTrigger.triggerName}
                    onChange={(e) => handleInputChange(e, "edit")}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="edit-tableName">Table Name</label>
                  <input
                    type="text"
                    id="edit-tableName"
                    name="tableName"
                    value={editedTrigger.tableName}
                    onChange={(e) => handleInputChange(e, "edit")}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="edit-triggeringEvent">Event</label>
                  <select
                    id="edit-triggeringEvent"
                    name="triggeringEvent"
                    value={editedTrigger.triggeringEvent}
                    onChange={(e) => handleInputChange(e, "edit")}
                  >
                    <option value="INSERT">INSERT</option>
                    <option value="UPDATE">UPDATE</option>
                    <option value="DELETE">DELETE</option>
                    <option value="INSERT,UPDATE">INSERT,UPDATE</option>
                    <option value="INSERT,DELETE">INSERT,DELETE</option>
                    <option value="UPDATE,DELETE">UPDATE,DELETE</option>
                    <option value="INSERT,UPDATE,DELETE">
                      INSERT,UPDATE,DELETE
                    </option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="edit-triggerType">Type</label>
                  <select
                    id="edit-triggerType"
                    name="triggerType"
                    value={editedTrigger.triggerType}
                    onChange={(e) => handleInputChange(e, "edit")}
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
                    onChange={(e) => handleInputChange(e, "edit")}
                  >
                    <option value="Active">Active</option>
                    <option value="Disabled">Disabled</option>
                  </select>
                </div>
                <div className="form-group full-width">
                  <label htmlFor="edit-triggerBody">Trigger SQL Body</label>
                  <textarea
                    id="edit-triggerBody"
                    name="triggerBody"
                    value={editedTrigger.triggerBody}
                    onChange={(e) => handleInputChange(e, "edit")}
                    required
                    rows="8"
                    className="code-textarea"
                  ></textarea>
                </div>
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
                <p>
                  Are you sure you want to delete the trigger{" "}
                  <strong>{selectedTrigger.triggerName}</strong>?
                </p>
                <p className="warning">
                  This action cannot be undone. The trigger will be permanently
                  removed from the system.
                </p>
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

      {/* Log Modal */}
      {isLogModalOpen && selectedTrigger && (
        <div className="modal-overlay">
          <div className="modal-container log-modal wide-modal">
            <div className="modal-header">
              <h3>
                Logs for {selectedTrigger.triggerName} (
                {selectedTrigger.tableName})
              </h3>
              <button className="close-button" onClick={closeModal}>
                <CloseIcon />
              </button>
            </div>
            <div className="modal-body">
              <div className="log-table-container">
                {logData.columns.length > 0 ? (
                  <table className="log-table">
                    <thead>
                      <tr>
                        {logData.columns.map((column, index) => (
                          <th key={index}>{column}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {logData.rows.length > 0 ? (
                        logData.rows.map((row, rowIndex) => (
                          <tr key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                              <td key={cellIndex}>{cell}</td>
                            ))}
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={logData.columns.length}
                            className="no-data"
                          >
                            No log data available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                ) : (
                  <div className="loading">Loading log data...</div>
                )}
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
    </div>
  );
};

export default SQLTriggerTable;
