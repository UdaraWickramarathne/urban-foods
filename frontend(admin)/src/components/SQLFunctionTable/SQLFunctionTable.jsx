import React, { useState, useEffect } from "react";
import "./SQLFunctionTable.css";
import { apiContext } from "../../context/apiContext";

const SQLFunctionTable = () => {
  const [functions, setFunctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFunction, setSelectedFunction] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [functionCode, setFunctionCode] = useState("");
  const [loadingCode, setLoadingCode] = useState(false);

  const { getSQLFunctions, getSQLFunctionDetails } = apiContext();

  useEffect(() => {
    // Fetch SQL functions from backend
    const fetchFunctions = async () => {
      try {
        setLoading(true);
        // Replace with your actual API endpoint
        const response = await getSQLFunctions();
        
        if (response.success) {
          // Transform the data into a more usable format
          const formattedFunctions = response.data.map(([name, type]) => ({
            name,
            type
          }));
          setFunctions(formattedFunctions);
        } else {
          throw new Error('Failed to fetch functions');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching functions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFunctions();
  }, []);

  const handleViewFunction = async (fn) => {
    setSelectedFunction(fn);
    setIsViewModalOpen(true);
    setLoadingCode(true);
    
    try {
      const response = await getSQLFunctionDetails(fn.name);
      if (response.success) {
        setFunctionCode(response.data);
      } else {
        setFunctionCode("// Error fetching function code");
        console.error('Failed to load function details:', response.message);
      }
    } catch (err) {
      setFunctionCode("// Error fetching function code");
      console.error('Error fetching function details:', err);
    } finally {
      setLoadingCode(false);
    }
  };

  const handleRunFunction = (name) => {
    console.log(`Running function: ${name}`);
    // Implement function execution logic here
  };

  const closeModal = () => {
    setIsViewModalOpen(false);
    setSelectedFunction(null);
    setFunctionCode("");
  };

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

  if (loading) {
    return <div className="sql-function-loading">Loading SQL functions...</div>;
  }

  if (error) {
    return <div className="sql-function-error">Error loading functions: {error}</div>;
  }

  return (
    <div className="sql-function-table-container">
      <h2>SQL Functions</h2>
      
      <div className="function-container">
        {functions.length > 0 ? (
          functions.map((fn, index) => (
            <div className="function-card" key={index}>
              <div className="function-header">
                <h3>{fn.name}</h3>
                <span className="function-badge success">Available</span>
              </div>
              <p>SQL function available in the database.</p>
              <div className="function-footer">
                {/* <button 
                  className="function-btn run"
                  onClick={() => handleRunFunction(fn.name)}
                >
                  Execute Function
                </button> */}
                <button 
                  className="function-btn view"
                  onClick={() => handleViewFunction(fn)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-functions">No SQL functions available</div>
        )}
      </div>

      {/* View Modal */}
      {isViewModalOpen && selectedFunction && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>Function Details</h3>
              <button className="close-button" onClick={closeModal}>
                <CloseIcon />
              </button>
            </div>
            <div className="modal-body">
              <div className="function-details">
                <div className="detail-row">
                  <span className="detail-label">Function Name:</span>
                  <span className="detail-value">{selectedFunction.name}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Type:</span>
                  <span className="detail-value">{selectedFunction.type}</span>
                </div>
              </div>

              <div className="function-code">
                <h4>Function Code</h4>
                {loadingCode ? (
                  <div className="code-loading">Loading function code...</div>
                ) : (
                  <pre className="code-block">
                    {functionCode}
                  </pre>
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

export default SQLFunctionTable;
