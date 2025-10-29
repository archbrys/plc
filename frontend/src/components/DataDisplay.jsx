import React, { useState } from 'react';
import './DataDisplay.css';

const DataDisplay = ({ data }) => {
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'raw'

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString() + '.' + date.getMilliseconds();
  };

  const renderTableView = () => {
    if (data.length === 0) {
      return (
        <div className="no-data">
          <p>No data received yet. Waiting for PLC data...</p>
        </div>
      );
    }

    return (
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td className="timestamp-cell">
                  {formatTimestamp(item.timestamp)}
                </td>
                <td className="data-cell">
                  {item.raw ? (
                    <span className="raw-data">{item.raw}</span>
                  ) : (
                    <pre>{JSON.stringify(item, null, 2)}</pre>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderRawView = () => {
    if (data.length === 0) {
      return (
        <div className="no-data">
          <p>No data received yet. Waiting for PLC data...</p>
        </div>
      );
    }

    return (
      <div className="raw-container">
        <pre className="raw-data-pre">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    );
  };

  const clearData = () => {
    if (window.confirm('Clear all received data?')) {
      // This would need to be passed up to parent component
      // For now, just show a message
      alert('Clear functionality would be implemented here');
    }
  };

  return (
    <div className="data-display">
      <div className="data-header">
        <h2>📊 PLC Data Monitor</h2>
        <div className="data-controls">
          <div className="view-toggle">
            <button
              className={`btn btn-small ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
            >
              Table
            </button>
            <button
              className={`btn btn-small ${viewMode === 'raw' ? 'active' : ''}`}
              onClick={() => setViewMode('raw')}
            >
              Raw
            </button>
          </div>
          <div className="data-info">
            <span className="data-count">{data.length} entries</span>
          </div>
        </div>
      </div>

      <div className="data-content">
        {viewMode === 'table' ? renderTableView() : renderRawView()}
      </div>
    </div>
  );
};

export default DataDisplay;

