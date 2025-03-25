import React from 'react'
import './StoreProcedure.css'

const StoreProcedure = () => {
  return (
    <div className="store-procedure">
          <h2>Store Procedures</h2>
          <div className="procedure-container">
            <div className="procedure-card">
              <div className="procedure-header">
                <h3>Inventory Update</h3>
                <span className="procedure-badge success">Active</span>
              </div>
              <p>Updates inventory levels based on sales and restocking data.</p>
              <div className="procedure-footer">
                <button className="procedure-btn run">Run Procedure</button>
                <button className="procedure-btn view">View Logs</button>
              </div>
            </div>
    
            <div className="procedure-card">
              <div className="procedure-header">
                <h3>Sales Summary</h3>
                <span className="procedure-badge success">Active</span>
              </div>
              <p>Generates daily sales summary across all product categories.</p>
              <div className="procedure-footer">
                <button className="procedure-btn run">Run Procedure</button>
                <button className="procedure-btn view">View Logs</button>
              </div>
            </div>
    
            <div className="procedure-card">
              <div className="procedure-header">
                <h3>Customer Analytics</h3>
                <span className="procedure-badge warning">Scheduled</span>
              </div>
              <p>Analyzes customer purchasing patterns and behaviors.</p>
              <div className="procedure-footer">
                <button className="procedure-btn run">Run Procedure</button>
                <button className="procedure-btn view">View Logs</button>
              </div>
            </div>
    
            <div className="procedure-card">
              <div className="procedure-header">
                <h3>Product Performance</h3>
                <span className="procedure-badge danger">Inactive</span>
              </div>
              <p>Evaluates product performance metrics and generates recommendations.</p>
              <div className="procedure-footer">
                <button className="procedure-btn run">Run Procedure</button>
                <button className="procedure-btn view">View Logs</button>
              </div>
            </div>
    
            <div className="procedure-card">
              <div className="procedure-header">
                <h3>Price Optimization</h3>
                <span className="procedure-badge warning">Scheduled</span>
              </div>
              <p>Recommends optimal pricing based on market trends and sales history.</p>
              <div className="procedure-footer">
                <button className="procedure-btn run">Run Procedure</button>
                <button className="procedure-btn view">View Logs</button>
              </div>
            </div>
    
            <div className="procedure-card">
              <div className="procedure-header">
                <h3>Seasonal Forecast</h3>
                <span className="procedure-badge success">Active</span>
              </div>
              <p>Projects seasonal demands and inventory requirements.</p>
              <div className="procedure-footer">
                <button className="procedure-btn run">Run Procedure</button>
                <button className="procedure-btn view">View Logs</button>
              </div>
            </div>
          </div>
        </div>
  )
}

export default StoreProcedure