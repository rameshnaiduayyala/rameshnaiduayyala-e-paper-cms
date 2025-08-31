import { useState } from "react";
import { toast } from "react-toastify";
import api from "../../api/axios";

const AddPapers = () => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

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
    formData.append("pdf", file);

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
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6 flex items-center justify-center">
      <form
        onSubmit={handleUpload}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg border border-gray-200"
      >
        {/* Title */}
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">
          Upload Newspaper PDF
        </h2>

        {/* Title Input */}
        <div className="mb-5">
          <label className="block mb-2 text-gray-700 font-medium">Title</label>
          <input
            type="text"
            placeholder="Enter paper title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
        </div>

        {/* Date Input */}
        <div className="mb-5">
          <label className="block mb-2 text-gray-700 font-medium">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
        </div>

        {/* File Input */}
        <div className="mb-6">
          <label className="block mb-2 text-gray-700 font-medium">PDF File</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="w-full border border-gray-300 p-3 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 transition file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
            required
          />
        </div>

        {/* Upload Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white font-medium text-lg transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Uploading..." : "Upload PDF"}
        </button>
      </form>
    </div>
  );
};

export default AddPapers;
