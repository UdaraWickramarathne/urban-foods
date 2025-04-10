import React, { useState, useEffect } from 'react';
import './DatabaseBackup.css'; // You'll need to create this CSS file
import { apiContext } from '../../context/apiContext';
import { set } from 'mongoose';

const DatabaseBackup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('info');
  const [backups, setBackups] = useState([]);

  const { getBackups, downloadBackup, createBackup } = apiContext();

  useEffect(() => {
    fetchBackups();
  }, []);

  const fetchBackups = async () => {
    try {
        setIsLoading(true);
        const response = await getBackups();
        if (response.success) {
            setBackups(response.data);
        } else {
            setMessage(response.message);
            setMessageType('error');
        }
        setIsLoading(false);
    } catch (error) {
        console.error('Error fetching backups:', error);
        setMessage('Failed to fetch backup data');
        setMessageType('error');
        setIsLoading(false);
    }
  };

  const handleCreateBackup = async () => {
    try {
        setIsLoading(true);
        const result = await createBackup();
        if (result.success) {
            setMessage('Backup created successfully');
            setMessageType('success');
            await fetchBackups(); // Refresh the backups list
        }else{
            setMessage(result.message);
            setMessageType('error');
        }
    } catch (error) {
        console.error('Error creating backup:', error);
        setMessage('Failed to create backup');
        setMessageType('error');
    }
  };

  const hanldeDownloadBackup = async (id) => {
    // Implement actual download functionality
    try {
        setIsLoading(true);
        const result = await downloadBackup(id);
        if (result.success) {
            setMessage('Backup downloaded successfully');
            setMessageType('success');
        }else{
            setMessage(result.message);
            setMessageType('error');
        }
        
    } catch (error) {
        setMessage('Failed to download backup');
        setMessageType('error');
    }finally {
        setIsLoading(false);
    }

  };

  return (
    <div className="db-dashboard-content">
      {/* Summary Stats Row */}
      <div className="db-stats-row">
        <div className="db-stat-card">
          <div className="db-stat-icon" style={{ backgroundColor: 'rgba(95, 46, 234, 0.1)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="#5F2EEA"/>
            </svg>
          </div>
          <div className="db-stat-content">
            <button 
              className={`db-backup-button ${isLoading ? 'db-loading' : ''}`} 
              onClick={handleCreateBackup} 
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Create Database Backup'}
            </button>
          </div>
        </div>
        
        <div className="db-stat-card">
          <div className="db-stat-icon" style={{ backgroundColor: 'rgba(54, 179, 126, 0.1)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z" fill="#36B37E"/>
            </svg>
          </div>
          <div className="db-stat-content">
            <h3>Available Backups</h3>
            <p className="db-stat-value">{backups.length}</p>
            <p className="db-stat-change db-positive">Ready to download</p>
          </div>
        </div>
        
        <div className="db-stat-card">
          <div className="db-stat-icon" style={{ backgroundColor: 'rgba(255, 171, 0, 0.1)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="#FFAB00"/>
            </svg>
          </div>
          <div className="db-stat-content">
            <h3>Last Backup</h3>
            <p className="db-stat-value">{backups.length > 0 ? new Date(backups[0].createdAt).toLocaleDateString() : 'None'}</p>
            <p className="db-stat-change">{backups.length > 0 ? new Date(backups[0].createdAt).toLocaleTimeString() : 'No backups available'}</p>
          </div>
        </div>
      </div>
      
      {/* Message display */}
      {message && (
        <div className={`db-message-alert ${messageType}`}>
          <div className="db-message-content">
            <span>{message}</span>
            <button className="db-close-button" onClick={() => setMessage(null)}>×</button>
          </div>
        </div>
      )}
      
      {/* Tables Row */}
      <div className="db-tables-row">
        <div className="db-table-card">
          <div className="db-card-header">
            <h3>Backup History</h3>
            <select className="db-time-selector">
              <option>All Backups</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
          
          <table className="db-dashboard-table">
            <thead>
              <tr>
                <th>Backup ID</th>
                <th>File Name</th>
                <th>Date</th>
                <th>Time</th>
                <th>Size</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {backups.length > 0 ? (
                backups.map((backup) => (
                  <tr key={backup.id}>
                    <td>{backup.id}</td>
                    <td>{backup.fileName}</td>
                    <td>{new Date(backup.createdAt).toLocaleDateString()}</td>
                    <td>{new Date(backup.createdAt).toLocaleTimeString()}</td>
                    <td>{backup.size}</td>
                    <td>
                      <span className="db-status-badge db-status-completed">
                        {backup.status}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="db-action-button db-download" 
                        onClick={() => hanldeDownloadBackup(backup.id)}
                        disabled={isLoading}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" fill="currentColor"/>
                        </svg>
                        Download
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="db-no-data">
                    No backup history available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DatabaseBackup;
