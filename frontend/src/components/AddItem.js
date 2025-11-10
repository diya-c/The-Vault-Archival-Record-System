import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AddItem({ onClose, collections, itemTypes, user }) {
  const [contributors, setContributors] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    creation_date: '',
    acquisition_date: '',
    location: '',
    file_url: '',
    item_type_id: '',
    collection_id: '',
    contributor_id: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchContributors();
  }, []);

  const fetchContributors = async () => {
    try {
      const response = await axios.get('/contributors');
      setContributors(response.data);
    } catch (error) {
      console.error('Error fetching contributors:', error);
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
    setError('');
    setLoading(true);

    try {
      await axios.post('/items', formData);
      alert('Item added successfully!');
      onClose();
    } catch (error) {
      setError(error.response?.data?.message || 'Error adding item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="add-item-container"
      style={{
        background: 'linear-gradient(135deg, #f3f6fa, #e8eef5)',
        minHeight: '100vh',
        padding: '2rem',
        fontFamily: 'Inter, sans-serif'
      }}
    >
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
              background: '#d9534f',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '0.5rem 1rem',
              cursor: 'pointer'
            }}
          >
            ← Cancel
          </button>
        </div>
      </header>

      <section
        className="form-section"
        style={{
          background: 'white',
          borderRadius: '12px',
          padding: '2rem',
          maxWidth: '800px',
          margin: '0 auto',
          boxShadow: '0 3px 10px rgba(0,0,0,0.08)'
        }}
      >
        <h3 style={{ color: '#2a3f5f', marginBottom: '1.2rem' }}>Add New Archive Item</h3>
        {error && (
          <div
            style={{
              background: '#f8d7da',
              color: '#721c24',
              padding: '0.75rem',
              borderRadius: '8px',
              marginBottom: '1rem'
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {[
            { label: 'Title *', name: 'title', type: 'text' },
            { label: 'Description *', name: 'description', type: 'textarea' },
            { label: 'File URL *', name: 'file_url', type: 'text' },
            { label: 'Location', name: 'location', type: 'text' }
          ].map((field) => (
            <div key={field.name} className="form-group" style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontWeight: '600', color: '#344767' }}>
                {field.label}
              </label>
              {field.type === 'textarea' ? (
                <textarea
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required={field.label.includes('*')}
                  style={{
                    width: '100%',
                    border: '1px solid #cbd5e0',
                    borderRadius: '8px',
                    padding: '0.75rem',
                    fontSize: '1rem'
                  }}
                />
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required={field.label.includes('*')}
                  style={{
                    width: '100%',
                    border: '1px solid #cbd5e0',
                    borderRadius: '8px',
                    padding: '0.75rem',
                    fontSize: '1rem'
                  }}
                />
              )}
            </div>
          ))}

          {/* Dropdowns */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontWeight: '600', color: '#344767' }}>Item Type *</label>
              <select
                name="item_type_id"
                value={formData.item_type_id}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e0'
                }}
              >
                <option value="">Select Type</option>
                {itemTypes.map((type) => (
                  <option key={type.item_type_id} value={type.item_type_id}>
                    {type.type_name} ({type.medium})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontWeight: '600', color: '#344767' }}>Collection *</label>
              <select
                name="collection_id"
                value={formData.collection_id}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e0'
                }}
              >
                <option value="">Select Collection</option>
                {collections.map((collection) => (
                  <option
                    key={collection.collection_id}
                    value={collection.collection_id}
                  >
                    {collection.collection_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <label style={{ fontWeight: '600', color: '#344767' }}>Contributor *</label>
            <select
              name="contributor_id"
              value={formData.contributor_id}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid #cbd5e0'
              }}
            >
              <option value="">Select Contributor</option>
              {contributors.map((contributor) => (
                <option
                  key={contributor.contributor_id}
                  value={contributor.contributor_id}
                >
                  {contributor.name} - {contributor.affiliation}
                </option>
              ))}
            </select>
          </div>

          {/* Dates */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
              marginTop: '1rem'
            }}
          >
            <div>
              <label style={{ fontWeight: '600', color: '#344767' }}>Creation Date</label>
              <input
                type="date"
                name="creation_date"
                value={formData.creation_date}
                onChange={handleChange}
                style={{
                  width: '100%',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e0',
                  padding: '0.75rem'
                }}
              />
            </div>
            <div>
              <label style={{ fontWeight: '600', color: '#344767' }}>Acquisition Date</label>
              <input
                type="date"
                name="acquisition_date"
                value={formData.acquisition_date}
                onChange={handleChange}
                style={{
                  width: '100%',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e0',
                  padding: '0.75rem'
                }}
              />
            </div>
          </div>

          {/* Buttons */}
          <div
            className="form-actions"
            style={{
              marginTop: '2rem',
              display: 'flex',
              justifyContent: 'center',
              gap: '1rem'
            }}
          >
            <button
              type="submit"
              disabled={loading}
              style={{
                background: '#4b74c2',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                border: 'none',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              {loading ? 'Adding...' : 'Add Item'}
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: '#6c757d',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                border: 'none',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default AddItem;
