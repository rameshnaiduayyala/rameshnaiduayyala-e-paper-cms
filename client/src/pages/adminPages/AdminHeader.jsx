import { useNavigate } from "react-router-dom";

const AdminHeader = () => {
  const navigators = useNavigate();

  const NavigateAddUserScreen = () => {
    navigators("/admin/userList");
  };

  return (
    <aside className="w-64 bg-white border-r hidden md:block h-screen">
      <div className="p-4 border-b">
        <div className="flex items-center">
          <img
            src="/HindiMilapLogo1.png"
            alt="Hindi Milap Logo"
            className="h-10 w-auto"
          />
        </div>
        <p className="text-sm text-gray-500">Manage publications</p>
      </div>
      <nav className="p-4 space-y-1">
        <button className="w-full text-left px-3 py-2 rounded hover:bg-gray-50" onClick={() => navigators("/admin/dashboard")}>
          Dashboard
        </button>
        <button className="w-full text-left px-3 py-2 rounded hover:bg-gray-50">
          Papers
        </button>
        <button
          className="w-full text-left px-3 py-2 rounded hover:bg-gray-50"
          onClick={() => NavigateAddUserScreen()}
        >
          Users
        </button>
        <button className="w-full text-left px-3 py-2 rounded hover:bg-gray-50">
          Settings
        </button>
      </nav>
    </aside>
  );
};

export default AdminHeader;
