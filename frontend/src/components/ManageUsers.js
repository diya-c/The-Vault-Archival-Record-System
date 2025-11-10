import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/users');
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    if (window.confirm(`Change user role to ${newRole}?`)) {
      try {
        await axios.put(`/users/${userId}/role`, { role: newRole });
        alert('User role updated successfully!');
        fetchUsers();
      } catch (error) {
        alert('Error updating role: ' + error.response?.data?.message);
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`/users/${userId}`);
        alert('User deleted successfully!');
        fetchUsers();
      } catch (error) {
        alert('Error deleting user: ' + error.response?.data?.message);
      }
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #007BFF, #00BFFF)',
        color: 'white',
        fontFamily: 'Segoe UI, sans-serif'
      }}>
        <h2>Loading users...</h2>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      // background: 'linear-gradient(135deg, #e9f0f8ff, #e4ecefff)',
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
        width: '90%',
        maxWidth: '1000px',
        padding: '2rem',
        textAlign: 'center'
      }}>
        <h2 style={{
          marginBottom: '1.5rem',
          color: '#007BFF'
        }}>
          Manage Users
        </h2>

        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginBottom: '1rem'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              {['ID', 'Username', 'Email', 'Role', 'Created', 'Actions'].map(header => (
                <th
                  key={header}
                  style={{
                    padding: '12px',
                    borderBottom: '2px solid #e0e0e0',
                    color: '#333',
                    textAlign: 'center'
                  }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.user_id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px' }}>{user.user_id}</td>
                <td style={{ padding: '10px' }}>{user.username}</td>
                <td style={{ padding: '10px' }}>{user.email}</td>
                <td style={{ padding: '10px' }}>
                  <span style={{
                    padding: '6px 14px',
                    borderRadius: '20px',
                    background: user.role === 'admin' ? '#f44336' : '#2196f3',
                    color: 'white',
                    fontSize: '0.85rem'
                  }}>
                    {user.role}
                  </span>
                </td>
                <td style={{ padding: '10px' }}>
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td style={{ padding: '10px' }}>
                  <button
                    onClick={() => handleRoleChange(user.user_id, user.role)}
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
                    Toggle Role
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.user_id)}
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
          Total users: <strong>{users.length}</strong>
        </p>
      </div>
    </div>
  );
}

export default ManageUsers;
