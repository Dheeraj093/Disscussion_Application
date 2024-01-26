import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../Config/userReducer';

const navbarStyle = {
  backgroundColor: '#708090',
  padding: '20px',
  color: '#fff',
  marginLeft:'-10px',
  marginRight:'-10px'
};

const spanStyle = {
  marginRight: '10px',
};

const buttonStyle = {
  backgroundColor: '#a0522d',
  color: '#fff',
  border: '1px solid #fff',
  padding: '4px 10px',
  cursor: 'pointer',
};

const Navbar = () => {
  const loggedInUser = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav style={navbarStyle}>
      <div>
        <span style={{ ...spanStyle, backgroundColor: '#708090' }}>Welcome, {loggedInUser.user.name}</span>

        <div style={{ float: 'right' }}>
          <button style={buttonStyle} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
