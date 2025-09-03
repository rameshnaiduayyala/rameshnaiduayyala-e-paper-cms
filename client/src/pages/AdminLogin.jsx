import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import api from "../api/axios";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/users/login", { email, password });
      login(response.data.token);
      toast.success("Login successful!");
      navigate("/admin/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed!");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-200"
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src="/HindiMilapLogo1.png"
            alt="Hindi Milap Logo"
            className="h-16 w-auto"
          />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-8">
          Admin Login
        </h2>

        {/* Email Input */}
        <div className="mb-5">
          <label className="block mb-2 text-gray-700 font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="Enter your email"
            required
          />
        </div>

        {/* Password Input */}
        <div className="mb-6">
          <label className="block mb-2 text-gray-700 font-medium">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="Enter your password"
            required
          />
        </div>

        {/* Login Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 font-medium text-lg transition"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
