import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ItemDetails from './ItemDetails';

function UserDashboard({ user, onLogout }) {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [collections, setCollections] = useState([]);
  const [itemTypes, setItemTypes] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    collection: ''
  });

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  useEffect(() => {
    applyFilters();
  }, [filters, items]);

  const fetchData = async () => {
    try {
      const [itemsRes, collectionsRes, typesRes] = await Promise.all([
        axios.get('/items'),
        axios.get('/items/meta/collections'),
        axios.get('/items/meta/types')
      ]);
      setItems(itemsRes.data);
      setFilteredItems(itemsRes.data);
      setCollections(collectionsRes.data);
      setItemTypes(typesRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...items];
    if (filters.search) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.description?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    if (filters.type) filtered = filtered.filter(item => item.type_name === filters.type);
    if (filters.collection) filtered = filtered.filter(item => item.collection_name === filters.collection);
    setFilteredItems(filtered);
  };

  const handleFilterChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });
  const handleItemClick = (item) => setSelectedItem(item);
  const handleCloseDetails = () => { setSelectedItem(null); fetchData(); };

  if (!user) return <div>Loading user info...</div>;
  if (loading) return <div>Loading dashboard...</div>;
  if (selectedItem) return <ItemDetails item={selectedItem} onClose={handleCloseDetails} user={user} />;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #eef2fb 0%, #dbeafe 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '24px'
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: '16px',
          boxShadow: '0 6px 36px 0 #6366f15a',
          width: '95%',
          maxWidth: '1100px',
          padding: '24px 30px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}
      >
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #e2e8f0',
            paddingBottom: '10px'
          }}
        >
          <h2 style={{ fontSize: '22px', fontWeight: 600, color: '#0e1726' }}>📚 The Vault</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '15px', color: '#475569' }}>
              Welcome, <b>{user.username}</b> (User)
            </span>
            <button
              onClick={onLogout}
              style={{
                background: '#0e1726',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 14px',
                cursor: 'pointer',
                fontWeight: 500
              }}
            >
              Logout
            </button>
          </div>
        </header>

        <section style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '20px', marginBottom: '4px' }}>User Dashboard</h3>
          <p style={{ color: '#64748b', fontSize: '15px', marginBottom: '16px' }}>
            Browse and explore archival items across collections and types
          </p>
        </section>

        <section>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '14px' }}>
            <input
              type="text"
              name="search"
              placeholder="Search by title or description"
              value={filters.search}
              onChange={handleFilterChange}
              style={{
                flex: 1,
                minWidth: '220px',
                padding: '8px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1'
              }}
            />
            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              style={{
                padding: '8px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1'
              }}
            >
              <option value="">All Types</option>
              {itemTypes.map(type => (
                <option key={type.type_name} value={type.type_name}>{type.type_name}</option>
              ))}
            </select>
            <select
              name="collection"
              value={filters.collection}
              onChange={handleFilterChange}
              style={{
                padding: '8px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1'
              }}
            >
              <option value="">All Collections</option>
              {collections.map(collection => (
                <option key={collection.collection_name} value={collection.collection_name}>{collection.collection_name}</option>
              ))}
            </select>
          </div>

          <p style={{ fontSize: '15px', color: '#475569', marginBottom: '10px' }}>
            Found {filteredItems.length} item(s)
          </p>

          {filteredItems.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                color: '#64748b',
                background: '#f8fafc',
                borderRadius: '12px',
                padding: '20px'
              }}
            >
              <p>No items found</p>
              <p>Try adjusting your search filters</p>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '16px'
              }}
            >
              {filteredItems.map(item => (
                <div
                  key={item.item_id}
                  onClick={() => handleItemClick(item)}
                  style={{
                    background: '#f8fafc',
                    borderRadius: '12px',
                    padding: '14px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
                  onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  <h4 style={{ marginBottom: '6px' }}>{item.title}</h4>
                  <p><strong>Type:</strong> {item.type_name}</p>
                  <p style={{ color: '#475569' }}>{item.description?.substring(0, 150)}...</p>
                  <p style={{ fontSize: '14px', color: '#64748b' }}>
                    📁 {item.collection_name} &nbsp; | &nbsp; 👤 {item.contributor_name}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default UserDashboard;
