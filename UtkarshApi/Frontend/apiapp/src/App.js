import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Search from './Search';
import Lists from './Lists';
import EditList from './EditList';
import Navbar from './Navbar';
import './App.css';

const App = () => {
  const [user, setUser] = useState(null);
  const location = useLocation(); 

  const handleLogout = () => {
    setUser(null);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/auth/check', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user); 
        } else {
          setUser(null); 
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  const showNavbar = !['/login', '/register'].includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar user={user} onLogout={handleLogout} />}
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/lists" element={<Lists />} />
        <Route path="/search" element={<Search />} />
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/edit-list/:id" element={<EditList />} />
      </Routes>
    </>
  );
};

const AppWithRouter = () => (
    <App />
);

export default AppWithRouter;
