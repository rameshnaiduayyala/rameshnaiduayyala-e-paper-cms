import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import ProtectedRoute from "../components/ProtectedRoute";

// Lazy load layouts
const PublicLayout = lazy(() => import("../components/layouts/PublicLayout"));
const AdminLayout = lazy(() => import("../components/layouts/AdminLayout"));

// Lazy load pages
const Home = lazy(() => import("../pages/Home"));
const PaperViewer = lazy(() => import("../pages/PaperViewer"));
const AdminLogin = lazy(() => import("../pages/AdminLogin"));
const AdminDashboard = lazy(() => import("../pages/AdminDashboard"));
const AddPapers = lazy(() => import("../pages/adminPages/AddPapers"));
const UserList = lazy(() => import("../pages/adminPages/users/UserList"));
const AddUser = lazy(() => import("../pages/adminPages/AddUser"));

const AppRoutes = () => {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        </div>
      }
    >
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="/paper/:id" element={<PaperViewer />} />
          <Route path="/login" element={<AdminLogin />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>

        {/* Admin routes */}
        <Route path="/admin" element={<AdminLayout />}>
          {/* Protected admin pages → only "admin" role allowed */}
          <Route element={<ProtectedRoute />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="add-papers" element={<AddPapers />} />
            <Route path="userList" element={<UserList />} />
            <Route path="add-user" element={<AddUser />} />
          </Route>

          {/* Fallback for unknown admin routes */}
          <Route path="*" element={<Navigate to="/unauthorized" />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
