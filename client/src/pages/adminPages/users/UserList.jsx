import { useEffect, useState } from "react";
import api from "../../../api/axios";

const UserList = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <section className="bg-white rounded shadow-sm overflow-hidden ">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-medium">List of Users</h3>
          <div className="text-sm text-gray-500">
            Showing {users.length} results
          </div>
        </div>

        <table className="min-w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-sm font-medium">Name</th>
              <th className="px-4 py-3 text-sm font-medium">Email</th>
              <th className="px-4 py-3 text-sm font-medium">Status</th>
              <th className="px-4 py-3 text-sm font-medium">Created Date</th>
              <th className="px-4 py-3 text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((p) => (
              <tr key={p.id} className="border-t even:bg-white odd:bg-gray-50">
                <td className="px-4 py-3">{p.username}</td>
                <td className="px-4 py-3">{p.email}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      p.status === true
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-white"
                    }`}
                  >
                    {p.status ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3">{p.createdAt}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => alert("Toggle status for " + p.username)}
                      className="px-3 py-1 text-sm border rounded"
                    >
                     Edit
                    </button>
                    <button
                      onClick={() => alert("Delete " + p.username)}
                      className="px-3 py-1 text-sm border rounded text-red-600"
                    >
                      Delete
                    </button>

                    {/* {p.published === true ? (
                      <button
                        onClick={() => activateUser(p.id)}
                        className="px-3 py-1 text-sm border rounded"
                      >
                        Acivate
                      </button>
                    ) : (
                      <button
                        onClick={() => inActivateUser(p.id)}
                        className="px-3 py-1 text-sm border rounded"
                      >
                        InActivate
                      </button>
                    )} */}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default UserList;
