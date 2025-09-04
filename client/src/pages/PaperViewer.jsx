import { useEffect, useState } from "react";
import api from "../api/axios";
import { ServiceUrl } from "../settings";
import { useParams } from "react-router-dom";
import PdfViewer from "../components/PdfComp";

const PaperViewer = () => {
  const { id } = useParams();
  const [paper, setPaper] = useState([]);

  useEffect(() => {
    const fetchPaper = async () => {
      try {
        const res = await api.get(`/papers/one/${id}`);
        setPaper(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch paper:", err);
      }
    };
    fetchPaper();
  }, [id]);

  return (
    <div className="h-screen w-full pt-16 bg-white overflow-x-hidden">
      {paper[0]?.pdfPath ? (
        <PdfViewer fileUrl={`${ServiceUrl}/uploads/${paper[0]?.pdfPath}`} />
      ) : (
        <div className="flex justify-center items-center h-full">
          <p className="text-gray-500 text-lg">Loading PDF...</p>
        </div>
      )}
    </div>
  );
};

export default PaperViewer;
