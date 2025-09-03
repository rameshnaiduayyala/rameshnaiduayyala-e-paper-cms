// src/components/PaperViewer.jsx
import { useEffect, useState, useRef } from "react";
import api from "../api/axios";
import { ServiceUrl } from "../settings";
import { useParams } from "react-router-dom";
import { Menu, X } from "lucide-react";

const PaperViewer = () => {
  const { id } = useParams();
  const [pages, setPages] = useState([]);
  const [activePage, setActivePage] = useState(null);
  const [visiblePages, setVisiblePages] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const observer = useRef(null);

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

  useEffect(() => {
    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisiblePages((prev) => ({
              ...prev,
              [entry.target.dataset.page]: true,
            }));
          }
        });
      },
      { rootMargin: "200px 0px" }
    );

    return () => observer.current?.disconnect();
  }, []);

  useEffect(() => {
    if (pages.length > 0 && observer.current) {
      pages.forEach((p) => {
        const el = document.getElementById(`page-${p.pageNumber}`);
        if (el) observer.current.observe(el);
      });
    }
  }, [pages]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen pt-16">
      {/* Sidebar toggle button (mobile only) */}
      <button
        className="md:hidden fixed top-20 left-4 z-50 bg-white shadow-md p-2 rounded-md"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-44 bg-white shadow-xl border-r p-4 overflow-y-auto transform transition-transform duration-300 ease-in-out
          ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
      >
        <h2 className="text-sm font-semibold mb-3 text-gray-700 uppercase tracking-wide">
          Pages
        </h2>
        <div className="space-y-4 pb-20">
          {pages.map((page) => (
            <div
              key={page.id}
              className={`border rounded-lg overflow-hidden cursor-pointer transition ${
                activePage === page.pageNumber
                  ? "ring-2 ring-indigo-500"
                  : "hover:shadow-md"
              }`}
              onClick={() => {
                const el = document.getElementById(`page-${page.pageNumber}`);
                if (el) el.scrollIntoView({ behavior: "smooth" });
                setActivePage(page.pageNumber);
              }}
            >
              <div className="relative w-full bg-gray-50 flex items-center justify-center">
                <img
                  src={`${ServiceUrl}${page.imagePath}`}
                  alt={`Thumbnail ${page.pageNumber}`}
                  className="object-cover w-full h-full"
                  loading="lazy"
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

      {/* Main viewer */}
      <main className="flex-1 md:ml-64 flex flex-col items-center space-y-8">
        {pages.length > 0 ? (
          pages.map((page) => (
            <div
              key={page.id}
              id={`page-${page.pageNumber}`}
              data-page={page.pageNumber}
              className=" shadow-lg w-full md:w-[850px] md:h-[1340px] h-[500px] overflow-hidden"
            >
              {visiblePages[page.pageNumber] ? (
                <iframe
                  src={`${ServiceUrl}/uploads/${page.pdfPagePath}#toolbar=0&navpanes=0&scrollbar=0`}
                  className="w-full h-full border-0"
                  title={`Page ${page.pageNumber}`}
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-[500px] bg-gray-100 animate-pulse flex items-center justify-center text-gray-400">
                  Loading...
                </div>
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
