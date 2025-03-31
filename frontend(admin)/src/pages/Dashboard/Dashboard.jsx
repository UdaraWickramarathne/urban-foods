import React, { useState } from "react";
import "./Dashboard.css";
import ProductTable from "../../components/ProductTable/ProductTable";
import CustomerTable from "../../components/CustomerTable/CustomerTable";
import SalesTable from "../../components/SalesTable/SalesTable";
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

  // Sample sales data
  const [sales, setSales] = useState([
    {
      id: "ORD-1001",
      customer: "John Doe",
      date: "2023-10-15",
      products: "3 items",
      amount: 258.75,
      status: "Completed",
    },
    {
      id: "ORD-1002",
      customer: "Sarah Williams",
      date: "2023-10-14",
      products: "1 item",
      amount: 125.99,
      status: "Processing",
    },
    {
      id: "ORD-1003",
      customer: "Michael Brown",
      date: "2023-10-14",
      products: "5 items",
      amount: 432.2,
      status: "Completed",
    },
    {
      id: "ORD-1004",
      customer: "Lisa Johnson",
      date: "2023-10-13",
      products: "2 items",
      amount: 189.5,
      status: "Pending",
    },
    {
      id: "ORD-1005",
      customer: "Robert Miller",
      date: "2023-10-12",
      products: "4 items",
      amount: 345.8,
      status: "Completed",
    },
    {
      id: "ORD-1006",
      customer: "Emily Davis",
      date: "2023-10-11",
      products: "1 item",
      amount: 78.99,
      status: "Refunded",
    },
    {
      id: "ORD-1007",
      customer: "Daniel Wilson",
      date: "2023-10-10",
      products: "3 items",
      amount: 214.75,
      status: "Completed",
    },
    {
      id: "ORD-1008",
      customer: "Olivia Martin",
      date: "2023-10-09",
      products: "2 items",
      amount: 159.9,
      status: "Processing",
    },
    {
      id: "ORD-1009",
      customer: "William Taylor",
      date: "2023-10-08",
      products: "6 items",
      amount: 521.3,
      status: "Completed",
    },
    {
      id: "ORD-1010",
      customer: "Sophia Anderson",
      date: "2023-10-07",
      products: "1 item",
      amount: 89.99,
      status: "Refunded",
    },
  ]);

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
      {/* Sidebar */}
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

        <nav className="nav-menu">
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

            {hasPermission(userPermissions, PERMISSIONS.VIEW_ORDERS) && (
              <li
                className={`nav-item ${
                  activeComponent === "sales" ? "active" : ""
                }`}
                onClick={() => handleNavClick("sales")}
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
                      d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM9 17H7V10H9V17ZM13 17H11V7H13V17ZM17 17H15V13H17V17Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                Sales
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
                    d="M20 3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V5C22 3.9 21.1 3 20 3ZM4 19V5H20V19H4Z"
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
                activeComponent === "settings" ? "active" : ""
              }`}
              onClick={() => handleNavClick("settings")}
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
                    d="M19.14 12.94C19.18 12.64 19.2 12.33 19.2 12C19.2 11.68 19.18 11.36 19.13 11.06C20.42 10.61 21.24 9.39 21.01 8.07C20.87 7.27 20.38 6.56 19.67 6.14C18.96 5.73 18.12 5.65 17.36 5.92C16.85 4.81 16.13 3.82 15.26 3C13.52 1.36 11.24 0.4 8.79 0.4C3.93 0.4 0 4.33 0 9.19C0 12.14 1.44 14.78 3.62 16.45C3.39 17.5 2.8 18.48 1.88 19.06C1.6 19.24 1.5 19.59 1.63 19.9C1.76 20.2 2.07 20.39 2.4 20.36C4.06 20.21 5.66 19.46 6.79 18.3C7.47 18.52 8.18 18.65 8.92 18.65C9.59 18.65 10.25 18.53 10.88 18.34C12.19 20.26 14.88 21.94 18.13 21.58C19.4 21.44 20.61 20.83 21.43 19.87C21.66 19.61 21.62 19.21 21.35 18.99C20.24 18.07 19.63 16.7 19.64 15.23C21.38 14.34 22.46 12.48 21.95 10.58C21.67 9.54 20.88 8.7 19.9 8.28C19.74 7.67 19.5 7.08 19.14 12.94ZM17.75 13.75C17.5 13.75 17.25 13.88 17.13 14.1C16.7 14.85 16 15.38 15.19 15.57C14.92 15.63 14.69 15.82 14.58 16.08C14.47 16.34 14.5 16.63 14.66 16.87C14.82 17.1 15.09 17.23 15.37 17.2C15.62 17.17 15.85 17.11 16.08 17.05C15.94 17.36 15.76 17.67 15.56 17.94C14.97 18.78 14.07 19.33 13.05 19.38C10.74 19.5 8.61 17.96 7.9 16.28C7.85 16.17 7.75 16.09 7.64 16.04C7.5 15.98 7.34 15.96 7.2 15.99C6.95 16.04 6.71 16.06 6.46 16.06C5.85 16.06 5.25 15.95 4.69 15.74C5.05 15.35 5.35 14.9 5.57 14.41C5.7 14.12 5.63 13.79 5.42 13.58C3.64 11.76 2.8 10.02 2.8 9.19C2.8 5.9 5.49 3.2 8.79 3.2C12.08 3.2 14.78 5.9 14.78 9.19C14.78 9.35 14.77 9.5 14.76 9.66C14.73 10.09 15.03 10.47 15.44 10.56C16.44 10.79 17.4 11.15 18.1 11.95C18.59 12.54 18.68 13.23 18.69 13.75C18.68 13.83 18.1 13.75 17.75 13.75Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              Settings
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
                <img src="https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg" alt="Profile" />
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
          {activeComponent === "dashboard" && (
            <DashboardContent/>
          )}
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
          {activeComponent === "sales" && (
            <SalesTable
              sales={sales}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          )}
          {activeComponent === "analytics" && <StoreProcedure />}
          {activeComponent === "dbusers" && <DbUserManagement />}
          {activeComponent === "sqltriggers" && <SQLTriggerTable />}
          {activeComponent === "sqlfunctions" && <SQLFunctionTable />}
          {activeComponent === "notifications" && <NotificationTable />}
          {activeComponent === "suppliers" && (
            <SupplierTable
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          )}
          {activeComponent === "settings" && (
            <div className="settings-placeholder">
              <h2>Settings Content</h2>
              <p>System settings and configuration will appear here.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
