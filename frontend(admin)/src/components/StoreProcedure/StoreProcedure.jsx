import React, { useState, useEffect } from 'react'
import './StoreProcedure.css'
import { apiContext } from '../../context/apiContext'

const StoreProcedure = () => {
  const [procedures, setProcedures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Added states for modal and execution
  const [showModal, setShowModal] = useState(false);
  const [selectedProcedure, setSelectedProcedure] = useState(null);
  const [executionResult, setExecutionResult] = useState(null);
  const [executionLoading, setExecutionLoading] = useState(false);
  
  // Added states for procedure details modal
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [procedureCode, setProcedureCode] = useState("");
  const [loadingCode, setLoadingCode] = useState(false);

  const { getProcedures, executeProcedure, getProcedureDetails } = apiContext();

  const fetchProcedures = async () => {
    try {
      setLoading(true);
      const response = await getProcedures();
      if (response.success) {
        const formatedProcedures = response.data.map(([name, type]) => ({
          name,
          type
        }));

        setProcedures(formatedProcedures);
      } else {
        setError(response.message || 'Failed to fetch procedures');
      }
    } catch (error) {
      setError('Error fetching procedures: ' + error.message);
      console.error('Error fetching procedures:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProcedures();
  }, []);

  // Helper function to determine badge class based on status
  const getBadgeClass = (status) => {
    switch(status?.toLowerCase()) {
      case 'active': return 'success';
      case 'scheduled': return 'warning';
      case 'inactive': return 'danger';
      default: return 'success';
    }
  };
  
  // Function to handle running a procedure
  const handleRunProcedure = async (procedure) => {
    setSelectedProcedure(procedure);
    setShowModal(true);
    setExecutionLoading(true);
    setExecutionResult(null);
    
    try {
      const response = await executeProcedure(procedure.name);
      if (response.success) {
        setExecutionResult(response.data);
      } else {
        setError(`Failed to execute procedure: ${response.message || 'Unknown error'}`);
      }
    } catch (err) {
      setError(`Error executing procedure: ${err.message}`);
      console.error('Error executing procedure:', err);
    } finally {
      setExecutionLoading(false);
    }
  };
  
  // Function to format the execution result into lines
  const formatResult = (result) => {
    if (!result) return [];
    
    // Split by commas but keep email addresses intact
    const parts = result.split(', ');
    return parts.map(part => part.trim());
  };

  // Function to handle viewing procedure details
  const handleViewProcedure = async (procedure) => {
    setSelectedProcedure(procedure);
    setIsViewModalOpen(true);
    setLoadingCode(true);
    
    try {
      const response = await getProcedureDetails(procedure.name);
      if (response.success) {
        setProcedureCode(response.data);
      } else {
        setProcedureCode("// Error fetching procedure code");
        setError(`Failed to load procedure details: ${response.message || 'Unknown error'}`);
      }
    } catch (err) {
      setProcedureCode("// Error fetching procedure code");
      setError(`Error fetching procedure details: ${err.message}`);
      console.error('Error fetching procedure details:', err);
    } finally {
      setLoadingCode(false);
    }
  };
  
  const closeDetailsModal = () => {
    setIsViewModalOpen(false);
    setSelectedProcedure(null);
    setProcedureCode("");
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

  return (
    <div className="store-procedure">
      <h2>Store Procedures</h2>
      
      {loading && <p>Loading procedures...</p>}
      {error && <p className="error-message">{error}</p>}
      
      <div className="procedure-container">
        {!loading && !error && procedures.length === 0 && (
          <p>No procedures found.</p>
        )}
        
        {procedures.map((procedure, index) => (
          <div className="procedure-card" key={procedure.id || index}>
            <div className="procedure-header">
              <h3>{procedure.name}</h3>
            </div>
            <p>SQL procedure available in the database</p>
            <div className="procedure-footer">
              <button 
                className="procedure-btn run" 
                onClick={() => handleRunProcedure(procedure)}
              >
                Run Procedure
              </button>
              <button 
                className="procedure-btn view"
                onClick={() => handleViewProcedure(procedure)}
              >
                Show Details
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Execution Result Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Procedure Result: {selectedProcedure?.name}</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              {executionLoading ? (
                <p>Executing procedure...</p>
              ) : executionResult ? (
                <div className="result-container">
                  {formatResult(executionResult).map((line, index) => (
                    <div className="result-line" key={index}>
                      {line}
                    </div>
                  ))}
                </div>
              ) : (
                <p>No results to display</p>
              )}
            </div>
            <div className="modal-footer">
              <button className="procedure-btn" onClick={() => setShowModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
      
      {/* Procedure Details Modal */}
      {isViewModalOpen && selectedProcedure && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>Procedure Details</h3>
              <button className="close-button" onClick={closeDetailsModal}>
                <CloseIcon />
              </button>
            </div>
            <div className="modal-body">
              <div className="procedure-details">
                <div className="detail-row">
                  <span className="detail-label">Procedure Name:</span>
                  <span className="detail-value">{selectedProcedure.name}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Type:</span>
                  <span className="detail-value">{selectedProcedure.type}</span>
                </div>
              </div>

              <div className="procedure-code">
                <h4>Procedure Code</h4>
                {loadingCode ? (
                  <div className="code-loading">Loading procedure code...</div>
                ) : (
                  <pre className="code-block">
                    {procedureCode}
                  </pre>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeDetailsModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StoreProcedure