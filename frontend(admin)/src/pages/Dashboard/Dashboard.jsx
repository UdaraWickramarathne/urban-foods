import React, { useState } from "react";
import "./Dashboard.css";
import ProductTable from "../../components/ProductTable/ProductTable";
import CustomerTable from "../../components/CustomerTable/CustomerTable";
import DashboardContent from "../../components/DashboardContent/DashboardContent";
import StoreProcedure from "../../components/StoreProcedure/StoreProcedure";
import DbUserManagement from "../../components/DbUserManagement/DbUserManagement";
import SQLTriggerTable from "../../components/SQLTriggerTable/SQLTriggerTable";
import SQLFunctionTable from "../../components/SQLFunctionTable/SQLFunctionTable";
import NotificationTable from "../../components/NotificationTable/NotificationTable";
import CategoryTable from "../../components/CategoryTable/CategoryTable";
import { useAuth } from "../../context/authContext";
import { hasPermission, PERMISSIONS } from "../../utils/permissions";
import SupplierTable from "../../components/SupplierTable/SupplierTable";
import OrderTable from "../../components/OrderTable/OrderTable";
import DatabaseBackup from "../../components/DatabaseBackup/DatabaseBackup";
import DeliveryTable from "../../components/DeliveryTable/DeliveryTable";


// Product shape:
// id: number
// name: string
// category: string
// price: number
// stock: number
// status: 'Active' | 'Scheduled' | 'Draft'
// image: string

