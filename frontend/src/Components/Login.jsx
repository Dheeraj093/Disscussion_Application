// Login.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUser } from '../Config/userReducer';

const Login = () => {
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/user/loginUser', { email });
      console.log('OTP send successful:', response.data);
      setOtpSent(true);
    } catch (error) {
      console.error('OTP send failed:', error.response.data);
    }
  };

  const handleOtpVerification = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/user/verify', { email, otp });
      console.log('Login successful:', response.data);
      dispatch(setUser(response.data)); 
      localStorage.setItem('userInfo', JSON.stringify(response.data));
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error.response.data);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Log In</h2>
      {!otpSent ? (
        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="email" style={styles.formLabel}>
              Email address
            </label>
            <input
              type="email"
              style={styles.formControl}
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button type="submit" style={styles.submitButton}>
            Log In
          </button>
        </form>
      ) : (
        <form onSubmit={handleOtpVerification} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="otp" style={styles.formLabel}>
              Enter OTP
            </label>
            <input type="text" style={styles.formControl} id="otp" value={otp} onChange={(e) => setOtp(e.target.value)} />
          </div>
          <button type="submit" style={styles.submitButton}>
            Verify OTP
          </button>
        </form>
      )}

      <p style={styles.linkText}>
        New to the forum? <Link to="/signup" style={styles.link}>
          Sign up here
        </Link>
      </p>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '400px',
    margin: 'auto',
    padding: '20px',
    backgroundColor: '#ffffff',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    marginTop: '100px',
  },
  form: {
    marginBottom: '20px',
  },
  formGroup: {
    marginBottom: '15px',
  },
  formLabel: {
    fontWeight: 'bold',
  },
  formControl: {
    width: '100%',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    boxSizing: 'border-box',
  },
  submitButton: {
    backgroundColor: '#007bff',
    border: 'none',
    color: '#fff',
    padding: '10px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  linkText: {
    marginTop: '15px',
  },
  link: {
    color: '#007bff',
    textDecoration: 'none',
  },
};

export default Login;
