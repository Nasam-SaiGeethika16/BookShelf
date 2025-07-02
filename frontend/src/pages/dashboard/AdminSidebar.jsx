import { Link, useLocation } from 'react-router-dom';
import { FaUserCircle, FaChevronRight } from 'react-icons/fa';

const AdminSidebar = ({ admin, onLogout }) => {
  const location = useLocation();

  return (
    <div className="h-screen w-72 bg-[#f5f7fa] flex flex-col justify-between shadow-lg">
      <div>
        {/* Logo and App Name */}
        <div className="flex items-center gap-3 p-6">
          <img src="/logo.png" alt="Logo" className="w-12 h-12 rounded-full" />
          <span className="text-3xl font-bold">BookShelf</span>
        </div>
        {/* Admin Info */}
        <div className="flex flex-col items-center mb-4">
          <FaUserCircle className="text-5xl text-gray-400" />
          <span className="font-bold mt-2">{admin?.name || 'Admin'}</span>
          <span className="text-gray-500 text-sm">{admin?.email}</span>
        </div>
        {/* Menu */}
        <div className="px-6 mt-8 flex flex-col gap-2">
          <Link
            to="/admin/dashboard"
            className={`block px-4 py-3 rounded-lg font-medium ${
              location.pathname === '/admin/dashboard'
                ? 'bg-green-100 text-green-900'
                : 'hover:bg-gray-100'
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/admin/books"
            className="block px-4 py-3 rounded-lg font-medium flex items-center justify-between hover:bg-gray-100"
          >
            Books Management <FaChevronRight />
          </Link>
        </div>
      </div>
      {/* Logout Button */}
      <div className="px-6 mb-8">
        <button
          onClick={onLogout}
          className="w-full bg-[#166534] hover:bg-green-800 text-white font-semibold px-6 py-2 rounded transition-colors duration-200"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar; 