import React, { use, useEffect, useState } from 'react';
import './DashboardContent.css';
import { apiContext } from '../../context/apiContext';

const DashboardContent = () => {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [customerCount, setCustomerCount] = useState(0);
  
  // Animation state values
  const [animatedTotalSales, setAnimatedTotalSales] = useState(0);
  const [animatedOrderCount, setAnimatedOrderCount] = useState(0);
  const [animatedProductCount, setAnimatedProductCount] = useState(0);
  const [animatedCustomerCount, setAnimatedCustomerCount] = useState(0);

  const { getTotalSales, getOrderCount, getProductCount, getCustomerCount } = apiContext();

  const fetchOrderCount = async () => {
    try {
      const response = await getOrderCount();
      if (response.success) {
        setOrderCount(response.orderCount);
      }
    } catch (error) {
      console.error("Error fetching order count:", error);
    }
  }

  const fethcCoustomerCount = async () => {
    try {
      const response = await getCustomerCount();
      if (response.success) {
        setCustomerCount(response.count);
      }
    } catch (error) {
      console.error("Error fetching customer count:", error);
    }
  }

  const fetchProductCount = async () => {
    try {
      const response = await getProductCount();
      if (response.success) {
        setProductCount(response.data);
      }
    } catch (error) {
      console.error("Error fetching product count:", error);
    }
  }

  const fetchTotalSales = async () => {
    try {
      const response = await getTotalSales();
      if (response.success) {
        setTotalSales(response.totalSales);
      }
    } catch (error) {
      console.error("Error fetching total sales:", error);
    }
  }

  // Helper function to animate counting
  const animateCount = (startValue, endValue, setter, duration = 1000, decimalPlaces = 0) => {
    // Clear any existing animations
    let startTime;
    const startValueNum = Number(startValue) || 0;
    const endValueNum = Number(endValue) || 0;
    
    if (startValueNum === endValueNum) {
      setter(endValueNum);
      return;
    }

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const currentValue = startValueNum + progress * (endValueNum - startValueNum);
      
      if (decimalPlaces > 0) {
        setter(parseFloat(currentValue.toFixed(decimalPlaces)));
      } else {
        setter(Math.floor(currentValue));
      }
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    
    window.requestAnimationFrame(step);
  };

  // Trigger animations when actual data changes
  useEffect(() => {
    animateCount(0, totalSales, setAnimatedTotalSales, 1000, 2);
  }, [totalSales]);

  useEffect(() => {
    animateCount(0, orderCount, setAnimatedOrderCount);
  }, [orderCount]);

  useEffect(() => {
    animateCount(0, productCount, setAnimatedProductCount);
  }, [productCount]);

  useEffect(() => {
    animateCount(0, customerCount, setAnimatedCustomerCount);
  }, [customerCount]);

  useEffect(() => {
    fetchTotalSales();
    fetchOrderCount();
    fetchProductCount();
    fethcCoustomerCount();
  },[])

  return (
    <div className="dashboard-content">
      {/* Summary Stats Row */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(95, 46, 234, 0.1)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1.86.83 1.5 2.47 1.5 1.17 0 2.39-.64 2.39-1.91 0-1.12-.92-1.61-2.86-2.07-2.21-.51-3.82-1.49-3.82-3.48 0-1.79 1.49-3.09 3.13-3.43V4h2.67v1.31c1.79.33 2.98 1.64 3.09 3.35h-1.96c-.11-.86-.74-1.47-2.22-1.47-1.28 0-2.12.74-2.12 1.58 0 .86.67 1.33 2.72 1.87 2.25.59 3.96 1.45 3.96 3.56 0 1.89-1.54 3.29-3.47 3.89z" fill="#5F2EEA"/>
            </svg>
          </div>
          <div className="stat-content">
            <h3>Total Sales</h3>
            <p className="stat-value count-animation">${animatedTotalSales.toFixed(2)}</p>
            <p className="stat-change positive">+12.5% <span>vs last month</span></p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(255, 100, 80, 0.1)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 6v8h3v-8h2V4h-5V2h-2v2H9V2H7v2H2v18h20V6h-6zm4 12H4V10h16v8zm0-10H4V8h16v2z" fill="#FF6450"/>
            </svg>
          </div>
          <div className="stat-content">
            <h3>Orders</h3>
            <p className="stat-value count-animation">{animatedOrderCount}</p>
            <p class="stat-change positive">+8.2% <span>vs last month</span></p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(54, 179, 126, 0.1)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0-6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 7c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4zm6 5H6v-.99c.2-.72 3.3-2.01 6-2.01s5.8 1.29 6 2v1z" fill="#36B37E"/>
            </svg>
          </div>
          <div className="stat-content">
            <h3>Customers</h3>
            <p className="stat-value count-animation">{animatedCustomerCount}</p>
            <p className="stat-change positive">+5.3% <span>vs last month</span></p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(255, 171, 0, 0.1)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" fill="#FFAB00"/>
            </svg>
          </div>
          <div className="stat-content">
            <h3>Products</h3>
            <p className="stat-value">{productCount}</p>
            <p className="stat-change negative">-2.1% <span>vs last month</span></p>
          </div>
        </div>
      </div>
      
      {/* Charts Row */}
      <div className="charts-row">
        <div className="chart-card large">
          <div className="card-header">
            <h3>Sales Overview</h3>
            <div className="header-actions">
              <select className="time-selector">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
              </select>
            </div>
          </div>
          <div className="chart-placeholder">
            {/* Chart would go here - for now showing a placeholder */}
            <div className="mock-chart">
              <div className="mock-bar" style={{ height: '60%' }}></div>
              <div className="mock-bar" style={{ height: '80%' }}></div>
              <div className="mock-bar" style={{ height: '40%' }}></div>
              <div className="mock-bar" style={{ height: '70%' }}></div>
              <div className="mock-bar" style={{ height: '90%' }}></div>
              <div className="mock-bar" style={{ height: '50%' }}></div>
              <div className="mock-bar" style={{ height: '75%' }}></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tables Row */}
      <div className="tables-row">
        <div className="table-card">
          <div className="card-header">
            <h3>Recent Orders</h3>
            <a href="#" className="view-all">View All</a>
          </div>
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {sales.slice(0, 5).map(sale => (
                <tr key={sale.id}>
                  <td>{sale.id}</td>
                  <td>{sale.customer}</td>
                  <td>{sale.date}</td>
                  <td>${sale.amount.toFixed(2)}</td>
                  <td>
                    <span className={`status-badge status-${sale.status.toLowerCase()}`}>
                      {sale.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="table-card">
          <div className="card-header">
            <h3>Top Products</h3>
            <a href="#" className="view-all">View All</a>
          </div>
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
              </tr>
            </thead>
            <tbody>
              {products.slice(0, 5).map(product => (
                <tr key={product.id}>
                  <td className="product-cell">
                    <div className="product-thumbnail">
                      <img src={product.image} alt={product.name} />
                    </div>
                    <span>{product.name}</span>
                  </td>
                  <td>{product.category}</td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>{product.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
