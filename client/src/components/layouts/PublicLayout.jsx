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
      <main className="flex-grow">
        <Outlet context={{ selectedDate }} />
      </main>
    </div>
  );
};

export default PublicLayout;
