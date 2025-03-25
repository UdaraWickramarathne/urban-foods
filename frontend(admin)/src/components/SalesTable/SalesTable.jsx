import React from 'react';
import './SalesTable.css';

const SalesTable = ({ sales, currentPage, setCurrentPage }) => {
  // Pagination settings
  const itemsPerPage = 6;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSales = sales.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sales.length / itemsPerPage);

  // Status Badge component
  const StatusBadge = ({ status }) => {
    const className = `status-badge status-${status.toLowerCase()}`;
    return <span className={className}>{status}</span>;
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="sales-dashboard">
      <div className="sales-stats">
        <div className="stat-card">
          <h3>Total Sales</h3>
          <p className="stat-value">{formatCurrency(sales.reduce((sum, sale) => sum + sale.amount, 0))}</p>
          <p className="stat-period">This month</p>
        </div>
        <div className="stat-card">
          <h3>Orders</h3>
          <p className="stat-value">{sales.length}</p>
          <p className="stat-period">This month</p>
        </div>
        <div className="stat-card">
          <h3>Average Order</h3>
          <p className="stat-value">
            {formatCurrency(sales.reduce((sum, sale) => sum + sale.amount, 0) / sales.length)}
          </p>
          <p className="stat-period">This month</p>
        </div>
        <div className="stat-card">
          <h3>Refunds</h3>
          <p className="stat-value">
            {formatCurrency(sales.filter(sale => sale.status === 'Refunded')
              .reduce((sum, sale) => sum + sale.amount, 0))}
          </p>
          <p className="stat-period">This month</p>
        </div>
      </div>

      <div className="sales-table-container">
        <div className="table-header">
          <h2>Recent Orders</h2>
          <div className="header-actions">
            <button className="action-button">
              <span>Filter</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
              </svg>
            </button>
            <button className="action-button primary">Export</button>
          </div>
        </div>
        
        <table className="sales-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Products</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentSales.map((sale) => (
              <tr key={sale.id}>
                <td>#{sale.id}</td>
                <td>{sale.customer}</td>
                <td>{formatDate(sale.date)}</td>
                <td>{sale.products}</td>
                <td>{formatCurrency(sale.amount)}</td>
                <td>
                  <StatusBadge status={sale.status} />
                </td>
                <td>
                  <div className="table-actions">
                    <button className="icon-button">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
                    <button className="icon-button">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="page-button"
            >
              Previous
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`page-button ${currentPage === page ? 'active' : ''}`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="page-button"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesTable;
