import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css'; // Import the CSS file

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/auth/register', { username, email, password });
      console.log(response.data.message);
      navigate('/login'); // Redirect to login after registration
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.response?.data?.error || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="containerr-fluid">
      <div className="register-page">
        <div className="register-container">
          <h2 className="register-title">Create Account</h2>
          <p className="register-description">Complete the form below to create a new account. Once registered, you will be able to log in and access the application.</p>
          {error && <p className="register-error">{error}</p>}
          <div className="register-form">
            <div className="register-input-group">
              <i className="fas fa-user"></i>
              <input 
                type="text" 
                placeholder="Username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                className="register-input"
              />
            </div>
            <div className="register-input-group">
              <i className="fas fa-envelope"></i>
              <input 
                type="email" 
                placeholder="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="register-input"
              />
            </div>
            <div className="register-input-group">
              <i className="fas fa-lock"></i>
              <input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="register-input"
              />
            </div>
            <button onClick={handleRegister} className="register-btn">
              <i className="fas fa-user-plus"></i> Register
            </button>
            <p className="register-footer">
              Login if already have an account? <a href="/login">Log in here</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
