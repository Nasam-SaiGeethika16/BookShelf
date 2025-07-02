import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const AdminRoute = ({children}) => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  // If trying to access dashboard routes without token, redirect to admin login
  if (location.pathname.startsWith('/dashboard') && !token) {
    return <Navigate to="/admin"/>;
  }

  // For non-dashboard routes, just render the children/outlet without checking token
  return children ? children : <Outlet/>;
}

export default AdminRoute