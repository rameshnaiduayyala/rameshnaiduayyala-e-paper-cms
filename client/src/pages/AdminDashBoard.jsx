import { useNavigate } from "react-router-dom";
import AdminPapers from "./adminPages/AdminPapers";

export default function EPapersAdminDashboard() {
  const navigators = useNavigate();

  const NavigateAddPaperScreen = () => {
    navigators("/admin/add-papers");
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <div className="flex">
        {/* Sidebar */}
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
            <button className="w-full text-left px-3 py-2 rounded hover:bg-gray-50">
              Dashboard
            </button>
            <button className="w-full text-left px-3 py-2 rounded hover:bg-gray-50">
              Papers
            </button>
            <button className="w-full text-left px-3 py-2 rounded hover:bg-gray-50">
              Users
            </button>
            <button className="w-full text-left px-3 py-2 rounded hover:bg-gray-50">
              Settings
            </button>
          </nav>
        </aside>

        <main className="flex-1 p-6">
          {/* Header */}
          <header className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold">Dashboard</h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => NavigateAddPaperScreen()}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                + Add Publication
              </button>

              <div className="flex items-center gap-2 bg-white px-3 py-2 rounded border">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2 5a2 2 0 012-2h3.5a1 1 0 01.7.3L12 6h4a2 2 0 012 2v6a2 2 0 01-2 2H6l-4-9z" />
                </svg>
                <span className="text-sm">Admin</span>
              </div>
            </div>
          </header>

          {/* Table */}
          <section className="bg-white">
            <AdminPapers />
          </section>
        </main>
      </div>
    </div>
  );
}