const Dashboard = () => {
  // Sample data

  const [currentPage, setCurrentPage] = useState(1);
  const [activeComponent, setActiveComponent] = useState("dashboard");

  // Status Badge component
  const StatusBadge = ({ status }) => {
    const className = `status-badge status-${status.toLowerCase()}`;
    return <span className={className}>{status}</span>;
  };

  const { logout, userPermissions } = useAuth();

  // Icons
  const SearchIcon = () => (
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
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  );

  const BellIcon = () => (
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
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
    </svg>
  );

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

  const LogOutIcon = () => (
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
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
      <polyline points="16 17 21 12 16 7"></polyline>
      <line x1="21" y1="12" x2="9" y2="12"></line>
    </svg>
  );

  const handleNavClick = (component) => {
    setActiveComponent(component);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="logo-container">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
              fill="#5F2EEA"
            />
            <path
              d="M16 12c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4 4 1.79 4 4z"
              fill="#5F2EEA"
            />
          </svg>
          <span className="logo-text">Urban Food</span>
        </div>

        <nav className="nav-menu" style={{ maxHeight: "calc(100vh - 160px)", overflowY: "auto", paddingRight: "5px" }}>
          <ul>
            <li
              className={`nav-item ${
                activeComponent === "dashboard" ? "active" : ""
              }`}
              onClick={() => handleNavClick("dashboard")}
            >
              <div className="nav-icon">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="3"
                    y="3"
                    width="7"
                    height="7"
                    rx="1"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <rect
                    x="14"
                    y="3"
                    width="7"
                    height="7"
                    rx="1"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <rect
                    x="3"
                    y="14"
                    width="7"
                    height="7"
                    rx="1"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <rect
                    x="14"
                    y="14"
                    width="7"
                    height="7"
                    rx="1"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              Dashboard
            </li>
            {hasPermission(userPermissions, PERMISSIONS.VIEW_PRODUCTS) && (
              <li
                className={`nav-item ${
                  activeComponent === "products" ? "active" : ""
                }`}
                onClick={() => handleNavClick("products")}
              >
                <div className="nav-icon">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20 3H4C2.89 3 2 3.89 2 5V19C2 20.11 2.89 21 4 21H20C21.11 21 22 20.11 22 19V5C22 3.89 21.11 3 20 3ZM20 5V19H4V5H20Z"
                      fill="currentColor"
                    />
                    <path d="M6 7H18V9H6V7Z" fill="currentColor" />
                    <path d="M6 11H18V13H6V11Z" fill="currentColor" />
                    <path d="M6 15H12V17H6V15Z" fill="currentColor" />
                  </svg>
                </div>
                Products
                <ChevronDownIcon />
              </li>
            )}
            {hasPermission(userPermissions, PERMISSIONS.VIEW_PRODUCTS) && (
              <li
                className={`nav-item sub-item ${
                  activeComponent === "products" ? "active-sub" : ""
                }`}
                onClick={() => handleNavClick("products")}
              >
                Product List
              </li>
            )}
            {hasPermission(userPermissions, PERMISSIONS.VIEW_CATEGORIES) && (
              <li
                className={`nav-item sub-item ${
                  activeComponent === "categories" ? "active-sub" : ""
                }`}
                onClick={() => handleNavClick("categories")}
              >
                Categories
              </li>
            )}

            {hasPermission(userPermissions, PERMISSIONS.VIEW_CUSTOMERS) && (
              <li
                className={`nav-item ${
                  activeComponent === "customers" ? "active" : ""
                }`}
                onClick={() => handleNavClick("customers")}
              >
                <div className="nav-icon">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 6C13.1 6 14 6.9 14 8C14 9.1 13.1 10 12 10C10.9 10 10 9.1 10 8C10 6.9 10.9 6 12 6ZM12 13C9.33 13 4 14.34 4 17V20H20V17C20 14.34 14.67 13 12 13ZM18 18H6V17.01C6.2 16.29 9.3 15 12 15C14.7 15 17.8 16.29 18 17V18Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                Customers
              </li>
            )}
            {hasPermission(userPermissions, PERMISSIONS.VIEW_ORDERS) && (
              <li
                className={`nav-item ${
                  activeComponent === "orders" ? "active" : ""
                }`}
                onClick={() => handleNavClick("orders")}
              >
                <div className="nav-icon">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                Orders
              </li>
            )}
            {hasPermission(userPermissions, PERMISSIONS.VIEW_ORDERS) && (
              <li
                className={`nav-item ${
                  activeComponent === "delivery" ? "active" : ""
                }`}
                onClick={() => handleNavClick("delivery")}
              >
                <div className="nav-icon">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19.15 8h-1.3V5c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3.85-3zM7 17c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm10 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-6V8h2.35l2.5 3H16z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                Delivery
              </li>
            )}
            {hasPermission(userPermissions, PERMISSIONS.VIEW_SUPPLIERS) && (
              <li
                className={`nav-item ${
                  activeComponent === "suppliers" ? "active" : ""
                }`}
                onClick={() => handleNavClick("suppliers")}
              >
                <div className="nav-icon">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                Suppliers
              </li>
            )}

            <li
              className={`nav-item ${
                activeComponent === "analytics" ? "active" : ""
              }`}
              onClick={() => handleNavClick("analytics")}
            >
              <div className="nav-icon">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20 3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 22 19V5C22 3.9 21.1 3 20 3ZM4 19V5H20V19H4Z"
                    fill="currentColor"
                  />
                  <path d="M6 7H11V9H6V7Z" fill="currentColor" />
                  <path d="M6 11H18V13H6V11Z" fill="currentColor" />
                  <path d="M6 15H15V17H6V15Z" fill="currentColor" />
                  <path
                    d="M16.5 8C17.33 8 18 7.33 18 6.5C18 5.67 17.33 5 16.5 5C15.67 5 15 5.67 15 6.5C15 7.33 15.67 8 16.5 8Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              Store Procedures
            </li>

            <li
              className={`nav-item ${
                activeComponent === "dbusers" ? "active" : ""
              }`}
              onClick={() => handleNavClick("dbusers")}
            >
              <div className="nav-icon">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              DB Users
            </li>

            <li
              className={`nav-item ${
                activeComponent === "sqltriggers" ? "active" : ""
              }`}
              onClick={() => handleNavClick("sqltriggers")}
            >
              <div className="nav-icon">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.59 5.41c-.78-.78-.78-2.05 0-2.83.78-.78 2.05-.78 2.83 0 .78.78.78 2.05 0 2.83-.79.79-2.05.79-2.83 0zM6 16V7H4v9c0 2.76 2.24 5 5 5h6v-2H9c-1.66 0-3-1.34-3-3zm14 4.07L14.93 15H11.5v-3.68c1.4 1.15 3.6 2.16 5.5 2.16v-2.16c-1.66.02-3.61-.87-4.67-2.04l-1.4-1.55c-.19-.21-.43-.38-.69-.5-.29-.14-.62-.23-.96-.23h-.03C8.01 7 7 8.01 7 9.25V15c0 1.66 1.34 3 3 3h5.07l3.5 3.5L20 20.07z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              SQL Triggers
            </li>

            <li
              className={`nav-item ${
                activeComponent === "sqlfunctions" ? "active" : ""
              }`}
              onClick={() => handleNavClick("sqlfunctions")}
            >
              <div className="nav-icon">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 19h16v2H4v-2zm5-4h11v2H9v-2zm-5-4h16v2H4v-2zm5-4h11v2H9V7zM4 3h16v2H4V3z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              SQL Functions
            </li>

            <li
              className={`nav-item ${
                activeComponent === "notifications" ? "active" : ""
              }`}
              onClick={() => handleNavClick("notifications")}
            >
              <div className="nav-icon">
                <BellIcon />
              </div>
              Notifications
            </li>

            <li
              className={`nav-item ${
                activeComponent === "backup" ? "active" : ""
              }`}
              onClick={() => handleNavClick("backup")}
            >
              <div className="nav-icon">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2C6.48 2 2 4.02 2 6.5V17.5C2 19.98 6.48 22 12 22S22 19.98 22 17.5V6.5C22 4.02 17.52 2 12 2ZM12 4C16.42 4 20 5.38 20 6.5C20 7.62 16.42 9 12 9S4 7.62 4 6.5C4 5.38 7.58 4 12 4Z"
                    fill="currentColor"
                  />
                  <path
                    d="M4 10V13.5C4 14.62 7.58 16 12 16C16.42 16 20 14.62 20 13.5V10"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M4 13V17.5C4 18.62 7.58 20 12 20C16.42 20 20 18.62 20 17.5V13"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M15 11L12 8L9 11"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path d="M12 16V8" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
              DB Backup
            </li>
          </ul>
        </nav>

        <div className="logout-container">
          <div className="logout-button" onClick={handleLogout}>
            <LogOutIcon />
            Log out
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="main-content">
        {/* Header */}
        <header className="main-header">
          <h1 className="page-title">
            {activeComponent.charAt(0).toUpperCase() + activeComponent.slice(1)}
          </h1>

          <div className="header-actions">
            {/* <div className="search-container">
              <SearchIcon />
              <input
                type="text"
                placeholder="Search..."
                className="search-input"
              />
            </div> */}

            {/* <div className="notification-container">
              <BellIcon />
              <span className="notification-badge">3</span>
            </div> */}

            <div className="user-profile">
              <div className="avatar">
                <img
                  src="https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"
                  alt="Profile"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Content container */}
        <div className="content-container">
          {activeComponent === "products" && (
            <ProductTable
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          )}
          {activeComponent === "dashboard" && <DashboardContent />}
          {activeComponent === "categories" && (
            <CategoryTable
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          )}
          {activeComponent === "customers" && (
            <CustomerTable
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          )}

          {activeComponent === "analytics" && <StoreProcedure />}
          {activeComponent === "dbusers" && <DbUserManagement />}
          {activeComponent === "sqltriggers" && <SQLTriggerTable />}
          {activeComponent === "sqlfunctions" && <SQLFunctionTable />}
          {activeComponent === "notifications" && <NotificationTable />}
          {activeComponent === "delivery" && <DeliveryTable currentPage={currentPage} setCurrentPage={setCurrentPage}/>}
          {activeComponent === "suppliers" && (
            <SupplierTable
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          )}
          {activeComponent === "backup" && <DatabaseBackup/>}
          {activeComponent === "orders" && (
            <OrderTable
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
