import React, { useState } from "react";
import "./DbUserManagement.css";
import { useAuth } from "../../context/authContext";

const DbUserManagement = () => {
  // Sample DB users data
  const [dbUsers, setDbUsers] = useState([
    {
      id: 1,
      username: "admin_user",
      createdDate: "2023-09-10",
      lastLogin: "2023-10-15",
      status: "Active",
    },
    {
      id: 2,
      username: "sales_manager",
      createdDate: "2023-09-12",
      lastLogin: "2023-10-14",
      status: "Active",
    },
    {
      id: 3,
      username: "inventory_clerk",
      createdDate: "2023-09-15",
      lastLogin: "2023-10-10",
      status: "Inactive",
    },
    {
      id: 4,
      username: "customer_support",
      createdDate: "2023-09-20",
      lastLogin: "2023-10-15",
      status: "Active",
    },
    {
      id: 5,
      username: "marketing_staff",
      createdDate: "2023-09-25",
      lastLogin: "2023-10-12",
      status: "Active",
    },
    {
      id: 6,
      username: "store_manager",
      createdDate: "2023-10-01",
      lastLogin: "2023-10-15",
      status: "Active",
    },
    {
      id: 7,
      username: "system_analyst",
      createdDate: "2023-10-05",
      lastLogin: "2023-10-14",
      status: "Active",
    },
    {
      id: 8,
      username: "temp_user",
      createdDate: "2023-10-08",
      lastLogin: "2023-10-09",
      status: "Inactive",
    },
  ]);

  // State for modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const { createOracleUser } = useAuth();

  // New user form state
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    status: "Active",
    permissions: {
      basicPrivileges: {
        SESSION: false,
        CREATE_VIEW: false,
        CREATE_TABLE: false,
      },
      tablePermissions: [],
    },
  });

  // State for table permissions modal
  const [showTablePermissionModal, setShowTablePermissionModal] =
    useState(false);
  const [tablePermission, setTablePermission] = useState({
    tableName: "",
    permissions: {
      SELECT: false,
      INSERT: false,
      UPDATE: false,
      DELETE: false,
    },
  });

  // Available database tables (sample data)
  const availableTables = [
    "CUSTOMERS",
    "PRODUCTS",
    "ORDERS",
    "SUPPLIERS",
    "CATEGORIES",
    "DELIVERIES",
  ];

  // Status Badge component
  const StatusBadge = ({ status }) => {
    const className = `status-badge status-${status.toLowerCase()}`;
    return <span className={className}>{status}</span>;
  };

  // Handle input changes for new/edit user form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (showEditModal) {
      setCurrentUser({
        ...currentUser,
        [name]: value,
      });
    } else {
      setNewUser({
        ...newUser,
        [name]: value,
      });
    }
  };

  // Handle basic privilege change
  const handleBasicPrivilegeChange = (privilege) => {
    setNewUser({
      ...newUser,
      permissions: {
        ...newUser.permissions,
        basicPrivileges: {
          ...newUser.permissions.basicPrivileges,
          [privilege]: !newUser.permissions.basicPrivileges[privilege],
        },
      },
    });
  };

  // Handle table permission input change
  const handleTablePermissionChange = (permissionType) => {
    setTablePermission({
      ...tablePermission,
      permissions: {
        ...tablePermission.permissions,
        [permissionType]: !tablePermission.permissions[permissionType],
      },
    });
  };

  // Add table permission
  const handleAddTablePermission = () => {
    if (!tablePermission.tableName) return;

    const updatedPermissions = [
      ...newUser.permissions.tablePermissions,
      { ...tablePermission },
    ];

    setNewUser({
      ...newUser,
      permissions: {
        ...newUser.permissions,
        tablePermissions: updatedPermissions,
      },
    });

    setTablePermission({
      tableName: "",
      permissions: {
        SELECT: false,
        INSERT: false,
        UPDATE: false,
        DELETE: false,
      },
    });

    setShowTablePermissionModal(false);
  };

  // Remove table permission
  const handleRemoveTablePermission = (index) => {
    const updatedPermissions = [...newUser.permissions.tablePermissions];
    updatedPermissions.splice(index, 1);

    setNewUser({
      ...newUser,
      permissions: {
        ...newUser.permissions,
        tablePermissions: updatedPermissions,
      },
    });
  };

  // Add new user
  const handleAddUser = async () => {
    const userToAdd = {
      username: newUser.username,
      password: newUser.password,
      status: newUser.status,
      basicPrivileges: newUser.permissions.basicPrivileges,
      tablePermissions: newUser.permissions.tablePermissions, // Include permissions in the user object
    };
    
    const result = await createOracleUser(userToAdd);
    if (result.success) {
      setDbUsers([...dbUsers, userToAdd]);
      setNewUser({
        username: "",
        password: "",
        status: "Active",
        permissions: {
          basicPrivileges: {
            SESSION: false,
            CREATE_VIEW: false,
            CREATE_TABLE: false,
          },
          tablePermissions: [],
        },
      });
      setShowAddModal(false);
    }
  };

  // Edit existing user
  const handleEditClick = (user) => {
    setCurrentUser(user);
    setShowEditModal(true);
  };

  // Save edited user
  const handleSaveEdit = () => {
    setDbUsers(
      dbUsers.map((user) => (user.id === currentUser.id ? currentUser : user))
    );
    setShowEditModal(false);
  };

  // Delete confirmation
  const handleDeleteClick = (user) => {
    setCurrentUser(user);
    setShowDeleteModal(true);
  };

  // Confirm delete
  const handleConfirmDelete = () => {
    setDbUsers(dbUsers.filter((user) => user.id !== currentUser.id));
    setShowDeleteModal(false);
  };

  return (
    <div className="db-users-container">
      <div className="card-header">
        <h2 className="card-title">Database User Management</h2>
        <div className="card-actions">
          <button
            className="btn btn-primary btn-with-icon"
            onClick={() => setShowAddModal(true)}
          >
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
            Add New User
          </button>
        </div>
      </div>
      <div className="table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>
                <div className="th-content">Username</div>
              </th>
              <th>
                <div className="th-content">Created Date</div>
              </th>
              
              {/* <th>
                <div className="th-content">Last Login</div>
              </th> */}
              <th>
                <div className="th-content">Status</div>
              </th>
              <th>
                <div className="th-content">Actions</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {dbUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.createdDate}</td>
                {/* <td>{user.lastLogin}</td> */}
                <td>
                  <StatusBadge status={user.status} />
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="action-btn edit"
                      onClick={() => handleEditClick(user)}
                    >
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
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
                    <button
                      className="action-btn delete"
                      onClick={() => handleDeleteClick(user)}
                    >
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
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>Add New Database User</h3>
              <button
                className="close-btn"
                onClick={() => setShowAddModal(false)}
              >
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
              </button>
            </div>
            <div className="modal-content">
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={newUser.username}
                  onChange={handleInputChange}
                  placeholder="Enter username"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={newUser.password}
                  onChange={handleInputChange}
                  placeholder="Enter password"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={newUser.status}
                  onChange={handleInputChange}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {/* DB Permissions Section */}
              <div className="form-section">
                <h4 className="section-title">Database Permissions</h4>

                {/* Basic Privileges */}
                <div className="form-group">
                  <label>Basic Privileges</label>
                  <div className="checkbox-group">
                    <div className="checkbox-item">
                      <input
                        type="checkbox"
                        id="session-privilege"
                        checked={newUser.permissions.basicPrivileges.SESSION}
                        onChange={() => handleBasicPrivilegeChange("SESSION")}
                      />
                      <label htmlFor="session-privilege">SESSION</label>
                    </div>
                    <div className="checkbox-item">
                      <input
                        type="checkbox"
                        id="create-view-privilege"
                        checked={newUser.permissions.basicPrivileges.CREATE_VIEW}
                        onChange={() => handleBasicPrivilegeChange("CREATE_VIEW")}
                      />
                      <label htmlFor="create-view-privilege">CREATE VIEW</label>
                    </div>
                    <div className="checkbox-item">
                      <input
                        type="checkbox"
                        id="create-table-privilege"
                        checked={
                          newUser.permissions.basicPrivileges.CREATE_TABLE
                        }
                        onChange={() =>
                          handleBasicPrivilegeChange("CREATE_TABLE")
                        }
                      />
                      <label htmlFor="create-table-privilege">
                        CREATE TABLE
                      </label>
                    </div>
                  </div>
                </div>

                {/* Table Permissions */}
                <div className="form-group">
                  <div className="permission-header">
                    <label>Table Permissions</label>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline"
                      onClick={() => setShowTablePermissionModal(true)}
                    >
                      + Add Table Permission
                    </button>
                  </div>

                  {/* Table permissions list */}
                  {newUser.permissions.tablePermissions.length > 0 ? (
                    <div className="table-permissions-list">
                      {newUser.permissions.tablePermissions.map(
                        (perm, index) => (
                          <div key={index} className="table-permission-item">
                            <div className="permission-info">
                              <span className="table-name">
                                {perm.tableName}
                              </span>
                              <div className="permission-badges">
                                {Object.entries(perm.permissions).map(
                                  ([key, value]) =>
                                    value && (
                                      <span
                                        key={key}
                                        className="permission-badge"
                                      >
                                        {key}
                                      </span>
                                    )
                                )}
                              </div>
                            </div>
                            <button
                              className="remove-permission-btn"
                              onClick={() => handleRemoveTablePermission(index)}
                            >
                              &times;
                            </button>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <div className="no-permissions">
                      No table permissions added
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleAddUser}
                disabled={!newUser.username || !newUser.password}
              >
                Add User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table Permission Modal */}
      {showTablePermissionModal && (
        <div className="modal-overlay">
          <div className="modal-container permission-modal">
            <div className="modal-header">
              <h3>Add Table Permission</h3>
              <button
                className="close-btn"
                onClick={() => setShowTablePermissionModal(false)}
              >
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
              </button>
            </div>
            <div className="modal-content">
              <div className="form-group">
                <label htmlFor="table-name">Table Name</label>
                <select
                  id="table-name"
                  value={tablePermission.tableName}
                  onChange={(e) =>
                    setTablePermission({
                      ...tablePermission,
                      tableName: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">Select a table</option>
                  {availableTables.map((table) => (
                    <option key={table} value={table}>
                      {table}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Permissions</label>
                <div className="permissions-grid">
                  <div className="permission-checkbox">
                    <input
                      type="checkbox"
                      id="select-permission"
                      checked={tablePermission.permissions.SELECT}
                      onChange={() => handleTablePermissionChange("SELECT")}
                    />
                    <label htmlFor="select-permission">SELECT</label>
                  </div>
                  <div className="permission-checkbox">
                    <input
                      type="checkbox"
                      id="insert-permission"
                      checked={tablePermission.permissions.INSERT}
                      onChange={() => handleTablePermissionChange("INSERT")}
                    />
                    <label htmlFor="insert-permission">INSERT</label>
                  </div>
                  <div className="permission-checkbox">
                    <input
                      type="checkbox"
                      id="update-permission"
                      checked={tablePermission.permissions.UPDATE}
                      onChange={() => handleTablePermissionChange("UPDATE")}
                    />
                    <label htmlFor="update-permission">UPDATE</label>
                  </div>
                  <div className="permission-checkbox">
                    <input
                      type="checkbox"
                      id="delete-permission"
                      checked={tablePermission.permissions.DELETE}
                      onChange={() => handleTablePermissionChange("DELETE")}
                    />
                    <label htmlFor="delete-permission">DELETE</label>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setShowTablePermissionModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleAddTablePermission}
                disabled={!tablePermission.tableName}
              >
                Add Permission
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && currentUser && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>Edit Database User</h3>
              <button
                className="close-btn"
                onClick={() => setShowEditModal(false)}
              >
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
              </button>
            </div>
            <div className="modal-content">
              <div className="form-group">
                <label htmlFor="edit-username">Username</label>
                <input
                  type="text"
                  id="edit-username"
                  name="username"
                  value={currentUser.username}
                  onChange={handleInputChange}
                  placeholder="Enter username"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="edit-status">Status</label>
                <select
                  id="edit-status"
                  name="status"
                  value={currentUser.status}
                  onChange={handleInputChange}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="edit-password">Reset Password (Optional)</label>
                <input
                  type="password"
                  id="edit-password"
                  name="password"
                  placeholder="Leave blank to keep current password"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSaveEdit}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && currentUser && (
        <div className="modal-overlay">
          <div className="modal-container delete-modal">
            <div className="modal-header">
              <h3>Confirm Deletion</h3>
              <button
                className="close-btn"
                onClick={() => setShowDeleteModal(false)}
              >
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
              </button>
            </div>
            <div className="modal-content">
              <div className="delete-warning">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#e53e3e"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12" y2="16"></line>
                </svg>
                <p>
                  Are you sure you want to delete user{" "}
                  <strong>{currentUser.username}</strong>? This action cannot be
                  undone.
                </p>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleConfirmDelete}>
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DbUserManagement;
