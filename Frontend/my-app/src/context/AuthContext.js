import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: null,
    token: null,
  });

  const login = async (data) => {
    try {
      const response = await fetch('http://127.0.0.1:3001/auth/login', {
        headers: { 'Content-type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.auth) {
        setAuth({
          isAuthenticated: true,
          user: result.user,
          token: result.token,
        });
        return { success: true };
      } else {
        return { success: false, message: 'Login falhou. Verifique as credenciais.' };
      }
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, message: 'Ocorreu um erro ao tentar fazer login.' };
    }
  };

  const logout = () => {
    setAuth({
      isAuthenticated: false,
      user: null,
      token: null,
    });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
