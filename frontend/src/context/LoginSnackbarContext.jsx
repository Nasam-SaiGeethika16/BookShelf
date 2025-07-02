import React, { createContext, useState, useCallback } from 'react';

export const LoginSnackbarContext = createContext();

export const LoginSnackbarProvider = ({ children }) => {
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  const showLoginSnackbar = useCallback((message) => {
    setSnackbar({ open: true, message });
  }, []);

  const closeSnackbar = useCallback(() => {
    setSnackbar({ open: false, message: '' });
  }, []);

  return (
    <LoginSnackbarContext.Provider value={{ ...snackbar, showLoginSnackbar, closeSnackbar }}>
      {children}
    </LoginSnackbarContext.Provider>
  );
}; 