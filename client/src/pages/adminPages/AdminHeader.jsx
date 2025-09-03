import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const AdminHeader = () => {
  const { logout, role } = useAuth();
  const navigate = useNavigate();

  return (
    <aside className="w-64 bg-white border-r hidden md:block h-screen">
      {/* Logo + Info */}
      <div className="p-4 border-b">
        <div className="flex items-center">
          <img
            src="/HindiMilapLogo1.png"
            alt="Hindi Milap Logo"
            className="h-10 w-auto"
          />
        </div>
        <p className="text-sm text-gray-500">Manage publications</p>
        <p className="text-xs text-gray-400 mt-1">
          Role: <span className="font-medium">{role}</span>
        </p>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1">
        {/* Common for all roles */}
        <button
          className="w-full text-left px-3 py-2 rounded hover:bg-gray-50"
          onClick={() => navigate("/admin/dashboard")}
        >
          Dashboard
        </button>

        <button
          className="w-full text-left px-3 py-2 rounded hover:bg-gray-50"
          onClick={() => navigate("/admin/add-papers")}
        >
          Papers
        </button>

        {/* Admin only */}
        {role === "admin" && (
          <>
            <button
              className="w-full text-left px-3 py-2 rounded hover:bg-gray-50"
              onClick={() => navigate("/admin/userList")}
            >
              Users
            </button>

            <button
              className="w-full text-left px-3 py-2 rounded hover:bg-gray-50"
              onClick={() => navigate("/admin/settings")}
            >
              Settings
            </button>
          </>
        )}

        {/* Logout */}
        <button
          className="w-full text-left px-3 py-2 rounded hover:bg-gray-50 text-red-600"
          onClick={logout}
        >
          Logout
        </button>
      </nav>
    </aside>
  );
};

export default AdminHeader;
