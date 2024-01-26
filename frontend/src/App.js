import './App.css';
import Login from './Components/Login';
import Signup from './Components/Signup';
import Home from './Components/Home';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { setUser } from './Config/userReducer';

function App() {
  const loggedInUser = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log('Effect triggered. Current loggedInUser:', loggedInUser);
    const userFromLocalStorage = JSON.parse(localStorage.getItem('userInfo'));
    
    // Check if there's a user in the Redux state or in local storage
    if (!loggedInUser && userFromLocalStorage) {
      dispatch(setUser(userFromLocalStorage));
    }
  }, [loggedInUser]);

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route
            path="login"
            element={loggedInUser ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="signup"
            element={loggedInUser ? <Navigate to="/" /> : <Signup />}
          />
          <Route
            path="/"
            element={!loggedInUser ? <Navigate to="/login" /> : <Home />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
