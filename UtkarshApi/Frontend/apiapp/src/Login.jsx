import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Import the CSS file

const LoginPage = () => {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  const submitLogin = async () => {
    try {
      const result = await axios.post(
        'http://localhost:3001/api/auth/login',
        { username: user, password: pass },
        { withCredentials: true }
      );

      console.log('Login was successful:', result.data);

      navigate('/search'); 
    } catch (err) {
      setLoginError(err.response?.data?.error || 'Something went wrong. Please try again.');
      console.error('Login attempt failed:', err);
    }
  };

  return (
    <div className="container-fluid">
      <div className="login-page">
        <div className="login-box">
          <h2 className="login-header">Sign In</h2>
          <p className="login-info">Enter your username and password to log in. If you are new here, please register.</p>
          {loginError && <p className="login-error-message">{loginError}</p>}
          <div className="login-form">
            <div className="input-group">
              <i className="fas fa-user icon"></i>
              <input 
                type="text" 
                placeholder="Username" 
                value={user} 
                onChange={(e) => setUser(e.target.value)} 
                className="input-field"
              />
            </div>
            <div className="input-group">
              <i className="fas fa-lock icon"></i>
              <input 
                type="password" 
                placeholder="Password" 
                value={pass} 
                onChange={(e) => setPass(e.target.value)} 
                className="input-field"
              />
            </div>
            <button onClick={submitLogin} className="login-button">
              <i className="fas fa-sign-in-alt"></i> Sign In
            </button>
            <p className="signup-prompt">
              New here? <a href="/signup">Create an account</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
