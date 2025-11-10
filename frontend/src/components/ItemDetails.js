import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ItemDetails({ item, onClose, user }) {
  const [accessLogs, setAccessLogs] = useState([]);

  useEffect(() => {
    if (user.role === 'admin') {
      fetchAccessLogs();
    }
  }, []);

  const fetchAccessLogs = async () => {
    try {
      const response = await axios.get(`/access/item/${item.item_id}`);
      setAccessLogs(response.data);
    } catch (error) {
      console.error('Error fetching access logs:', error);
    }
  };

  const handleDownload = async () => {
    try {
      await axios.post('/access/log-download', { itemId: item.item_id });
      window.open(item.file_url, '_blank');
      alert('Download logged successfully!');
    } catch (error) {
      console.error('Error logging download:', error);
    }
  };

  return (
    <div
      className="item-details-container"
      style={{
        background: 'linear-gradient(135deg, #f3f6fa, #e8eef5)',
        minHeight: '100vh',
        padding: '2rem',
        fontFamily: 'Inter, sans-serif'
      }}
    >
      {/* Header */}
      <header
        style={{
          background: '#e0e7f1',
          padding: '1rem 1.5rem',
          borderRadius: '10px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '1.5rem'
        }}
      >
        <h2 style={{ color: '#2a3f5f', margin: 0 }}>📚 The Vault</h2>
        <div>
          <span style={{ color: '#4a5a7a', marginRight: '1rem' }}>{user.username}</span>
          <button
            onClick={onClose}
            style={{
              background: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '0.5rem 1rem',
              cursor: 'pointer'
            }}
          >
            ← Back to Dashboard
          </button>
        </div>
      </header>

      {/* Item Summary */}
      <section
        className="item-summary"
        style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 3px 10px rgba(0,0,0,0.08)',
          marginBottom: '1.5rem'
        }}
      >
        <h3 style={{ color: '#2a3f5f', marginBottom: '0.5rem' }}>{item.title}</h3>
        <p style={{ color: '#5a6a85', margin: 0 }}>
          <strong>{item.type_name}</strong> — {item.medium}
        </p>
      </section>

      {/* Description */}
      <section
        className="item-description"
        style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          marginBottom: '1.5rem',
          boxShadow: '0 3px 10px rgba(0,0,0,0.05)'
        }}
      >
        <h4 style={{ color: '#2a3f5f', marginBottom: '0.75rem' }}>Description</h4>
        <p style={{ color: '#444', lineHeight: '1.6' }}>{item.description}</p>
      </section>

      {/* Info sections in grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1.5rem'
        }}
      >
        <section
          className="item-info"
          style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 3px 10px rgba(0,0,0,0.05)'
          }}
        >
          <h4 style={{ color: '#2a3f5f', marginBottom: '0.75rem' }}>Item Information</h4>
          <p><strong>Collection:</strong> {item.collection_name}</p>
          <p><strong>Location:</strong> {item.location || 'N/A'}</p>
          <p><strong>Creation Date:</strong> {item.creation_date || 'Unknown'}</p>
          <p><strong>Acquisition Date:</strong> {item.acquisition_date || 'Unknown'}</p>
        </section>

        <section
          className="contributor-info"
          style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 3px 10px rgba(0,0,0,0.05)'
          }}
        >
          <h4 style={{ color: '#2a3f5f', marginBottom: '0.75rem' }}>Contributor Information</h4>
          <p><strong>Name:</strong> {item.contributor_name}</p>
          <p><strong>Affiliation:</strong> {item.affiliation}</p>
        </section>
      </div>

      {/* File Access */}
      <section
        className="access-file"
        style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          marginTop: '1.5rem',
          boxShadow: '0 3px 10px rgba(0,0,0,0.05)',
          textAlign: 'center'
        }}
      >
        <h4 style={{ color: '#2a3f5f', marginBottom: '1rem' }}>Access File</h4>
        <button
          onClick={handleDownload}
          style={{
            background: '#4b74c2',
            color: 'white',
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          📥 View File
        </button>
        <p style={{ marginTop: '1rem', color: '#555' }}>
          <strong>File URL:</strong> {item.file_url}
        </p>
      </section>

      {/* Access Logs (Admin only) */}
      {user.role === 'admin' && accessLogs.length > 0 && (
        <section
          className="access-history"
          style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            marginTop: '1.5rem',
            boxShadow: '0 3px 10px rgba(0,0,0,0.05)'
          }}
        >
          <h4 style={{ color: '#2a3f5f', marginBottom: '1rem' }}>Access History</h4>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse'
            }}
          >
            <thead>
              <tr style={{ background: '#e8eef5' }}>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>User</th>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Email</th>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Access Type</th>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {accessLogs.map((log, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #e0e0e0' }}>
                  <td style={{ padding: '0.75rem' }}>{log.username || log.accessor_name}</td>
                  <td style={{ padding: '0.75rem' }}>{log.email || 'N/A'}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <span
                      style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '20px',
                        background:
                          log.access_type === 'download' ? '#4caf50' : '#2196f3',
                        color: 'white',
                        fontSize: '0.85rem'
                      }}
                    >
                      {log.access_type}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    {new Date(log.access_date).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}

export default ItemDetails;
