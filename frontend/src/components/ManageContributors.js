import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ManageContributors() {
  const [contributors, setContributors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    contact_info: '',
    affiliation: '',
    expertise: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContributors();
  }, []);

  const fetchContributors = async () => {
    try {
      const response = await axios.get('/contributors');
      setContributors(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching contributors:', error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/contributors/${editingId}`, formData);
        alert('Contributor updated successfully!');
      } else {
        await axios.post('/contributors', formData);
        alert('Contributor added successfully!');
      }
      resetForm();
      fetchContributors();
    } catch (error) {
      alert('Error: ' + error.response?.data?.message);
    }
  };

  const handleEdit = (contributor) => {
    setFormData({
      name: contributor.name,
      contact_info: contributor.contact_info || '',
      affiliation: contributor.affiliation || '',
      expertise: contributor.expertise || ''
    });
    setEditingId(contributor.contributor_id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this contributor?')) {
      try {
        await axios.delete(`/contributors/${id}`);
        alert('Contributor deleted successfully!');
        fetchContributors();
      } catch (error) {
        alert('Error deleting contributor: ' + error.response?.data?.message);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      contact_info: '',
      affiliation: '',
      expertise: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f0ffff',
        color: 'white',
        fontFamily: 'Segoe UI, sans-serif'
      }}>
        <h2>Loading contributors...</h2>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
background: "linear-gradient(to right, #dbeafe, #eff6ff)",      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'Segoe UI, sans-serif',
      padding: '2rem'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
        width: '95%',
        maxWidth: '1100px',
        padding: '2rem',
        textAlign: 'center'
      }}>
        <h2 style={{ marginBottom: '1.5rem', color: '#007BFF' }}>
          Manage Contributors
        </h2>

        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            background: showForm ? '#f44336' : '#28a745',
            color: 'white',
            border: 'none',
            padding: '10px 18px',
            borderRadius: '8px',
            cursor: 'pointer',
            marginBottom: '1rem'
          }}
        >
          {showForm ? 'Cancel' : '➕ Add Contributor'}
        </button>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            style={{
              marginTop: '1rem',
              background: '#f8f9fa',
              padding: '1.5rem',
              borderRadius: '12px',
              boxShadow: 'inset 0 0 10px rgba(0,0,0,0.05)',
              textAlign: 'left'
            }}
          >
            <h4 style={{ marginBottom: '1rem', color: '#007BFF' }}>
              {editingId ? 'Edit Contributor' : 'Add New Contributor'}
            </h4>

            {['name', 'contact_info', 'affiliation', 'expertise'].map(field => (
              <div key={field} style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#333' }}>
                  {field.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                  {field === 'name' && ' *'}
                </label>
                <input
                  type="text"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  required={field === 'name'}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '6px',
                    outline: 'none'
                  }}
                />
              </div>
            ))}

            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              <button
                type="submit"
                style={{
                  background: '#007BFF',
                  color: 'white',
                  border: 'none',
                  padding: '10px 18px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  marginRight: '10px'
                }}
              >
                {editingId ? 'Update' : 'Add'} Contributor
              </button>
              <button
                type="button"
                onClick={resetForm}
                style={{
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '10px 18px',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginTop: '2rem'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              {['ID', 'Name', 'Contact', 'Affiliation', 'Expertise', 'Actions'].map(header => (
                <th key={header} style={{
                  padding: '12px',
                  borderBottom: '2px solid #e0e0e0',
                  color: '#333',
                  textAlign: 'center'
                }}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {contributors.map(contributor => (
              <tr key={contributor.contributor_id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px' }}>{contributor.contributor_id}</td>
                <td style={{ padding: '10px' }}>{contributor.name}</td>
                <td style={{ padding: '10px' }}>{contributor.contact_info || 'N/A'}</td>
                <td style={{ padding: '10px' }}>{contributor.affiliation || 'N/A'}</td>
                <td style={{ padding: '10px' }}>{contributor.expertise || 'N/A'}</td>
                <td style={{ padding: '10px' }}>
                  <button
                    onClick={() => handleEdit(contributor)}
                    style={{
                      background: '#007BFF',
                      color: 'white',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      marginRight: '8px'
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(contributor.contributor_id)}
                    style={{
                      background: '#f44336',
                      color: 'white',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <p style={{ color: '#555', marginTop: '1rem' }}>
          Total contributors: <strong>{contributors.length}</strong>
        </p>
      </div>
    </div>
  );
}

export default ManageContributors;
