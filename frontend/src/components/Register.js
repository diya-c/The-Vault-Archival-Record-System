import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await axios.post('/auth/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
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
          <div style={{ fontWeight: 600, fontSize: '22px', marginBottom: '4px' }}>Create Account</div>
          <div style={{ fontSize: '16px', color: '#7b8dab', marginBottom: '8px' }}>
            Join the Archival Records System
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
        {success &&
          <div style={{
            color: '#15803d',
            background: '#dcfce7',
            padding: '8px',
            borderRadius: '8px',
            marginBottom: '12px',
            width: '100%',
            textAlign: 'center',
            fontSize: '15px'
          }}>
            {success}
          </div>
        }

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontWeight: 500, marginBottom: '4px', fontSize: '15px' }}>Username</label>
            <input
              type="text"
              name="username"
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
              placeholder="Enter username"
            />
          </div>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontWeight: 500, marginBottom: '4px', fontSize: '15px' }}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '9px',
                border: '1px solid #cbd5e1',
                fontSize: '15px'
              }}
              placeholder="your.email@example.com"
            />
          </div>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontWeight: 500, marginBottom: '4px', fontSize: '15px' }}>Password</label>
            <input
              type="password"
              name="password"
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
              placeholder="Create password"
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontWeight: 500, marginBottom: '4px', fontSize: '15px' }}>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '9px',
                border: '1px solid #cbd5e1',
                fontSize: '15px'
              }}
              placeholder="Repeat password"
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
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <div style={{ fontSize: '15px', marginBottom: '8px' }}>
          Already have an account? <Link to="/login" style={{ color: '#2563eb', textDecoration: 'underline' }}>Login</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
