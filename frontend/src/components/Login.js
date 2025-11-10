import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      onLogin(response.data.token, response.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #eef2fb 0%, #dbeafe 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <div 
        style={{
          background: '#fff',
          borderRadius: '18px',
          boxShadow: '0 6px 36px 0 #6366f15a',
          width: '340px',
          padding: '32px 28px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <div style={{ marginBottom: '18px', textAlign: 'center' }}>
          <div style={{ fontSize: '38px', marginBottom: '6px' }}>📚</div>
          <div style={{ fontWeight: 600, fontSize: '22px', marginBottom: '4px' }}>Welcome Back</div>
          <div style={{ fontSize: '16px', color: '#7b8dab', marginBottom: '8px' }}>
            Sign in to access The Vault
          </div>
        </div>
        
        {error && 
          <div style={{
            color: '#b91c1c',
            background: '#fee2e2',
            padding: '8px',
            borderRadius: '8px',
            marginBottom: '12px',
            width: '100%',
            textAlign: 'center',
            fontSize: '15px'
          }}>
            {error}
          </div>
        }

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontWeight: 500, marginBottom: '4px', fontSize: '15px' }}>Username</label>
            <input
              type="text"
              name="username"
              autoComplete="username"
              value={formData.username}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '9px',
                border: '1px solid #cbd5e1',
                fontSize: '15px'
              }}
              placeholder="Enter your username"
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontWeight: 500, marginBottom: '4px', fontSize: '15px' }}>Password</label>
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '9px',
                border: '1px solid #cbd5e1',
                fontSize: '15px'
              }}
              placeholder="Enter your password"
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: '#0e1726',
              color: '#fff',
              padding: '11px',
              border: 'none',
              borderRadius: '9px',
              fontWeight: 600,
              fontSize: '16px',
              cursor: 'pointer',
              marginBottom: '10px'
            }}
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>
        <div style={{ fontSize: '15px', marginBottom: '8px' }}>
          Don't have an account? <Link to="/register" style={{ color: '#2563eb', textDecoration: 'underline' }}>Sign up</Link>
        </div>
        <div 
          style={{
            background: '#f3f8ff',
            borderRadius: '12px',
            padding: '12px',
            marginTop: '6px',
            fontSize: '14px',
            width: '100%',
            color: '#334155'
          }}
        >
          Demo accounts:<br />
          <p>Admin: admin / admin123</p>
         <p>User: user1 / user123</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
