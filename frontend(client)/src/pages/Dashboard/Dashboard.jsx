import React, { useState } from 'react';

import "react-datepicker/dist/react-datepicker.css";
import './Dashboard.css';
import DashboardOverview from '../../components/DashboardOverview/DashboardOverview';
import SupplierProducts from '../../components/SupplierProducts/SupplierProducts';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <div className="user-info">
              <div className="user-avatar"></div>
              <span className="user-name">Alicia Koch</span>
            </div>
            <nav className="main-nav">
              <a href="#" className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => handleTabClick('overview')}>Overview</a>
              <a href="#" className={`nav-link ${activeTab === 'products' ? 'active' : ''}`} onClick={() => handleTabClick('products')}>Products</a>
            </nav>
          </div>
        </div>
      </header>
      {
        activeTab === 'overview' && (
          <DashboardOverview/>
        )
      }
      {
        activeTab === 'products' && (
          <SupplierProducts/>
        )
      }
    </div>
  );
};

export default Dashboard;