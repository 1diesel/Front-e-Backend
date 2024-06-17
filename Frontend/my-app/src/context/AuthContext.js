// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: null,
    token: null,
  });

  useEffect(() => {
    const storedAuth = localStorage.getItem('auth');
    if (storedAuth) {
      const parsedAuth = JSON.parse(storedAuth);
      setAuth(parsedAuth);
      fetchUserDetails(parsedAuth.token);
    }
  }, []);

  const fetchUserDetails = async (token) => {
    try {
      const response = await fetch('http://127.0.0.1:3001/auth/user', {
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (result.user) {
        setAuth((prevAuth) => ({
          ...prevAuth,
          isAuthenticated: true,
          user: result.user,
        }));
      } else {
        logout();
      }
    } catch (error) {
      console.error('Failed to fetch user details:', error);
      logout();
    }
  };

  const login = async (data) => {
    try {
      const response = await fetch('http://127.0.0.1:3001/auth/login', {
        headers: { 'Content-type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.token) {
        const newAuth = {
          isAuthenticated: true,
          user: result.user,
          token: result.token,
        };
        setAuth(newAuth);
        localStorage.setItem('auth', JSON.stringify(newAuth));
        return { success: true };
      } else {
        return { success: false, message: 'Login failed. Check your credentials.' };
      }
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, message: 'An error occurred while trying to log in.' };
    }
  };

  const logout = () => {
    setAuth({
      isAuthenticated: false,
      user: null,
      token: null,
    });
    localStorage.removeItem('auth');
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
