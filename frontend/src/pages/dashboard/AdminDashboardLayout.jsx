import AdminSidebar from './AdminSidebar';
import { Outlet, useNavigate } from 'react-router-dom';

const mockAdmin = {
  name: 'Admin Name',
  email: 'admin@email.com',
};

const AdminDashboardLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin/login');
  };

  return (
    <div className="flex min-h-screen">
      <AdminSidebar admin={mockAdmin} onLogout={handleLogout} />
      <main className="flex-1 bg-white p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboardLayout; 