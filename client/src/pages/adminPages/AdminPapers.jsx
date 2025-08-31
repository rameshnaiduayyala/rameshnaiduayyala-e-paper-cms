import { useEffect, useState } from "react";
import api from "../../api/axios";
import { toast } from "react-toastify";

const AdminPapers = () => {
  const [papers, setPapers] = useState([]);

  const fetchEpapers = async () => {
    try {
      const response = await api.get("/papers/admin");
      setPapers(response.data);
    } catch (error) {
      console.error("Error fetching papers:", error);
    }
  };

  const publishPaper = async (id) => {
    try {
      await api.post(`/papers/admin/publish/${id}`, { published: true });
      toast.success("Paper published successfully");
      fetchEpapers();
    } catch (error) {
      console.error("Error publishing paper:", error);
      toast.error("Failed to publish paper");
    }
  };

  const unPublishPaper = async (id) => {
    try {
      await api.post(`/papers/admin/publish/${id}`, { published: false });
      toast.success("Paper unpublished successfully");
      fetchEpapers();
    } catch (error) {
      console.error("Error unpublishing paper:", error);
      toast.error("Failed to unpublish paper");
    }
  };

  useEffect(() => {
    fetchEpapers();
  }, []);

  return (
    <div className="space-y-6 bg-gray-100">
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow-sm">
          <div className="text-sm text-gray-500">Total Papers</div>
          <div className="text-2xl font-bold text-blue-500">{papers.length}</div>
        </div>
        <div className="bg-white p-4 rounded shadow-sm">
          <div className="text-sm text-gray-500">Published</div>
          <div className="text-2xl font-bold text-green-500">{papers.filter((paper) => paper.published).length}</div>
        </div>
        <div className="bg-white p-4 rounded shadow-sm">
          <div className="text-sm text-gray-500">Drafts</div>
          <div className="text-2xl font-bold text-red-500">{papers.filter((paper) => !paper.published).length}</div>
        </div>
      </section>

      <section className="bg-white rounded shadow-sm overflow-hidden ">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-medium">Papers</h3>
          <div className="text-sm text-gray-500">
            Showing {papers.length} results
          </div>
        </div>

        <table className="min-w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-sm font-medium">Title</th>
              <th className="px-4 py-3 text-sm font-medium">Date</th>
              <th className="px-4 py-3 text-sm font-medium">Status</th>
              <th className="px-4 py-3 text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {papers.map((p) => (
              <tr key={p.id} className="border-t even:bg-white odd:bg-gray-50">
                <td className="px-4 py-3">{p.title}</td>
                <td className="px-4 py-3">{p.date}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      p.published === true
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-white"
                    }`}
                  >
                    {p.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => alert("Toggle status for " + p.title)}
                      className="px-3 py-1 text-sm border rounded"
                    >
                      Area Maps
                    </button>
                    <button
                      onClick={() => alert("Delete " + p.title)}
                      className="px-3 py-1 text-sm border rounded text-red-600"
                    >
                      Delete
                    </button>

                    {p.published === true ? (
                      <button
                        onClick={() => unPublishPaper(p.id)}
                        className="px-3 py-1 text-sm border rounded"
                      >
                        Un publish
                      </button>
                    ) : (
                      <button
                        onClick={() => publishPaper(p.id)}
                        className="px-3 py-1 text-sm border rounded"
                      >
                        Publish
                      </button>
                    )}
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

export default AdminPapers;
