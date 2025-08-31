import { useState } from "react";
import { toast } from "react-toastify";
import api from "../../api/axios";

const AddPapers = () => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Upload file
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!title || !date || !file) {
      toast.error("Fill all fields and select a PDF file");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("date", date);
    formData.append("pdf", file); // MUST match Multer field name

    try {
      setLoading(true);
      const res = await api.post("/papers", formData);
      console.log(res.data);
      toast.success("Paper uploaded successfully!");
      setTitle("");
      setDate("");
      setFile(null);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Upload Form */}
      <form
        onSubmit={handleUpload}
        className="bg-white p-6 rounded shadow-md max-w-lg mx-auto mb-8"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Upload Newspaper PDF</h2>

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        />

        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="w-full mb-4"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded text-white ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Uploading..." : "Upload PDF"}
        </button>
      </form>
    </div>
  );
};

export default AddPapers;
