import React, { useState } from "react";
import "./DashboardOverview.css";
import { format } from 'date-fns';
import {
  Search,
  Download,
  DollarSign,
  Users,
  ShoppingCart,
  Activity,
} from "lucide-react";
import DatePicker from "react-datepicker";

const DashboardOverview = () => {
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [startDate, endDate] = dateRange;

  const formatDateRange = () => {
    if (startDate && endDate) {
      const start = format(startDate, "MMM dd, yyyy");
      const end = format(endDate, "MMM dd, yyyy");
      return `${start} - ${end}`;
    }
    return "";
  };
  return (
    <main className="dashboard-main">
      <div className="dashboard-header-section">
        <h1 className="dashboard-title">Dashboard</h1>
        <div className="date-download">
          <div className="date-range-picker">
            <DatePicker
              selectsRange={true}
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => setDateRange(update)}
              className="date-input"
              placeholderText="Select date range"
              value={formatDateRange()}
            />
          </div>
          <button className="download-button">
            <Download className="download-icon" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="dashboard-tabs">
        <button className="tab-button active">Overview</button>
        <button className="tab-button">Analytics</button>
        <button className="tab-button">Reports</button>
        <button className="tab-button">Notifications</button>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Total Revenue</span>
            <DollarSign className="stat-icon" />
          </div>
          <div className="stat-value">$45,231.89</div>
          <div className="stat-change positive">+20.1% from last month</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Subscriptions</span>
            <Users className="stat-icon" />
          </div>
          <div className="stat-value">+2350</div>
          <div className="stat-change positive">+180.1% from last month</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Sales</span>
            <ShoppingCart className="stat-icon" />
          </div>
          <div className="stat-value">+12,234</div>
          <div className="stat-change positive">+19% from last month</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Active Now</span>
            <Activity className="stat-icon" />
          </div>
          <div className="stat-value">+573</div>
          <div className="stat-change positive">+201 since last hour</div>
        </div>
      </div>

      {/* Chart and Recent Sales */}
      <div className="dashboard-grid">
        <div className="chart-section">
          <h2 className="section-title">Overview</h2>
          <div className="chart-container">
            {[60, 80, 40, 30, 70, 60, 50, 60, 30, 40, 20, 30].map(
              (height, i) => (
                <div
                  key={i}
                  className="chart-bar"
                  style={{ height: `${height}%` }}
                ></div>
              )
            )}
          </div>
          <div className="chart-labels">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
            <span>Jul</span>
            <span>Aug</span>
            <span>Sep</span>
            <span>Oct</span>
            <span>Nov</span>
            <span>Dec</span>
          </div>
        </div>

        <div className="sales-section">
          <h2 className="section-title">Recent Sales</h2>
          <p className="sales-subtitle">You made 265 sales this month.</p>

          <div className="sales-list">
            {[
              {
                initials: "OM",
                name: "Olivia Martin",
                email: "olivia.martin@email.com",
                amount: "+$1,999.00",
              },
              {
                initials: "JL",
                name: "Jackson Lee",
                email: "jackson.lee@email.com",
                amount: "+$39.00",
              },
              {
                initials: "IN",
                name: "Isabella Nguyen",
                email: "isabella.nguyen@email.com",
                amount: "+$299.00",
              },
              {
                initials: "WK",
                name: "William Kim",
                email: "will@email.com",
                amount: "+$99.00",
              },
              {
                initials: "SD",
                name: "Sofia Davis",
                email: "sofia.davis@email.com",
                amount: "+$39.00",
              },
            ].map((sale, i) => (
              <div key={i} className="sale-item">
                <div className="sale-info">
                  <div className="sale-avatar">{sale.initials}</div>
                  <div className="sale-details">
                    <div className="sale-name">{sale.name}</div>
                    <div className="sale-email">{sale.email}</div>
                  </div>
                </div>
                <div className="sale-amount">{sale.amount}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default DashboardOverview;
