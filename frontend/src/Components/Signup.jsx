import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../Config/userReducer';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const naviage = useNavigate();
  const dispatch = useDispatch();

  const handleSignUp = async(e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://discussionforum.onrender.com/user/registerUser', {email,name});
      console.log('OTP send successful:', response.data);
      setOtpSent(true);
    } catch (error) {
      console.error('OTP send failed:', error.response.data);
    }
  };

  const handleOtpVerification = async(e) => {
    e.preventDefault();
     try {
      const response = await axios.post('https://discussionforum.onrender.com/user/verify', {email,otp});
      console.log('Register successful:', response.data);
      dispatch(setUser(response.data)); 
      localStorage.setItem("userInfo", JSON.stringify(response.data));
      naviage("/");
    } catch (error) {
      console.error('Register failed:', error.response.data);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Sign Up</h2>
      {!otpSent ? (
        <form onSubmit={handleSignUp}>
          <div style={styles.formGroup}>
            <label htmlFor="name" style={styles.formLabel}>Name</label>
            <input type="text" style={styles.formControl} id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="email" style={styles.formLabel}>Email address</label>
            <input type="email" style={styles.formControl} id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <button type="submit" style={styles.submitButton}>Sign Up</button>
        </form>
      ) : (
        <form onSubmit={handleOtpVerification}>
          <div style={styles.formGroup}>
            <label htmlFor="otp" style={styles.formLabel}>Enter OTP</label>
            <input type="text" style={styles.formControl} id="otp" value={otp} onChange={(e) => setOtp(e.target.value)} />
          </div>
          <button type="submit" style={styles.submitButton}>Verify OTP</button>
        </form>
      )}
      <p style={styles.linkText}>
        Already have an account? <Link to="/login" style={styles.link}>Log in here</Link>
      </p>
    </div>
  );
};

export default Register;

const styles = {
  container: {
    maxWidth: '400px',
    margin: 'auto',
    padding: '20px',
    backgroundColor: '#ffffff',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    marginTop: '100px',
    fontFamily: 'Arial, sans-serif',
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
