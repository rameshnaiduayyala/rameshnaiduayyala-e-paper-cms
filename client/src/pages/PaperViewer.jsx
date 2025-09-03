// src/components/PaperViewer.jsx
import { useEffect, useState } from "react";
import api from "../api/axios";
import { ServiceUrl } from "../settings";
import { useParams } from "react-router-dom";

const PaperViewer = () => {
    const { id } = useParams();
  const [pages, setPages] = useState([]);
  const [activePage, setActivePage] = useState(null);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const response = await api(`/papers/${id}/pages`);
        setPages(response.data);
        if (response.data.length > 0) {
          setActivePage(response.data[0].pageNumber);
        }
      } catch (err) {
        console.error("❌ Failed to fetch pages:", err);
      }
    };
    fetchPages();
  }, [id]);

  return (
    <div className="flex min-h-screen mt-16">
      {/* Sidebar (scrollable thumbnails using images) */}
      <aside className="w-44 bg-white shadow-xl border-r p-4 overflow-y-auto fixed top-16 bottom-0">
        <h2 className="text-sm font-semibold mb-3 text-gray-700 uppercase tracking-wide">
          Pages
        </h2>
        <div className="space-y-4 pb-20">
          {pages.map((page) => (
            <div
              key={page.id}
              className={`border rounded-lg overflow-hidden cursor-pointer transition 
                ${
                  activePage === page.pageNumber
                    ? "ring-2 ring-indigo-500"
                    : "hover:shadow-md"
                }`}
              onClick={() => {
                const el = document.getElementById(`page-${page.pageNumber}`);
                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                setActivePage(page.pageNumber);
              }}
            >
              {/* Thumbnail (always image for performance) */}
              <div className="relative w-full aspect-[8.5/11] bg-gray-50 overflow-hidden flex items-center justify-center">
                <img
                  src={`${ServiceUrl}${page.imagePath}`}
                  alt={`Thumbnail ${page.pageNumber}`}
                  className="object-cover w-full h-full"
                />
              </div>
              <div
                className={`text-center text-xs py-1 ${
                  activePage === page.pageNumber
                    ? "bg-indigo-100 text-indigo-700 font-semibold"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                Page {page.pageNumber}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Main viewer (prefer PDF, fallback to image) */}
      <main className="flex-1 ml-60 flex flex-col items-center space-y-8">
        {pages.length > 0 ? (
          pages.map((page) => (
            <div
              key={page.id}
              id={`page-${page.pageNumber}`}
              className="border rounded-lg shadow-lg"
            >
              {page.pdfPagePath ? (
                <iframe
                  src={`${ServiceUrl}/uploads/${page.pdfPagePath}#toolbar=0&navpanes=0&scrollbar=0`}
                  className="w-[890px] h-[1390px] border-0"
                  title={`Page ${page.pageNumber}`}
                />
              ) : (
                <img
                  src={`${ServiceUrl}${page.imagePath}`}
                  alt={`Page ${page.pageNumber}`}
                  className="w-[890px] border-0"
                />
              )}
              <div className="text-center py-3 text-sm text-gray-500 bg-gray-50 border-t">
                Page {page.pageNumber}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">Loading pages...</p>
        )}
      </main>
    </div>
  );
};

export default PaperViewer;
