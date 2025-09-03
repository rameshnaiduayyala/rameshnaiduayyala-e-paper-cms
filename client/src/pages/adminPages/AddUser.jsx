import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { toast } from "react-toastify";

const AddUser = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/users/register", { username, email, password, role });
      toast.success("User created successfully!");
      navigate("/admin/userList");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error creating user");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg border border-gray-200"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Add New User
        </h2>

        {/* Username */}
        <div className="mb-5">
          <label className="block mb-2 text-gray-700 font-medium">Name</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="Enter full name"
            required
          />
        </div>

        {/* Email */}
        <div className="mb-5">
          <label className="block mb-2 text-gray-700 font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="Enter email address"
            required
          />
        </div>

        {/* Password */}
        <div className="mb-5">
          <label className="block mb-2 text-gray-700 font-medium">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="Enter password"
            required
          />
        </div>

        {/* Role */}
        <div className="mb-6">
          <label className="block mb-2 text-gray-700 font-medium">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            <option value="admin">Admin</option>
            <option value="user">user</option>
            <option value="editor">Editor</option>
            <option value="author">Author</option>
            <option value="contributor">Contributor</option>
            <option value="subscriber">Subscriber</option>
            <option value="maintainer">Maintainer</option>
            <option value="manager">Manager</option>
            <option value="publisher">Publisher</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 font-medium text-lg transition"
        >
          Create User
        </button>
      </form>
    </div>
  );
};

export default AddUser;
