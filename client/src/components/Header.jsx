import { useState } from "react";
import { Menu, X, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Header = ({ onDateChange }) => {
  const navigator = useNavigate();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    onDateChange?.(newDate);
  };

  return (
    <header className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <img
              src="/HindiMilapLogo1.png"
              alt="Hindi Milap Logo"
              className="h-10 w-auto"
            />
          </div>

          <div className="flex items-center space-x-6">
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              max={new Date().toISOString().split("T")[0]}
s              className="border border-gray-300 p-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <User
              className="w-6 h-6 text-gray-600 cursor-pointer hover:text-blue-600"
              onClick={() => {
                navigator("/admin/login");
              }}
            />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            {mobileMenu ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenu && (
        <div className="md:hidden bg-white shadow-md">
          <nav className="flex flex-col p-4 space-y-3">
            <a href="/" className="text-gray-700 hover:text-blue-600">
              Home
            </a>
            <a href="/archives" className="text-gray-700 hover:text-blue-600">
              Archives
            </a>
            <a href="/about" className="text-gray-700 hover:text-blue-600">
              About
            </a>
            <a href="/contact" className="text-gray-700 hover:text-blue-600">
              Contact
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
