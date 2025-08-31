// src/layouts/PublicLayout.tsx
import { Outlet } from "react-router-dom";
import Header from "../Header";

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mt-4">
        <Outlet />
      </main>
    </div>
  );
};

export default PublicLayout;
