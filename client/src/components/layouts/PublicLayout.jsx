// src/layouts/PublicLayout.tsx
import { Outlet } from "react-router-dom";
import { useState } from "react";
import Header from "../Header";

const PublicLayout = () => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header onDateChange={setSelectedDate} />
      <main className="flex-grow container mt-4">
        <Outlet context={{ selectedDate }} />   {/* ✅ exposes to Home */}
      </main>
    </div>
  );
};

export default PublicLayout;
